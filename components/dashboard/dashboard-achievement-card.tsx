import type React from "react"
import { CalendarDays } from "lucide-react"
import { cn } from "@/lib/utils"

interface DashboardAchievementCardProps {
  achievement: {
    id: string
    title: string
    description: string
    icon: React.ReactNode
    date: string
    color: string
  }
}

export function DashboardAchievementCard({ achievement }: DashboardAchievementCardProps) {
  const getColorClass = (color: string) => {
    switch (color) {
      case "blue":
        return "bg-blue-500/10"
      case "green":
        return "bg-green-500/10"
      case "orange":
        return "bg-orange-500/10"
      case "purple":
        return "bg-purple-500/10"
      default:
        return "bg-primary/10"
    }
  }

  return (
    <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-primary/5 transition-colors">
      <div
        className={cn(
          "h-12 w-12 shrink-0 rounded-md flex items-center justify-center",
          getColorClass(achievement.color),
        )}
      >
        {achievement.icon}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium truncate">{achievement.title}</h4>
        <p className="text-xs text-muted-foreground truncate">{achievement.description}</p>
      </div>
      <div className="flex items-center text-xs text-muted-foreground shrink-0">
        <CalendarDays className="mr-1 h-3 w-3" />
        {achievement.date}
      </div>
    </div>
  )
}
