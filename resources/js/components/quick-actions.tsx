import { Button } from "./ui/button"
import { Link, usePage } from "@inertiajs/react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { BookOpen, Plus } from "lucide-react"
import { Heart } from "lucide-react"
import { UserIcon } from "lucide-react"
import { SharedData } from "@/types"

export function QuickActions() {
    const { auth, url } = usePage<SharedData>().props

    // Use window.location.pathname as fallback if url is not available
    const currentPath = url || window.location.pathname
    const isOnDashboard = currentPath.includes("dashboard")

    return (
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
                {isOnDashboard ? (
                    <Button variant="outline" className="w-full justify-start" asChild>
                        <Link href={route("discover")}>
                            <BookOpen className="h-4 w-4 mr-2" />
                            Random Verse
                        </Link>
                    </Button>
                ) : (
                    <Button variant="outline" className="w-full justify-start" asChild>
                        {auth.user ? (
                            <Link href={route("dashboard")}>
                                <UserIcon className="h-4 w-4 mr-2" />
                                My Dashboard
                            </Link>
                        ) : (
                            <Link href={route("login")}>
                                <UserIcon className="h-4 w-4 mr-2" />
                                Login to your account
                            </Link>
                        )}
                    </Button>
                )}
            </CardContent>
        </Card>
    )
}
