<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Http\Resources\PostAdminResource;
use App\Models\Post;
use App\Models\Tag;
use App\Services\RevalidationService;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function __construct(private readonly RevalidationService $revalidationService) {}

    public function index(Request $request)
    {
        $query = Post::query()->with('tags');

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        if ($tag = $request->query('tag')) {
            $query->whereHas('tags', fn ($q) => $q->where('name', $tag));
        }

        $perPage = (int) $request->query('per_page', 20);

        return PostAdminResource::collection($query->latest()->paginate($perPage));
    }

    public function show(Post $post)
    {
        return new PostAdminResource($post->load('tags'));
    }

    public function store(StorePostRequest $request)
    {
        $data = $request->validated();
        $tagNames = $data['tags'] ?? [];
        unset($data['tags']);

        $post = Post::create($data);

        if (! empty($tagNames)) {
            $post->tags()->sync(Tag::whereIn('name', $tagNames)->pluck('id'));
        }

        $post->load('tags');
        $this->revalidationService->postCreatedOrDeleted($post);

        return (new PostAdminResource($post))->response()->setStatusCode(201);
    }

    public function update(UpdatePostRequest $request, Post $post)
    {
        $oldSlug = $post->slug;
        $data = $request->validated();
        $tagNames = $data['tags'] ?? [];
        unset($data['tags']);

        $post->update($data);
        $post->tags()->sync(Tag::whereIn('name', $tagNames)->pluck('id'));

        $post->load('tags');
        $this->revalidationService->postUpdated($post, $oldSlug);

        return new PostAdminResource($post);
    }

    public function destroy(Post $post)
    {
        $post->load('tags');
        $post->delete();

        $this->revalidationService->postCreatedOrDeleted($post);

        return response()->noContent();
    }
}
