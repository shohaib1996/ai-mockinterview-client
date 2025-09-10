"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

import { useFileUpload } from "@/lib/uploadUtils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IWritingTask } from "@/types";

interface UploadResponse {
  success: boolean;
  message: string;
  data: string[];
}

const task1Schema = z.object({
  task: z.literal("TASK1"),
  promptText: z.string().min(1, "Prompt is required"),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
});

const task2Schema = z.object({
  task: z.literal("TASK2"),
  promptText: z.string().min(1, "Prompt is required"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
});

const formSchema = z.discriminatedUnion("task", [task1Schema, task2Schema]);

interface CreateWritingTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<IWritingTask, "id">) => void;
  isLoading: boolean;
}

export const CreateWritingTaskDialog = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: CreateWritingTaskDialogProps) => {
  const [activeTab, setActiveTab] = useState<"TASK1" | "TASK2">("TASK1");
  const { uploadFiles, loading: isUploading } = useFileUpload();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      task: "TASK1",
      promptText: "",
      difficulty: "MEDIUM",
      imageUrl: "",
    },
  });

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const toastId = toast.loading("Uploading image...");
    try {
      const urls: UploadResponse = await uploadFiles([file], "photo") as any;

      if (urls?.data?.length > 0) {
        form.setValue("imageUrl", urls.data[0], { shouldValidate: true });
        toast.success("Image uploaded successfully!", { id: toastId });
      } else {
        throw new Error("Upload failed to return a URL.");
      }
    } catch (error) {
      console.log(error)
      toast.error("Image upload failed.", { id: toastId });
    }
  };

  const handleTabChange = (value: string) => {
    const newTab = value as "TASK1" | "TASK2";
    setActiveTab(newTab);
    form.setValue("task", newTab);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Create Writing Task</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="TASK1">Task 1</TabsTrigger>
                <TabsTrigger value="TASK2">Task 2</TabsTrigger>
              </TabsList>
              <TabsContent value="TASK1">
                <div className="space-y-4 p-1">
                  <FormField
                    control={form.control}
                    name="promptText"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prompt</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Enter the writing prompt..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="https://example.com/image.png"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormItem>
                    <FormLabel>Or Upload Image</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={isUploading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
              </TabsContent>
              <TabsContent value="TASK2">
                <div className="space-y-4 p-1">
                  <FormField
                    control={form.control}
                    name="promptText"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prompt</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Enter the writing prompt..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
            </Tabs>
            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Difficulty</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="EASY">Easy</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HARD">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading || isUploading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || isUploading}>
                {isLoading ? "Creating..." : "Create Task"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
