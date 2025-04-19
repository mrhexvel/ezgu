"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Clock, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { getInitials } from "@/lib/utils";

const formSchema = z.object({
  hours: z.coerce.number().positive({
    message: "Soatlar soni musbat bo'lishi kerak",
  }),
  note: z.string().optional(),
});

interface AwardHoursDialogProps {
  projectId: string;
  participant: {
    id: string;
    hours: number;
    user: {
      id: string;
      name: string;
      avatar: string | null;
    };
  };
  onSuccess?: () => void;
}

export function AwardHoursDialog({
  projectId,
  participant,
  onSuccess,
}: AwardHoursDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hours: 1,
      note: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/projects/${projectId}/hours`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          participantId: participant.id,
          hours: values.hours,
          note: values.note,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Soatlarni qo'shishda xatolik");
      }

      const data = await response.json();
      toast({
        title: "Muvaffaqiyatli",
        description: data.message,
      });

      setOpen(false);
      form.reset();

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error awarding hours:", error);
      toast({
        title: "Xatolik",
        description:
          error instanceof Error
            ? error.message
            : "Soatlarni qo'shishda xatolik yuz berdi",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Clock className="h-4 w-4 mr-2" />
          Soat qo'shish
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Volontyor soatlarini qo'shish</DialogTitle>
          <DialogDescription>
            Loyihada ishtirok etganligi uchun volontyorga soatlar qo'shing
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-3 py-2">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={participant.user.avatar || undefined}
              alt={participant.user.name}
            />
            <AvatarFallback>
              {getInitials(participant.user.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{participant.user.name}</p>
            <p className="text-sm text-muted-foreground">
              Joriy soatlar: {participant.hours}
            </p>
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-2"
          >
            <FormField
              control={form.control}
              name="hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Soatlar</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" step="1" {...field} />
                  </FormControl>
                  <FormDescription>Qo'shiladigan soatlar soni</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Izoh</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Soatlar haqida qo'shimcha ma'lumot..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Ixtiyoriy izoh</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Bekor qilish
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saqlanmoqda...
              </>
            ) : (
              "Soatlarni qo'shish"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
