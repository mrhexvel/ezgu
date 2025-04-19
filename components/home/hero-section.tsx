"use client";

import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  const { user } = useAuth();

  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="absolute inset-0 bg-[url('/hero-bg.png')] bg-cover bg-center opacity-20 dark:opacity-10" />

      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/5 dark:to-secondary/5 backdrop-blur-[2px]" />

      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
          className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-primary/20"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{
            duration: 2.5,
            delay: 0.5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
          className="absolute top-40 right-10 h-60 w-60 rounded-full bg-secondary/20"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{
            duration: 3,
            delay: 1,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
          className="absolute bottom-10 left-1/3 h-40 w-40 rounded-full bg-primary/20"
        />
      </div>

      <div className="container relative px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-block rounded-full bg-primary/10 dark:bg-primary/20 px-4 py-1.5 text-sm font-medium backdrop-blur"
          >
            Uzbekiston volontyorlik harakati
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
          >
            Ezgu ishlar bilan dunyoni o'zgartiring
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8 text-lg text-muted-foreground md:text-xl"
          >
            Ezgu - bu O'zbekistondagi eng yirik volontyorlik platformasi. Biz
            bilan birga jamiyatga foyda keltiruvchi loyihalarda ishtirok eting
            va hayotlarni o'zgartiring.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col gap-4 sm:flex-row sm:justify-center"
          >
            <Button
              size="lg"
              asChild
              className="bg-primary hover:bg-primary/90 group"
            >
              <Link href={user ? "/dashboard" : "/register"}>
                {user ? "Dashboard" : "Volontyor bo'ling"}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-primary text-primary hover:bg-primary/10"
            >
              <Link href="/projects">Loyihalarni ko'rish</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
