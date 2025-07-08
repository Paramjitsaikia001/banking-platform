/**
 * Header Component
 * 
 * This is the main navigation header that appears on all pages of the banking platform.
 * It provides:
 * - Responsive navigation with mobile menu
 * - User authentication state management
 * - Dynamic navigation based on user login status
 * - Theme toggle functionality
 * - User profile dropdown with quick actions
 * - Notification indicator
 * 
 * The header adapts its content based on:
 * - Current page (auth pages, dashboard, landing page)
 * - User authentication status
 * - Screen size (mobile vs desktop)
 */

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { useAuth } from "@/app/context/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Menu, X, Bell, User, LogOut, CreditCard, Settings } from "lucide-react"

export default function Header() {
  // State management for mobile menu and scroll effects
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)

  // Handle scroll effect for header background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  // Handle keyboard events for mobile menu
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMenuOpen])

  // Determine current page type for conditional rendering
  const isAuthPage = pathname?.startsWith("/auth")
  const isDashboardPage =
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/wallet") ||
    pathname?.startsWith("/payments") ||
    pathname?.startsWith("/bills") ||
    pathname?.startsWith("/profile")

  return (
    <header
      className={`flex justify-center sticky top-0 z-50 w-full border-b ${isScrolled ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" : "bg-background"}`}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <CreditCard className="h-6 w-6" />                              {/* card logo */}
            <span className="font-bold text-xl">BankApp</span>
          </Link>

          {!isAuthPage && !isDashboardPage && (
            <nav className="hidden md:flex items-center gap-6 ml-6">
              <Link href="/#features" className="text-sm font-medium hover:underline underline-offset-4">
                Features
              </Link>
              <Link href="/#pricing" className="text-sm font-medium hover:underline underline-offset-4">
                Pricing
              </Link>
              <Link href="/#testimonials" className="text-sm font-medium hover:underline underline-offset-4">
                Testimonials
              </Link>
              <Link href="/#faq" className="text-sm font-medium hover:underline underline-offset-4">
                FAQ
              </Link>
            </nav>
          )}

          {isDashboardPage && (
            <nav className="hidden md:flex items-center gap-6 ml-6">
              <Link
                href="/dashboard"
                className={`text-sm font-medium hover:underline underline-offset-4 ${pathname === "/dashboard" ? "text-primary" : ""}`}
              >
                Dashboard
              </Link>
              <Link
                href="/wallet"
                className={`text-sm font-medium hover:underline underline-offset-4 ${pathname === "/wallet" ? "text-primary" : ""}`}
              >
                Wallet
              </Link>
              <Link
                href="/payments"
                className={`text-sm font-medium hover:underline underline-offset-4 ${pathname === "/payments" ? "text-primary" : ""}`}
              >
                Payments
              </Link>
              <Link
                href="/bills"
                className={`text-sm font-medium hover:underline underline-offset-4 ${pathname === "/bills" ? "text-primary" : ""}`}
              >
                Bills
              </Link>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-2">
          <ModeToggle />

          {user ? (
            <>
              <Button variant="ghost" size="icon" className="relative" asChild>
                <Link href="/notifications">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-primary"></span>
                </Link>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-user.jpg" alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/wallet">
                      <CreditCard className="mr-2 h-4 w-4" />
                      <span>Wallet</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              {!isAuthPage && (
                <>
                  <Button variant="ghost" asChild>
                    <Link href="/auth/login">Sign In</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/auth/register">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          )}

          {user ? (
            // Profile circle for logged-in users
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-user.jpg" alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/wallet">
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Wallet</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // Hamburger menu for non-logged-in users
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          )}
        </div>
      </div>

      {/* Mobile menu overlay */}
      {isMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40" 
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile menu (always rendered for animation) */}
      <div className={`md:hidden fixed top-0 right-0 h-full w-1/2 bg-background shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
        isMenuOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'
      }`}>
        {/* Close icon */}
        <button
          className="absolute top-4 right-4 md:hidden p-2 rounded-full hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary"
          onClick={() => setIsMenuOpen(false)}
          aria-label="Close menu"
          type="button"
        >
          <X className="h-6 w-6" />
        </button>
        <div className="p-6 pt-14 space-y-6 h-full overflow-y-auto">
          {/* Simple navigation for all pages */}
          <nav className="flex flex-col space-y-2">
            <Link 
              href="/" 
              className="text-base font-medium py-2 px-4 rounded hover:bg-accent" 
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/dashboard" 
              className="text-base font-medium py-2 px-4 rounded hover:bg-accent" 
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link 
              href="/wallet" 
              className="text-base font-medium py-2 px-4 rounded hover:bg-accent" 
              onClick={() => setIsMenuOpen(false)}
            >
              Wallet
            </Link>
            <Link 
              href="/payments" 
              className="text-base font-medium py-2 px-4 rounded hover:bg-accent" 
              onClick={() => setIsMenuOpen(false)}
            >
              Payments
            </Link>
            <Link 
              href="/bills" 
              className="text-base font-medium py-2 px-4 rounded hover:bg-accent" 
              onClick={() => setIsMenuOpen(false)}
            >
              Bills
            </Link>
            <Link 
              href="/profile" 
              className="text-base font-medium py-2 px-4 rounded hover:bg-accent" 
              onClick={() => setIsMenuOpen(false)}
            >
              Profile
            </Link>
          </nav>

          {/* Auth buttons */}
          {!user && (
            <div className="flex flex-col space-y-2 pt-4 border-t">
              <Button variant="outline" asChild className="w-full">
                <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                  Sign In
                </Link>
              </Button>
              <Button asChild className="w-full">
                <Link href="/auth/register" onClick={() => setIsMenuOpen(false)}>
                  Sign Up
                </Link>
              </Button>
            </div>
          )}

          {/* User info for logged in users */}
          {user && (
            <div className="pt-4 border-t">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-user.jpg" alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium text-sm">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-destructive" 
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
