"use client"

import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { motion } from "framer-motion"
import { Filter, Search } from "lucide-react"
import { useEffect, useState } from "react"

import { useAuth } from "@/components/auth-provider"
import { AchievementCard } from "@/components/dashboard/achievement-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  color: string
  awardedAt: string
}

export default function AchievementsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [availableAchievements, setAvailableAchievements] = useState<Achievement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        setIsLoading(true)

        const userResponse = await fetch(`/api/users/${user?.id}`)
        if (!userResponse.ok) throw new Error("Foydalanuvchi ma'lumotlarini yuklab bo'lmadi")
        const userData = await userResponse.json()

        const userAchievements = userData.user.achievements.map((item: any) => ({
          ...item.achievement,
          awardedAt: item.awardedAt,
        }))

        setAchievements(userAchievements)

        const achievementsResponse = await fetch("/api/achievements")
        if (!achievementsResponse.ok) throw new Error("Mavjud yutuqlarni yuklab bo'lmadi")
        const achievementsData = await achievementsResponse.json()

        const userAchievementIds = userAchievements.map((a: Achievement) => a.id)
        const available = achievementsData.achievements.filter((a: Achievement) => !userAchievementIds.includes(a.id))

        setAvailableAchievements(available)
      } catch (error) {
        console.error("Error fetching achievements:", error)
        toast({
          variant: "destructive",
          title: "Xatolik",
          description: "Yutuqlarni yuklab bo'lmadi",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (user?.id) {
      fetchAchievements()
    }
  }, [user?.id, toast])

  const filteredAchievements = achievements.filter(
    (achievement) =>
      (categoryFilter === "all" || achievement.color?.includes(categoryFilter)) &&
      (achievement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        achievement.description.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const filteredAvailableAchievements = availableAchievements.filter(
    (achievement) =>
      (categoryFilter === "all" || achievement.color?.includes(categoryFilter)) &&
      (achievement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        achievement.description.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mening yutuqlarim</h1>
        <p className="text-muted-foreground">Yutuqlaringiz va mukofotlaringizni ko'rib chiqing</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Yutuqlarni qidirish..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Toifa" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Barcha toifalar</SelectItem>
              <SelectItem value="blue">Ta'lim</SelectItem>
              <SelectItem value="green">Ekologiya</SelectItem>
              <SelectItem value="red">Sog'liqni saqlash</SelectItem>
              <SelectItem value="orange">Ijtimoiy yordam</SelectItem>
              <SelectItem value="purple">Madaniyat</SelectItem>
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
            <CardTitle>Yutuqlar</CardTitle>
            <CardDescription>Sizning mukofotlaringiz va mavjud yutuqlaringiz</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="earned" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="earned">Olingan ({achievements.length})</TabsTrigger>
                <TabsTrigger value="available">Mavjud ({availableAchievements.length})</TabsTrigger>
              </TabsList>
              <TabsContent value="earned">
                {isLoading ? (
                  <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-40 rounded-lg bg-muted animate-pulse" />
                    ))}
                  </div>
                ) : filteredAchievements.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Siz hali ushbu toifadagi yutuqlarga ega emassiz</p>
                  </div>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {filteredAchievements.map((achievement) => (
                      <AchievementCard
                        key={achievement.id}
                        achievement={achievement}
                        earned
                        earnedDate={
                          achievement.awardedAt
                            ? format(new Date(achievement.awardedAt), "dd MMMM yyyy", { locale: ru })
                            : undefined
                        }
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="available">
                {isLoading ? (
                  <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-40 rounded-lg bg-muted animate-pulse" />
                    ))}
                  </div>
                ) : filteredAvailableAchievements.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Ushbu toifadagi yutuqlar mavjud emas</p>
                  </div>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {filteredAvailableAchievements.map((achievement) => (
                      <AchievementCard key={achievement.id} achievement={achievement} earned={false} />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
