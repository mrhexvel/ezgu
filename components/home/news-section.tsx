"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function NewsSection() {
  const news = [
    {
      id: "1",
      title: "Yangi volontyorlik dasturi",
      description:
        "Ezgu platformasi yangi volontyorlik dasturini e'lon qildi. Bu dastur orqali siz o'z ko'nikmalaringizni rivojlantirishingiz mumkin.",
      image: "/main-1.png",
      date: "12 May, 2025",
      slug: "yangi-volontyorlik-dasturi",
    },
    {
      id: "2",
      title: "Xalqaro hamkorlik",
      description:
        "Ezgu platformasi xalqaro volontyorlik tashkilotlari bilan hamkorlikni boshladi. Bu hamkorlik orqali volontyorlarimiz xalqaro tajribaga ega bo'lishadi.",
      image: "/main-2.png",
      date: "5 May, 2025",
      slug: "xalqaro-hamkorlik",
    },
    {
      id: "3",
      title: "Volontyorlik festivali",
      description:
        "Toshkent shahrida volontyorlik festivali o'tkaziladi. Festival davomida turli xil master-klasslar va tadbirlar bo'lib o'tadi.",
      image: "/main-3.png",
      date: "20 Aprel, 2025",
      slug: "volontyorlik-festivali",
    },
  ];

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Glassmorphism background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 backdrop-blur-sm" />

      <div className="container relative px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary mb-4">
            Yangiliklar
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            So'nggi yangiliklar
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Ezgu platformasi va volontyorlik sohasidagi so'nggi yangiliklar
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {news.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <Card className="overflow-hidden h-full backdrop-blur-sm bg-background/50 border-border relative">
                <div className="absolute -inset-px rounded-t-lg opacity-0 group-hover:opacity-100 bg-gradient-to-r from-primary/20 to-secondary/20 blur-sm transition-opacity" />
                <div className="relative aspect-video">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <Calendar className="mr-2 h-4 w-4 text-primary" />
                    {item.date}
                  </div>
                  <h3 className="mb-2 text-xl font-bold">{item.title}</h3>
                  <p className="mb-4 text-muted-foreground">
                    {item.description}
                  </p>
                  <Link
                    href={`/blog/${item.slug}`}
                    className="inline-flex items-center text-primary hover:underline group-hover:text-primary/80"
                  >
                    Batafsil
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </CardContent>
              </Card>
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
            <Link href="/blog">
              Barcha yangiliklar
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
