<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\GeminiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class VerseContentController extends Controller
{
    protected $geminiService;

    public function __construct(GeminiService $geminiService)
    {
        $this->geminiService = $geminiService;
    }

    public function getContent(Request $request)
    {
        $request->validate([
            'reference' => ['required', 'string', 'max:100'],
        ]);

        try {
            $prompt = "Provide the exact NIV text for the Bible verse: {$request->reference}. " .
                     "Only include the verse text, no additional commentary or formatting.";
            
            $content = $this->geminiService->generateContent($prompt);

            if (empty($content)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unable to retrieve verse content',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'content' => $content,
            ]);

        } catch (\Exception $e) {
            Log::error('Error in VerseContentController: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch verse content. Please try again.',
            ], 500);
        }
    }
}
