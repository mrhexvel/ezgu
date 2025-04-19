import { Analytics } from "@/components/analytics"
import { AuthProvider } from "@/components/auth-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import type React from "react"
import { Suspense } from "react"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Ezgu - O'zbekiston Volontyorlik Platformasi",
  description: "O'zbekistondagi eng yirik volontyorlik platformasi",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Suspense>{children}</Suspense>
            <Toaster />
            <Suspense>
              <Analytics />
            </Suspense>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
