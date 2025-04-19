import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { slugify } from "@/lib/utils"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const storyId = params.id

    const story = await prisma.story.findUnique({
      where: { id: storyId },
    })

    if (!story) {
      const storyBySlug = await prisma.story.findUnique({
        where: { slug: storyId },
      })

      if (!storyBySlug) {
        return NextResponse.json({ error: "Muvaffaqiyat tarixi topilmadi" }, { status: 404 })
      }

      return NextResponse.json({ story: storyBySlug })
    }

    return NextResponse.json({ story })
  } catch (error) {
    console.error("Get story error:", error)
    return NextResponse.json({ error: "Muvaffaqiyat tarixi ma'lumotlarini olishda xatolik yuz berdi" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser || (currentUser.role !== "ADMIN" && currentUser.role !== "ORGANIZER")) {
      return NextResponse.json({ error: "Ruxsat berilmagan" }, { status: 403 })
    }

    const storyId = params.id

    const existingStory = await prisma.story.findUnique({
      where: { id: storyId },
    })

    if (!existingStory) {
      return NextResponse.json({ error: "Muvaffaqiyat tarixi topilmadi" }, { status: 404 })
    }

    const body = await request.json()
    const { title, content, image, featured } = body

    if (!title || !content) {
      return NextResponse.json({ error: "Sarlavha, mazmun va muallif majburiy" }, { status: 400 })
    }

    let slug = existingStory.slug
    if (title !== existingStory.title) {
      slug = slugify(title)

      const slugExists = await prisma.story.findFirst({
        where: {
          slug,
          id: { not: storyId },
        },
      })

      if (slugExists) {
        return NextResponse.json({ error: "Bunday nomli muvaffaqiyat tarixi allaqachon mavjud" }, { status: 409 })
      }
    }

    const story = await prisma.story.update({
      where: { id: storyId },
      data: {
        title,
        slug,
        content,
        image,
        featured: featured !== undefined ? featured : existingStory.featured,
      },
    })

    return NextResponse.json({
      message: "Muvaffaqiyat tarixi ma'lumotlari muvaffaqiyatli yangilandi",
      story,
    })
  } catch (error) {
    console.error("Update story error:", error)
    return NextResponse.json(
      { error: "Muvaffaqiyat tarixi ma'lumotlarini yangilashda xatolik yuz berdi" },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Ruxsat berilmagan" }, { status: 403 })
    }

    const storyId = params.id

    await prisma.story.delete({
      where: { id: storyId },
    })

    return NextResponse.json({
      message: "Muvaffaqiyat tarixi muvaffaqiyatli o'chirildi",
    })
  } catch (error) {
    console.error("Delete story error:", error)
    return NextResponse.json({ error: "Muvaffaqiyat tarixini o'chirishda xatolik yuz berdi" }, { status: 500 })
  }
}
