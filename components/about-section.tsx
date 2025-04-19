import { CheckCircle } from "lucide-react";
import Image from "next/image";

export function AboutSection() {
  return (
    <section className="bg-white py-16">
      <div className="container px-4 md:px-6">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div className="relative aspect-video overflow-hidden rounded-lg shadow-xl">
            <Image
              src="/about-main.png"
              alt="Ezgu volontyorlari ish jarayonida"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="mb-6 text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              Ezgu haqida
            </h2>
            <p className="mb-6 text-lg text-muted-foreground">
              Ezgu - 2020-yilda tashkil etilgan O'zbekistondagi eng yirik
              volontyorlik platformasi. Bizning maqsadimiz - jamiyatimizni
              yaxshilash uchun insonlarni birlashtirish va ularga yordam berish
              imkoniyatini yaratish.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <h3 className="font-medium">5000+ faol volontyorlar</h3>
                  <p className="text-muted-foreground">
                    Butun O'zbekiston bo'ylab faoliyat yurituvchi ko'ngillilar
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <h3 className="font-medium">250+ muvaffaqiyatli loyihalar</h3>
                  <p className="text-muted-foreground">
                    Ta'lim, ekologiya, ijtimoiy yordam va boshqa sohalarda
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <h3 className="font-medium">14 viloyat qamrovi</h3>
                  <p className="text-muted-foreground">
                    O'zbekistonning barcha hududlarida faoliyat yuritamiz
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
