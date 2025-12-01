"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { ApiClientError } from "../../../../application/services/api/ApiClientError";
import { useApiClient } from "./ApiContext";
import { getCookie } from "../../../utils/frontend/cookies";
import { GetBeneficiaryListResponseInterface } from "../../../../application/services/api/resources/BeneficiaryResourceInterface";
import { useAuth } from "./AuthContext";
import { RoleEnum } from "../../../../domain/enums/RoleEnum";
import { GetUserResponseInterface } from "../../../../application/services/api/resources/UserResourceInterface";
import { Operation } from "../../../../domain/entities/Operation";
import { Beneficiary } from "../../../../domain/entities/Beneficiary";

type Props = {
  children: ReactNode;
};

type BeneficiariesContextType = {
  beneficiary: Beneficiary | null;
  beneficiaries: Beneficiary[] | null;
  isBeneficiaryLoading: boolean;
  isBeneficiariesLoading: boolean;
  getBeneficiaries: () => Promise<void>;
};

export const BeneficiariesContext = createContext<
  BeneficiariesContextType | undefined
>(undefined);

export const BeneficiariesProvider = ({ children }: Props) => {
  const [beneficiary, setBeneficiary] = useState<Beneficiary | null>(null);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [isBeneficiariesLoading, setIsBeneficiariesLoading] =
    useState<boolean>(false);
  const [isBeneficiaryLoading, setIsBeneficiaryLoading] =
    useState<boolean>(false);
  const { apiClient } = useApiClient();

  const getBeneficiaries = async () => {
    setIsBeneficiariesLoading(true);
    setBeneficiaries([]);
    const token = getCookie("token");
    if (!token) {
      setIsBeneficiariesLoading(false);
      return;
    }

    const response: GetBeneficiaryListResponseInterface | ApiClientError =
      await apiClient.beneficiary.getAll();

    if (response instanceof ApiClientError) {
      console.error("Failed to fetch beneficiaries:", response.message);
      setBeneficiaries([]);
    } else {
      setBeneficiaries(response);
    }

    setIsBeneficiariesLoading(false);
  };

  return (
    <BeneficiariesContext.Provider
      value={{
        beneficiary,
        beneficiaries,
        isBeneficiaryLoading,
        isBeneficiariesLoading,
        getBeneficiaries,
      }}
    >
      {children}
    </BeneficiariesContext.Provider>
  );
};

export const useBeneficiaries = () => {
  const context = useContext(BeneficiariesContext);
  if (!context) {
    throw new Error(
      "useBeneficiaries must be used within an BeneficiariesProvider"
    );
  }

  return context;
};
