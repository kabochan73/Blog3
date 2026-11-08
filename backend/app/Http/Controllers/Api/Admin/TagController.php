<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTagRequest;
use App\Http\Requests\UpdateTagRequest;
use App\Http\Resources\TagAdminResource;
use App\Models\Tag;

class TagController extends Controller
{
    public function index()
    {
        return TagAdminResource::collection(Tag::orderBy('name')->get());
    }

    public function store(StoreTagRequest $request)
    {
        $tag = Tag::create($request->validated());

        return (new TagAdminResource($tag))->response()->setStatusCode(201);
    }

    public function update(UpdateTagRequest $request, Tag $tag)
    {
        $tag->update($request->validated());

        return new TagAdminResource($tag);
    }

    public function destroy(Tag $tag)
    {
        $tag->delete();

        return response()->noContent();
    }
}
