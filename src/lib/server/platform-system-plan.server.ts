import {
  apiRoadmap,
  databaseTableDrafts,
  localizationDraft,
  rolePermissionDraft,
} from "./platform-system-model.server.ts";

export const recommendedBackendRoute = {
  primary: "Supabase Postgres + Drizzle",
  alternative: "Neon Postgres + Drizzle",
  rationale: [
    "Postgres 能覆盖用户、权限、内容、多语种、提交、证书和审计等关系型核心数据。",
    "Drizzle 足够轻量，迁移和类型边界清晰，适合从当前 mock repository 逐步替换。",
    "Supabase 适合需要快速获得 Auth、Storage、管理界面的路线；Neon 更适合纯数据库托管和自选 Auth。",
    "Prisma 建模体验强但链路更重，建议等数据库和部署形态稳定后再评估。",
  ],
  blockedUntilDecisions: ["databaseProvider", "authProvider", "fileStorageProvider"],
} as const;

export const mvpDatabaseTables = [
  "users",
  "student_profiles",
  "enterprise_profiles",
  "teacher_profiles",
  "roles",
  "permissions",
  "role_permissions",
  "courses",
  "course_translations",
  "jobs",
  "job_translations",
  "certifications",
  "certification_translations",
  "exam_sessions",
  "contests",
  "contest_translations",
  "news",
  "news_translations",
  "enrollments",
  "job_applications",
  "contest_registrations",
  "certificates",
  "certificate_verification_logs",
  "audit_logs",
] as const;

export const secondWaveDatabaseTables = [
  "course_lessons",
  "learning_progress",
  "orders",
  "payments",
  "exam_questions",
  "exam_results",
  "contest_members",
  "contest_materials",
  "judging_scores",
  "notification_logs",
  "admin_review_tasks",
] as const;

export const authRbacImplementationSteps = [
  "Keep public read APIs available to guest users.",
  "Introduce getCurrentUser, requireRole, hasPermission, and requirePermission as the service-layer gate.",
  "Resolve user_id from session/current user for submission APIs instead of trusting form identity fields.",
  "Attach enterprise_id or teacher_profile_id to resource owners for scoped submission processing.",
  "Persist role and permission grants before enabling admin, enterprise, and teacher workspaces.",
] as const;

export const repositoryMigrationPath = [
  "Keep Result shape and Server Function names stable while replacing the repository implementation.",
  "Add DB repository methods behind PlatformRepository-compatible interfaces.",
  "Move idempotency from in-memory phone/target checks to database unique constraints.",
  "Add locale, pagination, filters, and currentUser parameters to read/query service inputs in a backward-compatible way.",
  "Use transactions for submission writes, certificate issuance, audit logs, and review state transitions.",
] as const;

export const apiAdjustmentPlan = [
  {
    target: "read APIs",
    changes: ["locale?: LocaleCode", "pagination", "filters", "sort", "resolvedLocale metadata"],
  },
  {
    target: "submission APIs",
    changes: [
      "currentUser from auth context",
      "idempotencyKey required for clients that can provide it",
    ],
  },
  {
    target: "management APIs",
    changes: ["requirePermission checks", "resource ownership checks", "audit log writes"],
  },
] as const;

export const pendingProductDecisions = [
  {
    key: "databaseProvider",
    options: ["Supabase Postgres", "Neon Postgres", "self-hosted Postgres"],
    neededFor: "creating migrations, connection configuration, and DB repository implementation",
  },
  {
    key: "authProvider",
    options: ["Supabase Auth", "custom phone login", "third-party OAuth"],
    neededFor: "session parsing, getCurrentUser implementation, RBAC persistence",
  },
  {
    key: "fileStorageProvider",
    options: ["Supabase Storage", "S3/R2 compatible storage"],
    neededFor: "resumes, contest materials, course resources, certificates",
  },
] as const;

export const platformSystemPlan = {
  recommendedBackendRoute,
  mvpDatabaseTables,
  secondWaveDatabaseTables,
  authRbacImplementationSteps,
  repositoryMigrationPath,
  apiAdjustmentPlan,
  pendingProductDecisions,
  existingModelDrafts: {
    rolePermissionDraft,
    localizationDraft,
    databaseTableDrafts,
    apiRoadmap,
  },
} as const;
