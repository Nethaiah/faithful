"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Heart, BookOpen, Sparkles, RefreshCw, Plus, ArrowLeft } from "lucide-react"
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
    <div className="min-h-screen">
        <div className="container mx-auto max-w-7xl px-4 py-4">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
                {auth.user ? (
                    <>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href={route('dashboard')}>
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Dashboard
                            </Link>
                        </Button>
                    </>
                ) : (
                    <>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href={route('home')}>
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Home
                            </Link>
                        </Button>
                    </>
                )}
            </div>
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Find God's Word for Your Heart</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Share how you're feeling today, and discover Bible verses that speak directly to your situation
              </p>
            </div>
          </div>

          {/* Mood Selection */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-2xl">
                <Heart className="h-6 w-6 text-red-500" />
                <span>How are you feeling today?</span>
              </CardTitle>
              <CardDescription className="text-base">
                Select the mood that best describes your current state of heart and mind
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {moods.map((mood) => (
                  <Button
                    key={mood.name}
                    variant={selectedMood === mood.name ? "default" : "outline"}
                    className={`h-auto p-4 flex flex-col items-start space-y-2 ${
                      selectedMood === mood.name ? "" : "hover:bg-gray-50 text"
                    }`}
                    onClick={() => handleMoodSelect(mood.name)}
                  >
                    <div className="flex items-center space-x-2 w-full">
                      <span className="text-2xl">{mood.emoji}</span>
                      <span className="font-semibold">{mood.name}</span>
                    </div>
                    <p className="text-sm text-left text-gray-600 font-normal">{mood.description}</p>
                  </Button>
                ))}
              </div>

              {/* Custom Mood Input */}
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-3">Or describe your own feeling:</h3>
                <div className="flex space-x-3">
                  <Textarea
                    placeholder="I'm feeling... (e.g., overwhelmed by work, excited about new opportunities, missing a loved one)"
                    value={customMood}
                    onChange={(e) => setCustomMood(e.target.value)}
                    rows={2}
                    className="flex-1"
                  />
                  <Button
                    onClick={() => {
                      if (customMood.trim()) {
                        setSelectedMood("Custom: " + customMood)
                        setShowVerses(true)
                      }
                    }}
                    disabled={!customMood.trim()}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Find Verses
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Verse Suggestions */}
          {showVerses && (
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2 text-2xl">
                    <BookOpen className="h-6 w-6 text-blue-500" />
                    <span>Verses for "{selectedMood}"</span>
                  </CardTitle>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    More Suggestions
                  </Button>
                </div>
                <CardDescription className="text-base">
                  Here are Bible verses that speak to your current situation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {currentVerses.map((verse, index) => (
                    <Card key={index} className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg text-blue-600 mb-1">{verse.reference}</CardTitle>
                            <Badge variant="secondary">{verse.theme}</Badge>
                          </div>
                          <Button size="sm" asChild>
                            <Link href="/create">
                              <Plus className="h-4 w-4 mr-1" />
                              Create Devotion
                            </Link>
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <blockquote className="text-gray-700 italic text-lg leading-relaxed">"{verse.text}"</blockquote>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* AI-Powered Custom Suggestions */}
                {selectedMood.startsWith("Custom:") && (
                  <Card className="mt-6 bg-purple-50 border-purple-200">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-lg">
                        <Sparkles className="h-5 w-5 text-purple-600" />
                        <span>AI-Powered Suggestions</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">
                        Based on your specific feeling, our AI is finding the most relevant Bible verses for you...
                      </p>
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                        <span className="text-sm text-purple-600">Searching through thousands of verses...</span>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          )}

          {/* Call to Action */}
          

          {/* Random Verse Option */}
          <Card className="text-center">
            <CardContent className="py-6">
              <h3 className="font-semibold mb-2">Not sure how you're feeling?</h3>
              <p className="text-gray-600 mb-4">Get a random verse to inspire your day</p>
              <Button variant="outline">
                <Sparkles className="h-4 w-4 mr-2" />
                Random Verse of the Day
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
  )
}
