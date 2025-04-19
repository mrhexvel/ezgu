"use client"

import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { Clock, ArrowRight } from "lucide-react"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface HoursTableProps {
  hours: {
    id: string
    projectId: string
    projectTitle: string
    projectImage: string
    hours: number
    date: string
    status: string
  }[]
}

export function HoursTable({ hours }: HoursTableProps) {
  if (hours.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">У вас пока нет записей о волонтерских часах</p>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">Завершено</Badge>
      case "pending":
        return <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">На проверке</Badge>
      case "rejected":
        return <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20">Отклонено</Badge>
      default:
        return <Badge variant="outline">Неизвестно</Badge>
    }
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Проект</TableHead>
            <TableHead>Дата</TableHead>
            <TableHead>Часы</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead className="text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {hours.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-md">
                    <Image
                      src={entry.projectImage || "/placeholder.svg"}
                      alt={entry.projectTitle}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="font-medium">{entry.projectTitle}</div>
                </div>
              </TableCell>
              <TableCell>{format(new Date(entry.date), "dd MMMM yyyy", { locale: ru })}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                  {entry.hours}
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(entry.status)}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/projects/${entry.projectId}`}>
                    Подробнее
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
