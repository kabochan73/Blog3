<?php

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('public');
});

it('serves an existing image from the configured disk', function () {
    Storage::disk('public')->put('images/example.jpg', UploadedFile::fake()->image('example.jpg')->getContent());

    $response = $this->get('/storage/images/example.jpg');

    $response->assertOk();
});

it('returns 404 for a missing image', function () {
    $this->get('/storage/images/missing.jpg')->assertNotFound();
});
