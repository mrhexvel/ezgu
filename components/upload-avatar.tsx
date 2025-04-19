"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials } from "@/lib/utils"

interface UploadAvatarProps {
  currentAvatar?: string | null
  name: string
  onUpload: (url: string) => void
}

export function UploadAvatar({ currentAvatar, name, onUpload }: UploadAvatarProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast({
        variant: "destructive",
        title: "Yuklash xatosi",
        description: "Iltimos, rasm tanlang",
      })
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "Yuklash xatosi",
        description: "Fayl hajmi 2MB dan oshmasligi kerak",
      })
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Yuklash xatosi")
      }

      const data = await response.json()
      onUpload(data.url)

      toast({
        title: "Muvaffaqiyatli",
        description: "Avatar muvaffaqiyatli yuklandi",
      })
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        variant: "destructive",
        title: "Yuklash xatosi",
        description: "Rasmni yuklab bo'lmadi",
      })
      setPreviewUrl(null)
    } finally {
      setIsUploading(false)
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveAvatar = () => {
    setPreviewUrl(null)
    onUpload("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <Avatar className="h-24 w-24 border-2 border-primary/20">
          {previewUrl ? (
            <div className="h-full w-full overflow-hidden rounded-full">
              <Image
                src={previewUrl || "/placeholder.svg"}
                alt={name}
                width={96}
                height={96}
                className="h-full w-full object-cover"
              />
            </div>
          ) : currentAvatar ? (
            <AvatarImage src={currentAvatar || "/placeholder.svg"} alt={name} className="h-full w-full object-cover" />
          ) : (
            <AvatarFallback className="text-2xl">{getInitials(name)}</AvatarFallback>
          )}
        </Avatar>
        {(previewUrl || currentAvatar) && (
          <Button
            variant="destructive"
            size="icon"
            className="absolute -right-2 -top-2 h-6 w-6 rounded-full"
            onClick={handleRemoveAvatar}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleButtonClick}
          disabled={isUploading}
          className="flex items-center gap-2"
        >
          {isUploading ? (
            <>
              <span className="animate-spin">⏳</span>
              Yuklanmoqda...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Avatarni yuklash
            </>
          )}
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
          disabled={isUploading}
        />
      </div>
    </div>
  )
}
