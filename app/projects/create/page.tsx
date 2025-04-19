"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { ArrowLeft, CalendarIcon, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { useAuth } from "@/components/auth-provider"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  title: z.string().min(5, {
    message: "Sarlavha kamida 5 ta belgidan iborat bo'lishi kerak",
  }),
  description: z.string().min(20, {
    message: "Tavsif kamida 20 ta belgidan iborat bo'lishi kerak",
  }),
  location: z.string().min(3, {
    message: "Joylashuv kamida 3 ta belgidan iborat bo'lishi kerak",
  }),
  startDate: z.date({
    required_error: "Boshlanish sanasini tanlang",
  }),
  endDate: z
    .date({
      required_error: "Tugash sanasini tanlang",
    })
    .optional(),
  categoryId: z.string({
    required_error: "Kategoriyani tanlang",
  }),
  image: z.string().optional(),
})

export default function CreateProjectPage() {
  const { toast } = useToast()
  const router = useRouter()
  const { user } = useAuth()
  const [categories, setCategories] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user && user.role !== "ADMIN" && user.role !== "ORGANIZER") {
      toast({
        title: "Ruxsat yo'q",
        description: "Siz loyiha yaratish uchun huquqlarga ega emassiz",
        variant: "destructive",
      })
      router.push("/projects")
    }
  }, [user, router, toast])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories")
        if (!response.ok) {
          throw new Error("Не удалось загрузить категории")
        }
        const data = await response.json()
        setCategories(data.categories)
      } catch (err) {
        console.error("Ошибка при загрузке категорий:", err)
        toast({
          title: "Xatolik",
          description: "Kategoriyalarni yuklashda xatolik yuz berdi",
          variant: "destructive",
        })
      }
    }

    fetchCategories()
  }, [toast])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      image: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Loyihani yaratishda xatolik yuz berdi")
      }

      const data = await response.json()

      toast({
        title: "Muvaffaqiyatli",
        description: "Loyiha muvaffaqiyatli yaratildi",
      })

      router.push(`/projects/${data.project.id}`)
    } catch (error) {
      console.error("Error creating project:", error)
      toast({
        title: "Xatolik",
        description: error instanceof Error ? error.message : "Loyihani yaratishda xatolik yuz berdi",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!user || (user.role !== "ADMIN" && user.role !== "ORGANIZER")) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6">
          <div className="mb-6">
            <Button variant="ghost" onClick={() => router.back()} className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Orqaga
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Yangi loyiha yaratish</h1>
            <p className="text-muted-foreground mt-2">
              Yangi volontyorlik loyihasini yarating va volontyorlarni jalb qiling
            </p>
          </div>

          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle>Loyiha ma'lumotlari</CardTitle>
              <CardDescription>Loyiha haqida barcha kerakli ma'lumotlarni kiriting</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Loyiha nomi</FormLabel>
                        <FormControl>
                          <Input placeholder="Loyiha nomini kiriting" {...field} />
                        </FormControl>
                        <FormDescription>Loyihaning qisqa va aniq nomi</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Loyiha tavsifi</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Loyiha haqida batafsil ma'lumot kiriting"
                            className="min-h-32"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>Loyiha maqsadi, vazifasi va boshqa muhim ma'lumotlar</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Joylashuv</FormLabel>
                          <FormControl>
                            <Input placeholder="Loyiha o'tkaziladigan joy" {...field} />
                          </FormControl>
                          <FormDescription>Shahar, tuman yoki aniq manzil</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kategoriya</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Kategoriyani tanlang" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>Loyiha qaysi sohaga tegishli</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Boshlanish sanasi</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground",
                                  )}
                                >
                                  {field.value ? format(field.value, "PPP") : <span>Sanani tanlang</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription>Loyiha qachon boshlanadi</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Tugash sanasi (ixtiyoriy)</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground",
                                  )}
                                >
                                  {field.value ? format(field.value, "PPP") : <span>Sanani tanlang</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value || undefined}
                                onSelect={field.onChange}
                                disabled={(date) => {
                                  const startDate = form.getValues("startDate")
                                  return startDate && date < startDate
                                }}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription>Loyiha qachon tugaydi (agar ma'lum bo'lsa)</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rasm URL (ixtiyoriy)</FormLabel>
                        <FormControl>
                          <Input placeholder="Loyiha rasmi uchun URL" {...field} />
                        </FormControl>
                        <FormDescription>Loyiha uchun rasm URL manzili</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <CardFooter className="px-0 pb-0 pt-6">
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Yaratilmoqda...
                        </>
                      ) : (
                        "Loyihani yaratish"
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
