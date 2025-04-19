import { Card, CardContent } from "@/components/ui/card"
import type { ReactNode } from "react"

interface StatsCardProps {
  icon: ReactNode
  value: string
  label: string
}

export function StatsCard({ icon, value, label }: StatsCardProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center p-6 text-center">
        <div className="mb-4 rounded-full bg-primary/10 p-3">{icon}</div>
        <div className="text-3xl font-bold">{value}</div>
        <p className="text-sm text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  )
}
