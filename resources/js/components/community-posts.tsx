"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Heart,
  Search,
  Filter,
  BookOpen,
  Users,
  Clock,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Mock data for community posts
const communityPosts = [
  {
    id: 1,
    author: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "SJ",
      verified: true,
    },
    title: "Finding Peace in Psalm 23",
    content:
      "Today I was reminded of God's faithfulness through the valley. The Lord truly is my shepherd, and even in the darkest moments, His presence brings comfort...",
    verse: "The Lord is my shepherd; I shall not want. - Psalm 23:1",
    mood: "Peaceful",
    likes: 24,
    timeAgo: "2 hours ago",
  },
  {
    id: 2,
    author: {
      name: "Michael Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "MC",
      verified: false,
    },
    title: "Gratitude in Small Moments",
    content:
      "Sometimes God speaks through the smallest blessings. This morning's sunrise reminded me that every day is a gift from above...",
    verse: "This is the day that the Lord has made; let us rejoice and be glad in it. - Psalm 118:24",
    mood: "Joyful",
    likes: 18,
    timeAgo: "4 hours ago",
  },
  {
    id: 3,
    author: {
      name: "Emma Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "ER",
      verified: true,
    },
    title: "Strength Through Trials",
    content:
      "Walking through a difficult season has taught me to lean on God's strength rather than my own. His grace is truly sufficient...",
    verse: "My grace is sufficient for you, for my power is made perfect in weakness. - 2 Corinthians 12:9",
    mood: "Hopeful",
    likes: 32,
    timeAgo: "6 hours ago",
  },
]

const categories = ["All", "Reflection", "Gratitude", "Encouragement", "Prayer", "Study", "Testimony"]
const moods = ["All", "Peaceful", "Joyful", "Hopeful", "Contemplative", "Grateful", "Seeking"]

export function CommunityPosts() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedMood, setSelectedMood] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("feed")

  const CommunityPost = ({ post }: { post: any }) => (
    <Card
      className={cn(
        "mb-4 sm:mb-6 transition-all duration-200 hover:shadow-md overflow-hidden",
      )}
    >
      <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6 pt-3 sm:pt-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start flex-1 min-w-0 gap-2 sm:gap-3">
            <Avatar className="h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0">
              <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
              <AvatarFallback className="bg-blue-100 text-blue-700 text-xs sm:text-sm">
                {post.author.initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                  {post.author.name}
                </h4>
              </div>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs sm:text-sm text-gray-500">
                <span className="flex items-center">
                  <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                  {post.timeAgo}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 px-3 sm:px-6 pb-3 sm:pb-4">
        <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-1.5 sm:mb-2 line-clamp-2">
          {post.title}
        </h3>

        {/* Verse Highlight */}
        <div className="bg-blue-50 border-l-2 sm:border-l-4 border-blue-400 p-2 sm:p-3 mb-2 sm:mb-3 rounded-r-md">
          <p className="text-blue-800 font-medium italic text-sm sm:text-base leading-snug">
            "{post.verse}"
          </p>
        </div>

        <p className="text-gray-700 text-sm sm:text-base mb-3 sm:mb-4 leading-relaxed line-clamp-3">
          {post.content}
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-red-500 h-8 px-2 sm:px-3 text-xs sm:text-sm"
            >
              <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
              <span>{post.likes}</span>
            </Button>
          </div>

          <Badge variant="outline" className="text-[10px] sm:text-xs h-6 px-2 self-end sm:self-auto">
            <span className="hidden sm:inline">Mood: </span>
            <span className="sm:ml-0.5">{post.mood}</span>
          </Badge>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-7xl px-4 py-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Faithful Community</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Share your spiritual journey, find encouragement, and grow together in faith
          </p>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Card className="text-center p-3 sm:p-4 hover:shadow-sm transition-shadow">
            <Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 mx-auto mb-1 sm:mb-2" />
            <h3 className="font-semibold text-gray-900 text-lg sm:text-xl">2,847</h3>
            <p className="text-xs sm:text-sm text-gray-600">Community Members</p>
          </Card>
          <Card className="text-center p-3 sm:p-4 hover:shadow-sm transition-shadow">
            <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 mx-auto mb-1 sm:mb-2" />
            <h3 className="font-semibold text-gray-900 text-lg sm:text-xl">1,293</h3>
            <p className="text-xs sm:text-sm text-gray-600">Devotions Shared</p>
          </Card>
          <Card className="text-center p-3 sm:p-4 hover:shadow-sm transition-shadow">
            <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-red-600 mx-auto mb-1 sm:mb-2" />
            <h3 className="font-semibold text-gray-900 text-lg sm:text-xl">8,421</h3>
            <p className="text-xs sm:text-sm text-gray-600">Hearts Given</p>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">

          <TabsContent value="feed">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Sidebar Filters */}
              <div className="lg:col-span-1">
                <Card className="p-3 sm:p-4 sticky top-4 overflow-hidden">
                  <h3 className="font-semibold text-sm sm:text-base mb-3 sm:mb-4 flex items-center">
                    <Filter className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>Filters</span>
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2 block">Search</label>
                      <div className="relative">
                        <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                          placeholder="Search posts..."
                          className="pl-9 sm:pl-10 h-9 sm:h-10 text-sm sm:text-base"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2 block">Mood</label>
                      <div className="flex flex-wrap gap-1.5">
                        {moods.map((mood) => (
                          <Badge
                            key={mood}
                            variant={selectedMood === mood ? "default" : "outline"}
                            className="cursor-pointer text-[10px] sm:text-xs h-6 px-2"
                            onClick={() => setSelectedMood(mood)}
                          >
                            {mood}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Main Feed */}
              <div className="lg:col-span-3">

                {/* Community Posts */}
                <div>
                  {communityPosts.map((post) => (
                    <CommunityPost key={post.id} post={post} />
                  ))}
                </div>

                {/* Load More */}
                <div className="text-center mt-6 sm:mt-8">
                  <Button variant="outline" className="px-6 sm:px-8 h-10 sm:h-10 text-sm sm:text-base">
                    Load More Posts
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="trending" className="mt-6">
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Trending Posts</h3>
              <p className="text-gray-600">Discover the most popular devotions and discussions</p>
            </div>
          </TabsContent>

          <TabsContent value="following" className="mt-6">
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Following</h3>
              <p className="text-gray-600">Posts from people you follow will appear here</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
