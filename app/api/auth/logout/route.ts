import { type NextRequest, NextResponse } from "next/server"
import { removeTokenCookie } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({ message: "Chiqish muvaffaqiyatli amalga oshirildi" }, { status: 200 })

    removeTokenCookie(response)

    return response
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Chiqishda xatolik yuz berdi" }, { status: 500 })
  }
}
