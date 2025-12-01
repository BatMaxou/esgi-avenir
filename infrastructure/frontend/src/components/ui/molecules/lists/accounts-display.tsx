"use client";

import { useAccounts } from "@/contexts/AccountsContext";
import { Item } from "@/components/ui/atoms/item";
import { Skeleton } from "@/components/ui/atoms/skeleton";
import { LoadingLink } from "@/components/ui/molecules/links/loading-link";
import { HydratedAccount } from "../../../../../../../domain/entities/Account";

type Props = {
  displayLength?: number;
  displayStyle?: "grid" | "list";
};

export function AccountsDisplay({
  displayLength,
  displayStyle = "grid",
}: Props) {
  const { accounts, isAccountsLoading } = useAccounts();

  const displayedAccounts = displayLength
    ? accounts.slice(0, displayLength)
    : accounts;

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
    <div>
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
