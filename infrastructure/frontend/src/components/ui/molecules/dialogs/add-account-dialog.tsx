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
import { useTranslations } from "next-intl";

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
  const t = useTranslations("components.dialogs.account.add");

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
            {isSavings ? t("titleSavings") : t("titleCurrent")}
          </DialogTitle>
          <DialogDescription>
            {isSavings ? (
              <>
                <span>{t("descriptionSavings")}</span>
                <br />
                <span>
                  {t("savingsRateLabel")}{" "}
                  <b>{isSettingsLoading ? t("loading") : `${savingsRate}%`}</b>
                </span>
              </>
            ) : (
              <span>{t("descriptionCurrent")}</span>
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
