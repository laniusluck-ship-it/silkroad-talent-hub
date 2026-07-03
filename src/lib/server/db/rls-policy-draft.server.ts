export type RlsActor = "anon" | "authenticated" | "service_role";

export type RlsPolicyGroup = {
  key: string;
  tables: string[];
  actors: RlsActor[];
  read: string;
  write: string;
  notes: string[];
};

export const rlsPolicyDrafts: RlsPolicyGroup[] = [
  {
    key: "public-content-read",
    tables: [
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
    ],
    actors: ["anon", "authenticated"],
    read: "Allow published public content only; translations follow parent status.",
    write:
      "No direct writes from anon/authenticated users; service functions perform owner/admin-checked writes.",
    notes: ["Draft/reviewing/archived rows require owner or admin checks outside public policies."],
  },
  {
    key: "own-profile-data",
    tables: ["users", "student_profiles", "enterprise_profiles", "teacher_profiles", "user_roles"],
    actors: ["authenticated"],
    read: "Users can read their own profile and role rows; admins can read all via admin policy.",
    write:
      "Users may update limited own profile fields; admin/user:review handles verification state.",
    notes: ["Never allow anon reads on profile tables.", "auth.uid() should match users.id."],
  },
  {
    key: "owner-submission-processing",
    tables: ["enrollments", "job_applications", "contest_registrations"],
    actors: ["authenticated"],
    read: "Students read own submissions; enterprise/teacher owners read submissions for owned jobs/courses/contests; admins read all.",
    write:
      "Students create own submissions; owners/admins process status through service-layer RBAC.",
    notes: ["Submission writes require authenticated user_id and idempotency constraints."],
  },
  {
    key: "certificate-verify-view",
    tables: ["certificates", "certificate_verification_logs"],
    actors: ["anon", "authenticated"],
    read: "certificate:verify exposes only limited public verification fields by certificate number; certificate:view exposes details only to holder, authorized enterprise/teacher, or admin.",
    write:
      "Verification logs may be inserted by server functions with rate limiting; certificate issuance/revocation is admin-only.",
    notes: [
      "Do not expose holder private profile fields in public verify responses.",
      "Keep certificate:view separate from certificate:verify.",
    ],
  },
  {
    key: "admin-full-control",
    tables: [
      "roles",
      "permissions",
      "role_permissions",
      "audit_logs",
      "users",
      "enterprise_profiles",
      "teacher_profiles",
      "certificates",
    ],
    actors: ["authenticated"],
    read: "Admins can read administrative tables through has_permission(user, admin permission) helper policies.",
    write:
      "Admins can write review, role, certificate, and audit-controlled state through service-layer flows.",
    notes: ["Prefer SQL helper functions such as is_admin() or has_permission() after review."],
  },
  {
    key: "service-role-restricted",
    tables: ["all"],
    actors: ["service_role"],
    read: "Service role bypass is reserved for migrations, maintenance, and trusted backend jobs.",
    write: "Never use service role as the default path for ordinary user requests.",
    notes: [
      "Keep SUPABASE_SERVICE_ROLE_KEY server-only.",
      "Do not log service role operations with secrets.",
    ],
  },
];

export const rlsMigrationRecommendation = {
  shouldGenerateMigrationNow: false,
  nextMigrationName: "0001_rls_policies.sql",
  blockers: [
    "Confirm exact deployed table and column names.",
    "Decide SQL helper function shape for is_admin() and has_permission().",
    "Decide whether certificate verification logs allow anon inserts directly or only via Server Functions.",
    "Test anon/authenticated/service_role behavior in staging before production.",
  ],
} as const;
