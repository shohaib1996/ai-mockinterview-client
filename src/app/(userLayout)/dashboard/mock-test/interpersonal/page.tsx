'use client';

import { useState, type FC, useRef, ChangeEvent } from 'react';
import {
  useGetAllSessionsQuery,
  useCreateSessionMutation,
} from '@/redux/api/session/sessionApi';
import type { ISinglesSession, Meta } from '@/types';
import {
  CustomTable,
  type TableColumn,
  type TableAction,
} from '@/components/Common/CustomTable/CustomTable';
import { CustomPagination } from '@/components/Common/CustomPagination/CustomPagination';
import { CustomTooltip } from '@/components/Common/CustomTooltip/CustomTooltip';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Eye, Upload, Bot } from 'lucide-react';
import { format } from 'date-fns';
import { useAppSelector } from '@/redux/hooks/hooks';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useUploadQuestionsMutation } from '@/redux/api/mock-interview/mockInterviewApi';
import { Input } from '@/components/ui/input';

// Dialog for choosing question source
interface QuestionSourceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadClick: () => void;
  onRandomClick: () => void;
  isUploading: boolean;
}

const QuestionSourceDialog: FC<QuestionSourceDialogProps> = ({
  isOpen,
  onClose,
  onUploadClick,
  onRandomClick,
  isUploading,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Choose Question Source</DialogTitle>
          <DialogDescription>
            How would you like to provide questions for this interview session?
          </DialogDescription>
        </DialogHeader>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 py-4'>
          <div className='flex flex-col items-center gap-2'>
            <Button
              variant='outline'
              className='h-24 w-full flex flex-col items-center justify-center gap-2'
              onClick={onUploadClick}
              disabled={isUploading}
            >
              <Upload className='h-6 w-6' />
              <span>{isUploading ? 'Uploading...' : 'Upload Questions'}</span>
            </Button>
            <p className='text-xs text-muted-foreground text-center mt-1'>
              Upload a CSV file with a header named &lsquo;question&lsquo;.
            </p>
          </div>
          <Button
            variant='outline'
            className='h-24 flex flex-col items-center justify-center gap-2'
            onClick={onRandomClick}
          >
            <Bot className='h-6 w-6' />
            <span>Use AI Questions</span>
          </Button>
        </div>
        <DialogFooter>
          <Button variant='ghost' onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const InterpersonalMockInterview = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSessionId, setNewSessionId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const user = useAppSelector((state) => state.auth.user);
  const router = useRouter();
  const sessionType = 'MOCK_INTERVIEW_INTERPERSONAL';

  const { data, isLoading, refetch } = useGetAllSessionsQuery({
    userId: user?.id,
    type: sessionType,
    page: currentPage,
    limit: currentLimit,
  });

  const [createSession, { isLoading: isCreating }] = useCreateSessionMutation();
  const [uploadQuestion, { isLoading: isUploading }] =
    useUploadQuestionsMutation();

  const interpersonalData: ISinglesSession[] = data?.data || [];
  const meta: Meta = data?.meta || { page: 1, limit: 10, total: 0 };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleLimitChange = (limit: number) => {
    setCurrentLimit(limit);
    setCurrentPage(1);
  };

  const handleViewSession = (sessionId: string) => {
    router.push(`/dashboard/mock-test/interpersonal/${sessionId}`);
  };

  const handleCreateSession = async () => {
    try {
      const res = await createSession({ type: sessionType }).unwrap();
      if (res.success && res.data.id) {
        setNewSessionId(res.data.id);
        setIsModalOpen(true);
        refetch();
        toast.success('New session created successfully!');
      }
    } catch (error) {
      toast.error('Failed to create a new session.');
      console.error('Failed to create session:', error);
    }
  };

  const handleUploadTrigger = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !newSessionId) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await uploadQuestion({
        sessionId: newSessionId,
        data: formData,
      }).unwrap();
      setIsModalOpen(false);
      if (res.success) {
        toast.success('Questions uploaded successfully!');
        router.push(`/dashboard/mock-test/interpersonal/practice/${newSessionId}`);
      }
    } catch (error) {
      toast.error('Failed to upload questions.');
      console.error('Upload failed:', error);
    }
  };

  const handleRandomQuestions = () => {
    setIsModalOpen(false);
    if (newSessionId) {
      toast.info(`Generating AI questions for session: ${newSessionId}`);
      router.push(`/dashboard/mock-test/interpersonal/practice/${newSessionId}`);
    }
  };

  const truncateText = (text: string | null, maxLength = 50) => {
    if (!text) return 'N/A';
    return text?.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  const getScoreColor = (score: number) => {
    if (score >= 7) return 'text-green-600 dark:text-green-400';
    if (score >= 5) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const calculateDuration = (startedAt: string, endedAt: string) => {
    if (!startedAt || !endedAt) return 'N/A';
    const start = new Date(startedAt);
    const end = new Date(endedAt);
    const diffInMinutes = Math.floor(
      (end.getTime() - start.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return '< 1m';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  const columns: TableColumn<ISinglesSession>[] = [
    {
      key: 'id',
      header: 'Session ID',
      render: (session) => <span className='font-medium'>{session.id}</span>,
    },
    {
      key: 'score',
      header: 'Score',
      render: (session) => (
        <span className={`font-semibold ${getScoreColor(session.score)}`}>
          {session.score?.toFixed(1) ?? 'N/A'}
        </span>
      ),
    },
    {
      key: 'duration',
      header: 'Duration',
      render: (session) => (
        <span className='text-muted-foreground'>
          {calculateDuration(session.startedAt, session.endedAt)}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Date',
      render: (session) => (
        <span className='text-muted-foreground'>
          {format(new Date(session.startedAt), 'MMM dd, yyyy')}
        </span>
      ),
    },
    {
      key: 'feedback',
      header: 'Feedback',
      render: (session) =>
        session.feedback ? (
          <CustomTooltip content={session.feedback}>
            <span className='cursor-help text-muted-foreground'>
              {truncateText(session.feedback)}
            </span>
          </CustomTooltip>
        ) : (
          <span className='text-muted-foreground'>N/A</span>
        ),
    },
  ];

  const actions: TableAction<ISinglesSession>[] = [
    {
      label: 'View Session',
      onClick: (row) => handleViewSession(row.id),
      icon: <Eye className='h-4 w-4' />,
      className: 'hover:bg-primary/10 cursor-pointer',
    },
  ];

  if (isLoading) {
    return (
      <div className='p-6 space-y-6'>
        <div className='flex justify-between items-center'>
          <div>
            <Skeleton className='h-8 w-48 mb-2' />
            <Skeleton className='h-4 w-64' />
          </div>
          <Skeleton className='h-10 w-48' />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className='h-6 w-32' />
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className='h-16 w-full' />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='p-6 space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-bold text-foreground mb-2'>
            Interpersonal Mock Interview
          </h1>
          <p className='text-muted-foreground'>
            Practice and review your interpersonal interview skills.
          </p>
        </div>

        <Button
          className='flex items-center gap-2'
          disabled={isCreating}
          onClick={handleCreateSession}
        >
          <Plus className='h-4 w-4' />
          {isCreating ? 'Starting...' : 'Start Interpersonal Interview'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <CustomTable
              columns={columns}
              data={interpersonalData}
              actions={actions}
              loading={isLoading}
              emptyMessage='No interpersonal interview sessions found. Start one to practice!'
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

      <Input
        type='file'
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept='.csv'
        className='hidden'
      />
  

      <QuestionSourceDialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUploadClick={handleUploadTrigger}
        onRandomClick={handleRandomQuestions}
        isUploading={isUploading}
      />
    </div>
  );
};

export default InterpersonalMockInterview;