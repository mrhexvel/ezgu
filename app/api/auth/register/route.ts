import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { createToken, hashPassword, setTokenCookie } from "@/lib/auth"
import { isValidEmail, isValidPassword } from "@/lib/utils"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Barcha maydonlar majburiy" }, { status: 400 })
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Noto'g'ri email" }, { status: 400 })
    }

    if (!isValidPassword(password)) {
      return NextResponse.json(
        { error: "Parol kamida 8 ta belgidan iborat bo'lishi va harflar hamda raqamlarni o'z ichiga olishi kerak" },
        { status: 400 },
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "Bunday email bilan foydalanuvchi allaqachon mavjud" }, { status: 409 })
    }

    const hashedPassword = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "VOLUNTEER",
        interests: "[]",
      },
    })

    const token = await createToken(user)

    const response = NextResponse.json(
      {
        message: "Ro'yxatdan o'tish muvaffaqiyatli amalga oshirildi",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 },
    )

    setTokenCookie(token, response)

    return response
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Ro'yxatdan o'tishda xatolik yuz berdi" }, { status: 500 })
  }
}
