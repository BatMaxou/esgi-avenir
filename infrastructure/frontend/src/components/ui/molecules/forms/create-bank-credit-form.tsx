"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/atoms/button";
import { Input } from "@/components/ui/atoms/input";
import { Label } from "@/components/ui/atoms/label";
import { FilledButton } from "../buttons/filled-button";
import { useBankCredits } from "@/contexts/BankCreditContext";

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
  const t = useTranslations("components.forms.bankCredit");

  const createBankCreditSchema = z.object({
    amount: z.number().positive({ message: t("amountError") }),
    interestPercentage: z
      .number()
      .min(0, { message: t("interestRateError") })
      .max(100, { message: t("interestRateError") }),
    insurancePercentage: z
      .number()
      .min(0, { message: t("insuranceRateError") })
      .max(100, { message: t("insuranceRateError") }),
    durationInMonths: z
      .number()
      .int({ message: t("durationErrorInt") })
      .positive({ message: t("durationErrorPositive") }),
  });

  type CreateBankCreditFormData = z.infer<typeof createBankCreditSchema>;

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
        <Label htmlFor="amount">{t("amount")}</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          placeholder={t("amountPlaceholder")}
          {...register("amount", { valueAsNumber: true })}
          disabled={isSubmitting || isBankCreditsLoading}
          className="w-full"
        />
        {errors.amount && (
          <p className="text-sm text-red-500">{errors.amount.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="interestPercentage">{t("interestRate")}</Label>
        <Input
          id="interestPercentage"
          type="number"
          step="0.01"
          min="0"
          max="100"
          placeholder={t("interestRatePlaceholder")}
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
        <Label htmlFor="insurancePercentage">{t("insuranceRate")}</Label>
        <Input
          id="insurancePercentage"
          type="number"
          step="0.01"
          min="0"
          max="100"
          placeholder={t("insuranceRatePlaceholder")}
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
        <Label htmlFor="durationInMonths">{t("duration")}</Label>
        <Input
          id="durationInMonths"
          type="number"
          step="1"
          min="1"
          placeholder={t("durationPlaceholder")}
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
          {t("cancel")}
        </Button>
        <FilledButton
          type="submit"
          disabled={isSubmitting || isBankCreditsLoading}
          className="flex-1"
          label={
            isSubmitting || isBankCreditsLoading ? t("creating") : t("create")
          }
        />
      </div>
    </form>
  );
}
