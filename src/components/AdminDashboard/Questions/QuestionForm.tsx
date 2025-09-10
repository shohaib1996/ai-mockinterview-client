"use client"

import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { PlusCircle, MinusCircle } from "lucide-react"

import type { IQuestion } from "@/types/question/question"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Define enums for runtime use, matching the type definitions in src/types/question/question.ts
enum QuestionTypeEnum {
  MCQ = "MCQ",
}

enum SessionTypeEnum {
  IELTS_LISTENING = "IELTS_LISTENING",
  IELTS_READING = "IELTS_READING",
  IELTS_WRITING = "IELTS_WRITING",
  IELTS_SPEAKING = "IELTS_SPEAKING",
  MOCK_INTERVIEW_TECHNICAL = "MOCK_INTERVIEW_TECHNICAL",
  MOCK_INTERVIEW_BEHAVIORAL = "MOCK_INTERVIEW_BEHAVIORAL",
  MOCK_INTERVIEW_INTERPERSONAL = "MOCK_INTERVIEW_INTERPERSONAL",
  QUIZ = "QUIZ",
}

enum DifficultyEnum {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HARD = "HARD",
}

const questionFormSchema = z.object({
  text: z.string().min(1, { message: "Question text is required" }),
  type: z.enum([QuestionTypeEnum.MCQ], { message: "Question type is required" }),
  sessionType: z.enum(
    [
      SessionTypeEnum.IELTS_LISTENING,
      SessionTypeEnum.IELTS_READING,
      SessionTypeEnum.IELTS_WRITING,
      SessionTypeEnum.IELTS_SPEAKING,
      SessionTypeEnum.MOCK_INTERVIEW_TECHNICAL,
      SessionTypeEnum.MOCK_INTERVIEW_BEHAVIORAL,
      SessionTypeEnum.MOCK_INTERVIEW_INTERPERSONAL,
      SessionTypeEnum.QUIZ,
    ],
    { message: "Session type is required" },
  ),
  difficulty: z.enum([DifficultyEnum.LOW, DifficultyEnum.MEDIUM, DifficultyEnum.HARD], {
    message: "Difficulty is required",
  }),
  options: z.array(
    z.object({
      value: z.string().min(1, { message: "Option cannot be empty" }),
    })
  ),
  correctAnswer: z
    .union([z.string().min(1, { message: "Correct answer is required" })])
    .optional(),
  aiGenerated: z.boolean(),
})

type QuestionFormData = z.infer<typeof questionFormSchema>

interface QuestionFormProps {
  defaultValues?: Partial<IQuestion>
  onSubmit: (data: QuestionFormData) => void
  isLoading?: boolean
}

export const QuestionForm = ({ defaultValues, onSubmit, isLoading }: QuestionFormProps) => {
  const form = useForm<QuestionFormData>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: {
      text: defaultValues?.text || "",
      type: (defaultValues?.type as QuestionTypeEnum) || QuestionTypeEnum.MCQ,
      sessionType: (defaultValues?.sessionType as SessionTypeEnum) || SessionTypeEnum.MOCK_INTERVIEW_TECHNICAL,
      difficulty: (defaultValues?.difficulty as DifficultyEnum) || DifficultyEnum.MEDIUM,
      options:
        defaultValues?.options?.map((opt) =>
          typeof opt === "string" ? { value: opt } : opt
        ) || [{ value: "" }, { value: "" }],
      correctAnswer: (defaultValues?.correctAnswer as string) || "",
      aiGenerated: defaultValues?.aiGenerated ?? false,
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "options",
  })

  const questionType = form.watch("type")

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">Question Text</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Enter question text"
                  className="min-h-[120px] resize-none focus:ring-2 focus:ring-primary/20"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Question Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(QuestionTypeEnum).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sessionType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Session Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select session type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(SessionTypeEnum).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.replace(/_/g, " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(DifficultyEnum).map((level) => (
                      <SelectItem key={level} value={level}>
                        <span
                          className={`capitalize ${
                            level === "HARD"
                              ? "text-red-600 dark:text-red-400"
                              : level === "MEDIUM"
                                ? "text-yellow-600 dark:text-yellow-400"
                                : "text-green-600 dark:text-green-400"
                          }`}
                        >
                          {level.toLowerCase()}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {questionType === QuestionTypeEnum.MCQ && (
          <div className="space-y-2">
            <FormLabel className="text-base font-medium">Answer Options</FormLabel>
            <div className="">
              {fields.map((item, index) => (
                <div key={item.id} className="flex items-center gap-1 p-2 bg-muted/30 rounded-lg">
                  <span className="text-sm font-medium text-muted-foreground min-w-[24px]">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <FormField
                    control={form.control}
                    name={`options.${index}.value`}
                    render={({ field }) => (
                      <FormItem className="flex-grow">
                        <FormControl>
                          <Input
                            {...field}
                            placeholder={`Option ${String.fromCharCode(65 + index)}`}
                            className="border-0 bg-background focus:ring-2 focus:ring-primary/20"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    disabled={fields?.length <= 2}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <MinusCircle className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => append({ value: "" })}
              className="w-full border-dashed"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add Option
            </Button>
          </div>
        )}

        {questionType === QuestionTypeEnum.MCQ && (
          <FormField
            control={form.control}
            name="correctAnswer"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Correct Answer</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter correct answer (e.g., A, B, C or Option text)"
                    className="focus:ring-2 focus:ring-primary/20"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex justify-end pt-4 border-t">
          <Button type="submit" disabled={isLoading} className="min-w-[120px]">
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
