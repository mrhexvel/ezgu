"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Filter, Plus, Trash, Edit, MoreHorizontal, Download, Calendar, MapPin, Users, Eye } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

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
import { Checkbox } from "@/components/ui/checkbox"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useToast } from "@/components/ui/use-toast"
import { CreateProjectDialog } from "@/components/admin/create-project-dialog"

interface Project {
  id: string
  title: string
  slug: string
  description: string
  image?: string
  location: string
  status: string
  startDate: string
  endDate?: string
  createdAt: string
  category: {
    id: string
    name: string
    color: string
  }
  volunteers: number
}

interface PaginationInfo {
  total: number
  page: number
  limit: number
  totalPages: number
}

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const { toast } = useToast()

  const fetchProjects = async (page = 1) => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      })

      if (searchQuery) {
        params.append("search", searchQuery)
      }

      if (statusFilter !== "all") {
        params.append("status", statusFilter)
      }

      if (categoryFilter !== "all") {
        params.append("category", categoryFilter)
      }

      const response = await fetch(`/api/projects?${params.toString()}`)
      if (!response.ok) {
        throw new Error("Xatolik yuz berdi")
      }

      const data = await response.json()
      setProjects(data.projects)
      setPagination(data.pagination)
    } catch (error) {
      console.error("Error fetching projects:", error)
      toast({
        title: "Xatolik",
        description: "Loyihalarni yuklashda xatolik yuz berdi",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      if (!response.ok) {
        throw new Error("Xatolik yuz berdi")
      }

      const data = await response.json()
      setCategories(data.categories)
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  useEffect(() => {
    fetchCategories()
    fetchProjects()
  }, [])

  useEffect(() => {
    fetchProjects(1)
  }, [searchQuery, statusFilter, categoryFilter])

  const handlePageChange = (page: number) => {
    fetchProjects(page)
  }

  const toggleSelectProject = (projectId: string) => {
    setSelectedProjects((prev) =>
      prev.includes(projectId) ? prev.filter((id) => id !== projectId) : [...prev, projectId],
    )
  }

  const toggleSelectAll = () => {
    if (selectedProjects.length === projects.length) {
      setSelectedProjects([])
    } else {
      setSelectedProjects(projects.map((project) => project.id))
    }
  }

  const handleProjectCreated = () => {
    fetchProjects()
    setIsCreateDialogOpen(false)
    toast({
      title: "Muvaffaqiyatli",
      description: "Loyiha muvaffaqiyatli yaratildi",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 hover:text-green-500">Faol</Badge>
      case "UPCOMING":
        return (
          <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 hover:text-blue-500">Kelayotgan</Badge>
        )
      case "COMPLETED":
        return (
          <Badge className="bg-gray-500/10 text-gray-500 hover:bg-gray-500/20 hover:text-gray-500">Tugallangan</Badge>
        )
      case "CANCELLED":
        return (
          <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-500">Bekor qilingan</Badge>
        )
      default:
        return <Badge>Noma'lum</Badge>
    }
  }

  const getCategoryBadge = (category: { name: string; color: string }) => {
    const style = {
      borderColor: `${category.color}50`,
      color: category.color,
    }

    return (
      <Badge variant="outline" style={style}>
        {category.name}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("uz-UZ", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Loyihalar</h1>
          <p className="text-muted-foreground">Platformadagi barcha loyihalar</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Yangi loyiha
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
            placeholder="Loyihalarni qidirish..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Barcha statuslar</SelectItem>
              <SelectItem value="ACTIVE">Faol</SelectItem>
              <SelectItem value="UPCOMING">Kelayotgan</SelectItem>
              <SelectItem value="COMPLETED">Tugallangan</SelectItem>
              <SelectItem value="CANCELLED">Bekor qilingan</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Kategoriya" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Barcha kategoriyalar</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
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
                <CardTitle>Loyihalar ro'yxati</CardTitle>
                <CardDescription>Jami {pagination.total} loyiha</CardDescription>
              </div>
              {selectedProjects.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{selectedProjects.length} ta tanlangan</span>
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
                        checked={selectedProjects.length === projects.length && projects.length > 0}
                        onCheckedChange={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Loyiha</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Kategoriya</TableHead>
                    <TableHead>Joylashuv</TableHead>
                    <TableHead>Sana</TableHead>
                    <TableHead>Volontyorlar</TableHead>
                    <TableHead className="w-[100px]">Amallar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-10">
                        Ma'lumotlar yuklanmoqda...
                      </TableCell>
                    </TableRow>
                  ) : projects.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-10">
                        Loyihalar topilmadi
                      </TableCell>
                    </TableRow>
                  ) : (
                    projects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedProjects.includes(project.id)}
                            onCheckedChange={() => toggleSelectProject(project.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md">
                              <Image
                                src={project.image || "/placeholder.svg?height=40&width=40"}
                                alt={project.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium">{project.title}</p>
                              <p className="text-xs text-muted-foreground line-clamp-1">{project.description}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(project.status)}</TableCell>
                        <TableCell>{getCategoryBadge(project.category)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span>{project.location}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span>{formatDate(project.startDate)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3 text-muted-foreground" />
                            <span>{project.volunteers}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Amallar</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/projects/${project.slug}`}>
                                  <span className="flex items-center">
                                    <Eye className="mr-2 h-4 w-4" />
                                    Ko'rish
                                  </span>
                                </Link>
                              </DropdownMenuItem>
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
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {pagination.totalPages > 1 && (
              <div className="p-4 sm:p-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          if (pagination.page > 1) {
                            handlePageChange(pagination.page - 1)
                          }
                        }}
                        className={pagination.page <= 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            handlePageChange(page)
                          }}
                          isActive={page === pagination.page}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          if (pagination.page < pagination.totalPages) {
                            handlePageChange(pagination.page + 1)
                          }
                        }}
                        className={pagination.page >= pagination.totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <CreateProjectDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onProjectCreated={handleProjectCreated}
        categories={categories}
      />
    </div>
  )
}
