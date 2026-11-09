<?php

use App\Services\ImageUploadService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;

beforeEach(function () {
    Storage::fake('public');
});

function readStoredImage(string $url)
{
    $filename = basename($url);
    $path = Storage::disk('public')->path("images/{$filename}");

    return ImageManager::usingDriver(Driver::class)->decodePath($path);
}

it('resizes images wider than 1600px down to 1600px, preserving aspect ratio', function () {
    $file = UploadedFile::fake()->image('wide.jpg', 2000, 1000);

    $url = (new ImageUploadService)->store($file);
    $resized = readStoredImage($url);

    expect($resized->width())->toBe(1600);
    expect($resized->height())->toBe(800);
});

it('does not upscale images narrower than 1600px', function () {
    $file = UploadedFile::fake()->image('small.jpg', 400, 300);

    $url = (new ImageUploadService)->store($file);
    $resized = readStoredImage($url);

    expect($resized->width())->toBe(400);
    expect($resized->height())->toBe(300);
});

it('stores the file and returns a public url under /storage/images', function () {
    $file = UploadedFile::fake()->image('photo.jpg', 100, 100);

    $url = (new ImageUploadService)->store($file);

    expect($url)->toStartWith('/storage/images/');
    Storage::disk('public')->assertExists('images/'.basename($url));
});

it('preserves the original file extension', function () {
    $file = UploadedFile::fake()->image('photo.png', 100, 100);

    $url = (new ImageUploadService)->store($file);

    expect($url)->toEndWith('.png');
});

it('gives each upload a unique, non-predictable filename', function () {
    $first = (new ImageUploadService)->store(UploadedFile::fake()->image('a.jpg', 100, 100));
    $second = (new ImageUploadService)->store(UploadedFile::fake()->image('a.jpg', 100, 100));

    expect($first)->not->toBe($second);
});

describe('when the default disk is not "public" (e.g. production S3)', function () {
    beforeEach(function () {
        config(['filesystems.default' => 's3']);
        Storage::fake('s3');
    });

    it('stores the file on that disk and returns a proxied URL instead of a direct bucket URL', function () {
        $file = UploadedFile::fake()->image('photo.jpg', 100, 100);

        $url = (new ImageUploadService)->store($file);

        expect($url)->toContain('/storage/images/')->toEndWith('.jpg');
        Storage::disk('s3')->assertExists('images/'.basename($url));
    });
});
