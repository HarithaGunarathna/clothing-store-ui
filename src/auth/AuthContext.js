import { createContext, useContext } from "react";

/**
 * status: "loading" | "authenticated" | "anonymous"
 * Nothing protected renders while "loading", otherwise the UI flashes
 * signed-out on every reload.
 */
export const AuthContext = createContext({
  status: "loading",
  user: null,
  // True while GET /auth/me is in flight — `user` only has the JWT's
  // { userId, username } until this settles.
  profileLoading: false,
  notice: null,
  signIn: async () => {},
  signInAdmin: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  bootstrap: async () => false,
  refreshProfile: async () => {},
  clearNotice: () => {},
});

export const useAuth = () => useContext(AuthContext);
