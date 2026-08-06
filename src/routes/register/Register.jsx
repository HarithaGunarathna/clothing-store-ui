import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { useAuth } from "../../auth/AuthContext";
import { describeAuthError } from "../../auth/errors";
import SocialButtons from "../../components/SocialButtons";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Spinner from "../../components/ui/Spinner";
import TextField from "../../components/ui/TextField";

const EMPTY = {
  firstName: "",
  lastName: "",
  userName: "",
  email: "",
  password: "",
  phoneNumber: "",
  dob: "",
};

export default function Register() {
  const { status, signUp } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));

  if (status === "loading") {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Spinner label="Checking your session…" />
      </div>
    );
  }
  if (status === "authenticated") return <Navigate to="/" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      // Optional fields must be omitted rather than sent empty. No `role` —
      // /auth/register only ever creates buyers; the backend decides that.
      const payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        userName: form.userName.trim(),
        email: form.email.trim(),
        password: form.password,
        ...(form.phoneNumber.trim() ? { phoneNumber: form.phoneNumber.trim() } : {}),
        ...(form.dob ? { dob: form.dob } : {}),
      };
      // Registration signs the user straight in — no separate login step.
      await signUp(payload);
      navigate("/", { replace: true });
    } catch (err) {
      setError(describeAuthError(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <Card lift className="w-full max-w-lg p-8">
        <h1 className="font-display text-3xl font-medium text-ink">
          Join <span className="brand-accent">Luna</span>
        </h1>
        <p className="mt-2 text-sm text-muted">
          First look at every drop. You're signed in the moment you register.
        </p>

        {error ? (
          <div className="mt-6">
            <Alert tone={error.kind === "username-taken" ? "warning" : "error"}>
              {error.message}
            </Alert>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              label="First name"
              name="firstName"
              value={form.firstName}
              onChange={set("firstName")}
              required
              autoComplete="given-name"
            />
            <TextField
              label="Last name"
              name="lastName"
              value={form.lastName}
              onChange={set("lastName")}
              required
              autoComplete="family-name"
            />
          </div>

          <TextField
            label="Username"
            name="userName"
            value={form.userName}
            onChange={set("userName")}
            required
            autoComplete="username"
            invalid={error?.kind === "username-taken"}
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={set("email")}
            required
            autoComplete="email"
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={set("password")}
            required
            autoComplete="new-password"
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              label="Phone"
              name="phoneNumber"
              type="tel"
              value={form.phoneNumber}
              onChange={set("phoneNumber")}
              autoComplete="tel"
              placeholder="0771234567"
              hint="Optional"
            />
            <TextField
              label="Date of birth"
              name="dob"
              type="date"
              value={form.dob}
              onChange={set("dob")}
              hint="Optional"
            />
          </div>

          <Button type="submit" fullWidth size="lg" disabled={submitting}>
            {submitting ? "Creating your account…" : "Create account"}
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
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-clay-500 transition hover:text-clay-600"
          >
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );
}
