import { Link } from "react-router";
import { useAuth } from "../../auth/AuthContext";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";

const CATEGORIES = [
  {
    to: "/women",
    label: "Women",
    caption: "Tailoring, knits, everyday",
    tone: "bg-stone-200",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    to: "/men",
    label: "Men",
    caption: "Outerwear & essentials",
    tone: "bg-stone-100",
    span: "",
  },
  {
    to: "/new",
    label: "New in",
    caption: "Just landed",
    tone: "bg-clay-50",
    span: "",
  },
];

const PROMISES = [
  { title: "Free shipping", body: "On every order over $75, everywhere." },
  { title: "30-day returns", body: "Changed your mind? So have we. It's fine." },
  { title: "Members first", body: "Early access to drops before they go public." },
];

export default function Home() {
  const { status, user } = useAuth();

  return (
    <>
      {/* ---------------------------------------------------------------- Hero */}
      <section className="container mx-auto px-4 py-24 text-center md:py-32">
        <Badge>Autumn / Winter is live</Badge>

        <h1 className="mx-auto mt-8 max-w-3xl font-display text-5xl font-medium leading-[1.1] tracking-tight text-ink md:text-6xl">
          {status === "authenticated" ? (
            <>
              Welcome back{user?.username ? `, ${user.username}` : ""}.
              <br />
              <span className="brand-accent">Your next find</span> is waiting.
            </>
          ) : (
            <>
              Considered clothing,
              <br />
              <span className="brand-accent">quietly</span> made.
            </>
          )}
        </h1>

        <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-muted">
          Luna is a small label — limited runs, honest fabrics, and nothing
          you'll see on everyone else.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button to="/new" size="lg">
            Shop the drop
          </Button>
          <Button
            to={status === "authenticated" ? "/account" : "/register"}
            variant="secondary"
            size="lg"
          >
            {status === "authenticated" ? "Your account" : "Join Luna"}
          </Button>
        </div>
      </section>

      {/* -------------------------------------------------------- Categories */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-2xl font-medium text-ink md:text-3xl">
            Where to start
          </h2>
          <Link
            to="/new"
            className="text-sm font-medium text-clay-500 transition hover:text-clay-600"
          >
            Browse everything →
          </Link>
        </div>

        <div className="grid auto-rows-[13rem] grid-cols-1 gap-4 md:grid-cols-4">
          {CATEGORIES.map(({ to, label, caption, tone, span }) => (
            <Link
              key={to}
              to={to}
              className={`group relative overflow-hidden rounded-card border border-line ${tone} ${span}`}
            >
              <div className="flex h-full flex-col justify-end p-6">
                <h3 className="font-display text-2xl font-medium text-ink">
                  {label}
                </h3>
                <p className="mt-1 text-sm text-muted">{caption}</p>
                <span className="mt-3 text-sm font-medium text-ink underline decoration-line-strong underline-offset-4 transition group-hover:decoration-ink">
                  Shop now
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------- Promises */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid gap-px overflow-hidden rounded-card border border-line bg-line md:grid-cols-3">
          {PROMISES.map(({ title, body }) => (
            <div key={title} className="bg-surface p-8">
              <h3 className="text-base font-medium text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------- Closing call to action
          The landing page ends here — no footer, by design. */}
      <section className="border-t border-line bg-surface-2">
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="font-display text-3xl font-medium text-ink md:text-4xl">
            {status === "authenticated"
              ? "Members see it first."
              : "Get first look at every drop."}
          </h2>
          <p className="mx-auto mt-4 max-w-md text-muted">
            {status === "authenticated"
              ? "You're on the list. New pieces land every other Thursday."
              : "Create an account and we'll open the drop to you 24 hours early."}
          </p>
          <div className="mt-8 flex justify-center">
            <Button
              to={status === "authenticated" ? "/new" : "/register"}
              variant="accent"
              size="lg"
            >
              {status === "authenticated" ? "Shop new in" : "Create your account"}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
