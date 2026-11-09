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
     * @return string The public URL, e.g. "/storage/images/xxx.jpg" locally or a bucket URL in production.
     */
    public function store(UploadedFile $file): string
    {
        $manager = ImageManager::usingDriver(Driver::class);
        $image = $manager->decodeSplFileInfo($file)->scaleDown(width: self::MAX_WIDTH);

        $format = Format::create($file->getClientOriginalExtension());
        $encoded = $image->encodeUsingFormat($format, quality: self::QUALITY);

        $filename = Str::uuid().'.'.$format->fileExtension()->value;
        $disk = Storage::disk(config('filesystems.default'));
        $disk->put("images/{$filename}", $encoded->toString());

        return $disk->url("images/{$filename}");
    }
}
