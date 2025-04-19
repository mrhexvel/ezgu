import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function SuccessStories() {
  return (
    <section className="bg-primary/5 py-16">
      <div className="container px-4 md:px-6">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            Muvaffaqiyat tarixi
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Volontyorlarimiz va loyihalarimiz haqida hikoyalar
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="overflow-hidden">
            <div className="relative aspect-video">
              <Image
                src="/main-1.png"
                alt="Maktab qurilishi"
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-6">
              <h3 className="mb-2 text-xl font-bold">
                Qashqadaryo viloyatida yangi maktab
              </h3>
              <p className="mb-4 text-muted-foreground">
                Ezgu volontyorlari yordamida Qashqadaryo viloyatidagi chekka
                qishloqda yangi maktab qurildi va 200 dan ortiq bolalar ta'lim
                olish imkoniyatiga ega bo'ldi.
              </p>
              <Link
                href="/stories/qashqadaryo-maktab"
                className="inline-flex items-center text-primary hover:underline"
              >
                Batafsil
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <div className="relative aspect-video">
              <Image
                src="/main-2.png"
                alt="Ekologik aksiya"
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-6">
              <h3 className="mb-2 text-xl font-bold">
                Orol dengizi bo'yida 10,000 daraxt
              </h3>
              <p className="mb-4 text-muted-foreground">
                Ezgu volontyorlari Orol dengizi atrofida 10,000 dan ortiq daraxt
                ekishdi. Bu loyiha mahalliy ekologik vaziyatni yaxshilashga
                yordam berdi.
              </p>
              <Link
                href="/stories/orol-daraxt"
                className="inline-flex items-center text-primary hover:underline"
              >
                Batafsil
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <div className="relative aspect-video">
              <Image
                src="/main-3.png"
                alt="Tibbiy yordam"
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-6">
              <h3 className="mb-2 text-xl font-bold">
                Chekka hududlarda tibbiy yordam
              </h3>
              <p className="mb-4 text-muted-foreground">
                Volontyor shifokorlarimiz Surxondaryo viloyatining chekka
                qishloqlarida 500 dan ortiq aholiga bepul tibbiy yordam
                ko'rsatdilar.
              </p>
              <Link
                href="/stories/tibbiy-yordam"
                className="inline-flex items-center text-primary hover:underline"
              >
                Batafsil
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="mt-10 text-center">
          <Button asChild>
            <Link href="/stories">
              Barcha hikoyalarni o'qish
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
