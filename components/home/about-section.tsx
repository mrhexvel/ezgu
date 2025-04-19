"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function AboutSection() {
  return (
    <section className="py-16 overflow-hidden">
      <div className="container px-4 md:px-6">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-4 rounded-xl bg-gradient-to-r from-primary/20 to-secondary/20 blur-xl dark:from-primary/10 dark:to-secondary/10" />
            <div className="relative aspect-video overflow-hidden rounded-xl shadow-xl">
              <Image
                src="/about-main.png"
                alt="Ezgu volontyorlari ish jarayonida"
                fill
                className="object-cover transition-transform hover:scale-105 duration-700"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary mb-4">
              Biz haqimizda
            </div>
            <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Ezgu - O'zbekistondagi eng yirik volontyorlik platformasi
            </h2>
            <p className="mb-6 text-lg text-muted-foreground">
              Ezgu - 2020-yilda tashkil etilgan O'zbekistondagi eng yirik
              volontyorlik platformasi. Bizning maqsadimiz - jamiyatimizni
              yaxshilash uchun insonlarni birlashtirish va ularga yordam berish
              imkoniyatini yaratish.
            </p>
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                viewport={{ once: true }}
                className="flex items-start gap-3"
              >
                <div className="rounded-full bg-primary/10 p-1">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">5000+ faol volontyorlar</h3>
                  <p className="text-muted-foreground">
                    Butun O'zbekiston bo'ylab faoliyat yurituvchi ko'ngillilar
                  </p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                viewport={{ once: true }}
                className="flex items-start gap-3"
              >
                <div className="rounded-full bg-primary/10 p-1">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">250+ muvaffaqiyatli loyihalar</h3>
                  <p className="text-muted-foreground">
                    Ta'lim, ekologiya, ijtimoiy yordam va boshqa sohalarda
                  </p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                viewport={{ once: true }}
                className="flex items-start gap-3"
              >
                <div className="rounded-full bg-primary/10 p-1">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">14 viloyat qamrovi</h3>
                  <p className="text-muted-foreground">
                    O'zbekistonning barcha hududlarida faoliyat yuritamiz
                  </p>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
              viewport={{ once: true }}
              className="mt-8"
            >
              <Button asChild>
                <Link href="/about">Ko'proq ma'lumot</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
