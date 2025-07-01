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

  if (isLoading && devotions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-7xl px-4 py-6">

        <div className="mb-6 text-center px-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4 leading-tight">
            Devotion Privacy Settings
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Manage who can see your devotions and control your sharing preferences.
          </p>
        </div>

        {/* Privacy Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center space-x-4">
                <div className="p-2.5 rounded-lg bg-gray-100">
                  <Lock className="h-5 w-5 text-gray-600" />
                </div>
                <div className="min-w-0">
                  <div className="text-2xl font-bold text-gray-900">{devotions.filter((d) => !d.isPublic).length}</div>
                  <div className="text-sm text-gray-500">Private Devotions</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center space-x-4">
                <div className="p-2.5 rounded-lg bg-blue-50">
                  <Globe className="h-5 w-5 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <div className="text-2xl font-bold text-gray-900">{devotions.filter((d) => d.isPublic).length}</div>
                  <div className="text-sm text-gray-500">Shared with Community</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bulk Privacy Management */}
        <Card className="mb-6 border border-gray-100 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-lg">Manage Devotions</CardTitle>
                <CardDescription className="text-sm">
                  {bulkEditMode
                    ? 'Select devotions to update their privacy settings'
                    : `You have ${devotions.length} devotion${devotions.length !== 1 ? 's' : ''} in total`}
                </CardDescription>
              </div>
              <Button
                variant={bulkEditMode ? "outline" : "default"}
                size="sm"
                onClick={() => setBulkEditMode(!bulkEditMode)}
                className="h-9"
              >
                {bulkEditMode ? (
                  <>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Edit3 className="h-4 w-4 mr-2" />
                    Bulk Edit
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {bulkEditMode && selectedDevotions.length > 0 && (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="text-sm font-medium text-blue-800">
                    {selectedDevotions.length} devotion{selectedDevotions.length !== 1 ? 's' : ''} selected
                  </span>
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleBulkPrivacyChange(false)}
                      className="h-8 px-3 text-sm justify-center sm:justify-start gap-1.5"
                    >
                      <Lock className="h-3.5 w-3.5" />
                      Make Private
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleBulkPrivacyChange(true)}
                      className="h-8 px-3 text-sm justify-center sm:justify-start gap-1.5"
                    >
                      <Globe className="h-3.5 w-3.5" />
                      Make Public
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
  )
}
