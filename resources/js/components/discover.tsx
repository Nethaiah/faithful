"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Heart, BookOpen, Sparkles, RefreshCw, ArrowLeft, Loader2 } from "lucide-react"
import { Link, usePage, router } from "@inertiajs/react"
import { toast } from "sonner"
import { SharedData } from "@/types"

export default function MoodDiscovery() {
  const { auth } = usePage<SharedData>().props
  const [selectedMood, setSelectedMood] = useState("")
  const [customMood, setCustomMood] = useState("")
  const [showVerses, setShowVerses] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isRandomLoading, setIsRandomLoading] = useState(false)
  const [isMoodLoading, setIsMoodLoading] = useState<string | null>(null)
  const [isCustomMoodSubmitting, setIsCustomMoodSubmitting] = useState(false)
  const [isCreatingDevotion, setIsCreatingDevotion] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  // Check if any API request is in progress
  const isAnyRequestInProgress =
    isLoading ||
    isRandomLoading ||
    isMoodLoading !== null ||
    isCustomMoodSubmitting ||
    isCreatingDevotion ||
    isLoadingMore;
  const customMoodTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null)
  const [suggestedVerses, setSuggestedVerses] = useState<Array<{reference: string; text: string; theme: string}>>([])
  const [randomVerse, setRandomVerse] = useState<{reference: string; text: string; theme: string} | null>(null)
  const [visibleSuggestions, setVisibleSuggestions] = useState(5) // Show 5 suggestions initially

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
    setIsLoading(true);
    setSuggestedVerses([]);

    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

      const response = await fetch(route('verses.suggest'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': csrfToken
        },
        body: JSON.stringify({
          mood: mood,
          count: 15 // Fetch 15 suggestions
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch verse suggestions');
      }

      const data = await response.json();

      if (data.success && Array.isArray(data.verses)) {
        // Transform the verses to match our expected format
        const formattedVerses = data.verses.map((verse: { reference: string; preview: string }) => ({
          reference: verse.reference,
          text: verse.preview,
          theme: mood
        }));

        setSuggestedVerses(formattedVerses);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching verse suggestions:', error);
      toast.error('Failed to load verse suggestions. Please try again.');
      // Show error message if API call fails
      toast.error('Failed to load verse suggestions. Please try again later.');
      setSuggestedVerses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRandomVerse = async () => {
    setIsRandomLoading(true);
    setRandomVerse(null);
    setShowVerses(false);
    setSelectedMood('');
    setCustomMood('');

    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

      const response = await fetch(route('verses.suggest'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': csrfToken
        },
        body: JSON.stringify({
          mood: 'encouragement', // Generic mood that works well for random verses
          count: 1 // Fetch just one random verse
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch a random verse');
      }

      const data = await response.json();

      if (data.success && Array.isArray(data.verses) && data.verses.length > 0) {
        const verse = data.verses[0];
        const formattedVerse = {
          reference: verse.reference,
          text: verse.preview,
          theme: 'Encouragement'
        };

        setRandomVerse(formattedVerse);
        setShowVerses(true);
      } else {
        throw new Error('No verses found');
      }
    } catch (error) {
      console.error('Error fetching random verse:', error);
      toast.error('Failed to load a random verse. Please try again.');

      // Show error message if API call fails
      toast.error('Failed to load a random verse. Please try again.');
      setShowVerses(false);
    } finally {
      setIsRandomLoading(false);
    }
  };

  const handleRandomVerse = async () => {
    if (isRandomLoading) return;

    setIsRandomLoading(true);
    setRandomVerse(null);
    setShowVerses(false);

    try {
      await fetchRandomVerse();
      setShowVerses(true);
    } catch (error) {
      console.error('Error fetching random verse:', error);
      toast.error('Failed to load a random verse. Please try again.');
    } finally {
      setIsRandomLoading(false);
    }
  };

  const handleMoodSelect = async (mood: string) => {
    // Prevent multiple mood selections while a request is in progress
    if (isAnyRequestInProgress) return;

    try {
      setIsMoodLoading(mood);
      setSelectedMood(mood);
      setCustomMood("");
      setShowVerses(true);

      // Show a loading verse while fetching
      setSuggestedVerses([{
        reference: `Finding verses for ${mood}...`,
        text: 'Praying for the perfect verse for you...',
        theme: mood
      }]);

      await fetchVerseSuggestions(mood);
    } catch (error) {
      console.error('Error in handleMoodSelect:', error);
      toast.error('Failed to process your selection. Please try again.');
      setShowVerses(false);
    } finally {
      setIsMoodLoading(null);
    }
  };

  const handleCustomMoodSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMood.trim() || isCustomMoodSubmitting) return;

    try {
      setIsCustomMoodSubmitting(true);
      setSelectedMood(customMood);
      setShowVerses(true);
      await fetchVerseSuggestions(customMood);
    } catch (error) {
      console.error('Error in handleCustomMoodSubmit:', error);
      toast.error('Failed to process your custom mood. Please try again.');
    } finally {
      setIsCustomMoodSubmitting(false);
    }
  };

  const handleCustomMoodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomMood(value);

    // Clear any existing timeout
    if (customMoodTimeoutRef.current) {
      clearTimeout(customMoodTimeoutRef.current);
    }

    // If input is not empty, set a timeout to fetch suggestions
    if (value.trim()) {
      customMoodTimeoutRef.current = setTimeout(() => {
        handleMoodSelect(value.trim());
      }, 800) as unknown as ReturnType<typeof setTimeout>; // 800ms debounce
    }
  };

  const handleCreateDevotion = async (verseRef: string, verseText: string, mood?: string) => {
    if (isCreatingDevotion) return;

    if (!auth.user) {
      router.visit(route('login'));
      return;
    }

    setIsCreatingDevotion(true);

    try {
      const params = new URLSearchParams({
        verse: verseRef,
        verse_content: verseText,
        ...(mood && { mood })
      });

      router.visit(`/devotion/create?${params.toString()}`);
    } catch (error) {
      console.error('Error navigating to create devotion:', error);
      toast.error('Failed to open devotion creator. Please try again.');
    } finally {
      setIsCreatingDevotion(false);
    }
  };

  const handleLoadMore = () => {
    if (isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      // Simulate a small delay for better UX
      setTimeout(() => {
        setVisibleSuggestions(prev => Math.min(prev + 5, suggestedVerses.length));
        setIsLoadingMore(false);
      }, 300);
    } catch (error) {
      console.error('Error loading more suggestions:', error);
      setIsLoadingMore(false);
    }
  };

  return (
    <div className="w-full py-4 sm:py-6 px-2 sm:px-4">
      <div className="mb-6 text-center px-1">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4 leading-tight">
          Find God's Word for Your Heart
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
          Share how you're feeling today, and discover Bible verses that speak directly to your situation
        </p>
      </div>

          {/* Mood Selection */}
          <Card className="mb-6 sm:mb-8 overflow-hidden">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center space-x-2 text-xl sm:text-2xl">
                <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-red-500 flex-shrink-0" />
                <span>How are you feeling today?</span>
              </CardTitle>
              <CardDescription className="text-sm sm:text-base mt-1">
                Select the mood that best describes your current state of heart and mind
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-6">
                {isMoodLoading ? (
                  <div className="col-span-full flex flex-col items-center justify-center p-6 bg-blue-50 rounded-lg">
                    <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-2" />
                    <p className="text-blue-700 text-center">Finding verses for {isMoodLoading}...</p>
                    <p className="text-sm text-blue-600">This may take a moment</p>
                  </div>
                ) : (
                  moods.map((mood) => (
                    <button
                      key={mood.name}
                      onClick={() => handleMoodSelect(mood.name)}
                      disabled={isAnyRequestInProgress}
                      className={`flex items-center justify-center p-3 rounded-lg transition-all ${mood.color}
                        ${selectedMood === mood.name ? 'ring-2 ring-offset-2 ring-blue-500' : ''}
                        ${isAnyRequestInProgress ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
                    >
                      <span className="text-xl mr-2">{mood.icon}</span>
                      <span>{mood.name}</span>
                    </button>
                  ))
                )}
              </div>

              {/* Custom Mood Input */}
              <div className="border-t border-gray-100 pt-4 sm:pt-6">
                <h3 className="font-semibold text-sm sm:text-base mb-2 sm:mb-3">Or describe your own feeling:</h3>
                <div className="relative">
                  <form onSubmit={handleCustomMoodSubmit} className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        type="text"
                        placeholder="I'm feeling... (e.g., overwhelmed by work, excited about new opportunities)"
                        value={customMood}
                        onChange={handleCustomMoodChange}
                        className="w-full pr-10"
                      />
                      {isLoading && (
                        <div className="absolute right-2.5 top-2.5">
                          <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                        </div>
                      )}
                    </div>
                    <Button
                      type="submit"
                      disabled={!customMood.trim() || isCustomMoodSubmitting}
                      className="shrink-0"
                    >
                      <Sparkles className="h-4 w-4 mr-1.5" />
                      {isCustomMoodSubmitting ? 'Searching...' : 'Find Verses'}
                    </Button>
                  </form>
                  {customMood && !isLoading && showVerses && (
                    <p className="mt-2 text-sm text-gray-500">
                      Showing verses related to: <span className="font-medium">{customMood}</span>
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Verses Section */}
          {showVerses && selectedMood && (
            <Card className="mb-6 sm:mb-8 overflow-hidden">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <CardTitle className="text-lg sm:text-xl">
                    Verses for when you're feeling {selectedMood}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-4 sm:space-y-6">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
                    <p className="text-gray-600 text-center">
                      Finding the perfect Bible verses for you...
                    </p>
                    <p className="text-sm text-gray-500 mt-2">Searching through thousands of verses...</p>
                  </div>
                ) : suggestedVerses.length > 0 ? (
                  <div className="space-y-4">
                    {suggestedVerses.slice(0, visibleSuggestions).map((verse, index) => (
                      <Card key={index} className="border-l-4 border-blue-500 hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start">
                            <BookOpen className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                            <div className="w-full">
                              <div className="flex justify-between items-start">
                                <h3 className="font-semibold text-blue-800">{verse.reference}</h3>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {verse.theme}
                                </span>
                              </div>
                              <p className="mt-2 text-gray-700 leading-relaxed">"{verse.text}"</p>
                              <div className="mt-3 flex justify-end">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-blue-600 hover:text-blue-800"
                                  onClick={() => handleCreateDevotion(
                                    verse.reference,
                                    verse.text,
                                    selectedMood || undefined // Pass the current mood if available
                                  )}
                                  disabled={isCreatingDevotion}
                                >
                                  {auth.user ? (
                                    'Create Devotion with this Verse'
                                  ) : (
                                    'Sign in to Create Devotion'
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {/* Show More/Less Buttons */}
                    {suggestedVerses.length > 5 && (
                      <div className="flex justify-center mt-4">
                        {visibleSuggestions < suggestedVerses.length ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleLoadMore}
                            disabled={isLoadingMore}
                            className="text-sm"
                          >
                            Show More Verses ({suggestedVerses.length - visibleSuggestions} more)
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setVisibleSuggestions(5)}
                            className="text-sm"
                          >
                            Show Less
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No verses found for this mood. Please try another mood or check back later.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Random Verse Option */}
          <Card className="mt-6 sm:mt-8">
            <CardContent className="p-4 sm:p-6">
              <div className="text-center mb-4">
                <h3 className="font-semibold text-base sm:text-lg mb-2">Not sure how you're feeling?</h3>
                <p className="text-gray-600 text-sm sm:text-base mb-4">Get a random verse to inspire your day</p>
                <Button
                  variant="outline"
                  className="text-sm sm:text-base"
                  onClick={fetchRandomVerse}
                  disabled={isRandomLoading}
                >
                  {isRandomLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Finding a verse...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Get Random Verse
                    </>
                  )}
                </Button>
              </div>

              {showVerses && randomVerse && (
                <div className="mt-6 border-t pt-6">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <div className="flex items-start">
                      <BookOpen className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                      <div className="w-full">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-blue-800">{randomVerse.reference}</h3>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {randomVerse.theme}
                          </span>
                        </div>
                        <p className="mt-2 text-gray-700 leading-relaxed">"{randomVerse.text}"</p>
                        <div className="mt-3 flex justify-end">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => handleCreateDevotion(
                            randomVerse.reference,
                            randomVerse.text,
                            selectedMood || undefined // Pass the current mood if available
                            )}
                        >
                            {auth.user ? (
                            'Create Devotion with this Verse'
                            ) : (
                            'Sign in to Create Devotion'
                            )}
                        </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
    </div>
  )
}
