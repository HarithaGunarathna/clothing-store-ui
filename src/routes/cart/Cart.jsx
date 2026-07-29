import { Link } from "react-router";
import Button from "../../components/ui/Button";
import { formatPrice } from "../../lib/format";
import { useShop } from "../../shop/ShopContext";

const unitPrice = (item) => (item.discountAmount > 0 ? item.price - item.discountAmount : item.price);

export default function Cart() {
  const { cartLines, setCartQuantity, removeFromCart } = useShop();

  const subtotal = cartLines.reduce((sum, { item, quantity }) => sum + unitPrice(item) * quantity, 0);

  return (
    <div className="container mx-auto max-w-3xl px-4 py-14">
      <nav className="text-xs text-faint">
        <Link to="/" className="hover:text-ink">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">Basket</span>
      </nav>

      <h1 className="mt-4 font-display text-3xl font-medium text-ink md:text-4xl">
        Your basket
      </h1>

      {cartLines.length === 0 ? (
        <div className="mt-10 rounded-card border border-line bg-surface p-10 text-center">
          <p className="text-sm text-muted">Your basket is empty.</p>
          <Link
            to="/women"
            className="mt-4 inline-block text-sm font-medium text-clay-500 hover:text-clay-600"
          >
            Browse Women →
          </Link>
        </div>
      ) : (
        <>
          <ul className="mt-10 divide-y divide-line rounded-card border border-line bg-surface">
            {cartLines.map(({ item, quantity }) => (
              <li key={item.id} className="flex items-center gap-4 p-5">
                <div
                  className="h-20 w-16 shrink-0 rounded-lg border border-line bg-stone-100 bg-cover bg-center"
                  style={item.primaryImage ? { backgroundImage: `url(${item.primaryImage})` } : undefined}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-ink">{item.name}</p>
                  <p className="mt-1 text-xs text-faint">{formatPrice(unitPrice(item))} each</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCartQuantity(item.id, quantity - 1)}
                    aria-label={`Decrease quantity of ${item.name}`}
                    className="flex h-7 w-7 items-center justify-center rounded-pill border border-line text-ink hover:bg-surface-2"
                  >
                    –
                  </button>
                  <span className="w-6 text-center text-sm text-ink">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setCartQuantity(item.id, quantity + 1)}
                    aria-label={`Increase quantity of ${item.name}`}
                    className="flex h-7 w-7 items-center justify-center rounded-pill border border-line text-ink hover:bg-surface-2"
                  >
                    +
                  </button>
                </div>

                <p className="w-16 text-right text-sm font-medium text-ink">
                  {formatPrice(unitPrice(item) * quantity)}
                </p>

                <button
                  type="button"
                  onClick={() => removeFromCart(item.id)}
                  aria-label={`Remove ${item.name} from basket`}
                  className="text-faint hover:text-danger"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-center justify-between rounded-card border border-line bg-surface-2 p-5">
            <div>
              <p className="text-xs uppercase tracking-[0.08em] text-faint">Subtotal</p>
              <p className="mt-1 font-display text-2xl text-ink">{formatPrice(subtotal)}</p>
            </div>
            <Button size="lg" disabled>
              Checkout
            </Button>
          </div>
          <p className="mt-3 text-xs text-faint">
            Checkout isn't wired up yet — there's no order API to submit to.
          </p>
        </>
      )}
    </div>
  );
}
