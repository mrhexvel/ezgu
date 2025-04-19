"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Filter, Plus, Trash, Edit, MoreHorizontal, Download } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  const users = [
    {
      id: "1",
      name: "Aziz Karimov",
      email: "aziz@example.com",
      role: "volunteer",
      avatar: "/placeholder.svg?height=40&width=40",
      location: "Toshkent",
      projects: 5,
      hours: 48,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
    },
    {
      id: "2",
      name: "Nilufar Rahimova",
      email: "nilufar@example.com",
      role: "organizer",
      avatar: "/placeholder.svg?height=40&width=40",
      location: "Samarqand",
      projects: 12,
      hours: 120,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60),
    },
    {
      id: "3",
      name: "Jahongir Toshmatov",
      email: "jahongir@example.com",
      role: "volunteer",
      avatar: "/placeholder.svg?height=40&width=40",
      location: "Buxoro",
      projects: 3,
      hours: 24,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
    },
    {
      id: "4",
      name: "Madina Aliyeva",
      email: "madina@example.com",
      role: "volunteer",
      avatar: "/placeholder.svg?height=40&width=40",
      location: "Toshkent",
      projects: 7,
      hours: 56,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45),
    },
    {
      id: "5",
      name: "Rustam Qodirov",
      email: "rustam@example.com",
      role: "admin",
      avatar: "/placeholder.svg?height=40&width=40",
      location: "Toshkent",
      projects: 0,
      hours: 0,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90),
    },
  ]

  const filteredUsers = users.filter(
    (user) =>
      (roleFilter === "all" || user.role === roleFilter) &&
      (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const toggleSelectUser = (userId: string) => {
    setSelectedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(filteredUsers.map((user) => user.id))
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-500">Admin</Badge>
      case "organizer":
        return (
          <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 hover:text-blue-500">Tashkilotchi</Badge>
        )
      case "volunteer":
        return (
          <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 hover:text-green-500">Volontyor</Badge>
        )
      default:
        return <Badge>Foydalanuvchi</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Foydalanuvchilar</h1>
          <p className="text-muted-foreground">Platformadagi barcha foydalanuvchilar</p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/admin/users/new">
              <Plus className="mr-2 h-4 w-4" />
              Yangi foydalanuvchi
            </Link>
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Foydalanuvchilarni qidirish..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Barcha rollar</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="organizer">Tashkilotchi</SelectItem>
              <SelectItem value="volunteer">Volontyor</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Foydalanuvchilar ro'yxati</CardTitle>
                <CardDescription>Jami {filteredUsers.length} foydalanuvchi</CardDescription>
              </div>
              {selectedUsers.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{selectedUsers.length} ta tanlangan</span>
                  <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                    <Trash className="mr-2 h-4 w-4" />
                    O'chirish
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                        onCheckedChange={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Foydalanuvchi</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Joylashuv</TableHead>
                    <TableHead>Loyihalar</TableHead>
                    <TableHead>Soatlar</TableHead>
                    <TableHead>Qo'shilgan sana</TableHead>
                    <TableHead className="w-[100px]">Amallar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedUsers.includes(user.id)}
                          onCheckedChange={() => toggleSelectUser(user.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{user.location}</TableCell>
                      <TableCell>{user.projects}</TableCell>
                      <TableCell>{user.hours}</TableCell>
                      <TableCell>{user.createdAt.toLocaleDateString()}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Amallar</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Tahrirlash
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash className="mr-2 h-4 w-4" />
                              O'chirish
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="p-4 sm:p-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>
                      1
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
