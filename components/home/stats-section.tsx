"use client";

import { motion } from "framer-motion";
import { Calendar, Heart, MapPin, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

interface CounterProps {
  end: number;
  duration: number;
  suffix?: string;
}

function Counter({ end, duration, suffix = "" }: CounterProps) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    if (inView) {
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        setCount(Math.floor(progress * end));

        if (progress < 1) {
          animationFrame = requestAnimationFrame(step);
        }
      };

      animationFrame = requestAnimationFrame(step);
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [inView, end, duration]);

  return (
    <div ref={ref} className="text-3xl font-bold">
      {count}
      {suffix}
    </div>
  );
}

export function StatsSection() {
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 backdrop-blur-sm" />

      <div className="container relative px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Raqamlarda Ezgu
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Bizning faoliyatimiz haqida statistika
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="relative group"
          >
            <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-primary/20 to-secondary/20 blur-sm group-hover:blur-md transition-all" />
            <div className="relative rounded-xl backdrop-blur-sm bg-background/50 p-6 text-center h-full flex flex-col items-center justify-center border border-border">
              <div className="mb-4 rounded-full bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <Counter end={5000} duration={2000} suffix="+" />
              <p className="text-sm text-muted-foreground">Volontyorlar</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative group"
          >
            <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-primary/20 to-secondary/20 blur-sm group-hover:blur-md transition-all" />
            <div className="relative rounded-xl backdrop-blur-sm bg-background/50 p-6 text-center h-full flex flex-col items-center justify-center border border-border">
              <div className="mb-4 rounded-full bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <Counter end={250} duration={2000} suffix="+" />
              <p className="text-sm text-muted-foreground">
                O'tkazilgan tadbirlar
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="relative group"
          >
            <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-primary/20 to-secondary/20 blur-sm group-hover:blur-md transition-all" />
            <div className="relative rounded-xl backdrop-blur-sm bg-background/50 p-6 text-center h-full flex flex-col items-center justify-center border border-border">
              <div className="mb-4 rounded-full bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <Counter end={14} duration={1500} suffix="" />
              <p className="text-sm text-muted-foreground">
                Viloyatlar qamrovi
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="relative group"
          >
            <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-primary/20 to-secondary/20 blur-sm group-hover:blur-md transition-all" />
            <div className="relative rounded-xl backdrop-blur-sm bg-background/50 p-6 text-center h-full flex flex-col items-center justify-center border border-border">
              <div className="mb-4 rounded-full bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <Counter end={10000} duration={2000} suffix="+" />
              <p className="text-sm text-muted-foreground">Yordam olganlar</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
