"use client";

import { useState } from "react";
import { Button } from "@/components/ui/atoms/button";
import { Input } from "@/components/ui/atoms/input";
import { Label } from "@/components/ui/atoms/label";
import { useAccounts } from "@/contexts/AccountsContext";
import { FilledButton } from "../buttons/filled-button";

interface AddAccountFormProps {
  isSavings: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function AddAccountForm({
  isSavings,
  onSuccess,
  onCancel,
}: AddAccountFormProps) {
  const [name, setName] = useState("");
  const { createAccount, isAccountsLoading } = useAccounts();

  const handleReset = () => {
    setName("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      return;
    }

    const newAccount = await createAccount({
      name: name.trim(),
      isSavings,
    });

    if (newAccount) {
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
        <Label htmlFor="name">Nom du compte</Label>
        <Input
          id="name"
          type="text"
          placeholder={isSavings ? "Ex: Livret A" : "Ex: Compte principal"}
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isAccountsLoading}
          className="w-full"
        />
      </div>

      <div className="flex gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isAccountsLoading}
          className="flex-1"
        >
          Annuler
        </Button>
        <FilledButton
          type="submit"
          disabled={isAccountsLoading}
          className="flex-1"
          label={isAccountsLoading ? "Création en cours..." : "Créer"}
        />
      </div>
    </form>
  );
}
