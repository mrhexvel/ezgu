import type React from "react"
import type { Metadata } from "next"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"

export const metadata: Metadata = {
  title: "Admin Panel | Ezgu",
  description: "Ezgu volontyorlik platformasi admin paneli",
}

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-muted/30">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
