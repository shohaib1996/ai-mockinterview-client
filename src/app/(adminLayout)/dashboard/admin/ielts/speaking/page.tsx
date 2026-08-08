"use client";

import { useState } from "react";
import { EyeIcon, PenBoxIcon, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  useGetAllSpeakingTestBankQuery,
  useCreateSpeakingTestBankMutation,
  useUpdateSpeakingTestBankMutation,
  useDeleteSpeakingTestBankMutation,
} from "@/redux/api/speaking-test-bank/speakingTestBankApi";
import { ISpeakingTestBank, Meta } from "@/types";
import { CustomPagination } from "@/components/Common/CustomPagination/CustomPagination";
import { CustomTable, TableAction, TableColumn } from "@/components/Common/CustomTable/CustomTable";
import { CustomTooltip } from "@/components/Common/CustomTooltip/CustomTooltip";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DeleteConfirmationDialog } from "@/components/Common/DeleteConfirmationDialog/DeleteConfirmationDialog";
import {
  CreateSpeakingTestDialog,
  ISpeakingTestBankPayload,
} from "@/components/AdminDashboard/Speaking/CreateSpeakingTestDialog";

const SpeakingLesson = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(10);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<ISpeakingTestBank | null>(null);

  const { data, isLoading } = useGetAllSpeakingTestBankQuery({
    page: currentPage,
    limit: currentLimit,
  });
  const [createSpeakingTest, { isLoading: isCreating }] = useCreateSpeakingTestBankMutation();
  const [updateSpeakingTest, { isLoading: isUpdating }] = useUpdateSpeakingTestBankMutation();
  const [deleteSpeakingTest, { isLoading: isDeleting }] = useDeleteSpeakingTestBankMutation();

  const speakingTests: ISpeakingTestBank[] = data?.data || [];
  const meta: Meta = data?.meta || { page: 1, limit: 10, total: 0 };

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleLimitChange = (limit: number) => {
    setCurrentLimit(limit);
    setCurrentPage(1);
  };

  const handleCreate = () => setIsCreateModalOpen(true);

  const handleView = (test: ISpeakingTestBank) => {
    setSelectedTest(test);
    setIsViewModalOpen(true);
  };

  const handleEdit = (test: ISpeakingTestBank) => {
    setSelectedTest(test);
    setIsEditModalOpen(true);
  };

  const handleDelete = (test: ISpeakingTestBank) => {
    setSelectedTest(test);
    setIsDeleteModalOpen(true);
  };

  const handleCreateTest = async (values: ISpeakingTestBankPayload) => {
    try {
      await createSpeakingTest(values).unwrap();
      toast.success("Speaking test created successfully!");
      setIsCreateModalOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create speaking test.");
    }
  };

  const handleUpdateTest = async (values: ISpeakingTestBankPayload) => {
    if (!selectedTest) return;
    try {
      await updateSpeakingTest({ id: selectedTest.id, data: values }).unwrap();
      toast.success("Speaking test updated successfully!");
      setIsEditModalOpen(false);
      setSelectedTest(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update speaking test.");
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedTest) return;
    try {
      await deleteSpeakingTest(selectedTest.id).unwrap();
      toast.success("Speaking test deleted successfully!");
      setIsDeleteModalOpen(false);
      setSelectedTest(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete speaking test.");
    }
  };

  const columns: TableColumn<ISpeakingTestBank>[] = [
    {
      key: "part1Topic",
      header: "Part 1 Topic",
      render: (test) => <span className="font-medium">{test.part1Topic}</span>,
    },
    {
      key: "cueCardTopic",
      header: "Cue Card Topic",
      render: (test) => (
        <CustomTooltip content={test.cueCardTopic}>
          <span className="text-foreground">
            {test.cueCardTopic.length > 40 ? `${test.cueCardTopic.slice(0, 40)}...` : test.cueCardTopic}
          </span>
        </CustomTooltip>
      ),
    },
    { key: "difficulty", header: "Difficulty", render: (test) => <span>{test.difficulty}</span> },
  ];

  const actions: TableAction<ISpeakingTestBank>[] = [
    { label: "View Test", onClick: handleView, icon: <EyeIcon />, className: "hover:bg-primary/10" },
    { label: "Edit Test", onClick: handleEdit, icon: <PenBoxIcon />, className: "hover:bg-primary/10" },
    {
      label: "Delete Test",
      onClick: handleDelete,
      icon: <Trash2 />,
      className: "hover:bg-destructive/10 text-destructive",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Speaking Tests</h1>
          <p className="text-muted-foreground">Create and manage your speaking test exercises</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus /> Create Speaking Test
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Speaking Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <CustomTable
              columns={columns}
              data={speakingTests}
              actions={actions}
              loading={isLoading}
              emptyMessage="No speaking tests found. Create one to get started!"
            />
            {meta.total > 0 && (
              <CustomPagination meta={meta} onPageChange={handlePageChange} onLimitChange={handleLimitChange} />
            )}
          </div>
        </CardContent>
      </Card>

      <CreateSpeakingTestDialog
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTest}
        isLoading={isCreating}
      />

      <CreateSpeakingTestDialog
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTest(null);
        }}
        onSubmit={handleUpdateTest}
        isLoading={isUpdating}
        editingTest={selectedTest}
      />

      {selectedTest && (
        <Dialog
          open={isViewModalOpen}
          onOpenChange={() => {
            setIsViewModalOpen(false);
            setSelectedTest(null);
          }}
        >
          <DialogContent className="max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedTest.part1Topic}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 text-sm">
              <div>
                <h3 className="font-semibold">Part 1 Questions:</h3>
                <ul className="list-disc pl-5 text-muted-foreground">
                  {selectedTest.part1Questions.map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold">Cue Card Topic:</h3>
                <p className="text-muted-foreground">{selectedTest.cueCardTopic}</p>
              </div>
              <div>
                <h3 className="font-semibold">Cue Card Bullets:</h3>
                <ul className="list-disc pl-5 text-muted-foreground">
                  {selectedTest.cueCardBullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold">Part 2 Follow-up Questions:</h3>
                <ul className="list-disc pl-5 text-muted-foreground">
                  {selectedTest.part2FollowUpQuestions.map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold">Part 3 Questions:</h3>
                <ul className="list-disc pl-5 text-muted-foreground">
                  {selectedTest.part3Questions.map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold">Difficulty:</h3>
                <p className="text-muted-foreground">{selectedTest.difficulty}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <DeleteConfirmationDialog
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onConfirm={handleConfirmDelete}
        title="Are you sure you want to delete this test?"
        description="This action cannot be undone. This will permanently delete the speaking test. If any user has already started a session with this test, deletion will be blocked."
        isLoading={isDeleting}
      />
    </div>
  );
};

export default SpeakingLesson;
