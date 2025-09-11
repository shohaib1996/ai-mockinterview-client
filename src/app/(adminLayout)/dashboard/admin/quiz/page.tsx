"use client";

import { CustomPagination } from "@/components/Common/CustomPagination/CustomPagination";
import {
  CustomTable,
  TableAction,
  TableColumn,
} from "@/components/Common/CustomTable/CustomTable";
import { CustomTooltip } from "@/components/Common/CustomTooltip/CustomTooltip";
import { useGetAllQuizAttemptsQuery } from "@/redux/api/quiz-attempt/quizAttemptApi";
import { IQuizAttempt, Meta } from "@/types";
import { Eye, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDebounced } from "@/redux/hooks/hooks";

const QuizLession = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Use the useDebounced hook for debouncing the search input
  const debouncedUserId = useDebounced({ searchQuery: searchTerm, delay: 500 });

  const { data, isLoading } = useGetAllQuizAttemptsQuery({
    page: currentPage,
    limit: currentLimit,
    userId: debouncedUserId || undefined, // Pass debounced userId only if it exists
  });

  const quizAttempts: IQuizAttempt[] = data?.data || [];
  const meta: Meta = data?.meta || {};

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleLimitChange = (limit: number) => {
    setCurrentLimit(limit);
    setCurrentPage(1);
  };

  const truncateText = (text: string | null, maxLength = 50) => {
    if (!text) return "N/A";
    return text.length > maxLength
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
    router.push(`/dashboard/admin/quiz/${id}`);
  };

  const columns: TableColumn<IQuizAttempt>[] = [
    {
      key: "id",
      header: "Quiz ID",
      render: (quizAttempt) => (
        <span className="font-medium">{quizAttempt?.id || "N/A"}</span>
      ),
    },
    {
      key: "name",
      header: "User Name",
      render: (quizAttempt) =>
        quizAttempt.user ? (
          <CustomTooltip content={quizAttempt?.user?.name}>
            <span className="cursor-help text-muted-foreground">
              {truncateText(quizAttempt.user?.name, 15)}
            </span>
          </CustomTooltip>
        ) : (
          <span className="text-muted-foreground">N/A</span>
        ),
    },
    {
      key: "quizName",
      header: "Quiz Name",
      render: (quizAttempt) =>
        quizAttempt.quizName ? (
          <CustomTooltip content={quizAttempt.quizName}>
            <span className="cursor-help text-muted-foreground">
              {truncateText(quizAttempt.quizName, 20)}
            </span>
          </CustomTooltip>
        ) : (
          <span className="text-muted-foreground">N/A</span>
        ),
    },
    {
      key: "userId",
      header: "User Id",
      render: (quizAttempt) => <span>{quizAttempt?.userId}</span>,
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
    <Card className="mx-auto max-w-7xl shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Quiz Attempts</CardTitle>
        <p className="text-muted-foreground">
          See quiz attempts and analyze from here
        </p>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by User ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setSearchTerm("")}
            disabled={!searchTerm}
          >
            Clear
          </Button>
        </div>
        <CustomTable
          columns={columns}
          actions={actions}
          data={quizAttempts}
          loading={isLoading}
        />
        <div className="mt-4">
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
  );
};

export default QuizLession;