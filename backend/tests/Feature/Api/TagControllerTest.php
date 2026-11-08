<?php

use App\Models\Post;
use App\Models\Tag;

it('returns all tags ordered by name, including ones with no posts', function () {
    Tag::factory()->create(['name' => 'laravel']);
    Tag::factory()->create(['name' => 'docker']);

    $response = $this->getJson('/api/tags');

    $response->assertOk();
    expect($response->json('*.name'))->toBe(['docker', 'laravel']);
});

it('counts only published posts', function () {
    $tag = Tag::factory()->create(['name' => 'laravel']);
    $published = Post::factory()->count(2)->create();
    $draft = Post::factory()->draft()->create();
    $tag->posts()->attach($published->pluck('id'));
    $tag->posts()->attach($draft->id);

    $response = $this->getJson('/api/tags');

    $response->assertOk()->assertJsonFragment(['name' => 'laravel', 'count' => 2]);
});

it('returns 0 for a tag not attached to any post', function () {
    Tag::factory()->create(['name' => 'unused']);

    $response = $this->getJson('/api/tags');

    $response->assertOk()->assertJsonFragment(['name' => 'unused', 'count' => 0]);
});
