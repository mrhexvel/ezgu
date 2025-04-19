"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, Search, UserPlus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { getInitials } from "@/lib/utils"

const formSchema = z.object({
  email: z.string().email({
    message: "Yaroqli email manzilini kiriting",
  }),
})

interface InviteVolunteersDialogProps {
  projectId: string
  onInviteSuccess?: () => void
}

export function InviteVolunteersDialog({ projectId, onInviteSuccess }: InviteVolunteersDialogProps) {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [selectedUsers, setSelectedUsers] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  const searchUsers = async (email: string) => {
    if (!email) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const response = await fetch(`/api/users/search?email=${encodeURIComponent(email)}`)
      if (!response.ok) {
        throw new Error("Foydalanuvchilarni qidirishda xatolik")
      }
      const data = await response.json()
      setSearchResults(data.users)
    } catch (error) {
      console.error("Error searching users:", error)
      toast({
        title: "Xatolik",
        description: "Foydalanuvchilarni qidirishda xatolik yuz berdi",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }

  const selectUser = (user: any) => {
    if (!selectedUsers.some((u) => u.id === user.id)) {
      setSelectedUsers([...selectedUsers, user])
    }
    form.reset()
    setSearchResults([])
  }

  const removeUser = (userId: string) => {
    setSelectedUsers(selectedUsers.filter((user) => user.id !== userId))
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (searchResults.length > 0) {
      selectUser(searchResults[0])
      return
    }

    if (values.email) {
      await searchUsers(values.email)
    }
  }

  const sendInvitations = async () => {
    if (selectedUsers.length === 0) {
      toast({
        title: "Ogohlantirish",
        description: "Taklif qilish uchun hech bo'lmaganda bitta foydalanuvchini tanlang",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/projects/${projectId}/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userIds: selectedUsers.map((user) => user.id),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Takliflarni yuborishda xatolik")
      }

      toast({
        title: "Muvaffaqiyatli",
        description: "Takliflar muvaffaqiyatli yuborildi",
      })

      setSelectedUsers([])
      setOpen(false)

      if (onInviteSuccess) {
        onInviteSuccess()
      }
    } catch (error) {
      console.error("Error sending invitations:", error)
      toast({
        title: "Xatolik",
        description: error instanceof Error ? error.message : "Takliflarni yuborishda xatolik yuz berdi",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <UserPlus className="mr-2 h-4 w-4" />
          Volontyorlarni taklif qilish
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Volontyorlarni taklif qilish</DialogTitle>
          <DialogDescription>Loyihaga qatnashish uchun volontyorlarni taklif qiling</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input
                        placeholder="Email orqali qidirish..."
                        className="pl-9 pr-14"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e)
                          searchUsers(e.target.value)
                        }}
                      />
                    </FormControl>
                    {isSearching && <Loader2 className="absolute right-2.5 top-2.5 h-4 w-4 animate-spin" />}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        {searchResults.length > 0 && (
          <div className="max-h-40 overflow-y-auto border rounded-md">
            {searchResults.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-2 hover:bg-muted cursor-pointer"
                onClick={() => selectUser(user)}
              >
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar || undefined} alt={user.name} />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <UserPlus className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {selectedUsers.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Tanlangan foydalanuvchilar:</p>
            <div className="flex flex-wrap gap-2">
              {selectedUsers.map((user) => (
                <Badge key={user.id} variant="secondary" className="flex items-center gap-1">
                  {user.name}
                  <Button variant="ghost" size="icon" className="h-4 w-4 p-0 ml-1" onClick={() => removeUser(user.id)}>
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Bekor qilish
          </Button>
          <Button onClick={sendInvitations} disabled={isLoading || selectedUsers.length === 0}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Yuborilmoqda...
              </>
            ) : (
              "Takliflarni yuborish"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
