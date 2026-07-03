import { createMockPlatformRepository } from "./platform-data.server.ts";
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
assert(rolePermissionDraft.student.permissions.includes("course:enroll"), "student can enroll");
assert(
  rolePermissionDraft.student.permissions.includes("contest:register"),
  "student can register contests",
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

console.log("platform service verification passed");
