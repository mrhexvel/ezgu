"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Users, CalendarDays, ArrowUpRight, ArrowDownRight, Eye, Clock } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { AdminRecentUsers } from "@/components/admin/admin-recent-users"
import { AdminRecentProjects } from "@/components/admin/admin-recent-projects"
import { AdminActivityChart } from "@/components/admin/admin-activity-chart"
import { useToast } from "@/components/ui/use-toast"

interface AdminStats {
  users: {
    total: number
    new: number
    growth: number
  }
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
  visits: {
    total: number
    new: number
    growth: number
  }
  activityData: {
    labels: string[]
    users: number[]
    projects: number[]
  }
  recentUsers: any[]
  recentProjects: any[]
}

export default function AdminDashboard() {
  const [period, setPeriod] = useState("weekly")
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/admin/stats?period=${period}`)
        if (!response.ok) {
          throw new Error("Xatolik yuz berdi")
        }
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error("Error fetching admin stats:", error)
        toast({
          title: "Xatolik",
          description: "Ma'lumotlarni yuklashda xatolik yuz berdi",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [period, toast])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Ezgu platformasi statistikasi va boshqaruvi</p>
        </div>
        <div className="flex items-center gap-2">
          <Tabs defaultValue="weekly" className="w-[300px]" onValueChange={(value) => setPeriod(value)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="weekly">Haftalik</TabsTrigger>
              <TabsTrigger value="monthly">Oylik</TabsTrigger>
              <TabsTrigger value="yearly">Yillik</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Foydalanuvchilar</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? "..." : stats?.users.total.toLocaleString()}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                {!isLoading && stats?.users.growth !== 0 && (
                  <span
                    className={`flex items-center ${
                      stats?.users.growth && stats.users.growth > 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {stats?.users.growth && stats.users.growth > 0 ? (
                      <ArrowUpRight className="mr-1 h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="mr-1 h-3 w-3" />
                    )}
                    {Math.abs(stats?.users.growth || 0).toFixed(1)}%
                  </span>
                )}
                <span>Oxirgi {period === "weekly" ? "hafta" : period === "monthly" ? "oy" : "yil"}</span>
              </div>
              <Progress className="mt-3" value={75} />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loyihalar</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? "..." : stats?.projects.total.toLocaleString()}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                {!isLoading && stats?.projects.growth !== 0 && (
                  <span
                    className={`flex items-center ${
                      stats?.projects.growth && stats.projects.growth > 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {stats?.projects.growth && stats.projects.growth > 0 ? (
                      <ArrowUpRight className="mr-1 h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="mr-1 h-3 w-3" />
                    )}
                    {Math.abs(stats?.projects.growth || 0).toFixed(1)}%
                  </span>
                )}
                <span>Oxirgi {period === "weekly" ? "hafta" : period === "monthly" ? "oy" : "yil"}</span>
              </div>
              <Progress className="mt-3" value={65} />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Volontyorlik soatlari</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? "..." : stats?.hours.total.toLocaleString()}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                {!isLoading && stats?.hours.growth !== 0 && (
                  <span
                    className={`flex items-center ${
                      stats?.hours.growth && stats.hours.growth > 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {stats?.hours.growth && stats.hours.growth > 0 ? (
                      <ArrowUpRight className="mr-1 h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="mr-1 h-3 w-3" />
                    )}
                    {Math.abs(stats?.hours.growth || 0).toFixed(1)}%
                  </span>
                )}
                <span>Oxirgi {period === "weekly" ? "hafta" : period === "monthly" ? "oy" : "yil"}</span>
              </div>
              <Progress className="mt-3" value={45} />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tashrif buyuruvchilar</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? "..." : stats?.visits.total.toLocaleString()}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                {!isLoading && stats?.visits.growth !== 0 && (
                  <span
                    className={`flex items-center ${
                      stats?.visits.growth && stats.visits.growth > 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {stats?.visits.growth && stats.visits.growth > 0 ? (
                      <ArrowUpRight className="mr-1 h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="mr-1 h-3 w-3" />
                    )}
                    {Math.abs(stats?.visits.growth || 0).toFixed(1)}%
                  </span>
                )}
                <span>Oxirgi {period === "weekly" ? "hafta" : period === "monthly" ? "oy" : "yil"}</span>
              </div>
              <Progress className="mt-3" value={85} />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="md:col-span-4"
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Faollik statistikasi</CardTitle>
              <CardDescription>
                Platformadagi faollik statistikasi (
                {period === "weekly" ? "haftalik" : period === "monthly" ? "oylik" : "yillik"})
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <p>Ma'lumotlar yuklanmoqda...</p>
                </div>
              ) : (
                stats && <AdminActivityChart data={stats.activityData} />
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="md:col-span-3"
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Yangi foydalanuvchilar</CardTitle>
              <CardDescription>Oxirgi qo'shilgan foydalanuvchilar</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <p>Ma'lumotlar yuklanmoqda...</p>
                </div>
              ) : (
                stats && <AdminRecentUsers users={stats.recentUsers} />
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>So'nggi loyihalar</CardTitle>
            <CardDescription>Platformaga qo'shilgan so'nggi loyihalar</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <p>Ma'lumotlar yuklanmoqda...</p>
              </div>
            ) : (
              stats && <AdminRecentProjects projects={stats.recentProjects} />
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
