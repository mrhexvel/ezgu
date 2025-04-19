"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, User, LogOut, Settings, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/components/auth-provider"
import { getInitials } from "@/lib/utils"

export function Header() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isActive = (path: string) => {
    return pathname === path
  }

  const isAdminRoute = pathname?.startsWith("/admin")
  const isDashboardRoute = pathname?.startsWith("/dashboard")

  const navItems = [
    { name: "Bosh sahifa", path: "/" },
    { name: "Loyihalar", path: "/projects" },
    { name: "Biz haqimizda", path: "/about" },
  ]

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled ? "bg-background/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Ezgu
            </span>
          </Link>

          <nav className="hidden md:flex gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(item.path) ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          )}

          {user ? (
            <>
              {!isAdminRoute && !isDashboardRoute && (
                <Button asChild variant="outline" className="hidden md:flex">
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar || undefined} alt={user.name} />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Sozlamalar</span>
                    </Link>
                  </DropdownMenuItem>
                  {user.role === "ADMIN" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Admin panel</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => {
                      logout()
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Chiqish</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" className="hidden md:flex">
                <Link href="/login">Kirish</Link>
              </Button>
              <Button asChild className="hidden md:flex">
                <Link href="/register">Ro'yxatdan o'tish</Link>
              </Button>
            </>
          )}

          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background md:hidden">
          <div className="container flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                Ezgu
              </span>
            </Link>
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              <X className="h-6 w-6" />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>
          <nav className="container grid gap-6 py-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`text-lg font-medium transition-colors hover:text-primary ${
                  isActive(item.path) ? "text-primary" : "text-foreground"
                }`}
                onClick={toggleMenu}
              >
                {item.name}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-lg font-medium transition-colors hover:text-primary"
                  onClick={toggleMenu}
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/settings"
                  className="text-lg font-medium transition-colors hover:text-primary"
                  onClick={toggleMenu}
                >
                  Sozlamalar
                </Link>
                {user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="text-lg font-medium transition-colors hover:text-primary"
                    onClick={toggleMenu}
                  >
                    Admin panel
                  </Link>
                )}
                <Button
                  variant="ghost"
                  className="justify-start px-0 text-lg font-medium text-foreground hover:text-primary"
                  onClick={() => {
                    logout()
                    toggleMenu()
                  }}
                >
                  Chiqish
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-lg font-medium transition-colors hover:text-primary"
                  onClick={toggleMenu}
                >
                  Kirish
                </Link>
                <Link
                  href="/register"
                  className="text-lg font-medium transition-colors hover:text-primary"
                  onClick={toggleMenu}
                >
                  Ro'yxatdan o'tish
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
