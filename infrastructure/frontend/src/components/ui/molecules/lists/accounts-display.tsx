"use client";

import { useAccounts } from "@/contexts/AccountsContext";
import { Item } from "@/components/ui/atoms/item";
import { Skeleton } from "@/components/ui/atoms/skeleton";
import { LoadingLink } from "@/components/ui/molecules/links/loading-link";
import { HydratedAccount } from "../../../../../../../domain/entities/Account";
import { FilledButton } from "../buttons/filled-button";
import AddAccountDialog from "../dialogs/add-account-dialog";
import { useState } from "react";

type Props = {
  displayLength?: number;
  displayStyle?: "grid" | "list";
  separatedByTypes?: boolean;
};

export function AccountsDisplay({
  displayLength,
  displayStyle = "list",
  separatedByTypes = false,
}: Props) {
  const { accounts, isAccountsLoading } = useAccounts();
  const [openAddAccountModal, setOpenAddAccountModal] = useState(false);
  const [isSavingsAccount, setIsSavingsAccount] = useState(false);

  const handleOpenAccountModal = (isSavings: boolean) => {
    setIsSavingsAccount(isSavings);
    setOpenAddAccountModal(true);
  };

  if (separatedByTypes) {
    const currentAccounts = accounts.filter((a) => !a.isSavings);
    const savingsAccounts = accounts.filter((a) => a.isSavings);

    return (
      <>
        <div className="space-y-8">
          <div>
            <h2 className="text-lg font-bold mb-4">Comptes courants</h2>
            {currentAccounts.length === 0 ? (
              <div>
                <p>Vous n'avez pas encore de compte courant.</p>
                <FilledButton
                  label="Ajouter un compte courant"
                  onClick={() => handleOpenAccountModal(false)}
                  className="mt-4"
                />
              </div>
            ) : (
              <>
                {displayStyle === "grid" ? (
                  <AccountGrid
                    accounts={currentAccounts}
                    isLoading={isAccountsLoading}
                  />
                ) : (
                  <AccountList
                    accounts={currentAccounts}
                    isLoading={isAccountsLoading}
                  />
                )}
              </>
            )}
          </div>
          <div>
            <h2 className="text-lg font-bold mb-4">Comptes épargne</h2>
            {savingsAccounts.length === 0 ? (
              <div>
                <p>Vous n'avez pas encore de compte épargne.</p>
                <FilledButton
                  label="Ajouter un compte épargne"
                  onClick={() => handleOpenAccountModal(true)}
                  className="mt-4"
                />
              </div>
            ) : (
              <>
                {displayStyle === "grid" ? (
                  <AccountGrid
                    accounts={savingsAccounts}
                    isLoading={isAccountsLoading}
                  />
                ) : (
                  <AccountList
                    accounts={savingsAccounts}
                    isLoading={isAccountsLoading}
                  />
                )}
              </>
            )}
          </div>
        </div>
        <AddAccountDialog
          open={openAddAccountModal}
          onOpenChange={setOpenAddAccountModal}
          isSavings={isSavingsAccount}
        />
      </>
    );
  }

  const sortedAccounts = [...accounts].sort((a, b) => {
    if (a.isSavings === b.isSavings) return 0;
    return a.isSavings ? 1 : -1;
  });

  const displayedAccounts = displayLength
    ? sortedAccounts.slice(0, displayLength)
    : sortedAccounts;

  return displayStyle === "grid" ? (
    <AccountGrid accounts={displayedAccounts} isLoading={isAccountsLoading} />
  ) : (
    <AccountList accounts={displayedAccounts} isLoading={isAccountsLoading} />
  );
}

const AccountGrid = ({
  accounts,
  isLoading,
}: {
  accounts: HydratedAccount[];
  isLoading: boolean;
}) => {
  return <></>;
};

const AccountList = ({
  accounts,
  isLoading,
}: {
  accounts: HydratedAccount[];
  isLoading: boolean;
}) => {
  return (
    <div className="w-full">
      {isLoading ? (
        <ul className="flex flex-col space-y-2">
          {[1, 2, 3].map((key) => (
            <Item
              key={key}
              className="p-4 border border-gray-300 rounded-lg shadow-sm bg-white flex flex-row justify-between items-center"
            >
              <div className="">
                <Skeleton className="h-4 w-48 mb-1" />
                <Skeleton className="h-4 w-64" />
              </div>
              <Skeleton className="h-5 w-8" />
            </Item>
          ))}
        </ul>
      ) : (
        <ul className="flex flex-col space-y-2">
          {accounts.map((account) => (
            <LoadingLink
              href={`/accounts/details/${account.id}`}
              key={account.id}
            >
              <Item
                key={account.id}
                className="p-4 border border-gray-300 rounded-lg shadow-sm bg-white flex flex-row justify-between items-center hover:bg-gray-50 cursor-pointer"
              >
                <div className="">
                  <h3 className="text-md font-semibold">
                    {account.isSavings ? "Compte épargne" : "Compte courant"} -{" "}
                    {account.name}
                  </h3>
                  <p className="text-gray-600">{account.iban.value}</p>
                </div>
                <p
                  className={
                    account.amount < 0
                      ? "text-red-600 font-extrabold text-base"
                      : "text-green-600 font-extrabold text-base"
                  }
                >
                  {account.amount < 0 ? "-" : "+"}
                  {account.amount.toFixed(2)} €
                </p>
              </Item>
            </LoadingLink>
          ))}
        </ul>
      )}
    </div>
  );
};
