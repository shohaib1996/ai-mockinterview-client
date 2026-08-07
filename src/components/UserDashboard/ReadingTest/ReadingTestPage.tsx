"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Clock, Send, CheckCircle2 } from "lucide-react";
import {
  useGetReadingTestQuery,
  useSubmitReadingTestMutation,
} from "@/redux/api/reading-test/readingTestApi";
import type { IQuestion } from "@/types";

const TEST_DURATION_SECONDS = 60 * 60; // real Academic Reading test is 60 minutes

interface ReadingTestPageProps {
  sessionId: string;
}

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
};

const ReadingTestPage = ({ sessionId }: ReadingTestPageProps) => {
  const router = useRouter();
  const { data, isLoading } = useGetReadingTestQuery(sessionId);
  const [submitReadingTest, { isLoading: isSubmitting }] = useSubmitReadingTestMutation();

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(TEST_DURATION_SECONDS);
  const [activePassage, setActivePassage] = useState("1");
  const [result, setResult] = useState<{
    rawScore: number;
    totalQuestions: number;
    band: number;
  } | null>(null);

  const readingTest = data?.data?.readingTest;
  const passages = useMemo(() => readingTest?.passages ?? [], [readingTest]);

  const handleSubmit = async () => {
    const payload = Object.entries(answers).map(([questionId, answerText]) => ({
      questionId,
      answerText,
    }));

    try {
      const res = await submitReadingTest({ sessionId, answers: payload }).unwrap();
      setResult(res.data);
      toast.success("Reading test submitted");
    } catch (error) {
      console.error("Failed to submit reading test:", error);
      toast.error("Failed to submit reading test. Please try again.");
    }
  };

  // Keep a ref to the latest handleSubmit so the timer always submits
  // whatever the user has answered so far, not a stale snapshot from mount.
  const handleSubmitRef = useRef(handleSubmit);
  useEffect(() => {
    handleSubmitRef.current = handleSubmit;
  });

  useEffect(() => {
    if (result || !readingTest) return;
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
  }, [result, readingTest]);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const totalQuestions = passages.reduce(
    (sum: number, p: any) => sum + (p.questions?.length ?? 0),
    0
  );
  const answeredCount = Object.keys(answers).length;

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
            <CardTitle className="text-2xl">Reading Test Complete</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-6xl font-bold text-primary">{result.band.toFixed(1)}</div>
            <p className="text-muted-foreground">Estimated Band Score</p>
            <p className="text-sm text-muted-foreground">
              {result.rawScore} of {result.totalQuestions} questions correct
            </p>
            <Button onClick={() => router.push("/dashboard/ielts/reading")} className="w-full">
              Back to Reading Practice
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
          <div>
            <h1 className="text-xl font-serif font-bold text-foreground">
              {readingTest?.title ?? "IELTS Academic Reading Test"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {answeredCount}/{totalQuestions} questions answered
            </p>
          </div>
          <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-lg">
            <Clock className="w-4 h-4 text-primary" />
            <span className="font-mono text-lg font-semibold text-foreground">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activePassage} onValueChange={setActivePassage}>
          <TabsList className="mb-6">
            {passages.map((passage: any) => (
              <TabsTrigger key={passage.order} value={String(passage.order)}>
                Passage {passage.order}
              </TabsTrigger>
            ))}
          </TabsList>

          {passages.map((passage: any) => (
            <TabsContent key={passage.order} value={String(passage.order)}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif text-xl">{passage.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="prose dark:prose-invert max-w-none whitespace-pre-line">
                    {passage.content}
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  {passage.questions.map((question: IQuestion, index: number) => (
                    <Card key={question.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base font-serif">
                            Question {index + 1}
                          </CardTitle>
                          <Badge variant="secondary">{question.type.replace(/_/g, " ")}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-foreground font-medium leading-relaxed">
                          {question.text}
                        </p>

                        {question.type === "MCQ" || question.type === "MATCHING" ? (
                          <div className="grid gap-2">
                            {question.options?.map((option, optionIndex) => (
                              <Button
                                key={optionIndex}
                                type="button"
                                variant={answers[question.id] === option ? "default" : "outline"}
                                className="justify-start text-left h-auto py-2 px-3"
                                onClick={() => handleAnswerChange(question.id, option)}
                              >
                                {option}
                              </Button>
                            ))}
                          </div>
                        ) : question.type === "TRUE_FALSE_NOT_GIVEN" ? (
                          <div className="grid grid-cols-3 gap-2">
                            {["True", "False", "Not Given"].map((option) => (
                              <Button
                                key={option}
                                type="button"
                                variant={answers[question.id] === option ? "default" : "outline"}
                                onClick={() => handleAnswerChange(question.id, option)}
                              >
                                {option}
                              </Button>
                            ))}
                          </div>
                        ) : (
                          <Input
                            placeholder="Type your answer"
                            value={answers[question.id] ?? ""}
                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                          />
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="flex justify-center mt-10">
          <Button size="lg" onClick={handleSubmit} disabled={isSubmitting} className="px-10 py-6 text-lg">
            {isSubmitting ? "Submitting..." : "Submit Reading Test"}
            <Send className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </main>
    </div>
  );
};

export default ReadingTestPage;
