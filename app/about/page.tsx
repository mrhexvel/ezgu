import { Calendar, CheckCircle, Heart, MapPin, Users } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { StatsCard } from "@/components/stats-card";

export const metadata: Metadata = {
  title: "Biz haqimizda | Ezgu",
  description: "Ezgu volontyorlik platformasi haqida ma'lumot",
};

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-primary/10 py-12">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                Biz haqimizda
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Ezgu - O'zbekistondagi eng yirik volontyorlik platformasi
              </p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 md:grid-cols-2 md:items-center">
              <div className="relative aspect-video overflow-hidden rounded-lg shadow-xl">
                <Image
                  src="/about-main.png"
                  alt="Ezgu jamoasi"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h2 className="mb-6 text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                  Bizning tarix
                </h2>
                <p className="mb-4 text-lg text-muted-foreground">
                  Ezgu 2020-yilda bir guruh faol yoshlar tomonidan tashkil
                  etilgan. Bizning maqsadimiz - O'zbekistonda volontyorlik
                  harakatini rivojlantirish va jamiyatimizni yaxshilash uchun
                  insonlarni birlashtirish.
                </p>
                <p className="mb-6 text-lg text-muted-foreground">
                  Biz dastlab kichik loyihalar bilan ishni boshladik - mahalliy
                  maktablarga yordam berish, keksalarga g'amxo'rlik qilish va
                  ekologik aksiyalar o'tkazish. Bugun esa biz O'zbekistonning
                  barcha viloyatlarida faoliyat yurituvchi eng yirik
                  volontyorlik platformasiga aylandik.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-primary" />
                    <div>
                      <h3 className="font-medium">Bizning qadriyatlar</h3>
                      <p className="text-muted-foreground">
                        Biz g'amxo'rlik, hamkorlik va mas'uliyatni qadrlaymiz
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-primary" />
                    <div>
                      <h3 className="font-medium">Bizning maqsad</h3>
                      <p className="text-muted-foreground">
                        Jamiyatimizni yaxshilash uchun insonlarni birlashtirish
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-primary/5 py-12">
          <div className="container px-4 md:px-6">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                Raqamlarda Ezgu
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Bizning faoliyatimiz haqida statistika
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                icon={<Users className="h-8 w-8 text-primary" />}
                value="5,000+"
                label="Volontyorlar"
              />
              <StatsCard
                icon={<Calendar className="h-8 w-8 text-primary" />}
                value="250+"
                label="O'tkazilgan tadbirlar"
              />
              <StatsCard
                icon={<MapPin className="h-8 w-8 text-primary" />}
                value="14"
                label="Viloyatlar qamrovi"
              />
              <StatsCard
                icon={<Heart className="h-8 w-8 text-primary" />}
                value="10,000+"
                label="Yordam olganlar"
              />
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container px-4 md:px-6">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                Bizning jamoa
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Ezgu platformasining asosiy a'zolari
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              <div className="text-center">
                <div className="mx-auto mb-4 h-32 w-32 overflow-hidden rounded-full">
                  <Image
                    src="/placeholder.svg?height=128&width=128"
                    alt="Aziz Karimov"
                    width={128}
                    height={128}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold">Aziz Karimov</h3>
                <p className="text-primary">Asoschisi va Direktor</p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 h-32 w-32 overflow-hidden rounded-full">
                  <Image
                    src="/placeholder.svg?height=128&width=128"
                    alt="Nilufar Rahimova"
                    width={128}
                    height={128}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold">Nilufar Rahimova</h3>
                <p className="text-primary">Loyihalar menejeri</p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 h-32 w-32 overflow-hidden rounded-full">
                  <Image
                    src="/placeholder.svg?height=128&width=128"
                    alt="Jahongir Toshmatov"
                    width={128}
                    height={128}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold">Jahongir Toshmatov</h3>
                <p className="text-primary">Volontyorlar koordinatori</p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 h-32 w-32 overflow-hidden rounded-full">
                  <Image
                    src="/placeholder.svg?height=128&width=128"
                    alt="Madina Aliyeva"
                    width={128}
                    height={128}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold">Madina Aliyeva</h3>
                <p className="text-primary">PR menejeri</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
