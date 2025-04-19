"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function SuccessStoriesSection() {
  const stories = [
    {
      id: "1",
      title: "Qashqadaryo viloyatida yangi maktab",
      description:
        "Ezgu volontyorlari yordamida Qashqadaryo viloyatidagi chekka qishloqda yangi maktab qurildi va 200 dan ortiq bolalar ta'lim olish imkoniyatiga ega bo'ldi.",
      image: "/main-1.png",
      slug: "qashqadaryo-maktab",
    },
    {
      id: "2",
      title: "Orol dengizi bo'yida 10,000 daraxt",
      description:
        "Ezgu volontyorlari Orol dengizi atrofida 10,000 dan ortiq daraxt ekishdi. Bu loyiha mahalliy ekologik vaziyatni yaxshilashga yordam berdi.",
      image: "/main-2.png",
      slug: "orol-daraxt",
    },
    {
      id: "3",
      title: "Chekka hududlarda tibbiy yordam",
      description:
        "Volontyor shifokorlarimiz Surxondaryo viloyatining chekka qishloqlarida 500 dan ortiq aholiga bepul tibbiy yordam ko'rsatdilar.",
      image: "/main-3.png",
      slug: "tibbiy-yordam",
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
            Muvaffaqiyat
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Muvaffaqiyat tarixi
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Volontyorlarimiz va loyihalarimiz haqida hikoyalar
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stories.map((story, index) => (
            <motion.div
              key={story.id}
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
                    src={story.image || "/placeholder.svg"}
                    alt={story.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="mb-2 text-xl font-bold">{story.title}</h3>
                  <p className="mb-4 text-muted-foreground">
                    {story.description}
                  </p>
                  <Link
                    href={`/stories/${story.slug}`}
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
            <Link href="/stories">
              Barcha hikoyalarni o'qish
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
