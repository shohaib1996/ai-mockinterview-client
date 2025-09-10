"use client"

import { useState } from "react"
import { useGetAllQuestionsQuery } from "@/redux/api/question/questionApi"
import { useUpdateQuizAttemptMutation } from "@/redux/api/quiz-attempt/quizAttemptApi"
import type { IQuestion } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, Trophy, Star, Clock, ArrowRight, ArrowLeft } from "lucide-react"
import { useCreateQuizAnswerMutation } from "@/redux/api/quiz-answer/quizAnswerApi"
import { toast } from "sonner"

interface QuizAnswer {
  quizAttemptId: string
  questionId: string
  selectedOption: string
  answerText: string
  isCorrect: boolean
  score: number
  feedback: {
    comment: string
  }
}

const QuizDetailsPage = ({ id }: { id: string }) => {
  const { data, error, isLoading } = useGetAllQuestionsQuery({ quizAttemptId: id })
  const [submitAnswers, { isLoading: isSubmitting }] = useCreateQuizAnswerMutation()
  const [updateQuiz, { isLoading: isUpdating }] = useUpdateQuizAttemptMutation()

  const quizQuestions: IQuestion[] = data?.data || []

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({})
  const [isQuizCompleted, setIsQuizCompleted] = useState(false)
  console.log(isQuizCompleted)
  const [quizResults, setQuizResults] = useState<QuizAnswer[]>([])
  const [totalScore, setTotalScore] = useState(0)
  const [showResults, setShowResults] = useState(false)

  const currentQuestion = quizQuestions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / quizQuestions?.length) * 100

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }))
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions?.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  const handleSubmitQuiz = async () => {
    try {
      // Prepare answers for submission
      const answersToSubmit = quizQuestions.map((question) => ({
        quizAttemptId: id,
        questionId: question.id,
        selectedOption: selectedAnswers[question.id] || "",
        answerText: "",
        isCorrect: selectedAnswers[question.id] === question.correctAnswer,
        score: selectedAnswers[question.id] === question.correctAnswer ? 1.0 : 0.0,
        feedback: {
          comment:
            selectedAnswers[question.id] === question.correctAnswer
              ? "Correct answer!"
              : `Incorrect. The correct answer is: ${question.correctAnswer}`,
        },
      }))

      // Submit answers
      const response = await submitAnswers(answersToSubmit).unwrap()
      if(response.success) {
        toast.success("Quiz submitted successfully!")
      }

      // Calculate total score
      const score = answersToSubmit.reduce((total, answer) => total + answer.score, 0)
      const percentage = (score / quizQuestions?.length) * 100

      // Update quiz attempt
      await updateQuiz({
        id,
        score: percentage,
        feedback: getScoreFeedback(percentage),
        endedAt: new Date().toISOString(),
      }).unwrap()

      setQuizResults(answersToSubmit)
      setTotalScore(percentage)
      setIsQuizCompleted(true)
      setShowResults(true)
    } catch (error) {
      console.error("Error submitting quiz:", error)
    }
  }

  const getScoreFeedback = (score: number) => {
    if (score >= 80) return "Excellent! Outstanding performance!"
    if (score >= 50) return "Good job! Well done!"
    return "Keep practicing! You'll improve with time."
  }

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <Trophy className="h-8 w-8 text-green-600 dark:text-green-400" />
    if (score >= 50) return <Star className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
    return <Clock className="h-8 w-8 text-red-600 dark:text-red-400" />
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading quiz questions...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || quizQuestions?.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Quiz Not Found</h2>
            <p className="text-gray-600 dark:text-gray-300">Unable to load quiz questions.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (showResults) {
    return (
      <div className="min-h-screens bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Results Header */}
          <Card className="mb-8 border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="mb-6">{getScoreIcon(totalScore)}</div>
              <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Quiz Completed!
              </h1>
              <div className="text-6xl font-bold mb-2 ${getScoreColor(totalScore)}">{Math.round(totalScore)}%</div>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">{getScoreFeedback(totalScore)}</p>
              <div className="flex justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                <span>Correct: {quizResults.filter((r) => r.isCorrect)?.length}</span>
                <span>•</span>
                <span>Total: {quizResults?.length}</span>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Results */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">Question Review</h2>
            {quizResults.map((result, index) => {
              const question = quizQuestions.find((q) => q.id === result.questionId)
              return (
                <Card
                  key={result.questionId}
                  className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        {result.isCorrect ? (
                          <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                        ) : (
                          <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="outline" className="text-xs">
                            Question {index + 1}
                          </Badge>
                          <Badge variant={result.isCorrect ? "default" : "destructive"} className="text-xs">
                            {result.isCorrect ? "Correct" : "Incorrect"}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">{question?.text}</h3>
                        <div className="space-y-2 mb-3">
                          <p className="text-sm">
                            <span className="font-medium text-gray-600 dark:text-gray-400">Your answer:</span>{" "}
                            <span
                              className={
                                result.isCorrect
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-red-600 dark:text-red-400"
                              }
                            >
                              {result.selectedOption}
                            </span>
                          </p>
                          {!result.isCorrect && (
                            <p className="text-sm">
                              <span className="font-medium text-gray-600 dark:text-gray-400">Correct answer:</span>{" "}
                              <span className="text-green-600 dark:text-green-400">{question?.correctAnswer}</span>
                            </p>
                          )}
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                          <p className="text-sm text-gray-600 dark:text-gray-300">{result.feedback.comment}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Card className="mb-8 border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Quiz in Progress
              </CardTitle>
              <Badge variant="outline" className="text-sm">
                {currentQuestionIndex + 1} of {quizQuestions?.length}
              </Badge>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardHeader>
        </Card>

        {/* Question Card */}
        <Card className="mb-8 border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="secondary" className="text-sm">
                {currentQuestion?.difficulty}
              </Badge>
              <Badge variant="outline" className="text-sm">
                {currentQuestion?.type}
              </Badge>
            </div>
            <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-200 leading-relaxed">
              {currentQuestion?.text}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentQuestion?.options?.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(currentQuestion.id, option)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                    selectedAnswers[currentQuestion.id] === option
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                      : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        selectedAnswers[currentQuestion.id] === option
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300 dark:border-gray-500"
                      }`}
                    >
                      {selectedAnswers[currentQuestion.id] === option && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <span className="text-gray-800 dark:text-gray-200">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className="flex items-center gap-2 bg-transparent"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>

              <div className="text-sm text-gray-500 dark:text-gray-400">
                {Object.keys(selectedAnswers)?.length} of {quizQuestions?.length} answered
              </div>

              {currentQuestionIndex === quizQuestions?.length - 1 ? (
                <Button
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(selectedAnswers)?.length !== quizQuestions?.length || isSubmitting || isUpdating}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white flex items-center gap-2"
                >
                  {isSubmitting || isUpdating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Quiz
                      <CheckCircle className="h-4 w-4" />
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleNextQuestion}
                  disabled={!selectedAnswers[currentQuestion?.id]}
                  className="flex items-center gap-2"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default QuizDetailsPage
