import { createContext, useContext } from "react";

/**
 * Favourites and basket are client-only — there's no wishlist/cart API yet.
 * Both store the full item object (not just an id), since
 * items come from a live per-category fetch rather than one fixed catalog —
 * there's nowhere else to look a saved item's name/price/image back up from
 * once the user has left that category page.
 */
export const ShopContext = createContext({
  favourites: [], // normalized item objects
  isFavourite: () => false,
  toggleFavourite: () => {},
  cartLines: [], // { item, quantity }
  cartCount: 0,
  cartQuantity: () => 0,
  addToCart: () => {},
  removeFromCart: () => {},
  setCartQuantity: () => {},
});

export const useShop = () => useContext(ShopContext);
