import React from "react";

import { AuthContextProvider } from "./auth";
import { VaultContextProvider } from "./vault";
import { SnackbarProvider } from "./snackbar";

const ContextProviders: React.FC<{ children: any }> = ({ children }) => {
  return (
    <SnackbarProvider>
      <AuthContextProvider>
        <VaultContextProvider>{children}</VaultContextProvider>
      </AuthContextProvider>
    </SnackbarProvider>
  );
};

export default ContextProviders;
