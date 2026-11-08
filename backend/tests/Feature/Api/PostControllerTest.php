<?php

use App\Models\Post;
use App\Models\Tag;

describe('index', function () {
    it('returns only published posts, newest first', function () {
        $published = Post::factory()->create(['created_at' => now()]);
        Post::factory()->draft()->create();

        $response = $this->getJson('/api/posts');

        $response->assertOk();
        expect($response->json('data.*.slug'))->toBe([$published->slug]);
    });

    it('filters by tag', function () {
        $tag = Tag::factory()->create(['name' => 'laravel']);
        $tagged = Post::factory()->create();
        $tagged->tags()->attach($tag);
        Post::factory()->create();

        $response = $this->getJson('/api/posts?tag=laravel');

        $response->assertOk();
        expect($response->json('data.*.slug'))->toBe([$tagged->slug]);
    });

    it('does not include content or updated_at in the list response', function () {
        Post::factory()->create();

        $response = $this->getJson('/api/posts');

        $response->assertOk();
        expect($response->json('data.0'))->toHaveKeys(['slug', 'title', 'thumbnail', 'tags', 'created_at', 'excerpt']);
        expect($response->json('data.0'))->not->toHaveKeys(['content', 'updated_at']);
    });
});

describe('show', function () {
    it('returns a published post with full detail', function () {
        $post = Post::factory()->create();

        $response = $this->getJson("/api/posts/{$post->slug}");

        $response->assertOk();
        expect($response->json())->toHaveKeys(['slug', 'title', 'content', 'thumbnail', 'tags', 'created_at', 'updated_at']);
        expect($response->json())->not->toHaveKeys(['excerpt']);
    });

    it('returns 404 for a draft post', function () {
        $post = Post::factory()->draft()->create();

        $this->getJson("/api/posts/{$post->slug}")->assertStatus(404);
    });

    it('returns 404 for an unknown slug', function () {
        $this->getJson('/api/posts/unknown-slug')->assertStatus(404);
    });
});
