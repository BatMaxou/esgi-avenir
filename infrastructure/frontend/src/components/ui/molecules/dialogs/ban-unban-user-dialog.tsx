"use client";

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
import { LoaderCircleIcon } from "lucide-react";

interface BanUnbanUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
  user: {
    firstName: string;
    lastName: string;
  };
  isBanned: boolean;
}

export function BanUnbanUserDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading,
  user,
  isBanned,
}: BanUnbanUserDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isBanned ? "Débannir" : "Bannir"} l&apos;utilisateur
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isBanned
              ? `Êtes-vous sûr de vouloir débannir ${user.firstName} ${user.lastName}?`
              : `Êtes-vous sûr de vouloir bannir ${user.firstName} ${user.lastName}?`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className={
              isBanned
                ? "bg-green-600 hover:bg-green-700"
                : "bg-orange-600 hover:bg-orange-700"
            }
          >
            {isLoading && (
              <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isBanned ? "Débannir" : "Bannir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
