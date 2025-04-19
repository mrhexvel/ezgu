import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const achievementId = params.id

    const achievement = await prisma.achievement.findUnique({
      where: { id: achievementId },
      include: {
        users: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
      },
    })

    if (!achievement) {
      return NextResponse.json({ error: "Yutuq topilmadi" }, { status: 404 })
    }

    return NextResponse.json({ achievement })
  } catch (error) {
    console.error("Get achievement error:", error)
    return NextResponse.json({ error: "Yutuq ma'lumotlarini olishda xatolik yuz berdi" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Ruxsat berilmagan" }, { status: 403 })
    }

    const achievementId = params.id

    const existingAchievement = await prisma.achievement.findUnique({
      where: { id: achievementId },
    })

    if (!existingAchievement) {
      return NextResponse.json({ error: "Yutuq topilmadi" }, { status: 404 })
    }

    const body = await request.json()
    const { title, description, icon, color, points } = body

    if (!title || !description || !icon) {
      return NextResponse.json({ error: "Sarlavha, tavsif va belgi majburiy" }, { status: 400 })
    }

    const achievement = await prisma.achievement.update({
      where: { id: achievementId },
      data: {
        title,
        description,
        icon,
        color,
        points: points || 0,
      },
    })

    return NextResponse.json({
      message: "Yutuq ma'lumotlari muvaffaqiyatli yangilandi",
      achievement,
    })
  } catch (error) {
    console.error("Update achievement error:", error)
    return NextResponse.json({ error: "Yutuq ma'lumotlarini yangilashda xatolik yuz berdi" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Ruxsat berilmagan" }, { status: 403 })
    }

    const achievementId = params.id

    await prisma.achievement.delete({
      where: { id: achievementId },
    })

    return NextResponse.json({
      message: "Yutuq muvaffaqiyatli o'chirildi",
    })
  } catch (error) {
    console.error("Delete achievement error:", error)
    return NextResponse.json({ error: "Yutuqni o'chirishda xatolik yuz berdi" }, { status: 500 })
  }
}
