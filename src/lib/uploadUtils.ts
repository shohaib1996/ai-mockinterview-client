// src/hooks/useFileUpload.ts
import { useUploadPhotoMutation, useUploadAudioMutation } from "@/redux/api/file-upload/fileUploadApi";
import { useState } from "react";

interface UseFileUploadResult {
  uploadFiles: (files: File[], type: "photo" | "audio") => Promise<string[]>;
  loading: boolean;
  error?: string;
}

const MAX_PHOTO_FILES = 5;
const MAX_PHOTO_SIZE_MB = 5;

export function useFileUpload(): UseFileUploadResult {
  const [uploadPhoto] = useUploadPhotoMutation();
  const [uploadAudio] = useUploadAudioMutation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const uploadFiles = async (files: File[], type: "photo" | "audio"): Promise<string[]> => {
    setError(undefined);

    if (type === "photo") {
      // Limit number of files
      if (files?.length > MAX_PHOTO_FILES) {
        setError(`You can upload up to ${MAX_PHOTO_FILES} photos.`);
        return [];
      }

      // Check file sizes
      for (const file of files) {
        if (file.size > MAX_PHOTO_SIZE_MB * 1024 * 1024) {
          setError(`Each photo must be smaller than ${MAX_PHOTO_SIZE_MB} MB.`);
          return [];
        }
      }
    }

    const formData = new FormData();
    if (type === "photo") {
      files.forEach((file) => formData.append("photos", file));
    } else if (type === "audio") {
      if (files?.length > 1) {
        setError("You can only upload one audio file at a time.");
        return [];
      }
      formData.append("audio", files[0]);
    }

    try {
      setLoading(true);
      const urls = type === "photo" ? await uploadPhoto(formData).unwrap() : await uploadAudio(formData).unwrap();
      return urls;
    } catch (err: any) {
      console.error(err);
      setError(err?.data?.message || "Upload failed.");
      return [];
    } finally {
      setLoading(false);
    }
  };

  return { uploadFiles, loading, error };
}
