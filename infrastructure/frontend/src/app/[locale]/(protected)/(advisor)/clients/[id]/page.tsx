"use client";

import { useEffect, useMemo, useState } from "react";
import { notFound, useParams } from "next/navigation";
import { useUsers } from "@/contexts/UsersContext";
import { Button } from "@/components/ui/atoms/button";
import {
  LoaderCircleIcon,
  ArrowLeftIcon,
  PencilIcon,
  BanIcon,
  TrashIcon,
} from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { RoleEnum } from "../../../../../../../../../domain/enums/RoleEnum";
import { UpdateUserDialog } from "@/components/ui/molecules/dialogs/update-user-dialog";
import { DeleteUserDialog } from "@/components/ui/molecules/dialogs/delete-user-dialog";
import { BanUnbanUserDialog } from "@/components/ui/molecules/dialogs/ban-unban-user-dialog";
import { RoleBadge } from "@/components/ui/molecules/badges/role-badge";
import { useAuth } from "@/contexts/AuthContext";
import { UserInformationsCard } from "@/components/ui/molecules/cards/user-informations-card";
import { User } from "../../../../../../../../../domain/entities/User";

export default function UserDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user: authUser } = useAuth();
  const { getUser, user, isUserLoading, updateUser } = useUsers();

  const [isUserFetched, setIsUserFetched] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoadingAction, setIsLoadingAction] = useState(false);
  const isBanned = useMemo(
    () => user?.roles.includes(RoleEnum.BANNED) || false,
    [user]
  );

  const userId = Number(params.id);

  useEffect(() => {
    if (userId) {
      getUser(userId);
      setIsUserFetched(true);
    }
  }, [userId]);

  useEffect(() => {
    if (isUserFetched && !isUserLoading && !user) {
      notFound();
    }
  }, [isUserFetched, isUserLoading, user]);

  if (isUserLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoaderCircleIcon className="animate-spin h-12 w-12 text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoaderCircleIcon className="animate-spin h-12 w-12 text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Retour
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-6">
        <UserInformationsCard
          user={
            user as Pick<User, "firstName" | "lastName" | "email" | "roles">
          }
        />
      </div>
    </div>
  );
}
