import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { generateToken } from "@/lib/utils"
import { isValidEmail } from "@/lib/utils"

async function sendPasswordResetEmail(email: string, token: string) {
  console.log(`Parolni tiklash uchun email yuborilmoqda ${email} ga token ${token} bilan`)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({ error: "Email majburiy" }, { status: 400 })
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Noto'g'ri email" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json(
        {
          message:
            "Agar ko'rsatilgan email ro'yxatdan o'tgan bo'lsa, unga parolni tiklash bo'yicha ko'rsatma yuboriladi",
        },
        { status: 200 },
      )
    }

    const resetToken = generateToken(32)
    const resetTokenExpiry = new Date(Date.now() + 3600000)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    })

    await sendPasswordResetEmail(email, resetToken)

    return NextResponse.json(
      {
        message: "Agar ko'rsatilgan email ro'yxatdan o'tgan bo'lsa, unga parolni tiklash bo'yicha ko'rsatma yuboriladi",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Password reset request error:", error)
    return NextResponse.json({ error: "Parolni tiklash so'rovida xatolik yuz berdi" }, { status: 500 })
  }
}
