"use client";

import { useExtractTextMutation } from "@/redux/api/text-extraction/textExtractionApi";
import { useState } from "react";


export const useImageTextExtraction = () => {
  const [extractTextFromImage, { isLoading }] = useExtractTextMutation();
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [error, setError] = useState<any>(null);

  const extractText = async (imageFile: File) => {
    const formData = new FormData();
    formData.append("image", imageFile);

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
