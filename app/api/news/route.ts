import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { slugify } from "@/lib/utils"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const featured = searchParams.get("featured") === "true"

    const skip = (page - 1) * limit

    const where: any = {}

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ]
    }

    if (featured) {
      where.featured = true
    }

    const news = await prisma.news.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    })

    const total = await prisma.news.count({ where })

    return NextResponse.json({
      news,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Get news error:", error)
    return NextResponse.json({ error: "Yangiliklar ro'yxatini olishda xatolik yuz berdi" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser || (currentUser.role !== "ADMIN" && currentUser.role !== "ORGANIZER")) {
      return NextResponse.json({ error: "Ruxsat berilmagan" }, { status: 403 })
    }

    const body = await request.json()
    const { title, content, image, featured } = body

    if (!title || !content) {
      return NextResponse.json({ error: "Sarlavha va mazmun majburiy" }, { status: 400 })
    }

    const slug = slugify(title)

    const existingNews = await prisma.news.findUnique({
      where: { slug },
    })

    if (existingNews) {
      return NextResponse.json({ error: "Bunday nomli yangilik allaqachon mavjud" }, { status: 409 })
    }

    const news = await prisma.news.create({
      data: {
        title,
        slug,
        content,
        image,
        featured: featured || false,
      },
    })

    return NextResponse.json(
      {
        message: "Yangilik muvaffaqiyatli yaratildi",
        news,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create news error:", error)
    return NextResponse.json({ error: "Yangilik yaratishda xatolik yuz berdi" }, { status: 500 })
  }
}
