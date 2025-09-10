"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Clock, Upload, FileText, Send } from "lucide-react";
import { useGetSingleWritingTaskQuery } from "@/redux/api/writingTask/writingTaskApi";
import { IWritingTask } from "@/types";
import { useImageTextExtraction } from "@/hooks/useImageTextExtraction";
import Image from "next/image";
import { useAppSelector } from "@/redux/hooks/hooks";
import { useCreateWritingSubmissionMutation } from "@/redux/api/writing-submission/writingSubmissionApi";
import { toast } from "sonner";
import Link from "next/link";

const WritingPractice = ({
  taskId,
  sessionId,
}: {
  taskId: string;
  sessionId: string;
}) => {
  const { data} =
    useGetSingleWritingTaskQuery(taskId);
  const [submitWriting, { isLoading: isSubmitting }] =
    useCreateWritingSubmissionMutation();
  const user = useAppSelector((state) => state.auth.user);
  const taskData: IWritingTask = data?.data || {};
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { extractedText, isLoading, extractText } = useImageTextExtraction();
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  console.log(isTimerRunning)
  const [textareaValue, setTextareaValue] = useState<string>("");
  const [submissionData, setSubmissionData] = useState<any>(null);

  useEffect(() => {
    setIsTimerRunning(true);
    const interval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "hard":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImageFile(event.target.files[0]);
    }
  };

  const handleExtractText = async () => {
    if (!imageFile) return;
    extractText(imageFile);
  };

  const handleSubmit = async () => {
    const submittedData = {
      sessionId,
      userId: user?.id,
      writingTaskId: taskId,
      extractedText: textareaValue,
    };

    try {
      const res = await submitWriting(submittedData).unwrap();
      setIsTimerRunning(false);
      setSubmissionData(res);
      console.log(res);
      toast.success("Writing submitted successfully!");
    } catch (error) {
      console.log(error)
      toast.error("Failed to submit writing. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="fixed top-4 right-4 z-50">
        <Card className="shadow-lg">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 text-sm font-mono">
              <Clock className="h-4 w-4" />
              <span>{formatTime(timer)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        <Card className="border-2">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl font-bold">
                  {taskData.task}
                </CardTitle>
                <p className="text-muted-foreground mt-1">ID: {taskData.id}</p>
              </div>
              {taskData.difficulty && (
                <Badge
                  className={`${getDifficultyColor(
                    String(taskData.difficulty)
                  )} text-white px-3 py-1`}
                >
                  {String(taskData.difficulty)}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Task Prompt:</h3>
                <p className="text-foreground leading-relaxed">
                  {taskData.promptText}
                </p>
              </div>
              {taskData.imageUrl && (
                <div>
                  <h3 className="font-semibold mb-2">Reference Image:</h3>
                  <Image
                    src={taskData.imageUrl || "/placeholder.svg"}
                    alt="Task reference"
                    className="max-w-full h-auto rounded-lg border shadow-sm"
                    width={500}
                    height={500}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Submit Your Writng Image
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="picture">Upload writing Image</Label>
                  <Input
                    id="picture"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                </div>

                <Button
                  onClick={handleExtractText}
                  disabled={!imageFile || isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Extracting...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Extract Text
                    </>
                  )}
                </Button>

                {imageFile && (
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground mb-2">
                      Preview:
                    </p>
                    <Image
                      src={URL.createObjectURL(imageFile)}
                      alt="Upload preview"
                      className="max-w-full h-auto rounded-lg border max-h-48 object-contain"
                      width={500}
                      height={500}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Extracted Text (Editable)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="extracted-text">
                    Edit extracted text as needed:
                  </Label>
                  <Textarea
                    id="extracted-text"
                    defaultValue={extractedText ?? ""}
                    onChange={(e) => setTextareaValue(e.target.value)}
                    placeholder="Extracted text will appear here and can be edited..."
                    className="resize-none"
                  />
                </div>

                {extractedText && (
                  <div className="text-sm text-muted-foreground">
                    Character count: {extractedText?.length}
                  </div>
                )}

                <Button
                  onClick={handleSubmit}
                  disabled={!extractedText || isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Answer
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {submissionData?.success && (
            <Card>
              <CardHeader>
                <CardTitle>Submission Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Score:</h3>
                  <p className="text-foreground">{submissionData.data.score}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Feedback:</h3>
                  <p className="text-foreground">
                    {submissionData.data.feedback}
                  </p>
                </div>

                <Link href={`/dashboard/ielts/writing`}>
                  <Button className="w-full">Continue Practice</Button>
                </Link>

              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default WritingPractice;
