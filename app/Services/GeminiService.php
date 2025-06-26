<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiService
{
    protected $apiKey;
    protected $baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

    public function __construct()
    {
        $this->apiKey = config('services.gemini.api_key');
        if (empty($this->apiKey)) {
            throw new \RuntimeException('Gemini API key is not configured');
        }
    }

    /**
     * Generate content using the Gemini API
     *
     * @param string $prompt The prompt to send to the API
     * @return string The generated content
     */
    public function generateContent(string $prompt): string
    {
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
        ])->post("{$this->baseUrl}?key={$this->apiKey}", [
            'contents' => [
                'parts' => [
                    ['text' => $prompt]
                ]
            ]
        ]);

        if ($response->successful()) {
            $content = $response->json();
            // Extract the text from the response
            return $content['candidates'][0]['content']['parts'][0]['text'] ?? '';
        }

        return '';
    }

    public function suggestVerses(string $mood, int $count = 10): array
    {
        $prompt = "Suggest {$count} different Bible verses (NIV) that would be comforting or relevant for someone feeling {$mood}. " .
                 "For each verse, provide the reference and a brief preview of the verse content. " .
                 "Format the response as a JSON array of objects with 'reference' and 'preview' fields. " .
                 "Example: [{\"reference\": \"John 3:16\", \"preview\": \"For God so loved the world...\"}]";

        try {
            Log::debug('Sending request to Gemini API', [
                'mood' => $mood,
                'count' => $count,
                'prompt_length' => strlen($prompt)
            ]);

            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])
            ->timeout(30)
            ->post("{$this->baseUrl}?key={$this->apiKey}", [
                'contents' => [
                    'parts' => [
                        ['text' => $prompt]
                    ]
                ],
                'generationConfig' => [
                    'temperature' => 0.7,
                    'topK' => 40,
                    'topP' => 0.95,
                    'maxOutputTokens' => 2048,
                ]
            ]);

            Log::debug('Received response from Gemini API', [
                'status' => $response->status(),
                'headers' => $response->headers(),
                'body_length' => strlen($response->body())
            ]);

            if (!$response->successful()) {
                Log::error('Gemini API request failed', [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);
                throw new \RuntimeException('Gemini API request failed with status: ' . $response->status());
            }

            $content = $response->json();
            
            if (!isset($content['candidates'][0]['content']['parts'][0]['text'])) {
                Log::error('Unexpected Gemini API response format', ['response' => $content]);
                throw new \RuntimeException('Unexpected response format from Gemini API');
            }

            $text = $content['candidates'][0]['content']['parts'][0]['text'];
            Log::debug('Extracted text from Gemini response', ['text' => $text]);

            // Extract JSON from the response text (Gemini might include markdown code blocks)
            if (preg_match('/```(?:json\n)?(.*?)\n```/s', $text, $matches)) {
                $text = $matches[1];
                Log::debug('Extracted JSON from markdown code block');
            } elseif (preg_match('/\[\s*\{.*\}\s*\]/s', $text, $matches)) {
                $text = $matches[0];
                Log::debug('Extracted JSON array from text');
            }

            $verses = json_decode($text, true);
            
            if (json_last_error() !== JSON_ERROR_NONE) {
                Log::error('Failed to parse JSON from Gemini response', [
                    'json_error' => json_last_error_msg(),
                    'text' => $text
                ]);
                throw new \RuntimeException('Failed to parse JSON response from Gemini: ' . json_last_error_msg());
            }

            if (!is_array($verses)) {
                Log::error('Expected array of verses but got different type', ['type' => gettype($verses)]);
                throw new \RuntimeException('Expected array of verses but got ' . gettype($verses));
            }

            Log::info('Successfully parsed verses from Gemini', ['count' => count($verses)]);
            return $verses;

        } catch (\Exception $e) {
            Log::error('Error in GeminiService::suggestVerses', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'mood' => $mood,
                'count' => $count
            ]);
            throw $e;
        }
    }
}
