<?php

use App\Http\Controllers\Api\Admin\TagController as AdminTagController;
use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::apiResource('tags', AdminTagController::class)->only(['index', 'store', 'update', 'destroy']);
});
