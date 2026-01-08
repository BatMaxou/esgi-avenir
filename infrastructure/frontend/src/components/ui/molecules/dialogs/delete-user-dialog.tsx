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
import { useTranslations } from "next-intl";

interface DeleteUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
  user: {
    firstName: string;
    lastName: string;
  };
}

export function DeleteUserDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading,
  user,
}: DeleteUserDialogProps) {
  const t = useTranslations("components.dialogs.user.delete");

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("description")} {user.firstName} {user.lastName}
            &nbsp;{t("descriptionEnd")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {t("cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading && (
              <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />
            )}
            {t("delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
