"use client";

import { useGetAllReadingPassagesQuery } from "@/redux/api/reading-passage/readingPassageApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CustomTable,
  type TableColumn,
  type TableAction,
} from "@/components/Common/CustomTable/CustomTable";
import { Meta } from "@/types";
import { useState } from "react";
import { CustomPagination } from "@/components/Common/CustomPagination/CustomPagination";

const ReadingPracticeClient = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(10);
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("id");
  const { data, isLoading, isError } = useGetAllReadingPassagesQuery({
    page: currentPage,
    limit: currentLimit,
  });
  const router = useRouter();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleLimitChange = (limit: number) => {
    setCurrentLimit(limit);
    setCurrentPage(1); // Reset to first page when changing limit
  };

  const meta: Meta = data?.meta || { page: 1, limit: 10, total: 0 };

  const handleStartPractice = (passageId: string) => {
    router.push(`/dashboard/ielts/reading/practice/${sessionId}-${passageId}`);
  };

  const columns: TableColumn<any>[] = [
    {
      key: "id",
      header: "ID",
      render: (passage) => <span className="font-medium">{passage?.id}</span>,
    },
    {
      key: "title",
      header: "Title",
      render: (passage) => (
        <span className="font-medium">{passage?.title}</span>
      ),
    },
  ];

  const actions: TableAction<any>[] = [
    {
      label: "Start Practice",
      icon: <span>Start Practice</span>,
      onClick: (row) => handleStartPractice(row.id),
      className: "hover:bg-primary/10 cursor-pointer",
    },
  ];

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
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
    );
  }

  if (isError) {
    return (
      <div className="p-6 flex justify-center items-center">
        <p className="text-red-500">Failed to load reading passages.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            IELTS Reading Practice
          </h1>
          <p className="text-muted-foreground">
            Choose a passage to start your practice session.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reading Passages</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <CustomTable
            columns={columns}
            data={data?.data || []}
            actions={actions}
            loading={isLoading}
            emptyMessage="No reading passages found."
          />

          {meta.total > 0 && (
            <CustomPagination
              meta={meta}
              onPageChange={handlePageChange}
              onLimitChange={handleLimitChange}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReadingPracticeClient;
