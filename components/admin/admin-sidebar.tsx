"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Award,
  FileText,
  Newspaper,
  Settings,
  LogOut,
  ChevronRight,
  ChevronLeft,
  Menu,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const { logout } = useAuth()

  const navItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "Foydalanuvchilar",
      href: "/admin/users",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Loyihalar",
      href: "/admin/projects",
      icon: <CalendarDays className="h-5 w-5" />,
    },
    {
      title: "Yutuqlar",
      href: "/admin/achievements",
      icon: <Award className="h-5 w-5" />,
    },
    {
      title: "Muvaffaqiyat tarixi",
      href: "/admin/stories",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: "Yangiliklar",
      href: "/admin/news",
      icon: <Newspaper className="h-5 w-5" />,
    },
    {
      title: "Sozlamalar",
      href: "/admin/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ]

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              <div className="relative h-8 w-8 overflow-hidden rounded-full bg-primary">
                <div className="flex h-full w-full items-center justify-center text-lg font-bold text-white">E</div>
              </div>
              <span className="font-bold text-lg">Ezgu Admin</span>
            </motion.div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex ml-auto"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <nav className="space-y-1 p-2 flex-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
              pathname === item.href
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-primary/10 hover:text-foreground",
            )}
          >
            <div className="flex items-center justify-center w-5 h-5">{item.icon}</div>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="truncate"
              >
                {item.title}
              </motion.span>
            )}
          </Link>
        ))}
      </nav>

      <div className="p-2 mt-auto border-t">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
            collapsed ? "px-3" : "",
          )}
          onClick={logout}
        >
          <LogOut className="h-5 w-5 mr-2" />
          {!collapsed && <span>Chiqish</span>}
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden absolute top-4 left-4 z-50">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-[280px]">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <motion.div
        initial={{ width: collapsed ? 80 : 280 }}
        animate={{ width: collapsed ? 80 : 280 }}
        transition={{ duration: 0.3 }}
        className={cn("h-screen border-r border-border bg-card hidden md:block", collapsed ? "w-20" : "w-[280px]")}
      >
        <SidebarContent />
      </motion.div>
    </>
  )
}
