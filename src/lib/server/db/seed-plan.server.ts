import {
  rolePermissionDraft,
  type PermissionKey,
  type UserRole,
} from "../platform-system-model.server.ts";

export type RoleSeed = {
  key: UserRole;
  label: string;
  permissions: PermissionKey[];
};

export const rolePermissionSeedPlan: RoleSeed[] = Object.entries(rolePermissionDraft).map(
  ([key, value]) => ({
    key: key as UserRole,
    label: value.label,
    permissions: value.permissions,
  }),
);

export const permissionSeedPlan: PermissionKey[] = Array.from(
  new Set(rolePermissionSeedPlan.flatMap((role) => role.permissions)),
).sort();

export const seedSafetyPlan = {
  containsRealUsers: false,
  containsPersonalData: false,
  containsEnterpriseData: false,
  strategy: "Use idempotent upsert by role key and permission key.",
  forbidden: [
    "Do not seed real phone numbers.",
    "Do not seed real enterprise licenses.",
    "Do not seed production admin users in source-controlled migrations.",
  ],
} as const;
