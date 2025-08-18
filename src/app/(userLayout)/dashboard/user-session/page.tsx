"use client"

import { useState } from "react"
import { useGetAllSessionsQuery, useCreateSessionMutation } from "@/redux/api/session/sessionApi"
import type { InterviewSession, Meta, User } from "@/types"
import { CustomTable, type TableColumn, type TableAction } from "@/components/Common/CustomTable/CustomTable"
import { CustomPagination } from "@/components/Common/CustomPagination/CustomPagination"
import { CustomTooltip } from "@/components/Common/CustomTooltip/CustomTooltip"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Plus, Eye } from "lucide-react"
import { format } from "date-fns"
import { useAppSelector } from "@/redux/hooks/hooks"


const UserSession = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [currentLimit, setCurrentLimit] = useState(10)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedSessionType, setSelectedSessionType] = useState("")
  const user = useAppSelector((state) => state.auth.user)

  const { data, isLoading } = useGetAllSessionsQuery({userId:user?.id, page: currentPage, limit: currentLimit, })
  const [createSession, { isLoading: createSessionLoading }] = useCreateSessionMutation()

  const sessionData: InterviewSession[] = data?.data || []
  const meta: Meta = data?.meta || { page: 1, limit: 10, total: 0 }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleLimitChange = (limit: number) => {
    setCurrentLimit(limit)
    setCurrentPage(1) // Reset to first page when changing limit
  }

  const handleView = (session: InterviewSession) => {
    // Handle view session logic here
    console.log("Viewing session:", session)
   
  }

  const handleCreateSession = async () => {
    if (!selectedSessionType) {
     
      return
    }

    try {
      await createSession({ type: selectedSessionType }).unwrap()
    
      setIsCreateDialogOpen(false)
      setSelectedSessionType("")
    } catch (error) {
    
    }
  }

  const sessionTypes = [
    { value: "IELTS_LISTENING", label: "IELTS Listening" },
    { value: "IELTS_READING", label: "IELTS Reading" },
    { value: "IELTS_WRITING", label: "IELTS Writing" },
    { value: "IELTS_SPEAKING", label: "IELTS Speaking" },
    { value: "MOCK_INTERVIEW_TECHNICAL", label: "Technical Interview" },
    { value: "MOCK_INTERVIEW_BEHAVIORAL", label: "Behavioral Interview" },
    { value: "MOCK_INTERVIEW_INTERPERSONAL", label: "Interpersonal Interview" },
    { value: "QUIZ", label: "Quiz" },
  ]

  const truncateText = (text: string | null, maxLength = 50) => {
    if (!text) return "N/A"
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
  }

  const getSessionTypeColor = (type: string) => {
    switch (type) {
      case "IELTS_LISTENING":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "IELTS_READING":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "IELTS_WRITING":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "IELTS_SPEAKING":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "MOCK_INTERVIEW_TECHNICAL":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "MOCK_INTERVIEW_BEHAVIORAL":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "MOCK_INTERVIEW_INTERPERSONAL":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200"
      case "QUIZ":
        return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const formatSessionType = (type: string) => {
    return type
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase())
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600 dark:text-green-400"
    if (score >= 6) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const calculateDuration = (startedAt: string, endedAt: string) => {
    const start = new Date(startedAt)
    const end = new Date(endedAt)
    const diffInMinutes = Math.floor((end.getTime() - start.getTime()) / (1000 * 60))

    if (diffInMinutes < 60) return `${diffInMinutes}m`
    const hours = Math.floor(diffInMinutes / 60)
    const minutes = diffInMinutes % 60
    return `${hours}h ${minutes}m`
  }

  const columns: TableColumn<InterviewSession>[] = [
    {
      key: "type",
      header: "Session Type",
      render: (session) => (
        <Badge className={getSessionTypeColor(session.type)}>{formatSessionType(session?.type)}</Badge>
      ),
    },
    {
      key: "score",
      header: "Score",
      render: (session) => (
        <span className={`font-semibold ${getScoreColor(session.score)}`}>{session?.score?.toFixed(1)}</span>
      ),
    },
    {
      key: "duration",
      header: "Duration",
      render: (session) => (
        <span className="text-muted-foreground">{calculateDuration(session?.startedAt, session?.endedAt)}</span>
      ),
    },
    {
      key: "startedAt",
      header: "Started At",
      render: (session) => (
        <span className="text-muted-foreground">{format(new Date(session?.startedAt), "MMM dd, yyyy HH:mm")}</span>
      ),
    },
    {
      key: "feedback",
      header: "Feedback",
      render: (session) =>
        session.feedback ? (
          <CustomTooltip content={session.feedback}>
            <span className="cursor-help text-muted-foreground">{truncateText(session?.feedback)}</span>
          </CustomTooltip>
        ) : (
          <span className="text-muted-foreground">N/A</span>
        ),
    },
    {
      key: "transcript",
      header: "Transcript",
      render: (session) =>
        session.transcript ? (
          <CustomTooltip content={session.transcript}>
            <span className="cursor-help text-muted-foreground">{truncateText(session?.transcript)}</span>
          </CustomTooltip>
        ) : (
          <span className="text-muted-foreground">N/A</span>
        ),
    },
  ]

  const actions: TableAction<InterviewSession>[] = [
    {
      label: "View Session",
      onClick: handleView,
      icon: <Eye className="h-4 w-4" />,
      className: "hover:bg-primary/10",
    },
  ]

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Sessions</h1>
          <p className="text-muted-foreground">Manage and view your practice sessions</p>
        </div>

        <Button className="flex items-center gap-2" onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          Create Session
        </Button>
      </div>

      {/* Sessions Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <CustomTable
              columns={columns}
              data={sessionData}
              actions={actions}
              loading={isLoading}
              emptyMessage="No sessions found. Create your first session to get started!"
            />

            {meta.total > 0 && (
              <CustomPagination meta={meta} onPageChange={handlePageChange} onLimitChange={handleLimitChange} />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default UserSession
