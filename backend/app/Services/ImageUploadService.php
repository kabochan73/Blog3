<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\Format;
use Intervention\Image\ImageManager;

class ImageUploadService
{
    private const MAX_WIDTH = 1600;

    private const QUALITY = 80;

    /**
     * Resize (down only, preserving aspect ratio), compress, and store the uploaded image.
     *
     * Uses the app's default filesystem disk (FILESYSTEM_DISK), so this resolves to the
     * local "public" disk in development and the S3-compatible bucket in production.
     *
     * Railway's S3-compatible buckets don't support public objects, so for any disk other
     * than "public" the URL points at ServeImageController, which proxies the file through
     * the app instead of a direct bucket URL.
     *
     * @return string The public URL, e.g. "/storage/images/xxx.jpg" locally or a proxied URL in production.
     */
    public function store(UploadedFile $file): string
    {
        $manager = ImageManager::usingDriver(Driver::class);
        $image = $manager->decodeSplFileInfo($file)->scaleDown(width: self::MAX_WIDTH);

        $format = Format::create($file->getClientOriginalExtension());
        $encoded = $image->encodeUsingFormat($format, quality: self::QUALITY);

        $filename = Str::uuid().'.'.$format->fileExtension()->value;
        $diskName = config('filesystems.default');
        Storage::disk($diskName)->put("images/{$filename}", $encoded->toString());

        return $diskName === 'public'
            ? Storage::disk($diskName)->url("images/{$filename}")
            : route('images.show', ['filename' => $filename]);
    }
}
