"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUsers } from "@/contexts/UsersContext";
import { Button } from "@/components/ui/atoms/button";
import {
  LoaderCircleIcon,
  ArrowLeftIcon,
  PencilIcon,
  BanIcon,
  TrashIcon,
} from "lucide-react";

import { RoleEnum } from "../../../../../../../../domain/enums/RoleEnum";
import { UpdateUserDialog } from "@/components/ui/molecules/dialogs/update-user-dialog";
import { DeleteUserDialog } from "@/components/ui/molecules/dialogs/delete-user-dialog";
import { BanUnbanUserDialog } from "@/components/ui/molecules/dialogs/ban-unban-user-dialog";
import { RoleBadge } from "@/components/ui/molecules/badges/role-badge";
import { useAuth } from "@/contexts/AuthContext";

export default function UserDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user: authUser } = useAuth();
  const {
    getUser,
    user,
    isUserLoading,
    deleteUser,
    banUser,
    unbanUser,
    updateUser,
  } = useUsers();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoadingAction, setIsLoadingAction] = useState(false);

  const userId = Number(params.id);

  useEffect(() => {
    if (userId) {
      getUser(userId);
    }
  }, [userId]);

  const handleDelete = async () => {
    setIsLoadingAction(true);
    try {
      await deleteUser(userId);
      router.push("/users");
    } finally {
      setIsLoadingAction(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleBanToggle = async () => {
    setIsLoadingAction(true);
    try {
      if (user?.roles.includes(RoleEnum.BANNED)) {
        await unbanUser(userId);
      } else {
        await banUser(userId);
      }
      await getUser(userId);
    } finally {
      setIsLoadingAction(false);
      setIsBanDialogOpen(false);
    }
  };

  const handleUpdate = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    roles: RoleEnum[];
  }) => {
    setIsLoadingAction(true);
    try {
      await updateUser({
        id: userId,
        ...data,
      });
      await getUser(userId);
      setIsEditDialogOpen(false);
    } finally {
      setIsLoadingAction(false);
    }
  };

  if (isUserLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoaderCircleIcon className="animate-spin h-12 w-12 text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <p className="text-lg text-gray-500">Utilisateur introuvable</p>
        <Button variant="outline" onClick={() => router.back()}>
          Retour
        </Button>
      </div>
    );
  }

  const isBanned = user.roles.includes(RoleEnum.BANNED);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Retour
        </Button>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Détails de l'utilisateur</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsEditDialogOpen(true)}>
            <PencilIcon className="h-4 w-4 mr-2" />
            Modifier
          </Button>
          <Button
            variant="outline"
            className={
              isBanned
                ? "text-green-600 hover:text-green-700"
                : "text-orange-600 hover:text-orange-700"
            }
            onClick={() => setIsBanDialogOpen(true)}
            disabled={userId === authUser?.id}
          >
            <BanIcon className="h-4 w-4 mr-2" />
            {isBanned ? "Débannir" : "Bannir"}
          </Button>
          <Button
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
            disabled={userId === authUser?.id}
          >
            <TrashIcon className="h-4 w-4 mr-2" />
            Supprimer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-xl font-semibold mb-4">
            Informations personnelles
          </h2>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <span className="font-medium text-gray-500">Prénom:</span>
              <span className="col-span-2">{user.firstName}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="font-medium text-gray-500">Nom:</span>
              <span className="col-span-2">{user.lastName}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="font-medium text-gray-500">Email:</span>
              <span className="col-span-2">{user.email}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="font-medium text-gray-500">Rôle:</span>
              <div className="col-span-2">
                <RoleBadge roles={user.roles} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <UpdateUserDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        user={{
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          roles: user.roles,
        }}
        onSubmit={handleUpdate}
        isLoading={isLoadingAction}
      />

      <DeleteUserDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        isLoading={isLoadingAction}
        user={{
          firstName: user.firstName,
          lastName: user.lastName,
        }}
      />

      <BanUnbanUserDialog
        open={isBanDialogOpen}
        onOpenChange={setIsBanDialogOpen}
        onConfirm={handleBanToggle}
        isLoading={isLoadingAction}
        user={{
          firstName: user.firstName,
          lastName: user.lastName,
        }}
        isBanned={isBanned}
      />
    </div>
  );
}
