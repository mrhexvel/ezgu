import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "Avtorizatsiyadan o'tilmagan" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "weekly"

    const now = new Date()
    let startDate: Date

    switch (period) {
      case "weekly":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case "monthly":
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
        break
      case "yearly":
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
        break
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    }

    if (currentUser.role === "ADMIN") {
      const totalUsers = await prisma.user.count()

      const newUsers = await prisma.user.count({
        where: {
          createdAt: {
            gte: startDate,
          },
        },
      })

      const totalProjects = await prisma.project.count()

      const newProjects = await prisma.project.count({
        where: {
          createdAt: {
            gte: startDate,
          },
        },
      })

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

      const categoriesStats = await prisma.category.findMany({
        select: {
          id: true,
          name: true,
          _count: {
            select: {
              projects: true,
            },
          },
        },
      })

      const projectStatusStats = await prisma.project.groupBy({
        by: ["status"],
        _count: {
          _all: true,
        },
      })

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
          growth: totalUsers > 0 ? (newUsers / totalUsers) * 100 : 0,
        },
        projects: {
          total: totalProjects,
          new: newProjects,
          growth: totalProjects > 0 ? (newProjects / totalProjects) * 100 : 0,
        },
        hours: {
          total: totalHours._sum.hours || 0,
          new: newHours._sum.hours || 0,
          growth: totalHours._sum.hours > 0 ? ((newHours._sum.hours || 0) / totalHours._sum.hours) * 100 : 0,
        },
        achievements: {
          total: 0,
          new: 0,
          growth: 0,
        },
        categories: categoriesStats.map((category) => ({
          name: category.name,
          count: category._count.projects,
        })),
        projectStatus: projectStatusStats.map((status) => ({
          status: status.status,
          count: status._count._all,
        })),
        recentUsers,
        recentProjects,
        level: 1,
        levelProgress: 0,
      })
    } else {
      const userProjects = await prisma.projectParticipant.findMany({
        where: {
          userId: currentUser.id,
        },
        include: {
          project: {
            include: {
              category: true,
            },
          },
        },
      })

      const totalProjects = userProjects.length

      const newProjects = userProjects.filter((p) => p.createdAt >= startDate).length

      const totalHours = userProjects.reduce((sum, p) => sum + (p.hours || 0), 0)

      const newHours = userProjects.filter((p) => p.updatedAt >= startDate).reduce((sum, p) => sum + (p.hours || 0), 0)

      const userAchievements = await prisma.userAchievement.findMany({
        where: {
          userId: currentUser.id,
        },
        include: {
          achievement: true,
        },
      })

      const totalAchievements = userAchievements.length

      const newAchievements = userAchievements.filter((a) => a.awardedAt >= startDate).length

      const upcomingProjects = userProjects
        .filter((p) => p.project.status === "UPCOMING" || p.project.status === "ACTIVE")
        .map((p) => ({
          id: p.project.id,
          title: p.project.title,
          slug: p.project.slug,
          image: p.project.image,
          location: p.project.location,
          startDate: p.project.startDate,
          endDate: p.project.endDate,
          status: p.project.status,
          category: p.project.category.name,
        }))

      const recentAchievements = userAchievements
        .sort((a, b) => b.awardedAt.getTime() - a.awardedAt.getTime())
        .slice(0, 5)
        .map((a) => ({
          id: a.achievement.id,
          title: a.achievement.title,
          description: a.achievement.description,
          icon: a.achievement.icon,
          color: a.achievement.color,
          awardedAt: a.awardedAt,
        }))

      return NextResponse.json({
        projects: {
          total: totalProjects,
          new: newProjects,
          growth: totalProjects > 0 ? (newProjects / totalProjects) * 100 : 0,
        },
        hours: {
          total: totalHours,
          new: newHours,
          growth: totalHours > 0 ? (newHours / totalHours) * 100 : 0,
        },
        achievements: {
          total: totalAchievements,
          new: newAchievements,
          growth: totalAchievements > 0 ? (newAchievements / totalAchievements) * 100 : 0,
        },
        upcomingProjects,
        recentAchievements,
        level: currentUser.level || 1,
        levelProgress: 60,
      })
    }
  } catch (error) {
    console.error("Get dashboard stats error:", error)
    return NextResponse.json({ error: "Statistikani olishda xatolik yuz berdi" }, { status: 500 })
  }
}
