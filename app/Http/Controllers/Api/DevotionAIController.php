<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\GeminiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class DevotionAIController extends Controller
{
    protected $geminiService;

    public function __construct(GeminiService $geminiService)
    {
        $this->geminiService = $geminiService;
    }

    public function generateDevotionText(Request $request)
    {
        $request->validate([
            'verse_reference' => ['required', 'string', 'max:100'],
            'verse_content' => ['required', 'string'],
            'mood' => ['required', 'string'],
        ]);

        try {
            // First, generate a title
            $titlePrompt = "Generate a short, engaging title (maximum 8 words) for a devotion based on this Bible verse: \n\n" .
                         "Verse: {$request->verse_reference}\n" .
                         "Text: {$request->verse_content}\n\n" .
                         "The title should be relevant to someone feeling {$request->mood}. " .
                         "Make it encouraging and faith-focused. Only return the title, no other text.";

            $title = $this->geminiService->generateContent($titlePrompt);
            
            // Then generate the devotion content
            $contentPrompt = "Write a short Christian devotion (3-4 paragraphs) based on this Bible verse:\n\n" .
                          "Verse: {$request->verse_reference}\n" .
                          "Text: {$request->verse_content}\n\n" .
                          "The devotion should be relevant to someone feeling {$request->mood}. " .
                          "Focus on how this verse can bring comfort, guidance, or encouragement. " .
                          "Use a warm, pastoral tone and include a brief prayer at the end. " .
                          "Keep the language simple and relatable.";

            $content = $this->geminiService->generateContent($contentPrompt);

            if (empty($content) || empty($title)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unable to generate devotion content',
                ], 400);
            }


            return response()->json([
                'success' => true,
                'title' => trim($title, '\"\''), // Clean up any quotes
                'content' => $content,
            ]);

        } catch (\Exception $e) {
            Log::error('Error generating devotion text: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate devotion text. Please try again.',
            ], 500);
        }
    }
}
