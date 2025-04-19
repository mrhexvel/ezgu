"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Loader2, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/components/auth-provider"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { resetPassword, isLoading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await resetPassword(email)
    setIsSubmitted(true)
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
              <Link href="/login" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kirish sahifasiga qaytish
              </Link>
            </div>

            {isSubmitted ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle className="h-10 w-10 text-primary" />
                </div>
                <h1 className="mt-4 text-2xl font-bold">Parolni tiklash</h1>
                <p className="mt-2 text-muted-foreground">
                  Parolni tiklash uchun ko'rsatmalar {email} emailiga yuborildi. Iltimos, emailingizni tekshiring.
                </p>
                <Button className="mt-6" asChild>
                  <Link href="/login">Kirish sahifasiga qaytish</Link>
                </Button>
              </motion.div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Parolni tiklash
                  </h1>
                  <p className="text-muted-foreground mt-2">Parolingizni tiklash uchun emailingizni kiriting</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
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

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Yuborilmoqda...
                      </>
                    ) : (
                      "Parolni tiklash"
                    )}
                  </Button>
                </form>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
