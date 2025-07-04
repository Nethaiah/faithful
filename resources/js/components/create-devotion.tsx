"use client"

import { useState, useEffect, useRef, FormEventHandler } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, BookOpen, Heart, Sparkles, Lock, Globe, Save, Lightbulb, Loader2 } from "lucide-react"
import { Link, usePage, useForm, router } from "@inertiajs/react"
import { toast } from "sonner"

declare module '@inertiajs/core' {
    interface PageProps {
        csrf: string;
    }
}

interface RecentDevotion {
    id: number;
    title: string;
    verse: string;
    is_private: boolean;
    created_at: string;
}

type InertiaPageProps = {
    csrf: string;
    recentDevotions: RecentDevotion[];
    user: {
        // User properties
    };
};

type DevotionForm = {
    _token: string;
    mood: string;
    verse: string;
    verse_content: string;
    title: string;
    devotion: string;
    is_private: boolean;
}

type VerseSuggestion = {
    reference: string;
    preview: string;
};

export function DevotionCreation() {
    const [isPublic, setIsPublic] = useState(false);
    const [selectedMood, setSelectedMood] = useState("");
    const [verseReference, setVerseReference] = useState("");
    const [verseContent, setVerseContent] = useState("");
    const [title, setTitle] = useState("");
    const [devotionText, setDevotionText] = useState("");
    const [suggestedVerses, setSuggestedVerses] = useState<VerseSuggestion[]>([]);
    const [visibleSuggestions, setVisibleSuggestions] = useState<number>(5); // Show 5 suggestions initially
    // Loading states
    const [isLoadingVerses, setIsLoadingVerses] = useState(false);
    const [isFetchingContent, setIsFetchingContent] = useState(false);
    const [isGeneratingDevotion, setIsGeneratingDevotion] = useState(false);
    const [isSubmittingForm, setIsSubmittingForm] = useState(false);
    const [isFetchingMood, setIsFetchingMood] = useState(false);

    // Error states
    const [verseError, setVerseError] = useState<string | null>(null);
    const [contentError, setContentError] = useState<string | null>(null);
    const [aiError, setAiError] = useState<string | null>(null);

    // Refs
    const verseTimerRef = useRef<NodeJS.Timeout | null>(null);

        // Read URL parameters on component mount
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const verseRef = params.get('verse');
        const verseContentParam = params.get('verse_content');
        const moodParam = params.get('mood');

        // Set mood from URL parameter if provided
        if (moodParam) {
            setSelectedMood(moodParam);
        }

        if (verseRef) {
            setVerseReference(verseRef);

            if (verseContentParam) {
                setVerseContent(verseContentParam);
            } else if (verseRef) {
                // If we only have the reference, fetch the content
                const fetchVerseContent = async () => {
                    try {
                        const response = await fetch(route('verses.content') + `?reference=${encodeURIComponent(verseRef)}`);
                        const data = await response.json();
                        if (data.content) {
                            setVerseContent(data.content);
                        }
                    } catch (error) {
                        console.error('Error fetching verse content:', error);
                    }
                };

                fetchVerseContent();
            }
        }
    }, []);

    const handleShowMoreSuggestions = () => {
        // Show 5 more suggestions, up to the total available
        setVisibleSuggestions(prev => Math.min(prev + 5, suggestedVerses.length));
    };

    const handleShowLessSuggestions = () => {
        // Reset to show only the first 5 suggestions
        setVisibleSuggestions(5);
    };

    const moods = [
        { name: "Anxious", color: "bg-red-100 text-red-800", icon: "😰" },
        { name: "Grateful", color: "bg-green-100 text-green-800", icon: "🙏" },
        { name: "Struggling", color: "bg-orange-100 text-orange-800", icon: "💪" },
        { name: "Joyful", color: "bg-yellow-100 text-yellow-800", icon: "😊" },
        { name: "Confused", color: "bg-purple-100 text-purple-800", icon: "🤔" },
        { name: "Peaceful", color: "bg-blue-100 text-blue-800", icon: "☮️" },
        { name: "Hopeful", color: "bg-teal-100 text-teal-800", icon: "🌟" },
        { name: "Lonely", color: "bg-indigo-100 text-indigo-800", icon: "😔" },
        { name: "Overwhelmed", color: "bg-pink-100 text-pink-800", icon: "😵" },
        { name: "Angry", color: "bg-rose-100 text-rose-800", icon: "😠" },
        { name: "Thankful", color: "bg-emerald-100 text-emerald-800", icon: "🙌" },
        { name: "Sad", color: "bg-sky-100 text-sky-800", icon: "😢" },
        { name: "Fearful", color: "bg-violet-100 text-violet-800", icon: "😨" },
        { name: "Encouraged", color: "bg-amber-100 text-amber-800", icon: "✨" },
        { name: "Tempted", color: "bg-fuchsia-100 text-fuchsia-800", icon: "😈" },
        { name: "Faithful", color: "bg-cyan-100 text-cyan-800", icon: "✝️" },
        { name: "Doubtful", color: "bg-slate-100 text-slate-800", icon: "❓" },
        { name: "Loving", color: "bg-rose-100 text-rose-800", icon: "❤️" },
        { name: "Hopeless", color: "bg-gray-100 text-gray-800", icon: "😞" },
        { name: "Guilty", color: "bg-amber-100 text-amber-800", icon: "😣" },
    ];

    const fetchVerseSuggestions = async (mood: string) => {
        if (isLoadingVerses) return;

        setIsLoadingVerses(true);
        setSuggestedVerses([]);
        setVerseError(null);

        try {
            const response = await fetch(route('verses.suggest'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify({ mood })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.error) {
                setVerseError(data.error);
                toast.error('Failed to load verse suggestions: ' + data.error);

            } else if (data.verses && Array.isArray(data.verses)) {
                setSuggestedVerses(data.verses);

                if (data.verses.length === 0) {
                    toast.info('No verse suggestions found for this mood');
                }
            }

        } catch (error) {
            console.error('Error fetching verse suggestions:', error);
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            setVerseError(`Failed to fetch verse suggestions: ${errorMessage}`);
            toast.error('Failed to load verse suggestions. Please try again.');

        } finally {
            setIsLoadingVerses(false);
        }
    };

    // Fetch verse suggestions when mood changes
    useEffect(() => {
        const fetchVerses = async () => {
            if (!selectedMood) {
                setSuggestedVerses([]);
                setVisibleSuggestions(5);
                return;
            }

            setIsLoadingVerses(true);
            setVerseError(null);

            try {
                const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
                console.log('Fetching verses for mood:', selectedMood);

                const response = await fetch(route('verses.suggest'), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-TOKEN': csrfToken
                    },
                    body: JSON.stringify({
                        mood: selectedMood,
                        count: 15 // Fetch 15 suggestions
                    }),
                    credentials: 'same-origin'
                });

                console.log('Response status:', response.status);
                const responseText = await response.text();
                console.log('Raw response:', responseText);

                if (!response.ok) {
                    let errorMessage = 'Failed to fetch verse suggestions';

                    try {
                        const errorData = JSON.parse(responseText);
                        errorMessage = errorData.message || errorMessage;
                        console.error('API Error:', errorData);

                    } catch (e) {
                        console.error('Error parsing error response:', e, 'Response text:', responseText);
                    }

                    throw new Error(errorMessage);
                }

                let data;

                try {
                    data = JSON.parse(responseText);
                    console.log('Parsed response data:', data);

                } catch (e) {
                    console.error('Failed to parse JSON response:', e);
                    throw new Error('Invalid response format from server');
                }

                // Handle different response formats
                let verses = [];
                if (data.success && Array.isArray(data.verses)) {
                    verses = data.verses;

                } else if (Array.isArray(data)) {
                    // Handle case where the API returns the array directly
                    verses = data;

                } else {
                    console.error('Unexpected response format:', data);
                    throw new Error('Unexpected response format from server');
                }

                // Ensure each verse has the required fields
                const validVerses = verses.filter((v: { reference?: string, preview?: string }) =>
                    v &&
                    typeof v === 'object' &&
                    v.reference &&
                    typeof v.reference === 'string' &&
                    v.preview &&
                    typeof v.preview === 'string'
                );

                if (validVerses.length === 0) {
                    console.warn('No valid verses found in response');
                }

                setSuggestedVerses(validVerses);
                setVisibleSuggestions(5); // Show only 5 initially

            } catch (error) {
                console.error('Error fetching verse suggestions:', error);
                setVerseError(error instanceof Error ? error.message : 'Failed to load verse suggestions');
                setSuggestedVerses([]);
            } finally {
                setIsLoadingVerses(false);
            }
        };

        const timer = setTimeout(() => {
            fetchVerses();
        }, 300); // Small debounce to prevent rapid requests

        return () => clearTimeout(timer);
    }, [selectedMood]);

    const handleMoodSelect = async (mood: string, e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        // Prevent multiple clicks while loading
        if (isFetchingMood) return;

        // Toggle mood selection if already selected
        const newMood = selectedMood === mood ? '' : mood;
        setSelectedMood(newMood);

        if (newMood) {
            try {
                setIsFetchingMood(true);
                setSuggestedVerses([{
                    reference: `Finding verses for ${newMood}...`,
                    preview: 'Praying for the perfect verse for you...',
                }]);

                await fetchVerseSuggestions(newMood);
            } catch (error) {
                console.error('Error in handleMoodSelect:', error);
                toast.error('Failed to load verse suggestions. Please try again.');
                setSuggestedVerses([]);
            } finally {
                setIsFetchingMood(false);
            }

        } else {
            setSuggestedVerses([]);
        }
    };

    const handleGenerateDevotion = async () => {
        if (isGeneratingDevotion) return;

        if (!verseReference.trim() || !verseContent.trim() || !selectedMood.trim()) {
            setAiError('Please fill in all required fields (verse, verse content, and mood)');
            return;
        }

        setIsGeneratingDevotion(true);
        setAiError(null);

        try {
            // Get the CSRF token from the meta tag
            const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

            if (!token) {
                throw new Error('CSRF token not found');
            }

            const response = await fetch(route('devotion.generate'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': token,
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    verse_reference: verseReference,
                    verse_content: verseContent,
                    mood: selectedMood,
                    _token: token, // Also include in the body for Laravel
                }),
            });

            // Handle non-JSON responses
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                console.error('Non-JSON response:', text);
                throw new Error('Invalid response from server');
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }

            if (!data.success) {
                throw new Error(data.message || 'Failed to generate devotion');
            }

            if (data.content && data.title) {
                setDevotionText(data.content);
                setTitle(data.title);
            } else {
                throw new Error('Incomplete content generated');
            }
        } catch (error) {
            console.error('Error generating devotion:', error);
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            setAiError(`Failed to generate devotion: ${errorMessage}`);
            toast.error('Failed to generate devotion. Please try again.');
        } finally {
            setIsGeneratingDevotion(false);
        }
    };

    // Fetch verse content when reference changes
    useEffect(() => {
        if (!verseReference.trim()) {
            setVerseContent('');
            return;
        }

        // Clear any existing timeout
        if (verseTimerRef.current) {
            clearTimeout(verseTimerRef.current);
        }

        // Set a new timeout to debounce the API call
        verseTimerRef.current = setTimeout(() => {
            fetchVerseContent(verseReference);
        }, 1000); // 1 second debounce

        return () => {
            if (verseTimerRef.current) {
                clearTimeout(verseTimerRef.current);
            }
        };
    }, [verseReference]);

    const fetchVerseContent = async (reference: string) => {
        if (!reference.trim()) {
            setVerseContent('');
            return;
        }

        setIsFetchingContent(true);
        setContentError(null);

        try {
            const response = await fetch(route('verses.content', {
                reference: reference
            }));

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch verse content');
            }

            if (data.success && data.content) {
                setVerseContent(data.content);
            } else {
                setVerseContent('');
                setContentError('Verse not found or invalid reference');
            }
        } catch (error) {
            console.error('Error fetching verse content:', error);
            setContentError('Failed to fetch verse content. Please check the reference and try again.');
            setVerseContent('');
        } finally {
            setIsFetchingContent(false);
        }
    };

    const { csrf, recentDevotions = [] } = usePage<InertiaPageProps>().props;
    // Check if all required fields are filled
    const isFormValid = Boolean(
        selectedMood &&
        verseReference &&
        verseContent &&
        title &&
        devotionText
    );

    const { data, setData, post, processing, errors, reset } = useForm<DevotionForm>({
        _token: csrf,
        mood: selectedMood,
        verse: verseReference,
        verse_content: verseContent,
        title: title,
        devotion: devotionText,
        is_private: !isPublic,
    });

    // Update form data when state changes
    useEffect(() => {
        setData({
            _token: csrf,
            mood: selectedMood,
            verse: verseReference,
            verse_content: verseContent,
            title: title,
            devotion: devotionText,
            is_private: !isPublic,
        });
    }, [selectedMood, verseReference, verseContent, title, devotionText, isPublic, csrf, setData]);

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        if (isSubmittingForm) return;

        // Basic form validation
        if (!verseReference.trim() || !verseContent.trim() || !title.trim() || !devotionText.trim()) {
            toast.error('Please fill in all required fields', {
                duration: 5000,
                position: 'top-center',
            });
            return;
        }

        setIsSubmittingForm(true);

        post(route('devotion.store'), {
            onSuccess: () => {
                reset('mood', 'verse', 'verse_content', 'title', 'devotion');
                setSelectedMood('');
                setVerseReference('');
                setVerseContent('');
                setTitle('');
                setDevotionText('');
                setIsPublic(false);

                toast.success('Devotion created successfully', {
                    duration: 5000,
                    position: 'top-center',
                });
            },
            onError: (errors) => {
                console.error('Form submission errors:', errors);
                toast.error('Failed to create devotion. Please check the form for errors.', {
                    duration: 5000,
                    position: 'top-center',
                });
            },
            onFinish: () => {
                setIsSubmittingForm(false);
            },
            preserveScroll: true,
        });
    }

    const togglePrivacy = () => {
        setIsPublic(!isPublic);
    };

    // Default privacy is set to private (isPublic = false)

    return (
        <div className="w-full py-4 sm:py-6 px-2 sm:px-4">
            <div className="mb-6 text-center px-1">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4 leading-tight">
                    Create a New Devotion
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
                    Reflect, write, and share your spiritual journey.
                </p>
            </div>
                <form method="POST" onSubmit={handleSubmit}>
                    <input type="hidden" name="_token" value={csrf} />
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Creation Form */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Mood Selection */}
                            <Card className="mb-6 overflow-hidden">
                                <CardHeader className="pb-3 sm:pb-4">
                                    <CardTitle className="flex items-center space-x-2 text-base sm:text-xl">
                                        <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-red-500 flex-shrink-0" />
                                        <span>How are you feeling today?</span>
                                    </CardTitle>
                                    <CardDescription className="text-sm sm:text-base mt-1">
                                        Select the mood that best describes your current state of heart and mind
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-6">
                                        {isFetchingMood ? (
                                            <div className="col-span-full flex flex-col items-center justify-center p-6 bg-blue-50 rounded-lg">
                                                <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-2" />
                                                <p className="text-blue-700 text-center">Finding verses for {selectedMood}...</p>
                                                <p className="text-sm text-blue-600">This may take a moment</p>
                                            </div>
                                        ) : (
                                            moods.map((mood) => (
                                                <button
                                                    key={mood.name}
                                                    onClick={(e) => handleMoodSelect(mood.name, e)}
                                                    disabled={isFetchingMood}
                                                    className={`flex items-center justify-center p-3 rounded-lg transition-all ${mood.color}
                                                        ${selectedMood === mood.name ? 'ring-2 ring-offset-2 ring-blue-500' : ''}
                                                        ${isFetchingMood ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
                                                >
                                                    <span className="text-xl mr-2">{mood.icon}</span>
                                                    <span>{mood.name}</span>
                                                </button>
                                            ))
                                        )}
                                    </div>
                                    {selectedMood && (
                                        <div className="border-t border-gray-100 pt-4 sm:pt-6">
                                            <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
                                                <Link href={route('discover')}>
                                                    <Heart className="h-4 w-4 mr-2" />
                                                    Find More Verses for "{selectedMood}"
                                                </Link>
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Verse Selection */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <BookOpen className="h-5 w-5 text-blue-500" />
                                        <span>Bible Verse</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="verse-reference">Verse Reference</Label>
                                        <div className="relative">
                                            <Input
                                                id="verse-reference"
                                                placeholder="e.g., John 3:16 or Psalm 23:1"
                                                value={verseReference}
                                                onChange={(e) => setVerseReference(e.target.value)}
                                                disabled={isFetchingContent}
                                            />
                                            {isFetchingContent && (
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                    <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {selectedMood && (
                                        <div>
                                            <Label className="text-sm font-medium">Suggested verses for "{selectedMood}":</Label>
                                            <div className="space-y-2">
                                                {isLoadingVerses ? (
                                                    <div className="flex items-center justify-center py-4">
                                                        <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
                                                    </div>
                                                ) : verseError ? (
                                                    <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
                                                        {verseError}
                                                    </div>
                                                ) : suggestedVerses.length > 0 ? (
                                                    <>
                                                        {suggestedVerses.slice(0, visibleSuggestions).map((verse) => (
                                                            <div
                                                                key={verse.reference}
                                                                className="cursor-pointer rounded-lg border p-3 hover:bg-gray-50"
                                                                onClick={() => setVerseReference(verse.reference)}
                                                            >
                                                                <div className="font-medium text-blue-600">{verse.reference}</div>
                                                                <div className="text-sm text-gray-500">{verse.preview}</div>
                                                            </div>
                                                        ))}
                                                        {suggestedVerses.length > 5 && (
                                                            <div className="flex justify-center pt-2">
                                                                {visibleSuggestions < suggestedVerses.length ? (
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={handleShowMoreSuggestions}
                                                                        className="text-sm text-blue-600 hover:text-blue-800"
                                                                    >
                                                                        Show More Suggestions ({suggestedVerses.length - visibleSuggestions} more)
                                                                    </Button>
                                                                ) : (
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={handleShowLessSuggestions}
                                                                        className="text-sm text-blue-600 hover:text-blue-800"
                                                                    >
                                                                        Show Less
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        )}
                                                    </>
                                                ) : (
                                                    <p className="text-sm text-gray-500">No suggestions available. Try selecting a different mood.</p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <Label htmlFor="verse-content">Verse Content</Label>
                                        <div className="space-y-1">
                                            <Textarea
                                                id="verse-content"
                                                placeholder={isFetchingContent ? 'Loading verse content...' : 'The verse content will appear here automatically...'}
                                                value={verseContent}
                                                onChange={(e) => setVerseContent(e.target.value)}
                                                rows={3}
                                                className={`bg-blue-50/50 ${contentError ? 'border-red-300' : ''}`}
                                                disabled={isFetchingContent}
                                            />
                                            {contentError && (
                                                <p className="text-xs text-red-500">{contentError}</p>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            AI will automatically populate this when you enter a verse reference
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Devotion Content */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <Sparkles className="h-5 w-5 text-purple-500" />
                                        <span>Your Devotion</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="title">Title</Label>
                                        <Input
                                            id="title"
                                            placeholder="Give your devotion a meaningful title..."
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="devotion-text">Devotion Text</Label>
                                        <Textarea
                                            id="devotion-text"
                                            placeholder="Share your thoughts, reflections, and how this verse speaks to you..."
                                            value={devotionText}
                                            onChange={(e) => setDevotionText(e.target.value)}
                                            rows={8}
                                        />
                                    </div>

                                    <div className="flex space-x-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={handleGenerateDevotion}
                                            disabled={isGeneratingDevotion || !verseReference || !verseContent || !selectedMood}
                                        >
                                            {isGeneratingDevotion ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                    Generating...
                                                </>
                                            ) : (
                                                <>
                                                    <Lightbulb className="h-4 w-4 mr-1" />
                                                    AI Writing Help
                                                </>
                                            )}
                                        </Button>
                                        {aiError && (
                                            <p className="text-sm text-red-500 mt-2">{aiError}</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Privacy & Save */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Privacy & Sharing</CardTitle>
                                    <CardDescription>Choose who can see your devotion</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            {isPublic ? (
                                                <Globe className="h-5 w-5 text-blue-500" />
                                            ) : (
                                                <Lock className="h-5 w-5 text-gray-500" />
                                            )}
                                            <div>
                                                <div className="font-medium">{isPublic ? "Share with Community" : "Keep Private"}</div>
                                                <div className="text-sm text-gray-500">
                                                    {isPublic
                                                        ? "Your devotion will be visible on the public feed (anonymous)"
                                                        : "Only you can see this devotion"}
                                                </div>
                                            </div>
                                        </div>
                                        <Switch checked={isPublic} onCheckedChange={setIsPublic} />
                                    </div>

                                    <Separator className="my-4" />

                                    <div className="flex space-x-3">
                                        <Button
                                            type="submit"
                                            className={`flex-1 ${!isFormValid || processing ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            disabled={!isFormValid || processing}
                                            variant={isFormValid ? 'default' : 'outline'}
                                        >
                                            {processing ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Creating...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="h-4 w-4 mr-2" />
                                                    Create Devotion
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Recent Devotions */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Your Recent Devotions</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {recentDevotions.length > 0 ? (
                                            recentDevotions.map((devotion) => (
                                                <div key={devotion.id} className="p-3 border rounded-lg">
                                                    <div className="font-medium text-sm">{devotion.title}</div>
                                                    <div className="text-xs text-gray-500">{devotion.verse}</div>
                                                    <div className="flex items-center mt-1">
                                                        {devotion.is_private ? (
                                                            <>
                                                                <Lock className="h-3 w-3 text-gray-400 mr-1" />
                                                                <span className="text-xs text-gray-500">Private</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Globe className="h-3 w-3 text-blue-400 mr-1" />
                                                                <span className="text-xs text-blue-500">Shared</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-sm text-gray-500 text-center py-4">
                                                No recent devotions found.
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Tips */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Writing Tips</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="text-sm space-y-2 text-gray-600">
                                        <li>• Start with how the verse makes you feel</li>
                                        <li>• Share a personal connection or memory</li>
                                        <li>• Think about practical applications</li>
                                        <li>• End with a prayer or reflection</li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
        </div>
    )
}
