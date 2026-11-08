<?php

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;

beforeEach(function () {
    Storage::fake('public');
});

it('returns 401 when unauthenticated', function () {
    $file = UploadedFile::fake()->image('photo.jpg', 800, 600);

    $this->postJson('/api/admin/images', ['image' => $file])->assertStatus(401);
});

it('stores the uploaded image and returns its public url', function () {
    Sanctum::actingAs(User::factory()->create());
    $file = UploadedFile::fake()->image('photo.jpg', 800, 600);

    $response = $this->postJson('/api/admin/images', ['image' => $file]);

    $response->assertCreated()->assertJsonStructure(['url']);
    $url = $response->json('url');
    expect($url)->toStartWith('/storage/images/');

    $filename = basename($url);
    Storage::disk('public')->assertExists("images/{$filename}");
});

it('returns 422 for an unsupported file type', function () {
    Sanctum::actingAs(User::factory()->create());
    $file = UploadedFile::fake()->create('document.pdf', 100, 'application/pdf');

    $this->postJson('/api/admin/images', ['image' => $file])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['image']);
});

it('returns 422 when the file exceeds 5MB', function () {
    Sanctum::actingAs(User::factory()->create());
    $file = UploadedFile::fake()->create('photo.jpg', 5121);

    $this->postJson('/api/admin/images', ['image' => $file])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['image']);
});

it('returns 422 when no file is provided', function () {
    Sanctum::actingAs(User::factory()->create());

    $this->postJson('/api/admin/images', [])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['image']);
});
