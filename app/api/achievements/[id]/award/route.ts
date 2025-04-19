import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser || (currentUser.role !== "ADMIN" && currentUser.role !== "ORGANIZER")) {
      return NextResponse.json({ error: "Ruxsat berilmagan" }, { status: 403 })
    }

    const achievementId = params.id

    const achievement = await prisma.achievement.findUnique({
      where: { id: achievementId },
    })

    if (!achievement) {
      return NextResponse.json({ error: "Yutuq topilmadi" }, { status: 404 })
    }

    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json({ error: "Foydalanuvchi ID si majburiy" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json({ error: "Foydalanuvchi topilmadi" }, { status: 404 })
    }

    const existingAward = await prisma.userAchievement.findUnique({
      where: {
        userId_achievementId: {
          userId,
          achievementId,
        },
      },
    })

    if (existingAward) {
      return NextResponse.json({ error: "Bu yutuq allaqachon foydalanuvchiga berilgan" }, { status: 409 })
    }

    const userAchievement = await prisma.userAchievement.create({
      data: {
        userId,
        achievementId,
      },
      include: {
        achievement: true,
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    })

    await prisma.user.update({
      where: { id: userId },
      data: {
        points: {
          increment: achievement.points,
        },
      },
    })

    return NextResponse.json(
      {
        message: "Yutuq muvaffaqiyatli foydalanuvchiga berildi",
        userAchievement,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Award achievement error:", error)
    return NextResponse.json({ error: "Yutuqni berishda xatolik yuz berdi" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Ruxsat berilmagan" }, { status: 403 })
    }

    const achievementId = params.id
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "Foydalanuvchi ID si majburiy" }, { status: 400 })
    }

    const userAchievement = await prisma.userAchievement.findUnique({
      where: {
        userId_achievementId: {
          userId,
          achievementId,
        },
      },
      include: {
        achievement: true,
      },
    })

    if (!userAchievement) {
      return NextResponse.json({ error: "Bu yutuq foydalanuvchiga berilmagan" }, { status: 404 })
    }

    await prisma.userAchievement.delete({
      where: {
        userId_achievementId: {
          userId,
          achievementId,
        },
      },
    })

    await prisma.user.update({
      where: { id: userId },
      data: {
        points: {
          decrement: userAchievement.achievement.points,
        },
      },
    })

    return NextResponse.json({
      message: "Yutuq muvaffaqiyatli foydalanuvchidan qaytarib olindi",
    })
  } catch (error) {
    console.error("Revoke achievement error:", error)
    return NextResponse.json({ error: "Yutuqni qaytarib olishda xatolik yuz berdi" }, { status: 500 })
  }
}
