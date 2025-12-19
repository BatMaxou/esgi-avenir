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
import { HydratedAccount } from "../../../../../../../domain/entities/Account";
import { Beneficiary } from "../../../../../../../domain/entities/Beneficiary";
import { OperationEnum } from "../../../../../../../domain/enums/OperationEnum";
import { toast } from "sonner";
import TransferToAccountDialog from "./transfer-to-account-dialog";
import { Item, ItemActions, ItemContent } from "@/components/ui/atoms/item";
import { Icon } from "@iconify/react";
import { useOperations } from "@/contexts/OperationsContext";
import { showErrorToast } from "@/lib/toast";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("components.dialogs.account.delete");
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
      showErrorToast("Impossible de trouver le compte.");
      return;
    }
    const success = await deleteAccount(account.id);
    if (success) {
      router.push("/accounts");
    }
    onOpenChange(false);
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
      showErrorToast("Compte de destination invalide");
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
                ? t("titleConfirm")
                : hasFunds
                ? t("titleBalance")
                : t("titleSure")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {showTransferConfirmation && selectedToAccount ? (
                <>
                  {t("descriptionTransfer")}
                  <span className="font-bold text-black">
                    {account.amount.toFixed(2)} €
                  </span>
                  {t("descriptionToAccount")}{" "}
                  <span className="font-bold text-black">
                    {getToAccountName(selectedToAccount)}
                  </span>{" "}
                  {t("descriptionDeleteAccount")} <b>{account.name}</b>.
                </>
              ) : hasFunds ? (
                <>
                  {t("descriptionBalance")}{" "}
                  <span className="font-bold text-black">
                    {account.amount.toFixed(2)} €
                  </span>{" "}
                  {t("descriptionBalanceEnd")}
                  <br />
                  {t("descriptionTransferRequired")}
                </>
              ) : (
                <>
                  {t("descriptionIrreversible")} <b>{account.name}</b>.
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
                    {t("transferFunds")}
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
              {t("cancel")}
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
                {isTransferring ? t("processing") : t("transferAndDelete")}
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
                {isAccountLoading ? t("deleting") : t("delete")}
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
