<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ServeImageController extends Controller
{
    /**
     * Proxy an uploaded image from the configured filesystem disk.
     *
     * Locally the "public" disk is served directly by Nginx via the storage:link
     * symlink and this route is never reached. In production (S3-compatible disk,
     * which has no public bucket support) this is the only way to serve the file.
     */
    public function show(string $filename): StreamedResponse
    {
        $disk = Storage::disk(config('filesystems.default'));
        $path = "images/{$filename}";

        abort_unless($disk->exists($path), 404);

        return $disk->response($path);
    }
}
