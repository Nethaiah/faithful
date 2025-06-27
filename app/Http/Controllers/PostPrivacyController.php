<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class PostPrivacyController extends Controller
{
    /**
     * Display the privacy settings page with user's devotions
     */
    public function index()
    {
        $user = Auth::user();

        $devotions = $user->devotions()
            ->select([
                'id',
                'title',
                'verse',
                'is_private',
                'created_at',
            ])
            ->latest('created_at')
            ->get()
            ->map(function ($devotion) {
                return [
                    'id' => $devotion->id,
                    'title' => $devotion->title,
                    'verse' => $devotion->verse,
                    'isPublic' => !$devotion->is_private,
                    'createdAt' => $devotion->created_at->format('Y-m-d H:i:s'),
                ];
            });

        return Inertia::render('user/privacy', [
            'devotions' => $devotions,
            'stats' => [
                'privateCount' => $user->devotions()->where('is_private', true)->count(),
                'publicCount' => $user->devotions()->where('is_private', false)->count(),
            ]
        ]);
    }

    /**
     * Update the privacy settings for multiple devotions
     */
    public function bulkUpdate(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'devotion_ids' => 'required|array',
            'devotion_ids.*' => 'exists:devotions,id,user_id,' . $user->id,
            'is_public' => 'required|boolean',
        ]);

        $count = $user->devotions()
            ->whereIn('id', $request->devotion_ids)
            ->update(['is_private' => !$request->is_public]);

        return response()->json([
            'message' => "Updated privacy for {$count} " . ($count === 1 ? 'devotion' : 'devotions'),
            'success' => true,
        ]);
    }

    /**
     * Update the privacy setting for a single devotion
     */
    public function update(Request $request, $devotionId)
    {
        $user = Auth::user();

        $request->validate([
            'is_public' => 'required|boolean',
        ]);

        $devotion = $user->devotions()->findOrFail($devotionId);
        $devotion->is_private = !$request->is_public;
        $devotion->save();

        return response()->json([
            'message' => 'Devotion privacy updated successfully',
            'success' => true,
        ]);
    }
}
