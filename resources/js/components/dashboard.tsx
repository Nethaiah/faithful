import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Plus, Search, Lock, Globe, Heart, Calendar, TrendingUp, ArrowRight, RefreshCw, Loader2, ArrowLeft } from "lucide-react"
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Link, router } from '@inertiajs/react';
import { toast } from 'sonner';


interface Devotion {
    id: number;
    title: string;
    verse: string;
    mood: string;
    isPublic: boolean;
    createdAt: string;
    excerpt: string;
}

interface DashboardProps {
    devotions: Devotion[];
    pagination: {
        hasMorePages: boolean;
        hasPreviousPages: boolean;
        currentPage: number;
        lastPage: number;
        perPage: number;
        total: number;
    };
    filters: {
        search?: string;
        filterPrivacy?: string;
    };
    stats: {
        totalDevotions: number;
        publicDevotions: number;
        privateDevotions: number;
        lastDevotion: {
            id: number;
            title: string;
            created_at: string;
            is_private: boolean;
        } | null;
    };
}

export default function UserDashboard({ devotions = [], pagination, filters, stats }: DashboardProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search || "")
    const [filterPrivacy, setFilterPrivacy] = useState(filters.filterPrivacy || "all")
    const [randomVerse, setRandomVerse] = useState<{reference: string; text: string; theme: string} | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Filter devotions based on search and privacy filter
    const filteredDevotions = devotions.filter(devotion => {
        const matchesSearch = devotion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           devotion.verse.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           devotion.mood.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesPrivacy = filterPrivacy === 'all' ||
                             (filterPrivacy === 'private' && !devotion.isPublic) ||
                             (filterPrivacy === 'public' && devotion.isPublic)

        return matchesSearch && matchesPrivacy
    })

    const getTodaysVerse = useCallback(async () => {
        const today = new Date().toDateString();
        const storedVerse = localStorage.getItem('todaysVerse');
        const storedDate = localStorage.getItem('verseDate');
        const storedTimestamp = localStorage.getItem('verseTimestamp');
        const now = Date.now();

        // If we have a stored verse from today and it's not past midnight, use it
        if (storedVerse && storedDate === today && storedTimestamp) {
            // Check if we need to refresh (after midnight)
            const lastRefresh = parseInt(storedTimestamp, 10);
            const nextRefresh = new Date(today);
            nextRefresh.setDate(nextRefresh.getDate() + 1); // Next day

            if (now < nextRefresh.getTime()) {
                setRandomVerse(JSON.parse(storedVerse));
                return;
            }
        }

        // Otherwise, fetch a new verse
        await fetchRandomVerse();
    }, []);

    const fetchRandomVerse = useCallback(async () => {
        setIsLoading(true);
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
                    mood: 'encouragement',
                    count: 1
                })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch a random verse');
            }

            const data = await response.json();

            if (data.success && Array.isArray(data.verses) && data.verses.length > 0) {
                const verse = data.verses[0];
                const newVerse = {
                    reference: verse.reference,
                    text: verse.preview,
                    theme: 'Encouragement'
                };

                // Store the verse, today's date, and timestamp in localStorage
                localStorage.setItem('todaysVerse', JSON.stringify(newVerse));
                localStorage.setItem('verseDate', new Date().toDateString());
                localStorage.setItem('verseTimestamp', Date.now().toString());

                setRandomVerse(newVerse);
            }
        } catch (error) {
            console.error('Error fetching random verse:', error);
            toast.error('Failed to load a random verse. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleCreateDevotion = () => {
        if (randomVerse) {
            router.visit(route('devotion.create'), {
                data: {
                    verse: randomVerse.reference,
                    verse_content: randomVerse.text,
                    title: `Devotion on ${randomVerse.reference}`
                }
            });
        }
    };

    // Set up the midnight refresh
    useEffect(() => {
        getTodaysVerse();

        // Set up a timer to check for midnight
        const now = new Date();
        const midnight = new Date(now);
        midnight.setHours(24, 0, 0, 0); // Next midnight

        const msUntilMidnight = midnight.getTime() - now.getTime();

        const timer = setTimeout(() => {
            getTodaysVerse();
            // Set up daily refresh
            const dailyTimer = setInterval(getTodaysVerse, 24 * 60 * 60 * 1000);
            return () => clearInterval(dailyTimer);
        }, msUntilMidnight);

        return () => clearTimeout(timer);
    }, [getTodaysVerse]);

    // Navigate to page
    const navigateToPage = (page: number) => {
        const params = new URLSearchParams({
            page: page.toString(),
            search: searchQuery,
            filterPrivacy: filterPrivacy
        });

        router.get(`/dashboard?${params}`, {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Handle search and filter changes
    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        const params = new URLSearchParams({
            search: value,
            filterPrivacy: filterPrivacy
        });

        router.get(`/dashboard?${params}`, {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handlePrivacyFilter = (privacy: string) => {
        setFilterPrivacy(privacy);
        const params = new URLSearchParams({
            search: searchQuery,
            filterPrivacy: privacy
        });

        router.get(`/dashboard?${params}`, {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

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
                    <Lock className="h-4 sm:h-5 w-4 sm:w-5 text-purple-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xl sm:text-2xl font-bold truncate">{stats.privateDevotions}</div>
                      <div className="text-xs sm:text-sm text-gray-500 truncate">Private</div>
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
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="pl-10 w-full"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={filterPrivacy === "all" ? "default" : "outline"}
                      size="sm"
                      className="flex-1 sm:flex-initial text-xs sm:text-sm"
                      onClick={() => handlePrivacyFilter("all")}
                    >
                      All
                    </Button>
                    <Button
                      variant={filterPrivacy === "private" ? "default" : "outline"}
                      size="sm"
                      className="flex-1 sm:flex-initial text-xs sm:text-sm"
                      onClick={() => handlePrivacyFilter("private")}
                    >
                      <Lock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      <span className="hidden xs:inline">Private</span>
                    </Button>
                    <Button
                      variant={filterPrivacy === "public" ? "default" : "outline"}
                      size="sm"
                      className="flex-1 sm:flex-initial text-xs sm:text-sm"
                      onClick={() => handlePrivacyFilter("public")}
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
              {filteredDevotions.length > 0 ? (
                filteredDevotions.map((devotion) => (
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
              ))
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No devotions found</h3>
                  <p className="text-gray-500 mb-4">
                    {searchQuery || filterPrivacy !== 'all'
                      ? 'Try adjusting your search or filter criteria.'
                      : 'Start by creating your first devotion.'}
                  </p>
                  <Button asChild>
                    <Link href={route('devotion.create')}>
                      <Plus className="h-4 w-4 mr-2" />
                      New Devotion
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
            </div>

            {/* Pagination Controls */}
            {(pagination.hasMorePages || pagination.hasPreviousPages) && (
              <Card>
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Showing {((pagination.currentPage - 1) * pagination.perPage) + 1} to {Math.min(pagination.currentPage * pagination.perPage, pagination.total)} of {pagination.total} devotions
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigateToPage(pagination.currentPage - 1)}
                        disabled={!pagination.hasPreviousPages}
                      >
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Previous
                      </Button>
                      <span className="text-sm text-gray-500 px-2">
                        Page {pagination.currentPage} of {pagination.lastPage}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigateToPage(pagination.currentPage + 1)}
                        disabled={!pagination.hasMorePages}
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
                  {stats.lastDevotion ? (
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">
                            Created "{stats.lastDevotion.title}"
                            {stats.lastDevotion.is_private && (
                              <Lock className="h-3 w-3 ml-1.5 inline text-gray-400" />
                            )}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {stats.lastDevotion.created_at}
                          </p>
                        </div>
                      </div>
                      <div className="pl-5">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={route('devotion.show', { id: stats.lastDevotion.id })} className="text-xs">
                            View Devotion <ArrowRight className="h-3 w-3 ml-1" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <BookOpen className="h-5 w-5 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">No recent devotions</p>
                      <p className="text-xs text-gray-400 mt-1">Create your first devotion to see it here</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Today's Verse */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Today's Verse</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {randomVerse ? (
                  <>
                    <blockquote className="text-sm italic text-gray-700 mb-2">
                      "{randomVerse.text}"
                    </blockquote>
                    <div className="text-xs text-gray-500 mb-3">{randomVerse.reference}</div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={handleCreateDevotion}
                      disabled={isLoading}
                    >
                      Create Devotion
                    </Button>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-20">
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                    ) : (
                      <p className="text-sm text-gray-500">No verse available</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
}
