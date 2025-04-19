import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { slugify } from "@/lib/utils"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const newsId = params.id

    const news = await prisma.news.findUnique({
      where: { id: newsId },
    })

    if (!news) {
      const newsBySlug = await prisma.news.findUnique({
        where: { slug: newsId },
      })

      if (!newsBySlug) {
        return NextResponse.json({ error: "Yangilik topilmadi" }, { status: 404 })
      }

      return NextResponse.json({ news: newsBySlug })
    }

    return NextResponse.json({ news })
  } catch (error) {
    console.error("Get news error:", error)
    return NextResponse.json({ error: "Yangilik ma'lumotlarini olishda xatolik yuz berdi" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser || (currentUser.role !== "ADMIN" && currentUser.role !== "ORGANIZER")) {
      return NextResponse.json({ error: "Ruxsat berilmagan" }, { status: 403 })
    }

    const newsId = params.id

    const existingNews = await prisma.news.findUnique({
      where: { id: newsId },
    })

    if (!existingNews) {
      return NextResponse.json({ error: "Yangilik topilmadi" }, { status: 404 })
    }

    const body = await request.json()
    const { title, content, image, featured } = body

    if (!title || !content) {
      return NextResponse.json({ error: "Sarlavha va mazmun majburiy" }, { status: 400 })
    }

    let slug = existingNews.slug
    if (title !== existingNews.title) {
      slug = slugify(title)

      const slugExists = await prisma.news.findFirst({
        where: {
          slug,
          id: { not: newsId },
        },
      })

      if (slugExists) {
        return NextResponse.json({ error: "Bunday nomli yangilik allaqachon mavjud" }, { status: 409 })
      }
    }

    const news = await prisma.news.update({
      where: { id: newsId },
      data: {
        title,
        slug,
        content,
        image,
        featured: featured !== undefined ? featured : existingNews.featured,
      },
    })

    return NextResponse.json({
      message: "Yangilik ma'lumotlari muvaffaqiyatli yangilandi",
      news,
    })
  } catch (error) {
    console.error("Update news error:", error)
    return NextResponse.json({ error: "Yangilik ma'lumotlarini yangilashda xatolik yuz berdi" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Ruxsat berilmagan" }, { status: 403 })
    }

    const newsId = params.id

    await prisma.news.delete({
      where: { id: newsId },
    })

    return NextResponse.json({
      message: "Yangilik muvaffaqiyatli o'chirildi",
    })
  } catch (error) {
    console.error("Delete news error:", error)
    return NextResponse.json({ error: "Yangilikni o'chirishda xatolik yuz berdi" }, { status: 500 })
  }
}
