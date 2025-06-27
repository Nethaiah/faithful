<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DevotionController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\CommunityController;
use App\Http\Controllers\PostPrivacyController;
use App\Http\Controllers\Api\VerseSuggestionController;
use App\Http\Controllers\Api\VerseContentController;
use App\Http\Controllers\Api\DevotionAIController;

// Landing page
Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Dashboard
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('dashboard/load-more', [DashboardController::class, 'loadMore'])->name('dashboard.load-more');
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
Route::get('community/{devotion}', [CommunityController::class, 'show'])->name('devotion.show');
Route::get('community/load-more', [CommunityController::class, 'loadMore'])->name('community.load-more');

// Privacy
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('privacy', [PostPrivacyController::class, 'index'])->name('privacy');
    Route::post('privacy/bulk-update', [PostPrivacyController::class, 'bulkUpdate'])->name('privacy.bulk-update');
    Route::post('privacy/{devotion}', [PostPrivacyController::class, 'update'])->name('privacy.update');
});

// Devotion View

// API Routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/api/verses/content', [VerseContentController::class, 'getContent'])->name('verses.content');
    Route::post('/api/devotion/generate', [DevotionAIController::class, 'generateDevotionText'])->name('devotion.generate');
    Route::post('/api/verses/detect-mood', [VerseSuggestionController::class, 'detectMood'])->name('verses.detect-mood');
});

Route::post('/api/verses/suggest', [VerseSuggestionController::class, 'suggest'])->name('verses.suggest');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
