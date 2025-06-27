"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Lock, Globe, Settings, AlertTriangle, ArrowLeft, Loader2, Shield } from "lucide-react"
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

  if (isLoading && devotions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div>
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href={route('dashboard')}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy & Sharing Settings</h1>
            <p className="text-gray-600">Manage who can see your devotions and control your sharing preferences</p>
          </div>

          {/* Privacy Overview */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Lock className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{devotions.filter((d) => !d.isPublic).length}</div>
                <div className="text-sm text-gray-500">Private Devotions</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Globe className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">{devotions.filter((d) => d.isPublic).length}</div>
                <div className="text-sm text-gray-500">Shared with Community</div>
              </CardContent>
            </Card>
          </div>

          {/* Bulk Privacy Management */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="mb-2 sm:mb-0">
                  <CardTitle className="text-lg sm:text-xl">Manage Existing Devotions</CardTitle>
                  <CardDescription className="text-sm sm:text-base">Change privacy settings for multiple devotions at once</CardDescription>
                </div>
                <Button
                  variant={bulkEditMode ? "default" : "outline"}
                  onClick={() => setBulkEditMode(!bulkEditMode)}
                  className="w-full sm:w-auto"
                >
                  {bulkEditMode ? "Cancel" : "Bulk Edit"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {bulkEditMode && selectedDevotions.length > 0 && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <span className="font-medium text-sm sm:text-base">{selectedDevotions.length} devotion(s) selected</span>
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleBulkPrivacyChange(false)}
                        className="w-full sm:w-auto justify-center sm:justify-start"
                      >
                        <Lock className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span>Make Private</span>
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleBulkPrivacyChange(true)}
                        className="w-full sm:w-auto justify-center sm:justify-start"
                      >
                        <Globe className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span>Make Public</span>
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {devotions.map((devotion) => (
                  <div key={devotion.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border rounded-lg gap-3 sm:gap-4">
                    <div className="flex items-start w-full">
                      {bulkEditMode && (
                        <div className="mr-2 mt-1">
                          <Checkbox
                            id={`devotion-${devotion.id}`}
                            checked={selectedDevotions.includes(devotion.id)}
                            onCheckedChange={() => toggleDevotionSelection(devotion.id)}
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm sm:text-base">{devotion.title}</div>
                        <div className="text-xs sm:text-sm text-gray-500">
                          {devotion.verse} • {devotion.createdAt}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto sm:flex-nowrap gap-2 sm:gap-4">

                      <div className="flex items-center gap-2">
                        <div className="hidden sm:block">
                          <Badge variant={devotion.isPublic ? "default" : "secondary"} className="text-xs">
                            {devotion.isPublic ? (
                              <>
                                <Globe className="h-3 w-3 mr-1" />
                                Public
                              </>
                            ) : (
                              <>
                                <Lock className="h-3 w-3 mr-1" />
                                Private
                              </>
                            )}
                          </Badge>
                        </div>

                        {!bulkEditMode && (
                          <Switch
                            id={`toggle-${devotion.id}`}
                            checked={devotion.isPublic}
                            onCheckedChange={(checked) => {
                              handleDevotionPrivacyChange(devotion.id, checked)
                            }}
                            disabled={isLoading}
                            className="ml-auto"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Privacy Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span>Privacy & Community Guidelines</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Lock className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <div className="font-medium">Private Devotions</div>
                    <div className="text-sm text-gray-600">
                      Only you can see private devotions. They're perfect for personal reflections, sensitive topics, or
                      when you're still processing your thoughts.
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Globe className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <div className="font-medium">Public Devotions</div>
                    <div className="text-sm text-gray-600">
                      Public devotions are shared anonymously with the community. No personal information is displayed,
                      and they help encourage other believers.
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                  <div>
                    <div className="font-medium">Community Standards</div>
                    <div className="text-sm text-gray-600">
                      Public devotions should be encouraging, biblically sound, and appropriate for all ages. Content is
                      moderated to maintain a safe, uplifting environment.
                    </div>
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
