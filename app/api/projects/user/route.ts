import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

export async function GET() {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "Avtorizatsiya talab qilinadi" }, { status: 401 })
    }

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

    const projects = userProjects.map((participant) => participant.project)

    return NextResponse.json({
      projects,
    })
  } catch (error) {
    console.error("Foydalanuvchi loyihalarini olishda xatolik:", error)
    return NextResponse.json({ error: "Loyihalarni olishda xatolik yuz berdi" }, { status: 500 })
  }
}
