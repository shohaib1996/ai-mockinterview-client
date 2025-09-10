"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { InterviewSession, Meta } from "@/types";
import {
  CustomTable,
  type TableColumn,
  type TableAction,
} from "@/components/Common/CustomTable/CustomTable";
import { CustomPagination } from "@/components/Common/CustomPagination/CustomPagination";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Eye } from "lucide-react";
import {
  useCreateSessionMutation,
  useGetAllSessionsQuery,
} from "@/redux/api/session/sessionApi";
import { useAppSelector } from "@/redux/hooks/hooks";
import { CustomTooltip } from "@/components/Common/CustomTooltip/CustomTooltip";
import { format } from "date-fns";
import { toast } from "sonner";

const WritingSessions = () => {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const sessionType = "IELTS_WRITING";
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(10);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  console.log(sessionId)

  const { data, isLoading } = useGetAllSessionsQuery({
    page: currentPage,
    limit: currentLimit,
    type: sessionType,
    userId: user?.id,
  });
  const [createWritingSession, { isLoading: isCreating }] =
    useCreateSessionMutation();
  const writingData: InterviewSession[] = data?.data || [];
  const meta: Meta = data?.meta || { page: 1, limit: 10, total: 0 };

  const getScoreColor = (score: number) => {
    if (score >= 7) return "text-green-600 dark:text-green-400";
    if (score >= 5) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const calculateDuration = (startedAt: string, endedAt: string) => {
    if (!startedAt || !endedAt) return "N/A";
    const start = new Date(startedAt);
    const end = new Date(endedAt);
    const diffInMinutes = Math.floor(
      (end.getTime() - start.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "< 1m";
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  const truncateText = (text: string | null, maxLength = 50) => {
    if (!text) return "N/A";
    return text?.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleLimitChange = (limit: number) => {
    setCurrentLimit(limit);
    setCurrentPage(1);
  };

  const handleViewSession = (sessionId: string) => {
    // functionality to be added
    router.push(`/dashboard/ielts/writing/${sessionId}`);
  };

  const handleCreateSession = async () => {
    try {
      const res = await createWritingSession({ type: sessionType }).unwrap();
      setIsDialogOpen(true);
      setSessionId(res?.data?.id);
    } catch (error) {
      console.log(error)
      toast.error("Failed to create a writing session. Please try again.");
    }
  };

  const handleTaskSelection = (task: any) => {
    router.push(`/dashboard/ielts/writing/practice?task=${task}`);
  };

  const columns: TableColumn<InterviewSession>[] = [
    {
      key: "id",
      header: "Id",
      render: (session) => (
        <span className="font-medium">
          {session?.id || "Writing Practice"}
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
  ];

  const actions: TableAction<InterviewSession>[] = [
    {
      label: "View Session",
      onClick: (row) => handleViewSession(row.id),
      icon: <Eye className="h-4 w-4" />,
      className: "hover:bg-primary/10 cursor-pointer",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            IELTS Writing Practice
          </h1>
          <p className="text-muted-foreground">
            Practice and review your writing sessions
          </p>
        </div>

        <Button
          className="flex items-center gap-2"
          onClick={handleCreateSession}
          disabled={isCreating}
        >
          <Plus className="h-4 w-4" />
          {isCreating ? "Starting..." : "Start A Writing Session"}
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
              data={writingData}
              actions={actions}
              loading={isLoading}
              emptyMessage="No writing sessions found. Create your first session to get started!"
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

      {/* Task Selection Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Writing Task</DialogTitle>
            <DialogDescription>
              Choose which task you would like to practice.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <Button
              variant="outline"
              onClick={() => handleTaskSelection(`TASK1-${sessionId}`)}
            >
              Task 1
            </Button>
            <Button
              variant="outline"
              onClick={() => handleTaskSelection(`TASK2-${sessionId}`)}
            >
              Task 2
            </Button>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WritingSessions;

