"use client"

import type React from "react"

import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"

export function Footer() {
  const [email, setEmail] = useState("")
  const { toast } = useToast()

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Obuna muvaffaqiyatli",
      description: "Siz Ezgu yangiliklari uchun obuna bo'ldingiz",
    })
    setEmail("")
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  }

  return (
    <footer className="bg-primary/10 dark:bg-primary/5 backdrop-blur-lg border-t">
      <div className="container px-4 py-12 md:px-6">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-8 sm:grid-cols-2 md:grid-cols-4"
        >
          <motion.div variants={item}>
            <Link href="/" className="flex items-center gap-2">
              <div className="relative h-10 w-10 overflow-hidden rounded-full bg-primary">
                <div className="flex h-full w-full items-center justify-center text-lg font-bold text-white">E</div>
              </div>
              <span className="text-xl font-bold text-primary dark:text-primary">Ezgu</span>
            </Link>
            <p className="mt-4 text-muted-foreground">
              O'zbekistondagi eng yirik volontyorlik platformasi. Jamiyatimizni yaxshilash uchun birgalikda harakat
              qilamiz.
            </p>
            <div className="mt-6 flex gap-4">
              <Link
                href="#"
                className="text-muted-foreground transition-colors hover:text-primary"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground transition-colors hover:text-primary"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground transition-colors hover:text-primary"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground transition-colors hover:text-primary"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </motion.div>

          <motion.div variants={item}>
            <h3 className="mb-4 text-lg font-medium">Sahifalar</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground transition-colors hover:text-primary hover:underline">
                  Bosh sahifa
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground transition-colors hover:text-primary hover:underline"
                >
                  Biz haqimizda
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="text-muted-foreground transition-colors hover:text-primary hover:underline"
                >
                  Loyihalar
                </Link>
              </li>
              <li>
                <Link
                  href="/stories"
                  className="text-muted-foreground transition-colors hover:text-primary hover:underline"
                >
                  Muvaffaqiyat tarixi
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-muted-foreground transition-colors hover:text-primary hover:underline"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground transition-colors hover:text-primary hover:underline"
                >
                  Aloqa
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div variants={item}>
            <h3 className="mb-4 text-lg font-medium">Loyihalar</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/projects/education"
                  className="text-muted-foreground transition-colors hover:text-primary hover:underline"
                >
                  Ta'lim
                </Link>
              </li>
              <li>
                <Link
                  href="/projects/ecology"
                  className="text-muted-foreground transition-colors hover:text-primary hover:underline"
                >
                  Ekologiya
                </Link>
              </li>
              <li>
                <Link
                  href="/projects/healthcare"
                  className="text-muted-foreground transition-colors hover:text-primary hover:underline"
                >
                  Sog'liqni saqlash
                </Link>
              </li>
              <li>
                <Link
                  href="/projects/social"
                  className="text-muted-foreground transition-colors hover:text-primary hover:underline"
                >
                  Ijtimoiy yordam
                </Link>
              </li>
              <li>
                <Link
                  href="/projects/culture"
                  className="text-muted-foreground transition-colors hover:text-primary hover:underline"
                >
                  Madaniyat
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div variants={item}>
            <h3 className="mb-4 text-lg font-medium">Aloqa</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-primary" />
                <span className="text-muted-foreground">Toshkent sh., Amir Temur ko'chasi, 108-uy</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0 text-primary" />
                <Link
                  href="tel:+998712345678"
                  className="text-muted-foreground transition-colors hover:text-primary hover:underline"
                >
                  +998 71 234 56 78
                </Link>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 shrink-0 text-primary" />
                <Link
                  href="mailto:info@ezgu.uz"
                  className="text-muted-foreground transition-colors hover:text-primary hover:underline"
                >
                  info@ezgu.uz
                </Link>
              </li>
            </ul>

            <form onSubmit={handleSubscribe} className="mt-6">
              <h4 className="mb-2 text-sm font-medium">Yangiliklardan xabardor bo'ling</h4>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Email manzilingiz"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background/50"
                />
                <Button type="submit">Obuna</Button>
              </div>
            </form>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-12 border-t border-border pt-6 text-center text-sm text-muted-foreground"
        >
          <p>© {new Date().getFullYear()} Ezgu. Barcha huquqlar himoyalangan.</p>
        </motion.div>
      </div>
    </footer>
  )
}
