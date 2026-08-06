import { Navigate, Outlet, useLocation } from "react-router";
import Spinner from "../components/ui/Spinner";
import { useAuth } from "./AuthContext";

/**
 * Route guard — UX only, same caveat as RequireAuth (no backend endpoint
 * actually enforces roles yet). Signed-out visitors go to the admin login,
 * not the buyer one; a signed-in user whose role isn't in `roles` is sent to
 * `redirectTo`.
 */
export default function RequireRole({ roles, redirectTo = "/" }) {
  const { status, user, profileLoading } = useAuth();
  const location = useLocation();

  if (status === "loading") {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <Spinner label="Checking your session…" />
      </div>
    );
  }

  if (status === "anonymous") {
    return <Navigate to="/login-admin" replace state={{ from: location }} />;
  }

  // `role` only arrives once the /auth/me merge lands — wait for it rather
  // than bouncing a legitimate admin during the brief window right after
  // sign-in when only the JWT's { userId, username } has landed.
  if (profileLoading && user?.role === undefined) {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <Spinner label="Checking permissions…" />
      </div>
    );
  }

  if (!roles.includes(user?.role)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}
