"use client";

import { useState } from "react";
import { useExtractTextFromImageMutation } from "@/redux/api/text-extraction/textExtractionApi";

export const useImageTextExtraction = () => {
  const [extractTextFromImage, { isLoading }] = useExtractTextFromImageMutation();
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [error, setError] = useState<any>(null);

  const extractText = async (imageFile: File) => {
    const formData = new FormData();
    formData.append("file", imageFile);

    try {
      const response = await extractTextFromImage(formData).unwrap();
      setExtractedText(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err);
      setExtractedText(null);
    }
  };

  return { extractedText, isLoading, error, extractText };
};
