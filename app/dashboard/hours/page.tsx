"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Clock, Calendar, ArrowUp, ArrowDown, Filter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"
import { HoursChart } from "@/components/dashboard/hours-chart"
import { HoursTable } from "@/components/dashboard/hours-table"

interface ProjectHours {
  id: string
  projectId: string
  projectTitle: string
  projectImage: string
  hours: number
  date: string
  status: string
}

interface ChartDataPoint {
  label: string
  hours: number
}

export default function HoursPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [period, setPeriod] = useState("monthly")
  const [projectHours, setProjectHours] = useState<ProjectHours[]>([])
  const [totalHours, setTotalHours] = useState(0)
  const [periodHours, setPeriodHours] = useState(0)
  const [periodChange, setPeriodChange] = useState(0)
  const [nextLevelHours, setNextLevelHours] = useState(100)
  const [levelProgress, setLevelProgress] = useState(0)
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])

  useEffect(() => {
    const fetchHoursData = async () => {
      if (!user?.id) return

      try {
        setIsLoading(true)

        const response = await fetch(`/api/users/${user.id}/hours?period=${period}`)
        if (!response.ok) throw new Error("Soatlar ma'lumotlarini olishda xatolik")

        const data = await response.json()

        setProjectHours(data.projectHours || [])
        setTotalHours(data.totalHours || 0)
        setPeriodHours(data.periodHours || 0)
        setPeriodChange(data.periodChange || 0)
        setChartData(data.chartData || [])

        const currentLevel = user.level || 1
        const requiredHours = currentLevel * 100
        const nextLevel = requiredHours
        const progress = Math.min(100, Math.round((totalHours % requiredHours) / (requiredHours / 100)))

        setNextLevelHours(nextLevel)
        setLevelProgress(progress)
      } catch (error) {
        console.error("Error fetching hours data:", error)
        toast({
          variant: "destructive",
          title: "Xatolik",
          description: "Volontyorlik soatlari ma'lumotlarini yuklashda xatolik yuz berdi",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchHoursData()
  }, [user?.id, user?.level, period, toast, totalHours])

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Volontyorlik soatlari</h1>
          <p className="text-muted-foreground">Volontyorlik soatlaringizni kuzating va rivojlantiring</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Davr" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Hafta</SelectItem>
              <SelectItem value="monthly">Oy</SelectItem>
              <SelectItem value="yearly">Yil</SelectItem>
              <SelectItem value="all">Barcha vaqt</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative group"
        >
          <div className="absolute -inset-px rounded-lg bg-gradient-to-r from-primary/20 to-secondary/20 blur-sm group-hover:blur-md transition-all" />
          <Card className="relative backdrop-blur-sm bg-background/50 border-border h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Jami soatlar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-2xl font-bold">{isLoading ? "..." : user?.hours || totalHours}</span>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Daraja {(user?.level || 1) + 1} gacha progress</span>
                  <span className="text-xs text-muted-foreground">{levelProgress}%</span>
                </div>
                <Progress value={levelProgress} className="h-2" />
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
          <Card className="relative backdrop-blur-sm bg-background/50 border-border h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                {period === "weekly"
                  ? "Hafta davomida"
                  : period === "monthly"
                    ? "Oy davomida"
                    : period === "yearly"
                      ? "Yil davomida"
                      : "Barcha vaqt davomida"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-2xl font-bold">{isLoading ? "..." : periodHours}</span>
                </div>
                {periodChange !== 0 && (
                  <div className={`flex items-center text-sm ${periodChange > 0 ? "text-green-500" : "text-red-500"}`}>
                    {periodChange > 0 ? <ArrowUp className="mr-1 h-3 w-3" /> : <ArrowDown className="mr-1 h-3 w-3" />}
                    <span>{Math.abs(periodChange)}%</span>
                  </div>
                )}
              </div>
              <div className="mt-4">
                <p className="text-xs text-muted-foreground">
                  {periodChange > 0
                    ? `Oldingi davrga nisbatan ${periodChange}% ko'proq`
                    : periodChange < 0
                      ? `Oldingi davrga nisbatan ${Math.abs(periodChange)}% kamroq`
                      : "Oldingi davrga nisbatan o'zgarish yo'q"}
                </p>
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
          <Card className="relative backdrop-blur-sm bg-background/50 border-border h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Volontyor darajasi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Award className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-2xl font-bold">{user?.level || 1}</span>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-xs text-muted-foreground">
                  Keyingi darajaga chiqish uchun yana {nextLevelHours - (totalHours % nextLevelHours)} soat kerak
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
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
            <CardTitle>Soatlar statistikasi</CardTitle>
            <CardDescription>
              {period === "weekly"
                ? "Hafta davomidagi"
                : period === "monthly"
                  ? "Oy davomidagi"
                  : period === "yearly"
                    ? "Yil davomidagi"
                    : "Barcha vaqt davomidagi"}{" "}
              volontyorlik soatlaringiz
            </CardDescription>
          </CardHeader>
          <CardContent>
            <HoursChart period={period} chartData={chartData} />
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
        <Card className="relative backdrop-blur-sm bg-background/50 border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Soatlar tarixi</CardTitle>
              <CardDescription>Loyihalar bo'yicha volontyorlik soatlaringiz</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtr
            </Button>
          </CardHeader>
          <CardContent>
            <HoursTable hours={isLoading ? [] : projectHours} />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

function Award(props: any) {
  return <Clock {...props} />
}
