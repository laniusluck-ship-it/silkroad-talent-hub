import {
  rolePermissionDraft,
  type PermissionKey,
  type UserRole,
} from "./platform-system-model.server.ts";

export type AuthUser = {
  id: string;
  role: UserRole;
  permissions?: PermissionKey[];
  enterpriseId?: string;
  teacherProfileId?: string;
  locale?: string;
};

export type AuthContext = {
  user?: AuthUser | null;
};

export type AuthCheckResult =
  | { success: true; user: AuthUser }
  | {
      success: false;
      code: "AUTH_REQUIRED" | "ROLE_FORBIDDEN" | "PERMISSION_FORBIDDEN";
      message: string;
    };

export function getCurrentUser(context?: AuthContext): AuthUser | null {
  return context?.user ?? null;
}

export function getRolePermissions(role: UserRole): PermissionKey[] {
  return rolePermissionDraft[role].permissions;
}

export function hasPermission(user: AuthUser | null | undefined, permission: PermissionKey) {
  if (!user) return false;
  return [...getRolePermissions(user.role), ...(user.permissions ?? [])].includes(permission);
}

export function requireRole(
  user: AuthUser | null | undefined,
  allowedRoles: UserRole[],
): AuthCheckResult {
  if (!user) {
    return { success: false, code: "AUTH_REQUIRED", message: "请先登录" };
  }

  if (!allowedRoles.includes(user.role)) {
    return { success: false, code: "ROLE_FORBIDDEN", message: "当前账号无权执行该操作" };
  }

  return { success: true, user };
}

export function requirePermission(
  user: AuthUser | null | undefined,
  permission: PermissionKey,
): AuthCheckResult {
  if (!user) {
    return { success: false, code: "AUTH_REQUIRED", message: "请先登录" };
  }

  if (!hasPermission(user, permission)) {
    return { success: false, code: "PERMISSION_FORBIDDEN", message: "当前账号无权执行该操作" };
  }

  return { success: true, user };
}
