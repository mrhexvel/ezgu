import { type NextRequest, NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import { join } from "path"
import { getCurrentUser } from "@/lib/auth"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "Avtorizatsiyadan o'tilmagan" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "Fayl topilmadi" }, { status: 400 })
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Faqat rasmlar ruxsat etilgan" }, { status: 400 })
    }

    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: "Fayl hajmi maksimal ruxsat etilgan hajmdan oshib ketdi" }, { status: 400 })
    }

    const fileExtension = file.name.split(".").pop()
    const fileName = `${uuidv4()}.${fileExtension}`

    const publicDir = join(process.cwd(), "public")
    const uploadsDir = join(publicDir, "uploads")
    const filePath = join(uploadsDir, fileName)

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    await writeFile(filePath, buffer)

    const url = `/uploads/${fileName}`

    return NextResponse.json({ url }, { status: 200 })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Faylni yuklashda xatolik yuz berdi" }, { status: 500 })
  }
}
