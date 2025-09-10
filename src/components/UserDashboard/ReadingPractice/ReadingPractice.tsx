"use client";

import { useState, useEffect } from "react";
import { useCreateAnswerMutation } from "@/redux/api/answer/answerApi";
import { useUpdateSessionMutation } from "@/redux/api/session/sessionApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, ChevronLeft, ChevronRight, Send, Check, X } from "lucide-react";
import { useGetSingleReadingPassageQuery } from "@/redux/api/reading-passage/readingPassageApi";
import { useGetAllQuestionsQuery } from "@/redux/api/question/questionApi";
import { IQuestion } from "@/types";

interface ReadingPracticeProps {
  passageId: string;
  sessionId: string;
}

const ReadingPractice = ({ passageId, sessionId }: ReadingPracticeProps) => {
  const { data, isLoading } = useGetSingleReadingPassageQuery(passageId);
  const { data: questionData } = useGetAllQuestionsQuery({
    readingPassageId: passageId,
  });
  const [submitAnswers, { isLoading: isSubmitting }] =
    useCreateAnswerMutation();
  const [updateSession, { isLoading: isUpdating }] = useUpdateSessionMutation();

  const [timer, setTimer] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsPerPage] = useState(5);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState("");

  const questions: IQuestion[] = questionData?.data || [];
  const totalPages = Math.ceil(questions?.length / questionsPerPage);
  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  const currentQuestions = questions.slice(startIndex, endIndex);

  useEffect(() => {
    if (isSubmitted) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isSubmitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "HIGH":
        return "bg-red-500 hover:bg-red-600 text-white";
      case "MEDIUM":
        return "bg-yellow-500 hover:bg-yellow-600 text-white";
      default:
        return "bg-green-500 hover:bg-green-600 text-white";
    }
  };

  const handleSubmit = async () => {
    try {
      const submissionData = questions.map((question) => {
        const userAnswer = selectedAnswers[question.id] || "";
        const isCorrect = userAnswer === question.correctAnswer;

        return {
          sessionId,
          questionId: question.id,
          answerText: userAnswer,
          isCorrect,
          score: isCorrect ? 0.9 : 0.0,
        };
      });

      await submitAnswers(submissionData).unwrap();

      const totalScore = submissionData.reduce(
        (sum, answer) => sum + answer.score,
        0
      );
      const feedback =
        totalScore >= 5 ? "Well done" : "You need to improve a lot";

      await updateSession({
        id: sessionId,
        score: totalScore,
        feedback: feedback,
        endedAt: new Date().toISOString(),
      }).unwrap();

      setIsSubmitted(true);
      setSubmissionMessage(
        `Answers submitted successfully! Score: ${totalScore.toFixed(
          1
        )}/9 - ${feedback}`
      );
    } catch (error) {
      console.error("Submission failed:", error);
      setSubmissionMessage("Failed to submit answers. Please try again.");
    }
  };

  const allQuestionsAnswered =
    questions?.length > 0 && questions.every((q) => selectedAnswers[q.id]);
  const answeredCount = Object.keys(selectedAnswers)?.length;
  const totalQuestions = questions?.length;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex flex-col lg:flex-row justify-between items-center space-y-2">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-serif font-bold text-foreground">
              IELTS Reading Practice
            </h1>
            <div className="hidden md:block lg:block">
              {data?.data?.title && (
                <Badge variant="secondary" className="text-sm">
                  {data.data.title}
                </Badge>
              )}
            </div>
          </div>
          <div className="block md:hidden lg:hidden">
            {data?.data?.title && (
              <Badge variant="secondary" className="text-sm">
                {data.data.title}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-lg">
              <Clock className="w-4 h-4 text-primary" />
              <span className="font-mono text-lg font-semibold text-foreground">
                {formatTime(timer)}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-muted-foreground">
              Loading passage...
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-xl">
                  {data?.data?.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>{data?.data?.content}</p>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-serif font-bold text-foreground mb-2">
                  Practice Questions
                </h2>
                <p className="text-muted-foreground">
                  Showing {startIndex + 1}-
                  {Math.min(endIndex, questions?.length)} of {questions?.length}{" "}
                  questions
                </p>
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mb-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>

                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageClick(page)}
                          className="w-10"
                        >
                          {page}
                        </Button>
                      )
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}

              <div className="grid gap-6">
                {currentQuestions.map((question, index) => (
                  <Card
                    key={question.id}
                    className="transition-all hover:shadow-md"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-serif">
                          Question {startIndex + index + 1}
                        </CardTitle>
                        <Badge
                          className={getDifficultyColor(question.difficulty)}
                        >
                          {question.difficulty}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-foreground font-medium leading-relaxed">
                        {question.text}
                      </p>

                      <div className="grid gap-2">
                        {question.options &&
                          question.options.map((option, optionIndex) => (
                            <Button
                              key={optionIndex}
                              variant={
                                selectedAnswers[question.id] === option
                                  ? "default"
                                  : "outline"
                              }
                              className="justify-start text-left h-auto py-3 px-4"
                              onClick={() =>
                                handleAnswerSelect(question.id, option)
                              }
                            >
                              <span className="font-medium mr-3">
                                {String.fromCharCode(65 + optionIndex)}.
                              </span>
                              {option}
                            </Button>
                          ))}
                      </div>

                      {selectedAnswers[question.id] && (
                        <div className="mt-4 space-y-2">
                          <div className="p-3 bg-muted rounded-lg">
                            <p className="text-sm text-muted-foreground">
                              Your answer:{" "}
                              <span className="font-medium text-foreground">
                                {selectedAnswers[question.id]}
                              </span>
                            </p>
                          </div>

                          {isSubmitted && (
                            <div
                              className={`p-3 rounded-lg border-2 ${
                                selectedAnswers[question.id] ===
                                question.correctAnswer
                                  ? "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800"
                                  : "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800"
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                {selectedAnswers[question.id] ===
                                question.correctAnswer ? (
                                  <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                                ) : (
                                  <X className="w-4 h-4 text-red-600 dark:text-red-400" />
                                )}
                                <span
                                  className={`text-sm font-medium ${
                                    selectedAnswers[question.id] ===
                                    question.correctAnswer
                                      ? "text-green-800 dark:text-green-200"
                                      : "text-red-800 dark:text-red-200"
                                  }`}
                                >
                                  {selectedAnswers[question.id] ===
                                  question.correctAnswer
                                    ? "Correct!"
                                    : "Incorrect"}
                                </span>
                              </div>
                              <p
                                className={`text-sm ${
                                  selectedAnswers[question.id] ===
                                  question.correctAnswer
                                    ? "text-green-700 dark:text-green-300"
                                    : "text-red-700 dark:text-red-300"
                                }`}
                              >
                                Correct answer:{" "}
                                <span className="font-medium">
                                  {question.correctAnswer}
                                </span>
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>

                  <span className="text-sm text-muted-foreground px-4">
                    Page {currentPage} of {totalPages}
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {!isSubmitted && (
                <div className="flex flex-col items-center mt-8 space-y-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      Progress: {answeredCount}/{totalQuestions} questions
                      answered
                    </p>
                    {!allQuestionsAnswered && (
                      <p className="text-xs text-amber-600 dark:text-amber-400">
                        Please answer all questions to enable submit button
                      </p>
                    )}
                  </div>

                  <Button
                    size="lg"
                    onClick={handleSubmit}
                    disabled={
                      !allQuestionsAnswered || isSubmitting || isUpdating
                    }
                    className="shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {isSubmitting || isUpdating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Answers
                        <Send className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              )}

              {submissionMessage && (
                <div
                  className={`text-center mt-4 p-4 rounded-lg ${
                    isSubmitted
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  }`}
                >
                  {submissionMessage}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ReadingPractice;
