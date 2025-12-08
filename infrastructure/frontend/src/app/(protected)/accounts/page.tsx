"use client";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/atoms/separator";
import { useNavigation } from "@/contexts/NavigationContext";
import { AccountsDisplay } from "@/components/ui/molecules/lists/accounts-display";
import AddAccountDialog from "@/components/ui/molecules/dialogs/add-account-dialog";
import { Item, ItemContent } from "@/components/ui/atoms/item";
import { useAccounts } from "@/contexts/AccountsContext";

export default function AccountsPage() {
  const { endNavigation } = useNavigation();
  const { accounts } = useAccounts();
  const [openAddAccountModal, setOpenAddAccountModal] = useState(false);
  const [isSavingsAccount, setIsSavingsAccount] = useState(false);

  const hasSavingsAccount = accounts.some((account) => account.isSavings);

  useEffect(() => {
    endNavigation();
  }, []);

  const handleOpenAccountModal = (isSavings: boolean) => {
    setIsSavingsAccount(isSavings);
    setOpenAddAccountModal(true);
  };

  // States

  return (
    <>
      <div className="flex flex-row justify-start gap-8">
        <div className="flex-2 overflow-y-scroll">
          <AccountsDisplay displayStyle="list" separatedByTypes={true} />
        </div>
        <Separator orientation="vertical" className="h-full border-2" />
        <div className="flex-1 space-y-4">
          {/* <div className="flex flex-col gap-4 mb-6"> */}
          <Item
            className="bg-white p-4 rounded-lg shadow w-full cursor-pointer hover:bg-gray-50 transition-all ease-in-out text-start"
            onClick={() => handleOpenAccountModal(false)}
          >
            <ItemContent>
              <h2 className="text-lg font-bold">Créer un compte courant</h2>
            </ItemContent>
          </Item>

          <Item
            className={`bg-white p-4 rounded-lg shadow w-full text-start ${
              hasSavingsAccount
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer hover:bg-gray-50 transition-all ease-in-out"
            }`}
            onClick={() => !hasSavingsAccount && handleOpenAccountModal(true)}
          >
            <ItemContent>
              <h2 className="text-lg font-bold">Créer un compte épargne</h2>
              {hasSavingsAccount && (
                <p className="text-sm text-black mt-1">
                  Vous avez déjà un compte épargne
                </p>
              )}
            </ItemContent>
          </Item>
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
