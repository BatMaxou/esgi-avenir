import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/atoms/dialog";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { HydratedAccount } from "../../../../../../../domain/entities/Account";
import { Beneficiary } from "../../../../../../../domain/entities/Beneficiary";
import InputSearchLoader from "../inputs/input-search-loader";

interface TransferFromAccountProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  userAccounts?: HydratedAccount[];
  setFromAccount: (fromAccount: HydratedAccount | undefined) => void;
  toAccount?: HydratedAccount | Beneficiary | undefined;
  isAccountsLoading?: boolean;
}

const TransferFromAccountDialog = ({
  open,
  setOpen,
  userAccounts,
  setFromAccount,
  toAccount,
  isAccountsLoading,
}: TransferFromAccountProps) => {
  const handleClose = () => {
    setOpen(false);
    setFromAccount(undefined);
  };

  const [accounts, setAccounts] = useState<HydratedAccount[]>(
    userAccounts || []
  );
  const [newAccountList, setNewAccountList] = useState<HydratedAccount[]>([]);

  useEffect(() => {
    setAccounts(newAccountList);
  }, [newAccountList]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTitle className="hidden">Depuis le compte</DialogTitle>
      <DialogContent className="flex flex-col justify-start items-start gap-8 data-[state=open]:!zoom-in-100 data-[state=open]:slide-in-from-right-20 data-[state=open]:duration-600 sm:right-0 sm:left-auto h-screen sm:max-w-[425px] sm:translate-x-0">
        <DialogHeader className="mb-6">
          <p className="text-lg font-bold">Depuis le compte</p>
        </DialogHeader>

        {userAccounts && userAccounts.length > 0 ? (
          <>
            <InputSearchLoader
              label="Rechercher un compte"
              items={userAccounts}
              filterOnKey="name"
              setNewItems={setNewAccountList}
            />
            <div className="w-full max-h-[400px] overflow-y-auto space-y-4">
              {isAccountsLoading ? (
                <p>Chargement des comptes...</p>
              ) : (
                <>
                  {accounts.map((account) => (
                    <div
                      key={account.id}
                      className={
                        "p-4 border border-gray-300 rounded-lg shadow-sm bg-white flex flex-row justify-between items-center hover:cursor-pointer hover:bg-gray-100"
                      }
                      onClick={() => {
                        setFromAccount(account);
                        setOpen(false);
                      }}
                    >
                      <div>
                        <p className="font-semibold text-gray-800 mb-1">
                          {account.name}
                        </p>
                      </div>
                      <p
                        className={`text-lg font-bold ${
                          account.amount < 0 ? "text-red-600" : "text-green-600"
                        }`}
                      >
                        {account.amount < 0 ? "" : "+"}
                        {account.amount.toFixed(2)} €
                      </p>
                    </div>
                  ))}
                </>
              )}
            </div>
          </>
        ) : (
          <div className="mt-20">
            <p>Aucun compte banquaire trouvé.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TransferFromAccountDialog;
