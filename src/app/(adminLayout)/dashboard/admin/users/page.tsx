'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { CustomPagination } from '@/components/Common/CustomPagination/CustomPagination';
import {
  CustomTable,
  TableColumn,
} from '@/components/Common/CustomTable/CustomTable';
import { CustomTooltip } from '@/components/Common/CustomTooltip/CustomTooltip';
import { DeleteConfirmationDialog } from '@/components/Common/DeleteConfirmationDialog/DeleteConfirmationDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useGetUsersQuery, useRoleToggleMutation } from '@/redux/api/user/usersApi';
import { useDebounced } from '@/redux/hooks/hooks';
import { ISingleUser, Meta } from '@/types';
import { X } from 'lucide-react';

const AllUsers = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [isToggleModalOpen, setIsToggleModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ISingleUser | null>(null);

  const debouncedSearchTerm = useDebounced({ searchQuery: searchTerm, delay: 500 });

  const { data, isLoading } = useGetUsersQuery({
    page: currentPage,
    limit: currentLimit,
    email: debouncedSearchTerm
  });

  const [roleToggle, { isLoading: isToggling }] = useRoleToggleMutation();

  const allUser: ISingleUser[] = data?.data || [];
  console.log(allUser)
  const meta: Meta = data?.meta || { page: 1, limit: 10, total: 0 };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleLimitChange = (limit: number) => {
    setCurrentLimit(limit);
    setCurrentPage(1);
  };

  const handleToggleDialog = (user: ISingleUser) => {
    setSelectedUser(user);
    setIsToggleModalOpen(true);
  };

  const handleConfirmToggle = async () => {
    if (selectedUser) {
      try {
        const newRole = selectedUser.role === 'ADMIN' ? 'USER' : 'ADMIN';
        await roleToggle({ id: selectedUser.id, data: { role: newRole } }).unwrap();
        toast.success(`User role updated to ${newRole}`);
        setIsToggleModalOpen(false);
        setSelectedUser(null);
      } catch (error) {
        console.log(error)
        toast.error('Failed to update user role.');
      }
    }
  };

  const truncateText = (text: string | null, maxLength = 50) => {
    if (!text) return 'N/A';
    return text?.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const columns: TableColumn<ISingleUser>[] = [
    { key: 'id', header: 'User ID', render: user => <span className="font-medium">{user?.id || 'N/A'}</span> },
    {
      key: 'name',
      header: 'User Name',
      render: user =>
        user?.name ? (
          <CustomTooltip content={user?.name}>
            <span className="cursor-help text-muted-foreground">{truncateText(user?.name, 15)}</span>
          </CustomTooltip>
        ) : (
          <span className="text-muted-foreground">N/A</span>
        ),
    },
    {
      key: 'role',
      header: 'Role',
      render: user =>
        user?.role ? (
          <span className="text-muted-foreground">{user.role}</span>
        ) : (
          <span className="text-muted-foreground">N/A</span>
        ),
    },
    { key: 'email', header: 'User email', render: user => <span>{user.email}</span> },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: user => (
        <Button
          variant={user.role === 'ADMIN' ? 'destructive' : 'default'}
          size="sm"
          onClick={() => handleToggleDialog(user)}
        >
          {user.role === 'ADMIN' ? 'Make User' : 'Make Admin'}
        </Button>
      ),
    },
  ];

  

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">User Management</h1>
          <p className="text-muted-foreground">Search, view, and manage user roles within the system.</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>All System Users</CardTitle>
            <div className="relative w-full sm:max-w-xs">
              <Input
                placeholder="Search by email..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pr-8"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 cursor-pointer"
                  onClick={() => setSearchTerm('')}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Clear search</span>
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <CustomTable
              columns={columns}
              data={allUser}
              loading={isLoading}
              emptyMessage="No users found."
            />
            {meta.total > 0 && (
              <CustomPagination meta={meta} onPageChange={handlePageChange} onLimitChange={handleLimitChange} />
            )}
          </div>
        </CardContent>
      </Card>

      {selectedUser && (
        <DeleteConfirmationDialog
          open={isToggleModalOpen}
          onOpenChange={setIsToggleModalOpen}
          onConfirm={handleConfirmToggle}
          title={`Confirm Role Change`}
          description={`Are you sure you want to change the role of ${selectedUser.email} to ${selectedUser.role === 'ADMIN' ? 'USER' : 'ADMIN'}?`}
          isLoading={isToggling}
          confirmButtonText="Change"
          loadingButtonText="Changing..."
        />
      )}
    </div>
  );
};

export default AllUsers;

