/**
 * Maps backend auth errors to what the user should actually see.
 *
 * Returns `{ kind, message, action }`:
 *  - `kind` lets callers branch on the few cases that need special UI.
 *  - `action` is a hint for a secondary affordance, when one helps.
 */

const REVOKED = "Refresh token was already used; session revoked";

const RULES = [
  {
    match: /this account uses social sign-in/i,
    kind: "social-only",
    message: "This account uses social sign-in. Continue with Google or Facebook.",
    action: "social",
  },
  {
    match: /user already exists/i,
    kind: "username-taken",
    message: "That username is already taken. Try another one.",
  },
  {
    match: /that email is already registered/i,
    kind: "link-password-first",
    message:
      "That email is already registered. Sign in with your password first, then link Facebook.",
  },
  {
    match: /did not share an email address/i,
    kind: "facebook-no-email",
    message:
      "Facebook didn't share an email address. Try again and allow the email permission, or use another sign-in method.",
    action: "retry-social",
  },
  {
    match: /already used; session revoked/i,
    kind: "session-revoked",
    message: "For your security we signed you out. Please sign in again.",
  },
  {
    match: /oauth state mismatch|missing oauth state cookie/i,
    kind: "oauth-broken",
    message:
      "Sign-in didn't complete — this usually means blocked cookies or a stale tab.",
    action: "retry-social",
  },
  {
    match: /refresh token (has expired|is invalid)|invalid refresh token|missing refresh token/i,
    kind: "session-ended",
    message: "Your session has ended. Please sign in again.",
  },
  {
    // Both bad-password and unknown-user collapse to one message: surfacing
    // "User Does Not Exist" separately enables account enumeration.
    match: /incorrect username or password|user does not exist/i,
    kind: "bad-credentials",
    message: "Incorrect username or password.",
  },
  {
    match: /(idToken|accessToken) is required/i,
    kind: "client-bug",
    message: "Something went wrong on our side. Please try again.",
  },
];

export function describeAuthError(err) {
  const raw = err?.message ?? "";
  const rule = RULES.find((r) => r.match.test(raw));
  if (rule) return { kind: rule.kind, message: rule.message, action: rule.action };

  if (err?.statusCode === 400) {
    return { kind: "invalid-input", message: raw || "Please check the form and try again." };
  }
  if (!err?.statusCode) {
    return {
      kind: "network",
      message: "Couldn't reach the server. Check your connection and try again.",
    };
  }
  return { kind: "unknown", message: raw || "Something went wrong. Please try again." };
}

/** True when the session died because a refresh token was replayed. */
export const isSessionRevoked = (err) => (err?.message ?? "").includes(REVOKED);
