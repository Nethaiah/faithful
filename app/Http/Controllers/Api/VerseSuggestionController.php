<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\GeminiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class VerseSuggestionController extends Controller
{
    protected $geminiService;

    public function __construct(GeminiService $geminiService)
    {
        $this->geminiService = $geminiService;
    }

    /**
     * Detect the mood from a given verse text using Gemini AI
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function detectMood(Request $request)
    {
        $request->validate([
            'verse_text' => 'required|string',
            'verse_reference' => 'nullable|string',
        ]);

        try {
            $verseText = $request->input('verse_text');
            $verseReference = $request->input('verse_reference', '');
            
            $prompt = "Analyze the following Bible verse and determine the most appropriate mood/emotion it conveys. "
                   . "Choose ONE from this exact list (case-sensitive): "
                   . "Happy, Peaceful, Encouraged, Thankful, Hopeful, Reflective, Loved, Grateful, "
                   . "Joyful, Anxious, Fearful, Sad, Overwhelmed, Lonely, Stressed, Angry, "
                   . "Hopeless, Guilty, Tempted, Faithful, Doubtful, Loving.\n\n"
                   . "Verse: " . ($verseReference ? "$verseReference - " : '') . "$verseText\n\n"
                   . "Respond ONLY with the single most appropriate mood from the list above, nothing else.";

            $response = $this->geminiService->generateContent($prompt);
            $detectedMood = trim($response);

            // Validate that the response is one of our expected moods
            $validMoods = [
                'Happy', 'Peaceful', 'Encouraged', 'Thankful', 'Hopeful', 'Reflective', 
                'Loved', 'Grateful', 'Joyful', 'Anxious', 'Fearful', 'Sad', 'Overwhelmed', 
                'Lonely', 'Stressed', 'Angry', 'Hopeless', 'Guilty', 'Tempted', 'Faithful', 
                'Doubtful', 'Loving'
            ];

            if (!in_array($detectedMood, $validMoods)) {
                throw new \Exception('Invalid mood detected from AI');
            }

            return response()->json([
                'success' => true,
                'mood' => $detectedMood
            ]);

        } catch (\Exception $e) {
            Log::error('Error detecting mood from verse: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Unable to detect mood from verse',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Suggest verses based on mood
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function suggest(Request $request)
    {
        $request->validate([
            'mood' => ['required', 'string'],
            'count' => ['sometimes', 'integer', 'min:1', 'max:15'],
        ]);

        try {
            $mood = $request->input('mood');
            $count = $request->input('count', 10);
            
            Log::info('Fetching verse suggestions', [
                'mood' => $mood,
                'count' => $count,
                'ip' => $request->ip()
            ]);

            $verses = $this->geminiService->suggestVerses($mood, $count);

            if (!is_array($verses)) {
                throw new \RuntimeException('Invalid verses format received from Gemini service');
            }

            Log::info('Successfully fetched verse suggestions', [
                'count' => count($verses),
                'mood' => $mood
            ]);

            return response()->json([
                'success' => true,
                'verses' => $verses,
            ]);
        } catch (\Exception $e) {
            $errorDetails = [
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
                'request' => $request->all()
            ];
            
            Log::error('Error in VerseSuggestionController', $errorDetails);

            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'error_details' => config('app.debug') ? $errorDetails : null,
            ], 500);
        }
    }
}
