import prisma from "@/lib/db"
import type { User } from "@prisma/client"
import bcrypt from "bcryptjs"
import { jwtVerify, SignJWT } from "jose"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret_key_change_in_production")

const TOKEN_EXPIRATION = "30d"

export interface JWTPayload {
  id: string
  email: string
  role: string
  iat: number
  exp: number
}

export async function createToken(user: User): Promise<string> {
  const token = await new SignJWT({
    id: user.id,
    email: user.email,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRATION)
    .sign(JWT_SECRET)

  return token
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as unknown as JWTPayload
  } catch (error) {
    return null
  }
}

export async function setTokenCookie(token: string, response?: NextResponse): Promise<void> {
  if (response) {
    response.cookies.set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "strict",
    })
  } else {
    ;(await cookies()).set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "strict",
    })
  }
}

export async function removeTokenCookie(response?: NextResponse): Promise<void> {
  if (response) {
    response.cookies.set({
      name: "auth_token",
      value: "",
      httpOnly: true,
      path: "/",
      maxAge: 0,
    })
  } else {
    ;(await cookies()).set({
      name: "auth_token",
      value: "",
      httpOnly: true,
      path: "/",
      maxAge: 0,
    })
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value

  if (!token) return null

  const payload = await verifyToken(token)
  if (!payload) return null

  const user = await prisma.user.findUnique({
    where: { id: payload.id },
  })

  return user
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function authMiddleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  const payload = await verifyToken(token)
  if (!payload) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export async function adminMiddleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  const payload = await verifyToken(token)
  if (!payload || payload.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}
