import { useCallback, useEffect, useMemo, useState } from "react";
import { ShopContext } from "./ShopContext";

const FAVOURITES_KEY = "luna:favourites";
const CART_KEY = "luna:cart";

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Persisted to localStorage — unlike the access token, this
 * isn't auth-sensitive, so surviving a reload is exactly what we want.
 */
export default function ShopProvider({ children }) {
  const [favourites, setFavourites] = useState(() => readStorage(FAVOURITES_KEY, []));
  const [cartLines, setCartLines] = useState(() => readStorage(CART_KEY, []));

  useEffect(() => {
    localStorage.setItem(FAVOURITES_KEY, JSON.stringify(favourites));
  }, [favourites]);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cartLines));
  }, [cartLines]);

  const isFavourite = useCallback(
    (id) => favourites.some((item) => item.id === id),
    [favourites],
  );

  const toggleFavourite = useCallback((item) => {
    setFavourites((list) =>
      list.some((p) => p.id === item.id)
        ? list.filter((p) => p.id !== item.id)
        : [...list, item],
    );
  }, []);

  const addToCart = useCallback((item, quantity = 1) => {
    setCartLines((lines) => {
      const existing = lines.find((line) => line.item.id === item.id);
      if (existing) {
        return lines.map((line) =>
          line.item.id === item.id ? { ...line, quantity: line.quantity + quantity } : line,
        );
      }
      return [...lines, { item, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((id) => {
    setCartLines((lines) => lines.filter((line) => line.item.id !== id));
  }, []);

  const setCartQuantity = useCallback((id, quantity) => {
    setCartLines((lines) =>
      quantity <= 0
        ? lines.filter((line) => line.item.id !== id)
        : lines.map((line) => (line.item.id === id ? { ...line, quantity } : line)),
    );
  }, []);

  const cartQuantity = useCallback(
    (id) => cartLines.find((line) => line.item.id === id)?.quantity ?? 0,
    [cartLines],
  );

  const cartCount = useMemo(
    () => cartLines.reduce((sum, line) => sum + line.quantity, 0),
    [cartLines],
  );

  const value = useMemo(
    () => ({
      favourites,
      isFavourite,
      toggleFavourite,
      cartLines,
      cartCount,
      cartQuantity,
      addToCart,
      removeFromCart,
      setCartQuantity,
    }),
    [
      favourites,
      isFavourite,
      toggleFavourite,
      cartLines,
      cartCount,
      cartQuantity,
      addToCart,
      removeFromCart,
      setCartQuantity,
    ],
  );

  return <ShopContext value={value}>{children}</ShopContext>;
}
