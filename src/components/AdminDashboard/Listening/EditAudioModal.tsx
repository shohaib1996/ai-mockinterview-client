"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { IListeningAudio } from "@/types";
import { useUpdateListeningAudioMutation } from "@/redux/api/listening-audio/listeningAudioApi";
import { toast } from "sonner";
import { useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";

interface EditAudioModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  audio: IListeningAudio | null;
}

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  audioUrl: z.string().url("Invalid URL").min(1, "Audio URL is required"),
  transcript: z.string().optional(),
});

export const EditAudioModal = ({
  open,
  onOpenChange,
  audio,
}: EditAudioModalProps) => {
  const [updateAudio, { isLoading }] = useUpdateListeningAudioMutation();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      audioUrl: "",
      transcript: "",
    },
  });

  useEffect(() => {
    if (audio) {
      form.reset({
        title: audio.title,
        audioUrl: audio.audioUrl,
        transcript: audio.transcript || "",
      });
    }
  }, [audio, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!audio) return;

    try {
      const res = await updateAudio({ id: audio.id, ...values }).unwrap();
      if (res.success) {
        toast.success("Audio updated successfully!");
        onOpenChange(false);
      }
    } catch (error) {
      console.log(error)
      toast.error("Failed to update audio.");
    }
  };

  if (!audio) {
    return null;
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[725px] max-h-[60vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Audio</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter audio title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="audioUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Audio URL</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter audio URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="transcript"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transcript</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter audio transcript"
                      className="h-64 w-full" // height ≈ rows, width ≈ cols
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
