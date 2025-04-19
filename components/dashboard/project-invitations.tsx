"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";
import { Calendar, Clock, User } from "lucide-react";
import { useEffect, useState } from "react";

interface ProjectInvitation {
  id: string;
  status: string;
  message: string | null;
  createdAt: string;
  project: {
    id: string;
    title: string;
    slug: string;
    image: string | null;
    startDate: string;
    endDate: string | null;
    status: string;
    category: {
      name: string;
      color: string | null;
      icon: string | null;
    };
  };
  invitedBy: {
    id: string;
    name: string;
    avatar: string | null;
  };
}

export function ProjectInvitations() {
  const [invitations, setInvitations] = useState<ProjectInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/users/invitations");
      if (!response.ok) throw new Error("Taklifnomalarni yuklab bo'lmadi");

      const data = await response.json();
      setInvitations(data);
    } catch (error) {
      console.error("Error fetching invitations:", error);
      toast({
        title: "Xato",
        description: "Taklifnomalarni yuklab bo'lmadi",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id: string) => {
    try {
      setProcessingIds((prev) => new Set(prev).add(id));
      const response = await fetch(`/api/projects/invitations/${id}/accept`, {
        method: "POST",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Taklifni qabul qila olmadi");
      }

      toast({
        title: "Muvaffaqiyatli",
        description: "Siz loyihaga taklifni qabul qildingiz",
      });

      setInvitations((prev) => prev.filter((inv) => inv.id !== id));
    } catch (error) {
      console.error("Error accepting invitation:", error);
      toast({
        title: "Xato",
        description:
          error instanceof Error ? error.message : "Taklifni qabul qila olmadi",
        variant: "destructive",
      });
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleDecline = async (id: string) => {
    try {
      setProcessingIds((prev) => new Set(prev).add(id));
      const response = await fetch(`/api/projects/invitations/${id}/decline`, {
        method: "POST",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Taklifni rad eta olmadi");
      }

      toast({
        title: "Muvaffaqiyatli",
        description: "Siz loyihaga taklifni rad etdingiz",
      });

      setInvitations((prev) => prev.filter((inv) => inv.id !== id));
    } catch (error) {
      console.error("Error declining invitation:", error);
      toast({
        title: "Xato",
        description:
          error instanceof Error ? error.message : "Taklifni rad eta olmadi",
        variant: "destructive",
      });
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loyihalarga taklifnomalar</CardTitle>
          <CardDescription>Taklifnomalarni yuklab olish...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (invitations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loyihalarga taklifnomalar</CardTitle>
          <CardDescription>
            Sizda faol loyiha Taklifnomalari yo'q
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Loyihalarga taklifnomalar</h2>
      {invitations.map((invitation) => (
        <Card key={invitation.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{invitation.project.title}</CardTitle>
                <CardDescription className="flex items-center mt-1">
                  <User className="h-4 w-4 mr-1" />
                  {invitation.invitedBy.name}'dan taklifnoma
                </CardDescription>
              </div>
              <Badge
                style={{
                  backgroundColor:
                    invitation.project.category.color || undefined,
                }}
              >
                {invitation.project.category.name}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1" />
                <span>
                  {formatDate(new Date(invitation.project.startDate))}
                  {invitation.project.endDate &&
                    ` - ${formatDate(new Date(invitation.project.endDate))}`}
                </span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                <span>
                  Taklifnoma yuborildi{" "}
                  {formatDate(new Date(invitation.createdAt))}
                </span>
              </div>
              {invitation.message && (
                <div className="mt-2 p-3 bg-muted rounded-md">
                  <p className="text-sm">{invitation.message}</p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2 pt-2">
            <Button
              variant="outline"
              onClick={() => handleDecline(invitation.id)}
              disabled={processingIds.has(invitation.id)}
            >
              Rad etish
            </Button>
            <Button
              onClick={() => handleAccept(invitation.id)}
              disabled={processingIds.has(invitation.id)}
            >
              Qabul qilish
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
