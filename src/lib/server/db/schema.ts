import {
  date,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
};

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey(),
    phone: text("phone"),
    email: text("email"),
    status: text("status").notNull().default("active"),
    preferredLocale: text("preferred_locale").notNull().default("zh-CN"),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("users_phone_unique").on(table.phone),
    uniqueIndex("users_email_unique").on(table.email),
    index("users_status_idx").on(table.status),
  ],
);

export const roles = pgTable("roles", {
  key: text("key").primaryKey(),
  label: text("label").notNull(),
  ...timestamps,
});

export const permissions = pgTable("permissions", {
  key: text("key").primaryKey(),
  description: text("description").notNull(),
  ...timestamps,
});

export const rolePermissions = pgTable(
  "role_permissions",
  {
    roleKey: text("role_key")
      .notNull()
      .references(() => roles.key, { onDelete: "cascade" }),
    permissionKey: text("permission_key")
      .notNull()
      .references(() => permissions.key, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.roleKey, table.permissionKey] })],
);

export const userRoles = pgTable(
  "user_roles",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    roleKey: text("role_key")
      .notNull()
      .references(() => roles.key, { onDelete: "restrict" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    ...timestamps,
  },
  (table) => [primaryKey({ columns: [table.userId, table.roleKey] })],
);

export const studentProfiles = pgTable("student_profiles", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  realName: text("real_name").notNull(),
  school: text("school"),
  major: text("major"),
  graduationYear: integer("graduation_year"),
  ...timestamps,
});

export const enterpriseProfiles = pgTable(
  "enterprise_profiles",
  {
    userId: uuid("user_id")
      .primaryKey()
      .references(() => users.id, { onDelete: "cascade" }),
    companyName: text("company_name").notNull(),
    licenseNo: text("license_no"),
    verifiedStatus: text("verified_status").notNull().default("pending"),
    contactName: text("contact_name"),
    ...timestamps,
  },
  (table) => [uniqueIndex("enterprise_profiles_license_unique").on(table.licenseNo)],
);

export const teacherProfiles = pgTable("teacher_profiles", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  displayName: text("display_name").notNull(),
  organization: text("organization"),
  bio: text("bio"),
  verifiedStatus: text("verified_status").notNull().default("pending"),
  ...timestamps,
});

export const courses = pgTable(
  "courses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ownerUserId: uuid("owner_user_id").references(() => users.id, { onDelete: "set null" }),
    status: text("status").notNull().default("draft"),
    category: text("category"),
    price: integer("price").notNull().default(0),
    format: text("format").notNull().default("online"),
    ...timestamps,
  },
  (table) => [
    index("courses_owner_idx").on(table.ownerUserId),
    index("courses_status_idx").on(table.status),
  ],
);

export const courseTranslations = pgTable(
  "course_translations",
  {
    courseId: uuid("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    locale: text("locale").notNull(),
    title: text("title").notNull(),
    summary: text("summary").notNull(),
    description: text("description"),
    outcomes: jsonb("outcomes"),
    syllabus: jsonb("syllabus"),
  },
  (table) => [primaryKey({ columns: [table.courseId, table.locale] })],
);

export const jobs = pgTable(
  "jobs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    enterpriseUserId: uuid("enterprise_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    status: text("status").notNull().default("draft"),
    city: text("city"),
    salary: text("salary"),
    deadline: date("deadline"),
    ...timestamps,
  },
  (table) => [
    index("jobs_enterprise_idx").on(table.enterpriseUserId),
    index("jobs_status_idx").on(table.status),
    index("jobs_city_idx").on(table.city),
  ],
);

export const jobTranslations = pgTable(
  "job_translations",
  {
    jobId: uuid("job_id")
      .notNull()
      .references(() => jobs.id, { onDelete: "cascade" }),
    locale: text("locale").notNull(),
    title: text("title").notNull(),
    description: text("description"),
    requirements: jsonb("requirements"),
    responsibilities: jsonb("responsibilities"),
  },
  (table) => [primaryKey({ columns: [table.jobId, table.locale] })],
);

export const certifications = pgTable(
  "certifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    code: text("code").notNull(),
    status: text("status").notNull().default("draft"),
    fee: integer("fee").notNull().default(0),
    ...timestamps,
  },
  (table) => [uniqueIndex("certifications_code_unique").on(table.code)],
);

export const certificationTranslations = pgTable(
  "certification_translations",
  {
    certificationId: uuid("certification_id")
      .notNull()
      .references(() => certifications.id, { onDelete: "cascade" }),
    locale: text("locale").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    modules: jsonb("modules"),
  },
  (table) => [primaryKey({ columns: [table.certificationId, table.locale] })],
);

export const examSessions = pgTable(
  "exam_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    certificationId: uuid("certification_id")
      .notNull()
      .references(() => certifications.id, { onDelete: "cascade" }),
    startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
    capacity: integer("capacity"),
    status: text("status").notNull().default("scheduled"),
    ...timestamps,
  },
  (table) => [
    index("exam_sessions_certification_idx").on(table.certificationId),
    index("exam_sessions_starts_at_idx").on(table.startsAt),
  ],
);

export const contests = pgTable("contests", {
  id: uuid("id").primaryKey().defaultRandom(),
  status: text("status").notNull().default("draft"),
  signupDeadline: date("signup_deadline"),
  prizePool: integer("prize_pool").notNull().default(0),
  ...timestamps,
});

export const contestTranslations = pgTable(
  "contest_translations",
  {
    contestId: uuid("contest_id")
      .notNull()
      .references(() => contests.id, { onDelete: "cascade" }),
    locale: text("locale").notNull(),
    title: text("title").notNull(),
    description: text("description"),
    tracks: jsonb("tracks"),
  },
  (table) => [primaryKey({ columns: [table.contestId, table.locale] })],
);

export const news = pgTable(
  "news",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    authorUserId: uuid("author_user_id").references(() => users.id, { onDelete: "set null" }),
    status: text("status").notNull().default("draft"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    ...timestamps,
  },
  (table) => [
    index("news_status_idx").on(table.status),
    index("news_published_at_idx").on(table.publishedAt),
  ],
);

export const newsTranslations = pgTable(
  "news_translations",
  {
    newsId: uuid("news_id")
      .notNull()
      .references(() => news.id, { onDelete: "cascade" }),
    locale: text("locale").notNull(),
    title: text("title").notNull(),
    summary: text("summary").notNull(),
    body: text("body"),
  },
  (table) => [primaryKey({ columns: [table.newsId, table.locale] })],
);

export const enrollments = pgTable(
  "enrollments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    courseId: uuid("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    status: text("status").notNull().default("submitted"),
    idempotencyKey: text("idempotency_key"),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("enrollments_user_course_unique").on(table.userId, table.courseId),
    uniqueIndex("enrollments_idempotency_unique").on(table.idempotencyKey),
  ],
);

export const jobApplications = pgTable(
  "job_applications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    jobId: uuid("job_id")
      .notNull()
      .references(() => jobs.id, { onDelete: "cascade" }),
    portfolioUrl: text("portfolio_url"),
    resumeFileId: uuid("resume_file_id"),
    status: text("status").notNull().default("submitted"),
    idempotencyKey: text("idempotency_key"),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("job_applications_user_job_unique").on(table.userId, table.jobId),
    uniqueIndex("job_applications_idempotency_unique").on(table.idempotencyKey),
  ],
);

export const contestRegistrations = pgTable(
  "contest_registrations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    contestId: uuid("contest_id")
      .notNull()
      .references(() => contests.id, { onDelete: "cascade" }),
    teamName: text("team_name").notNull(),
    projectTitle: text("project_title").notNull(),
    status: text("status").notNull().default("submitted"),
    idempotencyKey: text("idempotency_key"),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("contest_registrations_user_contest_unique").on(table.userId, table.contestId),
    uniqueIndex("contest_registrations_idempotency_unique").on(table.idempotencyKey),
  ],
);

export const certificates = pgTable(
  "certificates",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    certificateNo: text("certificate_no").notNull(),
    holderUserId: uuid("holder_user_id").references(() => users.id, { onDelete: "set null" }),
    certificationId: uuid("certification_id").references(() => certifications.id, {
      onDelete: "set null",
    }),
    status: text("status").notNull().default("active"),
    issuedAt: timestamp("issued_at", { withTimezone: true }).notNull(),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("certificates_no_unique").on(table.certificateNo),
    index("certificates_holder_idx").on(table.holderUserId),
  ],
);

export const certificateVerificationLogs = pgTable(
  "certificate_verification_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    certificateNo: text("certificate_no").notNull(),
    viewerUserId: uuid("viewer_user_id").references(() => users.id, { onDelete: "set null" }),
    result: text("result").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("certificate_verification_logs_no_idx").on(table.certificateNo),
    index("certificate_verification_logs_viewer_idx").on(table.viewerUserId),
    index("certificate_verification_logs_created_idx").on(table.createdAt),
  ],
);

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    actorUserId: uuid("actor_user_id").references(() => users.id, { onDelete: "set null" }),
    action: text("action").notNull(),
    resourceType: text("resource_type").notNull(),
    resourceId: uuid("resource_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("audit_logs_actor_idx").on(table.actorUserId),
    index("audit_logs_resource_idx").on(table.resourceType, table.resourceId),
    index("audit_logs_created_idx").on(table.createdAt),
  ],
);
