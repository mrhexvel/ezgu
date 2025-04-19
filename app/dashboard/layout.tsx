import type React from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1 flex flex-col md:flex-row">
        <DashboardSidebar />
        <main className="flex-1 p-4 md:p-6 lg:p-8 w-full">{children}</main>
      </div>
      <Footer />
    </div>
  )
}
