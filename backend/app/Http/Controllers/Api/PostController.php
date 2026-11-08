<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PostResource;
use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $query = Post::query()->with('tags')->where('status', 'published');

        if ($tag = $request->query('tag')) {
            $query->whereHas('tags', fn ($q) => $q->where('name', $tag));
        }

        $perPage = (int) $request->query('per_page', 20);

        return PostResource::collection($query->latest()->paginate($perPage));
    }

    public function show(Post $post)
    {
        abort_if($post->status !== 'published', 404);

        return new PostResource($post->load('tags'));
    }
}
