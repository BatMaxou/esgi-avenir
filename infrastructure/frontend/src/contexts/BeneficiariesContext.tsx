"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { ApiClientError } from "../../../../application/services/api/ApiClientError";
import { useApiClient } from "./ApiContext";
import { getCookie } from "../../../utils/frontend/cookies";
import {
  GetBeneficiaryListResponseInterface,
  CreateBeneficiaryPayloadInterface,
  GetBeneficiaryResponseInterface,
  UpdateBeneficiaryPayloadInterface,
} from "../../../../application/services/api/resources/BeneficiaryResourceInterface";
import { Beneficiary } from "../../../../domain/entities/Beneficiary";
import { DeleteResponseInterface } from "../../../../application/services/api/ApiClientInterface";

type Props = {
  children: ReactNode;
};

type BeneficiariesContextType = {
  beneficiary: Beneficiary | null;
  beneficiaries: Beneficiary[];
  isBeneficiaryLoading: boolean;
  isBeneficiariesLoading: boolean;
  getBeneficiaries: () => Promise<void>;
  createBeneficiary: (
    data: CreateBeneficiaryPayloadInterface
  ) => Promise<Beneficiary | null>;
  updateBeneficiary: (
    data: UpdateBeneficiaryPayloadInterface
  ) => Promise<Beneficiary | null>;
  deleteBeneficiary: (id: number) => Promise<boolean>;
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

  const createBeneficiary = async (
    data: CreateBeneficiaryPayloadInterface
  ): Promise<Beneficiary | null> => {
    setIsBeneficiaryLoading(true);
    const token = getCookie("token");
    if (!token) {
      setIsBeneficiaryLoading(false);
      return null;
    }

    const response: GetBeneficiaryResponseInterface | ApiClientError =
      await apiClient.beneficiary.create(data);

    if (response instanceof ApiClientError) {
      console.error("Failed to create beneficiary:", response.message);
      setIsBeneficiaryLoading(false);
      return null;
    }

    getBeneficiaries();
    setIsBeneficiaryLoading(false);
    return response;
  };

  const updateBeneficiary = async (
    data: UpdateBeneficiaryPayloadInterface
  ): Promise<Beneficiary | null> => {
    setIsBeneficiaryLoading(true);
    const token = getCookie("token");
    if (!token) {
      setIsBeneficiaryLoading(false);
      return null;
    }

    const response: GetBeneficiaryResponseInterface | ApiClientError =
      await apiClient.beneficiary.update(data);

    if (response instanceof ApiClientError) {
      console.error("Failed to update beneficiary:", response.message);
      setIsBeneficiaryLoading(false);
      return null;
    }

    setBeneficiaries((prev) =>
      prev.map((b) =>
        b.id === data.id ? { ...b, name: data.name || b.name } : b
      )
    );
    setIsBeneficiaryLoading(false);
    return response;
  };

  const deleteBeneficiary = async (id: number): Promise<boolean> => {
    setIsBeneficiaryLoading(true);
    const token = getCookie("token");
    if (!token) {
      setIsBeneficiaryLoading(false);
      return false;
    }

    const response: DeleteResponseInterface | ApiClientError =
      await apiClient.beneficiary.delete(id);
    if (response instanceof ApiClientError) {
      console.error("Failed to delete beneficiary:", response.message);
      setIsBeneficiaryLoading(false);
      return false;
    }

    setBeneficiaries((prev) => prev.filter((b) => b.id !== id));
    setIsBeneficiaryLoading(false);
    return true;
  };

  return (
    <BeneficiariesContext.Provider
      value={{
        beneficiary,
        beneficiaries,
        isBeneficiaryLoading,
        isBeneficiariesLoading,
        getBeneficiaries,
        createBeneficiary,
        updateBeneficiary,
        deleteBeneficiary,
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
