"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function TestimonialsSection() {
  const testimonials = [
    {
      id: "1",
      name: "Dilshod Rahimov",
      role: "Volontyor",
      avatar: "/testimonial.svg",
      quote:
        "Ezgu platformasi orqali men ko'plab yangi do'stlar topdim va jamiyatimizga yordam berishdi.",
    },
    {
      id: "2",
      name: "Nilufar Karimova",
      role: "Loyiha rahbari",
      avatar: "/testimonial.svg",
      quote:
        "Ezgu bilan hamkorlik qilish bizning loyihamizni yangi darajaga olib chiqdi.",
    },
    {
      id: "3",
      name: "Jahongir Aliyev",
      role: "Volontyor",
      avatar: "/testimonial.svg",
      quote:
        "Volontyorlik faoliyati menga yangi ko'nikmalar va tajribalar berdi.",
    },
    {
      id: "4",
      name: "Zarina Usmanova",
      role: "Hamkor tashkilot rahbari",
      avatar: "/testimonial.svg",
      quote:
        "Ezgu bilan hamkorlik qilish bizning tashkilotimiz uchun juda foydali bo'ldi.",
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
            Fikrlar
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Volontyorlarimiz fikrlari
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Ezgu platformasi haqida volontyorlarimiz va hamkorlarimiz nima
            deyishadi
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map((testimonial) => (
                <CarouselItem
                  key={testimonial.id}
                  className="md:basis-1/2 lg:basis-1/3 pl-4"
                >
                  <div className="p-1">
                    <Card className="backdrop-blur-sm bg-background/50 border-border relative group">
                      <div className="absolute -inset-px rounded-lg opacity-0 group-hover:opacity-100 bg-gradient-to-r from-primary/20 to-secondary/20 blur-sm transition-opacity" />
                      <CardContent className="relative p-6">
                        <Quote className="h-8 w-8 text-primary/20 mb-4" />
                        <p className="mb-6 text-muted-foreground">
                          {testimonial.quote}
                        </p>
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-full overflow-hidden">
                            <Image
                              src={testimonial.avatar || "/placeholder.svg"}
                              alt={testimonial.name}
                              width={48}
                              height={48}
                              className="h-full w-full object-cover bg-white"
                            />
                          </div>
                          <div>
                            <h4 className="font-medium">{testimonial.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {testimonial.role}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-8 gap-2">
              <CarouselPrevious className="static" />
              <CarouselNext className="static" />
            </div>
          </Carousel>
        </motion.div>
      </div>
    </section>
  );
}
