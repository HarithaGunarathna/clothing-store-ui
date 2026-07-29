import { createContext, useContext } from "react";

/**
 * status: "loading" | "authenticated" | "anonymous"
 * Nothing protected renders while "loading", otherwise the UI flashes
 * signed-out on every reload.
 */
export const AuthContext = createContext({
  status: "loading",
  user: null,
  notice: null,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  bootstrap: async () => false,
  clearNotice: () => {},
});

export const useAuth = () => useContext(AuthContext);
