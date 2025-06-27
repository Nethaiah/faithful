<?php

namespace App\Http\Controllers;

use App\Models\Devotion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $page = $request->query('page', 1);
        $search = $request->query('search', '');
        $filterPrivacy = $request->query('filterPrivacy', 'all');

        // Build query with filters
        $query = $user->devotions()
            ->with('user')
            ->latest();

        // Apply search filter
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('verse', 'like', "%{$search}%")
                  ->orWhere('mood', 'like', "%{$search}%")
                  ->orWhere('devotion', 'like', "%{$search}%");
            });
        }

        // Apply privacy filter
        if ($filterPrivacy === 'public') {
            $query->where('is_private', false);
        } elseif ($filterPrivacy === 'private') {
            $query->where('is_private', true);
        }

        // Get user's devotions with pagination (5 initially)
        $devotions = $query->paginate(5, ['*'], 'page', $page)
            ->through(function ($devotion) {
                return [
                    'id' => $devotion->id,
                    'title' => $devotion->title,
                    'verse' => $devotion->verse,
                    'mood' => $devotion->mood,
                    'isPublic' => !$devotion->is_private, // Inverting since we're using isPublic in the frontend
                    'createdAt' => $devotion->created_at->format('Y-m-d'),
                    'excerpt' => str($devotion->devotion)->limit(100)->toString() . '...',
                ];
            });

        // Get the last devotion
        $lastDevotion = $user->devotions()
            ->latest()
            ->first();

        // Calculate stats
        $stats = [
            'totalDevotions' => $user->devotions()->count(),
            'publicDevotions' => $user->devotions()->where('is_private', false)->count(),
            'privateDevotions' => $user->devotions()->where('is_private', true)->count(),
            'lastDevotionCreatedAt' => $lastDevotion?->created_at->format('Y-m-d') ?? null,
            'lastDevotion' => $lastDevotion ? [
                'id' => $lastDevotion->id,
                'title' => $lastDevotion->title,
                'created_at' => $lastDevotion->created_at->format('M j, Y \a\t g:i a'),
                'is_private' => (bool) $lastDevotion->is_private,
            ] : null,
        ];

        return Inertia::render('user/dashboard', [
            'devotions' => $devotions->items(),
            'pagination' => [
                'hasMorePages' => $devotions->hasMorePages(),
                'hasPreviousPages' => $devotions->previousPageUrl() !== null,
                'currentPage' => $devotions->currentPage(),
                'lastPage' => $devotions->lastPage(),
                'perPage' => $devotions->perPage(),
                'total' => $devotions->total(),
            ],
            'filters' => [
                'search' => $search,
                'filterPrivacy' => $filterPrivacy,
            ],
            'stats' => $stats,
        ]);
    }

    public function loadMore(Request $request)
    {
        $user = Auth::user();
        $page = $request->get('page', 1);
        $search = $request->get('search', '');
        $filterPrivacy = $request->get('filterPrivacy', 'all');

        $query = $user->devotions()
            ->with('user')
            ->latest();

        // Apply search filter
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('verse', 'like', "%{$search}%")
                  ->orWhere('mood', 'like', "%{$search}%")
                  ->orWhere('devotion', 'like', "%{$search}%");
            });
        }

        // Apply privacy filter
        if ($filterPrivacy === 'public') {
            $query->where('is_private', false);
        } elseif ($filterPrivacy === 'private') {
            $query->where('is_private', true);
        }

        $devotions = $query->paginate(10, ['*'], 'page', $page)
            ->through(function ($devotion) {
                return [
                    'id' => $devotion->id,
                    'title' => $devotion->title,
                    'verse' => $devotion->verse,
                    'mood' => $devotion->mood,
                    'isPublic' => !$devotion->is_private,
                    'createdAt' => $devotion->created_at->format('Y-m-d'),
                    'excerpt' => str($devotion->devotion)->limit(100)->toString() . '...',
                ];
            });

        return response()->json([
            'devotions' => $devotions->items(),
            'hasMorePages' => $devotions->hasMorePages(),
            'currentPage' => $devotions->currentPage(),
            'lastPage' => $devotions->lastPage(),
        ]);
    }
}
