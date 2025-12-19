"use client";

import { useTranslations } from "next-intl";
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
  consultation?: boolean;
};

export function AccountsDisplay({
  displayLength,
  displayStyle = "list",
  separatedByTypes = false,
  consultation = false,
}: Props) {
  const t = useTranslations("components.lists.accounts");
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
            <h2 className="text-lg font-bold mb-4">{t("currentAccounts")}</h2>
            {currentAccounts.length === 0 ? (
              <div>
                <p>{t("noCurrentAccount")}</p>
                <FilledButton
                  label={t("addCurrentAccount")}
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
                    consultation={consultation}
                  />
                ) : (
                  <AccountList
                    accounts={currentAccounts}
                    isLoading={isAccountsLoading}
                    consultation={consultation}
                  />
                )}
              </>
            )}
          </div>
          <div>
            <h2 className="text-lg font-bold mb-4">{t("savingsAccounts")}</h2>
            {savingsAccounts.length === 0 ? (
              <div>
                <p>{t("noSavingsAccount")}</p>
                <FilledButton
                  label={t("addSavingsAccount")}
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
                    consultation={consultation}
                  />
                ) : (
                  <AccountList
                    accounts={savingsAccounts}
                    isLoading={isAccountsLoading}
                    consultation={consultation}
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
    <AccountGrid
      accounts={displayedAccounts}
      isLoading={isAccountsLoading}
      consultation={consultation}
    />
  ) : (
    <AccountList
      accounts={displayedAccounts}
      isLoading={isAccountsLoading}
      consultation={consultation}
    />
  );
}

const AccountGrid = ({
  accounts,
  isLoading,
  consultation,
}: {
  accounts: HydratedAccount[];
  isLoading: boolean;
  consultation: boolean;
}) => {
  return <></>;
};

const AccountList = ({
  accounts,
  isLoading,
  consultation,
}: {
  accounts: HydratedAccount[];
  isLoading: boolean;
  consultation: boolean;
}) => {
  const t = useTranslations("components.lists.accounts");
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
            <>
              {account.id && (
                <LoadingLink
                  href={
                    consultation
                      ? {
                          pathname: "/clients/account/[id]",
                          params: { id: account.id },
                        }
                      : {
                          pathname: "/accounts/details/[id]",
                          params: { id: account.id },
                        }
                  }
                  key={account.id}
                >
                  <Item
                    key={account.id}
                    className="p-4 border border-gray-300 rounded-lg shadow-sm bg-white flex flex-row justify-between items-center hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="">
                      <h3 className="text-md font-semibold">
                        {account.isSavings
                          ? t("savingsAccount")
                          : t("currentAccount")}{" "}
                        - {account.name}
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
                      {account.amount < 0 ? "" : "+"}
                      {account.amount.toFixed(2)} €
                    </p>
                  </Item>
                </LoadingLink>
              )}
            </>
          ))}
        </ul>
      )}
    </div>
  );
};
