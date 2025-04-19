import { getCurrentUser } from "@/lib/auth"
import prisma from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "Avtorizatsiyadan o'tilmagan" }, { status: 401 })
    }

    const invitationId = params.id

    const invitation = await prisma.projectInvitation.findUnique({
      where: {
        id: invitationId,
        userId: currentUser.id,
      },
    })

    if (!invitation) {
      return NextResponse.json({ error: "Taklif topilmadi" }, { status: 404 })
    }

    if (invitation.status !== "PENDING") {
      return NextResponse.json({ error: "Taklif allaqachon ko'rib chiqilgan" }, { status: 400 })
    }

    const result = await prisma.$transaction(async (tx) => {
      const updatedInvitation = await tx.projectInvitation.update({
        where: { id: invitationId },
        data: { status: "ACCEPTED" },
      })

      const existingParticipant = await tx.projectParticipant.findUnique({
        where: {
          userId_projectId: {
            userId: currentUser.id,
            projectId: invitation.projectId,
          },
        },
      })

      if (existingParticipant) {
        await tx.projectParticipant.update({
          where: { id: existingParticipant.id },
          data: { status: "CONFIRMED" },
        })
      } else {
        await tx.projectParticipant.create({
          data: {
            userId: currentUser.id,
            projectId: invitation.projectId,
            status: "CONFIRMED",
            invitedById: invitation.invitedById,
          },
        })
      }

      return updatedInvitation
    })

    return NextResponse.json({
      message: "Taklif muvaffaqiyatli qabul qilindi",
      invitation: result,
    })
  } catch (error) {
    console.error("Accept invitation error:", error)
    return NextResponse.json({ error: "Taklifni qabul qilishda xatolik yuz berdi" }, { status: 500 })
  }
}
