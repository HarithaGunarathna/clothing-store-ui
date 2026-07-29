import { Outlet } from "react-router";
import Header from "./components/Header";
import Footer from "./components/Footer";

/**
 * Root layout. `withFooter` is set per layout route in main.jsx — the landing
 * page ends on its own call to action and deliberately has no footer.
 */
export default function App({ withFooter = true }) {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Header />
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
      {withFooter ? <Footer /> : null}
    </div>
  );
}
