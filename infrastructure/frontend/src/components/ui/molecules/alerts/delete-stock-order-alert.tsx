"use client";

import { useTranslations } from "next-intl";
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
import { Stock } from "../../../../../../../domain/entities/Stock";

interface DeleteStockOrderAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  stock: Stock | undefined;
  amount: number;
  isDeleting: boolean;
}

export function DeleteStockOrderAlert({
  open,
  onOpenChange,
  onConfirm,
  stock,
  amount,
  isDeleting,
}: DeleteStockOrderAlertProps) {
  const t = useTranslations("components.dialogs.stockOrder.delete");

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("description")} <strong>{stock?.name}</strong>{" "}
            {t("descriptionAmount")} <strong>{amount}€</strong> ?
            <br />
            <br />
            {t("warning")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting} className="cursor-pointer">
            {t("cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 cursor-pointer"
          >
            {isDeleting ? t("deleting") : t("confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
