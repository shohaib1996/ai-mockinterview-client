"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetAllWritingTasksQuery } from "@/redux/api/writingTask/writingTaskApi";
import type { IWritingTask, Meta } from "@/types";
import {
  CustomTable,
  type TableColumn,
  type TableAction,
} from "@/components/Common/CustomTable/CustomTable";
import { CustomPagination } from "@/components/Common/CustomPagination/CustomPagination";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomTooltip } from "@/components/Common/CustomTooltip/CustomTooltip";

const WritingPracticeClient = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(10);
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("task") && searchParams.get("task")!.split("-")[1]
  const taskType = searchParams.get("task") && searchParams.get("task")!.split("-")[0];
  const router = useRouter()

  const { data, isLoading } = useGetAllWritingTasksQuery({
    task: taskType,
    page: currentPage,
    limit: currentLimit,
  });

  const taskData: IWritingTask[] = data?.data || [];
  const meta: Meta = data?.meta || { page: 1, limit: 10, total: 0 };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleLimitChange = (limit: number) => {
    setCurrentLimit(limit);
    setCurrentPage(1); // Reset to first page when changing limit
  };

  const handleViewTask = (task: IWritingTask) => {
    router.push(`/dashboard/ielts/writing/practice/${task.id}-${sessionId}`);
  };


  const columns: TableColumn<IWritingTask>[] = [
    {
      key: "taskName",
      header: "Task Name",
      render: (task) => (
        <CustomTooltip content={task.promptText}>
          <span className="font-medium">{task.promptText.slice(0, 30)}...</span>
        </CustomTooltip>
      ),
    },
    {
      key: "taskType",
      header: "Task Type",
      render: (task) => <span>{task.task}</span>,
    },
    {
      key: "difficulty",
      header: "Difficulty",
      render: (task) => <span>{task.difficulty}</span>,
    }
  ];

  const actions: TableAction<IWritingTask>[] = [
    {
      label: "Go to Task",
      onClick: handleViewTask,
      icon: <Button className="cursor-pointer">Participate</Button>
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            IELTS Writing Practice - {taskType}
          </h1>
          <p className="text-muted-foreground">
            Select a task to start your practice session.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Writing Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <CustomTable
              columns={columns}
              data={taskData}
              actions={actions}
              loading={isLoading}
              emptyMessage="No writing tasks found for this category."
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
  );
};

export default WritingPracticeClient;
