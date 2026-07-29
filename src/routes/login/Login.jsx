import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router";
import { useAuth } from "../../auth/AuthContext";
import { describeAuthError } from "../../auth/errors";
import SocialButtons from "../../components/SocialButtons";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Spinner from "../../components/ui/Spinner";
import TextField from "../../components/ui/TextField";

export default function Login() {
  const { status, signIn, notice, clearNotice } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname ?? "/";

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // A revoked-session notice is shown once, then cleared.
  useEffect(() => () => clearNotice(), [clearNotice]);

  if (status === "loading") {
    return (
      <div className="flex flex-1 items-center justify-center">
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
      await signIn({ userName: userName.trim(), password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(describeAuthError(err));
    } finally {
      setSubmitting(false);
    }
  }

  const badCredentials = error?.kind === "bad-credentials";

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <Card lift className="w-full max-w-md p-8">
        <h1 className="font-display text-3xl font-medium text-ink">
          Welcome <span className="brand-accent">back</span>
        </h1>
        <p className="mt-2 text-sm text-muted">
          Sign in to pick up where you left off.
        </p>

        {notice ? (
          <div className="mt-6">
            <Alert tone="warning">{notice}</Alert>
          </div>
        ) : null}

        {error ? (
          <div className="mt-6">
            <Alert tone={error.kind === "social-only" ? "info" : "error"}>
              {error.message}
            </Alert>
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
            placeholder="janedoe"
            invalid={badCredentials}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={setPassword}
            required
            autoComplete="current-password"
            placeholder="••••••••"
            invalid={badCredentials}
          />
          <Button type="submit" fullWidth size="lg" disabled={submitting}>
            {submitting ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <div className="my-7 flex items-center gap-4">
          <div className="brand-rule flex-1" />
          <span className="text-xs font-medium uppercase tracking-[0.12em] text-faint">
            or
          </span>
          <div className="brand-rule flex-1" />
        </div>

        <SocialButtons disabled={submitting} />

        <p className="mt-7 text-center text-sm text-muted">
          New to Luna?{" "}
          <Link
            to="/register"
            className="font-medium text-clay-500 transition hover:text-clay-600"
          >
            Create an account
          </Link>
        </p>
      </Card>
    </div>
  );
}
