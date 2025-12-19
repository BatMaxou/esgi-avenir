"use client";

import { useState } from "react";
import { Button } from "@/components/ui/atoms/button";
import { Input } from "@/components/ui/atoms/input";
import { Label } from "@/components/ui/atoms/label";
import { useAccounts } from "@/contexts/AccountsContext";
import { FilledButton } from "../buttons/filled-button";
import { HydratedAccount } from "../../../../../../../domain/entities/Account";
import { toast } from "sonner";
import { showErrorToast } from "@/lib/toast";
import { useTranslations } from "next-intl";

interface UpdateAccountFormProps {
  account: HydratedAccount;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function UpdateAccountForm({
  account,
  onSuccess,
  onCancel,
}: UpdateAccountFormProps) {
  const t = useTranslations("components.forms.account");
  const [name, setName] = useState(account.name);
  const { updateAccount, isAccountLoading } = useAccounts();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showErrorToast("Le nom du compte ne peut pas être vide.");
      return;
    }

    if (!account.id) {
      showErrorToast("Impossible de trouver le compte.");
      return;
    }

    const updatedAccount = await updateAccount(account.id, {
      name: name.trim(),
    });

    if (updatedAccount) {
      onSuccess?.();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">{t("name")}</Label>
        <Input
          id="name"
          type="text"
          placeholder={t("placeholderCurrent")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isAccountLoading}
          className="w-full"
        />
      </div>

      <div className="flex gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isAccountLoading}
          className="flex-1"
        >
          {t("cancel")}
        </Button>
        <FilledButton
          type="submit"
          disabled={isAccountLoading}
          className="flex-1"
          label={isAccountLoading ? t("updating") : t("update")}
        />
      </div>
    </form>
  );
}
