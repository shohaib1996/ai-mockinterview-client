'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  promptText: z.string().min(10, 'Prompt must be at least 10 characters long.'),
});

interface GenerateQuestionsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { promptText: string }) => void;
  isLoading: boolean;
}

export const GenerateQuestionsDialog = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: GenerateQuestionsDialogProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { promptText: '' },
  });

  const handleFormSubmit = (data: z.infer<typeof formSchema>) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Questions</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Provide a prompt to generate questions for the passage.
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="promptText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prompt</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="e.g., Generate 10 multiple-choice questions based on the provided passage..."
                      className="h-32"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                Skip
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Generating...' : 'Generate'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};