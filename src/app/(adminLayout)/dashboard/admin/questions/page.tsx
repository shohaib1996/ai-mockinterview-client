"use client";

import { useState } from "react";
import { EyeIcon, PenBoxIcon, Trash2, Search } from "lucide-react";
import { toast } from "sonner";

import type { IQuestion, Meta } from "@/types";
import {
  useGetAllQuestionsQuery,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
} from "@/redux/api/question/questionApi";

import { CustomPagination } from "@/components/Common/CustomPagination/CustomPagination";
import {
  CustomTable,
  type TableAction,
  type TableColumn,
} from "@/components/Common/CustomTable/CustomTable";
import { QuestionForm } from "@/components/AdminDashboard/Questions/QuestionForm";
import { DeleteConfirmationDialog } from "@/components/Common/DeleteConfirmationDialog/DeleteConfirmationDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const QuestionsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(10);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<IQuestion | null>(
    null
  );
  const [searchType, setSearchType] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const [activeSearchType, setActiveSearchType] = useState<string>("");
  const [activeSearchValue, setActiveSearchValue] = useState<string>("");

  const queryParams: any = { page: currentPage, limit: currentLimit };
  if (activeSearchType && activeSearchValue) {
    queryParams[activeSearchType] = activeSearchValue;
  }

  const { data, isLoading } = useGetAllQuestionsQuery(queryParams);
  const [updateQuestion, { isLoading: isUpdating }] =
    useUpdateQuestionMutation();
  const [deleteQuestion, { isLoading: isDeleting }] =
    useDeleteQuestionMutation();

  const questions: IQuestion[] = data?.data || [];
  const meta: Meta = data?.meta || { page: 1, limit: 10, total: 0 };

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleLimitChange = (limit: number) => {
    setCurrentLimit(limit);
    setCurrentPage(1);
  };

  const handleSearch = () => {
    if (searchType && searchValue.trim()) {
      setActiveSearchType(searchType);
      setActiveSearchValue(searchValue.trim());
      setCurrentPage(1);
    }
  };

  const handleClearSearch = () => {
    setSearchType("");
    setSearchValue("");
    setActiveSearchType("");
    setActiveSearchValue("");
    setCurrentPage(1);
  };

  const handleView = (question: IQuestion) => {
    setSelectedQuestion(question);
    setIsViewModalOpen(true);
  };

  const handleEdit = (question: IQuestion) => {
    setSelectedQuestion(question);
    setIsEditModalOpen(true);
  };

  const handleDelete = (question: IQuestion) => {
    setSelectedQuestion(question);
    setIsDeleteModalOpen(true);
  };

  const handleUpdateQuestion = async (values: any) => {
    const payload = {
      text: values.text,
      type: String(values.type),
      sessionType: String(values.sessionType),
      difficulty: String(values.difficulty),
      options: values.options.map((opt: { value: string }) => opt.value),
      correctAnswer: values.correctAnswer,
      aiGenerated: values.aiGenerated,
    };

    if (selectedQuestion) {
      try {
        await updateQuestion({ id: selectedQuestion.id, ...payload }).unwrap();
        toast.success("Question updated successfully!");
        setIsEditModalOpen(false);
        setSelectedQuestion(null);
      } catch (error) {
        console.log(error)
        toast.error("Failed to update question.");
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedQuestion) {
      try {
        await deleteQuestion(selectedQuestion.id).unwrap();
        toast.success("Question deleted successfully!");
        setIsDeleteModalOpen(false);
        setSelectedQuestion(null);
      } catch (error) {
        console.log(error)
        toast.error("Failed to delete question.");
      }
    }
  };

  const columns: TableColumn<IQuestion>[] = [
    { key: "id", header: "Question ID" },
    { key: "type", header: "Type" },
    { key: "sessionType", header: "Session Type" },
    { key: "difficulty", header: "Difficulty" },
    {
      key: "aiGenerated",
      header: "AI Generated",
      render: (item) => (
        <Badge variant={item.aiGenerated ? "default" : "secondary"}>
          {item.aiGenerated ? "Yes" : "No"}
        </Badge>
      ),
    },
  ];

  const actions: TableAction<IQuestion>[] = [
    {
      label: "View",
      onClick: handleView,
      icon: <EyeIcon className="h-4 w-4" />,
    },
    {
      label: "Edit",
      onClick: handleEdit,
      icon: <PenBoxIcon className="h-4 w-4" />,
    },
    {
      label: "Delete",
      onClick: handleDelete,
      icon: <Trash2 className="h-4 w-4" />,
      className: "text-destructive",
    },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Question Bank
          </h1>
          <p className="text-muted-foreground">
            Browse and manage all questions in the system.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row p-4 bg-muted/30 border">
            <div className="flex-1">
              <Select value={searchType} onValueChange={setSearchType}>
                <SelectTrigger className="w-full rounded-r-none">
                  <SelectValue placeholder="Select search type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="listeningAudioId">
                    Listening Audio ID
                  </SelectItem>
                  <SelectItem value="quizAttemptId">Quiz Attempt ID</SelectItem>
                  <SelectItem value="readingPassageId">
                    Reading Passage ID
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-x-2 flex-2 flex">
              <div className="w-full">
                <Input
                  className="rounded-l-none"
                  placeholder="Enter ID to search..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  disabled={!searchType}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <div className="flex gap-2 flex-1">
                <Button
                  onClick={handleSearch}
                  disabled={!searchType || !searchValue.trim()}
                  className="whitespace-nowrap"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                {(activeSearchType || activeSearchValue) && (
                  <Button
                    variant="outline"
                    onClick={handleClearSearch}
                    className="whitespace-nowrap bg-transparent"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </div>

          {activeSearchType && activeSearchValue && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Searching by:</span>
              <Badge variant="secondary">
                {activeSearchType === "listeningAudioId"
                  ? "Listening Audio ID"
                  : activeSearchType === "quizAttemptId"
                  ? "Quiz Attempt ID"
                  : "Reading Passage ID"}
                : {activeSearchValue}
              </Badge>
            </div>
          )}

          <CustomTable
            columns={columns}
            data={questions}
            actions={actions}
            loading={isLoading}
            emptyMessage="No questions found."
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

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Edit Question
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
            <div className="space-y-4">
              {selectedQuestion && (
                <QuestionForm
                  defaultValues={selectedQuestion}
                  onSubmit={handleUpdateQuestion}
                  isLoading={isUpdating}
                />
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Question Details
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
            {selectedQuestion && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Question ID
                    </p>
                    <p className="text-sm">{selectedQuestion.id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Type
                    </p>
                    <Badge variant="outline">{selectedQuestion.type}</Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Session Type
                    </p>
                    <Badge variant="secondary">
                      {selectedQuestion.sessionType}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Difficulty
                    </p>
                    <Badge
                      variant={
                        selectedQuestion.difficulty === "HARD"
                          ? "destructive"
                          : selectedQuestion.difficulty === "MEDIUM"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {selectedQuestion.difficulty}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      AI Generated
                    </p>
                    <Badge
                      variant={
                        selectedQuestion.aiGenerated ? "default" : "secondary"
                      }
                    >
                      {selectedQuestion.aiGenerated ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      Associated IDs
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedQuestion.listeningAudioId && (
                        <Badge variant="outline">
                          Listening Audio: {selectedQuestion.listeningAudioId}
                        </Badge>
                      )}
                      {selectedQuestion.quizAttemptId && (
                        <Badge variant="outline">
                          Quiz Attempt: {selectedQuestion.quizAttemptId}
                        </Badge>
                      )}
                      {selectedQuestion.readingPassageId && (
                        <Badge variant="outline">
                          Reading Passage: {selectedQuestion.readingPassageId}
                        </Badge>
                      )}
                      {!selectedQuestion.listeningAudioId &&
                        !selectedQuestion.quizAttemptId &&
                        !selectedQuestion.readingPassageId && (
                          <span className="text-sm text-muted-foreground">
                            No associated IDs
                          </span>
                        )}
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Question Text
                  </p>
                  <div className="p-3 bg-muted/50 rounded-md">
                    <p className="text-sm whitespace-pre-wrap">
                      {selectedQuestion.text}
                    </p>
                  </div>
                </div>

                {selectedQuestion.options &&
                  selectedQuestion.options?.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">
                        Options
                      </p>
                      <div className="space-y-2">
                        {selectedQuestion.options.map((option, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2 p-2 bg-muted/30 rounded-md"
                          >
                            <span className="text-xs font-medium text-muted-foreground w-6">
                              {String.fromCharCode(65 + index)}.
                            </span>
                            <span className="text-sm">{option}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {selectedQuestion.correctAnswer && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      Correct Answer
                    </p>
                    <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-md">
                      <p className="text-sm text-green-800 dark:text-green-200">
                        {Array.isArray(selectedQuestion.correctAnswer)
                          ? selectedQuestion.correctAnswer.join(", ")
                          : selectedQuestion.correctAnswer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <DeleteConfirmationDialog
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onConfirm={handleConfirmDelete}
        title="Are you sure you want to delete this question?"
        description="This action cannot be undone."
        isLoading={isDeleting}
      />
    </div>
  );
};

export default QuestionsPage;
