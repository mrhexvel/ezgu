"use client";

import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Award,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Heart,
  LayoutDashboard,
  Mail,
  Menu,
  Settings,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function DashboardSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "Mening loyihalarim",
      href: "/dashboard/projects",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      title: "Jamoam",
      href: "/dashboard/team",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Yutuqlarim",
      href: "/dashboard/achievements",
      icon: <Award className="h-5 w-5" />,
    },
    {
      title: "Volontyorlik soatlari",
      href: "/dashboard/hours",
      icon: <Heart className="h-5 w-5" />,
    },
    {
      title: "Sozlamalar",
      href: "/dashboard/settings",
      icon: <Settings className="h-5 w-5" />,
    },
    {
      title: "taklifnomalar",
      href: "/dashboard/invitations",
      icon: <Mail className="h-5 w-5" />,
    },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="mb-8 flex items-center justify-between p-4">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2"
          >
            <div className="relative h-10 w-10 overflow-hidden rounded-full bg-primary">
              <div className="flex h-full w-full items-center justify-center text-lg font-bold text-white">
                {user?.name.charAt(0)}
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-medium">{user?.name}</span>
              <span className="text-xs text-muted-foreground">Volontyor</span>
            </div>
          </motion.div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex ml-auto"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <nav className="space-y-2 flex-1 px-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
              pathname === item.href
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
            )}
          >
            <div className="flex items-center justify-center w-5 h-5">
              {item.icon}
            </div>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {item.title}
              </motion.span>
            )}
          </Link>
        ))}
      </nav>

      {!collapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="mt-auto pt-4 border-t border-border p-4"
        >
          <div className="rounded-lg bg-primary/5 p-4">
            <h4 className="font-medium mb-1">Volontyorlik darajasi</h4>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-muted-foreground">
                Daraja {user?.level}
              </span>
              <div className="flex-1 h-2 bg-primary/10 rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: "60%" }} />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Keyingi darajaga chiqish uchun yana 10 soat volontyorlik qiling
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden fixed top-4 left-4 z-50"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menyuni ochish</span>
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
        className={cn(
          "h-[calc(100vh-4rem)] border-r border-border relative hidden md:block",
          collapsed ? "w-20" : "w-[280px]"
        )}
      >
        <div className="p-0 h-full overflow-y-auto backdrop-blur-sm bg-background/50">
          <SidebarContent />
        </div>
      </motion.div>
    </>
  );
}
