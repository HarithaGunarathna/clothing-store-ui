import { API_BASE, apiJson, jsonBody, setAccessToken } from "../lib/api";

/**
 * POST /auth/register — signs the user straight in, no separate login step
 * and no email verification.
 */
export async function register(payload) {
  const { access_token } = await apiJson("/auth/register", {
    method: "POST",
    body: jsonBody(payload),
  });
  setAccessToken(access_token);
  return access_token;
}

/** POST /auth/login */
export async function login({ userName, password }) {
  const { access_token } = await apiJson("/auth/login", {
    method: "POST",
    body: jsonBody({ userName, password }),
  });
  setAccessToken(access_token);
  return access_token;
}

/** POST /auth/logout — 204 always. Ends this session only. */
export async function logout() {
  try {
    await apiJson("/auth/logout", { method: "POST" });
  } finally {
    setAccessToken(null);
  }
}

/**
 * Social sign-in must be a full-page navigation — an XHR cannot follow the
 * redirect to the provider and will fail CORS.
 */
export function startSocialLogin(provider) {
  window.location.href = `${API_BASE}/auth/${provider}`;
}

/**
 * Decode the JWT payload for UX only ({ userId, username }). Never an
 * authorisation decision.
 */
export function decodeAccessToken(token) {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(
      decodeURIComponent(
        json
          .split("")
          .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, "0")}`)
          .join(""),
      ),
    );
  } catch {
    return null;
  }
}
