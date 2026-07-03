import { createMockPlatformRepository } from "./platform-data.server.ts";
import {
  forbiddenSecretPractices,
  supabaseDrizzleDependencyPlan,
  supabaseEnvironmentPlan,
} from "./db/supabase-drizzle-plan.server.ts";
import {
  i18nTranslationTables,
  schemaDraftBatches,
  schemaDraftTables,
} from "./db/schema-draft.server.ts";
import {
  repositoryContractInvariants,
  storageRepositoryContract,
} from "./db/repository-contract.server.ts";
import {
  getCurrentUser,
  hasPermission,
  requirePermission,
  requireRole,
  type AuthUser,
} from "./platform-auth.server.ts";
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

console.log("platform service verification passed");
