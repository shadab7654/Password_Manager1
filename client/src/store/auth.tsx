import React, { useState, useEffect, useContext, createContext } from "react";

import { authService, extractErrors } from "../services";

import {
  TokenStorage,
  EmailStorage,
  StreatchedMasterKey,
} from "../utils/storage";
import {
  generateMasterKeys,
  generateProtectedSymmetricKey,
} from "../utils/crypto";

export interface AuthContextInterface {
  isLoading: boolean;
  isLoggedIn: boolean;
  errorMessage: string;
  setErrorMessage: (error: string) => void;
  streatchedMasterKey: string | null;
  authToken: string | null;
  email: string | null;
  logoutUser: () => Promise<void>;
  signup: (params: {
    email: string;
    password: string;
    name: string;
  }) => Promise<boolean>;
  login: (params: { email: string; password: string }) => Promise<boolean>;
}

export const AuthContext: React.Context<AuthContextInterface> =
  createContext<AuthContextInterface>({} as AuthContextInterface);

export const AuthContextProvider: React.FC<{ children: any }> = ({
  children,
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitialSet, setIsInitialSet] = useState(false);

  const [authToken, setAuthToken] = useState<string | null>(TokenStorage.get());
  const [email, setEmail] = useState<string | null>(EmailStorage.get());
  const [streatchedMasterKey, setStreatchedMasterKey] = useState<string | null>(
    StreatchedMasterKey.get()
  );

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!isInitialSet) return;

    if (!email) {
      EmailStorage.remove();
    } else {
      EmailStorage.set(email);
    }
  }, [email, isInitialSet]);

  useEffect(() => {
    if (!isInitialSet) return;

    if (!authToken) {
      TokenStorage.remove();
    } else {
      TokenStorage.set(authToken);
    }
  }, [authToken, isInitialSet]);

  useEffect(() => {
    if (!isInitialSet) return;

    if (!streatchedMasterKey) {
      StreatchedMasterKey.remove();
    } else {
      StreatchedMasterKey.set(streatchedMasterKey);
    }
  }, [streatchedMasterKey, isInitialSet]);

  const clearAllStates = () => {
    setAuthToken(null);
    setEmail(null);
  };

  const logoutUser = async () => {
    try {
      // await authService.logout();
    } catch (error) {
      console.log("Error during logout");
    } finally {
      clearAllStates();
    }
  };

  useEffect(() => {
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized && !isInitialSet) {
      const _authToken = TokenStorage.get();
      const _email = EmailStorage.get();
      const _streatchedMasterKey = StreatchedMasterKey.get();

      setAuthToken(_authToken);
      setEmail(_email);
      setStreatchedMasterKey(_streatchedMasterKey);
      setIsInitialSet(true);
      if (_authToken && _email && _streatchedMasterKey) {
        setIsLoggedIn(true);
      } else {
        clearAllStates();
      }
      setIsLoading(false);
    }
  }, [isInitialized]);

  const signupRequest = async (params: {
    email: string;
    password: string;
    name: string;
  }) => {
    setIsLoading(true);
    setErrorMessage("");
    let isSuccess = false;
    try {
      const finalName = params.name.trim();
      const finalEmail = params.email.trim();
      const finalPassword = params.password.trim();

      if (!finalName) {
        setErrorMessage("Name is required");
        setIsLoading(false);
        return isSuccess;
      }

      if (!finalEmail) {
        setErrorMessage("Email is required");
        setIsLoading(false);
        return isSuccess;
      }

      if (!finalPassword) {
        setErrorMessage("Password is required");
        setIsLoading(false);
        return isSuccess;
      }

      const keys = await generateMasterKeys(finalEmail, finalPassword);
      const protectedSymmetricKey = generateProtectedSymmetricKey(
        keys.streatchedMasterKey
      );

      const { data } = await authService.signup({
        email: finalEmail,
        name: finalName,
        masterKeyHash: keys.masterPasswordHash,
        protectedSymmetricKey,
      });

      if (data?.token) {
        setAuthToken(data.token);
        setEmail(params.email);
        setStreatchedMasterKey(keys.streatchedMasterKey);
        setIsLoggedIn(true);
        isSuccess = true;
      } else {
        throw new Error("Invalid data from server");
      }
    } catch (error: any) {
      const { message } = extractErrors(error);
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
      return isSuccess;
    }
  };

  const loginRequest = async (params: { email: string; password: string }) => {
    setIsLoading(true);
    setErrorMessage("");
    let isSuccess = false;
    try {
      const finalEmail = params.email.trim();
      const finalPassword = params.password.trim();

      if (!finalEmail) {
        setErrorMessage("Email is required");
        setIsLoading(false);
        return isSuccess;
      }

      if (!finalPassword) {
        setErrorMessage("Password is required");
        setIsLoading(false);
        return isSuccess;
      }

      const keys = await generateMasterKeys(finalEmail, finalPassword);

      const { data } = await authService.login({
        email: finalEmail,
        masterKeyHash: keys.masterPasswordHash,
      });

      if (data?.token) {
        setAuthToken(data.token);
        setEmail(params.email);
        setStreatchedMasterKey(keys.streatchedMasterKey);
        setIsLoggedIn(true);
        isSuccess = true;
      } else {
        throw new Error("Invalid data from server");
      }
    } catch (error: any) {
      const { message } = extractErrors(error);
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
      return isSuccess;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authToken,
        email,
        logoutUser,
        signup: signupRequest,
        login: loginRequest,
        isLoading,
        setErrorMessage,
        errorMessage,
        isLoggedIn,
        streatchedMasterKey,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextInterface {
  return useContext(AuthContext);
}
