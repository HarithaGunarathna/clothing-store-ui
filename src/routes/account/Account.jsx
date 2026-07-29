import { useNavigate } from "react-router";
import { useAuth } from "../../auth/AuthContext";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-line py-4 last:border-b-0">
      <dt className="text-xs font-medium uppercase tracking-[0.08em] text-faint">
        {label}
      </dt>
      <dd className="truncate text-sm text-ink">{value ?? "—"}</dd>
    </div>
  );
}

export default function Account() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate("/", { replace: true });
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-16">
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-pill bg-ink text-xl font-medium text-surface">
          {(user?.username ?? "L").charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="font-display text-3xl font-medium text-ink">
            Your account
          </h1>
          <p className="text-sm text-muted">Manage your Luna session.</p>
        </div>
      </div>

      <Card className="p-6">
        <dl>
          {/* null for Google/Facebook users — the backend never sets it. */}
          <Row label="Username" value={user?.username} />
          <Row label="User ID" value={user?.userId} />
        </dl>
      </Card>

      <div className="mt-6 flex items-start gap-3 rounded-card border border-line bg-surface p-5">
        <Badge tone="ink">API gap</Badge>
        <p className="text-sm leading-relaxed text-muted">
          This is everything the access token carries. A{" "}
          <code className="rounded bg-surface-2 px-1.5 py-0.5 text-xs text-ink">
            GET /auth/me
          </code>{" "}
          endpoint would fill in name, email and order history.
        </p>
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Button to="/new" variant="secondary">
          Keep shopping
        </Button>
        <Button variant="danger" onClick={handleSignOut}>
          Sign out
        </Button>
      </div>
    </div>
  );
}
