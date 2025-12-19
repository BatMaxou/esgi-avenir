"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { useBankCredits } from "@/contexts/BankCreditContext";
import { Button } from "@/components/ui/atoms/button";
import { LoaderCircleIcon, ArrowLeftIcon } from "lucide-react";
import { BankCreditInformationsCard } from "@/components/ui/molecules/cards/bank-credit-informations-card";
import BankCreditPaymentsList from "@/components/ui/molecules/lists/bank-credit-payments-list";
import { useTranslations } from "next-intl";

export default function CreditDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const {
    getBankCreditPayments,
    bankCredit,
    payments,
    isBankCreditsLoading,
    isPaymentsLoading,
  } = useBankCredits();
  const t = useTranslations("page.credits.details");
  const tButton = useTranslations("buttons");

  const [isCreditFetched, setIsCreditFetched] = useState(false);

  const creditId = Number(params.id);

  useEffect(() => {
    if (creditId) {
      getBankCreditPayments(creditId);
      setIsCreditFetched(true);
    }
  }, [creditId]);

  useEffect(() => {
    if (isCreditFetched && !isBankCreditsLoading && !bankCredit) {
      notFound();
    }
  }, [isCreditFetched, isBankCreditsLoading, bankCredit]);

  if (isBankCreditsLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoaderCircleIcon className="animate-spin h-12 w-12 text-primary" />
      </div>
    );
  }

  if (!bankCredit) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoaderCircleIcon className="animate-spin h-12 w-12 text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          {tButton("back")}
        </Button>
      </div>
      <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
        <div className="flex-1 gap-6">
          <h2 className="text-2xl font-semibold mt-4 mb-6">
            {t("paymentsTitle")}
          </h2>
          <BankCreditPaymentsList
            payments={payments}
            isLoading={isPaymentsLoading}
          />
        </div>
        <div className="flex-1 gap-6">
          <BankCreditInformationsCard bankCredit={bankCredit} />
        </div>
      </div>
    </div>
  );
}
