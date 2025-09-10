"use client"

import { useGetAllAnswersQuery } from "@/redux/api/answer/answerApi"
import { useGetAllQuestionsQuery } from "@/redux/api/question/questionApi"
import { useGetSingleSessionQuery } from "@/redux/api/session/sessionApi"
import type { IQuestion, ISinglesSession, IUserListeningHistory, ListeningAnswer } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, Clock, Target, TrendingUp, RotateCcw } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"

const ListeningDetailsPage = ({ id }: { id: string }) => {
  const { data, isLoading } = useGetSingleSessionQuery(id)
  const { data: answerdata, isLoading: isAnswerLoading } = useGetAllAnswersQuery({ sessionId: id })
  const listeningAudioId = data?.data?.userCompletionHistory?.find(
    (history: IUserListeningHistory) => history.sessionId === id,
  )?.listeningAudioId

  const { data: question, isLoading: isQuestionLoading } = useGetAllQuestionsQuery({ listeningAudioId }, { skip: !listeningAudioId })

  const answers: ListeningAnswer[] = answerdata?.data || []
  const questions: IQuestion[] = question?.data || []
  const sessionInfo: ISinglesSession = data?.data || {}

  if (isLoading || isAnswerLoading || isQuestionLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading your results...</p>
        </div>
      </div>
    )
  }

  const totalQuestions = questions?.length
  const correctAnswers = answers.filter((answer) => answer.isCorrect)?.length
  const scorePercentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0
  const completedAt = sessionInfo.endedAt ? format(new Date(sessionInfo.endedAt), "PPP p") : "N/A"

  const getPerformanceMessage = (percentage: number) => {
    if (percentage >= 80) return { message: "Excellent work! You're ready for the test!", color: "text-green-600" }
    if (percentage >= 60) return { message: "Good job! Keep practicing to improve further.", color: "text-blue-600" }
    if (percentage >= 40)
      return { message: "You're making progress! Focus on areas that need improvement.", color: "text-yellow-600" }
    return { message: "Keep practicing! Every attempt makes you stronger.", color: "text-orange-600" }
  }

  const performanceMessage = getPerformanceMessage(scorePercentage)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "EASY":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "HARD":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold font-serif text-foreground mb-2">Listening Practice Results</h1>
          <p className="text-lg text-muted-foreground">Your Performance Overview</p>
        </div>

        {/* Performance Summary */}
        <Card className="mb-8 bg-gradient-to-r from-card to-popover border-2">
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl font-serif">
              <Target className="h-6 w-6 text-primary" />
              Overall Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-6xl font-bold text-primary mb-2">{scorePercentage}%</div>
              <div className="text-lg text-card-foreground mb-4">
                {correctAnswers} out of {totalQuestions} questions correct
              </div>
              <Progress value={scorePercentage} className="w-full max-w-md mx-auto h-3" />
            </div>

            <div className={`text-center text-lg font-medium ${performanceMessage.color}`}>
              {performanceMessage.message}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="text-center p-4 bg-muted rounded-lg">
                <Clock className="h-6 w-6 text-primary mx-auto mb-2" />
                <div className="text-sm text-muted-foreground">Completed</div>
                <div className="font-semibold">{completedAt}</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <TrendingUp className="h-6 w-6 text-primary mx-auto mb-2" />
                <div className="text-sm text-muted-foreground">Score</div>
                <div className="font-semibold">{sessionInfo.score?.toFixed(1) || "N/A"}</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <Target className="h-6 w-6 text-primary mx-auto mb-2" />
                <div className="text-sm text-muted-foreground">Session Type</div>
                <div className="font-semibold">{sessionInfo.type?.replace("_", " ") || "N/A"}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feedback Section */}
        {sessionInfo.feedback && (
          <Card className="mb-8 bg-popover">
            <CardHeader>
              <CardTitle className="text-xl font-serif text-popover-foreground">Personalized Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-popover-foreground leading-relaxed">{sessionInfo.feedback}</p>
            </CardContent>
          </Card>
        )}

        {/* Question Review Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-serif text-foreground">Question Review</CardTitle>
            <p className="text-muted-foreground">Review your answers and see the correct solutions</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {questions.map((question, index) => {
              const userAnswer = answers.find((answer) => answer.questionId === question.id)
              const isCorrect = userAnswer?.isCorrect || false

              return (
                <div key={question.id} className="border border-border rounded-lg p-6 bg-card">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-semibold">
                        {index + 1}
                      </div>
                      <Badge className={getDifficultyColor(question.difficulty)}>{question.difficulty}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      {isCorrect ? (
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      ) : (
                        <XCircle className="h-6 w-6 text-red-600" />
                      )}
                      <span className={`font-semibold ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                        {isCorrect ? "Correct" : "Incorrect"}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-card-foreground mb-3">{question.text}</h3>

                    {question.options && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                        {question.options.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className={`p-3 rounded-lg border ${
                              option === question.correctAnswer
                                ? "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200"
                                : option === userAnswer?.answerText
                                  ? isCorrect
                                    ? "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200"
                                    : "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200"
                                  : "bg-muted border-border text-muted-foreground"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{String.fromCharCode(65 + optionIndex)}.</span>
                              <span>{option}</span>
                              {option === question.correctAnswer && (
                                <CheckCircle className="h-4 w-4 text-green-600 ml-auto" />
                              )}
                              {option === userAnswer?.answerText && option !== question.correctAnswer && (
                                <XCircle className="h-4 w-4 text-red-600 ml-auto" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-muted-foreground">Your Answer:</span>
                      <span className={`font-semibold ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                        {userAnswer?.answerText || "No answer provided"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-muted-foreground">Correct Answer:</span>
                      <span className="font-semibold text-green-600">{question.correctAnswer}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-muted-foreground">Score:</span>
                      <span className="font-semibold">{userAnswer?.score?.toFixed(1) || "0.0"} points</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center">
          <Link href="/dashboard/ielts/listening">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3">
              <RotateCcw className="h-5 w-5 mr-2" />
              Continue Practicing
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ListeningDetailsPage
