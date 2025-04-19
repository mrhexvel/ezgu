"use client"

import { motion } from "framer-motion"
import { Award, Calendar, Lock } from "lucide-react"
import { cn } from "@/lib/utils"

interface AchievementCardProps {
  achievement: {
    id: string
    title: string
    description: string
    icon: string
    color?: string
  }
  earned: boolean
  earnedDate?: string
}

export function AchievementCard({ achievement, earned, earnedDate }: AchievementCardProps) {
  const getColorClass = (color?: string) => {
    if (!color) return "bg-primary/10"

    switch (color) {
      case "blue":
        return "bg-blue-500/10 text-blue-500 dark:bg-blue-500/20"
      case "green":
        return "bg-green-500/10 text-green-500 dark:bg-green-500/20"
      case "red":
        return "bg-red-500/10 text-red-500 dark:bg-red-500/20"
      case "orange":
        return "bg-orange-500/10 text-orange-500 dark:bg-orange-500/20"
      case "purple":
        return "bg-purple-500/10 text-purple-500 dark:bg-purple-500/20"
      default:
        return "bg-primary/10 text-primary dark:bg-primary/20"
    }
  }

  const getIconComponent = () => {
    return <Award className="h-8 w-8" />
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "relative rounded-lg border p-4 h-full flex flex-col",
        earned ? "border-primary/20" : "border-muted/50 opacity-70",
      )}
    >
      <div
        className={cn("rounded-full w-12 h-12 flex items-center justify-center mb-4", getColorClass(achievement.color))}
      >
        {getIconComponent()}
      </div>
      <h3 className="font-bold text-lg mb-2">{achievement.title}</h3>
      <p className="text-sm text-muted-foreground flex-grow">{achievement.description}</p>

      {earned && earnedDate && (
        <div className="mt-4 flex items-center text-xs text-muted-foreground">
          <Calendar className="mr-1 h-3 w-3" />
          Получено: {earnedDate}
        </div>
      )}

      {!earned && (
        <div className="mt-4 flex items-center text-xs text-muted-foreground">
          <Lock className="mr-1 h-3 w-3" />
          Не получено
        </div>
      )}
    </motion.div>
  )
}
