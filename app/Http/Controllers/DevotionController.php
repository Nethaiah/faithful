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
        $recentDevotions = Auth::user()
            ->devotions()
            ->latest()
            ->take(3)
            ->get(['title', 'verse', 'is_private', 'created_at']);

        return Inertia::render('user/create-devotion', [
            'recentDevotions' => $recentDevotions
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

        $devotion = Devotion::create([
            ...$validated,
            'user_id' => Auth::id(),
        ]);

        return to_route('devotion.create');
    }

    /**
     * Display the specified resource.
     */
    public function show(Devotion $devotion)
    {
        //
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
