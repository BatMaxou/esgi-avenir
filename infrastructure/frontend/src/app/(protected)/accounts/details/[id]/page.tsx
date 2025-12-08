"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/atoms/separator";
import { useAccounts } from "@/contexts/AccountsContext";
import OperationAccountItem from "@/components/ui/molecules/item/operation-account-item";
import { useNavigation } from "@/contexts/NavigationContext";
import { Item, ItemActions, ItemContent } from "@/components/ui/atoms/item";
import { Icon } from "@iconify/react";
import UpdateAccountDialog from "@/components/ui/molecules/dialogs/update-account-dialog";
import DeleteAccountDialog from "@/components/ui/molecules/dialogs/delete-account-dialog";
import { FilledButton } from "@/components/ui/molecules/buttons/filled-button";

export default function AccountDetailsPage() {
  const params = useParams();
  const accountId = params.id as string;
  const router = useRouter();
  const { account, accounts, isAccountLoading, getAccount } = useAccounts();
  const { endNavigation } = useNavigation();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteDisabled, setIsDeleteDisabled] = useState(false);

  useEffect(() => {
    endNavigation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (accountId) {
      getAccount(Number(accountId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId]);

  useEffect(() => {
    if (account && !account.isSavings) {
      const currentAccounts = accounts.filter((acc) => !acc.isSavings);
      if (currentAccounts.length === 1 && account.amount !== 0) {
        setIsDeleteDisabled(true);
      } else {
        setIsDeleteDisabled(false);
      }
    } else {
      setIsDeleteDisabled(false);
    }
  }, [account, accounts]);

  if (isAccountLoading) {
    return (
      <div className="text-center mt-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Chargement...</p>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Compte introuvable
        </h2>
        <p className="text-gray-600 mb-6">
          Le compte que vous cherchez n'existe pas ou a été supprimé.
        </p>
        <FilledButton
          onClick={() => router.push("/accounts")}
          className="px-6 py-2 font-semibold"
          label="Retour à mes comptes"
          icon="mdi:arrow-left"
          iconPosition="start"
        />
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
              {account.amount < 0 ? "-" : "+"}
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
        <div className="bg-white p-6 rounded-lg shadow w-full mb-4">
          <div className="space-y-4">
            <div>
              <p className="text-gray-600">Nom du compte</p>
              <p className="font-semibold">{account.name}</p>
            </div>
            <div>
              <p className="text-gray-600">IBAN</p>
              <p className="font-semibold">{account.iban.value}</p>
            </div>
            <div>
              <p className="text-gray-600">Titulaire</p>
              <p className="font-semibold">{account?.owner?.firstName}</p>
            </div>
          </div>
        </div>
        <Item
          className="bg-white p-4 rounded-lg shadow cursor-pointer hover:bg-gray-50 transition-all mb-4"
          onClick={() => setIsUpdateModalOpen(true)}
        >
          <ItemContent>
            <span className="font-semibold text-md">Modifier mon compte</span>
          </ItemContent>
          <ItemActions>
            <Icon icon="mdi:chevron-right" className="w-5 h-5 text-gray-400" />
          </ItemActions>
        </Item>
        <Item
          className={`p-4 rounded-lg shadow transition-all ${
            isDeleteDisabled
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-red-600 cursor-pointer hover:bg-red-700"
          }`}
          onClick={() => !isDeleteDisabled && setIsDeleteModalOpen(true)}
        >
          <ItemContent>
            <span
              className={`font-semibold text-md ${
                isDeleteDisabled ? "text-gray-500" : "text-white"
              }`}
            >
              Supprimer mon compte
            </span>
          </ItemContent>
          <ItemActions>
            <Icon
              icon="mdi:chevron-right"
              className={`w-5 h-5 ${
                isDeleteDisabled ? "text-gray-500" : "text-white"
              }`}
            />
          </ItemActions>
        </Item>
      </div>
      <UpdateAccountDialog
        open={isUpdateModalOpen}
        onOpenChange={setIsUpdateModalOpen}
        account={account}
      />
      <DeleteAccountDialog
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        account={account}
      />
    </div>
  );
}
