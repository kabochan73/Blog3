<?php

use App\Models\Post;
use App\Models\Tag;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

describe('index', function () {
    it('returns 401 when unauthenticated', function () {
        $this->getJson('/api/admin/posts')->assertStatus(401);
    });

    it('returns posts newest first including drafts', function () {
        Sanctum::actingAs(User::factory()->create());
        $older = Post::factory()->create(['created_at' => now()->subDay()]);
        $newer = Post::factory()->draft()->create(['created_at' => now()]);

        $response = $this->getJson('/api/admin/posts');

        $response->assertOk();
        expect($response->json('data.*.slug'))->toBe([$newer->slug, $older->slug]);
    });

    it('filters by status', function () {
        Sanctum::actingAs(User::factory()->create());
        $published = Post::factory()->create();
        Post::factory()->draft()->create();

        $response = $this->getJson('/api/admin/posts?status=published');

        $response->assertOk();
        expect($response->json('data.*.slug'))->toBe([$published->slug]);
    });

    it('filters by tag', function () {
        Sanctum::actingAs(User::factory()->create());
        $tag = Tag::factory()->create(['name' => 'laravel']);
        $tagged = Post::factory()->create();
        $tagged->tags()->attach($tag);
        Post::factory()->create();

        $response = $this->getJson('/api/admin/posts?tag=laravel');

        $response->assertOk();
        expect($response->json('data.*.slug'))->toBe([$tagged->slug]);
    });
});

describe('show', function () {
    it('returns 401 when unauthenticated', function () {
        $post = Post::factory()->create();

        $this->getJson("/api/admin/posts/{$post->slug}")->assertStatus(401);
    });

    it('returns a draft post by slug', function () {
        Sanctum::actingAs(User::factory()->create());
        $post = Post::factory()->draft()->create();

        $response = $this->getJson("/api/admin/posts/{$post->slug}");

        $response->assertOk()->assertJsonFragment(['slug' => $post->slug, 'status' => 'draft']);
    });

    it('returns 404 for an unknown slug', function () {
        Sanctum::actingAs(User::factory()->create());

        $this->getJson('/api/admin/posts/unknown-slug')->assertStatus(404);
    });
});

describe('store', function () {
    function validPostPayload(array $overrides = []): array
    {
        return array_merge([
            'title' => 'タイトル',
            'slug' => 'example-post',
            'status' => 'published',
            'tags' => [],
            'excerpt' => '概要',
            'content' => '本文',
        ], $overrides);
    }

    it('returns 401 when unauthenticated', function () {
        $this->postJson('/api/admin/posts', validPostPayload())->assertStatus(401);
    });

    it('creates a post with tags', function () {
        Sanctum::actingAs(User::factory()->create());
        Tag::factory()->create(['name' => 'laravel']);
        Tag::factory()->create(['name' => 'nextjs']);

        $response = $this->postJson('/api/admin/posts', validPostPayload(['tags' => ['laravel', 'nextjs']]));

        $response->assertCreated()->assertJsonFragment(['slug' => 'example-post']);
        expect($response->json('tags'))->toBe(['laravel', 'nextjs']);
        expect(Post::where('slug', 'example-post')->first()?->tags()->count())->toBe(2);
    });

    it('creates a post without tags', function () {
        Sanctum::actingAs(User::factory()->create());

        $response = $this->postJson('/api/admin/posts', validPostPayload());

        $response->assertCreated();
        expect(Post::where('slug', 'example-post')->exists())->toBeTrue();
    });

    it('returns 422 when required fields are missing', function () {
        Sanctum::actingAs(User::factory()->create());

        $this->postJson('/api/admin/posts', [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['title', 'slug', 'status', 'content']);
    });

    it('returns 422 when the slug format is invalid', function () {
        Sanctum::actingAs(User::factory()->create());

        $this->postJson('/api/admin/posts', validPostPayload(['slug' => 'Invalid Slug!']))
            ->assertStatus(422)
            ->assertJsonValidationErrors(['slug']);
    });

    it('returns 422 when the slug already exists', function () {
        Sanctum::actingAs(User::factory()->create());
        Post::factory()->create(['slug' => 'example-post']);

        $this->postJson('/api/admin/posts', validPostPayload())
            ->assertStatus(422)
            ->assertJsonValidationErrors(['slug']);
    });

    it('returns 422 when a tag name does not exist', function () {
        Sanctum::actingAs(User::factory()->create());

        $this->postJson('/api/admin/posts', validPostPayload(['tags' => ['unknown-tag']]))
            ->assertStatus(422)
            ->assertJsonValidationErrors(['tags.0']);
    });
});
