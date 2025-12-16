"use client";

import { Skeleton } from "@/components/ui/atoms/skeleton";
import { User } from "../../../../../../../domain/entities/User";
import { useAuth } from "@/contexts/AuthContext";
import { RoleEnum } from "../../../../../../../domain/enums/RoleEnum";
import { RoleBadge } from "../badges/role-badge";
import { is } from "zod/v4/locales";
import { Separator } from "../../atoms/separator";

interface UserInformationsCardProps {
  user: Pick<User, "firstName" | "lastName" | "email" | "roles">;
  isUserLoading?: boolean;
}

export function UserInformationsCard({
  user,
  isUserLoading,
}: UserInformationsCardProps) {
  const { user: authUser } = useAuth();
  return (
    <div className="bg-white p-6 rounded-lg shadow border">
      <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>
      <Separator orientation="horizontal" className="my-4" />
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <span className="font-medium text-gray-500">Prénom:</span>
          {isUserLoading ? (
            <Skeleton className="h-4 w-24 mb-1" />
          ) : (
            <span className="col-span-2">{user.firstName}</span>
          )}
        </div>
        <div className="grid grid-cols-3 gap-2">
          <span className="font-medium text-gray-500">Nom:</span>
          {isUserLoading ? (
            <Skeleton className="h-4 w-24 mb-1" />
          ) : (
            <span className="col-span-2">{user.lastName}</span>
          )}
        </div>
        <div className="grid grid-cols-3 gap-2">
          <span className="font-medium text-gray-500">Email:</span>
          {isUserLoading ? (
            <Skeleton className="h-4 w-24 mb-1" />
          ) : (
            <span className="col-span-2">{user.email.value}</span>
          )}
        </div>
        {authUser && authUser.roles.includes(RoleEnum.DIRECTOR) && (
          <div className="grid grid-cols-3 gap-2">
            <span className="font-medium text-gray-500">Rôle:</span>
            {isUserLoading ? (
              <div className="flex flex-row justify-start gap-2 col-span-2">
                <Skeleton className="h-4 w-8 mb-1" />
                <Skeleton className="h-4 w-8 mb-1" />
              </div>
            ) : (
              <div className="col-span-2">
                <RoleBadge roles={user.roles} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
