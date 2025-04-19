import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const achievements = await prisma.achievement.findMany({
      orderBy: { title: "asc" },
    })

    return NextResponse.json({ achievements })
  } catch (error) {
    console.error("Get achievements error:", error)
    return NextResponse.json({ error: "Yutuqlar ro'yxatini olishda xatolik yuz berdi" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Ruxsat berilmagan" }, { status: 403 })
    }

    const body = await request.json()
    const { title, description, icon, color, points } = body

    if (!title || !description || !icon) {
      return NextResponse.json({ error: "Sarlavha, tavsif va belgi majburiy" }, { status: 400 })
    }

    const achievement = await prisma.achievement.create({
      data: {
        title,
        description,
        icon,
        color,
        points: points || 0,
      },
    })

    return NextResponse.json(
      {
        message: "Yutuq muvaffaqiyatli yaratildi",
        achievement,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create achievement error:", error)
    return NextResponse.json({ error: "Yutuq yaratishda xatolik yuz berdi" }, { status: 500 })
  }
}
