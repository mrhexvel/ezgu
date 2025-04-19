import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { slugify } from "@/lib/utils"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const categoryId = params.id

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        projects: true,
      },
    })

    if (!category) {
      return NextResponse.json({ error: "Kategoriya topilmadi" }, { status: 404 })
    }

    return NextResponse.json({ category })
  } catch (error) {
    console.error("Get category error:", error)
    return NextResponse.json({ error: "Kategoriya ma'lumotlarini olishda xatolik yuz berdi" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Ruxsat berilmagan" }, { status: 403 })
    }

    const categoryId = params.id

    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId },
    })

    if (!existingCategory) {
      return NextResponse.json({ error: "Kategoriya topilmadi" }, { status: 404 })
    }

    const body = await request.json()
    const { name, description, color } = body

    if (!name) {
      return NextResponse.json({ error: "Kategoriya nomi majburiy" }, { status: 400 })
    }

    let slug = existingCategory.slug
    if (name !== existingCategory.name) {
      slug = slugify(name)

      const slugExists = await prisma.category.findFirst({
        where: {
          slug,
          id: { not: categoryId },
        },
      })

      if (slugExists) {
        return NextResponse.json({ error: "Bunday nomli kategoriya allaqachon mavjud" }, { status: 409 })
      }
    }

    const category = await prisma.category.update({
      where: { id: categoryId },
      data: {
        name,
        slug,
        description,
        color,
      },
    })

    return NextResponse.json({
      message: "Kategoriya ma'lumotlari muvaffaqiyatli yangilandi",
      category,
    })
  } catch (error) {
    console.error("Update category error:", error)
    return NextResponse.json({ error: "Kategoriya ma'lumotlarini yangilashda xatolik yuz berdi" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Ruxsat berilmagan" }, { status: 403 })
    }

    const categoryId = params.id

    const projectsCount = await prisma.project.count({
      where: { categoryId },
    })

    if (projectsCount > 0) {
      return NextResponse.json(
        { error: "Kategoriyada loyihalar mavjud bo'lgani uchun uni o'chirib bo'lmaydi" },
        { status: 400 },
      )
    }

    await prisma.category.delete({
      where: { id: categoryId },
    })

    return NextResponse.json({
      message: "Kategoriya muvaffaqiyatli o'chirildi",
    })
  } catch (error) {
    console.error("Delete category error:", error)
    return NextResponse.json({ error: "Kategoriyani o'chirishda xatolik yuz berdi" }, { status: 500 })
  }
}
