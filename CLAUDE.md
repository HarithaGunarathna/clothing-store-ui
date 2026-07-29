# CLAUDE_FRONTEND.md

Guidance for building the frontend that consumes the Clothing Store API. Written to be
handed to a frontend repository — it describes the API's contract and the auth mechanics
the client **must** implement correctly, not the backend's internals.

The backend lives in a separate repository. Its own guidance is in `CLAUDE.md`, and the
reasoning behind the auth design is in `adr/`.

---

## 1. The auth model in one picture

```
┌─ Access token ──────────────────────────────────────────────┐
│ Returned in the JSON body. Lives in memory only.            │
│ ~15 minutes. Sent as `Authorization: Bearer <token>`.       │
└─────────────────────────────────────────────────────────────┘
┌─ Refresh token ─────────────────────────────────────────────┐
│ httpOnly cookie. JavaScript CANNOT read it — by design.     │
│ 30 days. Path=/auth. Sent automatically, but only if the    │
│ request sets `credentials: 'include'`.                      │
└─────────────────────────────────────────────────────────────┘
```

Consequences that shape the whole frontend:

- **Never put the access token in `localStorage` or `sessionStorage`.** Keep it in a
  module variable or your state store. It is short-lived and cheap to re-obtain.
- **A page reload loses the access token.** That is expected. On startup you call
  `POST /auth/refresh`; if it succeeds the user was signed in, if it 401s they weren't.
  This is the *only* way to know — you cannot inspect the cookie.
- **You cannot implement "remember me" or read session state directly.** The server owns
  it.

---

## 2. Non-negotiables

These fail silently or confusingly if you get them wrong.

1. **`credentials: 'include'` on every request.** Without it the browser sends the
   request but omits the refresh cookie, so `/auth/refresh` returns 401 and it looks
   like a session bug.
2. **The frontend origin must be listed in the backend's `FRONTEND_ORIGIN`.** CORS with
   credentials forbids a `*` wildcard. If the API is on `:3000` and Vite on `:5173`,
   `FRONTEND_ORIGIN=http://localhost:5173` must be set in the backend's `.env`.
3. **Start OAuth with a full-page navigation, never `fetch`.**
   `window.location.href = '<API>/auth/google'`. An XHR cannot follow the redirect to
   Google and will fail CORS.
4. **Single-flight the refresh call.** See §5. Firing several refreshes concurrently is
   the single most likely way to break sessions.
5. **Never trust the JWT client-side.** Decoding it for UX (showing a name, pre-empting
   expiry) is fine. It is not an authorisation decision.

---

## 3. API reference

Base URL from an env var, e.g. `VITE_API_BASE_URL=http://localhost:3000`.

Every response below also sets or rotates the refresh cookie unless noted.

### Password auth

| | |
|---|---|
| `POST /auth/register` | → `201 { access_token }` |
| `POST /auth/login` | → `200 { access_token }` |

```jsonc
// POST /auth/register
{
  "firstName": "Jane", "lastName": "Doe",
  "userName": "janedoe", "email": "jane@example.com",
  "password": "secret",
  "phoneNumber": "0771234567",   // optional
  "dob": "1995-06-15",           // optional, ISO date
  "role": "buyer"                // "buyer" | "seller" | "admin"
}

// POST /auth/login
{ "userName": "janedoe", "password": "secret" }
```

Registration signs the user straight in — there is no separate login step and no email
verification.

### Session

| | |
|---|---|
| `POST /auth/refresh` | No body. Cookie is the credential. → `200 { access_token }` |
| `POST /auth/logout` | → `204`, always. Ends **this** session only. |

`/auth/refresh` rotates the cookie on every success. On failure it clears the cookie —
so a 401 here is terminal: send the user to login, do not retry.

### Social sign-in

Redirect flow (recommended — no SDK needed):

| | |
|---|---|
| `GET /auth/google` | Navigate the browser here |
| `GET /auth/facebook` | Navigate the browser here |

The provider returns to the API's callback, which sets the refresh cookie and redirects
to `FRONTEND_POST_LOGIN_URL`. **There is no token in that URL** — not in the query
string, not in the fragment. Your landing page calls `POST /auth/refresh` to get its
first access token.

Client-token flow (only if you integrate a provider SDK):

| | |
|---|---|
| `POST /auth/google/token` | `{ "idToken": "..." }` → `200 { access_token }` |
| `POST /auth/facebook/token` | `{ "accessToken": "..." }` → `200 { access_token }` |

Note the different field names: Google's SDK yields an **ID token**, Facebook's an
**access token**. They are not interchangeable.

---

## 4. The four flows

**Password login** — `POST /auth/login` → store `access_token` in memory → navigate.

**Social login** —
```
window.location.href = `${API_BASE}/auth/google`
   ↓ user consents at Google
   ↓ API callback sets the refresh cookie
   ↓ browser lands on FRONTEND_POST_LOGIN_URL (clean, no token)
your callback route calls POST /auth/refresh → access token → navigate
```
Point `FRONTEND_POST_LOGIN_URL` at a dedicated route (e.g. `/auth/callback`) that shows
a spinner, bootstraps the session, then redirects to the app.

**App startup** — call `POST /auth/refresh` once before rendering protected UI. Success
means a live session; 401 means signed out. Render a loading state until it settles,
otherwise the UI flashes "logged out" on every reload.

**Logout** — `POST /auth/logout`, clear the in-memory token, navigate to login. Other
devices stay signed in; there is no "sign out everywhere" endpoint yet.

---

## 5. The API client

This is the part worth getting exactly right. Framework-agnostic TypeScript — drop it in
a `lib/api.ts` and wire the callbacks to your store.

```ts
const API_BASE = import.meta.env.VITE_API_BASE_URL;

let accessToken: string | null = null;
export const setAccessToken = (t: string | null) => { accessToken = t; };

/** Fires when the session is gone for good — clear state, route to login. */
let onSessionLost: () => void = () => {};
export const setOnSessionLost = (fn: () => void) => { onSessionLost = fn; };

// Single-flight: concurrent 401s share ONE refresh instead of racing.
let refreshInFlight: Promise<string> | null = null;

export function refreshAccessToken(): Promise<string> {
  refreshInFlight ??= (async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('session-expired');
      const { access_token } = await res.json();
      setAccessToken(access_token);
      return access_token;
    } finally {
      refreshInFlight = null;
    }
  })();
  return refreshInFlight;
}

export async function apiFetch(
  path: string,
  init: RequestInit = {},
  allowRetry = true,
): Promise<Response> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(init.headers ?? {}),
    },
  });

  if (res.status !== 401 || !allowRetry) return res;

  // Access token probably just expired — refresh once, then replay.
  try {
    await refreshAccessToken();
  } catch {
    setAccessToken(null);
    onSessionLost();
    return res;
  }
  return apiFetch(path, init, false);
}

/** Call once at startup. True if a session was restored. */
export async function bootstrapSession(): Promise<boolean> {
  try { await refreshAccessToken(); return true; }
  catch { return false; }
}
```

**Why single-flight matters here.** The backend rotates the refresh token on every use
and treats a reused token as theft — it revokes the whole session. It does allow a short
grace window (10s by default) to absorb exactly this race, but that window is a safety
net, not a licence: it can be configured to `0`, and relying on it means a page that
fires six parallel requests can log the user out. One in-flight refresh, always.

**Retry exactly once.** A second 401 after a successful refresh is a real authorisation
failure, not an expired token. Retrying again loops.

---

## 6. Mapping API errors to UX

Errors arrive as `{ "message": "...", "error": "...", "statusCode": n }`. These are the
ones that need specific handling rather than a generic toast:

| Status | Message | What it means / what to show |
|---|---|---|
| 401 | `This account uses social sign-in` | The email/username exists but has no password. Prompt: *"Continue with Google or Facebook."* |
| 401 | `Incorrect Username or Password` | Generic bad-credentials. Don't reveal which field. |
| 401 | `User Does Not Exist` | Backend distinguishes this from a bad password. **Treat it as identical to the above in the UI** — surfacing it enables account enumeration. |
| 401 | `User Already Exists` (on register) | Username taken. Note it's a 401, not 409. |
| 401 | `That email is already registered. Sign in with your password first.` | Facebook gave an unverified email matching an existing account. Ask them to sign in with their password, then link. |
| 401 | `Your Facebook account did not share an email address...` | They denied the email permission. Ask them to retry and grant it, or use another method. |
| 401 | `Refresh token was already used; session revoked` | **Security event.** The session was revoked because the token was replayed. Hard-logout and show a distinct message: *"For your security we signed you out. Please sign in again."* |
| 401 | `Refresh token has expired` / `Invalid refresh token` / `Missing refresh token` | Ordinary session end. Route to login quietly. |
| 401 | `OAuth state mismatch` / `Missing OAuth state cookie` | The OAuth round trip broke — usually blocked cookies or a stale tab. Offer *"Try signing in again."* |
| 400 | `idToken is required` / `accessToken is required` | Client bug — wrong field name for the provider. |

Only the *revoked* case deserves an alarming message. The rest are routine.

---

## 7. Backend gaps — do not design around these as if they exist

Verified against the backend as it stands. Plan for them.

- **There is no `/auth/me` or user profile endpoint.** `UserController` is empty. The
  only identity you get is the JWT payload: `{ userId, username }`.
- **`username` is `null` for users created via Google or Facebook.** So it cannot be
  your display name. Until a profile endpoint exists, either show the email (which you
  do not currently receive) or ask the backend for `GET /auth/me`. **Recommend
  requesting that endpoint before building the account UI** — it is the cleanest fix.
- **No endpoint is actually protected.** `AuthGuard` exists but is never applied with
  `@UseGuards`. Any route guard you build is UX only; it is not enforcing anything yet.
  Do not treat client-side gating as security.
- **`GET /auth/all-users` is public and returns full user rows including the bcrypt
  password hash.** Do not build on it. It should be removed or guarded and filtered
  backend-side; flag it rather than consuming it.
- **Roles are stored but not enforced.** `buyer` / `seller` / `admin` exist on the user
  and a `@Roles()` decorator is defined, but no guard reads it.
- **No password reset, no email verification, no "sign out everywhere".**
- **No product, cart or order endpoints yet.** Auth is all that exists.

---

## 8. Suggested structure

```
src/
├── lib/api.ts            # the client from §5 — the only place that calls fetch
├── auth/
│   ├── AuthProvider.tsx  # holds user + status, calls bootstrapSession() on mount
│   ├── RequireAuth.tsx   # route guard (UX only — see §7)
│   └── routes/
│       ├── Login.tsx
│       ├── Register.tsx
│       └── Callback.tsx  # FRONTEND_POST_LOGIN_URL lands here
└── ...
```

`AuthProvider` should expose a three-state status — `loading | authenticated |
anonymous` — and render nothing protected while `loading`. Wire `setOnSessionLost` to
its logout action so a dead session anywhere in the app resolves to one place.

Examples above use React/Vite naming; the client in §5 is framework-agnostic and the
same structure maps onto Vue or Svelte directly.

---

## 9. Local development

1. Backend: `npm run start:dev` on `http://localhost:3000`.
2. Backend `.env` must contain `FRONTEND_ORIGIN=http://localhost:5173` and
   `FRONTEND_POST_LOGIN_URL=http://localhost:5173/auth/callback`.
3. Frontend `.env`: `VITE_API_BASE_URL=http://localhost:3000`.
4. **Do not set `NODE_ENV=production` locally.** The refresh cookie is marked `Secure`
   in production, and the browser drops `Secure` cookies over plain `http` — every
   session silently fails.

Google and Facebook sign-in both work fully on `localhost`; no deployment or tunnel is
needed. `http://localhost` is an explicit exception to Google's HTTPS-only redirect rule,
and Facebook permits it while the app is in Development mode.

Verifying cookies: DevTools → Application → Cookies → `localhost`. You should see
`refresh_token`, flagged `HttpOnly`, with `Path=/auth`. If it is missing after login, the
cause is almost always a missing `credentials: 'include'` or an origin absent from
`FRONTEND_ORIGIN`.
