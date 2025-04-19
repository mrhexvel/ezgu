"use client"

import Image from "next/image"
import { motion } from "framer-motion"

export function PartnersSection() {
  const partners = [
    { id: "1", name: "Partner 1", logo: "/placeholder-logo.svg" },
    { id: "2", name: "Partner 2", logo: "/placeholder-logo.svg" },
    { id: "3", name: "Partner 3", logo: "/placeholder-logo.svg" },
    { id: "4", name: "Partner 4", logo: "/placeholder-logo.svg" },
    { id: "5", name: "Partner 5", logo: "/placeholder-logo.svg" },
    { id: "6", name: "Partner 6", logo: "/placeholder-logo.svg" },
  ]

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
          <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary mb-4">Hamkorlar</div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Bizning hamkorlarimiz
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">Ezgu platformasi bilan hamkorlik qiluvchi tashkilotlar</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center"
        >
          {partners.map((partner, index) => (
            <motion.div
              key={partner.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="flex items-center justify-center"
            >
              <div className="relative h-16 w-32 grayscale hover:grayscale-0 transition-all duration-300">
                <Image src={partner.logo || "/placeholder.svg"} alt={partner.name} fill className="object-contain" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
