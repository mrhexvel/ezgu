"use client";

import { ProjectCard } from "@/components/project-card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function ProjectsSection() {
  const projects = [
    {
      id: "1",
      title: "Bolalar uyiga yordam",
      description:
        "Toshkent shahridagi bolalar uyiga o'quv qurollari va o'yinchoqlar yig'ish",
      image: "/main-1.png",
      location: "Toshkent",
      date: "12-20 Iyun, 2025",
      volunteers: 18,
      category: "education",
    },
    {
      id: "2",
      title: "Ekologik aksiya",
      description: "Samarqand atrofidagi hududlarni tozalash va daraxt ekish",
      image: "/main-2.png",
      location: "Samarqand",
      date: "5-6 Iyul, 2025",
      volunteers: 45,
      category: "ecology",
    },
    {
      id: "3",
      title: "Keksalarga g'amxo'rlik",
      description:
        "Yolg'iz keksalarga oziq-ovqat yetkazib berish va uy ishlarida yordam",
      image: "/main-3.png",
      location: "Buxoro",
      date: "Har hafta",
      volunteers: 32,
      category: "social",
    },
  ];

  return (
    <section className="py-16">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary mb-4">
            Loyihalar
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Volontyorlik loyihalari
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Jamiyatimizga yordam berish uchun quyidagi loyihalarga qo'shiling
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <ProjectCard
                id={project.id}
                title={project.title}
                description={project.description}
                image={project.image}
                location={project.location}
                date={project.date}
                volunteers={project.volunteers}
                category={project.category}
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <Button asChild className="group">
            <Link href="/projects">
              Barcha loyihalarni ko'rish
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
