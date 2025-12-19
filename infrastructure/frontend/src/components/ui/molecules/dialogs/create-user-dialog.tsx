"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/atoms/dialog";
import { FilledButton } from "../buttons/filled-button";
import { CreateUserForm } from "../forms/create-user-form";
import { useTranslations } from "next-intl";

export function CreateUserDialog() {
  const t = useTranslations("components.dialogs.user.create");
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
        <CreateUserForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
