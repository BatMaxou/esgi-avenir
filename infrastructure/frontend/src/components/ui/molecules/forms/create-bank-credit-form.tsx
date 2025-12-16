"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/atoms/button";
import { Input } from "@/components/ui/atoms/input";
import { Label } from "@/components/ui/atoms/label";
import { FilledButton } from "../buttons/filled-button";
import { useBankCredits } from "@/contexts/BankCreditContext";

const createBankCreditSchema = z.object({
  amount: z.number().positive("Le montant doit être un nombre positif"),
  interestPercentage: z
    .number()
    .min(0, "Le taux d'intérêt doit être entre 0 et 100")
    .max(100, "Le taux d'intérêt doit être entre 0 et 100"),
  insurancePercentage: z
    .number()
    .min(0, "Le taux d'assurance doit être entre 0 et 100")
    .max(100, "Le taux d'assurance doit être entre 0 et 100"),
  durationInMonths: z
    .number()
    .int("La durée doit être un nombre entier")
    .positive("La durée doit être un nombre entier positif"),
});

type CreateBankCreditFormData = z.infer<typeof createBankCreditSchema>;

interface CreateBankCreditFormProps {
  accountId: number;
  ownerId: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function CreateBankCreditForm({
  accountId,
  ownerId,
  onSuccess,
  onCancel,
}: CreateBankCreditFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateBankCreditFormData>({
    resolver: zodResolver(createBankCreditSchema),
    mode: "onBlur",
    defaultValues: {
      amount: undefined,
      interestPercentage: undefined,
      insurancePercentage: undefined,
      durationInMonths: undefined,
    },
  });

  const { createBankCredit, isBankCreditsLoading } = useBankCredits();

  const onSubmit = async (data: CreateBankCreditFormData) => {
    const response = await createBankCredit({
      accountId,
      ownerId,
      amount: data.amount,
      interestPercentage: data.interestPercentage,
      insurancePercentage: data.insurancePercentage,
      durationInMonths: data.durationInMonths,
    });

    if (response) {
      onSuccess?.();
      reset();
    }
  };

  const handleCancel = () => {
    onCancel?.();
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
      <div className="space-y-2">
        <Label htmlFor="amount">Montant (€)</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          placeholder="Ex: 50000"
          {...register("amount", { valueAsNumber: true })}
          disabled={isSubmitting || isBankCreditsLoading}
          className="w-full"
        />
        {errors.amount && (
          <p className="text-sm text-red-500">{errors.amount.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="interestPercentage">Taux d'intérêt (%)</Label>
        <Input
          id="interestPercentage"
          type="number"
          step="0.01"
          min="0"
          max="100"
          placeholder="Ex: 0.5"
          {...register("interestPercentage", { valueAsNumber: true })}
          disabled={isSubmitting || isBankCreditsLoading}
          className="w-full"
        />
        {errors.interestPercentage && (
          <p className="text-sm text-red-500">
            {errors.interestPercentage.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="insurancePercentage">Taux d'assurance (%)</Label>
        <Input
          id="insurancePercentage"
          type="number"
          step="0.01"
          min="0"
          max="100"
          placeholder="Ex: 0.1"
          {...register("insurancePercentage", { valueAsNumber: true })}
          disabled={isSubmitting || isBankCreditsLoading}
          className="w-full"
        />
        {errors.insurancePercentage && (
          <p className="text-sm text-red-500">
            {errors.insurancePercentage.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="durationInMonths">Durée (mois)</Label>
        <Input
          id="durationInMonths"
          type="number"
          step="1"
          min="1"
          placeholder="Ex: 120"
          {...register("durationInMonths", { valueAsNumber: true })}
          disabled={isSubmitting || isBankCreditsLoading}
          className="w-full"
        />
        {errors.durationInMonths && (
          <p className="text-sm text-red-500">
            {errors.durationInMonths.message}
          </p>
        )}
      </div>

      <div className="flex gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isSubmitting || isBankCreditsLoading}
          className="flex-1"
        >
          Annuler
        </Button>
        <FilledButton
          type="submit"
          disabled={isSubmitting || isBankCreditsLoading}
          className="flex-1"
          label={
            isSubmitting || isBankCreditsLoading
              ? "Création en cours..."
              : "Créer"
          }
        />
      </div>
    </form>
  );
}
