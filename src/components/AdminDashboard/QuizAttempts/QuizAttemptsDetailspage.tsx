"use client";

import { useGetSingleQuizAttemptQuery } from "@/redux/api/quiz-attempt/quizAttemptApi"
import type { IQuizAttempt } from "@/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"
import { CheckCircle, XCircle, Calendar, Trophy } from "lucide-react"

const QuizAttemptsDetailspage = ({ id }: { id: string }) => {
  const { data, isLoading, isError } = useGetSingleQuizAttemptQuery(id);
  const quiz: IQuizAttempt | undefined = data?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardHeader className="pb-8">
              <Skeleton className="h-10 w-3/4 bg-slate-200 dark:bg-slate-700" />
              <Skeleton className="h-5 w-1/4 bg-slate-200 dark:bg-slate-700" />
            </CardHeader>
            <CardContent className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <Card
                  key={i}
                  className="border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50"
                >
                  <CardHeader>
                    <Skeleton className="h-7 w-1/2 bg-slate-200 dark:bg-slate-600" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Skeleton className="h-5 w-full bg-slate-200 dark:bg-slate-600" />
                    <Skeleton className="h-5 w-3/4 bg-slate-200 dark:bg-slate-600" />
                    <Skeleton className="h-5 w-1/2 bg-slate-200 dark:bg-slate-600" />
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isError || !quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 p-6 rounded-xl border border-red-200 dark:border-red-800">
                <div className="flex items-center gap-3">
                  <XCircle className="h-6 w-6 text-red-500" />
                  <h3 className="font-semibold text-lg">Unable to Load Quiz</h3>
                </div>
                <p className="text-sm mt-3 text-red-600 dark:text-red-400">
                  We couldn&apos;t retrieve your quiz results. Please check your
                  connection and try again.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-600 dark:text-emerald-400";
    if (score >= 70) return "text-blue-600 dark:text-blue-400";
    if (score >= 50) return "text-amber-600 dark:text-amber-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90)
      return {
        variant: "default" as const,
        text: "Excellent",
        color:
          "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
      };
    if (score >= 70)
      return {
        variant: "default" as const,
        text: "Good",
        color:
          "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      };
    if (score >= 50)
      return {
        variant: "secondary" as const,
        text: "Fair",
        color:
          "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
      };
    return {
      variant: "destructive" as const,
      text: "Needs Improvement",
      color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    };
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <motion.div
        className="container mx-auto p-4 md:p-8 space-y-8"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        <motion.div variants={cardVariants}>
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardHeader className="pb-8">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <CardTitle className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                    {quiz.quizName}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Calendar className="h-4 w-4" />
                    Completed on{" "}
                    {new Date(
                      quiz.endedAt || quiz.createdAt
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </CardDescription>
                </div>
                <Trophy className="h-8 w-8 text-amber-500 dark:text-amber-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div
                      className={`text-4xl font-bold ${
                        quiz.score
                          ? getScoreColor(quiz.score)
                          : "text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {quiz.score ?? "—"}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                      Score
                    </div>
                  </div>
                  <div className="h-12 w-px bg-slate-300 dark:bg-slate-600"></div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-700 dark:text-slate-300">
                      {quiz.quizAnswers?.length}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                      Questions
                    </div>
                  </div>
                </div>
                {quiz.score && (
                  <Badge
                    className={`px-4 py-2 text-sm font-medium ${
                      getScoreBadge(quiz.score).color
                    } border-0`}
                  >
                    {getScoreBadge(quiz.score).text}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {quiz.quizAnswers.map((answer, index) => (
          <motion.div key={answer.id} variants={cardVariants}>
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm overflow-hidden">
              <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                <CardTitle className="flex items-center justify-between">
                  <span className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                    Question {index + 1}
                  </span>
                  <Badge
                    className={`px-3 py-1 text-sm font-medium border-0 ${
                      answer.isCorrect
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                    }`}
                  >
                    {answer.isCorrect ? (
                      <CheckCircle className="mr-2 h-4 w-4" />
                    ) : (
                      <XCircle className="mr-2 h-4 w-4" />
                    )}
                    {answer.isCorrect ? "Correct" : "Incorrect"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <p className="font-semibold text-lg text-slate-900 dark:text-slate-100 leading-relaxed">
                  {answer.question.text}
                </p>

                {answer.question.options && (
                  <div className="space-y-3">
                    {answer.question.options.map((option, i) => {
                      const isSelected = answer.selectedOption === option;
                      const isCorrect =
                        answer.question.correctAnswer === option;

                      let optionClass =
                        "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/30";
                      if (isSelected && isCorrect)
                        optionClass =
                          "border-emerald-300 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20";
                      if (isSelected && !isCorrect)
                        optionClass =
                          "border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20";
                      if (!isSelected && isCorrect)
                        optionClass =
                          "border-emerald-300 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20";

                      return (
                        <div
                          key={i}
                          className={`flex items-center space-x-4 p-4 rounded-lg border-2 transition-all ${optionClass}`}
                        >
                          <div className="flex-shrink-0">
                            {isSelected ? (
                              isCorrect ? (
                                <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                              ) : (
                                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                              )
                            ) : isCorrect ? (
                              <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                            ) : (
                              <div className="h-5 w-5 rounded-full border-2 border-slate-300 dark:border-slate-600" />
                            )}
                          </div>
                          <span
                            className={`text-slate-900 dark:text-slate-100 ${
                              isCorrect ? "font-semibold" : "font-medium"
                            }`}
                          >
                            {option}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        Your Answer:
                      </span>
                      <span className="ml-2 text-slate-900 dark:text-slate-100">
                        {answer.selectedOption ||
                          answer.answerText ||
                          "Not answered"}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        Correct Answer:
                      </span>
                      <span className="ml-2 text-emerald-700 dark:text-emerald-300 font-medium">
                        {answer.question.correctAnswer}
                      </span>
                    </div>
                  </div>
                </div>

                {answer.feedback?.comment && (
                  <div className="bg-blue-50 dark:bg-blue-950/30 p-5 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="font-semibold mb-3 text-blue-900 dark:text-blue-100 flex items-center gap-2">
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      Feedback
                    </h4>
                    <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                      {answer.feedback.comment}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default QuizAttemptsDetailspage;
