"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  Award,
  Calendar,
  Clock,
  Edit2,
  ExternalLink,
  Loader2,
  Mail,
  MapPin,
  Trash2,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useAuth } from "@/components/auth-provider";
import { AchievementCard } from "@/components/dashboard/achievement-card";
import { HoursChart } from "@/components/dashboard/hours-chart";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ProjectCard } from "@/components/project-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { getInitials } from "@/lib/utils";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
  bio: string | null;
  location: string | null;
  interests: string[];
  hours: number;
  level: number;
  projects: any[];
  achievements: any[];
  createdAt: string;
}

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("projects");
  const [hoursData, setHoursData] = useState<any[]>([]);
  const [isLoadingHours, setIsLoadingHours] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/users/${userId}`);

        if (!response.ok) {
          throw new Error("Foydalanuvchi ma'lumotlarini olishda xatolik");
        }

        const data = await response.json();
        setProfile(data.user);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast({
          variant: "destructive",
          title: "Xatolik",
          description: "Foydalanuvchi profilini yuklashda xatolik yuz berdi",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchUserProfile();
    }
  }, [userId, toast]);

  useEffect(() => {
    const fetchHoursData = async () => {
      if (!profile) return;

      try {
        setIsLoadingHours(true);
        const response = await fetch(`/api/users/${userId}/hours`);

        if (!response.ok) {
          throw new Error("Soatlar ma'lumotlarini olishda xatolik");
        }

        const data = await response.json();
        setHoursData(data.hours);
      } catch (error) {
        console.error("Error fetching hours data:", error);
      } finally {
        setIsLoadingHours(false);
      }
    };

    if (profile) {
      fetchHoursData();
    }
  }, [profile, userId]);

  const handleDelete = async () => {
    if (!confirm("Haqiqatan ham bu foydalanuvchini o'chirmoqchimisiz?")) return;

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Foydalanuvchini o'chirishda xatolik");
      }

      toast({
        title: "Muvaffaqiyatli",
        description: "Foydalanuvchi o'chirildi",
      });

      router.push("/admin/users");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        variant: "destructive",
        title: "Xatolik",
        description: "Foydalanuvchini o'chirishda xatolik yuz berdi",
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

  if (!profile) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-4">
          <h1 className="text-2xl font-bold mb-2">Foydalanuvchi topilmadi</h1>
          <p className="text-muted-foreground mb-6">
            So'ralgan foydalanuvchi mavjud emas yoki o'chirilgan
          </p>
          <Button asChild>
            <Link href="/">Bosh sahifaga qaytish</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <Badge className="bg-red-500/10 text-red-500">Admin</Badge>;
      case "ORGANIZER":
        return (
          <Badge className="bg-blue-500/10 text-blue-500">Tashkilotchi</Badge>
        );
      case "VOLUNTEER":
        return (
          <Badge className="bg-green-500/10 text-green-500">Volontyor</Badge>
        );
      default:
        return <Badge>Foydalanuvchi</Badge>;
    }
  };

  const activeProjects = profile.projects
    .filter(
      (p) => p.project.status === "ACTIVE" || p.project.status === "UPCOMING"
    )
    .map((p) => ({
      id: p.project.id,
      title: p.project.title,
      description: p.project.description || "",
      image: p.project.image || "/placeholder.svg",
      location: p.project.location,
      date: p.project.startDate
        ? new Date(p.project.startDate).toLocaleDateString()
        : "",
      volunteers: p.project.participants.length,
      category: p.project.category?.id || "other",
    }));

  const completedProjects = profile.projects
    .filter((p) => p.project.status === "COMPLETED")
    .map((p) => ({
      id: p.project.id,
      title: p.project.title,
      description: p.project.description || "",
      image: p.project.image || "/placeholder.svg",
      location: p.project.location,
      date: p.project.startDate
        ? new Date(p.project.startDate).toLocaleDateString()
        : "",
      volunteers: 0,
      category: p.project.category?.id || "other",
    }));

  const achievements = profile.achievements.map((a) => ({
    id: a.achievement.id,
    title: a.achievement.title,
    description: a.achievement.description,
    icon: a.achievement.icon,
    color: a.achievement.color,
    awardedAt: a.awardedAt,
  }));

  const isAdmin = user?.role === "ADMIN";
  const isCurrentUser = user?.id === profile.id;

  const calculateLevelProgress = (level: number, hours: number) => {
    const hoursPerLevel = 20;
    const currentLevelHours = level * hoursPerLevel;
    const nextLevelHours = (level + 1) * hoursPerLevel;
    const progress =
      ((hours - currentLevelHours) / (nextLevelHours - currentLevelHours)) *
      100;
    return Math.min(Math.max(progress, 0), 100);
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
            <h1 className="text-2xl font-semibold">Foydalanuvchi profili</h1>
            {isAdmin && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                className="ml-auto"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                O'chirish
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="bg-gradient-to-r from-primary/20 to-secondary/20 h-32"></div>
                    <div className="px-6 pb-6 pt-0 -mt-16">
                      <div className="flex flex-col items-center">
                        <Avatar className="h-32 w-32 border-4 border-background">
                          <AvatarImage
                            src={profile.avatar || undefined}
                            alt={profile.name}
                          />
                          <AvatarFallback className="text-3xl">
                            {getInitials(profile.name)}
                          </AvatarFallback>
                        </Avatar>
                        <h2 className="text-2xl font-semibold mt-4">
                          {profile.name}
                        </h2>
                        <div className="mt-1">{getRoleBadge(profile.role)}</div>
                        <div className="flex items-center text-muted-foreground mt-2">
                          <Mail className="h-4 w-4 mr-1" />
                          <span className="text-sm">{profile.email}</span>
                        </div>
                        {profile.location && (
                          <div className="flex items-center text-muted-foreground mt-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span className="text-sm">{profile.location}</span>
                          </div>
                        )}
                        <div className="flex items-center text-muted-foreground mt-1">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span className="text-sm">
                            A'zo bo'lgan:{" "}
                            {new Date(profile.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="mt-6 space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">
                              Volontyorlik darajasi
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {profile.level}
                            </span>
                          </div>
                          <Progress
                            value={calculateLevelProgress(
                              profile.level,
                              profile.hours
                            )}
                            className="h-2"
                          />
                          <p className="text-xs text-muted-foreground mt-1 text-right">
                            Keyingi daraja: {profile.level + 1}
                          </p>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-3">
                            <div className="font-semibold">{profile.hours}</div>
                            <div className="text-xs text-muted-foreground">
                              Soatlar
                            </div>
                          </div>
                          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-3">
                            <div className="font-semibold">
                              {profile.projects.length}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Loyihalar
                            </div>
                          </div>
                          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-3">
                            <div className="font-semibold">
                              {profile.achievements.length}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Yutuqlar
                            </div>
                          </div>
                        </div>

                        {profile.bio && (
                          <div className="bg-muted/30 p-4 rounded-lg">
                            <h3 className="text-sm font-medium mb-2">
                              O'zi haqida
                            </h3>
                            <p className="text-sm text-muted-foreground italic">
                              {profile.bio}
                            </p>
                          </div>
                        )}

                        {profile.interests && profile.interests.length > 0 && (
                          <div>
                            <h3 className="text-sm font-medium mb-2">
                              Qiziqishlar
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {profile.interests.map((interest) => (
                                <Badge key={interest} variant="secondary">
                                  {interest}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {(isCurrentUser || isAdmin) && (
                          <Button className="w-full" variant="outline">
                            <Edit2 className="h-4 w-4 mr-2" />
                            Profilni tahrirlash
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="mb-6 grid grid-cols-3">
                        <TabsTrigger value="projects">Loyihalar</TabsTrigger>
                        <TabsTrigger value="achievements">Yutuqlar</TabsTrigger>
                        <TabsTrigger value="stats">Statistika</TabsTrigger>
                      </TabsList>

                      <TabsContent value="projects" className="space-y-6">
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium">
                              Faol loyihalar
                            </h3>
                            {activeProjects.length > 0 && (
                              <Button variant="ghost" size="sm" asChild>
                                <Link href="/projects">
                                  <span>Barcha loyihalar</span>
                                  <ExternalLink className="ml-1 h-3 w-3" />
                                </Link>
                              </Button>
                            )}
                          </div>
                          {activeProjects.length === 0 ? (
                            <div className="text-center py-8 bg-muted/20 rounded-lg">
                              <p className="text-muted-foreground">
                                Faol loyihalar yo'q
                              </p>
                            </div>
                          ) : (
                            <div className="grid gap-4 sm:grid-cols-2">
                              {activeProjects.map((project) => (
                                <ProjectCard key={project.id} {...project} />
                              ))}
                            </div>
                          )}
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium">
                              Tugatilgan loyihalar
                            </h3>
                            {completedProjects.length > 0 && (
                              <Badge variant="outline" className="ml-2">
                                {completedProjects.length}
                              </Badge>
                            )}
                          </div>
                          {completedProjects.length === 0 ? (
                            <div className="text-center py-8 bg-muted/20 rounded-lg">
                              <p className="text-muted-foreground">
                                Tugatilgan loyihalar yo'q
                              </p>
                            </div>
                          ) : (
                            <div className="grid gap-4 sm:grid-cols-2">
                              {completedProjects.map((project) => (
                                <ProjectCard key={project.id} {...project} />
                              ))}
                            </div>
                          )}
                        </div>
                      </TabsContent>

                      <TabsContent value="achievements">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-medium">Yutuqlar</h3>
                          <div className="flex items-center">
                            <Award className="h-5 w-5 text-primary mr-1" />
                            <span className="font-medium">
                              {achievements.length}
                            </span>
                          </div>
                        </div>
                        {achievements.length === 0 ? (
                          <div className="text-center py-8 bg-muted/20 rounded-lg">
                            <p className="text-muted-foreground">
                              Yutuqlar yo'q
                            </p>
                          </div>
                        ) : (
                          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                            {achievements.map((achievement) => (
                              <AchievementCard
                                key={achievement.id}
                                achievement={achievement}
                                earned
                                earnedDate={
                                  achievement.awardedAt
                                    ? new Date(
                                        achievement.awardedAt
                                      ).toLocaleDateString()
                                    : undefined
                                }
                              />
                            ))}
                          </div>
                        )}
                      </TabsContent>

                      <TabsContent value="stats">
                        <div className="space-y-6">
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-lg font-medium">
                                Volontyorlik soatlari
                              </h3>
                              <div className="flex items-center">
                                <Clock className="h-5 w-5 text-primary mr-1" />
                                <span className="font-medium">
                                  {profile.hours} soat
                                </span>
                              </div>
                            </div>

                            {isLoadingHours ? (
                              <div className="flex justify-center items-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                              </div>
                            ) : hoursData?.length || [].length === 0 ? (
                              <div className="text-center py-8 bg-muted/20 rounded-lg">
                                <p className="text-muted-foreground">
                                  Soatlar ma'lumotlari yo'q
                                </p>
                              </div>
                            ) : (
                              <div className="h-80 mt-4">
                                <HoursChart data={hoursData} />
                              </div>
                            )}
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-lg font-medium">
                                Loyihalar statistikasi
                              </h3>
                              <div className="flex items-center">
                                <Users className="h-5 w-5 text-primary mr-1" />
                                <span className="font-medium">
                                  {profile.projects.length} loyiha
                                </span>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <Card className="bg-gradient-to-br from-primary/10 to-secondary/10">
                                <CardContent className="p-4 text-center">
                                  <h4 className="text-sm font-medium mb-1">
                                    Faol loyihalar
                                  </h4>
                                  <p className="text-3xl font-bold">
                                    {activeProjects.length}
                                  </p>
                                </CardContent>
                              </Card>
                              <Card className="bg-gradient-to-br from-primary/10 to-secondary/10">
                                <CardContent className="p-4 text-center">
                                  <h4 className="text-sm font-medium mb-1">
                                    Tugatilgan loyihalar
                                  </h4>
                                  <p className="text-3xl font-bold">
                                    {completedProjects.length}
                                  </p>
                                </CardContent>
                              </Card>
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-lg font-medium">
                                Yutuqlar statistikasi
                              </h3>
                              <div className="flex items-center">
                                <Award className="h-5 w-5 text-primary mr-1" />
                                <span className="font-medium">
                                  {achievements.length} yutuq
                                </span>
                              </div>
                            </div>

                            <Card className="bg-gradient-to-br from-primary/10 to-secondary/10">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h4 className="text-sm font-medium">
                                      Keyingi yutuqqa
                                    </h4>
                                    <p className="text-2xl font-bold">5 soat</p>
                                  </div>
                                  <div className="h-16 w-16 rounded-full bg-background flex items-center justify-center">
                                    <Award className="h-8 w-8 text-primary" />
                                  </div>
                                </div>
                                <Progress value={75} className="h-2 mt-2" />
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
