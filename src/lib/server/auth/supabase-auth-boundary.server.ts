import type { AuthUser } from "../platform-auth.server.ts";
import {
  rolePermissionDraft,
  type PermissionKey,
  type UserRole,
} from "../platform-system-model.server.ts";

export type SupabaseJwtClaims = {
  sub?: string;
  email?: string;
  phone?: string;
  role?: string;
  app_metadata?: Record<string, unknown>;
  user_metadata?: Record<string, unknown>;
};

export type BusinessUserRoleRecord = {
  role: UserRole;
  permissions?: PermissionKey[];
  enterpriseId?: string;
  teacherProfileId?: string;
};

export type BusinessUserRecord = {
  id: string;
  preferredLocale?: string;
  roles: BusinessUserRoleRecord[];
};

export type CurrentUserBoundaryInput = {
  claims?: SupabaseJwtClaims | null;
  businessUser?: BusinessUserRecord | null;
};

export type CurrentUserResolution =
  | {
      status: "anonymous";
      user: null;
      reason: "NO_SESSION" | "NO_BUSINESS_USER" | "SUBJECT_MISMATCH" | "NO_ROLE";
    }
  | { status: "authenticated"; user: AuthUser };

export function mapBusinessUserToAuthUser(businessUser: BusinessUserRecord): AuthUser {
  const primaryRole = businessUser.roles[0]?.role;
  if (!primaryRole) {
    throw new Error("Cannot map business user without at least one role.");
  }

  const permissions = new Set<PermissionKey>([
    ...rolePermissionDraft[primaryRole].permissions,
    ...businessUser.roles.flatMap(
      (role) => role.permissions ?? rolePermissionDraft[role.role].permissions,
    ),
  ]);

  return {
    id: businessUser.id,
    role: primaryRole,
    permissions: Array.from(permissions),
    enterpriseId: businessUser.roles.find((role) => role.enterpriseId)?.enterpriseId,
    teacherProfileId: businessUser.roles.find((role) => role.teacherProfileId)?.teacherProfileId,
    locale: businessUser.preferredLocale,
  };
}

export function buildAuthUserFromClaims(input: CurrentUserBoundaryInput): CurrentUserResolution {
  if (!input.claims?.sub) {
    return { status: "anonymous", user: null, reason: "NO_SESSION" };
  }

  if (!input.businessUser) {
    return { status: "anonymous", user: null, reason: "NO_BUSINESS_USER" };
  }

  if (input.claims.sub !== input.businessUser.id) {
    return { status: "anonymous", user: null, reason: "SUBJECT_MISMATCH" };
  }

  if (input.businessUser.roles.length === 0) {
    return { status: "anonymous", user: null, reason: "NO_ROLE" };
  }

  return {
    status: "authenticated",
    user: mapBusinessUserToAuthUser(input.businessUser),
  };
}

export const getCurrentUserFromRequestBoundary = {
  source: "Server Function request/context",
  steps: [
    "Read Supabase session or JWT from server-side request context.",
    "Resolve auth.users.id from JWT sub.",
    "Load business users, user_roles, role_permissions, and profile ownership references.",
    "Map records with mapBusinessUserToAuthUser.",
    "Return null/anonymous when no session or business user is available.",
  ],
  forbidden: [
    "Do not read SUPABASE_SERVICE_ROLE_KEY in request-level user resolution.",
    "Do not trust client-submitted user_id, role, or permissions.",
    "Do not expose raw JWT, service key, or database connection details in Result errors.",
  ],
} as const;
