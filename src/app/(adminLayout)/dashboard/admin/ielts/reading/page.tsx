"use client";
import { useState } from "react";
import { EyeIcon, PenBoxIcon, Plus, Trash2 } from "lucide-react";
import * as z from "zod";
import {
  useGetAllReadingPassagesQuery,
  useCreateReadingPassageMutation,
  useUpdateReadingPassageMutation,
  useDeleteReadingPassageMutation,
} from "@/redux/api/reading-passage/readingPassageApi";
import { IReadingPassage, Meta } from "@/types";
import { CustomPagination } from "@/components/Common/CustomPagination/CustomPagination";
import {
  CustomTable,
  TableAction,
  TableColumn,
} from "@/components/Common/CustomTable/CustomTable";
import { CustomTooltip } from "@/components/Common/CustomTooltip/CustomTooltip";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  CustomFormDialog,
  FormFieldConfig,
} from "@/components/Common/CustomDialog/CustomFormDialog";
import { DeleteConfirmationDialog } from "@/components/Common/DeleteConfirmationDialog/DeleteConfirmationDialog";
import { toast } from "sonner";
import { useGenerateQuestionsMutation } from "@/redux/api/question/questionApi";
import { GenerateQuestionsDialog } from "@/components/AdminDashboard/Reading/GenerateQuestionsDialog";

const ReadingLession = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(10);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [selectedPassage, setSelectedPassage] =
    useState<IReadingPassage | null>(null);
  const [newPassageId, setNewPassageId] = useState<string | null>(null);

  const { data, isLoading } = useGetAllReadingPassagesQuery({
    page: currentPage,
    limit: currentLimit,
  });
  const [generateQuestions, { isLoading: isGenerating }] =
    useGenerateQuestionsMutation();
  const [createReadingPassage, { isLoading: isCreating }] =
    useCreateReadingPassageMutation();
  const [updateReadingPassage, { isLoading: isUpdating }] =
    useUpdateReadingPassageMutation();
  const [deleteReadingPassage, { isLoading: isDeleting }] =
    useDeleteReadingPassageMutation();

  console.log(isCreating, isUpdating);

  const readingPassages: IReadingPassage[] = data?.data || [];
  const meta: Meta = data?.meta || { page: 1, limit: 10, total: 0 };

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

  const handleView = (passage: IReadingPassage) => {
    setSelectedPassage(passage);
    setIsViewModalOpen(true);
  };

  const handleEdit = (passage: IReadingPassage) => {
    setSelectedPassage(passage);
    setIsEditModalOpen(true);
  };

  const handleDelete = (passage: IReadingPassage) => {
    setSelectedPassage(passage);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedPassage) {
      try {
        await deleteReadingPassage(selectedPassage.id).unwrap();
        toast.success("Passage deleted successfully!");
        setIsDeleteModalOpen(false);
        setSelectedPassage(null);
      } catch (error) {
        console.log(error)
        toast.error("Failed to delete passage.");
      }
    }
  };

  const handleUpdatePassage = async (values: Record<string, any>) => {
    if (selectedPassage) {
      try {
        await updateReadingPassage({
          id: selectedPassage.id,
          ...values,
        }).unwrap();
        toast.success("Passage updated successfully!");
        setIsEditModalOpen(false);
        setSelectedPassage(null);
      } catch (error) {
        console.log(error)
        toast.error("Failed to update passage.");
      }
    }
  };
  const handleCreatePassage = async (values: Record<string, any>) => {
    try {
      const newPassage = await createReadingPassage(values).unwrap();
      toast.success("Passage created successfully!");
      setIsEditModalOpen(false);
      setNewPassageId(newPassage.data.id);
      setIsGenerateModalOpen(true);
    } catch (error) {
      console.log(error)
      toast.error("Failed to create passage.");
    }
  };

  const handleGenerateQuestions = async (data: { promptText: string }) => {
    if (!newPassageId) return;

    try {
      await generateQuestions({
        ...data,
        numberOfQuestions: 10,
        sessionType: "IELTS_READING",
        readingPassageId: newPassageId,
      }).unwrap();
      toast.success("Questions generated successfully!");
      setIsGenerateModalOpen(false);
      setNewPassageId(null);
    } catch (error) {
      console.log(error)
      toast.error("Failed to generate questions.");
    }
  };

  const columns: TableColumn<IReadingPassage>[] = [
    {
      key: "id",
      header: "ID",
      render: (passage) => <span className="font-medium">{passage.id}</span>,
    },
    {
      key: "title",
      header: "Title",
      render: (passage) => (
        <CustomTooltip content={passage.title}>
          <span className="text-foreground">
            {truncateText(passage.title, 20)}
          </span>
        </CustomTooltip>
      ),
    },
    {
      key: "content",
      header: "Content",
      render: (passage) => (
        <CustomTooltip content={passage.content}>
          <span className="text-foreground">
            {truncateText(passage.content, 30)}
          </span>
        </CustomTooltip>
      ),
    },
    {
      key: "createdAt",
      header: "Created At",
      render: (passage) => (
        <span className="text-foreground">
          {new Date(passage.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      ),
    },
  ];

  const actions: TableAction<IReadingPassage>[] = [
    {
      label: "View Passage",
      onClick: handleView,
      icon: <EyeIcon />,
      className: "hover:bg-primary/10",
    },
    {
      label: "Edit Passage",
      onClick: handleEdit,
      icon: <PenBoxIcon />,
      className: "hover:bg-primary/10",
    },
    {
      label: "Delete Passage",
      onClick: handleDelete,
      icon: <Trash2 />,
      className: "hover:bg-destructive/10 text-destructive",
    },
  ];

  const formFields: FormFieldConfig[] = [
    {
      name: "title",
      label: "Title",
      type: "text",
      validation: z.string().min(1, "Title is required"),
    },
    {
      name: "content",
      label: "Content",
      type: "textarea",
      validation: z.string().min(1, "Content is required"),
      className: "h-64 overflow-y-auto",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Reading Passages
          </h1>
          <p className="text-muted-foreground">
            Create and manage your reading passages
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedPassage(null);
            setIsEditModalOpen(true);
          }}
        >
          <Plus /> Create Reading Passage
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Reading Passages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <CustomTable
              columns={columns}
              data={readingPassages}
              actions={actions}
              loading={isLoading}
              emptyMessage="No reading passages found. Check back later for new exercises!"
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

      {/* View Modal */}
      {selectedPassage && (
        <Dialog
          open={isViewModalOpen}
          onOpenChange={() => {
            setIsViewModalOpen(false);
            setSelectedPassage(null);
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedPassage.title}</DialogTitle>
            </DialogHeader>
            <DialogDescription className="prose dark:prose-invert max-h-[60vh] overflow-y-auto">
              {selectedPassage.content}
            </DialogDescription>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit/Create Modal */}
      <CustomFormDialog
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedPassage(null);
        }}
        title={selectedPassage ? "Edit Passage" : "Create Passage"}
        fields={formFields}
        onSubmit={selectedPassage ? handleUpdatePassage : handleCreatePassage}
        defaultValues={
          selectedPassage
            ? {
                title: selectedPassage.title,
                content: selectedPassage.content,
              }
            : {}
        }
      />

      {/* Delete Confirmation */}
      <DeleteConfirmationDialog
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onConfirm={handleConfirmDelete}
        title="Are you sure you want to delete this passage?"
        description="This action cannot be undone. This will permanently delete the passage."
        isLoading={isDeleting}
      />

      {/* Generate Questions Modal */}
      <GenerateQuestionsDialog
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        onSubmit={handleGenerateQuestions}
        isLoading={isGenerating}
      />
    </div>
  );
};

export default ReadingLession;
