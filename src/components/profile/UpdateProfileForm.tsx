"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Save, User, ImageIcon, Upload } from "lucide-react";
import { useFileUpload } from "@/lib/uploadUtils";
import { useRef } from "react";
import { ISingleUser, UpdateProfileData } from "@/types";
import { toast } from "sonner";
interface UploadResponse {
  success: boolean;
  message: string;
  data: string[];
}

const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  avatarUrl: z.string().url("Please enter a valid URL").nullable(),
});

interface UpdateProfileFormProps {
  user: ISingleUser;
  onUpdate: (data: UpdateProfileData) => Promise<void>;
  isLoading: boolean;
}

export function UpdateProfileForm({
  user,
  onUpdate,
  isLoading,
}: UpdateProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFiles, loading: isUploading } = useFileUpload();

  const form = useForm<UpdateProfileData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user?.name || "",
      avatarUrl: user?.avatarUrl ?? null, // 👈 ensure it's string or null
    },
  });

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const toastId = toast.loading("Uploading image...");
      try {
        const uploadedUrls: UploadResponse = (await uploadFiles(
          [file],
          "photo"
        )) as any;
        if (uploadedUrls && uploadedUrls?.data.length > 0) {
          form.setValue("avatarUrl", uploadedUrls?.data[0], {
            shouldValidate: true,
          });
          toast.success("Image uploaded successfully!", { id: toastId });
        } else {
          toast.error("Failed to get avatar URL after upload.");
        }
      } catch (error) {
        toast.error("Image upload failed.", { id: toastId });
      }
    }
  };

  const onSubmit = async (data: UpdateProfileData) => {
    try {
      setIsSubmitting(true);
      await onUpdate(data);
      toast.success("Your profile has been successfully updated.");
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-[#1D2B64]/20">
      <CardHeader className="border-b border-[#1D2B64]/10">
        <CardTitle className="flex items-center gap-2 text-[#1D2B64] dark:text-white">
          <User className="h-5 w-5" />
          Update Profile
        </CardTitle>
        <CardDescription>Update your personal information.</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name
              </Label>
              <Input
                id="name"
                {...form.register("name")}
                className="border-[#1D2B64]/20 focus:border-[#04AF82] focus:ring-[#04AF82]/20"
                placeholder="Enter your full name"
              />
              {form.formState.errors?.name && (
                <p className="text-sm text-destructive">{form.formState.errors?.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatarUrl" className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Avatar URL
              </Label>
              <div className="flex gap-2">
                <Input
                  id="avatarUrl"
                  {...form.register("avatarUrl")}
                  className="flex-1 border-[#1D2B64]/20 focus:border-[#04AF82] focus:ring-[#04AF82]/20"
                  placeholder="Enter avatar image URL (optional)"
                  readOnly={isUploading}
                />
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="px-3 border-[#1D2B64]/20 hover:bg-[#04AF82]/10 hover:border-[#04AF82]"
                >
                  {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                </Button>
              </div>
              {form.formState.errors?.avatarUrl && (
                <p className="text-sm text-destructive">{form.formState.errors?.avatarUrl.message}</p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="w-full bg-[#04AF82] hover:bg-[#04AF82]/90 text-white"
          >
            {isSubmitting || isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Update Profile
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
