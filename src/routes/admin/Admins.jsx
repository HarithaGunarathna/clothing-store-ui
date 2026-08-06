import { useEffect, useState } from "react";
import Alert from "../../components/ui/Alert";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Modal from "../../components/ui/Modal";
import Spinner from "../../components/ui/Spinner";
import TextField from "../../components/ui/TextField";
import { AdminRoleBadgeTones, UserRoleLabels, UserRoles } from "../../constants/userConstants";
import { createAdmin, deleteAdmin, getAllAdmins } from "../../lib/adminApi";
import { formatDate } from "../../lib/format";

const EMPTY_FORM = {
  userName: "",
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  phoneNumber: "",
  role: UserRoles.Admin,
};

const ROLE_CHOICES = [UserRoles.Admin, UserRoles.SuperAdmin];

export default function Admins() {
  const [state, setState] = useState({ status: "loading", admins: [] });

  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [createError, setCreateError] = useState(null);
  const [creating, setCreating] = useState(false);

  const [disableTarget, setDisableTarget] = useState(null);
  const [disableError, setDisableError] = useState(null);
  const [disabling, setDisabling] = useState(false);

  function load() {
    setState((s) => ({ ...s, status: "loading" }));
    getAllAdmins()
      .then((admins) => setState({ status: "ready", admins }))
      .catch(() => setState({ status: "error", admins: [] }));
  }

  useEffect(() => {
    load();
  }, []);

  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));

  function closeCreate() {
    if (creating) return;
    setCreateOpen(false);
    setCreateError(null);
    setForm(EMPTY_FORM);
  }

  async function handleCreate(e) {
    e.preventDefault();
    setCreateError(null);
    setCreating(true);
    try {
      const payload = {
        userName: form.userName.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
        ...(form.firstName.trim() ? { firstName: form.firstName.trim() } : {}),
        ...(form.lastName.trim() ? { lastName: form.lastName.trim() } : {}),
        ...(form.phoneNumber.trim() ? { phoneNumber: form.phoneNumber.trim() } : {}),
      };
      await createAdmin(payload);
      closeCreate();
      load();
    } catch (err) {
      setCreateError(err.message ?? "Couldn't create that account.");
    } finally {
      setCreating(false);
    }
  }

  function closeDisable() {
    if (disabling) return;
    setDisableTarget(null);
    setDisableError(null);
  }

  async function handleDisable() {
    if (!disableTarget) return;
    setDisableError(null);
    setDisabling(true);
    try {
      await deleteAdmin(disableTarget.id);
      setDisableTarget(null);
      load();
    } catch (err) {
      setDisableError(err.message ?? "Couldn't disable that account.");
    } finally {
      setDisabling(false);
    }
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-medium text-ink">Admins</h1>
          <p className="mt-2 text-sm text-muted">
            {state.status === "ready"
              ? `${state.admins.length} account${state.admins.length === 1 ? "" : "s"}`
              : "Manage admin and super admin accounts."}
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>Create admin</Button>
      </div>

      <div className="mt-8">
        {state.status === "loading" ? (
          <div className="flex justify-center py-16">
            <Spinner label="Loading admins…" />
          </div>
        ) : state.status === "error" ? (
          <Alert>Couldn't load admin accounts. Try refreshing the page.</Alert>
        ) : state.admins.length === 0 ? (
          <Card className="p-10 text-center">
            <p className="text-sm text-muted">No admin accounts yet.</p>
          </Card>
        ) : (
          <Card className="overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-line text-xs uppercase tracking-[0.08em] text-faint">
                    <th className="px-5 py-3 font-medium">Name</th>
                    <th className="px-5 py-3 font-medium">Username</th>
                    <th className="px-5 py-3 font-medium">Email</th>
                    <th className="px-5 py-3 font-medium">Role</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Created</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {state.admins.map((admin) => {
                    const name = [admin.firstName, admin.lastName].filter(Boolean).join(" ");
                    return (
                      <tr key={admin.id} className="border-b border-line last:border-b-0">
                        <td className="px-5 py-3 text-ink">{name || "—"}</td>
                        <td className="px-5 py-3 text-ink">{admin.userName}</td>
                        <td className="px-5 py-3 text-muted">{admin.email}</td>
                        <td className="px-5 py-3">
                          <Badge tone={AdminRoleBadgeTones[admin.role] ?? "ink"}>
                            {UserRoleLabels[admin.role] ?? admin.role}
                          </Badge>
                        </td>
                        <td className="px-5 py-3">
                          <Badge tone={admin.isActive ? "ink" : "neutral"}>
                            {admin.isActive ? "Active" : "Disabled"}
                          </Badge>
                        </td>
                        <td className="px-5 py-3 text-muted">{formatDate(admin.createdAt)}</td>
                        <td className="px-5 py-3 text-right">
                          {admin.isActive ? (
                            <button
                              type="button"
                              onClick={() => {
                                setDisableError(null);
                                setDisableTarget(admin);
                              }}
                              className="text-sm font-medium text-danger hover:underline"
                            >
                              Disable
                            </button>
                          ) : null}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>

      <Modal open={createOpen} onClose={closeCreate} title="Create admin">
        <h2 className="font-display text-xl font-medium text-ink">Create admin</h2>
        <p className="mt-1 text-sm text-muted">New accounts default to Admin.</p>

        {createError ? (
          <div className="mt-4">
            <Alert>{createError}</Alert>
          </div>
        ) : null}

        <form onSubmit={handleCreate} className="mt-5 flex flex-col gap-4">
          <TextField
            label="Username"
            name="userName"
            value={form.userName}
            onChange={set("userName")}
            required
            autoComplete="username"
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

          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="First name"
              name="firstName"
              value={form.firstName}
              onChange={set("firstName")}
              hint="Optional"
            />
            <TextField
              label="Last name"
              name="lastName"
              value={form.lastName}
              onChange={set("lastName")}
              hint="Optional"
            />
          </div>
          <TextField
            label="Phone"
            name="phoneNumber"
            type="tel"
            value={form.phoneNumber}
            onChange={set("phoneNumber")}
            hint="Optional"
          />

          <fieldset>
            <legend className="text-xs font-medium uppercase tracking-[0.08em] text-muted">
              Role
            </legend>
            <div className="mt-2 grid grid-cols-2 gap-3">
              {ROLE_CHOICES.map((role) => {
                const active = form.role === role;
                return (
                  <label
                    key={role}
                    className={[
                      "cursor-pointer rounded-lg border p-3 text-center text-sm font-medium transition",
                      active
                        ? "border-ink bg-surface-2 text-ink"
                        : "border-line bg-canvas text-muted hover:border-line-strong",
                    ].join(" ")}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={role}
                      checked={active}
                      onChange={() => set("role")(role)}
                      className="sr-only"
                    />
                    {UserRoleLabels[role]}
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="mt-2 flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={closeCreate} disabled={creating}>
              Cancel
            </Button>
            <Button type="submit" disabled={creating}>
              {creating ? "Creating…" : "Create account"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal open={Boolean(disableTarget)} onClose={closeDisable} title="Disable admin">
        <h2 className="font-display text-xl font-medium text-ink">Disable this account?</h2>
        <p className="mt-2 text-sm text-muted">
          {disableTarget
            ? `${disableTarget.userName} will be signed out immediately and won't be able to sign in again. This can't be undone from here.`
            : null}
        </p>

        {disableError ? (
          <div className="mt-4">
            <Alert>{disableError}</Alert>
          </div>
        ) : null}

        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={closeDisable} disabled={disabling}>
            Cancel
          </Button>
          <Button type="button" variant="danger" onClick={handleDisable} disabled={disabling}>
            {disabling ? "Disabling…" : "Disable account"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
