<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $isDetail = $request->routeIs('posts.show');

        return [
            'slug' => $this->slug,
            'title' => $this->title,
            'thumbnail' => $this->thumbnail,
            'tags' => $this->tags->pluck('name'),
            'created_at' => $this->created_at,
            'excerpt' => $this->when(! $isDetail, $this->excerpt),
            'content' => $this->when($isDetail, $this->content),
            'updated_at' => $this->when($isDetail, $this->updated_at),
        ];
    }
}
