"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/atoms/dialog";
import AddAccountForm from "../forms/add-account-form";
import { useSettings } from "@/contexts/SettingsContext";
import { useEffect } from "react";

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

  const { savingsRate, isSettingsLoading, getSavingsRate } = useSettings();

  useEffect(() => {
    if (open && isSavings) {
      getSavingsRate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, isSavings]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isSavings ? "Créer un compte épargne" : "Créer un compte courant"}
          </DialogTitle>
          <DialogDescription>
            {isSavings ? (
              <>
                <span>
                  Ajoutez un nouveau compte épargne à votre liste de comptes.
                </span>
                <br />
                <span>
                  Le taux d'épargne actuel est de :{" "}
                  <b>
                    {isSettingsLoading ? "Chargement..." : `${savingsRate}%`}
                  </b>
                </span>
              </>
            ) : (
              <span>
                Ajoutez un nouveau compte courant à votre liste de comptes.
              </span>
            )}
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
