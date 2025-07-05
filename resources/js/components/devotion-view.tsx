"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Heart, ArrowLeft, Globe, Lock, Calendar, User, Plus } from "lucide-react"
import { Link } from "@inertiajs/react"
import { formatDistanceToNow } from 'date-fns'

export interface DevotionData {
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
    };
}

interface DevotionViewProps {
    devotion: DevotionData;
}

export function DevotionView({ devotion }: DevotionViewProps) {
    // Calculate read time (approximately 200 words per minute)
    const wordCount = devotion.content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200);

    // Format date
    const formattedDate = new Date(devotion.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const relativeDate = formatDistanceToNow(new Date(devotion.created_at), { addSuffix: true });

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="py-4 sm:py-6 md:py-8">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    {/* Header */}
                    <div className="mb-6 sm:mb-8">
                        <nav className="flex items-center">
                            <Button variant="ghost" size="sm" asChild className="px-2 sm:px-3">
                                <Link href="/dashboard" className="flex items-center text-sm sm:text-base">
                                    <ArrowLeft className="h-4 w-4 mr-1.5 flex-shrink-0" />
                                    <span>Back to Dashboard</span>
                                </Link>
                            </Button>
                        </nav>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-3 space-y-6">
                            <Card className="overflow-hidden">
                                <CardHeader className="pb-4 sm:pb-6">
                                    <div className="space-y-3">
                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                            <Badge variant="outline" className="text-sm">
                                                {devotion.mood}
                                            </Badge>
                                            {!devotion.is_private ? (
                                                <div className="flex items-center text-xs sm:text-sm text-blue-600">
                                                    <Globe className="h-3 w-3 mr-1 flex-shrink-0" />
                                                    <span>Community</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center text-xs sm:text-sm text-gray-500">
                                                    <Lock className="h-3 w-3 mr-1 flex-shrink-0" />
                                                    <span>Private</span>
                                                </div>
                                            )}
                                        </div>

                                        <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                                            {devotion.title}
                                        </CardTitle>

                                        <CardDescription className="text-base sm:text-lg font-medium text-blue-600">
                                            {devotion.verse}
                                        </CardDescription>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-gray-500 mt-4 pt-3 border-t border-gray-100">
                                        <div className="flex items-center">
                                            <User className="h-4 w-4 mr-1.5 text-gray-400" />
                                            <span>{devotion.user?.name || 'Anonymous'}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Calendar className="h-4 w-4 mr-1.5 text-gray-400" />
                                            <span title={formattedDate}>{relativeDate}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <BookOpen className="h-4 w-4 mr-1.5 text-gray-400" />
                                            <span>{readTime} min read</span>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="pt-0 pb-6 px-4 sm:px-6">
                                    <div className="prose prose-blue max-w-none">
                                        {devotion.verse_content && (
                                            <div className="bg-blue-50 p-4 rounded-lg mb-6 border-l-4 border-blue-500">
                                                {devotion.verse && (
                                                    <p className="font-medium text-blue-800">{devotion.verse}</p>
                                                )}
                                                <p className="text-blue-700 mt-2">{devotion.verse_content}</p>
                                            </div>
                                        )}

                                        <div className="prose prose-sm sm:prose-base max-w-none">
                                            <div className="whitespace-pre-line">
                                                {devotion.content}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Quick Actions */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Actions</CardTitle>
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
