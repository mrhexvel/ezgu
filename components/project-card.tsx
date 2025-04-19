"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calendar, MapPin, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  location: string;
  date: string;
  volunteers: number;
  category: string;
}

export function ProjectCard({
  id,
  title,
  description,
  image,
  location,
  date,
  volunteers,
  category,
}: ProjectCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "education":
        return "bg-blue-500/10 text-blue-500 dark:bg-blue-500/20";
      case "ecology":
        return "bg-green-500/10 text-green-500 dark:bg-green-500/20";
      case "healthcare":
        return "bg-red-500/10 text-red-500 dark:bg-red-500/20";
      case "social":
        return "bg-orange-500/10 text-orange-500 dark:bg-orange-500/20";
      case "culture":
        return "bg-purple-500/10 text-purple-500 dark:bg-purple-500/20";
      default:
        return "bg-primary/10 text-primary dark:bg-primary/20";
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case "education":
        return "Ta'lim";
      case "ecology":
        return "Ekologiya";
      case "healthcare":
        return "Sog'liqni saqlash";
      case "social":
        return "Ijtimoiy yordam";
      case "culture":
        return "Madaniyat";
      default:
        return "Boshqa";
    }
  };

  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
      <Card className="overflow-hidden h-full backdrop-blur-sm bg-background/50 border-border relative group">
        <div className="absolute -inset-px rounded-t-lg opacity-0 group-hover:opacity-100 bg-gradient-to-r from-primary/20 to-secondary/20 blur-sm transition-opacity" />
        <div className="relative aspect-video">
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-2 right-2">
            <Badge className={`${getCategoryColor(category)}`}>
              {getCategoryName(category)}
            </Badge>
          </div>
        </div>
        <CardHeader>
          <h3 className="text-xl font-bold">{title}</h3>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-muted-foreground">{description}</p>
          <div className="space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="mr-2 h-4 w-4 text-primary" />
              {location}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-2 h-4 w-4 text-primary" />
              {date}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="mr-2 h-4 w-4 text-primary" />
              {volunteers} volontyor
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full group">
            <Link href={`/projects/${id}`}>
              Qo'shilish
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
