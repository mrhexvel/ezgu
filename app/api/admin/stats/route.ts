import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Ruxsat berilmagan" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "weekly"

    const now = new Date()
    let startDate: Date
    let previousStartDate: Date

    switch (period) {
      case "weekly":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        previousStartDate = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)
        break
      case "monthly":
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
        previousStartDate = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate())
        break
      case "yearly":
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
        previousStartDate = new Date(now.getFullYear() - 2, now.getMonth(), now.getDate())
        break
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        previousStartDate = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)
    }

    const totalUsers = await prisma.user.count()

    const newUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
    })

    const previousNewUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: previousStartDate,
          lt: startDate,
        },
      },
    })

    const usersGrowth =
      previousNewUsers > 0 ? ((newUsers - previousNewUsers) / previousNewUsers) * 100 : newUsers > 0 ? 100 : 0

    const totalProjects = await prisma.project.count()

    const newProjects = await prisma.project.count({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
    })

    const previousNewProjects = await prisma.project.count({
      where: {
        createdAt: {
          gte: previousStartDate,
          lt: startDate,
        },
      },
    })

    const projectsGrowth =
      previousNewProjects > 0
        ? ((newProjects - previousNewProjects) / previousNewProjects) * 100
        : newProjects > 0
          ? 100
          : 0

    const totalHours = await prisma.projectParticipant.aggregate({
      _sum: {
        hours: true,
      },
    })

    const newHours = await prisma.projectParticipant.aggregate({
      _sum: {
        hours: true,
      },
      where: {
        updatedAt: {
          gte: startDate,
        },
      },
    })

    const previousNewHours = await prisma.projectParticipant.aggregate({
      _sum: {
        hours: true,
      },
      where: {
        updatedAt: {
          gte: previousStartDate,
          lt: startDate,
        },
      },
    })

    const hoursGrowth =
      (previousNewHours._sum.hours || 0) > 0
        ? (((newHours._sum.hours || 0) - (previousNewHours._sum.hours || 0)) / (previousNewHours._sum.hours || 1)) * 100
        : (newHours._sum.hours || 0) > 0
          ? 100
          : 0

    const totalVisits = 32891
    const newVisits = 5432
    const visitsGrowth = 18.3

    let activityData: any = {}

    if (period === "weekly") {
      const daysOfWeek = ["Du", "Se", "Cho", "Pa", "Ju", "Sha", "Ya"]

      const usersData = await Promise.all(
        Array.from({ length: 7 }, (_, i) => {
          const dayStart = new Date(now)
          dayStart.setDate(now.getDate() - (6 - i))
          dayStart.setHours(0, 0, 0, 0)

          const dayEnd = new Date(dayStart)
          dayEnd.setHours(23, 59, 59, 999)

          return prisma.user.count({
            where: {
              createdAt: {
                gte: dayStart,
                lte: dayEnd,
              },
            },
          })
        }),
      )

      const projectsData = await Promise.all(
        Array.from({ length: 7 }, (_, i) => {
          const dayStart = new Date(now)
          dayStart.setDate(now.getDate() - (6 - i))
          dayStart.setHours(0, 0, 0, 0)

          const dayEnd = new Date(dayStart)
          dayEnd.setHours(23, 59, 59, 999)

          return prisma.project.count({
            where: {
              createdAt: {
                gte: dayStart,
                lte: dayEnd,
              },
            },
          })
        }),
      )

      activityData = {
        labels: daysOfWeek,
        users: usersData,
        projects: projectsData,
      }
    } else if (period === "monthly") {
      const weeks = ["1-hafta", "2-hafta", "3-hafta", "4-hafta"]

      const usersData = await Promise.all(
        Array.from({ length: 4 }, (_, i) => {
          const weekStart = new Date(now)
          weekStart.setDate(now.getDate() - (now.getDay() + 7 * (3 - i)))
          weekStart.setHours(0, 0, 0, 0)

          const weekEnd = new Date(weekStart)
          weekEnd.setDate(weekStart.getDate() + 6)
          weekEnd.setHours(23, 59, 59, 999)

          return prisma.user.count({
            where: {
              createdAt: {
                gte: weekStart,
                lte: weekEnd,
              },
            },
          })
        }),
      )

      const projectsData = await Promise.all(
        Array.from({ length: 4 }, (_, i) => {
          const weekStart = new Date(now)
          weekStart.setDate(now.getDate() - (now.getDay() + 7 * (3 - i)))
          weekStart.setHours(0, 0, 0, 0)

          const weekEnd = new Date(weekStart)
          weekEnd.setDate(weekStart.getDate() + 6)
          weekEnd.setHours(23, 59, 59, 999)

          return prisma.project.count({
            where: {
              createdAt: {
                gte: weekStart,
                lte: weekEnd,
              },
            },
          })
        }),
      )

      activityData = {
        labels: weeks,
        users: usersData,
        projects: projectsData,
      }
    } else {
      const months = ["Yan", "Fev", "Mar", "Apr", "May", "Iyu", "Iyu", "Avg", "Sen", "Okt", "Noy", "Dek"]

      const usersData = await Promise.all(
        Array.from({ length: 12 }, (_, i) => {
          const monthStart = new Date(now.getFullYear(), i, 1)
          const monthEnd = new Date(now.getFullYear(), i + 1, 0, 23, 59, 59, 999)

          return prisma.user.count({
            where: {
              createdAt: {
                gte: monthStart,
                lte: monthEnd,
              },
            },
          })
        }),
      )

      const projectsData = await Promise.all(
        Array.from({ length: 12 }, (_, i) => {
          const monthStart = new Date(now.getFullYear(), i, 1)
          const monthEnd = new Date(now.getFullYear(), i + 1, 0, 23, 59, 59, 999)

          return prisma.project.count({
            where: {
              createdAt: {
                gte: monthStart,
                lte: monthEnd,
              },
            },
          })
        }),
      )

      activityData = {
        labels: months,
        users: usersData,
        projects: projectsData,
      }
    }

    const recentUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    })

    const recentProjects = await prisma.project.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        image: true,
        location: true,
        status: true,
        createdAt: true,
        category: {
          select: {
            name: true,
            color: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    })

    return NextResponse.json({
      users: {
        total: totalUsers,
        new: newUsers,
        growth: usersGrowth,
      },
      projects: {
        total: totalProjects,
        new: newProjects,
        growth: projectsGrowth,
      },
      hours: {
        total: totalHours._sum.hours || 0,
        new: newHours._sum.hours || 0,
        growth: hoursGrowth,
      },
      visits: {
        total: totalVisits,
        new: newVisits,
        growth: visitsGrowth,
      },
      activityData,
      recentUsers,
      recentProjects,
    })
  } catch (error) {
    console.error("Get admin stats error:", error)
    return NextResponse.json({ error: "Statistikani olishda xatolik yuz berdi" }, { status: 500 })
  }
}
