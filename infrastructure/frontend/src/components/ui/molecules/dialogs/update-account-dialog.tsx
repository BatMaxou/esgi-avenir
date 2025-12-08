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
          <DialogTitle>Modifier le compte</DialogTitle>
          <DialogDescription>
            Modifiez le nom de votre compte.
          </DialogDescription>
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
