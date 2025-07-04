"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Lock, Globe, Settings, AlertTriangle, ArrowLeft, Loader2, Shield, X, Edit3 } from "lucide-react"
import { Link, usePage } from "@inertiajs/react"
import { toast } from "sonner"

// Define the shape of the page props we expect from the backend
interface BackendProps {
    devotions: Devotion[]
    defaultPrivacy: string
    stats: {
        privateCount: number
        publicCount: number
    }
}

// Extend Inertia's PageProps with our custom props
declare module '@inertiajs/core' {
    interface PageProps {
        csrf: string
    }
}

// Type for the combined page props
type PageProps = BackendProps & {
    csrf: string
}
interface Devotion {
    id: number
    title: string
    verse: string
    isPublic: boolean
    createdAt: string
}

export function PrivacyControls() {
    // Use type assertion since we know the shape of our props
    const { props } = usePage()
    const pageProps = props as unknown as PageProps

    const {
        devotions: initialDevotions = [],
        defaultPrivacy: initialDefaultPrivacy = 'private',
        stats: initialStats = { privateCount: 0, publicCount: 0 }
    } = pageProps

    const [isLoading, setIsLoading] = useState(false)
    const [bulkEditMode, setBulkEditMode] = useState(false)
    const [selectedDevotions, setSelectedDevotions] = useState<number[]>([])
    const [defaultPrivacy, setDefaultPrivacy] = useState(initialDefaultPrivacy)
    const [devotions, setDevotions] = useState<Devotion[]>(initialDevotions)
    const [stats, setStats] = useState<{ privateCount: number; publicCount: number }>(initialStats)

    // Update local state when props change
    useEffect(() => {
        setDevotions(initialDevotions)
        setDefaultPrivacy(initialDefaultPrivacy)
        setStats(initialStats)
    }, [initialDevotions, initialDefaultPrivacy, initialStats])

    const handleBulkPrivacyChange = async (makePublic: boolean) => {
        if (selectedDevotions.length === 0) return

        try {
            setIsLoading(true)
            const response = await fetch(route('privacy.bulk-update'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    devotion_ids: selectedDevotions,
                    is_public: makePublic,
                }),
            })

            const data = await response.json()

            if (response.ok) {
                // Update local state to reflect changes
                setDevotions(prevDevotions =>
                    prevDevotions.map(devotion =>
                        selectedDevotions.includes(devotion.id)
                            ? { ...devotion, isPublic: makePublic }
                            : devotion
                    )
                )

                // Update stats
                const count = selectedDevotions.length
                setStats(prev => ({
                    privateCount: makePublic ? prev.privateCount - count : prev.privateCount + count,
                    publicCount: makePublic ? prev.publicCount + count : prev.publicCount - count,
                }))

                toast.success(data.message)
                setSelectedDevotions([])
                setBulkEditMode(false)
            } else {
                throw new Error(data.message || 'Failed to update privacy settings')
            }
        } catch (error) {
            console.error('Error updating privacy settings:', error)
            toast.error(error instanceof Error ? error.message : 'An error occurred while updating privacy settings')
        } finally {
            setIsLoading(false)
        }
    }

    const toggleDevotionSelection = (id: number) => {
        setSelectedDevotions((prev) =>
            prev.includes(id)
                ? prev.filter((devotionId) => devotionId !== id)
                : [...prev, id]
        )
    }

    const handleDevotionPrivacyChange = async (devotionId: number, makePublic: boolean) => {
        try {
            setIsLoading(true);
            const response = await fetch(route('privacy.update', devotionId), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    is_public: makePublic,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to update privacy setting');
            }

            const data = await response.json();

            // Update local state to reflect changes
            setDevotions(prevDevotions =>
                prevDevotions.map(devotion =>
                    devotion.id === devotionId
                        ? { ...devotion, isPublic: makePublic }
                        : devotion
                )
            );

            // Update stats
            setStats(prev => ({
                privateCount: makePublic ? prev.privateCount - 1 : prev.privateCount + 1,
                publicCount: makePublic ? prev.publicCount + 1 : prev.publicCount - 1,
            }));

            toast.success(data.message || 'Privacy updated successfully');
        } catch (error) {
            console.error('Error updating devotion privacy:', error);
            toast.error(error instanceof Error ? error.message : 'An error occurred while updating privacy');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDefaultPrivacyChange = async (privacy: 'private' | 'public') => {
        // Optimistically update the UI
        const previousPrivacy = defaultPrivacy
        setDefaultPrivacy(privacy)

        try {
            const response = await fetch(route('privacy.default.update'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({
                    default_privacy: privacy,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update default privacy setting')
            }

            toast.success('Default privacy setting updated successfully')
        } catch (error) {
            console.error('Error updating default privacy:', error)
            // Revert on error
            setDefaultPrivacy(previousPrivacy)
            toast.error(error instanceof Error ? error.message : 'An error occurred while updating default privacy')
        }
    }

    const selectAllDevotions = () => {
        setSelectedDevotions(devotions.map(d => d.id))
    }

    const deselectAllDevotions = () => {
        setSelectedDevotions([])
    }

    const isAllSelected = selectedDevotions.length === devotions.length && devotions.length > 0
    const isSomeSelected = selectedDevotions.length > 0 && selectedDevotions.length < devotions.length

    return (
        <div className="w-full py-4 sm:py-6 px-2 sm:px-4">
            <div className="mb-6 text-center px-1">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4 leading-tight">
                    Privacy Settings
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
                    Manage who can see your devotions and set your default privacy preferences.
                </p>
            </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Default Privacy Setting */}


                        {/* Bulk Privacy Management */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Shield className="h-5 w-5 mr-2 text-blue-500" />
                                        Manage Existing Devotions
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setBulkEditMode(!bulkEditMode)}
                                        className="flex items-center"
                                    >
                                        {bulkEditMode ? <X className="h-4 w-4 mr-1" /> : <Edit3 className="h-4 w-4 mr-1" />}
                                        {bulkEditMode ? 'Cancel' : 'Bulk Edit'}
                                    </Button>
                                </CardTitle>
                                <CardDescription>
                                    Change privacy settings for multiple devotions at once
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {bulkEditMode && (
                                    <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    checked={isAllSelected}
                                                    onCheckedChange={(checked) => {
                                                        if (checked) {
                                                            selectAllDevotions();
                                                        } else {
                                                            deselectAllDevotions();
                                                        }
                                                    }}
                                                />
                                                <span className="text-sm font-medium">
                                                    {selectedDevotions.length} of {devotions.length} devotions selected
                                                </span>
                                            </div>
                                            {selectedDevotions.length > 0 && (
                                                <div className="flex space-x-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleBulkPrivacyChange(false)}
                                                        disabled={isLoading}
                                                        className="flex items-center"
                                                    >
                                                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Lock className="h-4 w-4 mr-1" />}
                                                        Make Private
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleBulkPrivacyChange(true)}
                                                        disabled={isLoading}
                                                        className="flex items-center"
                                                    >
                                                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Globe className="h-4 w-4 mr-1" />}
                                                        Make Public
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-3">
                                    {devotions.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500">
                                            <Lock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                            <p>No devotions found.</p>
                                            <p className="text-sm">Create your first devotion to manage privacy settings.</p>
                                        </div>
                                    ) : (
                                        devotions.map((devotion) => (
                                            <div
                                                key={devotion.id}
                                                className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
                                                    bulkEditMode ? 'bg-gray-50' : ''
                                                }`}
                                            >
                                                <div className="flex items-center space-x-3">
                                                    {bulkEditMode && (
                                                        <Checkbox
                                                            checked={selectedDevotions.includes(devotion.id)}
                                                            onCheckedChange={() => toggleDevotionSelection(devotion.id)}
                                                        />
                                                    )}
                                                    <div className="flex items-center space-x-2">
                                                        {devotion.isPublic ? (
                                                            <Globe className="h-4 w-4 text-blue-500" />
                                                        ) : (
                                                            <Lock className="h-4 w-4 text-gray-500" />
                                                        )}
                                                        <div>
                                                            <div className="font-medium text-sm">{devotion.title}</div>
                                                            <div className="text-xs text-gray-500">{devotion.verse}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Badge variant={devotion.isPublic ? "default" : "secondary"}>
                                                        {devotion.isPublic ? "Public" : "Private"}
                                                    </Badge>
                                                    {!bulkEditMode && (
                                                        <Switch
                                                            checked={devotion.isPublic}
                                                            onCheckedChange={(checked) => handleDevotionPrivacyChange(devotion.id, checked)}
                                                            disabled={isLoading}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Privacy Stats */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Privacy Overview</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <Lock className="h-4 w-4 text-gray-500" />
                                            <span className="text-sm">Private Devotions</span>
                                        </div>
                                        <Badge variant="secondary">{stats.privateCount}</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <Globe className="h-4 w-4 text-blue-500" />
                                            <span className="text-sm">Public Devotions</span>
                                        </div>
                                        <Badge variant="default">{stats.publicCount}</Badge>
                                    </div>
                                    <Separator />
                                    <div className="flex items-center justify-between font-medium">
                                        <span>Total Devotions</span>
                                        <span>{stats.privateCount + stats.publicCount}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Privacy Tips */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Privacy Tips</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3 text-sm text-gray-600">
                                    <div className="flex items-start space-x-2">
                                        <Lock className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <div className="font-medium text-gray-700">Private Devotions</div>
                                            <div>Perfect for personal reflections and prayers you want to keep to yourself.</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-2">
                                        <Globe className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <div className="font-medium text-gray-700">Public Devotions</div>
                                            <div>Share your insights with the community to encourage others in their faith journey.</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-2">
                                        <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <div className="font-medium text-gray-700">Remember</div>
                                            <div>You can always change the privacy setting of any devotion at any time.</div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
        </div>
    )
}
