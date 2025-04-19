import Image from "next/image"
import Link from "next/link"
import { Calendar, MapPin, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface DashboardProjectCardProps {
  project: {
    id: string
    title: string
    date: string
    location: string
    status: string
    image: string
  }
}

export function DashboardProjectCard({ project }: DashboardProjectCardProps) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-primary/5 transition-colors">
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md">
        <Image src={project.image || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium truncate">{project.title}</h4>
        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
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
      <Badge variant="outline" className="shrink-0">
        {project.status === "upcoming" ? "Kelayotgan" : "Tugagan"}
      </Badge>
      <Button variant="ghost" size="icon" asChild className="shrink-0">
        <Link href={`/projects/${project.id}`}>
          <ArrowRight className="h-4 w-4" />
          <span className="sr-only">View project</span>
        </Link>
      </Button>
    </div>
  )
}
