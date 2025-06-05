import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, BookOpen, Users, Sparkles, ArrowRight, Globe } from "lucide-react"
import { Navigation } from "@/components/navigation"

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    const featuredDevotions = [
        {
          id: 1,
          title: "Finding Peace in the Storm",
          verse: "Philippians 4:7",
          verseText:
            "And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.",
          excerpt:
            "In times of uncertainty, God's peace serves as our anchor. This verse reminds us that His peace isn't dependent on our circumstances...",
          mood: "Anxious",
          timeAgo: "2 hours ago",
        },
        {
          id: 2,
          title: "Gratitude in Every Season",
          verse: "1 Thessalonians 5:18",
          verseText: "Give thanks in all circumstances; for this is God's will for you in Christ Jesus.",
          excerpt:
            "Thanksgiving isn't just for the good times. This powerful verse challenges us to find reasons for gratitude even in difficult seasons...",
          mood: "Grateful",
          timeAgo: "5 hours ago",
        },
        {
          id: 3,
          title: "Strength for the Journey",
          verse: "Isaiah 40:31",
          verseText: "But those who hope in the Lord will renew their strength. They will soar on wings like eagles...",
          excerpt:
            "When we feel weak and weary, God promises to renew our strength. This beautiful imagery of eagles reminds us of His sustaining power...",
          mood: "Struggling",
          timeAgo: "1 day ago",
        },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navigation />
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Discover God's Word for Your Heart Today
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create personalized Bible devotions with AI assistance. Find verses that speak to your mood and share
            meaningful insights with the community.
          </p>

          {/* Daily Featured Verse */}
          <Card className="mb-8 max-w-2xl mx-auto border-blue-200 bg-blue-50/50">
            <CardHeader>
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">Today's Featured Verse</span>
              </div>
              <CardTitle className="text-lg">John 14:27</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 italic">
                "Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your
                hearts be troubled and do not be afraid."
              </p>
              <Badge variant="secondary" className="mt-3">
                Peace
              </Badge>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8" asChild>
              <Link href="/register">
                Start Your Devotion Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8" asChild>
              <Link href="#devotions">Read Community Devotions</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">How Faithful Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">1. Share Your Mood</h3>
              <p className="text-gray-600 text-sm">
                Tell us how you're feeling - anxious, grateful, struggling, or joyful.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">2. Get Verse Suggestions</h3>
              <p className="text-gray-600 text-sm">
                Receive personalized Bible verses that speak to your current situation.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">3. Create with AI</h3>
              <p className="text-gray-600 text-sm">
                Write meaningful devotions with AI assistance and spiritual insights.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">4. Share or Keep Private</h3>
              <p className="text-gray-600 text-sm">
                Choose to keep your devotions private or share anonymously with the community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Public Devotion Feed */}
      <section id="devotions" className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Community Devotions</h2>
            <p className="text-gray-600">Read inspiring devotions shared by our community members</p>
          </div>

          <div className="space-y-6">
            {featuredDevotions.map((devotion) => (
              <Card key={devotion.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{devotion.title}</CardTitle>
                      <CardDescription className="text-base font-medium text-blue-600">
                        {devotion.verse}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{devotion.mood}</Badge>
                      <Globe className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <blockquote className="border-l-4 border-blue-200 pl-4 mb-4 italic text-gray-700">
                    {devotion.verseText}
                  </blockquote>
                  <p className="text-gray-600 mb-4">{devotion.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{devotion.timeAgo}</span>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/devotions/${devotion.id}`}>
                        Read More <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" size="lg" asChild>
              <Link href="/discover">View All Community Devotions</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Community Impact */}
      <section className="py-16 px-4 bg-blue-50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-8">Join Our Growing Community</h2>
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">1,247</div>
              <div className="text-gray-600">Believers Connected</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">3,891</div>
              <div className="text-gray-600">Devotions Created</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">892</div>
              <div className="text-gray-600">Shared This Week</div>
            </div>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <blockquote className="text-lg italic text-gray-700 mb-4">
                "Faithful has transformed my daily Bible study. The AI suggestions help me find exactly the verses I
                need, and sharing with the community has deepened my faith journey."
              </blockquote>
              <div className="text-sm text-gray-500">- Community Member</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Begin Your Journey?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of believers discovering God's word in a personal, meaningful way.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8" asChild>
              <Link href="/register">
                Create Your First Devotion
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <BookOpen className="h-6 w-6" />
                <span className="text-xl font-bold">Faithful</span>
              </div>
              <p className="text-gray-400 text-sm">
                Connecting hearts to God's word through personalized devotions and community sharing.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/discover" className="hover:text-white">
                    AI-Powered Devotions
                  </Link>
                </li>
                <li>
                  <Link href="/discover" className="hover:text-white">
                    Mood-Based Verses
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-white">
                    Community Sharing
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    Privacy Controls
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/" className="hover:text-white">
                    Public Devotions
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-white">
                    Guidelines
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-white">
                    Support
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-white">
                    Feedback
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Privacy</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-white">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-white">
                    Data Protection
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-white">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 Faithful. Built with faith and technology.</p>
          </div>
        </div>
      </footer>
    </div>
    );
}
