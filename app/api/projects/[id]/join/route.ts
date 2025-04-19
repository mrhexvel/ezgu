import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "Avtorizatsiyadan o'tilmagan" }, { status: 401 })
    }

    const projectId = params.id

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    })

    if (!project) {
      return NextResponse.json({ error: "Loyiha topilmadi" }, { status: 404 })
    }

    const existingParticipant = await prisma.projectParticipant.findUnique({
      where: {
        userId_projectId: {
          userId: currentUser.id,
          projectId,
        },
      },
    })

    if (existingParticipant) {
      return NextResponse.json({ error: "Siz allaqachon bu loyihada ishtirok etmoqdasiz" }, { status: 409 })
    }

    const participant = await prisma.projectParticipant.create({
      data: {
        userId: currentUser.id,
        projectId,
        status: "REGISTERED",
      },
      include: {
        project: true,
      },
    })

    return NextResponse.json(
      {
        message: "Ishtirok etish uchun ariza muvaffaqiyatli yuborildi",
        participant,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Join project error:", error)
    return NextResponse.json({ error: "Ishtirok etish uchun ariza yuborishda xatolik yuz berdi" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "Avtorizatsiyadan o'tilmagan" }, { status: 401 })
    }

    const projectId = params.id

    const participant = await prisma.projectParticipant.findUnique({
      where: {
        userId_projectId: {
          userId: currentUser.id,
          projectId,
        },
      },
    })

    if (!participant) {
      return NextResponse.json({ error: "Siz bu loyihada ishtirok etmaysiz" }, { status: 404 })
    }

    await prisma.projectParticipant.delete({
      where: {
        userId_projectId: {
          userId: currentUser.id,
          projectId,
        },
      },
    })

    return NextResponse.json({
      message: "Siz loyihada ishtirok etishni muvaffaqiyatli bekor qildingiz",
    })
  } catch (error) {
    console.error("Leave project error:", error)
    return NextResponse.json({ error: "Loyihada ishtirok etishni bekor qilishda xatolik yuz berdi" }, { status: 500 })
  }
}
