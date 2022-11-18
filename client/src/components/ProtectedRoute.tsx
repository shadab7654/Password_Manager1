import Router from "next/router";

import { useAuth } from "../store/auth";
import isServer from "../utils/isServer";

const ProtectedRoute: React.FC<{ children: any }> = ({ children }) => {
  const auth = useAuth();

  if (auth.isLoggedIn) {
    return children;
  }

  if (auth.isLoading) {
    return null;
  }

  if (!isServer()) {
    Router.push("/login");
  }

  return null;
};

export default ProtectedRoute;
