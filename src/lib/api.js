const API_BASE = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE) {
  console.warn(
    "VITE_API_BASE_URL is not set. Copy .env.example to .env and set it.",
  );
}

export { API_BASE };

/** Error carrying the backend's `{ message, error, statusCode }` shape. */
export class ApiError extends Error {
  constructor(message, statusCode, body) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.body = body;
  }
}

// The access token lives here and nowhere else — never in localStorage.
let accessToken = null;
export const getAccessToken = () => accessToken;
export const setAccessToken = (t) => {
  accessToken = t;
};

/** Fires when the session is gone for good — clear state, route to login. */
let onSessionLost = () => {};
export const setOnSessionLost = (fn) => {
  onSessionLost = fn;
};

// Single-flight: concurrent 401s share ONE refresh instead of racing.
// The backend treats a replayed refresh token as theft and revokes the session.
let refreshInFlight = null;

export function refreshAccessToken() {
  refreshInFlight ??= (async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw await toApiError(res);
      const { access_token } = await res.json();
      setAccessToken(access_token);
      return access_token;
    } finally {
      refreshInFlight = null;
    }
  })();
  return refreshInFlight;
}

export async function apiFetch(path, init = {}, allowRetry = true) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(init.headers ?? {}),
    },
  });

  if (res.status !== 401 || !allowRetry) return res;

  // Access token probably just expired — refresh once, then replay.
  try {
    await refreshAccessToken();
  } catch (err) {
    setAccessToken(null);
    onSessionLost(err instanceof ApiError ? err : null);
    return res;
  }
  // Retry exactly once: a second 401 is a real authorisation failure.
  return apiFetch(path, init, false);
}

/** apiFetch + JSON parsing, throwing ApiError on a non-2xx response. */
export async function apiJson(path, init = {}) {
  const res = await apiFetch(path, init);
  if (!res.ok) throw await toApiError(res);
  if (res.status === 204) return null;
  return res.json();
}

export const jsonBody = (data) => JSON.stringify(data);

async function toApiError(res) {
  let body = null;
  try {
    body = await res.json();
  } catch {
    // Non-JSON error body (proxy error, network-level HTML page).
  }
  const message = body?.message ?? res.statusText ?? "Request failed";
  return new ApiError(
    Array.isArray(message) ? message.join(", ") : message,
    res.status,
    body,
  );
}

/** Call once at startup. True if a session was restored. */
export async function bootstrapSession() {
  try {
    await refreshAccessToken();
    return true;
  } catch {
    return false;
  }
}
