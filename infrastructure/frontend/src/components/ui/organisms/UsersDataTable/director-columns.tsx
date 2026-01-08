"use client";

import { useTranslations } from "next-intl";
import { ColumnDef } from "@tanstack/react-table";
import {
  MoreHorizontalIcon,
  PencilIcon,
  TrashIcon,
  BanIcon,
  EyeIcon,
} from "lucide-react";
import { Button } from "@/components/ui/atoms/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/atoms/dropdown-menu";
import { useState } from "react";
import { useUsers } from "@/contexts/UsersContext";
import { User } from "../../../../../../../domain/entities/User";
import { RoleEnum } from "../../../../../../../domain/enums/RoleEnum";
import { useRouter } from "@/i18n/navigation";
import { DeleteUserDialog } from "@/components/ui/molecules/dialogs/delete-user-dialog";
import { BanUnbanUserDialog } from "@/components/ui/molecules/dialogs/ban-unban-user-dialog";
import { UpdateUserDialog } from "@/components/ui/molecules/dialogs/update-user-dialog";
import { RoleBadge } from "@/components/ui/molecules/badges/role-badge";
import { useAuth } from "@/contexts/AuthContext";
import { showErrorToast } from "@/lib/toast";

function UserActionsCell({ user }: { user: User }) {
  const t = useTranslations("components.dataTable.users");
  const { deleteUser, banUser, unbanUser, updateUser, getUsers } = useUsers();
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isBanned = user.roles.includes(RoleEnum.BANNED);
  const { user: authUser } = useAuth();

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      if (!user.id) {
        showErrorToast(t("userNotFound"));
        return;
      }
      await deleteUser(user.id);
      setIsDeleteDialogOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBanToggle = async () => {
    setIsLoading(true);
    try {
      if (!user.id) {
        showErrorToast(t("userNotFound"));
        return;
      }
      if (isBanned) {
        await unbanUser(user.id);
      } else {
        await banUser(user.id);
      }
      setIsBanDialogOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    roles: RoleEnum[];
  }) => {
    setIsLoading(true);
    try {
      if (!user.id) return;
      await updateUser({
        id: user.id,
        ...data,
      });
      await getUsers();
      setIsEditDialogOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const id = user.id;

  if (!id) {
    return null;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() =>
              router.push({
                pathname: "/users/[id]",
                params: { id: id },
              })
            }
          >
            <EyeIcon className="mr-2 h-4 w-4" />
            {t("consult")}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setIsEditDialogOpen(true)}
          >
            <PencilIcon className="mr-2 h-4 w-4" />
            {t("edit")}
          </DropdownMenuItem>
          {user.id !== authUser?.id && (
            <DropdownMenuItem
              onClick={() => setIsBanDialogOpen(true)}
              className="cursor-pointer text-red-600"
              disabled={user.id === authUser?.id}
            >
              <BanIcon className="mr-2 h-4 w-4 text-red-600" />
              {isBanned ? t("unban") : t("ban")}
            </DropdownMenuItem>
          )}
          {user.id !== authUser?.id && (
            <DropdownMenuItem
              onClick={() => setIsDeleteDialogOpen(true)}
              className="cursor-pointer text-red-600"
            >
              <TrashIcon className="mr-2 h-4 w-4 text-red-600" />
              {t("delete")}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <UpdateUserDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        user={{
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email.value || "",
          roles: user.roles,
        }}
        onSubmit={handleUpdate}
        isLoading={isLoading}
      />

      <DeleteUserDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        isLoading={isLoading}
        user={{
          firstName: user.firstName,
          lastName: user.lastName,
        }}
      />

      <BanUnbanUserDialog
        open={isBanDialogOpen}
        onOpenChange={setIsBanDialogOpen}
        onConfirm={handleBanToggle}
        isLoading={isLoading}
        user={{
          firstName: user.firstName,
          lastName: user.lastName,
        }}
        isBanned={isBanned}
      />
    </>
  );
}

export const directorColumns = (
  t: (key: string) => string
): ColumnDef<User>[] => [
  {
    accessorKey: "firstName",
    header: () => t("firstName"),
  },
  {
    accessorKey: "lastName",
    header: () => t("lastName"),
  },
  {
    accessorKey: "email",
    header: () => t("email"),
    cell: ({ row }) => {
      const email = row.original.email.value;
      return email?.toString() || "-";
    },
  },
  {
    id: "role",
    header: () => t("role"),
    cell: ({ row }) => {
      const roles = row.original.roles || [];
      return <RoleBadge roles={roles} />;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <UserActionsCell user={row.original} />,
  },
];
