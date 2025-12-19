"use client";

import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/atoms/dialog";
import { UpdateStockForm } from "../forms/update-stock-form";
import { Stock } from "../../../../../../../domain/entities/Stock";

export function UpdateStockDialog({
  stock,
  open,
  setOpen,
}: {
  stock: Stock;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const t = useTranslations("components.dialogs.stock.update");

  const handleSuccess = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <UpdateStockForm stock={stock} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
