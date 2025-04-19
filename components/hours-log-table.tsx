"use client";

import { format } from "date-fns";
import { Clock, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { getInitials } from "@/lib/utils";

interface HoursLogTableProps {
  projectId: string;
  userId?: string;
}

interface HoursLog {
  id: string;
  hours: number;
  note: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatar: string | null;
  };
  awardedBy: {
    id: string;
    name: string;
  };
}

export function HoursLogTable({ projectId, userId }: HoursLogTableProps) {
  const { toast } = useToast();
  const [hoursLogs, setHoursLogs] = useState<HoursLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHoursLogs = async () => {
      try {
        setIsLoading(true);
        const url = `/api/projects/${projectId}/hours${
          userId ? `?userId=${userId}` : ""
        }`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Soatlar jurnalini olishda xatolik");
        }

        const data = await response.json();
        setHoursLogs(data.hoursLogs);
      } catch (error) {
        console.error("Error fetching hours logs:", error);
        toast({
          variant: "destructive",
          title: "Xatolik",
          description: "Soatlar jurnalini yuklashda xatolik yuz berdi",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchHoursLogs();
  }, [projectId, userId, toast]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (hoursLogs.length === 0) {
    return (
      <div className="text-center py-8 bg-muted/20 rounded-lg">
        <p className="text-muted-foreground">Soatlar jurnali bo'sh</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Volontyor</TableHead>
            <TableHead>Soatlar</TableHead>
            <TableHead>Izoh</TableHead>
            <TableHead>Qo'shilgan sana</TableHead>
            <TableHead>Tomonidan qo'shilgan</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {hoursLogs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={log.user.avatar || undefined}
                      alt={log.user.name}
                    />
                    <AvatarFallback>
                      {getInitials(log.user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span>{log.user.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-primary" />
                  <span className="font-medium">{log.hours}</span>
                </div>
              </TableCell>
              <TableCell>{log.note || "-"}</TableCell>
              <TableCell>
                {format(new Date(log.createdAt), "dd.MM.yyyy HH:mm")}
              </TableCell>
              <TableCell>{log.awardedBy.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
