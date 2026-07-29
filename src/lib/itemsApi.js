import { apiJson } from "./api";

/**
 * GET /api/v1/items/get-all-items?tag=... — public. Returns the 20 newest
 * items carrying `tag` (one of the ItemTags in constants/itemConstants.js).
 */
export async function getItemsByTag(tag) {
  const { items } = await apiJson(
    `/api/v1/items/get-all-items?tag=${encodeURIComponent(tag)}`,
  );
  return items.map(normalizeItem);
}

function normalizeItem(raw) {
  return {
    id: raw.itemid,
    code: raw.itemcode,
    name: raw.title,
    price: raw.price,
    discountAmount: raw.discount_amount ?? 0,
    primaryImage: raw.primary_pic_link,
    secondaryImage: raw.secondary_pic_link,
    stock: raw.message,
  };
}
