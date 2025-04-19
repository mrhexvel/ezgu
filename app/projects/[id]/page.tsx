"use client";

import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  Edit2,
  Loader2,
  MapPin,
  Share2,
  Trash2,
  Users,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useAuth } from "@/components/auth-provider";
import { AwardHoursDialog } from "@/components/award-hours-dialog";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { HoursLogTable } from "@/components/hours-log-table";
import { InviteVolunteersDialog } from "@/components/invite-volunteers-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { getInitials } from "@/lib/utils";

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string | null;
  location: string;
  startDate: string;
  endDate: string | null;
  status: string;
  category: {
    id: string;
    name: string;
  };
  participants: {
    id: string;
    status: string;
    hours: number;
    user: {
      id: string;
      name: string;
      avatar: string | null;
    };
  }[];
  createdAt: string;
  updatedAt: string;
}

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const { user } = useAuth();
  const { toast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);
  const [activeTab, setActiveTab] = useState("about");

  const fetchProject = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/projects/${projectId}`);

      if (!response.ok) {
        throw new Error("Loyiha ma'lumotlarini olishda xatolik");
      }

      const data = await response.json();
      setProject(data.project);
    } catch (error) {
      console.error("Error fetching project:", error);
      toast({
        variant: "destructive",
        title: "Xatolik",
        description: "Loyiha ma'lumotlarini yuklashda xatolik yuz berdi",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, [projectId, toast]);

  const handleJoinProject = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Xatolik",
        description: "Loyihaga qo'shilish uchun tizimga kirishingiz kerak",
      });
      return;
    }

    try {
      setIsJoining(true);
      const response = await fetch(`/api/projects/${projectId}/join`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Loyihaga qo'shilishda xatolik");
      }

      const data = await response.json();
      toast({
        title: "Muvaffaqiyatli",
        description: data.message,
      });

      fetchProject();
    } catch (error) {
      console.error("Error joining project:", error);
      toast({
        variant: "destructive",
        title: "Xatolik",
        description: "Loyihaga qo'shilishda xatolik yuz berdi",
      });
    } finally {
      setIsJoining(false);
    }
  };

  const handleAcceptInvitation = async () => {
    if (!user) return;

    try {
      setIsAccepting(true);
      const response = await fetch(
        `/api/projects/${projectId}/accept-invitation`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Taklifni qabul qilishda xatolik");
      }

      const data = await response.json();
      toast({
        title: "Muvaffaqiyatli",
        description: data.message,
      });

      fetchProject();
    } catch (error) {
      console.error("Error accepting invitation:", error);
      toast({
        variant: "destructive",
        title: "Xatolik",
        description: "Taklifni qabul qilishda xatolik yuz berdi",
      });
    } finally {
      setIsAccepting(false);
    }
  };

  const handleDeclineInvitation = async () => {
    if (!user) return;

    try {
      setIsDeclining(true);
      const response = await fetch(
        `/api/projects/${projectId}/decline-invitation`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Taklifni rad etishda xatolik");
      }

      const data = await response.json();
      toast({
        title: "Muvaffaqiyatli",
        description: data.message,
      });

      fetchProject();
    } catch (error) {
      console.error("Error declining invitation:", error);
      toast({
        variant: "destructive",
        title: "Xatolik",
        description: "Taklifni rad etishda xatolik yuz berdi",
      });
    } finally {
      setIsDeclining(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!confirm("Haqiqatan ham bu loyihani o'chirmoqchimisiz?")) return;

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Loyihani o'chirishda xatolik");
      }

      toast({
        title: "Muvaffaqiyatli",
        description: "Loyiha o'chirildi",
      });

      router.push("/projects");
    } catch (error) {
      console.error("Error deleting project:", error);
      toast({
        variant: "destructive",
        title: "Xatolik",
        description: "Loyihani o'chirishda xatolik yuz berdi",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-4">
          <h1 className="text-2xl font-bold mb-2">Loyiha topilmadi</h1>
          <p className="text-muted-foreground mb-6">
            So'ralgan loyiha mavjud emas yoki o'chirilgan
          </p>
          <Button asChild>
            <Link href="/projects">Barcha loyihalarga qaytish</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "UPCOMING":
        return (
          <Badge className="bg-blue-500/10 text-blue-500">Kelayotgan</Badge>
        );
      case "ACTIVE":
        return <Badge className="bg-green-500/10 text-green-500">Faol</Badge>;
      case "COMPLETED":
        return (
          <Badge className="bg-purple-500/10 text-purple-500">Tugatilgan</Badge>
        );
      case "CANCELLED":
        return (
          <Badge className="bg-red-500/10 text-red-500">Bekor qilingan</Badge>
        );
      default:
        return <Badge>Noma'lum</Badge>;
    }
  };

  const getParticipantStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return (
          <Badge className="bg-green-500/10 text-green-500">Tasdiqlangan</Badge>
        );
      case "PENDING":
        return (
          <Badge className="bg-yellow-500/10 text-yellow-500">Kutilmoqda</Badge>
        );
      case "INVITED":
        return (
          <Badge className="bg-blue-500/10 text-blue-500">
            Taklif qilingan
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge className="bg-red-500/10 text-red-500">Rad etilgan</Badge>
        );
      case "COMPLETED":
        return (
          <Badge className="bg-purple-500/10 text-purple-500">Tugatilgan</Badge>
        );
      default:
        return <Badge>Noma'lum</Badge>;
    }
  };

  const isAdmin = user?.role === "ADMIN" || user?.role === "ORGANIZER";
  const isParticipant = project.participants.some(
    (p) => p.user.id === user?.id
  );
  const isInvited =
    user &&
    project.participants.some(
      (p) => p.user.id === user.id && p.status === "INVITED"
    );
  const canJoin =
    !isParticipant &&
    (project.status === "UPCOMING" || project.status === "ACTIVE");
  const canAwardHours = isAdmin;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("uz-UZ", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6 max-w-6xl">
          <div className="mb-6 flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-semibold">Loyiha tafsilotlari</h1>
            {isAdmin && (
              <div className="ml-auto flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/projects/${projectId}/edit`}>
                    <Edit2 className="h-4 w-4 mr-2" />
                    Tahrirlash
                  </Link>
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteProject}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  O'chirish
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="overflow-hidden">
                <div className="relative h-64 w-full">
                  <Image
                    src={
                      project.image || "/placeholder.svg?height=400&width=800"
                    }
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <Badge variant="outline">{project.category.name}</Badge>
                    {getStatusBadge(project.status)}
                  </div>

                  <h2 className="text-2xl font-bold mb-2">{project.title}</h2>

                  <div className="flex flex-wrap gap-4 mb-6 text-muted-foreground">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{project.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>
                        {formatDate(project.startDate)}
                        {project.endDate && ` - ${formatDate(project.endDate)}`}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{project.participants.length} ishtirokchi</span>
                    </div>
                  </div>

                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-6">
                      <TabsTrigger value="about">Loyiha haqida</TabsTrigger>
                      <TabsTrigger value="participants">
                        Ishtirokchilar
                      </TabsTrigger>
                      {canAwardHours && (
                        <TabsTrigger value="hours">Soatlar jurnali</TabsTrigger>
                      )}
                    </TabsList>

                    <TabsContent value="about">
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <p className="whitespace-pre-line">
                          {project.description}
                        </p>
                      </div>

                      <div className="mt-8 flex flex-wrap gap-4">
                        {isInvited ? (
                          <div className="flex gap-2">
                            <Button
                              onClick={handleAcceptInvitation}
                              disabled={isAccepting}
                            >
                              {isAccepting
                                ? "Jarayonda..."
                                : "Taklifni qabul qilish"}
                            </Button>
                            <Button
                              variant="outline"
                              onClick={handleDeclineInvitation}
                              disabled={isDeclining}
                            >
                              {isDeclining ? "Jarayonda..." : "Rad etish"}
                            </Button>
                          </div>
                        ) : canJoin && !isParticipant ? (
                          <Button
                            onClick={handleJoinProject}
                            disabled={isJoining}
                          >
                            {isJoining ? "Jarayonda..." : "Loyihaga qo'shilish"}
                          </Button>
                        ) : null}

                        {isAdmin && (
                          <InviteVolunteersDialog
                            projectId={project.id}
                            onInviteSuccess={fetchProject}
                          />
                        )}

                        <Button variant="outline">
                          <Share2 className="h-4 w-4 mr-2" />
                          Ulashish
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="participants">
                      <div className="space-y-4">
                        {project.participants.length === 0 ? (
                          <div className="text-center py-8 bg-muted/20 rounded-lg">
                            <p className="text-muted-foreground">
                              Hozircha ishtirokchilar yo'q
                            </p>
                          </div>
                        ) : (
                          <div className="divide-y">
                            {project.participants.map((participant) => (
                              <div
                                key={participant.id}
                                className="py-3 flex items-center justify-between"
                              >
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-10 w-10">
                                    <AvatarImage
                                      src={participant.user.avatar || undefined}
                                      alt={participant.user.name}
                                    />
                                    <AvatarFallback>
                                      {getInitials(participant.user.name)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <Link
                                      href={`/users/${participant.user.id}`}
                                      className="font-medium hover:underline"
                                    >
                                      {participant.user.name}
                                    </Link>
                                    <div className="text-xs text-muted-foreground">
                                      {participant.hours > 0
                                        ? `${participant.hours} soat`
                                        : "Soatlar yo'q"}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {getParticipantStatusBadge(
                                    participant.status
                                  )}
                                  {canAwardHours && (
                                    <AwardHoursDialog
                                      projectId={project.id}
                                      participant={participant}
                                      onSuccess={fetchProject}
                                    />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    {canAwardHours && (
                      <TabsContent value="hours">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium">
                              Soatlar jurnali
                            </h3>
                            <div className="flex items-center">
                              <Clock className="h-5 w-5 text-primary mr-1" />
                              <span className="font-medium">
                                Jami:{" "}
                                {project.participants.reduce(
                                  (sum, p) => sum + p.hours,
                                  0
                                )}{" "}
                                soat
                              </span>
                            </div>
                          </div>
                          <HoursLogTable projectId={project.id} />
                        </div>
                      </TabsContent>
                    )}
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Loyiha ma'lumotlari</CardTitle>
                  <CardDescription>
                    Loyiha haqida qo'shimcha ma'lumotlar
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Holati</h3>
                    <div className="flex items-center gap-2">
                      {project.status === "ACTIVE" ||
                      project.status === "UPCOMING" ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <span>
                        {project.status === "ACTIVE"
                          ? "Faol"
                          : project.status === "UPCOMING"
                          ? "Kelayotgan"
                          : project.status === "COMPLETED"
                          ? "Tugatilgan"
                          : "Bekor qilingan"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Sana</h3>
                    <div className="text-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Boshlanish: {formatDate(project.startDate)}</span>
                      </div>
                      {project.endDate && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Tugash: {formatDate(project.endDate)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Joylashuv</h3>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{project.location}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Ishtirokchilar</h3>
                    <div className="flex -space-x-2 overflow-hidden">
                      {project.participants.slice(0, 5).map((participant) => (
                        <Avatar
                          key={participant.id}
                          className="h-8 w-8 border-2 border-background"
                        >
                          <AvatarImage
                            src={participant.user.avatar || undefined}
                            alt={participant.user.name}
                          />
                          <AvatarFallback className="text-xs">
                            {getInitials(participant.user.name)}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {project.participants.length > 5 && (
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-xs font-medium">
                          +{project.participants.length - 5}
                        </div>
                      )}
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      Jami: {project.participants.length} ishtirokchi
                    </div>
                  </div>

                  {isParticipant && (
                    <div>
                      <h3 className="text-sm font-medium mb-2">
                        Sizning ishtirokingiz
                      </h3>
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span>Holat:</span>
                          {getParticipantStatusBadge(
                            project.participants.find(
                              (p) => p.user.id === user?.id
                            )?.status || ""
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Soatlar:</span>
                          <span className="font-medium">
                            {project.participants.find(
                              (p) => p.user.id === user?.id
                            )?.hours || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
