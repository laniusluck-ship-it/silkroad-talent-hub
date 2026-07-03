import { readFileSync } from "node:fs";

import { createMockPlatformRepository } from "./platform-data.server.ts";
import {
  forbiddenSecretPractices,
  supabaseDrizzleDependencyPlan,
  supabaseEnvironmentPlan,
} from "./db/supabase-drizzle-plan.server.ts";
import {
  dbReadLocaleFallbackPlan,
  dbReadRepositoryPlan,
  dbWriteCutoverPlan,
} from "./db/db-read-repository-plan.server.ts";
import { rlsMigrationRecommendation, rlsPolicyDrafts } from "./db/rls-policy-draft.server.ts";
import {
  i18nTranslationTables,
  schemaDraftBatches,
  schemaDraftTables,
} from "./db/schema-draft.server.ts";
import {
  permissionSeedPlan,
  rolePermissionSeedPlan,
  seedSafetyPlan,
} from "./db/seed-plan.server.ts";
import {
  repositoryContractInvariants,
  storageRepositoryContract,
} from "./db/repository-contract.server.ts";
import * as dbSchema from "./db/schema.ts";
import {
  getCurrentUser,
  hasPermission,
  requirePermission,
  requireRole,
  type AuthUser,
} from "./platform-auth.server.ts";
import {
  buildAuthUserFromClaims,
  mapBusinessUserToAuthUser,
} from "./auth/supabase-auth-boundary.server.ts";
import {
  getLocaleFallbacks,
  pickTranslation,
  resolveLocale,
} from "./platform-localization.server.ts";
import {
  apiRoadmap,
  databaseTableDrafts,
  defaultLocale,
  entityCoverageMatrix,
  localizationDraft,
  rolePermissionDraft,
  supportedLocales,
} from "./platform-system-model.server.ts";
import {
  mvpDatabaseTables,
  pendingProductDecisions,
  platformSystemPlan,
  recommendedBackendRoute,
  repositoryMigrationPath,
  secondWaveDatabaseTables,
} from "./platform-system-plan.server.ts";
import {
  createContestRegistration,
  createCourseEnrollment,
  getCourseDetail,
  searchPlatform,
  verifyCertificate,
  type ServiceResult,
} from "./platform-service.server.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function assertSuccess<T>(
  result: ServiceResult<T>,
  message: string,
): asserts result is Extract<ServiceResult<T>, { success: true }> {
  assert(result.success, `${message}: ${result.message}`);
}

function assertFailure<T>(
  result: ServiceResult<T>,
  code: string,
  message: string,
): asserts result is Extract<ServiceResult<T>, { success: false }> {
  assert(!result.success, `${message}: expected failure`);
  assert(
    result.errors.some((error) => error.code === code),
    `${message}: expected ${code}`,
  );
}

function readMigration(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

function assertSqlMatches(sql: string, pattern: RegExp, message: string) {
  assert(pattern.test(sql), message);
}

const rlsMigrationSql = readMigration("../../../supabase/migrations/0001_rls_policies.sql");
const seedMigrationSql = readMigration(
  "../../../supabase/migrations/0002_seed_roles_permissions.sql",
);

const repository = createMockPlatformRepository();
const options = { repository };

const searchResult = searchPlatform({ keyword: "Amazon", entity: "course" }, options);
assertSuccess(searchResult, "search should succeed");
assert(searchResult.data.total >= 1, "search should find Amazon course");

const missingCourse = getCourseDetail("course-not-exists", options);
assertFailure(missingCourse, "COURSE_NOT_FOUND", "missing course should fail");

const invalidPhone = createCourseEnrollment(
  {
    courseId: "course-tiktok-shop-001",
    learnerName: "测试学员",
    phone: "12345",
  },
  options,
);
assertFailure(invalidPhone, "INVALID_PHONE", "invalid phone should fail");

const closedContest = createContestRegistration(
  {
    contestId: "contest-closed-demo-2025",
    teamName: "测试团队",
    leaderName: "测试队长",
    phone: "13800138000",
    school: "武汉测试大学",
    memberCount: 3,
    projectTitle: "测试项目",
  },
  options,
);
assertFailure(closedContest, "CONTEST_CLOSED", "closed contest should fail");

const validCertificate = verifyCertificate(
  { certificateCode: "CBEC-101-2026-0001", holderName: "测试学员" },
  options,
);
assertSuccess(validCertificate, "valid certificate verification should succeed");
assert(validCertificate.data.valid, "known certificate prefix should be valid");

const invalidCertificate = verifyCertificate(
  { certificateCode: "UNKNOWN-2026-0001", holderName: "测试学员" },
  options,
);
assertSuccess(invalidCertificate, "invalid certificate verification should still return result");
assert(!invalidCertificate.data.valid, "unknown certificate prefix should be invalid");

const firstEnrollment = createCourseEnrollment(
  {
    courseId: "course-tiktok-shop-001",
    learnerName: "重复测试",
    phone: "13900139000",
    idempotencyKey: "verify-course-enrollment-001",
  },
  options,
);
assertSuccess(firstEnrollment, "first enrollment should succeed");
assert(!firstEnrollment.data.duplicate, "first enrollment should not be duplicate");

const duplicateEnrollment = createCourseEnrollment(
  {
    courseId: "course-tiktok-shop-001",
    learnerName: "重复测试",
    phone: "13900139000",
    idempotencyKey: "verify-course-enrollment-001",
  },
  options,
);
assertSuccess(duplicateEnrollment, "duplicate enrollment should be idempotent success");
assert(duplicateEnrollment.data.duplicate, "duplicate enrollment should be marked duplicate");
assert(
  duplicateEnrollment.data.record.id === firstEnrollment.data.record.id,
  "duplicate enrollment should return original record",
);

assert(defaultLocale === "zh-CN", "default locale should be zh-CN");
assert(supportedLocales.includes("en-US"), "en-US should be reserved as second locale");
assert(
  localizationDraft.fallbackOrder.includes(defaultLocale),
  "locale fallback should include default locale",
);
assert(rolePermissionDraft.guest.permissions.includes("content:browse"), "guest can browse");
assert(
  rolePermissionDraft.guest.permissions.includes("certificate:verify"),
  "guest can verify certificate numbers",
);
assert(rolePermissionDraft.student.permissions.includes("course:enroll"), "student can enroll");
assert(
  rolePermissionDraft.student.permissions.includes("exam:register"),
  "student can register exams",
);
assert(
  rolePermissionDraft.student.permissions.includes("contest:register"),
  "student can register contests",
);
assert(
  rolePermissionDraft.student.permissions.includes("certificate:view"),
  "student can view certificates",
);
assert(
  rolePermissionDraft.student.permissions.includes("certificate:verify"),
  "student can verify certificates",
);
assert(
  rolePermissionDraft.enterprise.permissions.includes("job:publish"),
  "enterprise can publish jobs",
);
assert(
  rolePermissionDraft.teacher.permissions.includes("course:manage"),
  "teacher can manage courses",
);
assert(
  rolePermissionDraft.admin.permissions.includes("certificate:manage"),
  "admin can manage certificates",
);
assert(
  rolePermissionDraft.admin.permissions.includes("certificate:verify"),
  "admin can verify certificates",
);
assert(rolePermissionDraft.admin.permissions.includes("user:review"), "admin can review users");
assert(
  rolePermissionDraft.admin.permissions.includes("contest:register"),
  "admin can register contests",
);
assert(
  entityCoverageMatrix.some((item) => item.entity.includes("User") && item.status === "missing"),
  "coverage matrix should expose user model gap",
);
assert(
  databaseTableDrafts.some((table) => table.name.includes("course_translations")),
  "database draft should include course translations",
);
assert(
  apiRoadmap.some(
    (api) => api.name === "auth.login / auth.logout / auth.me" && api.status === "new",
  ),
  "api roadmap should include auth endpoints",
);

const guestUser: AuthUser = { id: "user-guest-001", role: "guest" };
const studentUser: AuthUser = { id: "user-student-001", role: "student" };
const enterpriseUser: AuthUser = { id: "user-enterprise-001", role: "enterprise" };
const adminUser: AuthUser = { id: "user-admin-001", role: "admin" };

assert(getCurrentUser({ user: studentUser })?.id === studentUser.id, "current user boundary works");
assert(hasPermission(guestUser, "certificate:verify"), "guest role can verify certificates");
assert(!hasPermission(guestUser, "certificate:view"), "guest role cannot view certificate details");
assert(hasPermission(studentUser, "exam:register"), "student has exam registration permission");
assert(
  hasPermission(studentUser, "contest:register"),
  "student has contest registration permission",
);
assert(hasPermission(studentUser, "certificate:view"), "student has certificate view permission");
assert(
  hasPermission(studentUser, "certificate:verify"),
  "student has certificate verify permission",
);
assert(!hasPermission(null, "contest:register"), "guest without user cannot submit");
assert(!hasPermission(null, "exam:register"), "guest cannot register exams");
assert(!hasPermission(null, "certificate:verify"), "null user cannot verify by permission helper");
assert(!hasPermission(null, "certificate:view"), "guest cannot view certificates");
assert(!hasPermission(null, "user:review"), "guest cannot review users");
assert(hasPermission(enterpriseUser, "job:publish"), "enterprise can publish jobs via auth helper");
assert(hasPermission(enterpriseUser, "certificate:view"), "enterprise can view certificates");
assert(hasPermission(enterpriseUser, "certificate:verify"), "enterprise can verify certificates");
assert(
  hasPermission(adminUser, "certificate:manage"),
  "admin can manage certificates via auth helper",
);
assert(hasPermission(adminUser, "certificate:view"), "admin can view certificates via auth helper");
assert(
  hasPermission(adminUser, "certificate:verify"),
  "admin can verify certificates via auth helper",
);
assert(hasPermission(adminUser, "user:review"), "admin can review users via auth helper");
assert(requireRole(studentUser, ["student"]).success, "requireRole accepts allowed student");
assert(!requireRole(studentUser, ["admin"]).success, "requireRole rejects wrong role");
assert(
  requirePermission(studentUser, "contest:register").success,
  "requirePermission accepts contest register",
);
assert(
  !requirePermission(studentUser, "job:publish").success,
  "requirePermission rejects unavailable permission",
);

assert(resolveLocale("en-US") === "en-US", "supported locale resolves to itself");
assert(resolveLocale("ru-RU") === defaultLocale, "unsupported locale resolves to default");
assert(
  getLocaleFallbacks("en-US", ["zh-CN", "ar-SA"]).join(">") === "en-US>zh-CN>ar-SA",
  "locale fallbacks use requested, default, first available order",
);

const pickedEn = pickTranslation(
  [
    { locale: "zh-CN", title: "中文标题" },
    { locale: "en-US", title: "English title" },
  ],
  "en-US",
);
assert(pickedEn?.translation.title === "English title", "pickTranslation prefers requested locale");

const pickedFallback = pickTranslation([{ locale: "zh-CN", title: "中文标题" }], "en-US");
assert(pickedFallback?.resolvedLocale === "zh-CN", "pickTranslation falls back to default locale");

const pickedFirstAvailable = pickTranslation([{ locale: "ar-SA", title: "Arabic title" }], "en-US");
assert(
  pickedFirstAvailable?.resolvedLocale === "ar-SA",
  "pickTranslation falls back to first available translation",
);

assert(recommendedBackendRoute.primary.includes("Supabase"), "plan includes Supabase route");
assert(recommendedBackendRoute.alternative.includes("Neon"), "plan includes Neon route");
assert(mvpDatabaseTables.includes("users"), "MVP tables include users");
assert(mvpDatabaseTables.includes("course_translations"), "MVP tables include course translations");
assert(
  secondWaveDatabaseTables.includes("learning_progress"),
  "second wave includes learning progress",
);
assert(
  repositoryMigrationPath.some((step) => step.includes("Result shape")),
  "repository migration keeps Result shape stable",
);
assert(
  pendingProductDecisions.some((decision) => decision.key === "authProvider"),
  "plan calls out auth provider decision",
);
assert(
  platformSystemPlan.existingModelDrafts.apiRoadmap === apiRoadmap,
  "system plan references existing API roadmap",
);

assert(
  supabaseDrizzleDependencyPlan.some(
    (dependency) => dependency.name === "drizzle-orm" && dependency.kind === "runtime",
  ),
  "dependency plan should include drizzle-orm runtime dependency",
);
assert(
  supabaseDrizzleDependencyPlan.some(
    (dependency) => dependency.name === "drizzle-kit" && dependency.kind === "dev",
  ),
  "dependency plan should include drizzle-kit dev dependency",
);
assert(
  supabaseEnvironmentPlan.some(
    (env) => env.name === "DATABASE_URL" && env.mustStaySecret && env.safety === "server-secret",
  ),
  "DATABASE_URL should be server-secret only",
);
assert(
  supabaseEnvironmentPlan.some(
    (env) =>
      env.name === "SUPABASE_SERVICE_ROLE_KEY" &&
      env.mustStaySecret &&
      env.safety === "server-secret",
  ),
  "service role key should be server-secret only",
);
assert(
  forbiddenSecretPractices.every((practice) => !practice.includes("actual-secret-value")),
  "secret practices should not contain real secrets",
);
assert(schemaDraftBatches["auth-rbac"].includes("users"), "auth batch should include users");
assert(
  schemaDraftBatches["content-i18n"].includes("course_translations"),
  "content batch should include course translations",
);
assert(
  schemaDraftBatches["submissions-certificates"].includes("certificate_verification_logs"),
  "submission batch should include certificate verification logs",
);
assert(i18nTranslationTables.includes("job_translations"), "i18n tables should include jobs");
assert(
  schemaDraftTables.some((table) => table.name === "role_permissions" && table.unique?.length),
  "role permissions should declare unique constraints",
);
assert(
  repositoryContractInvariants.some((item) => item.includes("Result envelope")),
  "repository contract should preserve Result envelope",
);
assert(
  repositoryContractInvariants.some((item) => item.includes("currentUser")),
  "repository contract should require currentUser for writes",
);
assert(
  storageRepositoryContract.methods.includes("createUploadUrl"),
  "storage contract should include upload URL boundary",
);
assert("users" in dbSchema, "Drizzle schema should include users table");
assert("courseTranslations" in dbSchema, "Drizzle schema should include course translations table");
assert("jobApplications" in dbSchema, "Drizzle schema should include job applications table");
assert(
  "certificateVerificationLogs" in dbSchema,
  "Drizzle schema should include certificate verification logs table",
);
const mappedAuthUser = mapBusinessUserToAuthUser({
  id: "business-user-001",
  preferredLocale: "zh-CN",
  roles: [{ role: "student" }],
});
assert(mappedAuthUser.role === "student", "Supabase boundary maps business role");
assert(
  mappedAuthUser.permissions?.includes("certificate:verify"),
  "Supabase boundary expands role permissions",
);
assert(
  buildAuthUserFromClaims({ claims: null, businessUser: null }).status === "anonymous",
  "Supabase boundary handles missing session",
);
assert(
  buildAuthUserFromClaims({
    claims: { sub: "business-user-001" },
    businessUser: null,
  }).status === "anonymous",
  "Supabase boundary handles missing business user",
);
const subjectMismatch = buildAuthUserFromClaims({
  claims: { sub: "auth-user-001" },
  businessUser: { id: "business-user-001", roles: [{ role: "student" }] },
});
assert(
  subjectMismatch.status === "anonymous" && subjectMismatch.reason === "SUBJECT_MISMATCH",
  "Supabase boundary rejects subject mismatch",
);
const noRoleUser = buildAuthUserFromClaims({
  claims: { sub: "business-user-001" },
  businessUser: { id: "business-user-001", roles: [] },
});
assert(
  noRoleUser.status === "anonymous" && noRoleUser.reason === "NO_ROLE",
  "Supabase boundary rejects business users without roles",
);
assert(
  buildAuthUserFromClaims({
    claims: { sub: "business-user-001" },
    businessUser: { id: "business-user-001", roles: [{ role: "admin" }] },
  }).status === "authenticated",
  "Supabase boundary maps authenticated users",
);
assert(
  buildAuthUserFromClaims({
    claims: { sub: "business-user-002" },
    businessUser: { id: "business-user-002", roles: [{ role: "student" }] },
  }).status === "authenticated",
  "Supabase boundary maps authenticated student users",
);
let noRoleMapThrew = false;
try {
  mapBusinessUserToAuthUser({ id: "business-user-no-role", roles: [] });
} catch {
  noRoleMapThrew = true;
}
assert(noRoleMapThrew, "mapBusinessUserToAuthUser should reject missing roles");

assert(
  rlsPolicyDrafts.some(
    (policy) => policy.key === "public-content-read" && policy.actors.includes("anon"),
  ),
  "RLS draft covers anon public content read",
);
assert(
  rlsPolicyDrafts.some(
    (policy) => policy.key === "own-profile-data" && policy.tables.includes("users"),
  ),
  "RLS draft covers own profile data",
);
assert(
  rlsPolicyDrafts.some((policy) => policy.key === "owner-submission-processing"),
  "RLS draft covers owner submission processing",
);
assert(
  rlsPolicyDrafts.some((policy) => policy.key === "admin-full-control"),
  "RLS draft covers admin control",
);
assert(
  rlsPolicyDrafts.some(
    (policy) =>
      policy.key === "certificate-verify-view" &&
      policy.read.includes("certificate:verify") &&
      policy.read.includes("certificate:view"),
  ),
  "RLS draft covers certificate verify/view split",
);
assert(
  rlsPolicyDrafts.some(
    (policy) => policy.key === "service-role-restricted" && policy.actors.includes("service_role"),
  ),
  "RLS draft documents service role boundary",
);
assert(
  !rlsMigrationRecommendation.shouldGenerateMigrationNow,
  "RLS migration should not be generated this round",
);

assert(
  dbReadRepositoryPlan.getOverview.resultEnvelope === "ServiceResult",
  "DB read plan preserves Result envelope",
);
assert(
  dbReadRepositoryPlan.searchPlatform.filters?.includes("keyword"),
  "DB read search plan includes keyword filter",
);
assert(
  dbReadLocaleFallbackPlan.order.join(">") === "requested locale>zh-CN>first available translation",
  "DB read plan keeps locale fallback order",
);
assert(!dbWriteCutoverPlan.cutWritesThisRound, "DB write cutover is disabled this round");
assert(
  dbWriteCutoverPlan.remainsMocked.includes("createJobApplication"),
  "write APIs remain on mock repository",
);

const seededPermissionSet = new Set(permissionSeedPlan);
for (const roleSeed of rolePermissionSeedPlan) {
  for (const permission of rolePermissionDraft[roleSeed.key].permissions) {
    assert(
      roleSeed.permissions.includes(permission),
      `seed plan should include ${roleSeed.key}:${permission}`,
    );
    assert(seededPermissionSet.has(permission), `permission seed should include ${permission}`);
  }
}
assert(!seedSafetyPlan.containsRealUsers, "seed plan should not contain real users");
assert(!seedSafetyPlan.containsPersonalData, "seed plan should not contain personal data");
assert(seedSafetyPlan.strategy.includes("upsert"), "seed plan should use idempotent upsert");

const rlsProtectedTables = [
  "audit_logs",
  "certificate_verification_logs",
  "certificates",
  "certification_translations",
  "certifications",
  "contest_registrations",
  "contest_translations",
  "contests",
  "course_translations",
  "courses",
  "enrollments",
  "enterprise_profiles",
  "exam_sessions",
  "job_applications",
  "job_translations",
  "jobs",
  "news",
  "news_translations",
  "permissions",
  "role_permissions",
  "roles",
  "student_profiles",
  "teacher_profiles",
  "user_roles",
  "users",
];
assert(rlsMigrationSql.length > 0, "0001 RLS migration should exist");
assert(seedMigrationSql.length > 0, "0002 RBAC seed migration should exist");
assert(rlsProtectedTables.length === 25, "RLS static check should cover 25 public tables");
for (const table of rlsProtectedTables) {
  assert(
    rlsMigrationSql.includes(`alter table public.${table} enable row level security;`),
    `RLS migration should enable row level security for ${table}`,
  );
}

for (const helper of [
  "public.current_user_role_keys()",
  "public.has_permission(required_permission text)",
  "public.is_admin()",
]) {
  assert(
    rlsMigrationSql.includes(`create or replace function ${helper}`),
    `RLS migration should create ${helper}`,
  );
}
assert(
  (rlsMigrationSql.match(/set search_path = public/g) ?? []).length >= 4,
  "security definer helpers should fix search_path to public",
);
assert(
  rlsMigrationSql.includes("create or replace function public.verify_certificate_public"),
  "RLS migration should include limited certificate verification function",
);
assert(
  rlsMigrationSql.includes(
    "revoke all on function public.verify_certificate_public(text) from public;",
  ),
  "certificate verification function should be revoked from public by default",
);
assert(
  !/grant execute on function public\.verify_certificate_public\(text\) to anon/i.test(
    rlsMigrationSql,
  ),
  "certificate verification function should not be directly granted to anon",
);
assert(
  !/create policy "[^"]+"\s+on public\.certificates\s+for select\s+to anon/i.test(rlsMigrationSql),
  "anon should not get direct certificates select policy",
);
assertSqlMatches(
  rlsMigrationSql,
  /create policy "certificates_select_holder"[\s\S]+certificate:view/i,
  "certificate detail policy should use certificate:view",
);
assertSqlMatches(
  rlsMigrationSql,
  /create policy "certificate_verification_logs_insert_authenticated"[\s\S]+certificate:verify/i,
  "verification log insert should use certificate:verify",
);

for (const table of ["courses", "jobs", "certifications", "contests", "news"]) {
  assertSqlMatches(
    rlsMigrationSql,
    new RegExp(`create policy "${table}_select_published"[\\s\\S]+to anon, authenticated`, "i"),
    `${table} should have published public read policy`,
  );
}
for (const table of ["enrollments", "job_applications", "contest_registrations"]) {
  assertSqlMatches(
    rlsMigrationSql,
    new RegExp(
      `create policy "${table}_insert_own"[\\s\\S]+on public\\.${table}[\\s\\S]+with check \\([\\s\\S]*user_id = auth\\.uid\\(\\)`,
      "i",
    ),
    `${table} insert should require user_id = auth.uid()`,
  );
}
assert(
  rlsMigrationSql.includes('create policy "contest_registrations_admin_all"'),
  "contest registrations should stay admin-processed until contests gain owner field",
);
assert(
  rlsMigrationSql.includes("The Supabase service_role bypasses RLS"),
  "RLS migration should document service_role boundary",
);

const forbiddenSqlNeedles = [
  "SUPABASE_SERVICE_ROLE_KEY",
  "DATABASE_URL=",
  "postgresql://",
  "postgres://",
  "sbp_",
  "sb_secret_",
];
for (const sql of [rlsMigrationSql, seedMigrationSql]) {
  for (const forbidden of forbiddenSqlNeedles) {
    assert(!sql.includes(forbidden), `SQL migration should not contain ${forbidden}`);
  }
}

const seededPermissions = new Set(
  Object.values(rolePermissionDraft).flatMap((role) => role.permissions),
);
for (const permission of seededPermissions) {
  assert(
    seedMigrationSql.includes(`('${permission}',`),
    `permission seed should include ${permission}`,
  );
}
for (const [roleKey, roleDraft] of Object.entries(rolePermissionDraft)) {
  for (const permission of roleDraft.permissions) {
    assert(
      seedMigrationSql.includes(`('${roleKey}', '${permission}')`),
      `role permission seed should include ${roleKey}:${permission}`,
    );
  }
}
assert(
  seedMigrationSql.includes("delete from public.role_permissions"),
  "role permission seed should prune stale managed role links",
);
assert(
  !/\binsert into public\.users\b/i.test(seedMigrationSql),
  "RBAC seed should not insert real users",
);
assert(
  !/\binsert into public\.user_roles\b/i.test(seedMigrationSql),
  "RBAC seed should not assign real user roles",
);

console.log("platform service verification passed");
