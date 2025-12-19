"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/atoms/button";
import { Input } from "@/components/ui/atoms/input";
import { Label } from "@/components/ui/atoms/label";
import { useBeneficiaries } from "@/contexts/BeneficiariesContext";
import { toast } from "sonner";
import { FilledButton } from "../buttons/filled-button";
import { Beneficiary } from "../../../../../../../domain/entities/Beneficiary";
import { DeleteBeneficiaryAlert } from "../alerts/delete-beneficiary-alert";
import { showErrorToast, showSuccessToast } from "@/lib/toast";

interface UpdateBeneficiaryFormProps {
  beneficiary: Beneficiary;
  onUpdateSuccess?: () => void;
  onUpdateCancel?: () => void;
  onDeleteSuccess?: () => void;
}

export default function UpdateBeneficiaryForm({
  beneficiary,
  onUpdateSuccess,
  onUpdateCancel,
  onDeleteSuccess,
}: UpdateBeneficiaryFormProps) {
  const t = useTranslations("components.forms.updateBeneficiary");
  const [name, setName] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const { updateBeneficiary, deleteBeneficiary, isBeneficiaryLoading } =
    useBeneficiaries();

  useEffect(() => {
    if (beneficiary) {
      setName(beneficiary.name || "");
    }
  }, [beneficiary]);

  const handleReset = () => {
    setName(beneficiary.name || "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showErrorToast(t("nameRequired"));
      return;
    }

    if (!beneficiary.id) {
      showErrorToast(t("idMissing"));
      return;
    }

    const updatedBeneficiary = await updateBeneficiary({
      id: beneficiary.id,
      name: name.trim(),
    });

    if (updatedBeneficiary) {
      showSuccessToast(t("successUpdate"));
      onUpdateSuccess?.();
    } else {
      showErrorToast(t("errorUpdate"));
    }
  };

  const handleCancel = () => {
    handleReset();
    onUpdateCancel?.();
  };

  const handleDelete = async () => {
    if (!beneficiary.id) {
      showErrorToast(t("notFound"));
      return;
    }
    const deleteBeneficiaryResult = await deleteBeneficiary(beneficiary.id);
    if (deleteBeneficiaryResult) {
      showSuccessToast(t("successDelete"));
      onDeleteSuccess?.();
      setOpenDeleteDialog(false);
    } else {
      showErrorToast(t("errorDelete"));
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="w-full space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">{t("name")}</Label>
          <Input
            id="name"
            type="text"
            placeholder={t("namePlaceholder")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isBeneficiaryLoading}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="iban">{t("iban")}</Label>
          <Input
            id="iban"
            type="text"
            value={beneficiary.account?.iban.value || ""}
            disabled
            className="w-full bg-gray-100"
          />
          <p className="text-sm text-gray-500">{t("ibanNotEditable")}</p>
        </div>

        <div className="flex flex-col gap-4 pt-4">
          <div className="flex flex-row justify-between items-center w-full gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isBeneficiaryLoading}
              className="flex-1"
            >
              {t("cancel")}
            </Button>
            <FilledButton
              type="submit"
              disabled={isBeneficiaryLoading}
              className="flex-1"
              label={isBeneficiaryLoading ? t("updating") : t("update")}
            />
          </div>
          <div className="w-full">
            <FilledButton
              type="button"
              disabled={isBeneficiaryLoading}
              icon="fluent:delete-20-regular"
              iconPosition="start"
              className="w-full"
              label={t("delete")}
              onClick={() => setOpenDeleteDialog(true)}
            />
          </div>
        </div>
      </form>

      <DeleteBeneficiaryAlert
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        beneficiary={beneficiary}
        onConfirm={handleDelete}
      />
    </>
  );
}
