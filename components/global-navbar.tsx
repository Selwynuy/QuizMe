'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { ChevronDownIcon, BookOpen, BarChart3, Users, HelpCircle, Menu } from 'lucide-react'
import { createClient } from '@/lib/client'
import { useEffect, useState } from 'react'

export function GlobalNavbar() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add('no-scroll')
    } else {
      document.body.classList.remove('no-scroll')
    }

    return () => {
      document.body.classList.remove('no-scroll')
    }
  }, [isMobileMenuOpen])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image src="/QuizMe.png" alt="QuizMe Logo" width={72} height={72} priority />
          <h3 className="text-2xl font-bold">QuizMe </h3>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {/* Empty for now - all navigation moved to profile dropdown */}
        </nav>

        {/* Desktop Auth Section */}
        <div className="hidden md:flex items-center gap-3">
          {/* Explore Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                Explore
                <ChevronDownIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/dashboard" className="cursor-pointer">
                  <BookOpen className="mr-2 h-4 w-4" />
                  My Decks
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Progress
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/protected" className="cursor-pointer">
                  <Users className="mr-2 h-4 w-4" />
                  Study Groups
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/help" className="cursor-pointer">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Help & Support
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {loading ? (
            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
          ) : user ? (
            <ProfileDropdown
              userEmail={user.email}
              userName={user.user_metadata?.full_name}
              userImage={user.user_metadata?.avatar_url}
            />
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="prevent-touch">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] prevent-touch">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>Navigate to different sections of QuizMe</SheetDescription>
              </SheetHeader>

              <div className="flex flex-col space-y-4 mt-6">
                {/* Explore Section */}
                <div>
                  <h4 className="text-lg font-semibold mb-3">Explore</h4>
                  <div className="space-y-2">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100"
                    >
                      <BookOpen className="h-4 w-4" />
                      My Decks
                    </Link>
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100"
                    >
                      <BarChart3 className="h-4 w-4" />
                      Progress
                    </Link>
                    <Link
                      href="/protected"
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100"
                    >
                      <Users className="h-4 w-4" />
                      Study Groups
                    </Link>
                    <Link
                      href="/help"
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100"
                    >
                      <HelpCircle className="h-4 w-4" />
                      Help & Support
                    </Link>
                  </div>
                </div>

                {/* Auth Section */}
                <div className="border-t pt-4">
                  <h4 className="text-lg font-semibold mb-3">Account</h4>
                  {loading ? (
                    <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
                  ) : user ? (
                    <div className="space-y-2">
                      <div className="p-2 text-sm text-gray-600">
                        Welcome, {user.user_metadata?.full_name || user.email}
                      </div>
                      <Link href="/dashboard" className="block p-2 rounded-lg hover:bg-gray-100">
                        Dashboard
                      </Link>
                      <Link href="/profile" className="block p-2 rounded-lg hover:bg-gray-100">
                        Profile
                      </Link>
                      <Link href="/decks/new" className="block p-2 rounded-lg hover:bg-gray-100">
                        Create Deck
                      </Link>
                      <Link
                        href="/auth/login"
                        className="block p-2 rounded-lg hover:bg-gray-100 text-red-600"
                      >
                        Logout
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Link href="/auth/login" className="block p-2 rounded-lg hover:bg-gray-100">
                        Sign In
                      </Link>
                      <Link
                        href="/auth/sign-up"
                        className="block p-2 rounded-lg hover:bg-gray-100 bg-blue-600 text-white"
                      >
                        Get Started
                      </Link>
                    </div>
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
