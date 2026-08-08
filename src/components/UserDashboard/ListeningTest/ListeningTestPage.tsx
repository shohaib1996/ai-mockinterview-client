"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Clock, Send, CheckCircle2, ChevronRight, Play, Volume2 } from "lucide-react";
import {
  useGetListeningTestQuery,
  useSubmitListeningTestMutation,
} from "@/redux/api/listening-test/listeningTestApi";
import { useGetAllAnswersQuery } from "@/redux/api/answer/answerApi";
import type { IQuestion } from "@/types";
import { CheckCircle, XCircle } from "lucide-react";

const TEST_DURATION_SECONDS = 35 * 60; // ~30 min listening + a short review buffer

// Real IELTS Listening plays each recording once, with no rewinding or scrubbing.
// `key`-ing this per section (see usage below) resets its state automatically
// whenever the section changes, since React remounts on a key change.
const SinglePlayAudio = ({ src }: { src: string }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [status, setStatus] = useState<"ready" | "playing" | "ended">("ready");

  const handlePlay = () => {
    audioRef.current?.play();
    setStatus("playing");
  };

  return (
    <div className="flex items-center gap-3">
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio ref={audioRef} src={src} onEnded={() => setStatus("ended")} />
      {status === "ready" && (
        <Button type="button" onClick={handlePlay} className="gap-2">
          <Play className="w-4 h-4" /> Play Audio (plays once, as in the real test)
        </Button>
      )}
      {status === "playing" && (
        <div className="flex items-center gap-2 text-primary font-medium">
          <Volume2 className="w-4 h-4 animate-pulse" /> Playing...
        </div>
      )}
      {status === "ended" && (
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <CheckCircle2 className="w-4 h-4" /> Audio finished — answer from memory, just like the real test
        </div>
      )}
    </div>
  );
};

interface ListeningTestPageProps {
  sessionId: string;
}

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
};

const ListeningTestPage = ({ sessionId }: ListeningTestPageProps) => {
  const router = useRouter();
  const { data, isLoading } = useGetListeningTestQuery(sessionId);
  const [submitListeningTest, { isLoading: isSubmitting }] = useSubmitListeningTestMutation();

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(TEST_DURATION_SECONDS);
  const [sectionIndex, setSectionIndex] = useState(0);
  const [result, setResult] = useState<{
    rawScore: number;
    totalQuestions: number;
    band: number;
  } | null>(null);

  const listeningTest = data?.data?.listeningTest;
  const session = data?.data?.session;
  const isReviewMode = !!session?.endedAt;
  const sections = useMemo(() => listeningTest?.sections ?? [], [listeningTest]);
  const currentSection = sections[sectionIndex];
  const isLastSection = sectionIndex === sections.length - 1;

  const { data: answersData } = useGetAllAnswersQuery(
    { sessionId },
    { skip: !isReviewMode }
  );
  const answersMap = useMemo(() => {
    const map: Record<string, { answerText: string; isCorrect: boolean }> = {};
    (answersData?.data ?? []).forEach((a: any) => {
      map[a.questionId] = { answerText: a.answerText, isCorrect: a.isCorrect };
    });
    return map;
  }, [answersData]);

  const handleSubmit = async () => {
    const payload = Object.entries(answers).map(([questionId, answerText]) => ({
      questionId,
      answerText,
    }));

    try {
      const res = await submitListeningTest({ sessionId, answers: payload }).unwrap();
      setResult(res.data);
      toast.success("Listening test submitted");
    } catch (error) {
      console.error("Failed to submit listening test:", error);
      toast.error("Failed to submit listening test. Please try again.");
    }
  };

  // Keep a ref to the latest handleSubmit so the timer always submits
  // whatever the user has answered so far, not a stale snapshot from mount.
  const handleSubmitRef = useRef(handleSubmit);
  useEffect(() => {
    handleSubmitRef.current = handleSubmit;
  });

  useEffect(() => {
    if (result || !listeningTest || isReviewMode) return;
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
  }, [result, listeningTest, isReviewMode]);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const totalQuestions = sections.reduce(
    (sum: number, s: any) => sum + (s.questions?.length ?? 0),
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
            <CardTitle className="text-2xl">Listening Test Complete</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-6xl font-bold text-primary">{result.band.toFixed(1)}</div>
            <p className="text-muted-foreground">Estimated Band Score</p>
            <p className="text-sm text-muted-foreground">
              {result.rawScore} of {result.totalQuestions} questions correct
            </p>
            <Button onClick={() => router.push("/dashboard/ielts/listening")} className="w-full">
              Back to Listening Practice
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isReviewMode) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-sm border-b border-border">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-xl font-serif font-bold text-foreground">
              {listeningTest?.title ?? "IELTS Academic Listening Test"}
            </h1>
            <Badge variant="secondary" className="text-sm">
              Review — Band {session?.score?.toFixed(1) ?? "N/A"}
            </Badge>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-4xl space-y-10">
          {sections.map((section: any) => (
            <div key={section.order} className="space-y-4">
              <Badge variant="secondary" className="text-sm">
                Section {section.order}: {section.title}
              </Badge>
              <Card>
                <CardContent className="pt-6">
                  <audio controls src={section.audioUrl} className="w-full">
                    Your browser does not support the audio element.
                  </audio>
                </CardContent>
              </Card>
              <div className="space-y-4">
                {section.questions.map((question: IQuestion, index: number) => (
                  <Card key={question.id}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-serif">Question {index + 1}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <p className="text-foreground font-medium leading-relaxed">{question.text}</p>
                      <div className="flex items-center gap-2">
                        {answersMap[question.id]?.isCorrect ? (
                          <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600 shrink-0" />
                        )}
                        <span className="text-muted-foreground">
                          Your answer:{" "}
                          <span className="font-medium text-foreground">
                            {answersMap[question.id]?.answerText || "No answer"}
                          </span>
                        </span>
                      </div>
                      {!answersMap[question.id]?.isCorrect && (
                        <p className="text-muted-foreground">
                          Correct answer:{" "}
                          <span className="font-medium text-green-600">{question.correctAnswer}</span>
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}

          <div className="flex justify-center pt-4">
            <Button size="lg" onClick={() => router.push("/dashboard/ielts/listening")} className="px-10 py-6 text-lg">
              Back to Listening Practice
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-serif font-bold text-foreground">
              {listeningTest?.title ?? "IELTS Academic Listening Test"}
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

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {currentSection && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="text-sm">
                Section {currentSection.order} of {sections.length}
              </Badge>
              <span className="text-sm text-muted-foreground">{currentSection.title}</span>
            </div>

            <Card>
              <CardContent className="pt-6">
                <SinglePlayAudio key={currentSection.order} src={currentSection.audioUrl} />
              </CardContent>
            </Card>

            <div className="space-y-4">
              {currentSection.questions.map((question: IQuestion, index: number) => (
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
                    <p className="text-foreground font-medium leading-relaxed">{question.text}</p>

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

            <div className="flex justify-center pt-4">
              {isLastSection ? (
                <Button
                  size="lg"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-10 py-6 text-lg"
                >
                  {isSubmitting ? "Submitting..." : "Submit Listening Test"}
                  <Send className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  size="lg"
                  onClick={() => setSectionIndex((prev) => prev + 1)}
                  className="px-10 py-6 text-lg"
                >
                  Next Section
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ListeningTestPage;
