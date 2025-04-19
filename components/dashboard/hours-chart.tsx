"use client"

import { useEffect, useState } from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, type TooltipProps } from "recharts"
import { useTheme } from "next-themes"

interface ChartDataPoint {
  label: string
  hours: number
}

interface HoursChartProps {
  period: string
  chartData?: ChartDataPoint[]
}

export function HoursChart({ period, chartData = [] }: HoursChartProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-full h-[300px] bg-muted/20 animate-pulse rounded-lg" />
  }

  const textColor = theme === "dark" ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)"
  const gridColor = theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"
  const primaryColor = "hsl(262, 83%, 58%)"
  const secondaryColor = "hsl(291, 64%, 42%)"

  const data = chartData.map((item) => ({
    name: item.label,
    value: item.hours,
  }))

  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-2 rounded-md shadow-md">
          <p className="font-medium">{`${label}`}</p>
          <p className="text-primary">{`${payload[0].value} soat`}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="name" stroke={textColor} />
          <YAxis stroke={textColor} />
          <Tooltip content={<CustomTooltip />} />
          <defs>
            <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={primaryColor} stopOpacity={0.8} />
              <stop offset="95%" stopColor={primaryColor} stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={secondaryColor}
            fillOpacity={1}
            fill="url(#colorHours)"
            activeDot={{ r: 8 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
