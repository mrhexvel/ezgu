import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { arrayToJson, jsonToArray } from "@/lib/utils"

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Ruxsat berilmagan" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const role = searchParams.get("role") || undefined

    const skip = (page - 1) * limit

    const where: any = {}

    if (search) {
      where.OR = [{ name: { contains: search } }, { email: { contains: search } }]
    }

    if (role && role !== "all") {
      where.role = role
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        location: true,
        interests: true,
        hours: true,
        level: true,
        createdAt: true,
        projects: {
          select: {
            id: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    })

    const total = await prisma.user.count({ where })

    return NextResponse.json({
      users: users.map((user) => ({
        ...user,
        interests: user.interests ? jsonToArray(user.interests as string) : [],
        projects: user.projects.length,
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Get users error:", error)
    return NextResponse.json({ error: "Foydalanuvchilar ro'yxatini olishda xatolik yuz berdi" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Ruxsat berilmagan" }, { status: 403 })
    }

    const body = await request.json()
    const { name, email, password, role, location, interests } = body

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Ism, email va rol majburiy" }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "Bunday email bilan foydalanuvchi allaqachon mavjud" }, { status: 409 })
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
        role: role || "VOLUNTEER",
        location,
        interests: interests ? arrayToJson(interests) : "[]",
      },
    })

    return NextResponse.json(
      {
        message: "Foydalanuvchi muvaffaqiyatli yaratildi",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          location: user.location,
          interests: interests || [],
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create user error:", error)
    return NextResponse.json({ error: "Foydalanuvchi yaratishda xatolik yuz berdi" }, { status: 500 })
  }
}
