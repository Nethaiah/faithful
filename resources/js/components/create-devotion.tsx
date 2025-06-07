"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { BookOpen, Heart, Sparkles, Lock, Globe, Save, Lightbulb, ArrowLeft } from "lucide-react"
import { Link } from "@inertiajs/react"

export function DevotionCreation() {
  const [isPublic, setIsPublic] = useState(false)
  const [selectedMood, setSelectedMood] = useState("")
  const [verseReference, setVerseReference] = useState("")
  const [verseContent, setVerseContent] = useState("")
  const [title, setTitle] = useState("")
  const [devotionText, setDevotionText] = useState("")

  const moods = [
    { name: "Anxious", color: "bg-red-100 text-red-800", icon: "😰" },
    { name: "Grateful", color: "bg-green-100 text-green-800", icon: "🙏" },
    { name: "Struggling", color: "bg-orange-100 text-orange-800", icon: "💪" },
    { name: "Joyful", color: "bg-yellow-100 text-yellow-800", icon: "😊" },
    { name: "Confused", color: "bg-purple-100 text-purple-800", icon: "🤔" },
  ]

  const suggestedVerses = [
    { reference: "Philippians 4:6-7", preview: "Do not be anxious about anything..." },
    { reference: "Matthew 11:28", preview: "Come to me, all you who are weary..." },
    { reference: "Psalm 23:4", preview: "Even though I walk through the valley..." },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-7xl px-4 py-4">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href={route('dashboard')} className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Devotion</h1>
          <p className="text-gray-600">Let AI help you discover God's word for your heart today</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Creation Form */}
          <div className="lg:col-span-2 space-y-6">
              {/* Mood Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    <span>How are you feeling today?</span>
                  </CardTitle>
                  <CardDescription>Select your current mood to get personalized verse suggestions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {moods.map((mood) => (
                      <Button
                        key={mood.name}
                        variant={selectedMood === mood.name ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedMood(mood.name)}
                        className="flex items-center space-x-1"
                      >
                        <span>{mood.icon}</span>
                        <span>{mood.name}</span>
                      </Button>
                    ))}
                  </div>
                  {selectedMood && (
                    <div className="mt-4">
                      <Button variant="outline" size="sm" asChild>
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
                    <Input
                      id="verse-reference"
                      placeholder="e.g., John 3:16 or Psalm 23:1"
                      value={verseReference}
                      onChange={(e) => setVerseReference(e.target.value)}
                    />
                  </div>

                  {selectedMood && (
                    <div>
                      <Label className="text-sm font-medium">Suggested verses for "{selectedMood}":</Label>
                      <div className="mt-2 space-y-2">
                        {suggestedVerses.map((verse, index) => (
                          <Button
                            key={index}
                            variant="ghost"
                            className="w-full justify-start h-auto p-3 text-left"
                            onClick={() => setVerseReference(verse.reference)}
                          >
                            <div>
                              <div className="font-medium text-blue-600">{verse.reference}</div>
                              <div className="text-sm text-gray-500">{verse.preview}</div>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="verse-content">Verse Content</Label>
                    <Textarea
                      id="verse-content"
                      placeholder="The verse content will appear here automatically..."
                      value={verseContent}
                      onChange={(e) => setVerseContent(e.target.value)}
                      rows={3}
                      className="bg-blue-50/50"
                    />
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
                    <Button variant="outline" size="sm">
                      <Lightbulb className="h-4 w-4 mr-1" />
                      AI Writing Help
                    </Button>
                    <Button variant="outline" size="sm">
                      Suggest Themes
                    </Button>
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
                    <Button className="flex-1" asChild>
                      <Link href="/dashboard">
                        <Save className="h-4 w-4 mr-2" />
                        Save Devotion
                      </Link>
                    </Button>
                    <Button variant="outline">Preview</Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* AI Assistant */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">AI Assistant</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Help me understand this verse
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    What does this mean for daily life?
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    How can I apply this today?
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Find related verses
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Devotions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Recent Devotions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <div className="font-medium text-sm">Finding Peace</div>
                      <div className="text-xs text-gray-500">Philippians 4:7</div>
                      <div className="flex items-center mt-1">
                        <Lock className="h-3 w-3 text-gray-400 mr-1" />
                        <span className="text-xs text-gray-500">Private</span>
                      </div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="font-medium text-sm">Grateful Heart</div>
                      <div className="text-xs text-gray-500">1 Thess 5:18</div>
                      <div className="flex items-center mt-1">
                        <Globe className="h-3 w-3 text-blue-400 mr-1" />
                        <span className="text-xs text-blue-500">Shared</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tips */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Writing Tips</CardTitle>
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
        </div>
      </div>
  )
}
