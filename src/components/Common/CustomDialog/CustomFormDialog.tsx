'use client';

import { useEffect } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export interface FormFieldConfig {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea';
  options?: { value: string; label: string }[];
  placeholder?: string;
  validation?: z.ZodType<any, any>;
  className?: string;
}

interface CustomFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  fields: FormFieldConfig[];
  onSubmit: (data: any) => void;
  defaultValues?: Record<string, any>;
}

export const CustomFormDialog = ({
  isOpen,
  onClose,
  title,
  fields,
  onSubmit,
  defaultValues,
}: CustomFormDialogProps) => {
  const formSchema = z.object(
    fields.reduce(
      (acc, field) => {
        acc[field?.name] = field.validation || z.string().min(1, 'This field is required');
        return acc;
      },
      {} as Record<string, z.ZodType<any, any>>
    )
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
    } else {
      form.reset({});
    }
  }, [defaultValues, form.reset, form]);

  const handleFormSubmit = (data: z.infer<typeof formSchema>) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            {fields.map(field => (
              <FormField
                key={field?.name}
                control={form.control}
                name={field?.name}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel>{field.label}</FormLabel>
                    <FormControl>
                      {field.type === 'select' ? (
                        <Select onValueChange={formField.onChange} defaultValue={formField.value}>
                          <SelectTrigger className={field.className}>
                            <SelectValue placeholder={field.placeholder} />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options?.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : field.type === 'textarea' ? (
                        <Textarea
                          {...formField}
                          placeholder={field.placeholder}
                          className={field.className}
                        />
                      ) : (
                        <Input
                          {...formField}
                          type={field.type}
                          placeholder={field.placeholder}
                          className={field.className}
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
