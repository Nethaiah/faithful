"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { BookOpen, Heart, Share2, ArrowLeft, Globe, Lock, Calendar, User } from "lucide-react"
import { Link } from "@inertiajs/react"

interface DevotionViewProps {
  devotionId: string
}

export function DevotionView({ devotionId }: DevotionViewProps) {
  // Mock devotion data - in real app this would come from API
  const devotion = {
    id: devotionId,
    title: "Finding Peace in the Storm",
    verse: "Philippians 4:6-7",
    verseText:
      "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.",
    content: `In times of uncertainty and worry, this passage from Philippians offers us a profound truth about God's peace. The apostle Paul, writing from prison, reminds us that anxiety doesn't have to control our hearts.

When I first read this verse during a particularly stressful season of my life, I was struck by the phrase "which transcends all understanding." God's peace isn't dependent on our circumstances making sense or everything working out perfectly. It's a supernatural peace that guards our hearts even in the midst of chaos.

The key is found in the action Paul describes: "by prayer and petition, with thanksgiving, present your requests to God." Notice that thanksgiving comes before presenting our requests. This isn't about denying our struggles, but about remembering God's faithfulness even in difficult times.

Today, whatever storm you're facing, remember that God's peace is available to you. It's not a peace that comes from having all the answers, but from trusting the One who does.

**Prayer:** Lord, help me to bring my anxieties to You with thanksgiving. Guard my heart and mind with Your peace that surpasses understanding. Amen.`,
    mood: "Anxious",
    tags: ["peace", "anxiety", "prayer", "trust"],
    isPublic: true,
    createdAt: "2024-01-15",
    author: "Anonymous Community Member",
    readTime: "3 min read",
    communityReads: 45,
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="py-8">
        <div className="container mx-auto max-w-4xl px-4">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline">{devotion.mood}</Badge>
                        {devotion.isPublic ? (
                          <div className="flex items-center space-x-1 text-sm text-blue-600">
                            <Globe className="h-3 w-3" />
                            <span>Community</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <Lock className="h-3 w-3" />
                            <span>Private</span>
                          </div>
                        )}
                      </div>
                      <CardTitle className="text-3xl mb-2">{devotion.title}</CardTitle>
                      <CardDescription className="text-lg font-medium text-blue-600">{devotion.verse}</CardDescription>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{devotion.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{devotion.createdAt}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{devotion.readTime}</span>
                    </div>
                    {devotion.isPublic && (
                      <div className="flex items-center space-x-1">
                        <Heart className="h-4 w-4" />
                        <span>{devotion.communityReads} reads</span>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  {/* Bible Verse */}
                  <Card className="mb-6 bg-blue-50 border-blue-200">
                    <CardContent className="pt-6">
                      <blockquote className="text-lg italic text-gray-700 leading-relaxed">
                        "{devotion.verseText}"
                      </blockquote>
                      <div className="text-right mt-4">
                        <span className="text-sm font-medium text-blue-600">— {devotion.verse}</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Devotion Content */}
                  <div className="prose prose-lg max-w-none">
                    {devotion.content.split("\n\n").map((paragraph, index) => (
                      <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                        {paragraph.startsWith("**") && paragraph.endsWith("**") ? (
                          <strong className="text-gray-900">{paragraph.slice(2, -2)}</strong>
                        ) : (
                          paragraph
                        )}
                      </p>
                    ))}
                  </div>

                  <Separator className="my-6" />

                  {/* Tags */}
                  <div className="flex items-center space-x-2 mb-6">
                    <span className="text-sm font-medium text-gray-500">Tags:</span>
                    {devotion.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-3">
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button variant="outline" size="sm">
                      <Heart className="h-4 w-4 mr-2" />
                      Save to Favorites
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/create">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Create Similar
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Related Verses */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Related Verses</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="font-medium text-sm text-blue-600">Matthew 6:26</div>
                    <div className="text-xs text-gray-500 mt-1">God's care for creation</div>
                  </div>
                  <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="font-medium text-sm text-blue-600">1 Peter 5:7</div>
                    <div className="text-xs text-gray-500 mt-1">Casting your cares</div>
                  </div>
                  <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="font-medium text-sm text-blue-600">Isaiah 26:3</div>
                    <div className="text-xs text-gray-500 mt-1">Perfect peace</div>
                  </div>
                </CardContent>
              </Card>

              {/* Similar Devotions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Similar Devotions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="font-medium text-sm">Trusting in Uncertainty</div>
                    <div className="text-xs text-gray-500 mt-1">Proverbs 3:5-6</div>
                    <Badge variant="outline" className="text-xs mt-2">
                      Anxious
                    </Badge>
                  </div>
                  <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="font-medium text-sm">God's Faithful Promises</div>
                    <div className="text-xs text-gray-500 mt-1">2 Corinthians 1:20</div>
                    <Badge variant="outline" className="text-xs mt-2">
                      Struggling
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/create">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Create New Devotion
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/discover">
                      <Heart className="h-4 w-4 mr-2" />
                      Find Verses by Mood
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/dashboard">
                      <User className="h-4 w-4 mr-2" />
                      View My Devotions
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
