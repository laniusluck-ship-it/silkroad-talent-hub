export type EnvSafety = "server-secret" | "server-config" | "public-client-optional";

export type EnvironmentVariablePlan = {
  name: string;
  safety: EnvSafety;
  requiredForMvp: boolean;
  mustStaySecret: boolean;
  notes: string;
};

export type DependencyPlan = {
  name: string;
  kind: "runtime" | "dev";
  installWhen: "schema-implementation" | "auth-storage-implementation" | "migration-tooling";
  purpose: string;
};

export const supabaseDrizzleDependencyPlan: DependencyPlan[] = [
  {
    name: "drizzle-orm",
    kind: "runtime",
    installWhen: "schema-implementation",
    purpose: "Type-safe SQL schema and query layer over Postgres.",
  },
  {
    name: "postgres",
    kind: "runtime",
    installWhen: "schema-implementation",
    purpose: "Postgres driver used by Drizzle in server runtime.",
  },
  {
    name: "@supabase/supabase-js",
    kind: "runtime",
    installWhen: "auth-storage-implementation",
    purpose: "Supabase Auth and Storage client; keep out of business service logic.",
  },
  {
    name: "drizzle-kit",
    kind: "dev",
    installWhen: "migration-tooling",
    purpose: "Generate, inspect, and apply database migrations.",
  },
];

export const supabaseEnvironmentPlan: EnvironmentVariablePlan[] = [
  {
    name: "DATABASE_URL",
    safety: "server-secret",
    requiredForMvp: true,
    mustStaySecret: true,
    notes: "Direct Postgres connection string for Drizzle. Never expose to browser or commit.",
  },
  {
    name: "SUPABASE_URL",
    safety: "server-config",
    requiredForMvp: true,
    mustStaySecret: false,
    notes:
      "Project URL. Server config by default; expose a VITE_ variant only if a client SDK is approved.",
  },
  {
    name: "SUPABASE_ANON_KEY",
    safety: "public-client-optional",
    requiredForMvp: false,
    mustStaySecret: false,
    notes: "May be public for browser Auth later, but not needed for current Server Functions MVP.",
  },
  {
    name: "SUPABASE_SERVICE_ROLE_KEY",
    safety: "server-secret",
    requiredForMvp: false,
    mustStaySecret: true,
    notes: "High-privilege key for server-only admin/storage tasks. Never log, bundle, or expose.",
  },
  {
    name: "SUPABASE_JWT_SECRET",
    safety: "server-secret",
    requiredForMvp: false,
    mustStaySecret: true,
    notes:
      "Only needed if the server verifies Supabase JWTs directly instead of using helper APIs.",
  },
];

export const authRlsBoundaryPlan = {
  authUserMapping:
    "Use business users.id equal to Supabase auth.users.id where possible; otherwise store auth_user_id with a unique index.",
  getCurrentUser:
    "Resolve Supabase session/JWT in server code, then load business user, roles, permissions, and profile references.",
  serviceRole:
    "SUPABASE_SERVICE_ROLE_KEY is server-only for privileged automation; ordinary user actions still pass service-layer RBAC checks.",
  rls: "Use RLS as data isolation fallback for profiles, submissions, certificates, and storage metadata. Use service-layer RBAC for business actions such as review, process, and issue.",
} as const;

export const storageBoundaryPlan = {
  buckets: [
    "resumes",
    "contest-materials",
    "course-resources",
    "certificates",
    "enterprise-documents",
  ],
  metadataTables: ["files", "resume_files", "contest_materials", "certificate_files"],
  abstraction:
    "Expose FileService/StorageRepository methods such as createUploadUrl, createDownloadUrl, attachFileToResource, and deleteFile. Business tables store file ids, not raw Supabase paths.",
} as const;

export const migrationExecutionPlan = [
  "Approve dependencies and package changes.",
  "Create drizzle.config.ts with DATABASE_URL from server environment only.",
  "Implement Drizzle schema from schema-draft batches.",
  "Generate migrations locally without connecting production until DATABASE_URL is approved.",
  "Apply migrations to a staging Supabase project before production.",
  "Implement DB repository behind the existing service-layer Result contract.",
] as const;

export const forbiddenSecretPractices = [
  "Do not commit .env files with real values.",
  "Do not place SUPABASE_SERVICE_ROLE_KEY in browser-visible VITE_ variables.",
  "Do not log DATABASE_URL, service role key, JWT secret, or signed storage URLs.",
  "Do not import server DB clients from non-.server frontend modules.",
] as const;
