import { getCurrentUser } from "@/lib/auth"
import prisma from "@/lib/db"
import {
  eachDayOfInterval,
  eachMonthOfInterval,
  eachWeekOfInterval,
  format,
  isSameDay,
  isSameMonth,
  isSameWeek,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subMonths,
} from "date-fns"
import { uz } from "date-fns/locale"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "Avtorizatsiyadan o'tilmagan" }, { status: 401 })
    }

    const userId = (await params).id

    if (currentUser.id !== userId && currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Ruxsat berilmagan" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "monthly"

    const now = new Date()
    let startDate: Date
    let previousStartDate: Date
    let intervalStart: Date
    const intervalEnd: Date = now

    switch (period) {
      case "weekly":
        startDate = startOfWeek(now, { weekStartsOn: 1 })
        previousStartDate = new Date(startDate)
        previousStartDate.setDate(previousStartDate.getDate() - 7)
        intervalStart = startDate
        break
      case "monthly":
        startDate = startOfMonth(now)
        previousStartDate = new Date(startDate)
        previousStartDate.setMonth(previousStartDate.getMonth() - 1)
        intervalStart = startDate
        break
      case "yearly":
        startDate = startOfYear(now)
        previousStartDate = new Date(startDate)
        previousStartDate.setFullYear(previousStartDate.getFullYear() - 1)
        intervalStart = startDate
        break
      case "all":
        startDate = new Date(0)
        previousStartDate = new Date(0)
        intervalStart = subMonths(now, 6)
        break
      default:
        startDate = startOfMonth(now)
        previousStartDate = new Date(startDate)
        previousStartDate.setMonth(previousStartDate.getMonth() - 1)
        intervalStart = startDate
    }

    const projectParticipations = await prisma.projectParticipant.findMany({
      where: {
        userId,
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            image: true,
            status: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    })

    const totalHours = projectParticipations.reduce((sum, p) => sum + (p.hours || 0), 0)

    const periodParticipations = projectParticipations.filter((p) => p.updatedAt >= startDate)
    const periodHours = periodParticipations.reduce((sum, p) => sum + (p.hours || 0), 0)

    const previousPeriodParticipations = projectParticipations.filter(
      (p) => p.updatedAt >= previousStartDate && p.updatedAt < startDate,
    )
    const previousPeriodHours = previousPeriodParticipations.reduce((sum, p) => sum + (p.hours || 0), 0)

    let periodChange = 0
    if (previousPeriodHours > 0) {
      periodChange = Math.round(((periodHours - previousPeriodHours) / previousPeriodHours) * 100)
    } else if (periodHours > 0) {
      periodChange = 100
    }

    const projectHours = projectParticipations.map((p) => ({
      id: p.id,
      projectId: p.projectId,
      projectTitle: p.project.title,
      projectImage: p.project.image || "/placeholder.svg",
      hours: p.hours || 0,
      date: p.updatedAt.toISOString().split("T")[0],
      status: p.status,
    }))

    let chartData = []

    if (period === "weekly") {
      const days = eachDayOfInterval({
        start: intervalStart,
        end: intervalEnd,
      })

      chartData = days.map((day) => {
        const dayHours = projectParticipations
          .filter((p) => isSameDay(new Date(p.updatedAt), day))
          .reduce((sum, p) => sum + (p.hours || 0), 0)

        return {
          label: format(day, "EEE", { locale: uz }),
          hours: dayHours,
        }
      })
    } else if (period === "monthly") {
      const weeks = eachWeekOfInterval({ start: intervalStart, end: intervalEnd }, { weekStartsOn: 1 })

      chartData = weeks.map((week, index) => {
        const weekHours = projectParticipations
          .filter((p) => {
            const date = new Date(p.updatedAt)
            return isSameWeek(date, week, { weekStartsOn: 1 })
          })
          .reduce((sum, p) => sum + (p.hours || 0), 0)

        return {
          label: `${index + 1}-hafta`,
          hours: weekHours,
        }
      })
    } else if (period === "yearly") {
      const months = eachMonthOfInterval({
        start: intervalStart,
        end: intervalEnd,
      })

      chartData = months.map((month) => {
        const monthHours = projectParticipations
          .filter((p) => isSameMonth(new Date(p.updatedAt), month))
          .reduce((sum, p) => sum + (p.hours || 0), 0)

        return {
          label: format(month, "MMM", { locale: uz }),
          hours: monthHours,
        }
      })
    } else {
      const lastMonths = Array.from({ length: 6 }, (_, i) => {
        return subMonths(now, 5 - i)
      })

      chartData = lastMonths.map((month) => {
        const monthHours = projectParticipations
          .filter((p) => isSameMonth(new Date(p.updatedAt), month))
          .reduce((sum, p) => sum + (p.hours || 0), 0)

        return {
          label: format(month, "MMM yy", { locale: uz }),
          hours: monthHours,
        }
      })
    }

    return NextResponse.json({
      totalHours,
      periodHours,
      periodChange,
      projectHours,
      chartData,
    })
  } catch (error) {
    console.error("Get user hours error:", error)
    return NextResponse.json({ error: "Volontyorlik soatlarini olishda xatolik yuz berdi" }, { status: 500 })
  }
}
