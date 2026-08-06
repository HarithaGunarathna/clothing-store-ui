import { Outlet } from "react-router";
import { useAuth } from "./auth/AuthContext";
import AdminSidebar from "./components/AdminSidebar";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { AdminRoles } from "./constants/userConstants";

/**
 * Root layout. `withFooter` is set per layout route in main.jsx — the landing
 * page ends on its own call to action and deliberately has no footer.
 */
export default function App({ withFooter = true }) {
  const { status, user } = useAuth();
  const isAdmin = status === "authenticated" && AdminRoles.includes(user?.role);

  return (
    <div className="flex min-h-screen bg-canvas">
      {isAdmin ? <AdminSidebar /> : null}
      <div className="flex min-h-screen flex-1 flex-col">
        <Header />
        <main className="flex flex-1 flex-col">
          <Outlet />
        </main>
        {withFooter ? <Footer /> : null}
      </div>
    </div>
  );
}
