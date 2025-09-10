"use client"

import { useGetSingleSessionQuery } from "@/redux/api/session/sessionApi"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Clock, FileText, Target, TrendingUp } from "lucide-react"

const WritingDetailsPage = ({ id }: { id: string }) => {
  const { data, isLoading } = useGetSingleSessionQuery(id)
  const sessionData = data?.data || {}

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  if (!sessionData.id) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Session Not Found</h2>
            <p className="text-muted-foreground">
              The writing session you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getScoreColor = (score: number) => {
    if (score >= 7) return "bg-accent text-accent-foreground"
    if (score >= 5) return "bg-secondary text-secondary-foreground"
    return "bg-destructive text-destructive-foreground"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 7) return "Excellent"
    if (score >= 5) return "Good"
    return "Needs Improvement"
  }

  const sessionDuration =
    sessionData.startedAt && sessionData.endedAt
      ? Math.round((new Date(sessionData.endedAt).getTime() - new Date(sessionData.startedAt).getTime()) / 1000 / 60)
      : 0

  return (
    <div className="container mx-auto p-6 max-w-5xl space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-balance">IELTS Writing Session Details</h1>
        <p className="text-muted-foreground">Comprehensive analysis of your writing performance and feedback</p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold">{sessionData.score}/9</div>
              <Badge className={getScoreColor(sessionData.score)}>{getScoreLabel(sessionData.score)}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Session Type</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessionData.type?.replace("_", " ") || "N/A"}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessionDuration} min</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Submissions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessionData.writingSubmissions?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Session Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Session Timeline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Started At</p>
              <p className="text-sm">{formatDate(sessionData.startedAt)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Completed At</p>
              <p className="text-sm">{formatDate(sessionData.endedAt)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overall Feedback */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Assessment Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <p className="text-sm leading-relaxed">{sessionData.feedback}</p>
          </div>
        </CardContent>
      </Card>

      {/* Writing Submissions */}
      {sessionData.writingSubmissions?.map((submission: any, index: number) => (
        <Card key={submission.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Writing Submission {index + 1}</CardTitle>
              <Badge className={getScoreColor(submission.score)}>Score: {submission.score}/9</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Submission Details */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Submitted At</p>
                <p className="text-sm">{formatDate(submission.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Task ID</p>
                <p className="text-sm font-mono">{submission.writingTaskId}</p>
              </div>
            </div>

            <Separator />

            {/* Extracted Text */}
            <div>
              <h4 className="text-sm font-semibold mb-3">Your Writing</h4>
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed font-mono">
                    {submission.extractedText}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Separator />

            {/* Detailed Feedback */}
            <div>
              <h4 className="text-sm font-semibold mb-3">Detailed Feedback</h4>
              <div className="prose prose-sm max-w-none">
                <p className="text-sm leading-relaxed">{submission.feedback}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Empty State for No Submissions */}
      {(!sessionData.writingSubmissions || sessionData.writingSubmissions?.length === 0) && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Writing Submissions</h3>
            <p className="text-muted-foreground">This session doesn&apos;t contain any writing submissions to display.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default WritingDetailsPage
