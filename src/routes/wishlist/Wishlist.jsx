import { Link } from "react-router";
import ProductCard from "../../components/ProductCard";
import { useShop } from "../../shop/ShopContext";

export default function Wishlist() {
  const { favourites } = useShop();

  return (
    <div className="container mx-auto px-4 py-14">
      <nav className="text-xs text-faint">
        <Link to="/" className="hover:text-ink">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">Favourites</span>
      </nav>

      <h1 className="mt-4 font-display text-3xl font-medium text-ink md:text-4xl">
        Favourites
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted">
        Pieces you've saved with the heart icon on a product card.
      </p>

      {favourites.length === 0 ? (
        <div className="mt-10 rounded-card border border-line bg-surface p-10 text-center">
          <p className="text-sm text-muted">Nothing saved yet.</p>
          <Link
            to="/women"
            className="mt-4 inline-block text-sm font-medium text-clay-500 hover:text-clay-600"
          >
            Browse Women →
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {favourites.map((item) => (
            <ProductCard key={item.id} item={item} to="/women" />
          ))}
        </div>
      )}
    </div>
  );
}
