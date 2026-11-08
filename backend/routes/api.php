<?php

use App\Http\Controllers\Api\Admin\ImageController as AdminImageController;
use App\Http\Controllers\Api\Admin\PostController as AdminPostController;
use App\Http\Controllers\Api\Admin\TagController as AdminTagController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PostController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::apiResource('posts', PostController::class)->only(['index', 'show'])->names('posts');

Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::apiResource('tags', AdminTagController::class)->except(['show'])->names('admin.tags');
    Route::apiResource('posts', AdminPostController::class)->names('admin.posts');
    Route::post('images', [AdminImageController::class, 'store']);
});
