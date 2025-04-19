"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Save, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"
import { UploadAvatar } from "@/components/upload-avatar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { MultiSelect } from "@/components/ui/multi-select"

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Ism kamida 2 ta belgidan iborat bo'lishi kerak",
  }),
  bio: z.string().optional(),
  location: z.string().optional(),
  interests: z.array(z.string()).optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export default function SettingsPage() {
  const { user, updateProfile } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [avatar, setAvatar] = useState<string | null>(user?.avatar || null)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || "",
      bio: user?.bio || "",
      location: user?.location || "",
      interests: user?.interests || [],
    },
  })

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        bio: user.bio || "",
        location: user.location || "",
        interests: user.interests || [],
      })
      setAvatar(user.avatar || null)
    }
  }, [user, form])

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user) return

    setIsLoading(true)
    try {
      await updateProfile({
        ...data,
        avatar,
      })

      toast({
        title: "Profil yangilandi",
        description: "Sizning profilingiz muvaffaqiyatli yangilandi",
      })
    } catch (error) {
      console.error("Update profile error:", error)
      toast({
        variant: "destructive",
        title: "Xatolik",
        description: "Profilni yangilab bo'lmadi",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const interestOptions = [
    { label: "Ta'lim", value: "education" },
    { label: "Ekologiya", value: "ecology" },
    { label: "Sog'liqni saqlash", value: "healthcare" },
    { label: "Ijtimoiy yordam", value: "social" },
    { label: "Madaniyat", value: "culture" },
    { label: "Sport", value: "sports" },
    { label: "Texnologiyalar", value: "technology" },
    { label: "San'at", value: "art" },
  ]

  if (!user) {
    return null
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profil sozlamalari</h1>
        <p className="text-muted-foreground">Profil ma'lumotlaringizni boshqaring</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative group"
      >
        <div className="absolute -inset-px rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 blur-sm group-hover:blur-md transition-all" />
        <Card className="relative backdrop-blur-sm bg-background/50 border-border">
          <CardHeader>
            <CardTitle>Profil</CardTitle>
            <CardDescription>O'zingiz haqingizda ma'lumotlarni yangilang</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-shrink-0">
                <UploadAvatar currentAvatar={avatar} name={user.name} onUpload={setAvatar} />
              </div>
              <div className="flex-1">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ism</FormLabel>
                          <FormControl>
                            <Input placeholder="Ismingiz" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>O'zingiz haqingizda</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="O'zingiz haqingizda qisqacha ma'lumot"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            O'zingiz haqingizda qisqacha ma'lumot, bu profilingizda ko'rsatiladi.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Joylashuv</FormLabel>
                          <FormControl>
                            <Input placeholder="Shahringiz" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="interests"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Qiziqishlar</FormLabel>
                          <FormControl>
                            <MultiSelect
                              options={interestOptions}
                              selected={field.value || []}
                              onChange={field.onChange}
                              placeholder="Qiziqishlaringizni tanlang"
                            />
                          </FormControl>
                          <FormDescription>Volonterlik qilishni xohlagan sohalaringizni tanlang.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saqlanmoqda...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          O'zgarishlarni saqlash
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
