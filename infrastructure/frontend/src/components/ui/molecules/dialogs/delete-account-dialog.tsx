import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/molecules/dialogs/alert-dialog";
import { useAccounts } from "@/contexts/AccountsContext";
import { useRouter } from "next/navigation";
import { HydratedAccount } from "../../../../../../../domain/entities/Account";
import { Beneficiary } from "../../../../../../../domain/entities/Beneficiary";
import { OperationEnum } from "../../../../../../../domain/enums/OperationEnum";
import { toast } from "sonner";
import TransferToAccountDialog from "./transfer-to-account-dialog";
import { Item, ItemActions, ItemContent } from "@/components/ui/atoms/item";
import { Icon } from "@iconify/react";
import { useOperations } from "@/contexts/OperationsContext";

interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account: HydratedAccount | null;
}

export default function DeleteAccountDialog({
  open,
  onOpenChange,
  account,
}: DeleteAccountDialogProps) {
  const {
    deleteAccount,
    isAccountLoading,
    accounts,
    isAccountsLoading,
    getAccount,
  } = useAccounts();
  const { create } = useOperations();
  const router = useRouter();
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [selectedToAccount, setSelectedToAccount] = useState<
    HydratedAccount | Beneficiary | undefined
  >(undefined);
  const [showTransferConfirmation, setShowTransferConfirmation] =
    useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!account || !account.id) {
      toast.error("Impossible de trouver le compte.");
      return;
    }
    const success = await deleteAccount(account.id);
    if (success) {
      onOpenChange(false);
      router.push("/accounts");
    }
  };

  const handleAccountSelection = (
    toAccount: HydratedAccount | Beneficiary | undefined
  ) => {
    if (!toAccount) return;
    setSelectedToAccount(toAccount);
    setIsTransferDialogOpen(false);
    setShowTransferConfirmation(true);
  };

  const handleTransferAndDelete = async () => {
    if (!selectedToAccount || !account || !account.id) return;

    setIsTransferring(true);

    let toAccountId: number | undefined;
    if ("account" in selectedToAccount && selectedToAccount.account) {
      toAccountId = selectedToAccount.account.id;
    } else {
      toAccountId = selectedToAccount.id;
    }

    if (!toAccountId) {
      toast.error("Compte de destination invalide");
      setIsTransferring(false);
      return;
    }

    const response = await create({
      type: OperationEnum.TRANSFER,
      amount: account.amount,
      fromId: account.id,
      toId: toAccountId,
      name: `Virement de clôture du compte ${account.name}`,
    });

    if (response) {
      const deleteSuccess = await deleteAccount(account.id);
      if (deleteSuccess) {
        onOpenChange(false);
        router.push("/accounts");
      } else {
        await getAccount(account.id);
        setShowTransferConfirmation(false);
        setSelectedToAccount(undefined);
      }
    }

    setIsTransferring(false);
  };

  if (!account) return null;

  const hasFunds = account.amount > 0;

  const getToAccountName = (to: HydratedAccount | Beneficiary) => {
    if ("account" in to && to.account) {
      return to.name;
    } else {
      return (to as HydratedAccount).name;
    }
  };

  return (
    <>
      <TransferToAccountDialog
        open={isTransferDialogOpen}
        setOpen={setIsTransferDialogOpen}
        userAccounts={accounts}
        setToAccount={handleAccountSelection}
        fromAccount={account}
        isLoadingAccounts={isAccountsLoading}
      />
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {showTransferConfirmation
                ? "Confirmer le virement et la suppression"
                : hasFunds
                ? "Solde restant sur le compte"
                : "Êtes-vous absolument sûr ?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {showTransferConfirmation && selectedToAccount ? (
                <>
                  Vous allez transférer la totalité du solde (
                  <span className="font-bold text-black">
                    {account.amount.toFixed(2)} €
                  </span>
                  ) vers le compte{" "}
                  <span className="font-bold text-black">
                    {getToAccountName(selectedToAccount)}
                  </span>{" "}
                  et supprimer définitivement le compte <b>{account.name}</b>.
                </>
              ) : hasFunds ? (
                <>
                  Il reste{" "}
                  <span className="font-bold text-black">
                    {account.amount.toFixed(2)} €
                  </span>{" "}
                  sur ce compte.
                  <br />
                  Vous devez transférer la totalité des fonds vers un autre
                  compte avant de pouvoir le supprimer.
                </>
              ) : (
                <>
                  Cette action est irréversible. Cela supprimera définitivement
                  le compte <b>{account.name}</b>.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {!showTransferConfirmation && hasFunds && (
            <div className="py-4">
              <Item
                className="bg-white p-4 rounded-lg shadow cursor-pointer hover:bg-gray-50 transition-all border border-gray-200"
                onClick={() => setIsTransferDialogOpen(true)}
              >
                <ItemContent>
                  <span className="font-semibold text-md">
                    Virer les fonds vers un autre compte
                  </span>
                </ItemContent>
                <ItemActions>
                  {isTransferring ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                  ) : (
                    <Icon
                      icon="mdi:chevron-right"
                      className="w-5 h-5 text-gray-400"
                    />
                  )}
                </ItemActions>
              </Item>
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isAccountLoading || isTransferring}
              className="cursor-pointer"
              onClick={() => {
                if (showTransferConfirmation) {
                  setShowTransferConfirmation(false);
                  setSelectedToAccount(undefined);
                }
              }}
            >
              Annuler
            </AlertDialogCancel>
            {showTransferConfirmation ? (
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  handleTransferAndDelete();
                }}
                disabled={isTransferring}
                className="bg-primary-red hover:bg-secondary-red focus:ring-secondary-red cursor-pointer text-white hover:text-white"
              >
                {isTransferring
                  ? "Traitement en cours..."
                  : "Transférer et supprimer"}
              </AlertDialogAction>
            ) : (
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isAccountLoading || hasFunds || isTransferring}
                className={`text-white cursor-pointer ${
                  hasFunds
                    ? "opacity-50 cursor-not-allowed bg-gray-400"
                    : "bg-red-600 hover:bg-red-700 focus:ring-red-600 hover:text-white"
                }`}
              >
                {isAccountLoading ? "Suppression..." : "Supprimer"}
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
