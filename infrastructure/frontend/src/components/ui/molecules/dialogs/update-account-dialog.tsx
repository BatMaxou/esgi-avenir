"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/atoms/dialog";
import UpdateAccountForm from "../forms/update-account-form";
import { HydratedAccount } from "../../../../../../../domain/entities/Account";
import { useTranslations } from "next-intl";

interface UpdateAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account: HydratedAccount | null;
}

export default function UpdateAccountDialog({
  open,
  onOpenChange,
  account,
}: UpdateAccountDialogProps) {
  const t = useTranslations("components.dialogs.account.update");

  const handleSuccess = () => {
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  if (!account) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <UpdateAccountForm
          account={account}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
}
