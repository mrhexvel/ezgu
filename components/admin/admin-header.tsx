"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Bell, Sun, Moon, Search } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/components/auth-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function AdminHeader() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const { user } = useAuth()

  const getPageTitle = () => {
    if (pathname === "/admin") return "Dashboard"
    const path = pathname.split("/").pop()
    if (!path) return "Dashboard"
    return path.charAt(0).toUpperCase() + path.slice(1)
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <header className="h-16 border-b bg-card/80 backdrop-blur-sm sticky top-0 z-30 flex items-center justify-between px-4 md:px-6">
      <div className="md:hidden w-8" />
      <div className="hidden md:block">
        <h1 className="text-xl font-semibold">{getPageTitle()}</h1>
      </div>
      <div className="hidden md:flex items-center relative max-w-md w-full mx-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Qidirish..." className="pl-10" />
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          <span className="sr-only">Toggle theme</span>
        </Button>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"></span>
          <span className="sr-only">Notifications</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name || "Admin"} />
                <AvatarFallback>{user?.name?.charAt(0) || "A"}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium">{user?.name || "Admin"}</p>
                <p className="text-xs text-muted-foreground">{user?.email || "admin@ezgu.uz"}</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profil</DropdownMenuItem>
            <DropdownMenuItem>Sozlamalar</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => (window.location.href = "/")}>Asosiy saytga o'tish</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
