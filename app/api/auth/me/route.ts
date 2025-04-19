import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Avtorizatsiyadan o'tilmagan" }, { status: 401 })
    }

    return NextResponse.json({
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
    })
  } catch (error) {
    console.error("Get current user error:", error)
    return NextResponse.json({ error: "Foydalanuvchi ma'lumotlarini olishda xatolik yuz berdi" }, { status: 500 })
  }
}
