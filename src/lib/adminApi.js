import { apiJson, jsonBody } from "./api";

/** GET /api/v1/admin/get-all-admins — super admin only. */
export async function getAllAdmins() {
  const { admins } = await apiJson("/api/v1/admin/get-all-admins");
  return admins;
}

/**
 * POST /api/v1/admin/create-admin — super admin only.
 * `role` is optional server-side (defaults to admin); we always send it
 * explicitly since the form has a picker.
 */
export async function createAdmin(payload) {
  return apiJson("/api/v1/admin/create-admin", {
    method: "POST",
    body: jsonBody(payload),
  });
}

/**
 * DELETE /api/v1/admin/delete-admin/:id — super admin only. Soft-delete:
 * disables the account and revokes its sessions, doesn't remove the row.
 * There's no corresponding "re-enable" endpoint.
 */
export async function deleteAdmin(id) {
  return apiJson(`/api/v1/admin/delete-admin/${id}`, { method: "DELETE" });
}
