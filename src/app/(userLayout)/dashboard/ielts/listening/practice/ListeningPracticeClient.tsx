"use client";

import { useState } from "react";
import { useGetAllListeningAudiosQuery } from "@/redux/api/listening-audio/listeningAudioApi";
import type { IListeningAudio, Meta } from "@/types";
import {
  CustomTable,
  type TableColumn,
  type TableAction,
} from "@/components/Common/CustomTable/CustomTable";
import { CustomPagination } from "@/components/Common/CustomPagination/CustomPagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter, useSearchParams } from "next/navigation";

const ListeningPracticeClient = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(10);
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("id");

  const { data, isLoading } = useGetAllListeningAudiosQuery({
    page: currentPage,
    limit: currentLimit,
  });

  const listeningAudios: IListeningAudio[] = data?.data || [];
  const meta: Meta = data?.meta || { page: 1, limit: 10, total: 0 };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleLimitChange = (limit: number) => {
    setCurrentLimit(limit);
    setCurrentPage(1); // Reset to first page when changing limit
  };

  const handleView = (audio: IListeningAudio) => {
    // View functionality not implemented yet
    router.push(`/dashboard/ielts/listening/practice/${sessionId}-${audio.id}`);
  };

  const columns: TableColumn<IListeningAudio>[] = [
    {
      key: "id",
      header: "ID",
      render: (audio) => <span className="font-medium">{audio.id}</span>,
    },
    {
      key: "title",
      header: "Title",
      render: (audio) => <span className="text-foreground">{audio.title}</span>,
    },
  ];

  const actions: TableAction<IListeningAudio>[] = [
    {
      label: "View Audio",
      onClick: handleView,
      icon: <span>Listen Audio</span>,
      className: "hover:bg-primary/10",
    },
  ];

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
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
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Listening Practice
          </h1>
          <p className="text-muted-foreground">
            Practice your listening skills with audio exercises
          </p>
        </div>
      </div>

      {/* Listening Audios Table */}
      <Card>
        <CardHeader>
          <CardTitle>Available Audio Exercises</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <CustomTable
              columns={columns}
              data={listeningAudios}
              actions={actions}
              loading={isLoading}
              emptyMessage="No listening audios found. Check back later for new exercises!"
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

export default ListeningPracticeClient;
