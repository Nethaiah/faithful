<?php

namespace App\Http\Controllers;

use App\Models\Devotion;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DevotionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user = Auth::user();

        $recentDevotions = $user->devotions()
            ->latest()
            ->take(3)
            ->get(['title', 'verse', 'is_private', 'created_at']);

        return Inertia::render('user/create-devotion', [
            'recentDevotions' => $recentDevotions,
            'user' => [
                'default_privacy' => (bool) $user->default_privacy
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'mood' => ['required', 'string'],
            'verse' => ['required', 'string'],
            'verse_content' => ['required', 'string'],
            'title' => ['required', 'string'],
            'devotion' => ['required', 'string'],
            'is_private' => ['required', 'boolean'],
        ]);

        // Ensure the user can only set privacy for their own devotions
        $validated['is_private'] = (bool) $validated['is_private'];

        $devotion = Auth::user()->devotions()->create($validated);

        return to_route('devotion.create')->with('success', 'Devotion created successfully!');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Devotion  $devotion
     * @return \Inertia\Response
     */
    public function show(Devotion $devotion)
    {
        // Check if the devotion is private and not owned by the current user
        if ($devotion->is_private && $devotion->user_id !== Auth::id()) {
            abort(404, 'The requested devotion is private.');
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

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Devotion $devotion)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Devotion $devotion)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Devotion $devotion)
    {
        //
    }
}
