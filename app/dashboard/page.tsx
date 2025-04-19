"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, Award, ArrowUp, ArrowRight } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/components/ui/use-toast"
import { DashboardProjectCard } from "@/components/dashboard/dashboard-project-card"
import { DashboardAchievementCard } from "@/components/dashboard/dashboard-achievement-card"

interface DashboardStats {
  projects: {
    total: number
    new: number
    growth: number
  }
  hours: {
    total: number
    new: number
    growth: number
  }
  achievements?: {
    total: number
    new: number
    growth: number
  }
  upcomingProjects: any[]
  recentAchievements: any[]
  level: number
  levelProgress: number
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (!user?.id) return

      try {
        setIsLoading(true)
        const response = await fetch("/api/dashboard/stats")

        if (!response.ok) {
          throw new Error("Statistika ma'lumotlarini olishda xatolik")
        }

        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error("Error fetching dashboard stats:", error)
        toast({
          variant: "destructive",
          title: "Xatolik",
          description: "Dashboard ma'lumotlarini yuklashda xatolik yuz berdi",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardStats()
  }, [user?.id, toast])

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Salom, {user?.name}! Volontyorlik faoliyatingiz haqida ma'lumotlar</p>
        </div>
        <Button asChild>
          <Link href="/projects">
            Yangi loyihalarga qo'shilish
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative group"
        >
          <div className="absolute -inset-px rounded-lg bg-gradient-to-r from-primary/20 to-secondary/20 blur-sm group-hover:blur-md transition-all" />
          <Card className="relative backdrop-blur-sm bg-background/50 border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Volontyorlik soatlari</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-2xl font-bold">
                    {isLoading ? "..." : stats?.hours.total || user?.hours || 0}
                  </span>
                </div>
                {!isLoading && stats?.hours.growth !== 0 && (
                  <div className="flex items-center text-green-500 text-sm">
                    <ArrowUp className="mr-1 h-3 w-3" />
                    <span>{stats?.hours.growth || 0}%</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="relative group"
        >
          <div className="absolute -inset-px rounded-lg bg-gradient-to-r from-primary/20 to-secondary/20 blur-sm group-hover:blur-md transition-all" />
          <Card className="relative backdrop-blur-sm bg-background/50 border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Loyihalar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-2xl font-bold">
                    {isLoading ? "..." : stats?.projects.total || user?.projects || 0}
                  </span>
                </div>
                {!isLoading && stats?.projects.growth !== 0 && (
                  <div className="flex items-center text-green-500 text-sm">
                    <ArrowUp className="mr-1 h-3 w-3" />
                    <span>{stats?.projects.growth || 0}%</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="relative group"
        >
          <div className="absolute -inset-px rounded-lg bg-gradient-to-r from-primary/20 to-secondary/20 blur-sm group-hover:blur-md transition-all" />
          <Card className="relative backdrop-blur-sm bg-background/50 border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Yutuqlar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Award className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-2xl font-bold">
                    {isLoading ? "..." : stats?.achievements?.total || user?.badges?.length || 0}
                  </span>
                </div>
                {!isLoading && stats?.achievements?.growth !== 0 && (
                  <div className="flex items-center text-green-500 text-sm">
                    <ArrowUp className="mr-1 h-3 w-3" />
                    <span>{stats?.achievements?.growth || 0}%</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="relative group"
        >
          <div className="absolute -inset-px rounded-lg bg-gradient-to-r from-primary/20 to-secondary/20 blur-sm group-hover:blur-md transition-all" />
          <Card className="relative backdrop-blur-sm bg-background/50 border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Daraja</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{isLoading ? "..." : stats?.level || user?.level || 1}</span>
                  <span className="text-xs text-muted-foreground">
                    {isLoading ? "..." : stats?.levelProgress || 60}%
                  </span>
                </div>
                <Progress value={isLoading ? 0 : stats?.levelProgress || 60} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative group"
        >
          <div className="absolute -inset-px rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 blur-sm group-hover:blur-md transition-all" />
          <Card className="relative backdrop-blur-sm bg-background/50 border-border h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>Kelayotgan loyihalar</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard/projects">
                    Barchasi
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <CardDescription>Siz ishtirok etadigan loyihalar</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-24 rounded-lg bg-muted animate-pulse" />
                  ))}
                </div>
              ) : stats?.upcomingProjects && stats.upcomingProjects.length > 0 ? (
                <div className="space-y-4">
                  {stats.upcomingProjects.map((project) => (
                    <DashboardProjectCard key={project.id} project={project} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-muted/20 rounded-lg">
                  <p className="text-muted-foreground">Kelayotgan loyihalar yo'q</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="relative group"
        >
          <div className="absolute -inset-px rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 blur-sm group-hover:blur-md transition-all" />
          <Card className="relative backdrop-blur-sm bg-background/50 border-border h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>So'nggi yutuqlar</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard/achievements">
                    Barchasi
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <CardDescription>Siz erishgan yutuqlar</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-24 rounded-lg bg-muted animate-pulse" />
                  ))}
                </div>
              ) : stats?.recentAchievements && stats.recentAchievements.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentAchievements.map((achievement) => (
                    <DashboardAchievementCard key={achievement.id} achievement={achievement} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-muted/20 rounded-lg">
                  <p className="text-muted-foreground">Yutuqlar yo'q</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="relative group"
      >
        <div className="absolute -inset-px rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 blur-sm group-hover:blur-md transition-all" />
        <Card className="relative backdrop-blur-sm bg-background/50 border-border">
          <CardHeader>
            <CardTitle>Volontyorlik yo'lim</CardTitle>
            <CardDescription>Sizning volontyorlik faoliyatingiz tarixi</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
              <div className="space-y-8 relative pl-10">
                <div>
                  <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <h3 className="font-medium">Ezgu platformasiga qo'shildingiz</h3>
                  <p className="text-sm text-muted-foreground">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : ""}
                  </p>
                </div>
                {!isLoading && stats?.upcomingProjects && stats.upcomingProjects.length > 0 && (
                  <div>
                    <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    <h3 className="font-medium">Birinchi loyihada ishtirok etdingiz</h3>
                    <p className="text-sm text-muted-foreground">{stats.upcomingProjects[0].date || ""}</p>
                  </div>
                )}
                {!isLoading && stats?.recentAchievements && stats.recentAchievements.length > 0 && (
                  <div>
                    <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    <h3 className="font-medium">Birinchi yutuqni qo'lga kiritdingiz</h3>
                    <p className="text-sm text-muted-foreground">
                      {stats.recentAchievements[0].awardedAt
                        ? new Date(stats.recentAchievements[0].awardedAt).toLocaleDateString()
                        : ""}
                    </p>
                  </div>
                )}
                {!isLoading && stats?.level && stats.level > 1 && (
                  <div>
                    <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    <h3 className="font-medium">{stats.level}-darajaga ko'tarildingiz</h3>
                    <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
