export type MigrationBatch = "auth-rbac" | "content-i18n" | "submissions-certificates";

export type FieldDraft = {
  name: string;
  type: string;
  nullable?: boolean;
  references?: string;
  notes?: string;
};

export type TableSchemaDraft = {
  name: string;
  batch: MigrationBatch;
  purpose: string;
  fields: FieldDraft[];
  indexes?: string[];
  unique?: string[];
  rlsNotes?: string;
  i18n?: "base" | "translation";
};

const timestamps: FieldDraft[] = [
  { name: "created_at", type: "timestamptz", notes: "default now()" },
  { name: "updated_at", type: "timestamptz", notes: "default now(), update on mutation" },
];

export const schemaDraftTables: TableSchemaDraft[] = [
  {
    name: "users",
    batch: "auth-rbac",
    purpose: "Business user mapped to Supabase Auth user.",
    fields: [
      { name: "id", type: "uuid", notes: "Prefer same value as auth.users.id" },
      { name: "phone", type: "text", nullable: true },
      { name: "email", type: "text", nullable: true },
      { name: "status", type: "text", notes: "active | disabled | pending_review" },
      { name: "preferred_locale", type: "text", notes: "default zh-CN" },
      ...timestamps,
    ],
    unique: ["phone", "email"],
    rlsNotes: "Users may read their own row; admins may review and manage.",
  },
  {
    name: "roles",
    batch: "auth-rbac",
    purpose: "Role dictionary matching UserRole.",
    fields: [{ name: "key", type: "text" }, { name: "label", type: "text" }, ...timestamps],
    unique: ["key"],
    rlsNotes: "Readable by authenticated users; writable only by admins.",
  },
  {
    name: "permissions",
    batch: "auth-rbac",
    purpose: "Permission dictionary matching PermissionKey.",
    fields: [{ name: "key", type: "text" }, { name: "description", type: "text" }, ...timestamps],
    unique: ["key"],
    rlsNotes: "Readable by authenticated users; writable only by admins.",
  },
  {
    name: "role_permissions",
    batch: "auth-rbac",
    purpose: "Permission grants by role.",
    fields: [
      { name: "role_key", type: "text", references: "roles.key" },
      { name: "permission_key", type: "text", references: "permissions.key" },
    ],
    unique: ["role_key, permission_key"],
    rlsNotes: "Writable only by admins or migrations.",
  },
  {
    name: "user_roles",
    batch: "auth-rbac",
    purpose: "Allow multiple roles or temporary role grants per user.",
    fields: [
      { name: "user_id", type: "uuid", references: "users.id" },
      { name: "role_key", type: "text", references: "roles.key" },
      { name: "expires_at", type: "timestamptz", nullable: true },
      ...timestamps,
    ],
    unique: ["user_id, role_key"],
    rlsNotes: "Users can read their own roles; admins manage all grants.",
  },
  {
    name: "student_profiles",
    batch: "auth-rbac",
    purpose: "Student profile information.",
    fields: [
      { name: "user_id", type: "uuid", references: "users.id" },
      { name: "real_name", type: "text" },
      { name: "school", type: "text", nullable: true },
      { name: "major", type: "text", nullable: true },
      ...timestamps,
    ],
    unique: ["user_id"],
    rlsNotes: "Student owner and admins can read; owner can update limited fields.",
  },
  {
    name: "enterprise_profiles",
    batch: "auth-rbac",
    purpose: "Enterprise identity and verification state.",
    fields: [
      { name: "user_id", type: "uuid", references: "users.id" },
      { name: "company_name", type: "text" },
      { name: "license_no", type: "text", nullable: true },
      { name: "verified_status", type: "text", notes: "pending | approved | rejected" },
      ...timestamps,
    ],
    unique: ["user_id", "license_no"],
    rlsNotes: "Enterprise owner and admins can read; user:review controls verification.",
  },
  {
    name: "teacher_profiles",
    batch: "auth-rbac",
    purpose: "Teacher or institution identity.",
    fields: [
      { name: "user_id", type: "uuid", references: "users.id" },
      { name: "display_name", type: "text" },
      { name: "organization", type: "text", nullable: true },
      { name: "verified_status", type: "text", notes: "pending | approved | rejected" },
      ...timestamps,
    ],
    unique: ["user_id"],
    rlsNotes: "Teacher owner and admins can read; user:review controls verification.",
  },
  {
    name: "courses",
    batch: "content-i18n",
    purpose: "Course base data.",
    fields: [
      { name: "id", type: "uuid" },
      { name: "owner_user_id", type: "uuid", references: "users.id" },
      { name: "status", type: "text", notes: "draft | reviewing | published | archived" },
      { name: "price", type: "integer" },
      { name: "format", type: "text" },
      ...timestamps,
    ],
    indexes: ["owner_user_id", "status"],
    rlsNotes: "Published courses are public; owners/admins can access drafts.",
    i18n: "base",
  },
  {
    name: "course_translations",
    batch: "content-i18n",
    purpose: "Course language fields.",
    fields: [
      { name: "course_id", type: "uuid", references: "courses.id" },
      { name: "locale", type: "text" },
      { name: "title", type: "text" },
      { name: "summary", type: "text" },
      { name: "description", type: "text", nullable: true },
      { name: "outcomes", type: "jsonb", nullable: true },
    ],
    unique: ["course_id, locale"],
    i18n: "translation",
  },
  {
    name: "jobs",
    batch: "content-i18n",
    purpose: "Job/internship base data.",
    fields: [
      { name: "id", type: "uuid" },
      { name: "enterprise_user_id", type: "uuid", references: "users.id" },
      { name: "status", type: "text" },
      { name: "city", type: "text" },
      { name: "salary", type: "text" },
      { name: "deadline", type: "date" },
      ...timestamps,
    ],
    indexes: ["enterprise_user_id", "status", "city"],
    i18n: "base",
  },
  {
    name: "job_translations",
    batch: "content-i18n",
    purpose: "Job language fields.",
    fields: [
      { name: "job_id", type: "uuid", references: "jobs.id" },
      { name: "locale", type: "text" },
      { name: "title", type: "text" },
      { name: "description", type: "text", nullable: true },
      { name: "requirements", type: "jsonb", nullable: true },
    ],
    unique: ["job_id, locale"],
    i18n: "translation",
  },
  {
    name: "certifications",
    batch: "content-i18n",
    purpose: "Certification base data.",
    fields: [
      { name: "id", type: "uuid" },
      { name: "code", type: "text" },
      { name: "status", type: "text" },
      { name: "fee", type: "integer" },
      ...timestamps,
    ],
    unique: ["code"],
    i18n: "base",
  },
  {
    name: "certification_translations",
    batch: "content-i18n",
    purpose: "Certification language fields.",
    fields: [
      { name: "certification_id", type: "uuid", references: "certifications.id" },
      { name: "locale", type: "text" },
      { name: "name", type: "text" },
      { name: "description", type: "text", nullable: true },
      { name: "modules", type: "jsonb", nullable: true },
    ],
    unique: ["certification_id, locale"],
    i18n: "translation",
  },
  {
    name: "exam_sessions",
    batch: "content-i18n",
    purpose: "Certification exam sessions.",
    fields: [
      { name: "id", type: "uuid" },
      { name: "certification_id", type: "uuid", references: "certifications.id" },
      { name: "starts_at", type: "timestamptz" },
      { name: "capacity", type: "integer", nullable: true },
      { name: "status", type: "text" },
      ...timestamps,
    ],
    indexes: ["certification_id", "starts_at"],
  },
  {
    name: "contests",
    batch: "content-i18n",
    purpose: "Contest base data.",
    fields: [
      { name: "id", type: "uuid" },
      { name: "status", type: "text" },
      { name: "signup_deadline", type: "date" },
      { name: "prize_pool", type: "integer" },
      ...timestamps,
    ],
    i18n: "base",
  },
  {
    name: "contest_translations",
    batch: "content-i18n",
    purpose: "Contest language fields.",
    fields: [
      { name: "contest_id", type: "uuid", references: "contests.id" },
      { name: "locale", type: "text" },
      { name: "title", type: "text" },
      { name: "description", type: "text", nullable: true },
      { name: "tracks", type: "jsonb", nullable: true },
    ],
    unique: ["contest_id, locale"],
    i18n: "translation",
  },
  {
    name: "news",
    batch: "content-i18n",
    purpose: "News base data.",
    fields: [
      { name: "id", type: "uuid" },
      { name: "author_user_id", type: "uuid", references: "users.id" },
      { name: "status", type: "text" },
      { name: "published_at", type: "timestamptz", nullable: true },
      ...timestamps,
    ],
    i18n: "base",
  },
  {
    name: "news_translations",
    batch: "content-i18n",
    purpose: "News language fields.",
    fields: [
      { name: "news_id", type: "uuid", references: "news.id" },
      { name: "locale", type: "text" },
      { name: "title", type: "text" },
      { name: "summary", type: "text" },
      { name: "body", type: "text", nullable: true },
    ],
    unique: ["news_id, locale"],
    i18n: "translation",
  },
  {
    name: "enrollments",
    batch: "submissions-certificates",
    purpose: "Course enrollment records.",
    fields: [
      { name: "id", type: "uuid" },
      { name: "user_id", type: "uuid", references: "users.id" },
      { name: "course_id", type: "uuid", references: "courses.id" },
      { name: "status", type: "text" },
      { name: "idempotency_key", type: "text", nullable: true },
      ...timestamps,
    ],
    unique: ["user_id, course_id", "idempotency_key"],
    rlsNotes: "Students see own enrollments; course owners/admins process.",
  },
  {
    name: "job_applications",
    batch: "submissions-certificates",
    purpose: "Job application records.",
    fields: [
      { name: "id", type: "uuid" },
      { name: "user_id", type: "uuid", references: "users.id" },
      { name: "job_id", type: "uuid", references: "jobs.id" },
      { name: "portfolio_url", type: "text", nullable: true },
      { name: "status", type: "text" },
      { name: "idempotency_key", type: "text", nullable: true },
      ...timestamps,
    ],
    unique: ["user_id, job_id", "idempotency_key"],
    rlsNotes: "Applicants see own applications; enterprise owner/admins process.",
  },
  {
    name: "contest_registrations",
    batch: "submissions-certificates",
    purpose: "Contest registration records.",
    fields: [
      { name: "id", type: "uuid" },
      { name: "user_id", type: "uuid", references: "users.id" },
      { name: "contest_id", type: "uuid", references: "contests.id" },
      { name: "team_name", type: "text" },
      { name: "project_title", type: "text" },
      { name: "status", type: "text" },
      { name: "idempotency_key", type: "text", nullable: true },
      ...timestamps,
    ],
    unique: ["user_id, contest_id", "idempotency_key"],
  },
  {
    name: "certificates",
    batch: "submissions-certificates",
    purpose: "Issued certificates.",
    fields: [
      { name: "id", type: "uuid" },
      { name: "certificate_no", type: "text" },
      { name: "holder_user_id", type: "uuid", references: "users.id" },
      { name: "certification_id", type: "uuid", references: "certifications.id" },
      { name: "status", type: "text" },
      { name: "issued_at", type: "timestamptz" },
      ...timestamps,
    ],
    unique: ["certificate_no"],
    rlsNotes: "Public verify can read limited status; certificate:view controls detail access.",
  },
  {
    name: "certificate_verification_logs",
    batch: "submissions-certificates",
    purpose: "Public and authenticated certificate verification logs.",
    fields: [
      { name: "id", type: "uuid" },
      { name: "certificate_no", type: "text" },
      { name: "viewer_user_id", type: "uuid", nullable: true, references: "users.id" },
      { name: "result", type: "text" },
      { name: "created_at", type: "timestamptz" },
    ],
    indexes: ["certificate_no", "viewer_user_id", "created_at"],
    rlsNotes: "Admins can inspect logs; public writes should be rate limited server-side.",
  },
  {
    name: "audit_logs",
    batch: "submissions-certificates",
    purpose: "Privileged action audit trail.",
    fields: [
      { name: "id", type: "uuid" },
      { name: "actor_user_id", type: "uuid", references: "users.id" },
      { name: "action", type: "text" },
      { name: "resource_type", type: "text" },
      { name: "resource_id", type: "uuid", nullable: true },
      { name: "created_at", type: "timestamptz" },
    ],
    indexes: ["actor_user_id", "resource_type, resource_id", "created_at"],
    rlsNotes: "Admin read-only; writes occur in service-layer transactions.",
  },
];

export const schemaDraftBatches: Record<MigrationBatch, string[]> = {
  "auth-rbac": schemaDraftTables
    .filter((table) => table.batch === "auth-rbac")
    .map((table) => table.name),
  "content-i18n": schemaDraftTables
    .filter((table) => table.batch === "content-i18n")
    .map((table) => table.name),
  "submissions-certificates": schemaDraftTables
    .filter((table) => table.batch === "submissions-certificates")
    .map((table) => table.name),
};

export const i18nTranslationTables = schemaDraftTables
  .filter((table) => table.i18n === "translation")
  .map((table) => table.name);
