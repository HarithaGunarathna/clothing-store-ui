import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { formatPrice } from "../lib/format";
import { useShop } from "../shop/ShopContext";

const HEART = "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z";
const BAG = "M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4H6ZM3 6h18M16 10a4 4 0 0 1-8 0";
const CHECK = "M20 6 9 17l-5-5";

const ICON_BTN =
  "flex h-8 w-8 items-center justify-center rounded-pill border border-line " +
  "bg-surface/90 text-ink shadow-sm backdrop-blur transition hover:bg-surface";

/** `item` is the normalized shape from lib/itemsApi.js. */
export default function ProductCard({ item, to }) {
  const { id, name, price, discountAmount = 0, primaryImage, secondaryImage, stock } = item;
  const { isFavourite, toggleFavourite, addToCart } = useShop();
  const favourited = isFavourite(id);

  const [justAdded, setJustAdded] = useState(false);
  const [mainFailed, setMainFailed] = useState(false);
  const addedTimer = useRef(null);
  useEffect(() => () => clearTimeout(addedTimer.current), []);

  // Either shot can be null independently (e.g. primary missing, secondary
  // present) — don't assume "primary" is the one guaranteed to exist.
  const shots = [primaryImage, secondaryImage].filter(Boolean);
  const mainImage = shots[0] ?? null;
  const hoverImage = shots.length > 1 ? shots[1] : null;

  function handleFavourite(e) {
    e.preventDefault();
    e.stopPropagation();
    toggleFavourite(item);
  }

  function handleAddToCart(e) {
    e.preventDefault();
    e.stopPropagation();
    addToCart(item);
    setJustAdded(true);
    clearTimeout(addedTimer.current);
    addedTimer.current = setTimeout(() => setJustAdded(false), 1400);
  }

  const salePrice = discountAmount > 0 ? price - discountAmount : null;

  return (
    <Link to={to} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden rounded-card border border-line bg-stone-100">
        {stock ? (
          <span className="absolute left-3 top-3 z-10 inline-flex items-center rounded-pill border border-clay-100 bg-clay-50/95 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.06em] text-clay-600 shadow-sm">
            {stock}
          </span>
        ) : null}

        <div className="absolute right-3 top-3 z-10 flex flex-col gap-2">
          <button
            type="button"
            onClick={handleFavourite}
            aria-pressed={favourited}
            aria-label={favourited ? `Remove ${name} from favourites` : `Add ${name} to favourites`}
            className={ICON_BTN}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill={favourited ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={favourited ? "text-clay-500" : ""}
              aria-hidden="true"
            >
              <path d={HEART} />
            </svg>
          </button>

          <button
            type="button"
            onClick={handleAddToCart}
            aria-label={`Add ${name} to basket`}
            className={ICON_BTN}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d={justAdded ? CHECK : BAG} />
            </svg>
          </button>
        </div>

        {mainImage && !mainFailed ? (
          <>
            {/* Main shot; cross-fades to the second one on hover, if there is one. */}
            <img
              src={mainImage}
              alt={name}
              loading="lazy"
              onError={() => setMainFailed(true)}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out ${
                hoverImage ? "group-hover:opacity-0" : ""
              }`}
            />
            {hoverImage ? (
              <img
                src={hoverImage}
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
              />
            ) : null}
          </>
        ) : null}
      </div>

      <div className="mt-3 flex items-start justify-between gap-3">
        <h3 className="text-sm font-medium text-ink">{name}</h3>
        {salePrice != null ? (
          <div className="flex flex-col items-end">
            <span className="text-xs text-faint line-through">{formatPrice(price)}</span>
            <span className="text-sm font-medium text-clay-600">{formatPrice(salePrice)}</span>
          </div>
        ) : (
          <p className="text-sm font-medium text-ink">{formatPrice(price)}</p>
        )}
      </div>
    </Link>
  );
}
