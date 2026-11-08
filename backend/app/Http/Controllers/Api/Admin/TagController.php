<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTagRequest;
use App\Http\Requests\UpdateTagRequest;
use App\Http\Resources\TagAdminResource;
use App\Models\Tag;
use App\Services\RevalidationService;

class TagController extends Controller
{
    public function __construct(private readonly RevalidationService $revalidationService) {}

    public function index()
    {
        return TagAdminResource::collection(Tag::withCount('posts')->orderBy('name')->get());
    }

    public function store(StoreTagRequest $request)
    {
        $tag = Tag::create($request->validated());

        $this->revalidationService->tagChanged($tag->name);

        return (new TagAdminResource($tag->loadCount('posts')))->response()->setStatusCode(201);
    }

    public function update(UpdateTagRequest $request, Tag $tag)
    {
        $oldName = $tag->name;
        $tag->update($request->validated());

        $this->revalidationService->tagChanged($tag->name, $oldName);

        return new TagAdminResource($tag->loadCount('posts'));
    }

    public function destroy(Tag $tag)
    {
        $name = $tag->name;
        $tag->delete();

        $this->revalidationService->tagChanged($name);

        return response()->noContent();
    }
}
