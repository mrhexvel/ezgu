"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Filter, Search, Loader2 } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ProjectCard } from "@/components/project-card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export default function ProjectsPage() {
  const { toast } = useToast()
  const [projects, setProjects] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const projectsPerPage = 9

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories")
        if (!response.ok) {
          throw new Error("Не удалось загрузить категории")
        }
        const data = await response.json()
        setCategories(data.categories)
      } catch (err) {
        console.error("Ошибка при загрузке категорий:", err)
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const url = new URL("/api/projects", window.location.origin)
        url.searchParams.append("page", currentPage.toString())
        url.searchParams.append("limit", projectsPerPage.toString())

        if (searchQuery) {
          url.searchParams.append("search", searchQuery)
        }

        if (categoryFilter !== "all") {
          url.searchParams.append("category", categoryFilter)
        }

        const response = await fetch(url.toString())

        if (!response.ok) {
          throw new Error("Не удалось загрузить проекты")
        }

        const data = await response.json()
        setProjects(data.projects)
        setTotalPages(data.pagination.totalPages)
      } catch (err) {
        console.error("Ошибка при загрузке проектов:", err)
        setError("Не удалось загрузить проекты")
        toast({
          title: "Xatolik",
          description: "Loyihalarni yuklashda xatolik yuz berdi",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [currentPage, searchQuery, categoryFilter, toast])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-primary/10 py-12">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">Volontyorlik loyihalari</h1>
              <p className="mt-4 text-lg text-muted-foreground">
                O'zingizga mos loyihani toping va jamiyatimizni yaxshilashga o'z hissangizni qo'shing
              </p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container px-4 md:px-6">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <form onSubmit={handleSearch} className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Loyihalarni qidirish..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
              <div className="flex gap-2">
                <Select
                  value={categoryFilter}
                  onValueChange={(value) => {
                    setCategoryFilter(value)
                    setCurrentPage(1)
                  }}
                >
                  <SelectTrigger className="w-[180px]">
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
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-destructive text-lg">{error}</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setCurrentPage(1)
                    setSearchQuery("")
                    setCategoryFilter("all")
                  }}
                >
                  Qayta urinish
                </Button>
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg">Loyihalar topilmadi</p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    id={project.id}
                    title={project.title}
                    description={project.description}
                    image={project.image || "/placeholder.svg?height=200&width=300"}
                    location={project.location}
                    date={formatProjectDate(project.startDate, project.endDate)}
                    volunteers={project._count?.participants || 0}
                    category={project.category?.id || "other"}
                  />
                ))}
              </motion.div>
            )}

            {totalPages > 1 && (
              <Pagination className="mt-10">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (currentPage > 1) setCurrentPage(currentPage - 1)
                      }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          setCurrentPage(page)
                        }}
                        isActive={currentPage === page}
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
                        if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                      }}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

function formatProjectDate(startDate: string, endDate?: string | null) {
  const start = new Date(startDate)
  const startDay = start.getDate()
  const startMonth = start.toLocaleString("uz-UZ", { month: "long" })
  const startYear = start.getFullYear()

  if (endDate) {
    const end = new Date(endDate)
    const endDay = end.getDate()
    const endMonth = end.toLocaleString("uz-UZ", { month: "long" })
    const endYear = end.getFullYear()

    if (startYear === endYear && startMonth === endMonth) {
      return `${startDay}-${endDay} ${startMonth}, ${startYear}`
    } else if (startYear === endYear) {
      return `${startDay} ${startMonth} - ${endDay} ${endMonth}, ${startYear}`
    } else {
      return `${startDay} ${startMonth}, ${startYear} - ${endDay} ${endMonth}, ${endYear}`
    }
  } else {
    return `${startDay} ${startMonth}, ${startYear}`
  }
}
