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
import { useTranslations } from "next-intl";

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
  const t = useTranslations("components.dialogs.beneficiary.delete");

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("description")}{" "}
            <span className="font-semibold text-gray-900">
              {beneficiary.name}
            </span>{" "}
            ?
            <br />
            <br />
            {t("descriptionIrreversible")}{" "}
            <span className="font-semibold">{t("irreversible")}</span>{" "}
            {t("descriptionEnd")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {t("confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
