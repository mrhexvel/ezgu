import { getCurrentUser } from "@/lib/auth"
import prisma from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "Avtorizatsiyadan o'tilmagan" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")
    const name = searchParams.get("name")
    const limit = Number.parseInt(searchParams.get("limit") || "5")

    if (!email && !name) {
      return NextResponse.json({ error: "Необходимо указать email или имя для поиска" }, { status: 400 })
    }

    const where: any = {
      OR: [],
    }

    if (email) {
      where.OR.push({ email: { contains: email } })
    }

    if (name) {
      where.OR.push({ name: { contains: name } })
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
      },
      take: limit,
    })

    return NextResponse.json({ users })
  } catch (error) {
    console.error("Search users error:", error)
    return NextResponse.json({ error: "Foydalanuvchilarni qidirishda xatolik yuz berdi" }, { status: 500 })
  }
}
