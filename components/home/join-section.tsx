"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export function JoinSection() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    interests: "",
    message: "",
  })
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Ariza yuborildi",
      description: "Sizning arizangiz muvaffaqiyatli yuborildi. Tez orada siz bilan bog'lanamiz.",
    })
    setIsSubmitted(true)
  }

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-sm" />

      <div className="container relative px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary mb-4">Qo'shiling</div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Volontyor bo'ling
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Ezgu jamoasiga qo'shiling va jamiyatimizni yaxshilashga o'z hissangizni qo'shing
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="mx-auto mt-10 max-w-xl"
        >
          {isSubmitted ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="rounded-lg backdrop-blur-lg bg-background/50 border border-border p-6 text-center relative"
            >
              <div className="absolute -inset-px rounded-lg bg-gradient-to-r from-primary/20 to-secondary/20 blur-sm" />
              <div className="relative">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle className="h-10 w-10 text-primary" />
                </div>
                <h3 className="mt-4 text-xl font-medium">Arizangiz qabul qilindi!</h3>
                <p className="mt-2 text-muted-foreground">
                  Tez orada siz bilan bog'lanamiz. Ezgu jamoasiga qo'shilganingiz uchun rahmat!
                </p>
                <Button className="mt-4" onClick={() => setIsSubmitted(false)}>
                  Yangi ariza yuborish
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="rounded-lg backdrop-blur-lg bg-background/50 border border-border p-6 relative"
            >
              <div className="absolute -inset-px rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 blur-sm" />
              <form onSubmit={handleSubmit} className="space-y-6 relative">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Ism</Label>
                    <Input
                      id="firstName"
                      placeholder="Ismingiz"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Familiya</Label>
                    <Input
                      id="lastName"
                      placeholder="Familiyangiz"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="bg-background/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="sizning@email.uz"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon</Label>
                  <Input
                    id="phone"
                    placeholder="+998 XX XXX XX XX"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">Shahar</Label>
                  <Select onValueChange={(value) => handleSelectChange("city", value)}>
                    <SelectTrigger id="city" className="bg-background/50">
                      <SelectValue placeholder="Shahringizni tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tashkent">Toshkent</SelectItem>
                      <SelectItem value="samarkand">Samarqand</SelectItem>
                      <SelectItem value="bukhara">Buxoro</SelectItem>
                      <SelectItem value="namangan">Namangan</SelectItem>
                      <SelectItem value="andijan">Andijon</SelectItem>
                      <SelectItem value="fergana">Farg'ona</SelectItem>
                      <SelectItem value="other">Boshqa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interests">Qiziqishlaringiz</Label>
                  <Select onValueChange={(value) => handleSelectChange("interests", value)}>
                    <SelectTrigger id="interests" className="bg-background/50">
                      <SelectValue placeholder="Qiziqishlaringizni tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="education">Ta'lim</SelectItem>
                      <SelectItem value="ecology">Ekologiya</SelectItem>
                      <SelectItem value="healthcare">Sog'liqni saqlash</SelectItem>
                      <SelectItem value="social">Ijtimoiy yordam</SelectItem>
                      <SelectItem value="culture">Madaniyat</SelectItem>
                      <SelectItem value="other">Boshqa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Xabar</Label>
                  <Textarea
                    id="message"
                    placeholder="O'zingiz haqingizda va nima uchun volontyor bo'lmoqchi ekanligingiz haqida qisqacha ma'lumot bering"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="bg-background/50"
                  />
                </div>

                <Button type="submit" className="w-full group">
                  Ariza yuborish
                </Button>
              </form>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
