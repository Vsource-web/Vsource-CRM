"use client";

import AddUserSheet from "@/users/components/AddUserSheet";
import DeleteUserDialog from "@/users/components/DeleteUserDialog";
import EditUserSheet from "@/users/components/EditUserSheet";
import UserTable from "@/users/components/UserTable";
import ViewUserSheet from "@/users/components/ViewUserSheet";
import { useUsers } from "@/users/hooks/useUsers";
import { User } from "@/users/types/user";
import { useState } from "react";

export default function UsersPage() {
  const { data, isLoading } = useUsers();
  const [viewOpen, setViewOpen] = useState(false);

  const [editOpen, setEditOpen] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleView = (user: User) => {
    setSelectedUser(user);
    setViewOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setEditOpen(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setDeleteOpen(true);
  };

  if (isLoading) {
    return <div>Loading users...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>

          <p className="text-muted-foreground">Manage users and roles</p>
        </div>

        <AddUserSheet />
      </div>

      <UserTable
        users={data ?? []}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ViewUserSheet
        open={viewOpen}
        onOpenChange={setViewOpen}
        user={selectedUser}
      />

      <EditUserSheet
        open={editOpen}
        onOpenChange={setEditOpen}
        user={selectedUser}
      />

      <DeleteUserDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        user={selectedUser}
      />
    </div>
  );
}
