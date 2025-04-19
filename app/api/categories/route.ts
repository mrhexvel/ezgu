import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { slugify } from "@/lib/utils"

export async function GET(request: NextRequest) {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    })

    return NextResponse.json({ categories })
  } catch (error) {
    console.error("Get categories error:", error)
    return NextResponse.json({ error: "Kategoriyalar ro'yxatini olishda xatolik yuz berdi" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Ruxsat berilmagan" }, { status: 403 })
    }

    const body = await request.json()
    const { name, description, color } = body

    if (!name) {
      return NextResponse.json({ error: "Kategoriya nomi majburiy" }, { status: 400 })
    }

    const slug = slugify(name)

    const existingCategory = await prisma.category.findUnique({
      where: { slug },
    })

    if (existingCategory) {
      return NextResponse.json({ error: "Bunday nomli kategoriya allaqachon mavjud" }, { status: 409 })
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        color,
      },
    })

    return NextResponse.json(
      {
        message: "Kategoriya muvaffaqiyatli yaratildi",
        category,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create category error:", error)
    return NextResponse.json({ error: "Kategoriya yaratishda xatolik yuz berdi" }, { status: 500 })
  }
}
