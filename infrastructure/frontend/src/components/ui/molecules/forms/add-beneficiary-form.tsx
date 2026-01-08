"use client";

import { useState } from "react";
import { Button } from "@/components/ui/atoms/button";
import { Input } from "@/components/ui/atoms/input";
import { Label } from "@/components/ui/atoms/label";
import { useBeneficiaries } from "@/contexts/BeneficiariesContext";
import { toast } from "sonner";
import { FilledButton } from "../buttons/filled-button";
import { useTranslations } from "next-intl";

interface AddBeneficiaryFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function AddBeneficiaryForm({
  onSuccess,
  onCancel,
}: AddBeneficiaryFormProps) {
  const t = useTranslations("components.forms.beneficiary");
  const [name, setName] = useState("");
  const [iban, setIban] = useState("");
  const { createBeneficiary, isBeneficiaryLoading } = useBeneficiaries();

  const handleReset = () => {
    setName("");
    setIban("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      return;
    }

    if (!iban.trim()) {
      return;
    }

    const newBeneficiary = await createBeneficiary({
      name: name.trim(),
      iban: iban.trim(),
    });

    if (newBeneficiary) {
      handleReset();
      onSuccess?.();
    }
  };

  const handleCancel = () => {
    handleReset();
    onCancel?.();
  };

  return (
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
          placeholder={t("ibanPlaceholder")}
          value={iban}
          onChange={(e) => setIban(e.target.value.toUpperCase())}
          disabled={isBeneficiaryLoading}
          className="w-full"
        />
      </div>

      <div className="flex gap-4 pt-4">
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
          label={isBeneficiaryLoading ? t("adding") : t("add")}
        />
      </div>
    </form>
  );
}
