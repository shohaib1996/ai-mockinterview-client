"use client"

import { useState } from "react"
import {
  useGetAllSessionsQuery,
  useCreateSessionMutation,
} from "@/redux/api/session/sessionApi"
import type { InterviewSession, Meta } from "@/types"
import {
  CustomTable,
  type TableColumn,
  type TableAction,
} from "@/components/Common/CustomTable/CustomTable"
import { CustomPagination } from "@/components/Common/CustomPagination/CustomPagination"
import { CustomTooltip } from "@/components/Common/CustomTooltip/CustomTooltip"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, Eye } from "lucide-react"
import { format, addMinutes } from "date-fns"
import { useAppSelector } from "@/redux/hooks/hooks"
import {
  CustomFormDialog,
  type FormFieldConfig,
} from "@/components/Common/CustomDialog/CustomFormDialog"
import * as z from "zod"
import { SpeakingPracticeModal } from "@/components/UserDashboard/SpeakingPracticeModal"

const SpeakingSessions = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [currentLimit, setCurrentLimit] = useState(10)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeSession, setActiveSession] = useState<InterviewSession | null>(null)
  const user = useAppSelector((state) => state.auth.user)
  const sessionType = "IELTS_SPEAKING"

  const { data, isLoading, refetch } = useGetAllSessionsQuery({
    userId: user?.id,
    type: sessionType,
    page: currentPage,
    limit: currentLimit,
  })

  const [createSpeakingSession, { isLoading: isCreating }] = useCreateSessionMutation()

  const speakingData: InterviewSession[] = data?.data || []
  const meta: Meta = data?.meta || { page: 1, limit: 10, total: 0 }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleLimitChange = (limit: number) => {
    setCurrentLimit(limit)
    setCurrentPage(1) // Reset to first page when changing limit
  }

  const handleView = (session: InterviewSession) => {
    setActiveSession(session)
  }

  const handleCreateSession = async (formData: { duration: string }) => {
    const now = new Date()
    const endedAt = addMinutes(now, parseInt(formData.duration, 10))

    try {
      const res = await createSpeakingSession({ type: sessionType, endedAt: endedAt.toISOString() }).unwrap()
      setIsDialogOpen(false)
      refetch()
      setActiveSession(res.data)
    } catch (error) {
      console.error("Failed to create session:", error)
    }
  }

  const truncateText = (text: string | null, maxLength = 50) => {
    if (!text) return "N/A"
    return text?.length > maxLength ? `${text.substring(0, maxLength)}...` : text
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
      header: "Id",
      render: (session) => (
        <span className="font-medium">{session?.id || "Speaking Practice"}</span>
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
      onClick: handleView,
      icon: <Eye className="h-4 w-4" />,
      className: "hover:bg-primary/10",
    },
  ]

  const dialogFields: FormFieldConfig[] = [
    {
      name: "duration",
      label: "Session Duration",
      type: "select",
      options: [
        { value: "5", label: "5 minutes" },
        { value: "10", label: "10 minutes" },
        { value: "15", label: "15 minutes" },
        { value: "20", label: "20 minutes" },
        { value: "25", label: "25 minutes" },
        { value: "30", label: "30 minutes" },
      ],
      validation: z.string(),
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
          <Skeleton className="h-10 w-44" />
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
          <h1 className="text-3xl font-bold text-foreground mb-2">
            IELTS Speaking Practice
          </h1>
          <p className="text-muted-foreground">
            Practice and review your speaking sessions
          </p>
        </div>

        <Button
          className="flex items-center gap-2"
          onClick={() => setIsDialogOpen(true)}
          disabled={isCreating}
        >
          <Plus className="h-4 w-4" />
          {isCreating ? "Creating..." : "Create Speaking Session"}
        </Button>
      </div>

      {/* Sessions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Your Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <CustomTable
              columns={columns}
              data={speakingData}
              actions={actions}
              loading={isLoading}
              emptyMessage="No speaking sessions found. Create your first session to get started!"
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

      {/* Create Session Dialog */}
      <CustomFormDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="Create New Speaking Session"
        fields={dialogFields}
        onSubmit={handleCreateSession}
        defaultValues={{ duration: "10" }}
      />

      {activeSession && (
        <SpeakingPracticeModal
          session={activeSession}
          onClose={() => setActiveSession(null)}
        />
      )}
    </div>
  )
}

export default SpeakingSessions
