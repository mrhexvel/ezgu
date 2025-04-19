"use client"

import type React from "react"

import { useState } from "react"
import { CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export function JoinForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
  }

  return (
    <section className="bg-white py-16">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">Volontyor bo'ling</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Ezgu jamoasiga qo'shiling va jamiyatimizni yaxshilashga o'z hissangizni qo'shing
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-xl">
          {isSubmitted ? (
            <div className="rounded-lg bg-green-50 p-6 text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
              <h3 className="mt-4 text-xl font-medium text-green-800">Arizangiz qabul qilindi!</h3>
              <p className="mt-2 text-green-700">
                Tez orada siz bilan bog'lanamiz. Ezgu jamoasiga qo'shilganingiz uchun rahmat!
              </p>
              <Button className="mt-4" onClick={() => setIsSubmitted(false)}>
                Yangi ariza yuborish
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="first-name">Ism</Label>
                  <Input id="first-name" placeholder="Ismingiz" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Familiya</Label>
                  <Input id="last-name" placeholder="Familiyangiz" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="sizning@email.uz" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefon</Label>
                <Input id="phone" placeholder="+998 XX XXX XX XX" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Shahar</Label>
                <Select>
                  <SelectTrigger id="city">
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
                <Select>
                  <SelectTrigger id="interests">
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
                />
              </div>

              <Button type="submit" className="w-full">
                Ariza yuborish
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
