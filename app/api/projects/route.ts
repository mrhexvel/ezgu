import { getCurrentUser } from "@/lib/auth"
import prisma from "@/lib/db"
import { slugify } from "@/lib/utils"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const category = searchParams.get("category") || undefined
    const status = searchParams.get("status") || undefined

    const skip = (page - 1) * limit

    const where: any = {}

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
      ]
    }

    if (category && category !== "all") {
      where.categoryId = category
    }

    if (status && status !== "all") {
      where.status = status
    }

    const projects = await prisma.project.findMany({
      where,
      include: {
        category: true,
        _count: {
          select: {
            participants: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    })

    const total = await prisma.project.count({ where })

    return NextResponse.json({
      projects: projects.map((project) => ({
        ...project,
        volunteers: project._count.participants,
        _count: undefined,
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Get projects error:", error)
    return NextResponse.json({ error: "Loyihalar ro'yxatini olishda xatolik yuz berdi" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser || (currentUser.role !== "ADMIN" && currentUser.role !== "ORGANIZER")) {
      return NextResponse.json({ error: "Ruxsat berilmagan" }, { status: 403 })
    }

    const body = await request.json()

    const { title, description, image, location, startDate, endDate, categoryId } = body

    if (!title || !description || !location || !startDate || !categoryId) {
      return NextResponse.json(
        {
          error: "Sarlavha, tavsif, joylashuv, boshlanish sanasi va kategoriya majburiy",
        },
        { status: 400 },
      )
    }

    const slug = slugify(title)

    const existingProject = await prisma.project.findUnique({
      where: { slug },
    })

    if (existingProject) {
      return NextResponse.json({ error: "Bunday nomli loyiha allaqachon mavjud" }, { status: 409 })
    }

    const project = await prisma.project.create({
      data: {
        title,
        slug,
        description,
        image,
        location,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        categoryId,
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json(
      {
        message: "Loyiha muvaffaqiyatli yaratildi",
        project,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create project error:", error)
    return NextResponse.json({ error: "Loyiha yaratishda xatolik yuz berdi" }, { status: 500 })
  }
}
