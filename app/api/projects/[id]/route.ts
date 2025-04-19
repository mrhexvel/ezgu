import { getCurrentUser } from "@/lib/auth"
import prisma from "@/lib/db"
import { slugify } from "@/lib/utils"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const projectId = (await params).id

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        category: true,
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
      },
    })

    if (!project) {
      return NextResponse.json({ error: "Loyiha topilmadi" }, { status: 404 })
    }

    return NextResponse.json({ project })
  } catch (error) {
    console.error("Get project error:", error)
    return NextResponse.json({ error: "Loyiha ma'lumotlarini olishda xatolik yuz berdi" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser || (currentUser.role !== "ADMIN" && currentUser.role !== "ORGANIZER")) {
      return NextResponse.json({ error: "Ruxsat berilmagan" }, { status: 403 })
    }

    const projectId = params.id

    const existingProject = await prisma.project.findUnique({
      where: { id: projectId },
    })

    if (!existingProject) {
      return NextResponse.json({ error: "Loyiha topilmadi" }, { status: 404 })
    }

    const body = await request.json()
    const { title, description, image, location, startDate, endDate, categoryId, status } = body

    if (!title || !description || !location || !startDate || !categoryId) {
      return NextResponse.json(
        {
          error: "Sarlavha, tavsif, joylashuv, boshlanish sanasi va kategoriya majburiy",
        },
        { status: 400 },
      )
    }

    let slug = existingProject.slug
    if (title !== existingProject.title) {
      slug = slugify(title)

      const slugExists = await prisma.project.findFirst({
        where: {
          slug,
          id: { not: projectId },
        },
      })

      if (slugExists) {
        return NextResponse.json({ error: "Bunday nomli loyiha allaqachon mavjud" }, { status: 409 })
      }
    }

    const project = await prisma.project.update({
      where: { id: projectId },
      data: {
        title,
        slug,
        description,
        image,
        location,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        categoryId,
        status: status || existingProject.status,
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json({
      message: "Loyiha ma'lumotlari muvaffaqiyatli yangilandi",
      project,
    })
  } catch (error) {
    console.error("Update project error:", error)
    return NextResponse.json({ error: "Loyiha ma'lumotlarini yangilashda xatolik yuz berdi" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Ruxsat berilmagan" }, { status: 403 })
    }

    const projectId = params.id

    await prisma.project.delete({
      where: { id: projectId },
    })

    return NextResponse.json({
      message: "Loyiha muvaffaqiyatli o'chirildi",
    })
  } catch (error) {
    console.error("Delete project error:", error)
    return NextResponse.json({ error: "Loyihani o'chirishda xatolik yuz berdi" }, { status: 500 })
  }
}
