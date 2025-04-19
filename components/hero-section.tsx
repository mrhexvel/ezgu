import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative bg-[url('/hero-bg.png')] bg-cover bg-center py-20 text-white md:py-32">
      <div className="absolute inset-0 bg-primary/70" />
      <div className="container relative px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur">
            Uzbekiston volontyorlik harakati
          </div>
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Ezgu ishlar bilan dunyoni o'zgartiring
          </h1>
          <p className="mb-8 text-lg text-white/90 md:text-xl">
            Ezgu - bu O'zbekistondagi eng yirik volontyorlik platformasi. Biz
            bilan birga jamiyatga foyda keltiruvchi loyihalarda ishtirok eting
            va hayotlarni o'zgartiring.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              asChild
              className="bg-white text-primary hover:bg-white/90"
            >
              <Link href="/register">
                Volontyor bo'ling
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-white text-white hover:bg-white/10"
            >
              <Link href="/projects">Loyihalarni ko'rish</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
