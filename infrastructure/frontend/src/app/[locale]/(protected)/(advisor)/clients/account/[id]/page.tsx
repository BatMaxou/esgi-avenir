"use client";

import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/atoms/separator";
import { useAccounts } from "@/contexts/AccountsContext";
import OperationAccountItem from "@/components/ui/molecules/item/operation-account-item";
import { useNavigation } from "@/contexts/NavigationContext";
import { useSettings } from "@/contexts/SettingsContext";
import { AccountInformationsCard } from "@/components/ui/molecules/cards/account-informations-card";
import { LoaderCircleIcon } from "lucide-react";
import CreateBankCreditDialog from "@/components/ui/molecules/dialogs/create-bank-credit-dialog";

export default function AccountDetailsPage() {
  const params = useParams();
  const accountId = params.id as string;
  const { account, accounts, isAccountLoading, getAccount } = useAccounts();
  const { savingsRate, isSettingsLoading, getSavingsRate } = useSettings();
  const { endNavigation } = useNavigation();
  const [isAccountFetched, setAccountFetched] = useState(false);

  useEffect(() => {
    if (accountId) {
      getAccount(Number(accountId));
      setAccountFetched(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId]);

  useEffect(() => {
    if (isAccountFetched && !account && accountId && !isAccountLoading) {
      notFound();
    } else {
      endNavigation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, isAccountLoading, isAccountFetched]);

  useEffect(() => {
    if (account?.isSavings) {
      getSavingsRate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  if (isAccountLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoaderCircleIcon className="animate-spin h-12 w-12 text-primary" />
      </div>
    );
  }

  if (!account) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoaderCircleIcon className="animate-spin h-12 w-12 text-primary" />
      </div>
    );
  }

  if (!accountId) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoaderCircleIcon className="animate-spin h-12 w-12 text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-row justify-start gap-8">
      <div className="flex flex-2 flex-col justify-start items-start  ">
        <h1 className="text-2xl font-bold mb-4">Dernières opérations</h1>
        <div className="bg-white p-6 rounded-lg shadow w-full">
          <div className="flex flex-row justify-between items-center space-y-4">
            <p className="text-gray-600 mb-0 font-bold text-lg">Solde</p>
            <p
              className={`text-2xl font-bold ${
                account.amount < 0 ? "text-red-600" : "text-green-600"
              }`}
            >
              {account.amount < 0 ? "" : "+"}
              {account.amount.toFixed(2)} €
            </p>
          </div>
          <Separator orientation="horizontal" className="mt-4 mb-8" />
          <ul className="space-y-2 overflow-scroll min-h-64 max-h-96 border-b border-gray-200 pr-3">
            {account.operations.map((operation) => (
              <OperationAccountItem operation={operation} key={operation.id} />
            ))}
          </ul>
        </div>
      </div>
      <Separator orientation="vertical" />
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-4">Informations banquaires</h1>
        <AccountInformationsCard
          account={account}
          savingsRate={savingsRate}
          isSettingsLoading={isSettingsLoading}
        />
        <div className="w-full">
          <CreateBankCreditDialog
            accountId={Number(accountId)}
            ownerId={account.ownerId}
          />
        </div>
      </div>
    </div>
  );
}
