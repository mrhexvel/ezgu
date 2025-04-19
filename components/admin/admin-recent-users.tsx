"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "@/lib/utils"
import Link from "next/link"

interface User {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
  createdAt: string
}

interface AdminRecentUsersProps {
  users: User[]
}

export function AdminRecentUsers({ users }: AdminRecentUsersProps) {
  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-500">Admin</Badge>
      case "ORGANIZER":
        return (
          <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 hover:text-blue-500">Tashkilotchi</Badge>
        )
      case "VOLUNTEER":
        return (
          <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 hover:text-green-500">Volontyor</Badge>
        )
      default:
        return <Badge>Foydalanuvchi</Badge>
    }
  }

  return (
    <div className="space-y-4">
      {users.length === 0 ? (
        <p className="text-center text-muted-foreground">Foydalanuvchilar topilmadi</p>
      ) : (
        users.map((user) => (
          <div key={user.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getRoleBadge(user.role)}
              <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(user.createdAt))}</span>
            </div>
          </div>
        ))
      )}
      <Button variant="outline" className="w-full" asChild>
        <Link href="/admin/users">Barcha foydalanuvchilarni ko'rish</Link>
      </Button>
    </div>
  )
}
