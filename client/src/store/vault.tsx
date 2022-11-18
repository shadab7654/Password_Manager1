import React, { useState, useContext, createContext, useEffect } from "react";

import { vaultService, extractErrors } from "../services";

import * as crypto from "../utils/crypto";
import { useAuth } from "./auth";

export type VaultItemType = "password" | "notes";

export const VaultItemTypeMap = {
  password: "password" as VaultItemType,
  notes: "notes" as VaultItemType,
};

export interface IVaultItem {
  id: string;
  name: string;
  type: VaultItemType;
  [key: string]: any;
}

export interface ILoginVaultItem extends IVaultItem {
  userName: string;
  password: string;
  url?: string;
}

export interface VaultContextInterface {
  isLoading: boolean;
  isUpdating: boolean;
  errorMessage: string;
  setErrorMessage: (error: string) => void;
  updateErrorMessage: string;
  setUpdateErrorMessage: (error: string) => void;
  getVaultItems: () => Promise<void>;
  updateVaultItem: (items: IVaultItem[]) => Promise<boolean>;
  vaultList: IVaultItem[];
  setSelectedVaultType: (type: VaultItemType) => void;
  selectedVaultType: VaultItemType;
  selectedVaultList: IVaultItem[];
}

export const VaultContext: React.Context<VaultContextInterface> =
  createContext<VaultContextInterface>({} as VaultContextInterface);

export const VaultContextProvider: React.FC<{ children: any }> = ({
  children,
}) => {
  const authData = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [updateErrorMessage, setUpdateErrorMessage] = useState("");
  const [allVaultList, setAllVaultList] = useState<IVaultItem[]>([]);
  const [selectedVaultList, setSelectedVaultList] = useState<IVaultItem[]>([]);
  const [selectedVaultType, setSelectedVaultType] = useState<VaultItemType>(
    VaultItemTypeMap.password
  );

  useEffect(() => {
    setSelectedVaultList(
      allVaultList.filter((elem) => elem.type === selectedVaultType)
    );
  }, [allVaultList, selectedVaultType]);

  const getVaultItems = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const resp = await vaultService.get();
      if (!resp?.data?.vault) {
        throw new Error("Invalid vault data");
      }

      setAllVaultList(await dencryptVault(resp.data.vault.vault));
    } catch (error) {
      const { message } = extractErrors(error);
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateVaultItem = async (newItems: IVaultItem[]) => {
    setIsUpdating(true);
    setUpdateErrorMessage("");
    let isSuccess = false;

    try {
      await vaultService.update({
        vault: await encryptVault(newItems),
      });
      setAllVaultList(newItems);
      isSuccess = true;
    } catch (error) {
      const { message } = extractErrors(error);
      setUpdateErrorMessage(message);
    } finally {
      setIsUpdating(false);
      return isSuccess;
    }
  };

  const encryptVault = async (items: IVaultItem[]) => {
    if (!authData.streatchedMasterKey) {
      throw new Error("No streatchedMasterKey found");
    }

    return crypto.encryptVault(items, authData.streatchedMasterKey);
  };

  const dencryptVault = async (vault: string) => {
    if (!authData.streatchedMasterKey) {
      throw new Error("No streatchedMasterKey found");
    }

    if (!vault) {
      return [];
    }

    return crypto.decryptVault(
      vault,
      authData.streatchedMasterKey
    ) as IVaultItem[];
  };

  return (
    <VaultContext.Provider
      value={{
        isLoading,
        setErrorMessage,
        errorMessage,
        getVaultItems,
        updateVaultItem,
        isUpdating,
        setUpdateErrorMessage,
        updateErrorMessage,
        vaultList: allVaultList,
        setSelectedVaultType,
        selectedVaultList,
        selectedVaultType,
      }}
    >
      {children}
    </VaultContext.Provider>
  );
};

export function useVault(): VaultContextInterface {
  return useContext(VaultContext);
}
