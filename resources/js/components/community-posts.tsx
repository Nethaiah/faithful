"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Search,
  BookOpen,
  Users,
  Globe,
  Lock,
  User as UserIcon,
  Calendar as CalendarIcon,
  ArrowRight,
  Loader2,
  Heart,
  TrendingUp,
  Plus,
  ArrowLeft
} from "lucide-react"
import { cn } from "@/lib/utils"
import { router, Link } from "@inertiajs/react"
import { formatDistanceToNow } from "date-fns"

export interface Devotion {
  id: number;
  title: string;
  verse: string;
  verse_content: string;
  content: string;
  mood: string;
  is_private: boolean;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
  emotions_count?: number;
}

interface CommunityStats {
  totalUsers: number;
  totalDevotions: number;
  moodCounts: Record<string, number>;
}

export function CommunityPosts({
  initialDevotions,
  filters: initialFilters,
  moods: availableMoods,
  stats,
}: {
  initialDevotions: {
    data: Devotion[];
    next_page_url: string | null;
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    has_more_pages: boolean;
    has_previous_pages: boolean;
  }
  filters: { mood?: string; search?: string }
  moods: string[]
  stats: CommunityStats
}) {
  const [searchQuery, setSearchQuery] = useState(initialFilters.search || "")
  const [filterMood, setFilterMood] = useState(initialFilters.mood || "all")
  const [devotions, setDevotions] = useState<Devotion[]>(initialDevotions.data)
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(initialDevotions.next_page_url)
  const [isLoading, setIsLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  // Filter devotions based on search and mood filter
  const filteredDevotions = devotions.filter(devotion => {
    const matchesSearch = devotion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       devotion.verse.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       devotion.mood.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       devotion.content.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesMood = filterMood === 'all' || devotion.mood === filterMood

    return matchesSearch && matchesMood
  })

  // Handle search and filter changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    const params = new URLSearchParams({
      search: value,
      mood: filterMood === 'all' ? '' : filterMood
    });

    router.get(`/community?${params}`, {}, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleMoodFilter = (mood: string) => {
    setFilterMood(mood);
    const params = new URLSearchParams({
      search: searchQuery,
      mood: mood === 'all' ? '' : mood
    });

    router.get(`/community?${params}`, {}, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  useEffect(() => {
    // Update devotions when initialDevotions changes (on filter changes)
    setDevotions(initialDevotions.data)
    setNextPageUrl(initialDevotions.next_page_url)
  }, [initialDevotions])

  const CommunityPost = ({ post }: { post: Devotion }) => (
    <Card key={post.id} className="hover:shadow-md transition-shadow overflow-hidden">
      <CardHeader className="p-3 sm:p-4 md:p-6 pb-2 sm:pb-3 md:pb-4">
        <div className="flex flex-col xs:flex-row xs:items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs sm:text-sm">{post.mood}</Badge>
              <div className="flex items-center text-xs text-blue-600">
                <Globe className="h-3 w-3 mr-1" />
                <span>Public</span>
              </div>
            </div>
            <CardTitle className="text-base sm:text-lg mb-1 truncate">
              <Link href={route('devotion.show', { id: post.id })} className="hover:underline">
                {post.title}
              </Link>
            </CardTitle>
            <CardDescription className="font-medium text-blue-600 text-sm sm:text-base">{post.verse}</CardDescription>
            <div className="mt-2 flex items-center text-xs text-gray-500">
              <div className="flex items-center mr-4">
                <UserIcon className="h-3.5 w-3.5 mr-1" />
                <span>{post.user?.name || 'Anonymous'}</span>
              </div>
              <div className="flex items-center">
                <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
              </div>
            </div>
          </div>
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarImage src={post.user?.avatar} alt={post.user?.name} />
            <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
              {post.user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || '??'}
            </AvatarFallback>
          </Avatar>
        </div>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
        <p className="text-gray-600 mb-3 text-sm sm:text-base line-clamp-2">{post.content}</p>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center justify-between sm:justify-end gap-2 text-xs sm:text-sm text-gray-500">
            <Button variant="ghost" size="sm" className="h-7 sm:h-8 px-2 sm:px-3 text-xs sm:text-sm" asChild>
              <Link href={route('devotion.show', { id: post.id })} className="whitespace-nowrap">
                View <ArrowRight className="ml-1 h-3 w-3 flex-shrink-0" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="w-full py-2 sm:py-4 px-2 sm:px-0">
      <div className="grid lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-3 sm:space-y-4 md:space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-4 sm:gap-3">
            <Card className="h-full">
              <CardContent className="p-2 sm:p-3 md:p-4">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Users className="h-4 sm:h-5 w-4 sm:w-5 text-blue-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xl sm:text-2xl font-bold truncate">{stats.totalUsers}</div>
                    <div className="text-xs sm:text-sm text-gray-500 truncate">Members</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <BookOpen className="h-4 sm:h-5 w-4 sm:w-5 text-green-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xl sm:text-2xl font-bold truncate">{stats.totalDevotions}</div>
                    <div className="text-xs sm:text-sm text-gray-500 truncate">Public Devotions</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Globe className="h-4 sm:h-5 w-4 sm:w-5 text-purple-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xl sm:text-2xl font-bold truncate">{availableMoods.length}</div>
                    <div className="text-xs sm:text-sm text-gray-500 truncate">Moods</div>
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
                    placeholder="Search community devotions..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10 w-full"
                  />
                  {isSearching && (
                    <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={filterMood === "all" ? "default" : "outline"}
                    size="sm"
                    className="flex-1 sm:flex-initial text-xs sm:text-sm"
                    onClick={() => handleMoodFilter("all")}
                  >
                    All
                  </Button>
                  {availableMoods.map((mood) => (
                    <Button
                      key={mood}
                      variant={filterMood === mood ? "default" : "outline"}
                      size="sm"
                      className="flex-1 sm:flex-initial text-xs sm:text-sm"
                      onClick={() => handleMoodFilter(mood)}
                    >
                      {mood} ({stats.moodCounts[mood] || 0})
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Devotions List */}
          <div className="space-y-3 sm:space-y-4">
            {filteredDevotions.length > 0 ? (
              <>
                {filteredDevotions.map((post: Devotion) => (
                  <CommunityPost key={post.id} post={post} />
                ))}
              </>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No devotions found</h3>
                  <p className="text-gray-500 mb-4">
                    {searchQuery || filterMood !== 'all'
                      ? 'Try adjusting your search or filter criteria.'
                      : 'No public devotions available yet.'}
                  </p>
                  <Button asChild>
                    <Link href={route('devotion.create')}>
                      <Heart className="h-4 w-4 mr-2" />
                      Create First Devotion
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Pagination Controls */}
          {initialDevotions.last_page > 1 && (
            <Card>
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Showing {((initialDevotions.current_page - 1) * initialDevotions.per_page) + 1} to {Math.min(initialDevotions.current_page * initialDevotions.per_page, initialDevotions.total)} of {initialDevotions.total} devotions
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.get(route('community'), {
                        page: initialDevotions.current_page - 1,
                        search: searchQuery,
                        mood: filterMood === 'all' ? '' : filterMood
                      }, {
                        preserveState: true,
                        preserveScroll: true,
                      })}
                      disabled={!initialDevotions.has_previous_pages}
                    >
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    <span className="text-sm text-gray-500 px-2">
                      Page {initialDevotions.current_page} of {initialDevotions.last_page}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.get(route('community'), {
                        page: initialDevotions.current_page + 1,
                        search: searchQuery,
                        mood: filterMood === 'all' ? '' : filterMood
                      }, {
                        preserveState: true,
                        preserveScroll: true,
                      })}
                      disabled={!initialDevotions.has_more_pages}
                    >
                      Next
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
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
                  Find Verses by Mood
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href={route("dashboard")}>
                  <UserIcon className="h-4 w-4 mr-2" />
                  My Dashboard
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Community Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Community Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Members</span>
                  <span className="font-medium">{stats.totalUsers.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Public Devotions</span>
                  <span className="font-medium">{stats.totalDevotions.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Active Moods</span>
                  <span className="font-medium">{availableMoods.length}</span>
                </div>
                <Separator />
                <div className="text-xs text-gray-500">
                  Join the community and share your spiritual journey with others
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Popular Moods */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Popular Moods</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(stats.moodCounts)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 5)
                  .map(([mood, count]) => (
                    <div key={mood} className="flex items-center justify-between">
                      <span className="text-sm">{mood}</span>
                      <Badge variant="secondary" className="text-xs">{count}</Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
