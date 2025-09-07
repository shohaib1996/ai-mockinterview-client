'use client';

import { useState } from 'react';
import { EyeIcon, PenBoxIcon, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import * as z from 'zod';

import { IQuestion, Meta } from '@/types';
import { useGetAllQuestionsQuery, useUpdateQuestionMutation, useDeleteQuestionMutation } from '@/redux/api/question/questionApi';

import { CustomPagination } from '@/components/Common/CustomPagination/CustomPagination';
import { CustomTable, TableAction, TableColumn } from '@/components/Common/CustomTable/CustomTable';
import { CustomFormDialog } from '@/components/Common/CustomDialog/CustomFormDialog';
import { QuestionForm } from '@/components/AdminDashboard/Questions/QuestionForm';
import { DeleteConfirmationDialog } from '@/components/Common/DeleteConfirmationDialog/DeleteConfirmationDialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const QuestionsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(10);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<IQuestion | null>(null);

  const { data, isLoading } = useGetAllQuestionsQuery({ page: currentPage, limit: currentLimit });
  const [updateQuestion, { isLoading: isUpdating }] = useUpdateQuestionMutation();
  const [deleteQuestion, { isLoading: isDeleting }] = useDeleteQuestionMutation();

  const questions: IQuestion[] = data?.data || [];
  const meta: Meta = data?.meta || { page: 1, limit: 10, total: 0 };

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleLimitChange = (limit: number) => {
    setCurrentLimit(limit);
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
    if (selectedQuestion) {
      try {
        await updateQuestion({ id: selectedQuestion.id, ...values }).unwrap();
        toast.success('Question updated successfully!');
        setIsEditModalOpen(false);
        setSelectedQuestion(null);
      } catch (error) {
        toast.error('Failed to update question.');
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedQuestion) {
      try {
        await deleteQuestion(selectedQuestion.id).unwrap();
        toast.success('Question deleted successfully!');
        setIsDeleteModalOpen(false);
        setSelectedQuestion(null);
      } catch (error) {
        toast.error('Failed to delete question.');
      }
    }
  };

  const columns: TableColumn<IQuestion>[] = [
    { key: 'id', header: 'Question ID' },
    { key: 'type', header: 'Type' },
    { key: 'sessionType', header: 'Session Type' },
    { key: 'difficulty', header: 'Difficulty' },
    {
      key: 'aiGenerated',
      header: 'AI Generated',
      render: item => (
        <Badge variant={item.aiGenerated ? 'default' : 'secondary'}>
          {item.aiGenerated ? 'Yes' : 'No'}
        </Badge>
      ),
    },
  ];

  const actions: TableAction<IQuestion>[] = [
    { label: 'View', onClick: handleView, icon: <EyeIcon className="h-4 w-4" /> },
    { label: 'Edit', onClick: handleEdit, icon: <PenBoxIcon className="h-4 w-4" /> },
    { label: 'Delete', onClick: handleDelete, icon: <Trash2 className="h-4 w-4" />, className: 'text-destructive' },
  ];

  // Basic form fields, can be expanded
  const formFields: FormFieldConfig[] = [
    { name: 'text', label: 'Question Text', type: 'textarea', validation: z.string().min(1) },
    // Add other fields like type, sessionType, difficulty, options etc. as needed
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Question Bank</h1>
          <p className="text-muted-foreground">Browse and manage all questions in the system.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <CustomTable
            columns={columns}
            data={questions}
            actions={actions}
            loading={isLoading}
            emptyMessage="No questions found."
          />
          {meta.total > 0 && (
            <CustomPagination meta={meta} onPageChange={handlePageChange} onLimitChange={handleLimitChange} />
          )}
        </CardContent>
      </Card>

      {selectedQuestion && (
        <CustomFormDialog
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedQuestion(null);
          }}
          title="Edit Question"
          fields={formFields}
          onSubmit={handleUpdateQuestion}
          defaultValues={selectedQuestion}
        />
      )}

      {selectedQuestion && (
        <Dialog open={isViewModalOpen} onOpenChange={() => setIsViewModalOpen(false)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Question Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <p><strong>ID:</strong> {selectedQuestion.id}</p>
              <p><strong>Text:</strong> {selectedQuestion.text}</p>
              <p><strong>Type:</strong> {selectedQuestion.type}</p>
              <p><strong>Session Type:</strong> {selectedQuestion.sessionType}</p>
              <p><strong>Difficulty:</strong> {selectedQuestion.difficulty}</p>
              <p><strong>AI Generated:</strong> {selectedQuestion.aiGenerated ? 'Yes' : 'No'}</p>
              {selectedQuestion.options && selectedQuestion.options.length > 0 && (
                <div>
                  <p><strong>Options:</strong></p>
                  <ul className="list-disc pl-5">
                    {selectedQuestion.options.map((option, index) => (
                      <li key={index}>{option}</li>
                    ))}
                  </ul>
                </div>
              )}
              {selectedQuestion.correctAnswer && (
                <p><strong>Correct Answer:</strong> {Array.isArray(selectedQuestion.correctAnswer) ? selectedQuestion.correctAnswer.join(', ') : selectedQuestion.correctAnswer}</p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

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
