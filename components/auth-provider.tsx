"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

type User = {
  id: string
  name: string
  email: string
  role: "VOLUNTEER" | "ORGANIZER" | "ADMIN"
  avatar?: string
  createdAt: string
  bio?: string
  location?: string
  interests?: string[]
  hours?: number
  projects?: number
  badges?: string[]
  level?: number
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
          cache: "no-store",
        })

        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        }
      } catch (error) {
        console.error("Auth check error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  useEffect(() => {
    const protectedRoutes = ["/dashboard", "/profile", "/admin"]
    const authRoutes = ["/login", "/register", "/forgot-password"]

    if (!isLoading) {
      if (!user && protectedRoutes.some((route) => pathname?.startsWith(route))) {
        router.push(`/login?redirect=${pathname}`)
      }

      if (user && authRoutes.some((route) => pathname?.startsWith(route))) {
        router.push("/dashboard")
      }

      if (user && user.role !== "ADMIN" && pathname?.startsWith("/admin")) {
        router.push("/dashboard")
        toast({
          variant: "destructive",
          title: "Kirish taqiqlangan",
          description: "Sizda ushbu sahifaga kirish huquqi yo'q",
        })
      }
    }
  }, [isLoading, user, pathname, router, toast])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Kirish xatosi")
      }

      setUser(data.user)

      toast({
        title: "Muvaffaqiyatli kirish",
        description: "Ezgu platformasiga xush kelibsiz!",
      })

      const redirectUrl = new URLSearchParams(window.location.search).get("redirect")
      router.push(redirectUrl || "/dashboard")
    } catch (error) {
      console.error("Login error:", error)
      toast({
        variant: "destructive",
        title: "Kirish xatosi",
        description: error instanceof Error ? error.message : "Noto'g'ri email yoki parol",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Ro'yxatdan o'tish xatosi")
      }

      setUser(data.user)

      toast({
        title: "Muvaffaqiyatli ro'yxatdan o'tish",
        description: "Ezgu platformasiga xush kelibsiz!",
      })

      router.push("/dashboard")
    } catch (error) {
      console.error("Registration error:", error)
      toast({
        variant: "destructive",
        title: "Ro'yxatdan o'tish xatosi",
        description: error instanceof Error ? error.message : "Ro'yxatdan o'tib bo'lmadi",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })

      setUser(null)
      router.push("/")

      toast({
        title: "Chiqish amalga oshirildi",
        description: "Siz tizimdan muvaffaqiyatli chiqdingiz",
      })
    } catch (error) {
      console.error("Logout error:", error)
      toast({
        variant: "destructive",
        title: "Chiqish xatosi",
        description: "Tizimdan chiqib bo'lmadi",
      })
    }
  }

  const resetPassword = async (email: string) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Parolni tiklash xatosi")
      }

      toast({
        title: "Parolni tiklash",
        description: data.message || "Parolni tiklash bo'yicha ko'rsatmalar emailingizga yuborildi",
      })

      router.push("/login")
    } catch (error) {
      console.error("Password reset error:", error)
      toast({
        variant: "destructive",
        title: "Parolni tiklash xatosi",
        description: error instanceof Error ? error.message : "Parolni tiklab bo'lmadi",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.error || "Profilni yangilash xatosi")
      }

      setUser({ ...user, ...responseData.user })

      toast({
        title: "Profil yangilandi",
        description: "Profilingiz muvaffaqiyatli yangilandi",
      })
    } catch (error) {
      console.error("Update profile error:", error)
      toast({
        variant: "destructive",
        title: "Xatolik",
        description: error instanceof Error ? error.message : "Profilni yangilab bo'lmadi",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        resetPassword,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
