"use client";

import { useState } from "react";

// Contexts
import { useAccounts } from "@/contexts/AccountsContext";

// Types
import { Beneficiary } from "../../../../../../../domain/entities/Beneficiary";
import { HydratedAccount } from "../../../../../../../domain/entities/Account";

// Local components
import TransferFromAccountDialog from "../dialogs/transfer-from-account-dialog";
import TransferToAccountDialog from "../dialogs/transfer-to-account-dialog";
import { AmountInput } from "@/components/ui/molecules/inputs/amount-input";
import { FilledButton } from "@/components/ui/molecules/buttons/filled-button";
import InputStartIcon from "../inputs/input-start-icon";

// Others components
import { Item, ItemActions, ItemContent } from "@/components/ui/atoms/item";
import { Icon } from "@iconify/react";
import { OperationEnum } from "../../../../../../../domain/enums/OperationEnum";
import { useOperations } from "@/contexts/OperationsContext";

interface TransferFormProps {
  onOpenAddBeneficiary?: () => void;
}

export default function TransferForm({
  onOpenAddBeneficiary,
}: TransferFormProps) {
  const { accounts, isAccountsLoading, refreshAccounts } = useAccounts();
  const { create } = useOperations();

  const [confirmationView, showConfirmationView] = useState(false);

  const [openShowFromAccountModal, setOpenShowFromAccountModal] =
    useState(false);
  const [openShowToAccountModal, setOpenShowToAccountModal] = useState(false);
  const [amount, setAmount] = useState<string | null>(null);
  const [fromAccount, setFromAccount] = useState<HydratedAccount | undefined>(
    undefined
  );
  const [toAccount, setToAccount] = useState<
    HydratedAccount | Beneficiary | undefined
  >(undefined);
  const [customTransferName, setCustomTransferName] = useState<string>("");

  const handleShowFromAccount = () => {
    setOpenShowFromAccountModal(!openShowFromAccountModal);
  };

  const handleShowToAccount = () => {
    setOpenShowToAccountModal(!openShowToAccountModal);
  };

  const handleAmountChange = (value?: string) => {
    if (value === undefined) {
      setAmount(null);
      return;
    } else {
      setAmount(value);
    }
  };

  const handleSubmitTransfer = async () => {
    const fromAccountId = fromAccount?.id;

    // Si c'est un bénéficiaire, on prend l'ID du compte associé
    let toAccountId: number | undefined;
    if (toAccount) {
      if ("account" in toAccount && toAccount.account) {
        // C'est un bénéficiaire
        toAccountId = toAccount.account.id;
      } else {
        // C'est un compte direct
        toAccountId = toAccount.id;
      }
    }

    const transferAmount = amount;
    const transferName = customTransferName;

    if (!fromAccountId || !toAccountId || !transferAmount) {
      console.error("Missing required transfer information.");
      return;
    }

    const response = await create({
      type: OperationEnum.TRANSFER,
      amount: parseFloat(transferAmount),
      fromId: fromAccountId,
      toId: toAccountId,
      name: transferName,
    });

    if (response) {
      refreshAccounts();
      showConfirmationView(true);
    }
  };

  const handleNewTransfer = () => {
    setAmount(null);
    setFromAccount(undefined);
    setToAccount(undefined);
    setCustomTransferName("");
    showConfirmationView(false);
  };

  return (
    <>
      <TransferFromAccountDialog
        open={openShowFromAccountModal}
        setOpen={setOpenShowFromAccountModal}
        userAccounts={accounts}
        setFromAccount={setFromAccount}
        toAccount={toAccount}
        isAccountsLoading={isAccountsLoading}
      />
      <TransferToAccountDialog
        open={openShowToAccountModal}
        setOpen={setOpenShowToAccountModal}
        userAccounts={accounts}
        setToAccount={setToAccount}
        fromAccount={fromAccount}
        isLoadingAccounts={isAccountsLoading}
        onOpenAddBeneficiary={onOpenAddBeneficiary}
      />

      <div className="flex flex-3 flex-col justify-start items-start border border-color-gray-300 p-6 rounded-lg shadow space-y-4">
        {confirmationView ? (
          <div className="w-full flex flex-col items-center justify-center space-y-6">
            <div className="flex flex-col items-center space-y-2">
              <Icon
                icon="mdi:check-circle"
                className="text-green-600 w-16 h-16"
              />
              <h2 className="text-2xl font-bold text-gray-800">
                Transfert réussi!
              </h2>
              <p className="text-gray-600 text-center">
                Votre virement de{" "}
                <span className="font-semibold">{amount} €</span> a été effectué
                avec succès.
              </p>
            </div>

            <FilledButton
              label="Nouveau virement"
              onClick={() => handleNewTransfer()}
              icon="mdi:arrow-left"
              iconPosition="start"
              className="w-full"
            />
          </div>
        ) : (
          <div className="w-full">
            <AmountInput
              currency="€"
              displayType="unique"
              onChange={(value: string) => handleAmountChange(value)}
            ></AmountInput>
            <div className="flex flex-col w-full mt-4 gap-4">
              <Item
                className="bg-white p-4 rounded-lg shadow cursor-pointer hover:bg-gray-50 transition-all"
                onClick={() => handleShowFromAccount()}
              >
                <ItemContent>
                  {fromAccount ? (
                    <>
                      <p className={`text-lg font-bold`}>{fromAccount.name}</p>
                      <p className={`text-md font-semibold`}>
                        {fromAccount.iban.value}
                      </p>
                    </>
                  ) : (
                    "Depuis le compte"
                  )}
                </ItemContent>
                <ItemActions>
                  {fromAccount ? (
                    <span
                      className={`text-lg font-bold ${
                        fromAccount.amount < 0
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {fromAccount.amount < 0 ? "" : "+"}
                      {`${fromAccount.amount.toFixed(2)} €`}
                    </span>
                  ) : (
                    <Icon
                      icon="mdi:chevron-right"
                      className="text-black w-5 h-5"
                    />
                  )}
                </ItemActions>
              </Item>
              <Item
                className="bg-white p-4 rounded-lg shadow cursor-pointer hover:bg-gray-50 transition-all"
                onClick={() => handleShowToAccount()}
              >
                <ItemContent>
                  {toAccount ? (
                    <>
                      <p className={`text-lg font-bold`}>{toAccount.name}</p>
                      {"account" in toAccount ? (
                        <p className={`text-md font-semibold`}>
                          {toAccount.account?.iban.value}
                        </p>
                      ) : (
                        <p className={`text-md font-semibold`}>
                          {(toAccount as HydratedAccount).iban?.value}
                        </p>
                      )}
                    </>
                  ) : (
                    "Vers le compte"
                  )}
                </ItemContent>
                <ItemActions>
                  {toAccount ? (
                    <>
                      {"amount" in toAccount ? (
                        <span
                          className={`text-lg font-bold ${
                            toAccount.amount < 0
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {toAccount.amount < 0 ? "" : "+"}
                          {`${toAccount.amount.toFixed(2)} €`}
                        </span>
                      ) : null}
                    </>
                  ) : (
                    <Icon
                      icon="mdi:chevron-right"
                      className="text-black w-5 h-5"
                    />
                  )}
                </ItemActions>
              </Item>
              <Item className="bg-white p-4 rounded-lg shadow cursor-pointer hover:bg-gray-50 transition-all">
                <InputStartIcon
                  icon="solar:pen-outline"
                  placeholder="Mon virement"
                  label="Nommer l'opération"
                  inputClass="!border-0 !shadow-none !ring-none !border-b !border-gray-50 !rounded-none !w-full"
                  onChange={(e) => setCustomTransferName(e)}
                />
              </Item>
              <FilledButton
                label="Transférer"
                onClick={() => handleSubmitTransfer()}
                icon="mdi:arrow-right"
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
