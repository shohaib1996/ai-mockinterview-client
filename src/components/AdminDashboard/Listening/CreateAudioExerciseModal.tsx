'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useFileUpload } from '@/lib/uploadUtils';
import { useCreateListeningAudioMutation } from '@/redux/api/listening-audio/listeningAudioApi';
import { useGenerateQuestionsMutation } from '@/redux/api/question/questionApi';
import { toast } from 'sonner';

// Step 1: Details form schema
const detailsSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  transcript: z.string().min(1, 'Transcript is required'),
  audioUrl: z.string().url('Please enter a valid URL'),
});

// Step 2: Generate questions form schema
const generateSchema = z.object({
  promptText: z.string().min(1, 'Prompt is required'),
});

interface CreateAudioExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateAudioExerciseModal = ({
  isOpen,
  onClose,
}: CreateAudioExerciseModalProps) => {
  const [step, setStep] = useState<'details' | 'generate-questions'>('details');
  const [createdAudioId, setCreatedAudioId] = useState<string | null>(null);

  const { uploadFiles, loading: isUploading } = useFileUpload();
  const [createAudio, { isLoading: isCreating }] =
    useCreateListeningAudioMutation();
  const [generateQuestions, { isLoading: isGenerating }] =
    useGenerateQuestionsMutation();

  const detailsForm = useForm<z.infer<typeof detailsSchema>>({
    resolver: zodResolver(detailsSchema),
    defaultValues: { title: '', transcript: '', audioUrl: '' },
  });

  const generateForm = useForm<z.infer<typeof generateSchema>>({
    resolver: zodResolver(generateSchema),
    defaultValues: { promptText: '' },
  });

  const resetAll = () => {
    detailsForm.reset({ title: '', transcript: '', audioUrl: '' });
    generateForm.reset({ promptText: '' });
    setStep('details');
    setCreatedAudioId(null);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files?.length > 0) {
      const uploadedResult = (await uploadFiles([files[0]], 'audio')) as any;
      if (uploadedResult && uploadedResult.data && uploadedResult.data?.length > 0) {
        detailsForm.setValue('audioUrl', uploadedResult.data[0]);
        toast.success('Audio uploaded successfully!');
      }
    }
  };

  const onDetailsSubmit = async (values: z.infer<typeof detailsSchema>) => {
    try {
      const res = await createAudio(values).unwrap();
      if (res.success) {
        toast.success(
          "Audio created successfully! Now, let's generate some questions."
        );
        setCreatedAudioId(res.data.id);
        setStep('generate-questions');
      }
    } catch (error) {
      console.log(error)
      toast.error('Failed to create audio.');
    }
  };

  const onGenerateSubmit = async (values: z.infer<typeof generateSchema>) => {
    if (!createdAudioId) return;
    try {
      const res = await generateQuestions({
        ...values,
        numberOfQuestions: 10,
        sessionType: 'IELTS_LISTENING',
        listeningAudioId: createdAudioId,
      }).unwrap();

      if (res.success) {
        toast.success('Questions generated successfully!');
        handleClose();
      }
    } catch (error) {
      console.log(error)
      toast.error('Failed to generate questions.');
    }
  };

  const handleClose = () => {
    resetAll();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && handleClose()}>
      <DialogContent className="sm:max-w-[525px] max-h-[80vh] overflow-y-auto">
        {step === 'details' && (
          <>
            <DialogHeader>
              <DialogTitle>Create Audio Exercise</DialogTitle>
            </DialogHeader>
            <Form {...detailsForm}>
              <form
                onSubmit={detailsForm.handleSubmit(onDetailsSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={detailsForm.control}
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
                  control={detailsForm.control}
                  name="transcript"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transcript</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter the audio transcript"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={detailsForm.control}
                  name="audioUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Audio URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Paste audio URL or upload a file"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormItem>
                  <FormLabel>Upload Audio</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="audio/*"
                      onChange={handleFileChange}
                      disabled={isUploading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleClose}
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit" disabled={isCreating || isUploading}>
                    {isCreating ? 'Creating...' : 'Next'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        )}

        {step === 'generate-questions' && (
          <>
            <DialogHeader>
              <DialogTitle>Generate Questions</DialogTitle>
            </DialogHeader>
            <Form {...generateForm}>
              <form
                onSubmit={generateForm.handleSubmit(onGenerateSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={generateForm.control}
                  name="promptText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prompt</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter a prompt to generate questions based on the transcript..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit" disabled={isGenerating}>
                    {isGenerating ? 'Generating...' : 'Generate Questions'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
