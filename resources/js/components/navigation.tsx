"use client"

import { useState } from "react"
import { Link, usePage } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { BookOpen, Menu, Home, Plus, Heart, Lock, UsersRound } from "lucide-react"
import { cn } from "@/lib/utils"
import { type SharedData } from "@/types"
import { UserMenuContent } from "./user-menu-content"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useInitials } from '@/hooks/use-initials';

export function Navigation() {
  const { auth } = usePage<SharedData>().props
  const [isOpen, setIsOpen] = useState(false)
  const getInitials = useInitials()

  const publicNavItems = [
    { href: "/", label: "Home", icon: Home },
    { href: '#', label: "Discover", icon: Heart },
    { href: '#', label: "Community", icon: UsersRound },
  ]

  const authenticatedNavItems = [
    { href: route('dashboard'), label: "Dashboard", icon: Home },
    { href: '#', label: "Create", icon: Plus },
    { href: '#', label: "Discover", icon: Heart },
    { href: '#', label: "Community", icon: UsersRound },
    { href: '#', label: "Privacy", icon: Lock },
  ]

  const navItems = auth.user ? authenticatedNavItems : publicNavItems

  const NavLink = ({ href, label, icon: Icon, mobile = false }: { href: string, label: string, icon: any, mobile?: boolean }) => (
    <Link
      href={href}
      className={cn(
        "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
        usePage<SharedData>().props.pathname === href ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
        mobile && "w-full",
      )}
      onClick={() => setIsOpen(false)}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </Link>
  )

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href={auth.user ? route('dashboard') : '/'} className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">Faithful</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <NavLink key={item.href} {...item} />
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {auth.user ? (
                <>
                    <div className="ml-auto flex items-center space-x-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="size-10 rounded-full p-1 hover:bg-gray-100">
                                        <Avatar className="size-8 overflow-hidden rounded-full">
                                            <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                                            <AvatarFallback>
                                                {getInitials(auth.user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    className="w-56 rounded-md border bg-white p-1 shadow-md"
                                    align="end"
                                    sideOffset={8}
                                >
                                    <UserMenuContent user={auth.user}/>
                                </DropdownMenuContent>
                            </DropdownMenu>
                    </div>
                </>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link href={route('login')}>Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href={route('register')}>Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 px-6">
              <div className="flex flex-col space-y-2 mt-14">
                {navItems.map((item) => (
                  <NavLink key={item.href} {...item} mobile />
                ))}
                <div className="mt-4 space-y-2">
                  {auth.user ? (
                    <div className="space-y-4 w-full">
                      <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                        <div className="flex-shrink-0">
                          <Avatar>
                            <AvatarFallback>
                              {getInitials(auth.user.name)}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">{auth.user.name}</p>
                          <p className="text-xs text-gray-500 truncate">{auth.user.email}</p>
                        </div>
                      </div>
                      <div className="border-t pt-2">
                        <UserMenuContent user={auth.user} mobile />
                      </div>
                    </div>
                  ) : (
                    <>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href={route('login')}>Sign In</Link>
                      </Button>
                      <Button className="w-full" asChild>
                        <Link href={route('register')}>Get Started</Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
