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

    const stories = await prisma.story.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    })

    const total = await prisma.story.count({ where })

    return NextResponse.json({
      stories,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Get stories error:", error)
    return NextResponse.json({ error: "Muvaffaqiyat tarixi ro'yxatini olishda xatolik yuz berdi" }, { status: 500 })
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
      return NextResponse.json({ error: "Sarlavha, mazmun va muallif majburiy" }, { status: 400 })
    }

    const slug = slugify(title)

    const existingStory = await prisma.story.findUnique({
      where: { slug },
    })

    if (existingStory) {
      return NextResponse.json({ error: "Bunday nomli muvaffaqiyat tarixi allaqachon mavjud" }, { status: 409 })
    }

    const story = await prisma.story.create({
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
        message: "Muvaffaqiyat tarixi muvaffaqiyatli yaratildi",
        story,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create story error:", error)
    return NextResponse.json({ error: "Muvaffaqiyat tarixi yaratishda xatolik yuz berdi" }, { status: 500 })
  }
}
