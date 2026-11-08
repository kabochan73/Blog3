<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UploadImageRequest;
use App\Services\ImageUploadService;
use Illuminate\Http\Response;

class ImageController extends Controller
{
    public function __construct(private readonly ImageUploadService $imageUploadService) {}

    public function store(UploadImageRequest $request)
    {
        $url = $this->imageUploadService->store($request->file('image'));

        return response()->json(['url' => $url], Response::HTTP_CREATED);
    }
}
