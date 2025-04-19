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

    const invitation = await prisma.projectParticipant.findUnique({
      where: {
        userId_projectId: {
          userId: currentUser.id,
          projectId,
        },
      },
    })

    if (!invitation) {
      return NextResponse.json({ error: "Taklif topilmadi" }, { status: 404 })
    }

    if (invitation.status !== "INVITED") {
      return NextResponse.json({ error: "Bu taklif emas yoki u allaqachon ko'rib chiqilgan" }, { status: 400 })
    }

    const updatedParticipant = await prisma.projectParticipant.update({
      where: {
        userId_projectId: {
          userId: currentUser.id,
          projectId,
        },
      },
      data: {
        status: "REJECTED",
        rejectedAt: new Date(),
      },
    })

    return NextResponse.json({
      message: "Siz loyihada ishtirok etish taklifini muvaffaqiyatli rad etdingiz",
      participant: updatedParticipant,
    })
  } catch (error) {
    console.error("Decline invitation error:", error)
    return NextResponse.json({ error: "Taklifni rad etishda xatolik yuz berdi" }, { status: 500 })
  }
}
