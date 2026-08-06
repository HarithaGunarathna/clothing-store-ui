export const UserRoles = {
  Buyer: "buyer",
  Admin: "admin",
  SuperAdmin: "super_admin",
};

export const UserRoleLabels = {
  [UserRoles.Buyer]: "Buyer",
  [UserRoles.Admin]: "Admin",
  [UserRoles.SuperAdmin]: "Super Admin",
};

export const AdminRoles = [UserRoles.Admin, UserRoles.SuperAdmin];

// Badge `tone` (see components/ui/Badge.jsx) for each admin-tier role.
export const AdminRoleBadgeTones = {
  [UserRoles.Admin]: "info",
  [UserRoles.SuperAdmin]: "danger",
};
