import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import { formatDistance } from "date-fns"
import { uz } from "date-fns/locale"

export function getInitials(name: string): string {
  const parts = name.split(" ")
  let initials = ""
  for (let i = 0; i < Math.min(2, parts.length); i++) {
    initials += parts[i].charAt(0).toUpperCase()
  }
  return initials
}

export function formatDistanceToNow(date: Date): string {
  return formatDistance(date, new Date(), {
    addSuffix: true,
    locale: uz,
  })
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("uz-UZ")
}

export function slugify(str: string): string {
  return String(str)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

export function arrayToJson(arr: any[]): string {
  return JSON.stringify(arr)
}

export function jsonToArray(jsonString: string): any[] {
  try {
    return JSON.parse(jsonString)
  } catch (error) {
    console.error("Error parsing JSON:", error)
    return []
  }
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidPassword(password: string): boolean {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
  return passwordRegex.test(password)
}

export function generateToken(length: number): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let token = ""
  for (let i = 0; i < length; i++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return token
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
