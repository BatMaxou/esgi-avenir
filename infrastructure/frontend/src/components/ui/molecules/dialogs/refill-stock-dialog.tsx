"use client";

import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/atoms/dialog";
import { RefillStockForm } from "../forms/refill-stock-form";
import { Stock } from "../../../../../../../domain/entities/Stock";

export function RefillStockDialog({
  stock,
  open,
  setOpen,
}: {
  stock: Stock;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const t = useTranslations("components.dialogs.stock.refill");

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
        <RefillStockForm stock={stock} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
