"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Heart, BookOpen, Sparkles, RefreshCw, ArrowLeft } from "lucide-react"
import { Link } from "@inertiajs/react"
import { usePage } from "@inertiajs/react"
import { type SharedData } from "@/types"

export function MoodDiscovery() {
    const { auth } = usePage<SharedData>().props
  const [selectedMood, setSelectedMood] = useState("")
  const [customMood, setCustomMood] = useState("")
  const [showVerses, setShowVerses] = useState(false)

  const moods = [
    {
      name: "Anxious",
      emoji: "😰",
      color: "bg-red-100 text-red-800 border-red-200",
      description: "Feeling worried or stressed about the future",
    },
    {
      name: "Grateful",
      emoji: "🙏",
      color: "bg-green-100 text-green-800 border-green-200",
      description: "Thankful for blessings and good things",
    },
    {
      name: "Struggling",
      emoji: "💪",
      color: "bg-orange-100 text-orange-800 border-orange-200",
      description: "Going through difficult times or challenges",
    },
    {
      name: "Joyful",
      emoji: "😊",
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      description: "Happy and celebrating good news",
    },
    {
      name: "Confused",
      emoji: "🤔",
      color: "bg-purple-100 text-purple-800 border-purple-200",
      description: "Uncertain about decisions or direction",
    },
    {
      name: "Lonely",
      emoji: "😔",
      color: "bg-blue-100 text-blue-800 border-blue-200",
      description: "Feeling isolated or disconnected",
    },
  ]

  const versesByMood = {
    Anxious: [
      {
        reference: "Philippians 4:6-7",
        text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.",
        theme: "Peace & Prayer",
      },
      {
        reference: "Matthew 6:26",
        text: "Look at the birds of the air; they do not sow or reap or store away in barns, and yet your heavenly Father feeds them. Are you not much more valuable than they?",
        theme: "God's Care",
      },
      {
        reference: "1 Peter 5:7",
        text: "Cast all your anxiety on him because he cares for you.",
        theme: "Casting Burdens",
      },
    ],
    Grateful: [
      {
        reference: "1 Thessalonians 5:18",
        text: "Give thanks in all circumstances; for this is God's will for you in Christ Jesus.",
        theme: "Thanksgiving",
      },
      {
        reference: "Psalm 100:4",
        text: "Enter his gates with thanksgiving and his courts with praise; give thanks to him and praise his name.",
        theme: "Praise & Worship",
      },
      {
        reference: "Ephesians 5:20",
        text: "Always giving thanks to God the Father for everything, in the name of our Lord Jesus Christ.",
        theme: "Constant Gratitude",
      },
    ],
    Struggling: [
      {
        reference: "Isaiah 40:31",
        text: "But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.",
        theme: "Renewed Strength",
      },
      {
        reference: "Romans 8:28",
        text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
        theme: "God's Purpose",
      },
      {
        reference: "2 Corinthians 4:17",
        text: "For our light and momentary troubles are achieving for us an eternal glory that far outweighs them all.",
        theme: "Eternal Perspective",
      },
    ],
  }

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood)
    setShowVerses(true)
  }

  const currentVerses = selectedMood ? versesByMood[selectedMood as keyof typeof versesByMood] || [] : []

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-7xl px-3 sm:px-4 py-3 sm:py-4">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center mb-3 sm:mb-4">
            <Button
              variant="ghost"
              size="sm"
              className="px-2 sm:px-3 py-1.5 h-auto"
              asChild
            >
              {auth.user ? (
                    <Link href={route('dashboard')}>
                      <ArrowLeft className="h-4 w-4 mr-1.5 sm:mr-2 flex-shrink-0" />
                      <span className="text-sm sm:text-base">Back to Dashboard</span>
                    </Link>
                  ) : (
                    <Link href={route('home')}>
                      <ArrowLeft className="h-4 w-4 mr-1.5 sm:mr-2 flex-shrink-0" />
                      <span className="text-sm sm:text-base">Back to Home</span>
                    </Link>
                  )}
                </Button>
            </div>
            <div className="text-center px-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4 leading-tight">
                Find God's Word for Your Heart
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
                Share how you're feeling today, and discover Bible verses that speak directly to your situation
              </p>
            </div>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                {moods.map((mood) => (
                  <Button
                    key={mood.name}
                    variant={selectedMood === mood.name ? "default" : "outline"}
                    className={`h-auto p-3 sm:p-4 flex flex-col items-start space-y-1.5 sm:space-y-2 text-left ${
                      selectedMood === mood.name
                        ? 'shadow-sm'
                        : 'hover:bg-gray-50 active:bg-gray-100 transition-colors'
                    }`}
                    onClick={() => handleMoodSelect(mood.name)}
                  >
                    <div className="flex items-center space-x-2 w-full">
                      <span className="text-2xl flex-shrink-0">{mood.emoji}</span>
                      <span className="font-semibold text-sm sm:text-base truncate">{mood.name}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-left text-gray-600 font-normal line-clamp-2">
                      {mood.description}
                    </p>
                  </Button>
                ))}
              </div>

              {/* Custom Mood Input */}
              <div className="border-t border-gray-100 pt-4 sm:pt-6">
                <h3 className="font-semibold text-sm sm:text-base mb-2 sm:mb-3">Or describe your own feeling:</h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <Textarea
                      placeholder="I'm feeling... (e.g., overwhelmed by work, excited about new opportunities, missing a loved one)"
                      value={customMood}
                      onChange={(e) => setCustomMood(e.target.value)}
                      rows={2}
                      className="w-full text-sm sm:text-base"
                    />
                  </div>
                  <Button
                    className="w-full sm:w-auto sm:min-w-[120px] h-auto py-2 sm:py-2.5"
                    onClick={() => {
                      if (customMood.trim()) {
                        setSelectedMood(customMood)
                        setShowVerses(true)
                      }
                    }}
                    disabled={!customMood.trim()}
                  >
                    <Sparkles className="h-4 w-4 mr-1.5 sm:mr-2 flex-shrink-0" />
                    <span className="text-sm sm:text-base">Find Verses</span>
                  </Button>
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
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto"
                    onClick={() => {
                      setShowVerses(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <RefreshCw className="h-4 w-4 mr-1.5 sm:mr-2 flex-shrink-0" />
                    <span>Change Mood</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-4 sm:space-y-6">
                {currentVerses.length > 0 ? (
                  <div className="space-y-4">
                    {currentVerses.map((verse, index) => (
                      <div
                        key={index}
                        className="border border-gray-100 rounded-lg p-3 sm:p-4 hover:shadow-sm transition-shadow bg-white"
                      >
                        <div className="flex items-start gap-3">
                          <div className="bg-blue-50 text-blue-600 rounded-full p-2 mt-0.5 flex-shrink-0">
                            <BookOpen className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm sm:text-base text-blue-700 mb-1.5 leading-tight">
                              {verse.reference} - {verse.theme}
                            </h3>
                            <p className="text-gray-700 text-sm sm:text-base italic">"{verse.text}"</p>
                          </div>
                        </div>
                      </div>
                    ))}

                    {selectedMood.startsWith("Custom:") && (
                      <div className="mt-4">
                        <Card className="bg-purple-50 border-purple-200">
                          <CardHeader className="py-3">
                            <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                              <Sparkles className="h-5 w-5 text-purple-600 flex-shrink-0" />
                              <span>AI-Powered Suggestions</span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <p className="text-gray-600 text-sm sm:text-base mb-4">
                              Based on your specific feeling, our AI is finding the most relevant Bible verses for you...
                            </p>
                            <div className="flex items-center space-x-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                              <span className="text-xs sm:text-sm text-purple-600">Searching through thousands of verses...</span>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6 sm:py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 text-sm sm:text-base">
                      No verses found for this mood. Try another feeling.
                    </p>
                  </div>
                )}
              </CardContent>
        </Card>
      )}

        {/* Random Verse Option */}
        <Card className="text-center mt-6 sm:mt-8">
          <CardContent className="p-4 sm:p-6">
            <h3 className="font-semibold text-base sm:text-lg mb-2">Not sure how you're feeling?</h3>
            <p className="text-gray-600 text-sm sm:text-base mb-4">Get a random verse to inspire your day</p>
            <Button variant="outline" className="text-sm sm:text-base">
              <Sparkles className="h-4 w-4 mr-2" />
              Random Verse of the Day
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
