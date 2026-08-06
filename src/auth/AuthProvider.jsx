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
  const [profileLoading, setProfileLoading] = useState(false);
  // A message to surface once on the login screen (e.g. a revoked session).
  const [notice, setNotice] = useState(null);
  const bootstrapped = useRef(false);

  // GET /auth/me fills in everything the JWT doesn't carry (name, email,
  // addresses, ...). Runs after the token is adopted and merges in when it
  // resolves — auth status doesn't wait on it, since the JWT's
  // { userId, username } is enough to render as signed in.
  const loadProfile = useCallback(async () => {
    setProfileLoading(true);
    try {
      const profile = await authApi.getMe();
      setUser((current) => ({
        ...current,
        ...profile,
        // /auth/me uses `id` / `userName`; the JWT payload uses
        // `userId` / `username` — normalize onto the JWT's names so
        // existing call sites don't need to know which source won.
        userId: profile.id ?? current?.userId,
        username: profile.userName ?? current?.username,
      }));
    } catch {
      // Not fatal — keep whatever the JWT already gave us.
    } finally {
      setProfileLoading(false);
    }
  }, []);

  const adoptToken = useCallback(
    (token) => {
      setUser(authApi.decodeAccessToken(token));
      setStatus("authenticated");
      loadProfile();
    },
    [loadProfile],
  );

  const clearSession = useCallback(() => {
    setAccessToken(null);
    setUser(null);
    setProfileLoading(false);
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

  const signInAdmin = useCallback(
    async (credentials) => {
      const token = await authApi.adminLogin(credentials);
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
      profileLoading,
      notice,
      signIn,
      signInAdmin,
      signUp,
      signOut,
      bootstrap,
      refreshProfile: loadProfile,
      clearNotice: () => setNotice(null),
    }),
    [
      status,
      user,
      profileLoading,
      notice,
      signIn,
      signInAdmin,
      signUp,
      signOut,
      bootstrap,
      loadProfile,
    ],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}
