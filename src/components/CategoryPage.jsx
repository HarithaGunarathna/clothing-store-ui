import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getItemsByTag } from "../lib/itemsApi";
import Alert from "./ui/Alert";
import Badge from "./ui/Badge";
import ProductCard from "./ProductCard";
import Spinner from "./ui/Spinner";

/**
 * Shared listing page for every tag in constants/itemConstants.js — Women,
 * Men, New, Sale all render this with different props rather than
 * duplicating the fetch/loading/empty/error handling four times.
 */
export default function CategoryPage({ tag, title, description }) {
  const [state, setState] = useState({ status: "loading", items: [] });

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading", items: [] });

    getItemsByTag(tag)
      .then((items) => {
        if (!cancelled) setState({ status: "ready", items });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error", items: [] });
      });

    return () => {
      cancelled = true;
    };
  }, [tag]);

  return (
    <div className="container mx-auto px-4 py-14">
      <nav className="text-xs text-faint">
        <Link to="/" className="hover:text-ink">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{title}</span>
      </nav>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-medium text-ink md:text-4xl">{title}</h1>
          {description ? <p className="mt-2 max-w-md text-sm text-muted">{description}</p> : null}
        </div>
        {state.status === "ready" && state.items.length > 0 ? (
          <Badge tone="ink">{state.items.length} pieces</Badge>
        ) : null}
      </div>

      {state.status === "loading" ? (
        <div className="mt-16 flex justify-center">
          <Spinner label="Loading pieces…" />
        </div>
      ) : state.status === "error" ? (
        <div className="mt-10">
          <Alert>Couldn't load this collection. Try refreshing the page.</Alert>
        </div>
      ) : state.items.length === 0 ? (
        <div className="mt-10 rounded-card border border-line bg-surface p-10 text-center">
          <p className="text-sm text-muted">Nothing here yet — check back soon.</p>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {state.items.map((item) => (
            <ProductCard key={item.id} item={item} to={`/${tag}`} />
          ))}
        </div>
      )}
    </div>
  );
}
