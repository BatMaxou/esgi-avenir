"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useApiClient } from "@/contexts/ApiContext";
import { HydratedAccount } from "../../../../../../../../domain/entities/Account";
import { ApiClientError } from "../../../../../../../../application/services/api/ApiClientError";
import { GetHydratedAccountResponseInterface } from "../../../../../../../../application/services/api/resources/AccountResourceInterface";
import { User } from "../../../../../../../../domain/entities/User";
import { GetUserResponseInterface } from "../../../../../../../../application/services/api/resources/UserResourceInterface";
import { useAuth } from "@/contexts/AuthContext";
import { RoleEnum } from "../../../../../../../../domain/enums/RoleEnum";
import { Separator } from "../../../../../components/ui/separator";
import { Operation } from "../../../../../../../../domain/entities/Operation";
import { useAccounts } from "@/contexts/AccountsContext";
import OperationAccountItem from "@/components/operations/OperationAccountItem";

export default function AccountDetailsPage() {
  const params = useParams();
  const accountId = params.id as string;
  const { apiClient } = useApiClient();
  const { user } = useAuth();
  const { account, isAccountLoading, getAccount } = useAccounts();
  const [operations, setOperations] = useState<Operation[] | ApiClientError>(
    []
  );

  useEffect(() => {
    const fetchAccount = () => {
      getAccount(Number(accountId));
    };

    if (accountId) {
      fetchAccount();
    }
  }, [accountId]);

  if (isAccountLoading) {
    return <div>Chargement...</div>;
  }

  if (!account) {
    return <div>Compte introuvable</div>;
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
      <div className="flex-1 space-y-8">
        <h1 className="text-2xl font-bold mb-4">Informations banquaires</h1>
        <div className="bg-white p-6 rounded-lg shadow w-full">
          <div className="space-y-4">
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
      </div>
    </div>
  );
}
