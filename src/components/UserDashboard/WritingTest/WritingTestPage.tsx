"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Send, CheckCircle2 } from "lucide-react";
import {
  useGetWritingTestQuery,
  useSubmitWritingTestMutation,
} from "@/redux/api/writing-test/writingTestApi";

const TEST_DURATION_SECONDS = 60 * 60; // real Writing test is 60 minutes for both tasks

interface WritingTestPageProps {
  sessionId: string;
}

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
};

const wordCount = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

interface WritingResult {
  overallBand: number;
  task1: { band: number; wordCount: number; feedback: string; criteriaScores: Record<string, number> };
  task2: { band: number; wordCount: number; feedback: string; criteriaScores: Record<string, number> };
}

const WritingTestPage = ({ sessionId }: WritingTestPageProps) => {
  const router = useRouter();
  const { data, isLoading } = useGetWritingTestQuery(sessionId);
  const [submitWritingTest, { isLoading: isSubmitting }] = useSubmitWritingTestMutation();

  const [task1Text, setTask1Text] = useState("");
  const [task2Text, setTask2Text] = useState("");
  const [timeLeft, setTimeLeft] = useState(TEST_DURATION_SECONDS);
  const [result, setResult] = useState<WritingResult | null>(null);

  const task1 = data?.data?.task1;
  const task2 = data?.data?.task2;

  const handleSubmit = async () => {
    try {
      const res = await submitWritingTest({ sessionId, task1Text, task2Text }).unwrap();
      setResult(res.data);
      toast.success("Writing test submitted");
    } catch (error) {
      console.error("Failed to submit writing test:", error);
      toast.error("Failed to submit writing test. Please try again.");
    }
  };

  // Keep a ref to the latest handleSubmit so the timer always submits
  // whatever the user has written so far, not a stale snapshot from mount.
  const handleSubmitRef = useRef(handleSubmit);
  useEffect(() => {
    handleSubmitRef.current = handleSubmit;
  });

  useEffect(() => {
    if (result || !task1 || !task2) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [result, task1, task2]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (result) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-lg w-full text-center">
          <CardHeader>
            <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-2" />
            <CardTitle className="text-2xl">Writing Test Complete</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-6xl font-bold text-primary">{result.overallBand.toFixed(1)}</div>
            <p className="text-muted-foreground">Estimated Overall Band Score</p>
            <div className="grid grid-cols-2 gap-4 text-left">
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Task 1</p>
                <p className="text-2xl font-semibold">{result.task1.band.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">{result.task1.wordCount} words</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Task 2</p>
                <p className="text-2xl font-semibold">{result.task2.band.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">{result.task2.wordCount} words</p>
              </div>
            </div>
            <div className="text-left space-y-2">
              <p className="text-sm font-medium">Task 1 Feedback</p>
              <p className="text-sm text-muted-foreground">{result.task1.feedback}</p>
              <p className="text-sm font-medium">Task 2 Feedback</p>
              <p className="text-sm text-muted-foreground">{result.task2.feedback}</p>
            </div>
            <Button onClick={() => router.push("/dashboard/ielts/writing")} className="w-full">
              Back to Writing Practice
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-serif font-bold text-foreground">
            IELTS Academic Writing Test
          </h1>
          <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-lg">
            <Clock className="w-4 h-4 text-primary" />
            <span className="font-mono text-lg font-semibold text-foreground">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl space-y-10">
        {task1 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-serif font-bold">Task 1</h2>
              <Badge variant="secondary">Recommended: 20 minutes, 150+ words</Badge>
            </div>
            <Card>
              <CardContent className="pt-6 space-y-4">
                <p className="text-foreground">{task1.promptText}</p>
                {task1.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={task1.imageUrl}
                    alt="Task 1 chart"
                    className="rounded-md border border-border max-w-full"
                  />
                )}
              </CardContent>
            </Card>
            <Textarea
              placeholder="Write your Task 1 response here..."
              value={task1Text}
              onChange={(e) => setTask1Text(e.target.value)}
              className="min-h-[200px]"
            />
            <p className="text-sm text-muted-foreground text-right">
              {wordCount(task1Text)} words
            </p>
          </section>
        )}

        {task2 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-serif font-bold">Task 2</h2>
              <Badge variant="secondary">Recommended: 40 minutes, 250+ words</Badge>
            </div>
            <Card>
              <CardContent className="pt-6">
                <p className="text-foreground">{task2.promptText}</p>
              </CardContent>
            </Card>
            <Textarea
              placeholder="Write your Task 2 response here..."
              value={task2Text}
              onChange={(e) => setTask2Text(e.target.value)}
              className="min-h-[280px]"
            />
            <p className="text-sm text-muted-foreground text-right">
              {wordCount(task2Text)} words
            </p>
          </section>
        )}

        <div className="flex justify-center pt-4">
          <Button size="lg" onClick={handleSubmit} disabled={isSubmitting} className="px-10 py-6 text-lg">
            {isSubmitting ? "Submitting..." : "Submit Both Tasks"}
            <Send className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </main>
    </div>
  );
};

export default WritingTestPage;
