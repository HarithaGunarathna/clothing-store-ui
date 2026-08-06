import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router";
import { useAuth } from "../../auth/AuthContext";
import { describeAuthError } from "../../auth/errors";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Spinner from "../../components/ui/Spinner";
import TextField from "../../components/ui/TextField";

/**
 * Reachable only by typing /login-admin directly — deliberately not linked
 * from anywhere in the storefront UI. Hits POST /auth/admin/login, a
 * separate endpoint from the buyer-facing /auth/login. No social sign-in:
 * admins use a username and password only.
 */
export default function AdminLogin() {
  const { status, signInAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname ?? "/";

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas">
        <Spinner label="Checking your session…" />
      </div>
    );
  }
  if (status === "authenticated") return <Navigate to={from} replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await signInAdmin({ userName: userName.trim(), password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(describeAuthError(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
      <Card lift className="w-full max-w-sm p-8">
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-faint">Luna</p>
        <h1 className="mt-1 font-display text-2xl font-medium text-ink">Admin sign in</h1>
        <p className="mt-2 text-sm text-muted">Restricted access.</p>

        {error ? (
          <div className="mt-6">
            <Alert>{error.message}</Alert>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
          <TextField
            label="Username"
            name="userName"
            value={userName}
            onChange={setUserName}
            required
            autoComplete="username"
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={setPassword}
            required
            autoComplete="current-password"
          />
          <Button type="submit" fullWidth size="lg" disabled={submitting}>
            {submitting ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
