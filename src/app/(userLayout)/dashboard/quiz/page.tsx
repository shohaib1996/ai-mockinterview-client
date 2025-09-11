"use client";

import { CustomPagination } from "@/components/Common/CustomPagination/CustomPagination";
import {
  CustomTable,
  TableAction,
  TableColumn,
} from "@/components/Common/CustomTable/CustomTable";
import { CustomTooltip } from "@/components/Common/CustomTooltip/CustomTooltip";
import { Button } from "@/components/ui/button";
import { useGetAllQuizAttemptsQuery } from "@/redux/api/quiz-attempt/quizAttemptApi";
// Assuming this is the path to your generate questions API hook
import { useAppSelector } from "@/redux/hooks/hooks";
import { IQuizAttempt, Meta } from "@/types";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Eye, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import QuizCreationDialog from "@/components/UserDashboard/Quiz/QuizCreatingDialog";

const Quiz = () => {
  const user = useAppSelector((state) => state.auth.user);
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(10);
  const { data, isLoading } = useGetAllQuizAttemptsQuery({
    userId: user?.id,
    page: currentPage,
    limit: currentLimit,
  });
  const quizAttempts: IQuizAttempt[] = data?.data || [];
  const meta: Meta = data?.meta || {};
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleLimitChange = (limit: number) => {
    setCurrentLimit(limit);
    setCurrentPage(1);
  };
  const truncateText = (text: string | null, maxLength = 50) => {
    if (!text) return "N/A";
    return text?.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  const calculateQuizDuration = (startedAt: string, endedAt: string | null) => {
    if (!startedAt || !endedAt) return "N/A";
    const start = new Date(startedAt);
    const end = new Date(endedAt);
    const durationMs = end.getTime() - start.getTime();
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const getQuizScoreColor = (score: number | null | undefined) => {
    if (score == null) return "text-gray-600";
    if (score >= 80) return "text-green-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };
  const handleViewSession = (id: string) => {
    router.push(`/dashboard/quiz/${id}`);
  };
  const columns: TableColumn<IQuizAttempt>[] = [
    {
      key: "id",
      header: "ID",
      render: (quizAttempt) => (
        <span className="font-medium">{quizAttempt?.id || "N/A"}</span>
      ),
    },
    {
      key: "quizName",
      header: "Quiz Name",
      render: (quizAttempt) => <span>{quizAttempt?.quizName || "N/A"}</span>,
    },
    {
      key: "startedAt",
      header: "Started At",
      render: (quizAttempt) => (
        <span>{new Date(quizAttempt?.startedAt).toLocaleString()}</span>
      ),
    },
    {
      key: "duration",
      header: "Duration",
      render: (quizAttempt) => (
        <span>
          {calculateQuizDuration(quizAttempt?.startedAt, quizAttempt?.endedAt)}
        </span>
      ),
    },
    {
      key: "score",
      header: "Score",
      render: (quizAttempt) => (
        <span className={getQuizScoreColor(quizAttempt?.score)}>
          {quizAttempt.score !== null ? `${quizAttempt?.score}%` : "N/A"}
        </span>
      ),
    },
    {
      key: "feedback",
      header: "Feedback",
      render: (quizAttempt) =>
        quizAttempt.feedback ? (
          <CustomTooltip content={quizAttempt.feedback}>
            <span className="cursor-help text-muted-foreground">
              {truncateText(quizAttempt.feedback)}
            </span>
          </CustomTooltip>
        ) : (
          <span className="text-muted-foreground">N/A</span>
        ),
    },
  ];

  const actions: TableAction<IQuizAttempt>[] = [
    {
      label: "View Session",
      onClick: (row: IQuizAttempt) => handleViewSession(row.id),
      icon: <Eye className="h-4 w-4" />,
      className: "hover:bg-primary/10 cursor-pointer",
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Quiz Attempts</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="px-4 py-2 ">
              <Plus className="h-4 w-4" />
              Start a Quiz
            </Button>
          </DialogTrigger>
          <QuizCreationDialog onClose={() => setIsDialogOpen(false)} />
        </Dialog>
      </div>
      <div className="bg-card rounded-2xl">
        <CustomTable
          columns={columns}
          actions={actions}
          data={quizAttempts}
          loading={isLoading}
        />
        <div className="mt-3 px-4 pb-2">
          {meta.total > 0 && (
            <CustomPagination
              meta={meta}
              onPageChange={handlePageChange}
              onLimitChange={handleLimitChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
