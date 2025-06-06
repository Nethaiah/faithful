<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DevotionController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('user/dashboard');
    })->name('dashboard');
});

// Devotion
Route::middleware(['auth','verified'])->group(function () {
    Route::resource('devotion', DevotionController::class);
});

// Discovery
Route::get('discover', function () {
    return Inertia::render('user/discover');
})->name('discover');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
