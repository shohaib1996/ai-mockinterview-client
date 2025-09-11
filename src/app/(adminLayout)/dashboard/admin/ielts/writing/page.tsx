'use client';

import { useState } from 'react';
import { EyeIcon, PenBoxIcon, Plus, Trash2 } from 'lucide-react';
import * as z from 'zod';
import { toast } from 'sonner';

import {
  useGetAllWritingTasksQuery,
  useCreateWritingTaskMutation,
  useUpdateWritingTaskMutation,
  useDeleteWritingTaskMutation,
} from '@/redux/api/writingTask/writingTaskApi';
import { IWritingTask, Meta } from '@/types';
import { CustomPagination } from '@/components/Common/CustomPagination/CustomPagination';
import {
  CustomTable,
  TableAction,
  TableColumn,
} from '@/components/Common/CustomTable/CustomTable';
import { CustomTooltip } from '@/components/Common/CustomTooltip/CustomTooltip';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  CustomFormDialog,
  FormFieldConfig,
} from '@/components/Common/CustomDialog/CustomFormDialog';
import { DeleteConfirmationDialog } from '@/components/Common/DeleteConfirmationDialog/DeleteConfirmationDialog';
import { CreateWritingTaskDialog } from '@/components/AdminDashboard/Writing/CreateWritingTaskDialog';
import Image from 'next/image';

const WritingLession = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(10);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<IWritingTask | null>(null);

  const { data, isLoading } = useGetAllWritingTasksQuery({
    page: currentPage,
    limit: currentLimit,
  });
  const [createWritingTask, { isLoading: isCreating }] = useCreateWritingTaskMutation();
  const [updateWritingTask] = useUpdateWritingTaskMutation();
  const [deleteWritingTask, { isLoading: isDeleting }] = useDeleteWritingTaskMutation();

  const writingTasks: IWritingTask[] = data?.data || [];
  const meta: Meta = data?.meta || { page: 1, limit: 10, total: 0 };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleLimitChange = (limit: number) => {
    setCurrentLimit(limit);
    setCurrentPage(1);
  };

  const truncateText = (text: string | null, maxLength = 50) => {
    if (!text) return 'N/A';
    return text?.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const handleCreate = () => {
    setIsCreateModalOpen(true);
  };

  const handleView = (task: IWritingTask) => {
    setSelectedTask(task);
    setIsViewModalOpen(true);
  };

  const handleEdit = (task: IWritingTask) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  const handleDelete = (task: IWritingTask) => {
    setSelectedTask(task);
    setIsDeleteModalOpen(true);
  };

  const handleCreateTask = async (data: Omit<IWritingTask, 'id'>) => {
    try {
      await createWritingTask(data).unwrap();
      toast.success('Writing task created successfully!');
      setIsCreateModalOpen(false);
    } catch (error) {
      console.log(error)
      toast.error('Failed to create writing task.');
    }
  };

  const handleUpdateTask = async (values: Record<string, any>) => {
    if (selectedTask) {
      try {
        await updateWritingTask({ id: selectedTask.id, ...values }).unwrap();
        toast.success('Writing task updated successfully!');
        setIsEditModalOpen(false);
        setSelectedTask(null);
      } catch (error) {
        console.log(error)
        toast.error('Failed to update writing task.');
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedTask) {
      try {
        await deleteWritingTask(selectedTask.id).unwrap();
        toast.success('Writing task deleted successfully!');
        setIsDeleteModalOpen(false);
        setSelectedTask(null);
      } catch (error) {
        console.log(error)
        toast.error('Failed to delete writing task.');
      }
    }
  };

  const columns: TableColumn<IWritingTask>[] = [
    { key: 'id', header: 'ID', render: task => <span className="font-medium">{task.id}</span> },
    { key: 'task', header: 'Task Type', render: task => <span className="font-medium">{task.task}</span> },
    {
      key: 'promptText',
      header: 'Prompt',
      render: task => (
        <CustomTooltip content={task.promptText}>
          <span className="text-foreground">{truncateText(task.promptText, 30)}</span>
        </CustomTooltip>
      ),
    },
    { key: 'difficulty', header: 'Difficulty', render: task => <span>{task.difficulty}</span> },
  ];

  const actions: TableAction<IWritingTask>[] = [
    { label: 'View Task', onClick: handleView, icon: <EyeIcon />, className: 'hover:bg-primary/10' },
    { label: 'Edit Task', onClick: handleEdit, icon: <PenBoxIcon />, className: 'hover:bg-primary/10' },
    {
      label: 'Delete Task',
      onClick: handleDelete,
      icon: <Trash2 />,
      className: 'hover:bg-destructive/10 text-destructive',
    },
  ];

  const editFormFields: FormFieldConfig[] = [
    { name: 'promptText', label: 'Task Details', type: 'textarea', validation: z.string().min(1, 'Prompt is required'), className: 'h-32' },
    { name: 'imageUrl', label: 'Image URL', type: 'text', validation: z.string().url('Must be a valid URL').optional().or(z.literal('')) },
    {
      name: 'difficulty',
      label: 'Difficulty',
      type: 'select',
      options: [
        { value: 'EASY', label: 'Easy' },
        { value: 'MEDIUM', label: 'Medium' },
        { value: 'HARD', label: 'Hard' },
      ],
      validation: z.enum(['EASY', 'MEDIUM', 'HARD']),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Writing Tasks</h1>
          <p className="text-muted-foreground">Create and manage your writing task exercises</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus /> Create Writing Exercise
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Writing Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <CustomTable
              columns={columns}
              data={writingTasks}
              actions={actions}
              loading={isLoading}
              emptyMessage="No writing tasks found. Create one to get started!"
            />
            {meta.total > 0 && (
              <CustomPagination meta={meta} onPageChange={handlePageChange} onLimitChange={handleLimitChange} />
            )}
          </div>
        </CardContent>
      </Card>

      <CreateWritingTaskDialog
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTask}
        isLoading={isCreating}
      />

      {selectedTask && (
        <CustomFormDialog
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedTask(null);
          }}
          title="Edit Writing Task"
          fields={editFormFields.filter(field => selectedTask.task === 'TASK1' || field?.name !== 'imageUrl')}
          onSubmit={handleUpdateTask}
          defaultValues={selectedTask}
        />
      )}

      {selectedTask && (
        <Dialog
          open={isViewModalOpen}
          onOpenChange={() => {
            setIsViewModalOpen(false);
            setSelectedTask(null);
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Task: {selectedTask.task}</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <h3 className="font-semibold">Task details:</h3>
              <p className="text-sm text-muted-foreground">{selectedTask.promptText}</p>
              {selectedTask.imageUrl && (
                <>
                  <h3 className="font-semibold">Image:</h3>
                  <Image width={50} height={50} src={selectedTask.imageUrl} alt="Task image" className="rounded-md border" />
                </>
              )}
              <h3 className="font-semibold">Difficulty:</h3>
              <p className="text-sm text-muted-foreground">{selectedTask.difficulty}</p>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <DeleteConfirmationDialog
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onConfirm={handleConfirmDelete}
        title="Are you sure you want to delete this task?"
        description="This action cannot be undone. This will permanently delete the writing task."
        isLoading={isDeleting}
      />
    </div>
  );
};

export default WritingLession;

