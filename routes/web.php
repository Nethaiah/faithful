<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DevotionController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\CommunityController;
use App\Http\Controllers\PostPrivacyController;

// Landing page
Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Dashboard
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
});

// Devotion
Route::middleware(['auth','verified'])->group(function () {
    Route::resource('devotion', DevotionController::class);
});

// Discovery
Route::get('discover', function () {
    return Inertia::render('user/discover');
})->name('discover');

// Community
Route::get('community', [CommunityController::class, 'index'])->name('community');

// Privacy
Route::middleware(['auth','verified'])->group(function () {
    Route::get('privacy', [PostPrivacyController::class,'index'])->name('privacy');
});

// Devotion View

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
