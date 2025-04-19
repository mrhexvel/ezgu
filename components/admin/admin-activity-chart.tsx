"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface ActivityData {
  labels: string[]
  users: number[]
  projects: number[]
}

interface AdminActivityChartProps {
  data: ActivityData
}

export function AdminActivityChart({ data }: AdminActivityChartProps) {
  const chartData = data.labels.map((label, index) => ({
    name: label,
    Foydalanuvchilar: data.users[index],
    Loyihalar: data.projects[index],
  }))

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Foydalanuvchilar" fill="#26d0f8" />
          <Bar dataKey="Loyihalar" fill="#f1fbe7" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
