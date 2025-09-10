'use client';

import { CustomPagination } from '@/components/Common/CustomPagination/CustomPagination';
import {
  CustomTable,
  TableAction,
  TableColumn,
} from '@/components/Common/CustomTable/CustomTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  useDeleteListeningAudioMutation,
  useGetAllListeningAudiosQuery,
} from '@/redux/api/listening-audio/listeningAudioApi';
import { IListeningAudio } from '@/types';
import { PenBoxIcon, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { ListenAudioModal } from '@/components/AdminDashboard/Listening/ListenAudioModal';
import { toast } from 'sonner';
import { DeleteConfirmationDialog } from '@/components/Common/DeleteConfirmationDialog/DeleteConfirmationDialog';
import { EditAudioModal } from '@/components/AdminDashboard/Listening/EditAudioModal';
import { CreateAudioExerciseModal } from '@/components/AdminDashboard/Listening/CreateAudioExerciseModal';

const ListeningAudios = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState<IListeningAudio | null>(
    null
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [audioToDelete, setAudioToDelete] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [audioToEdit, setAudioToEdit] = useState<IListeningAudio | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data, isLoading } = useGetAllListeningAudiosQuery({
    page: currentPage,
    limit: currentLimit,
  });
  const [deleteAudio, { isLoading: isDeleting }] =
    useDeleteListeningAudioMutation();
  const listeningAudios: IListeningAudio[] = data?.data || [];
  const meta = data?.meta || { page: 1, limit: 10, total: 0 };
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleLimitChange = (limit: number) => {
    setCurrentLimit(limit);
    setCurrentPage(1);
  };

  const handleDelete = async () => {
    if (!audioToDelete) return;
    try {
      const res = await deleteAudio(audioToDelete).unwrap();
      if (res.success) {
        toast.success('Audio deleted successfully!');
        setIsDeleteDialogOpen(false);
        setAudioToDelete(null);
      }
    } catch (error) {
      console.log(error)
      toast.error('Failed to delete audio.');
    }
  };

  const columns: TableColumn<IListeningAudio>[] = [
    {
      key: 'id',
      header: 'ID',
      render: (audio) => <span className="font-medium">{audio.id}</span>,
    },
    {
      key: 'title',
      header: 'Title',
      render: (audio) => <span className="text-foreground">{audio.title}</span>,
    },
  ];

  const actions: TableAction<IListeningAudio>[] = [
    {
      label: 'View Audio',
      onClick: (audio) => {
        setSelectedAudio(audio);
        setIsModalOpen(true);
      },
      icon: <span>Listen Audio</span>,
      className: 'hover:bg-primary/10',
    },
    {
      label: 'Edit Audio',
      onClick: (audio) => {
        setAudioToEdit(audio);
        setIsEditModalOpen(true);
      },
      icon: <PenBoxIcon />,
      className: 'hover:bg-primary/10',
    },
    {
      label: 'Delete Audio',
      onClick: (audio) => {
        setAudioToDelete(audio.id);
        setIsDeleteDialogOpen(true);
      },
      icon: <Trash2 />,
      className: 'hover:bg-destructive/10 text-destructive',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Listening Audios
          </h1>
          <p className="text-muted-foreground">
            Create and manage your listening audio exercises
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus /> Create Audio Exercise
        </Button>
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
      <ListenAudioModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        audio={selectedAudio}
      />
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Audio"
        description="Are you sure you want to delete this audio? This action cannot be undone."
        isLoading={isDeleting}
      />
      <EditAudioModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        audio={audioToEdit}
      />
      <CreateAudioExerciseModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default ListeningAudios;
