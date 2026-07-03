import type { LocaleCode } from "../platform-system-model.server.ts";

export type DbReadOperation =
  | "getOverview"
  | "searchPlatform"
  | "getCourseDetail"
  | "getJobDetail"
  | "getCertificationDetail"
  | "getContestDetail"
  | "listNews";

export type DbReadQueryBoundary = {
  locale?: LocaleCode;
  pagination?: "offset" | "cursor";
  filters?: string[];
  sort?: string[];
  resultEnvelope: "ServiceResult";
};

export const dbReadRepositoryPlan: Record<DbReadOperation, DbReadQueryBoundary> = {
  getOverview: {
    locale: "zh-CN",
    pagination: "offset",
    filters: ["published content only"],
    sort: ["latest news", "featured content"],
    resultEnvelope: "ServiceResult",
  },
  searchPlatform: {
    locale: "zh-CN",
    pagination: "offset",
    filters: ["entity", "keyword", "status", "category", "city"],
    sort: ["relevance", "latest"],
    resultEnvelope: "ServiceResult",
  },
  getCourseDetail: {
    locale: "zh-CN",
    filters: ["id", "published or owner/admin"],
    resultEnvelope: "ServiceResult",
  },
  getJobDetail: {
    locale: "zh-CN",
    filters: ["id", "published or enterprise/admin"],
    resultEnvelope: "ServiceResult",
  },
  getCertificationDetail: {
    locale: "zh-CN",
    filters: ["id", "published"],
    resultEnvelope: "ServiceResult",
  },
  getContestDetail: {
    locale: "zh-CN",
    filters: ["id", "published"],
    resultEnvelope: "ServiceResult",
  },
  listNews: {
    locale: "zh-CN",
    pagination: "cursor",
    filters: ["published", "tag"],
    sort: ["published_at desc"],
    resultEnvelope: "ServiceResult",
  },
};

export const dbReadLocaleFallbackPlan = {
  order: ["requested locale", "zh-CN", "first available translation"],
  implementation:
    "Repository SQL should select requested translation first, left join zh-CN fallback, then fallback to any available translation when needed.",
  search:
    "Search should match requested locale translation fields first; fallback search can include zh-CN until dedicated search indexes are introduced.",
} as const;

export const dbWriteCutoverPlan = {
  cutWritesThisRound: false,
  remainsMocked: ["createCourseEnrollment", "createJobApplication", "createContestRegistration"],
  blockers: [
    "Auth currentUser must be wired to Server Functions.",
    "RLS policies and idempotency unique constraints must be reviewed.",
    "Submission status and audit transaction boundaries must be implemented.",
  ],
} as const;
