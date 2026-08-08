"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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
  FormDescription,
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
import { ISpeakingTestBank } from "@/types";

const linesToArray = (value: string): string[] =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

const arrayToLines = (value?: string[]): string => (value ?? []).join("\n");

const formSchema = z.object({
  part1Topic: z.string().min(1, "Part 1 topic is required"),
  part1Questions: z.string().min(1, "At least one Part 1 question is required"),
  cueCardTopic: z.string().min(1, "Cue card topic is required"),
  cueCardBullets: z.string().min(1, "At least one cue card bullet is required"),
  part2FollowUpQuestions: z.string().min(1, "At least one follow-up question is required"),
  part3Questions: z.string().min(1, "At least one Part 3 question is required"),
  difficulty: z.enum(["LOW", "MEDIUM", "HIGH"]),
});

type FormValues = z.infer<typeof formSchema>;

export interface ISpeakingTestBankPayload {
  part1Topic: string;
  part1Questions: string[];
  cueCardTopic: string;
  cueCardBullets: string[];
  part2FollowUpQuestions: string[];
  part3Questions: string[];
  difficulty: "LOW" | "MEDIUM" | "HIGH";
}

interface CreateSpeakingTestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ISpeakingTestBankPayload) => void;
  isLoading: boolean;
  editingTest?: ISpeakingTestBank | null;
}

export const CreateSpeakingTestDialog = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  editingTest,
}: CreateSpeakingTestDialogProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      part1Topic: "",
      part1Questions: "",
      cueCardTopic: "",
      cueCardBullets: "",
      part2FollowUpQuestions: "",
      part3Questions: "",
      difficulty: "MEDIUM",
    },
  });

  useEffect(() => {
    if (!isOpen) return;
    if (editingTest) {
      form.reset({
        part1Topic: editingTest.part1Topic,
        part1Questions: arrayToLines(editingTest.part1Questions),
        cueCardTopic: editingTest.cueCardTopic,
        cueCardBullets: arrayToLines(editingTest.cueCardBullets),
        part2FollowUpQuestions: arrayToLines(editingTest.part2FollowUpQuestions),
        part3Questions: arrayToLines(editingTest.part3Questions),
        difficulty: editingTest.difficulty ?? "MEDIUM",
      });
    } else {
      form.reset({
        part1Topic: "",
        part1Questions: "",
        cueCardTopic: "",
        cueCardBullets: "",
        part2FollowUpQuestions: "",
        part3Questions: "",
        difficulty: "MEDIUM",
      });
    }
  }, [isOpen, editingTest, form]);

  const handleSubmit = (values: FormValues) => {
    onSubmit({
      part1Topic: values.part1Topic,
      part1Questions: linesToArray(values.part1Questions),
      cueCardTopic: values.cueCardTopic,
      cueCardBullets: linesToArray(values.cueCardBullets),
      part2FollowUpQuestions: linesToArray(values.part2FollowUpQuestions),
      part3Questions: linesToArray(values.part3Questions),
      difficulty: values.difficulty,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingTest ? "Edit Speaking Test" : "Create Speaking Test"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="part1Topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Part 1 Topic</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. Hometown, Work, Studies" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="part1Questions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Part 1 Questions</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="One question per line" className="h-24" />
                  </FormControl>
                  <FormDescription>One question per line.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cueCardTopic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Part 2 Cue Card Topic</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. Describe a book you recently read" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cueCardBullets"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cue Card &quot;You should say...&quot; Bullets</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="One bullet point per line" className="h-24" />
                  </FormControl>
                  <FormDescription>One bullet point per line.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="part2FollowUpQuestions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Part 2 Follow-up Questions</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="One question per line" className="h-20" />
                  </FormControl>
                  <FormDescription>
                    Asked right after the long turn, before moving to Part 3.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="part3Questions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Part 3 Discussion Questions</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="One question per line" className="h-24" />
                  </FormControl>
                  <FormDescription>One question per line, tied to the cue card topic.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Difficulty</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="LOW">Easy</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : editingTest ? "Save Changes" : "Create Test"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
