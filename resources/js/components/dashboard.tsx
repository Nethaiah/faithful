import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Plus, Search, Lock, Globe, Heart, Calendar, TrendingUp, ArrowRight, RefreshCw, Loader2, ArrowLeft, Activity } from "lucide-react"
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Link, router } from '@inertiajs/react';
import { toast } from 'sonner';
import { formatDistanceToNow, parseISO } from 'date-fns';


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
      <div className="w-full py-4 sm:py-6 px-2 sm:px-4">
        <div className="grid lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-4 sm:space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              <Card className="h-full shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-blue-50">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-2xl font-bold text-gray-900">{stats.totalDevotions}</div>
                      <div className="text-sm font-medium text-gray-500">Total Devotions</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="h-full shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-purple-50">
                      <Globe className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-2xl font-bold text-gray-900">{stats.publicDevotions}</div>
                      <div className="text-sm font-medium text-gray-500">Shared</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="h-full shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-indigo-50">
                      <Lock className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-2xl font-bold text-gray-900">{stats.privateDevotions}</div>
                      <div className="text-sm font-medium text-gray-500">Private</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filter */}
            <Card className="overflow-hidden border border-gray-100 shadow-sm">
              <CardContent className="p-4 sm:p-5">
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    <Input
                      placeholder="Search your devotions..."
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="pl-10 h-11 text-base"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-gray-700 mr-1">Filter by:</span>
                    <Button
                      variant={filterPrivacy === "all" ? "default" : "outline"}
                      size="sm"
                      className="h-9 px-3 text-sm font-medium transition-colors"
                      onClick={() => handlePrivacyFilter("all")}
                    >
                      All
                    </Button>
                    <Button
                      variant={filterPrivacy === "private" ? "default" : "outline"}
                      size="sm"
                      className="h-9 px-3 text-sm font-medium transition-colors"
                      onClick={() => handlePrivacyFilter("private")}
                    >
                      <Lock className="h-3.5 w-3.5 mr-1.5" />
                      <span>Private</span>
                    </Button>
                    <Button
                      variant={filterPrivacy === "public" ? "default" : "outline"}
                      size="sm"
                      className="h-9 px-3 text-sm font-medium transition-colors"
                      onClick={() => handlePrivacyFilter("public")}
                    >
                      <Globe className="h-3.5 w-3.5 mr-1.5" />
                      <span>Shared</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Devotions List */}
            <div className="space-y-3 sm:space-y-4">
              {filteredDevotions.length > 0 ? (
                filteredDevotions.map((devotion) => (
                <Card key={devotion.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs bg-indigo-50 text-indigo-700 border-indigo-200">
                          {devotion.mood}
                        </Badge>
                        {devotion.isPublic ? (
                          <div className="flex items-center text-xs text-indigo-600">
                            <Globe className="h-3 w-3 mr-1" />
                            <span>Public</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-xs text-gray-600">
                            <Lock className="h-3 w-3 mr-1" />
                            <span>Private</span>
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 whitespace-nowrap">
                        {formatDistanceToNow(new Date(devotion.createdAt), { addSuffix: true })}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardTitle className="text-base font-semibold mb-1">
                      <Link href={route('devotion.show', { id: devotion.id })} className="hover:text-indigo-600 hover:underline">
                        {devotion.title}
                      </Link>
                    </CardTitle>
                    <p className="text-sm text-indigo-600 font-medium mb-2">{devotion.verse}</p>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{devotion.excerpt}</p>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="text-xs text-gray-500">
                        {devotion.createdAt}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-sm text-blue-600 hover:text-blue-700"
                        asChild
                      >
                        <Link href={route('devotion.show', { id: devotion.id })} className="group-hover:underline">
                          View Devotion
                          <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="border-2 border-dashed border-gray-200 bg-transparent">
                <CardContent className="p-8 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 mb-4">
                    <BookOpen className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {searchQuery || filterPrivacy !== 'all' ? 'No matching devotions' : 'No devotions yet'}
                  </h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    {searchQuery || filterPrivacy !== 'all'
                      ? 'Try adjusting your search or filter criteria to find what you\'re looking for.'
                      : 'Start your spiritual journey by creating your first devotion.'}
                  </p>
                  <Button asChild className="group">
                    <Link
                      href={route('devotion.create')}
                      className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-colors"
                    >
                      <Plus className="mr-2 h-4 w-4" />
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
            <Card className="border border-gray-100 shadow-sm">
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

            {/* Today's Verse */}
            <Card className="border border-gray-200 bg-white shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CardTitle className="text-base font-semibold text-gray-900">Today's Verse</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {randomVerse ? (
                  <div className="space-y-4">
                    <div className="bg-indigo-50/50 rounded-lg p-4 border border-indigo-100">
                      <blockquote className="text-sm text-gray-700 leading-relaxed italic">
                        "{randomVerse.text}"
                      </blockquote>
                      <p className="mt-2 text-right text-sm font-medium text-indigo-700">— {randomVerse.reference}</p>
                    </div>
                    <Button
                      onClick={handleCreateDevotion}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create Devotion
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-3" />
                    <p className="text-sm text-gray-500">Loading today's verse...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
}
