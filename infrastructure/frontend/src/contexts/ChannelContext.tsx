"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { useApiClient } from "./ApiContext";
import { paths } from "../../../../application/services/api/paths";
import { ApiClientError } from "../../../../application/services/api/ApiClientError";
import { showErrorToast } from "@/lib/toast";
import { GetHydratedPrivateChannelResponseInterface } from "../../../../application/services/api/resources/PrivateChannelResourceInterface";
import {
  CreateCompanyChannelPayloadInterface,
  GetCompanyChannelResponseInterface,
  GetHydratedCompanyChannelResponseInterface,
} from "../../../../application/services/api/resources/CompanyChannelResourceInterface";
import { getCookie } from "../../../utils/frontend/cookies";

type Props = {
  children: ReactNode;
};

type ChannelContextType = {
  isChannelLoading: boolean;
  isChannelsLoading: boolean;
  companyChannels: {
    channel: GetHydratedCompanyChannelResponseInterface;
    type: "company";
  }[];
  privateChannels: {
    channel: GetHydratedPrivateChannelResponseInterface;
    type: "private";
    isPending?: boolean;
  }[];
  allChannels: (
    | { channel: GetHydratedCompanyChannelResponseInterface; type: "company" }
    | { channel: GetHydratedPrivateChannelResponseInterface; type: "private" }
  )[];
  getPrivateChannelById: (
    id: number
  ) => Promise<GetHydratedPrivateChannelResponseInterface | ApiClientError>;
  getCompanyChannelById: (
    id: number
  ) => Promise<GetHydratedCompanyChannelResponseInterface | ApiClientError>;
  getAllCompanyChannels: () => Promise<boolean>;
  getAllPrivateChannels: () => Promise<boolean>;
  getAllChannels: () => Promise<void>;
  createCompanyChannel: (
    data: CreateCompanyChannelPayloadInterface
  ) => Promise<void>;
};

export const ChannelContext = createContext<ChannelContextType | undefined>(
  undefined
);

export const ChannelProvider = ({ children }: Props) => {
  const { apiClient } = useApiClient();
  const [isChannelLoading, setIsChannelLoading] = useState<boolean>(false);
  const [isChannelsLoading, setIsChannelsLoading] = useState<boolean>(false);
  const [companyChannels, setCompanyChannels] = useState<
    { channel: GetHydratedCompanyChannelResponseInterface; type: "company" }[]
  >([]);
  const [privateChannels, setPrivateChannels] = useState<
    {
      channel: GetHydratedPrivateChannelResponseInterface;
      type: "private";
      isPending?: boolean;
    }[]
  >([]);
  const [allChannels, setAllChannels] = useState<
    (
      | { channel: GetHydratedCompanyChannelResponseInterface; type: "company" }
      | {
          channel: GetHydratedPrivateChannelResponseInterface;
          type: "private";
          isPending?: boolean;
        }
    )[]
  >([]);

  const getPrivateChannelById = async (
    id: number
  ): Promise<GetHydratedPrivateChannelResponseInterface | ApiClientError> => {
    setIsChannelLoading(true);

    const token = getCookie("token");
    if (!token) {
      if (!token) {
        setIsChannelLoading(false);
        return new ApiClientError(401, "Unauthorized");
      }
    }
    const response =
      await apiClient.get<GetHydratedPrivateChannelResponseInterface>(
        paths.privateChannel.detail(id)
      );

    if (response instanceof ApiClientError) {
      const errorResponse = response.message;
      showErrorToast(errorResponse);
    }

    setIsChannelLoading(false);
    return response;
  };

  const getCompanyChannelById = async (
    id: number
  ): Promise<GetHydratedCompanyChannelResponseInterface | ApiClientError> => {
    setIsChannelLoading(true);

    const token = getCookie("token");
    if (!token) {
      if (!token) {
        setIsChannelLoading(false);
        return new ApiClientError(401, "Unauthorized");
      }
    }

    const response =
      await apiClient.get<GetHydratedCompanyChannelResponseInterface>(
        paths.companyChannel.detail(id)
      );

    if (response instanceof ApiClientError) {
      const errorResponse = response.message;
      showErrorToast(errorResponse);
    }

    setIsChannelLoading(false);
    return response;
  };

  const getAllCompanyChannels = async (): Promise<boolean> => {
    setIsChannelsLoading(true);

    const response = await apiClient.get<
      GetHydratedCompanyChannelResponseInterface[]
    >(paths.companyChannel.list);
    if (response instanceof ApiClientError) {
      const errorResponse = response.message;
      showErrorToast(errorResponse);
      setIsChannelsLoading(false);
      return false;
    }

    const channelsList = [];
    channelsList.push(
      ...response.map((channel) => ({
        channel,
        type: "company" as const,
      }))
    );

    setCompanyChannels(channelsList);

    setIsChannelsLoading(false);
    return true;
  };

  const getAllPrivateChannels = async (): Promise<boolean> => {
    setIsChannelsLoading(true);

    const response = await apiClient.get<
      GetHydratedPrivateChannelResponseInterface[]
    >(paths.privateChannel.list);
    if (response instanceof ApiClientError) {
      const errorResponse = response.message;
      showErrorToast(errorResponse);
      setIsChannelsLoading(false);
      return false;
    }

    const channelsList = [];
    channelsList.push(
      ...response.map((channel) => ({
        channel,
        type: "private" as const,
        isPending: channel.advisorId === null,
      }))
    );

    setPrivateChannels(channelsList);
    setIsChannelsLoading(false);
    return true;
  };

  const getAllChannels = async (): Promise<void> => {
    setIsChannelsLoading(true);

    const companyResponse = await apiClient.get<
      GetHydratedCompanyChannelResponseInterface[]
    >(paths.companyChannel.list);
    const privateResponse = await apiClient.get<
      GetHydratedPrivateChannelResponseInterface[]
    >(paths.privateChannel.list);

    const allChannelsResponse = [];

    if (!(companyResponse instanceof ApiClientError)) {
      const companyChannelsList = companyResponse.map((channel) => ({
        channel,
        type: "company" as const,
      }));
      setCompanyChannels(companyChannelsList);
      allChannelsResponse.push(...companyChannelsList);
    } else {
      const errorResponse = companyResponse.message;
      showErrorToast(errorResponse);
      setIsChannelsLoading(false);
    }

    if (!(privateResponse instanceof ApiClientError)) {
      const privateChannelsList = privateResponse.map((channel) => ({
        channel,
        type: "private" as const,
        isPending: channel.advisorId === null,
      }));
      setPrivateChannels(privateChannelsList);
      allChannelsResponse.push(...privateChannelsList);
    } else {
      const errorResponse = privateResponse.message;
      showErrorToast(errorResponse);
      setIsChannelsLoading(false);
    }

    setAllChannels(allChannelsResponse);
    setIsChannelsLoading(false);
    return;
  };

  const createCompanyChannel = async (
    data: CreateCompanyChannelPayloadInterface
  ): Promise<void> => {
    setIsChannelsLoading(true);

    const token = getCookie("token");
    if (!token) {
      if (!token) {
        setIsChannelsLoading(false);
        return;
      }
    }

    const response: GetCompanyChannelResponseInterface | ApiClientError =
      await apiClient.companyChannel.create(data);

    if (response instanceof ApiClientError) {
      const errorResponse = response.message;
      showErrorToast(errorResponse);
    }

    await getAllCompanyChannels();
    setIsChannelsLoading(false);
    return;
  };

  return (
    <ChannelContext.Provider
      value={{
        isChannelLoading,
        isChannelsLoading,
        companyChannels,
        privateChannels,
        allChannels,
        getPrivateChannelById,
        getCompanyChannelById,
        getAllCompanyChannels,
        getAllPrivateChannels,
        getAllChannels,
        createCompanyChannel,
      }}
    >
      {children}
    </ChannelContext.Provider>
  );
};

export const useChannel = () => {
  const context = useContext(ChannelContext);
  if (!context) {
    throw new Error("useChannel must be used within a ChannelProvider");
  }

  return context;
};
