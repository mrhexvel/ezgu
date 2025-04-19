import Image from "next/image"
import Link from "next/link"
import { Calendar, MapPin, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

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

interface DashboardProjectListProps {
  projects: Project[]
  emptyMessage: string
}

export function DashboardProjectList({ projects, emptyMessage }: DashboardProjectListProps) {
  const getCategoryName = (categoryId: string) => {
    const categories: Record<string, string> = {
      education: "Ta'lim",
      ecology: "Ekologiya",
      healthcare: "Sog'liqni saqlash",
      social: "Ijtimoiy yordam",
      culture: "Madaniyat",
    }

    return categories[categoryId] || "Boshqa"
  }

  const getCategoryColor = (categoryId: string) => {
    const colors: Record<string, string> = {
      education: "bg-blue-500/10 text-blue-500 dark:bg-blue-500/20",
      ecology: "bg-green-500/10 text-green-500 dark:bg-green-500/20",
      healthcare: "bg-red-500/10 text-red-500 dark:bg-red-500/20",
      social: "bg-orange-500/10 text-orange-500 dark:bg-orange-500/20",
      culture: "bg-purple-500/10 text-purple-500 dark:bg-purple-500/20",
    }

    return colors[categoryId] || "bg-primary/10 text-primary dark:bg-primary/20"
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <div
          key={project.id}
          className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg hover:bg-primary/5 transition-colors"
        >
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md">
            <Image src={project.image || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-2 mb-1">
              <h4 className="font-medium">{project.title}</h4>
              <Badge className={getCategoryColor(project.category)}>{getCategoryName(project.category)}</Badge>
              <Badge variant="outline">{project.status === "upcoming" ? "Kelayotgan" : "Tugagan"}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{project.description}</p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center">
                <Calendar className="mr-1 h-3 w-3" />
                {project.date}
              </div>
              <div className="flex items-center">
                <MapPin className="mr-1 h-3 w-3" />
                {project.location}
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" asChild className="shrink-0 self-end sm:self-center">
            <Link href={`/projects/${project.id}`}>
              Batafsil
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      ))}
    </div>
  )
}
