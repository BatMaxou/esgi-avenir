"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/atoms/dialog";
import { FilledButton } from "../buttons/filled-button";
import { CreateStockForm } from "../forms/create-stock-form";

export function CreateStockDialog() {
  const t = useTranslations("components.dialogs.stock.create");
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <FilledButton
          label={t("button")}
          icon="mdi:plus"
          iconPosition="start"
        />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <CreateStockForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
