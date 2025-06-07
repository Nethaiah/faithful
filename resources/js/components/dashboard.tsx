import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Plus, Search, Lock, Globe, Heart, Calendar, TrendingUp, ArrowRight } from "lucide-react"
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Link } from '@inertiajs/react';


export default function UserDashboard() {
    const [searchQuery, setSearchQuery] = useState("")
    const [filterPrivacy, setFilterPrivacy] = useState("all")

    const devotions = [
        {
          id: 1,
          title: "Finding Peace in the Storm",
          verse: "Philippians 4:7",
          mood: "Anxious",
          isPublic: false,
          createdAt: "2024-01-15",
          excerpt: "In times of uncertainty, God's peace serves as our anchor...",
          tags: ["peace", "anxiety", "trust"],
        },
        {
          id: 2,
          title: "Gratitude in Every Season",
          verse: "1 Thessalonians 5:18",
          mood: "Grateful",
          isPublic: true,
          createdAt: "2024-01-14",
          excerpt: "Thanksgiving isn't just for the good times...",
          tags: ["gratitude", "thanksgiving", "seasons"],
        },
        {
          id: 3,
          title: "Strength for the Journey",
          verse: "Isaiah 40:31",
          mood: "Struggling",
          isPublic: false,
          createdAt: "2024-01-13",
          excerpt: "When we feel weak and weary, God promises to renew our strength...",
          tags: ["strength", "perseverance", "hope"],
        },
      ]

      const stats = {
        totalDevotions: 12,
        publicDevotions: 5,
        privateDevotions: 7,
        currentStreak: 7,
        totalReads: 234,
      }

    return (
      <div className="w-full py-2 sm:py-4 px-2 sm:px-0">
        <div className="grid lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-3 sm:space-y-4 md:space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
              <Card className="h-full">
                <CardContent className="p-2 sm:p-3 md:p-4">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <BookOpen className="h-4 sm:h-5 w-4 sm:w-5 text-blue-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xl sm:text-2xl font-bold truncate">{stats.totalDevotions}</div>
                      <div className="text-xs sm:text-sm text-gray-500 truncate">Total Devotions</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="h-full">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <Calendar className="h-4 sm:h-5 w-4 sm:w-5 text-green-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xl sm:text-2xl font-bold truncate">{stats.currentStreak}</div>
                      <div className="text-xs sm:text-sm text-gray-500 truncate">Day Streak</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="h-full">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <Globe className="h-4 sm:h-5 w-4 sm:w-5 text-purple-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xl sm:text-2xl font-bold truncate">{stats.publicDevotions}</div>
                      <div className="text-xs sm:text-sm text-gray-500 truncate">Shared</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="h-full">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <TrendingUp className="h-4 sm:h-5 w-4 sm:w-5 text-orange-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xl sm:text-2xl font-bold truncate">{stats.totalReads}</div>
                      <div className="text-xs sm:text-sm text-gray-500 truncate">Community Reads</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filter */}
            <Card className="overflow-hidden">
              <CardContent className="p-3 sm:p-4">
                <div className="flex flex-col gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    <Input
                      placeholder="Search your devotions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-full"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={filterPrivacy === "all" ? "default" : "outline"}
                      size="sm"
                      className="flex-1 sm:flex-initial text-xs sm:text-sm"
                      onClick={() => setFilterPrivacy("all")}
                    >
                      All
                    </Button>
                    <Button
                      variant={filterPrivacy === "private" ? "default" : "outline"}
                      size="sm"
                      className="flex-1 sm:flex-initial text-xs sm:text-sm"
                      onClick={() => setFilterPrivacy("private")}
                    >
                      <Lock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      <span className="hidden xs:inline">Private</span>
                    </Button>
                    <Button
                      variant={filterPrivacy === "public" ? "default" : "outline"}
                      size="sm"
                      className="flex-1 sm:flex-initial text-xs sm:text-sm"
                      onClick={() => setFilterPrivacy("public")}
                    >
                      <Globe className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      <span className="hidden xs:inline">Shared</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Devotions List */}
            <div className="space-y-3 sm:space-y-4">
              {devotions.map((devotion) => (
                <Card key={devotion.id} className="hover:shadow-md transition-shadow overflow-hidden">
                  <CardHeader className="p-3 sm:p-4 md:p-6 pb-2 sm:pb-3 md:pb-4">
                    <div className="flex flex-col xs:flex-row xs:items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base sm:text-lg mb-1 truncate">{devotion.title}</CardTitle>
                        <CardDescription className="font-medium text-blue-600 text-sm sm:text-base">{devotion.verse}</CardDescription>
                      </div>
                      <div className="flex items-center space-x-2 self-start">
                        <Badge variant="outline" className="text-xs sm:text-sm">{devotion.mood}</Badge>
                        {devotion.isPublic ? (
                          <Globe className="h-4 w-4 text-blue-500 flex-shrink-0" />
                        ) : (
                          <Lock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
                    <p className="text-gray-600 mb-3 text-sm sm:text-base line-clamp-2">{devotion.excerpt}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
                      <div className="flex flex-wrap gap-1 overflow-x-auto pb-1 -mx-1 px-1">
                        {devotion.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-[10px] sm:text-xs whitespace-nowrap">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-2 text-xs sm:text-sm text-gray-500">
                        <span className="whitespace-nowrap text-xs sm:text-sm">{devotion.createdAt}</span>
                        <Button variant="ghost" size="sm" className="h-7 sm:h-8 px-2 sm:px-3 text-xs sm:text-sm" asChild>
                          <Link href={route('devotion.show', { id: devotion.id })} className="whitespace-nowrap">
                            View <ArrowRight className="ml-1 h-3 w-3 flex-shrink-0" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" asChild>
                  <Link href={route("devotion.create")}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Devotion
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href={route("discover")}>
                    <Heart className="h-4 w-4 mr-2" />
                    Mood Check-in
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href={route("discover")}>
                    <BookOpen className="h-4 w-4 mr-2" />
                    Random Verse
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Created "Finding Peace"</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Shared devotion publicly</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>7-day streak achieved!</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Community Impact */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Community Reads</span>
                    <span className="font-medium">234</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Devotions Shared</span>
                    <span className="font-medium">5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">This Week</span>
                    <span className="font-medium text-green-600">+12 reads</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Verse of the Day */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Today's Verse</CardTitle>
              </CardHeader>
              <CardContent>
                <blockquote className="text-sm italic text-gray-700 mb-2">
                  "Trust in the Lord with all your heart and lean not on your own understanding."
                </blockquote>
                <div className="text-xs text-gray-500 mb-3">Proverbs 3:5</div>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/create">Create Devotion</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
}
