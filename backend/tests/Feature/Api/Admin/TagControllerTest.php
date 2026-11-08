<?php

use App\Models\Tag;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

describe('index', function () {
    it('returns 401 when unauthenticated', function () {
        $this->getJson('/api/admin/tags')->assertStatus(401);
    });

    it('returns tags ordered by name', function () {
        Sanctum::actingAs(User::factory()->create());
        Tag::factory()->create(['name' => 'laravel']);
        Tag::factory()->create(['name' => 'docker']);

        $response = $this->getJson('/api/admin/tags');

        $response->assertOk();
        expect($response->json('*.name'))->toBe(['docker', 'laravel']);
    });
});

describe('store', function () {
    it('returns 401 when unauthenticated', function () {
        $this->postJson('/api/admin/tags', ['name' => 'laravel'])->assertStatus(401);
    });

    it('creates a tag', function () {
        Sanctum::actingAs(User::factory()->create());

        $response = $this->postJson('/api/admin/tags', ['name' => 'laravel']);

        $response->assertCreated()->assertJsonFragment(['name' => 'laravel']);
        expect(Tag::where('name', 'laravel')->exists())->toBeTrue();
    });

    it('returns 422 when the name is missing', function () {
        Sanctum::actingAs(User::factory()->create());

        $this->postJson('/api/admin/tags', [])->assertStatus(422)->assertJsonValidationErrors(['name']);
    });

    it('returns 422 when the name already exists', function () {
        Sanctum::actingAs(User::factory()->create());
        Tag::factory()->create(['name' => 'laravel']);

        $this->postJson('/api/admin/tags', ['name' => 'laravel'])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    });
});

describe('update', function () {
    it('returns 401 when unauthenticated', function () {
        $tag = Tag::factory()->create();

        $this->putJson("/api/admin/tags/{$tag->id}", ['name' => 'renamed'])->assertStatus(401);
    });

    it('updates the tag name', function () {
        Sanctum::actingAs(User::factory()->create());
        $tag = Tag::factory()->create(['name' => 'laravel']);

        $response = $this->putJson("/api/admin/tags/{$tag->id}", ['name' => 'php']);

        $response->assertOk()->assertJsonFragment(['name' => 'php']);
        expect($tag->fresh()->name)->toBe('php');
    });

    it('allows keeping the same name', function () {
        Sanctum::actingAs(User::factory()->create());
        $tag = Tag::factory()->create(['name' => 'laravel']);

        $this->putJson("/api/admin/tags/{$tag->id}", ['name' => 'laravel'])->assertOk();
    });

    it('returns 422 when the new name is already used by another tag', function () {
        Sanctum::actingAs(User::factory()->create());
        Tag::factory()->create(['name' => 'laravel']);
        $tag = Tag::factory()->create(['name' => 'docker']);

        $this->putJson("/api/admin/tags/{$tag->id}", ['name' => 'laravel'])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    });
});

describe('destroy', function () {
    it('returns 401 when unauthenticated', function () {
        $tag = Tag::factory()->create();

        $this->deleteJson("/api/admin/tags/{$tag->id}")->assertStatus(401);
    });

    it('deletes the tag', function () {
        Sanctum::actingAs(User::factory()->create());
        $tag = Tag::factory()->create();

        $this->deleteJson("/api/admin/tags/{$tag->id}")->assertNoContent();
        expect(Tag::find($tag->id))->toBeNull();
    });
});
