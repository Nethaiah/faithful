"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Lock, Globe, Shield, Users, Settings, AlertTriangle, ArrowLeft } from "lucide-react"
import { Link } from "@inertiajs/react"

export function PrivacyControls() {
  const [bulkEditMode, setBulkEditMode] = useState(false)
  const [selectedDevotions, setSelectedDevotions] = useState<number[]>([])
  const [defaultPrivacy, setDefaultPrivacy] = useState("private")

  const devotions = [
    {
      id: 1,
      title: "Finding Peace in the Storm",
      verse: "Philippians 4:7",
      isPublic: false,
      createdAt: "2024-01-15",
      views: 0,
      communityReads: 0,
    },
    {
      id: 2,
      title: "Gratitude in Every Season",
      verse: "1 Thessalonians 5:18",
      isPublic: true,
      createdAt: "2024-01-14",
      views: 45,
      communityReads: 23,
    },
    {
      id: 3,
      title: "Strength for the Journey",
      verse: "Isaiah 40:31",
      isPublic: false,
      createdAt: "2024-01-13",
      views: 0,
      communityReads: 0,
    },
    {
      id: 4,
      title: "Walking in Faith",
      verse: "Hebrews 11:1",
      isPublic: true,
      createdAt: "2024-01-12",
      views: 67,
      communityReads: 34,
    },
  ]

  const handleBulkPrivacyChange = (makePublic: boolean) => {
    // Handle bulk privacy change logic here
    console.log(`Making ${selectedDevotions.length} devotions ${makePublic ? "public" : "private"}`)
    setSelectedDevotions([])
    setBulkEditMode(false)
  }

  const toggleDevotionSelection = (id: number) => {
    setSelectedDevotions((prev) => (prev.includes(id) ? prev.filter((devotionId) => devotionId !== id) : [...prev, id]))
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

            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">
                  {devotions.filter((d) => d.isPublic).reduce((sum, d) => sum + d.communityReads, 0)}
                </div>
                <div className="text-sm text-gray-500">Total Community Reads</div>
              </CardContent>
            </Card>
          </div>

          {/* Default Privacy Settings */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Default Privacy Settings</span>
              </CardTitle>
              <CardDescription>Choose the default privacy level for new devotions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Lock className="h-5 w-5 text-gray-500" />
                    <div>
                      <div className="font-medium">Keep Private by Default</div>
                      <div className="text-sm text-gray-500">
                        New devotions will be private unless you choose to share them
                      </div>
                    </div>
                  </div>
                  <Switch
                    checked={defaultPrivacy === "private"}
                    onCheckedChange={(checked) => setDefaultPrivacy(checked ? "private" : "public")}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Globe className="h-5 w-5 text-blue-500" />
                    <div>
                      <div className="font-medium">Share with Community by Default</div>
                      <div className="text-sm text-gray-500">
                        New devotions will be shared publicly unless you choose to keep them private
                      </div>
                    </div>
                  </div>
                  <Switch
                    checked={defaultPrivacy === "public"}
                    onCheckedChange={(checked) => setDefaultPrivacy(checked ? "public" : "private")}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

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
                      <div className="text-right sm:text-left text-xs sm:text-sm">
                        {devotion.isPublic ? (
                          <div className="text-blue-600">
                            <div className="font-medium">{devotion.communityReads} reads</div>
                            <div className="text-[11px] sm:text-xs">Community</div>
                          </div>
                        ) : (
                          <div className="text-gray-500">
                            <div className="font-medium">Private</div>
                            <div className="text-[11px] sm:text-xs">Only you</div>
                          </div>
                        )}
                      </div>

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
                              // Handle individual privacy toggle
                              console.log(
                                `Toggling privacy for devotion ${devotion.id} to ${checked ? "public" : "private"}`,
                              )
                            }}
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
