<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Devotion;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class CommunityController extends Controller
{

    public function show(Devotion $devotion)
    {
        // Check if the devotion is private and not owned by the current user
        if ($devotion->is_private) {
            if (!Auth::check() || $devotion->user_id !== Auth::id()) {
                abort(404, 'The requested devotion is private.');
            }
        }

        // Load the devotion with the user relationship
        $devotion->load('user');

        return Inertia::render('user/view-devotion', [
            'devotion' => [
                'id' => $devotion->id,
                'title' => $devotion->title,
                'verse' => $devotion->verse,
                'verse_content' => $devotion->verse_content,
                'content' => $devotion->devotion, // 'devotion' is the column name in the database
                'mood' => $devotion->mood,
                'is_private' => $devotion->is_private,
                'created_at' => $devotion->created_at->toISOString(),
                'updated_at' => $devotion->updated_at->toISOString(),
                'user' => [
                    'id' => $devotion->user->id,
                    'name' => $devotion->user->name,
                    'email' => $devotion->user->email,
                ],
            ]
        ]);
    }

    public function index(Request $request)
    {
        $mood = $request->query('mood');
        $search = $request->query('search');
        $page = $request->query('page', 1);

        $devotions = Devotion::with('user')
            ->where('is_private', false)
            ->when($mood, function($query) use ($mood) {
                return $query->where('mood', $mood);
            })
            ->when($search, function($query) use ($search) {
                return $query->where(function($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhere('devotion', 'like', "%{$search}%")
                      ->orWhere('verse', 'like', "%{$search}%");
                });
            })
            ->orderBy('created_at', 'desc')
            ->paginate(5, ['*'], 'page', $page)
            ->through(function ($devotion) {
                return [
                    'id' => $devotion->id,
                    'title' => $devotion->title,
                    'verse' => $devotion->verse,
                    'verse_content' => $devotion->verse_content,
                    'content' => $devotion->devotion,
                    'mood' => $devotion->mood,
                    'is_private' => $devotion->is_private,
                    'created_at' => $devotion->created_at->toISOString(),
                    'updated_at' => $devotion->updated_at->toISOString(),
                    'user' => [
                        'id' => $devotion->user->id,
                        'name' => $devotion->user->name,
                        'email' => $devotion->user->email,
                        'avatar' => $devotion->user->avatar ?? null,
                    ],
                ];
            });

        // Get all unique moods for filter
        $moods = Devotion::where('is_private', false)
            ->select('mood')
            ->distinct()
            ->pluck('mood')
            ->filter()
            ->values();

        // Get community stats
        $stats = [
            'totalUsers' => User::count(),
            'totalDevotions' => Devotion::where('is_private', false)->count(),
            'moodCounts' => Devotion::where('is_private', false)
                ->select('mood', DB::raw('count(*) as count'))
                ->groupBy('mood')
                ->pluck('count', 'mood')
                ->toArray(),
        ];

        return Inertia::render('user/community', [
            'devotions' => [
                'data' => $devotions->items(),
                'next_page_url' => $devotions->nextPageUrl(),
                'current_page' => $devotions->currentPage(),
                'last_page' => $devotions->lastPage(),
                'per_page' => $devotions->perPage(),
                'total' => $devotions->total(),
                'has_more_pages' => $devotions->hasMorePages(),
                'has_previous_pages' => $devotions->previousPageUrl() !== null,
            ],
            'filters' => [
                'mood' => $mood,
                'search' => $search,
            ],
            'moods' => $moods,
            'stats' => $stats,
        ]);
    }

    public function loadMore(Request $request)
    {
        $page = $request->get('page', 1);
        $search = $request->get('search', '');
        $mood = $request->get('mood', '');

        $query = Devotion::with('user')
            ->where('is_private', false);

        // Apply search filter
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('devotion', 'like', "%{$search}%")
                  ->orWhere('verse', 'like', "%{$search}%");
            });
        }

        // Apply mood filter
        if ($mood) {
            $query->where('mood', $mood);
        }

        $devotions = $query->orderBy('created_at', 'desc')
            ->paginate(10, ['*'], 'page', $page)
            ->through(function ($devotion) {
                return [
                    'id' => $devotion->id,
                    'title' => $devotion->title,
                    'verse' => $devotion->verse,
                    'verse_content' => $devotion->verse_content,
                    'content' => $devotion->devotion,
                    'mood' => $devotion->mood,
                    'is_private' => $devotion->is_private,
                    'created_at' => $devotion->created_at->toISOString(),
                    'updated_at' => $devotion->updated_at->toISOString(),
                    'user' => [
                        'id' => $devotion->user->id,
                        'name' => $devotion->user->name,
                        'email' => $devotion->user->email,
                        'avatar' => $devotion->user->avatar ?? null,
                    ],
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
