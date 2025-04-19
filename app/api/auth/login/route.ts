import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { createToken, setTokenCookie, verifyPassword } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email va parol majburiy" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json({ error: "Noto'g'ri email yoki parol" }, { status: 401 })
    }

    const isPasswordValid = await verifyPassword(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Noto'g'ri email yoki parol" }, { status: 401 })
    }

    const token = await createToken(user)

    const response = NextResponse.json(
      {
        message: "Kirish muvaffaqiyatli amalga oshirildi",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          bio: user.bio,
          location: user.location,
          interests: user.interests,
          hours: user.hours,
          level: user.level,
        },
      },
      { status: 200 },
    )

    setTokenCookie(token, response)

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Kirishda xatolik yuz berdi" }, { status: 500 })
  }
}
