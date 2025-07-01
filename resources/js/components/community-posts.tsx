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
    <Card className="border border-gray-200 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs bg-indigo-50 text-indigo-700 border-indigo-200">
              {post.mood}
            </Badge>
            <div className="flex items-center text-xs text-indigo-600">
              <Globe className="h-3 w-3 mr-1" />
              <span>Public</span>
            </div>
          </div>
          <div className="text-xs text-gray-500 whitespace-nowrap">
            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <CardTitle className="text-base font-semibold mb-1">
          <Link href={route('devotion.show', { id: post.id })} className="hover:text-indigo-600 hover:underline">
            {post.title}
          </Link>
        </CardTitle>
        <p className="text-sm text-indigo-600 font-medium mb-2">{post.verse}</p>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{post.content}</p>
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center text-xs text-gray-500">
            <UserIcon className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
            <span>{post.user?.name || 'Anonymous'}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-sm text-blue-600 hover:text-blue-700 group"
            asChild
          >
            <Link href={route('devotion.show', { id: post.id })}>
              View Devotion
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="w-full py-4 sm:py-6 px-2 sm:px-4">
      <div className="mb-6 text-center px-1">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4 leading-tight">
          Community Devotions
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
          Explore and be encouraged by devotions shared by the community.
        </p>
      </div>
      <div className="grid lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-4 sm:space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <Card className="h-full shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-blue-50">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-2xl font-bold text-gray-900">{stats.totalUsers}</div>
                    <div className="text-sm font-medium text-gray-500">Members</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="h-full shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-indigo-50">
                    <BookOpen className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-2xl font-bold text-gray-900">{stats.totalDevotions}</div>
                    <div className="text-sm font-medium text-gray-500">Public Devotions</div>
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
          <Card className="border border-gray-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold">Search & Filter</h3>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search devotions..."
                    className="pl-9 h-10"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Filter by mood:</p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={filterMood === 'all' ? 'default' : 'outline'}
                      size="sm"
                      className="h-8 text-xs sm:text-sm"
                      onClick={() => handleMoodFilter('all')}
                    >
                      All
                    </Button>
                    {availableMoods.map((mood) => (
                      <Button
                        key={mood}
                        variant={filterMood === mood ? 'default' : 'outline'}
                        size="sm"
                        className="h-8 text-xs sm:text-sm capitalize"
                        onClick={() => handleMoodFilter(mood)}
                      >
                        {mood}
                      </Button>
                    ))}
                  </div>
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
