'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PlusCircle, MinusCircle } from 'lucide-react';
import { ReactNode } from 'react';

import { IQuestion, QuestionType, SessionType, Difficulty } from '@/types/question/question';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

// Define enums for runtime use, matching the type definitions in src/types/question/question.ts
enum QuestionTypeEnum {
  MCQ = 'MCQ',
}

enum SessionTypeEnum {
  IELTS_LISTENING = 'IELTS_LISTENING',
  IELTS_READING = 'IELTS_READING',
  IELTS_WRITING = 'IELTS_WRITING',
  IELTS_SPEAKING = 'IELTS_SPEAKING',
  MOCK_INTERVIEW_TECHNICAL = 'MOCK_INTERVIEW_TECHNICAL',
  MOCK_INTERVIEW_BEHAVIORAL = 'MOCK_INTERVIEW_BEHAVIORAL',
  MOCK_INTERVIEW_INTERPERSONAL = 'MOCK_INTERVIEW_INTERPERSONAL',
  QUIZ = 'QUIZ',
}

enum DifficultyEnum {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

// Define the CustomFormDialogProps interface to include children
interface CustomFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const questionFormSchema = z.object({
  text: z.string().min(1, { message: 'Question text is required' }),
  type: z.enum([QuestionTypeEnum.MCQ], { message: 'Question type is required' }),
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
    { message: 'Session type is required' }
  ),
  difficulty: z.enum([DifficultyEnum.LOW, DifficultyEnum.MEDIUM, DifficultyEnum.HARD], {
    message: 'Difficulty is required',
  }),
  options: z.array(z.string().min(1, { message: 'Option cannot be empty' })).optional(),
  correctAnswer: z
    .union([
      z.string().min(1, { message: 'Correct answer is required' }),
      z.array(z.string().min(1, { message: 'Correct answer cannot be empty' })),
    ])
    .optional()
    .refine(
      (val) => {
        if (val === undefined) return true; // Allow undefined for non-MCQ types
        if (Array.isArray(val)) return val.length > 0; // Ensure array is not empty
        return typeof val === 'string' && val.length > 0; // Ensure string is not empty
      },
      { message: 'Correct answer is required for MCQ questions' }
    ),
  aiGenerated: z.boolean(),
  listeningAudioId: z.string().nullable().optional(),
  readingPassageId: z.string().nullable().optional(),
  quizAttemptId: z.string().nullable().optional(),
});

type QuestionFormData = z.infer<typeof questionFormSchema>;

interface QuestionFormProps {
  defaultValues?: Partial<IQuestion>;
  onSubmit: (data: QuestionFormData) => void;
  isLoading?: boolean;
}

export const QuestionForm = ({
  defaultValues,
  onSubmit,
  isLoading,
}: QuestionFormProps) => {
  const form = useForm<QuestionFormData>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: {
      text: defaultValues?.text || '',
      type: (defaultValues?.type as QuestionTypeEnum) || QuestionTypeEnum.MCQ,
      sessionType: (defaultValues?.sessionType as SessionTypeEnum) || SessionTypeEnum.MOCK_INTERVIEW_TECHNICAL,
      difficulty: (defaultValues?.difficulty as DifficultyEnum) || DifficultyEnum.MEDIUM,
      options: defaultValues?.options || ['', ''], // Ensure at least two empty options for MCQ
      correctAnswer: defaultValues?.correctAnswer || '',
      aiGenerated: defaultValues?.aiGenerated ?? false,
      listeningAudioId: defaultValues?.listeningAudioId ?? null,
      readingPassageId: defaultValues?.readingPassageId ?? null,
      quizAttemptId: defaultValues?.quizAttemptId ?? null,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'options' as const, // Explicitly type as const to avoid 'never' type
  });

  // Watch for changes in question type to adjust correct answer input
  const questionType = form.watch('type');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question Text</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Enter question text" className="h-32" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {questionType === QuestionTypeEnum.MCQ && (
          <div className="space-y-2">
            <FormLabel>Options</FormLabel>
            {fields.map((item, index) => (
              <div key={item.id} className="flex items-center gap-2">
                <FormField
                  control={form.control}
                  name={`options.${index}`}
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormControl>
                        <Input {...field} placeholder={`Option ${index + 1}`} />
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
                  disabled={fields.length <= 2}
                >
                  <MinusCircle className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => append('')}
              className="w-full"
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
                <FormLabel>Correct Answer</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter correct answer"
                    value={Array.isArray(field.value) ? field.value.join(', ') : field.value || ''}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="aiGenerated"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>AI Generated</FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="listeningAudioId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Listening Audio ID (Optional)</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ''} placeholder="Enter listening audio ID" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="readingPassageId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reading Passage ID (Optional)</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ''} placeholder="Enter reading passage ID" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="quizAttemptId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quiz Attempt ID (Optional)</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ''} placeholder="Enter quiz attempt ID" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </Form>
  );
};