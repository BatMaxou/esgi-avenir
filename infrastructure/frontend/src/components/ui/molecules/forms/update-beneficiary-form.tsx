"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/atoms/button";
import { Input } from "@/components/ui/atoms/input";
import { Label } from "@/components/ui/atoms/label";
import { useBeneficiaries } from "@/contexts/BeneficiariesContext";
import { toast } from "sonner";
import { FilledButton } from "../buttons/filled-button";
import { Beneficiary } from "../../../../../../../domain/entities/Beneficiary";
import { DeleteBeneficiaryAlert } from "../alerts/delete-beneficiary-alert";

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
      toast.error("Le nom du bénéficiaire est requis");
      return;
    }

    if (!beneficiary.id) {
      toast.error("Identifiant du bénéficiaire manquant");
      return;
    }

    const updatedBeneficiary = await updateBeneficiary({
      id: beneficiary.id,
      name: name.trim(),
    });

    if (updatedBeneficiary) {
      toast.success("Bénéficiaire modifié avec succès");
      onUpdateSuccess?.();
    } else {
      toast.error("Erreur lors de la modification du bénéficiaire");
    }
  };

  const handleCancel = () => {
    handleReset();
    onUpdateCancel?.();
  };

  const handleDelete = async () => {
    if (!beneficiary.id) {
      toast.error("Bénéficiaire non trouvé");
      return;
    }
    const deleteBeneficiaryResult = await deleteBeneficiary(beneficiary.id);
    if (deleteBeneficiaryResult) {
      toast.success("Bénéficiaire supprimé avec succès");
      onDeleteSuccess?.();
      setOpenDeleteDialog(false);
    } else {
      toast.error("Erreur lors de la suppression du bénéficiaire");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="w-full space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Nom du bénéficiaire</Label>
          <Input
            id="name"
            type="text"
            placeholder="Ex: Jean Dupont"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isBeneficiaryLoading}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="iban">IBAN</Label>
          <Input
            id="iban"
            type="text"
            value={beneficiary.account?.iban.value || ""}
            disabled
            className="w-full bg-gray-100"
          />
          <p className="text-sm text-gray-500">
            L'IBAN ne peut pas être modifié
          </p>
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
              Annuler
            </Button>
            <FilledButton
              type="submit"
              disabled={isBeneficiaryLoading}
              className="flex-1"
              label={
                isBeneficiaryLoading ? "Modification en cours..." : "Modifier"
              }
            />
          </div>
          <div className="w-full">
            <FilledButton
              type="button"
              disabled={isBeneficiaryLoading}
              icon="fluent:delete-20-regular"
              iconPosition="start"
              className="w-full"
              label="Supprimer définitivement"
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
