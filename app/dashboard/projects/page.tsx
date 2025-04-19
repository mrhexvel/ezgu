"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Filter, Plus, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DashboardProjectList } from "@/components/dashboard/dashboard-project-list"
import { useToast } from "@/components/ui/use-toast"

interface Project {
  id: string
  title: string
  description: string
  date: string
  location: string
  status: string
  image: string
  category: string
}

export default function ProjectsPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [upcomingProjects, setUpcomingProjects] = useState<Project[]>([])
  const [completedProjects, setCompletedProjects] = useState<Project[]>([])
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories")
        if (!response.ok) {
          throw new Error("Kategoriyalarni yuklab bo'lmadi")
        }
        const data = await response.json()
        setCategories(data.categories)
      } catch (err) {
        console.error("Kategoriyalarni yuklashda xatolik:", err)
        setError("Kategoriyalarni yuklab bo'lmadi")
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch("/api/projects/user")

        if (!response.ok) {
          throw new Error("Loyihalarni yuklab bo'lmadi")
        }

        const data = await response.json()

        const upcoming: Project[] = []
        const completed: Project[] = []

        data.projects.forEach((project: any) => {
          const formattedProject: Project = {
            id: project.id,
            title: project.title,
            description: project.description,
            date: formatProjectDate(project.startDate, project.endDate),
            location: project.location,
            status: isProjectUpcoming(project.startDate, project.endDate) ? "upcoming" : "completed",
            image: project.image || "/placeholder.svg?height=100&width=100",
            category: project.category?.id || "other",
          }

          if (formattedProject.status === "upcoming") {
            upcoming.push(formattedProject)
          } else {
            completed.push(formattedProject)
          }
        })

        setUpcomingProjects(upcoming)
        setCompletedProjects(completed)
      } catch (err) {
        console.error("Loyihalarni yuklashda xatolik:", err)
        setError("Loyihalarni yuklab bo'lmadi")
        toast({
          title: "Xatolik",
          description: "Loyihalarni yuklab bo'lmadi. Iltimos, keyinroq qayta urinib ko'ring.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [toast])

  const formatProjectDate = (startDate: string, endDate?: string | null) => {
    const start = new Date(startDate)
    const startDay = start.getDate()
    const startMonth = start.toLocaleString("uz-UZ", { month: "long" })
    const startYear = start.getFullYear()

    if (endDate) {
      const end = new Date(endDate)
      const endDay = end.getDate()
      const endMonth = end.toLocaleString("uz-UZ", { month: "long" })
      const endYear = end.getFullYear()

      if (startYear === endYear && startMonth === endMonth) {
        return `${startDay}-${endDay} ${startMonth}, ${startYear}`
      } else if (startYear === endYear) {
        return `${startDay} ${startMonth} - ${endDay} ${endMonth}, ${startYear}`
      } else {
        return `${startDay} ${startMonth}, ${startYear} - ${endDay} ${endMonth}, ${endYear}`
      }
    } else {
      return `${startDay} ${startMonth}, ${startYear}`
    }
  }

  const isProjectUpcoming = (startDate: string, endDate?: string | null) => {
    const now = new Date()
    const end = endDate ? new Date(endDate) : new Date(startDate)
    return end >= now
  }

  const filteredUpcomingProjects = upcomingProjects.filter(
    (project) =>
      (categoryFilter === "all" || project.category === categoryFilter) &&
      project.title.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredCompletedProjects = completedProjects.filter(
    (project) =>
      (categoryFilter === "all" || project.category === categoryFilter) &&
      project.title.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mening loyihalarim</h1>
          <p className="text-muted-foreground">Siz ishtirok etgan va ishtirok etadigan loyihalar</p>
        </div>
        <Button asChild>
          <Link href="/projects">
            <Plus className="mr-2 h-4 w-4" />
            Yangi loyihaga qo'shilish
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Loyihalarni qidirish..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Kategoriya" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Barcha kategoriyalar</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
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
            <CardTitle>Loyihalar</CardTitle>
            <CardDescription>Sizning barcha loyihalaringiz</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-destructive">{error}</p>
                <Button variant="outline" className="mt-4" onClick={() => router.refresh()}>
                  Qayta urinish
                </Button>
              </div>
            ) : (
              <Tabs defaultValue="upcoming" className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="upcoming">Kelayotgan</TabsTrigger>
                  <TabsTrigger value="completed">Tugallangan</TabsTrigger>
                </TabsList>
                <TabsContent value="upcoming">
                  <DashboardProjectList
                    projects={filteredUpcomingProjects}
                    emptyMessage="Kelayotgan loyihalar topilmadi"
                  />
                </TabsContent>
                <TabsContent value="completed">
                  <DashboardProjectList
                    projects={filteredCompletedProjects}
                    emptyMessage="Tugallangan loyihalar topilmadi"
                  />
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
