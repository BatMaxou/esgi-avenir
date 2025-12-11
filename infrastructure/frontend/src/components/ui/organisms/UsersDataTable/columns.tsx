"use client";

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
import { toast } from "sonner";
import { User } from "../../../../../../../domain/entities/User";
import { RoleEnum } from "../../../../../../../domain/enums/RoleEnum";
import { useRouter } from "next/navigation";
import { DeleteUserDialog } from "@/components/ui/molecules/dialogs/delete-user-dialog";
import { BanUnbanUserDialog } from "@/components/ui/molecules/dialogs/ban-unban-user-dialog";
import { UpdateUserDialog } from "@/components/ui/molecules/dialogs/update-user-dialog";

function UserActionsCell({ user }: { user: User }) {
  const { deleteUser, banUser, unbanUser, updateUser, getUsers } = useUsers();
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isBanned = user.roles.includes(RoleEnum.BANNED);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      if (!user.id) {
        toast.error("Utilisateur introuvable");
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
        toast.error("Utilisateur introuvable");
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
            onClick={() => router.push(`/users/${user.id}`)}
          >
            <EyeIcon className="mr-2 h-4 w-4" />
            Consulter
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setIsEditDialogOpen(true)}
          >
            <PencilIcon className="mr-2 h-4 w-4" />
            Modifier
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setIsBanDialogOpen(true)}
            className="cursor-pointer"
          >
            <BanIcon className="mr-2 h-4 w-4" />
            {isBanned ? "Débannir" : "Bannir"}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setIsDeleteDialogOpen(true)}
            className="cursor-pointer text-red-600"
          >
            <TrashIcon className="mr-2 h-4 w-4" />
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UpdateUserDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        user={{
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email || "",
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

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "firstName",
    header: "Prénom",
  },
  {
    accessorKey: "lastName",
    header: "Nom",
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const email = row.original.email;
      return email?.toString() || "-";
    },
  },
  {
    id: "role",
    header: "Rôle",
    cell: ({ row }) => {
      const roles = row.original.roles || [];
      const displayRole = roles.find((r) => r !== RoleEnum.USER);
      const roleLabel =
        displayRole === RoleEnum.DIRECTOR
          ? "Directeur"
          : displayRole === RoleEnum.ADVISOR
          ? "Conseiller"
          : "Client";
      const bgColor =
        displayRole === RoleEnum.DIRECTOR
          ? "bg-purple-100 text-purple-800"
          : displayRole === RoleEnum.ADVISOR
          ? "bg-blue-100 text-blue-800"
          : "bg-gray-100 text-gray-800";

      return (
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${bgColor}`}
        >
          {roleLabel}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <UserActionsCell user={row.original} />,
  },
];
