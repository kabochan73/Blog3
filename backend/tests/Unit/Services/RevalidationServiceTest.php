<?php

use App\Models\Post;
use App\Models\Tag;
use App\Services\RevalidationService;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

describe('postCreatedOrDeleted', function () {
    it('revalidates the post list pages, the post itself, the sitemap, and its tags', function () {
        Http::fake([config('services.revalidate.url') => Http::response()]);
        Post::factory()->count(25)->create();
        $tag = Tag::factory()->create(['name' => 'laravel']);
        $post = Post::factory()->create(['slug' => 'example-post']);
        $post->tags()->attach($tag);

        app(RevalidationService::class)->postCreatedOrDeleted($post->load('tags'));

        Http::assertSent(function ($request) {
            expect($request['paths'])->toEqualCanonicalizing([
                '/', '/page/1', '/page/2',
                '/posts/example-post',
                '/sitemap.xml',
                '/tags/laravel', '/tags/laravel/page/1',
            ]);

            return true;
        });
    });

    it('sends an authenticated request to the configured webhook url', function () {
        Http::fake([config('services.revalidate.url') => Http::response()]);
        $post = Post::factory()->create(['slug' => 'example-post']);

        app(RevalidationService::class)->postCreatedOrDeleted($post->load('tags'));

        Http::assertSent(fn ($request) => $request->url() === config('services.revalidate.url')
            && $request->hasHeader('Authorization', 'Bearer '.config('services.revalidate.secret')));
    });
});

describe('postUpdated', function () {
    it('revalidates the new slug and the post list pages but not the sitemap', function () {
        Http::fake([config('services.revalidate.url') => Http::response()]);
        $post = Post::factory()->create(['slug' => 'new-slug']);

        app(RevalidationService::class)->postUpdated($post->load('tags'));

        Http::assertSent(function ($request) {
            expect($request['paths'])->toEqualCanonicalizing(['/posts/new-slug', '/', '/page/1']);

            return true;
        });
    });

    it('also revalidates the old slug when it changed', function () {
        Http::fake([config('services.revalidate.url') => Http::response()]);
        $post = Post::factory()->create(['slug' => 'new-slug']);

        app(RevalidationService::class)->postUpdated($post->load('tags'), oldSlug: 'old-slug');

        Http::assertSent(function ($request) {
            expect($request['paths'])->toContain('/posts/new-slug', '/posts/old-slug');

            return true;
        });
    });

    it('does not duplicate the slug path when it did not change', function () {
        Http::fake([config('services.revalidate.url') => Http::response()]);
        $post = Post::factory()->create(['slug' => 'same-slug']);

        app(RevalidationService::class)->postUpdated($post->load('tags'), oldSlug: 'same-slug');

        Http::assertSent(fn ($request) => count(array_keys(array_count_values($request['paths']), 1, true)) === count($request['paths']));
    });
});

describe('tagChanged', function () {
    it('revalidates the tag list pages', function () {
        Http::fake([config('services.revalidate.url') => Http::response()]);
        $tag = Tag::factory()->create(['name' => 'laravel']);
        $post = Post::factory()->create();
        $post->tags()->attach($tag);

        app(RevalidationService::class)->tagChanged('laravel');

        Http::assertSent(function ($request) {
            expect($request['paths'])->toEqualCanonicalizing(['/tags/laravel', '/tags/laravel/page/1']);

            return true;
        });
    });

    it('also revalidates the old name when renamed', function () {
        Http::fake([config('services.revalidate.url') => Http::response()]);

        app(RevalidationService::class)->tagChanged('new-name', oldName: 'old-name');

        Http::assertSent(function ($request) {
            expect($request['paths'])->toContain('/tags/new-name', '/tags/old-name');

            return true;
        });
    });
});

describe('error handling', function () {
    it('logs a warning and does not throw when the webhook returns an error response', function () {
        Http::fake([config('services.revalidate.url') => Http::response(status: 500)]);
        Log::spy();
        $post = Post::factory()->create();

        app(RevalidationService::class)->postCreatedOrDeleted($post->load('tags'));

        Log::shouldHaveReceived('warning')->once();
    });

    it('logs a warning and does not throw when the request fails to connect', function () {
        Http::fake([config('services.revalidate.url') => fn () => throw new ConnectionException('timed out')]);
        Log::spy();
        $post = Post::factory()->create();

        app(RevalidationService::class)->postCreatedOrDeleted($post->load('tags'));

        Log::shouldHaveReceived('warning')->once();
    });
});
