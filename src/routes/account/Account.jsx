import { useNavigate } from "react-router";
import { useAuth } from "../../auth/AuthContext";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Spinner from "../../components/ui/Spinner";
import { UserRoleLabels } from "../../constants/userConstants";
import { formatDate } from "../../lib/format";

function Row({ label, labelExtra, value }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-line py-4 last:border-b-0">
      <dt className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.08em] text-faint">
        {label}
        {labelExtra}
      </dt>
      <dd className="truncate text-sm text-ink">{value ?? "—"}</dd>
    </div>
  );
}

function AddressCard({ label, address }) {
  return (
    <Card className="p-5">
      <p className="text-xs font-medium uppercase tracking-[0.08em] text-faint">{label}</p>
      {address ? (
        <div className="mt-3 text-sm leading-relaxed text-ink">
          <p className="font-medium">{address.label}</p>
          <p>{address.line1}</p>
          {address.line2 ? <p>{address.line2}</p> : null}
          <p>
            {[address.city, address.postalCode].filter(Boolean).join(" ")}
            {address.country ? `, ${address.country}` : ""}
          </p>
          {address.phone ? <p className="mt-1 text-muted">{address.phone}</p> : null}
        </div>
      ) : (
        <p className="mt-3 text-sm text-muted">No default {label.toLowerCase()} saved.</p>
      )}
    </Card>
  );
}

export default function Account() {
  const { user, profileLoading, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate("/", { replace: true });
  }

  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ");
  // Profile hasn't merged in yet — the JWT alone doesn't carry these fields.
  const profileReady = user?.email !== undefined;
  const providers = user?.connectedProviders ?? [];

  return (
    <div className="container mx-auto max-w-2xl px-4 py-16">
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-pill bg-ink text-xl font-medium text-surface">
          {(fullName || user?.username || "L").charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="font-display text-3xl font-medium text-ink">
            {fullName || "Your account"}
          </h1>
          <p className="text-sm text-muted">Manage your Luna account.</p>
        </div>
      </div>

      {!profileReady && profileLoading ? (
        <Card className="flex items-center justify-center p-10">
          <Spinner label="Loading your details…" />
        </Card>
      ) : (
        <>
          <Card className="p-6">
            <dl>
              <Row label="Name" value={fullName || null} />
              <Row label="Username" value={user?.username} />
              <Row
                label="Email"
                labelExtra={
                  user?.email ? (
                    <Badge tone={user.emailVerified ? "ink" : "neutral"}>
                      {user.emailVerified ? "Verified" : "Unverified"}
                    </Badge>
                  ) : null
                }
                value={user?.email}
              />
              <Row label="Phone" value={user?.phoneNumber} />
              <Row label="Date of birth" value={formatDate(user?.dob)} />
              <Row label="Role" value={UserRoleLabels[user?.role] ?? user?.role} />
              <Row label="Member since" value={formatDate(user?.createdAt)} />
            </dl>
          </Card>

          <Card className="mt-6 p-6">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.08em] text-faint">
              Sign-in methods
            </p>
            <div className="flex flex-wrap gap-2">
              {user?.hasPassword ? <Badge tone="ink">Password</Badge> : null}
              {providers.map((provider) => (
                <Badge key={provider} tone="ink">
                  {provider.charAt(0).toUpperCase() + provider.slice(1)}
                </Badge>
              ))}
              {!user?.hasPassword && providers.length === 0 ? (
                <p className="text-sm text-muted">No sign-in method on record.</p>
              ) : null}
            </div>
          </Card>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <AddressCard label="Billing" address={user?.defaultBillingAddress} />
            <AddressCard label="Delivery" address={user?.defaultDeliveryAddress} />
          </div>

          <p className="mt-6 text-xs text-faint">
            Order history isn't shown yet — there's no orders endpoint.
          </p>
        </>
      )}

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
