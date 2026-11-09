<?php

use App\Http\Controllers\ServeImageController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/storage/images/{filename}', [ServeImageController::class, 'show'])->name('images.show');
