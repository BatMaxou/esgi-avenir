"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/atoms/dialog";
import AddAccountForm from "../forms/add-account-form";

interface AddAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isSavings: boolean;
}

export default function AddAccountDialog({
  open,
  onOpenChange,
  isSavings,
}: AddAccountDialogProps) {
  const handleSuccess = () => {
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isSavings ? "Créer un compte épargne" : "Créer un compte courant"}
          </DialogTitle>
          <DialogDescription>
            {isSavings
              ? "Ajoutez un nouveau compte épargne à votre liste de comptes."
              : "Ajoutez un nouveau compte courant à votre liste de comptes."}
          </DialogDescription>
        </DialogHeader>
        <AddAccountForm
          isSavings={isSavings}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
}
