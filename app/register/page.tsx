"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/components/auth-provider"
import { Checkbox } from "@/components/ui/checkbox"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const { register, isLoading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setPasswordError("Parollar mos kelmaydi")
      return
    }

    if (!agreedToTerms) {
      return
    }

    await register(name, email, password)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Glassmorphism background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 backdrop-blur-sm" />

      {/* Animated shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
          className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-primary/20"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 2.5, delay: 0.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
          className="absolute top-40 right-10 h-60 w-60 rounded-full bg-secondary/20"
        />
      </div>

      <div className="w-full max-w-md relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-lg backdrop-blur-lg bg-background/50 border border-border p-8 relative"
        >
          <div className="absolute -inset-px rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 blur-sm" />
          <div className="relative">
            <div className="mb-8">
              <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Bosh sahifaga qaytish
              </Link>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Ezgu platformasida ro'yxatdan o'tish
              </h1>
              <p className="text-muted-foreground mt-2">
                Volontyorlik faoliyatingizni boshlash uchun ro'yxatdan o'ting
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">To'liq ism</Label>
                <Input
                  id="name"
                  placeholder="Ism Familiya"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="sizning@email.uz"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Parol</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setPasswordError("")
                  }}
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Parolni tasdiqlang</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    setPasswordError("")
                  }}
                  className={`bg-background/50 ${passwordError ? "border-red-500" : ""}`}
                />
                {passwordError && <p className="text-xs text-red-500">{passwordError}</p>}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Men{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    foydalanish shartlari
                  </Link>{" "}
                  va{" "}
                  <Link href="/privacy" className="text-primary hover:underline">
                    maxfiylik siyosati
                  </Link>{" "}
                  bilan tanishdim va roziman
                </label>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading || !agreedToTerms}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Ro'yxatdan o'tish...
                  </>
                ) : (
                  "Ro'yxatdan o'tish"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Hisobingiz bormi?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Tizimga kiring
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
