"use client"

import { motion } from "framer-motion"
import { Clock, Filter, Mail, Search, UserPlus } from "lucide-react"
import { useEffect, useState } from "react"

import { useAuth } from "@/components/auth-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"

interface TeamMember {
  id: string
  name: string
  email: string
  avatar: string | null
  role: string
  projects: number
  hours: number
  joinedAt: string
}

export default function TeamPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setIsLoading(true)

        setTimeout(() => {
          setTeamMembers([
            {
              id: "1",
              name: "Aziz Karimov",
              email: "aziz@example.com",
              avatar: null,
              role: "leader",
              projects: 12,
              hours: 120,
              joinedAt: "2023-01-15",
            },
            {
              id: "2",
              name: "Nilufar Rahimova",
              email: "nilufar@example.com",
              avatar: null,
              role: "member",
              projects: 8,
              hours: 85,
              joinedAt: "2023-02-20",
            },
            {
              id: "3",
              name: "Jahongir Toshmatov",
              email: "jahongir@example.com",
              avatar: null,
              role: "member",
              projects: 5,
              hours: 45,
              joinedAt: "2023-03-10",
            },
            {
              id: "4",
              name: "Madina Aliyeva",
              email: "madina@example.com",
              avatar: null,
              role: "coordinator",
              projects: 10,
              hours: 95,
              joinedAt: "2023-02-05",
            },
            {
              id: "5",
              name: "Rustam Qodirov",
              email: "rustam@example.com",
              avatar: null,
              role: "member",
              projects: 6,
              hours: 60,
              joinedAt: "2023-04-15",
            },
          ])
          setIsLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching team members:", error)
        toast({
          variant: "destructive",
          title: "Xatolik",
          description: "Jamoa a'zolari ma'lumotlarini yuklab bo'lmadi",
        })
        setIsLoading(false)
      }
    }

    fetchTeamMembers()
  }, [toast])

  const filteredMembers = teamMembers.filter(
    (member) =>
      (roleFilter === "all" || member.role === roleFilter) &&
      (member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "leader":
        return <Badge className="bg-purple-500/10 text-purple-500 hover:bg-purple-500/20">Rahbar</Badge>
      case "coordinator":
        return <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">Koordinator</Badge>
      case "member":
        return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">Ishtirokchi</Badge>
      default:
        return <Badge variant="outline">Noma'lum</Badge>
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mening jamoam</h1>
        <p className="text-muted-foreground">Ko'ngillilar jamoangizni boshqaring</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="A'zolarni qidirish..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Barcha rollar</SelectItem>
              <SelectItem value="leader">Rahbar</SelectItem>
              <SelectItem value="coordinator">Koordinator</SelectItem>
              <SelectItem value="member">Ishtirokchi</SelectItem>
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
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Jamoa a'zolari</CardTitle>
              <CardDescription>Jami ishtirokchilar: {filteredMembers.length}</CardDescription>
            </div>
            <Button className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Taklif qiling
            </Button>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="all">Hammasi</TabsTrigger>
                <TabsTrigger value="active">Faol</TabsTrigger>
                <TabsTrigger value="pending">Kutuvchilar</TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-20 rounded-lg bg-muted animate-pulse" />
                    ))}
                  </div>
                ) : filteredMembers.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Ishtirokchilar topilmadi</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredMembers.map((member) => (
                      <div
                        key={member.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={member.avatar || undefined} alt={member.name} />
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{member.name}</div>
                            <div className="text-sm text-muted-foreground">{member.email}</div>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-4">
                          {getRoleBadge(member.role)}
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="mr-1 h-4 w-4" />
                            {member.hours} soat
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="h-8">
                              Profil
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Mail className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="active">
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Faol ishtirokchilar</p>
                </div>
              </TabsContent>
              <TabsContent value="pending">
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Tasdiqlashni kutish</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
