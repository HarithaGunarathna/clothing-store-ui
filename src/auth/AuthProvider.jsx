import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  bootstrapSession,
  getAccessToken,
  setAccessToken,
  setOnSessionLost,
} from "../lib/api";
import { AuthContext } from "./AuthContext";
import * as authApi from "./authApi";
import { describeAuthError, isSessionRevoked } from "./errors";

export default function AuthProvider({ children }) {
  const [status, setStatus] = useState("loading");
  const [user, setUser] = useState(null);
  // A message to surface once on the login screen (e.g. a revoked session).
  const [notice, setNotice] = useState(null);
  const bootstrapped = useRef(false);

  const adoptToken = useCallback((token) => {
    setUser(authApi.decodeAccessToken(token));
    setStatus("authenticated");
  }, []);

  const clearSession = useCallback(() => {
    setAccessToken(null);
    setUser(null);
    setStatus("anonymous");
  }, []);

  const bootstrap = useCallback(async () => {
    const ok = await bootstrapSession();
    if (ok) adoptToken(getAccessToken());
    else clearSession();
    return ok;
  }, [adoptToken, clearSession]);

  // One refresh at startup — the only way to learn whether a session exists,
  // since the refresh cookie is httpOnly.
  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;
    bootstrap();
  }, [bootstrap]);

  // Any dead session anywhere in the app resolves here.
  useEffect(() => {
    setOnSessionLost((err) => {
      clearSession();
      if (isSessionRevoked(err)) setNotice(describeAuthError(err).message);
    });
    return () => setOnSessionLost(() => {});
  }, [clearSession]);

  const signIn = useCallback(
    async (credentials) => {
      const token = await authApi.login(credentials);
      setNotice(null);
      adoptToken(token);
    },
    [adoptToken],
  );

  const signUp = useCallback(
    async (payload) => {
      const token = await authApi.register(payload);
      setNotice(null);
      adoptToken(token);
    },
    [adoptToken],
  );

  const signOut = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      clearSession();
    }
  }, [clearSession]);

  const value = useMemo(
    () => ({
      status,
      user,
      notice,
      signIn,
      signUp,
      signOut,
      bootstrap,
      clearNotice: () => setNotice(null),
    }),
    [status, user, notice, signIn, signUp, signOut, bootstrap],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}
