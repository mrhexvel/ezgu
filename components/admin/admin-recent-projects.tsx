"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "@/lib/utils"
import Link from "next/link"

interface Project {
  id: string
  title: string
  slug: string
  image?: string
  location: string
  status: string
  createdAt: string
  category: {
    name: string
    color: string
  }
}

interface AdminRecentProjectsProps {
  projects: Project[]
}

export function AdminRecentProjects({ projects }: AdminRecentProjectsProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 hover:text-green-500">Faol</Badge>
      case "UPCOMING":
        return (
          <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 hover:text-blue-500">Kelayotgan</Badge>
        )
      case "COMPLETED":
        return (
          <Badge className="bg-gray-500/10 text-gray-500 hover:bg-gray-500/20 hover:text-gray-500">Tugallangan</Badge>
        )
      case "CANCELLED":
        return (
          <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-500">Bekor qilingan</Badge>
        )
      default:
        return <Badge>Noma'lum</Badge>
    }
  }

  const getCategoryBadge = (category: { name: string; color: string }) => {
    const style = {
      borderColor: `${category.color}50`,
      color: category.color,
    }

    return (
      <Badge variant="outline" style={style}>
        {category.name}
      </Badge>
    )
  }

  return (
    <div className="space-y-4">
      {projects.length === 0 ? (
        <p className="text-center text-muted-foreground">Loyihalar topilmadi</p>
      ) : (
        projects.map((project) => (
          <div key={project.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md">
              <Image
                src={project.image || "/placeholder.svg?height=60&width=60"}
                alt={project.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap gap-2 items-center mb-1">
                <h4 className="font-medium">{project.title}</h4>
                {getStatusBadge(project.status)}
                {getCategoryBadge(project.category)}
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <span>{project.location}</span>
                <span className="mx-2">•</span>
                <span>{formatDistanceToNow(new Date(project.createdAt))}</span>
              </div>
            </div>
          </div>
        ))
      )}
      <Button variant="outline" className="w-full" asChild>
        <Link href="/admin/projects">Barcha loyihalarni ko'rish</Link>
      </Button>
    </div>
  )
}
