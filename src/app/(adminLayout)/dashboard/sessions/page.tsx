"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { CustomPagination } from "@/components/Common/CustomPagination/CustomPagination"
import {
  CustomTable,
  TableAction,
  TableColumn,
} from "@/components/Common/CustomTable/CustomTable"
import { CustomTooltip } from "@/components/Common/CustomTooltip/CustomTooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGetAllSessionsQuery } from "@/redux/api/session/sessionApi"
import { InterviewSession, Meta, SessionType } from "@/types"
import { format } from "date-fns"
import { Eye } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

const SESSION_TYPE_DISPLAY = {
  IELTS_LISTENING: "IELTS Listening",
  IELTS_READING: "IELTS Reading",
  IELTS_SPEAKING: "IELTS Speaking",
  IELTS_WRITING: "IELTS Writing",
  MOCK_INTERVIEW_TECHNICAL: "Mock Technical Interview",
  MOCK_INTERVIEW_BEHAVIORAL: "Mock Behavioral Interview",
  MOCK_INTERVIEW_INTERPERSONAL: "Mock Interpersonal Interview",
  QUIZ: "Quiz",
}

const AllSessions = () => {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [currentLimit, setCurrentLimit] = useState(10)
  const [sessionType, setSessionType] = useState<SessionType | undefined>(undefined)
  const { data, isLoading } = useGetAllSessionsQuery({
    page: currentPage,
    limit: currentLimit,
    type: sessionType,
  })
  const sessions: InterviewSession[] = data?.data || []
  const meta: Meta = data?.meta || {}

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleLimitChange = (limit: number) => {
    setCurrentLimit(limit)
    setCurrentPage(1)
  }

  const handleViewSession = (sessionId: string) => {
    router.push(`/dashboard/sessions/${sessionId}`)
  }

  const truncateText = (text: string | null, maxLength = 30) => {
    if (!text) return "N/A"
    return text?.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text
  }

  const getScoreColor = (score: number) => {
    if (score >= 7) return "text-green-600 dark:text-green-400"
    if (score >= 5) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const calculateDuration = (startedAt: string, endedAt: string) => {
    if (!startedAt || !endedAt) return "N/A"
    const start = new Date(startedAt)
    const end = new Date(endedAt)
    const diffInMinutes = Math.floor(
      (end.getTime() - start.getTime()) / (1000 * 60)
    )

    if (diffInMinutes < 1) return "< 1m"
    if (diffInMinutes < 60) return `${diffInMinutes}m`
    const hours = Math.floor(diffInMinutes / 60)
    const minutes = diffInMinutes % 60
    return `${hours}h ${minutes}m`
  }

  const columns: TableColumn<InterviewSession>[] = [
    {
      key: "id",
      header: "Session Id",
      render: (session) => (
        <span className="font-medium">
          {session?.id || "Listening Practice"}
        </span>
      ),
    },
    {
      key: "user",
      header: "User Name",
      render: (session) => (
        <span className="font-medium">
          {session?.user?.name || "Unknown User"}
        </span>
      ),
    },
    {
      key: "score",
      header: "Score",
      render: (session) => (
        <span className={`font-semibold ${getScoreColor(session?.score)}`}>
          {session.score?.toFixed(1) ?? "N/A"}
        </span>
      ),
    },
    {
      key: "duration",
      header: "Duration",
      render: (session) => (
        <span className="text-muted-foreground">
          {calculateDuration(session?.startedAt, session?.endedAt)}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Date",
      render: (session) => (
        <span className="text-muted-foreground">
          {format(new Date(session?.startedAt), "MMM dd, yyyy")}
        </span>
      ),
    },
    {
      key: "feedback",
      header: "Feedback",
      render: (session) =>
        session.feedback ? (
          <CustomTooltip content={session?.feedback}>
            <span className="cursor-help text-muted-foreground">
              {truncateText(session?.feedback)}
            </span>
          </CustomTooltip>
        ) : (
          <span className="text-muted-foreground">N/A</span>
        ),
    },
  ]

  const actions: TableAction<InterviewSession>[] = [
    {
      label: "View Session",
      onClick: (row) => {handleViewSession(row.id)},
      icon: <Eye className="h-4 w-4" />,
      className: "hover:bg-primary/10 cursor-pointer",
    },
  ]

  return (
    <div className="p-2 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 w-full">
        <div className="flex items-center gap-4 justify-between w-full">
          <div>
            <h1 className="text-xl sm:text-3xl font-bold text-foreground mb-1 sm:mb-2">
              All Sessions
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Review all sessions participated by user
            </p>
          </div>
          <Select
            value={sessionType || "all"}
            onValueChange={(value) => setSessionType(value === "all" ? undefined : (value as SessionType))}
          >
            <SelectTrigger className="w-[140px] sm:w-[180px] h-8 sm:h-10">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {Object.keys(SESSION_TYPE_DISPLAY).map((type) => (
                <SelectItem key={type} value={type}>
                  {SESSION_TYPE_DISPLAY[type as keyof typeof SESSION_TYPE_DISPLAY]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Sessions Table */}
      <Card className="py-0 gap-0">
        <CardHeader className="pb-2 sm:pb-4">
        </CardHeader>
        <CardContent className="p-2 sm:p-4">
          <div className="space-y-4">
            <CustomTable
              columns={columns}
              data={sessions}
              actions={actions}
              loading={isLoading}
              emptyMessage="No sessions found. Create your first session to get started!"
            />

            {meta.total > 0 && (
              <CustomPagination
                meta={meta}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitChange}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AllSessions