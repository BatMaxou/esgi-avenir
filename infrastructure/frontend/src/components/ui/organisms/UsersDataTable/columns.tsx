"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  MoreHorizontalIcon,
  PencilIcon,
  TrashIcon,
  BanIcon,
} from "lucide-react";
import { Button } from "@/components/ui/atoms/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/atoms/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/molecules/dialogs/alert-dialog";
import { useState } from "react";
import { useUsers } from "@/contexts/UsersContext";
import { toast } from "sonner";
import { User } from "../../../../../../../domain/entities/User";
import { RoleEnum } from "../../../../../../../domain/enums/RoleEnum";

// Actions Cell Component
function UserActionsCell({ user }: { user: User }) {
  const { deleteUser, banUser, unbanUser } = useUsers();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);
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
      toast.success("Utilisateur supprimé");
      setIsDeleteDialogOpen(false);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      toast.error("Erreur lors de la suppression");
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
        toast.success("Utilisateur débanni");
      } else {
        await banUser(user.id);
        toast.success("Utilisateur banni");
      }
      setIsBanDialogOpen(false);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      toast.error("Erreur lors de l'opération");
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
          <DropdownMenuItem className="cursor-pointer">
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer l&apos;utilisateur</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer {user.firstName}{" "}
              {user.lastName}&nbsp;? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Ban/Unban Confirmation Dialog */}
      <AlertDialog open={isBanDialogOpen} onOpenChange={setIsBanDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isBanned ? "Débannir" : "Bannir"} l&apos;utilisateur
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isBanned
                ? `Êtes-vous sûr de vouloir débannir ${user.firstName} ${user.lastName}&nbsp;?`
                : `Êtes-vous sûr de vouloir bannir ${user.firstName} ${user.lastName}&nbsp;?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBanToggle}
              disabled={isLoading}
              className={
                isBanned
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-orange-600 hover:bg-orange-700"
              }
            >
              {isBanned ? "Débannir" : "Bannir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
