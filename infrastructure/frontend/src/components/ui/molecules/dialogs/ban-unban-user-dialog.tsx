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
  const t = useTranslations("components.dialogs.user.ban");

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isBanned ? t("titleUnban") : t("titleBan")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isBanned
              ? `${t("descriptionUnban")} ${user.firstName} ${user.lastName}?`
              : `${t("descriptionBan")} ${user.firstName} ${user.lastName}?`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {t("cancel")}
          </AlertDialogCancel>
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
            {isBanned ? t("unban") : t("ban")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
