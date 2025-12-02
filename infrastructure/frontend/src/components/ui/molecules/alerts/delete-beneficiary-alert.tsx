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
import { Beneficiary } from "../../../../../../../domain/entities/Beneficiary";

interface DeleteBeneficiaryAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  beneficiary: Beneficiary;
  onConfirm: () => void;
}

export function DeleteBeneficiaryAlert({
  open,
  onOpenChange,
  beneficiary,
  onConfirm,
}: DeleteBeneficiaryAlertProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer définitivement le bénéficiaire{" "}
            <span className="font-semibold text-gray-900">
              {beneficiary.name}
            </span>{" "}
            ?
            <br />
            <br />
            Cette action est <span className="font-semibold">
              irréversible
            </span>{" "}
            et supprimera toutes les informations associées à ce bénéficiaire.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            Supprimer définitivement
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
