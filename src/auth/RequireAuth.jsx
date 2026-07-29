import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "./AuthContext";
import Spinner from "../components/ui/Spinner";

/**
 * Route guard — UX only. No backend endpoint is actually protected yet
 * , so this is not enforcing anything.
 */
export default function RequireAuth() {
  const { status } = useAuth();
  const location = useLocation();

  if (status === "loading") {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <Spinner label="Checking your session…" />
      </div>
    );
  }

  if (status === "anonymous") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
