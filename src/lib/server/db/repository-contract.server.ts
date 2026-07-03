import type { AuthUser } from "../platform-auth.server.ts";
import type { LocaleCode } from "../platform-system-model.server.ts";

export type PageInput =
  | { mode: "offset"; page: number; pageSize: number }
  | { mode: "cursor"; cursor?: string; limit: number };

export type PageResult<T> = {
  items: T[];
  total?: number;
  nextCursor?: string;
};

export type QueryContext = {
  locale?: LocaleCode;
  currentUser?: AuthUser | null;
};

export type ListQuery<TFilters = Record<string, unknown>> = QueryContext & {
  pagination?: PageInput;
  filters?: TFilters;
  sort?: string;
};

export type WriteContext = QueryContext & {
  idempotencyKey?: string;
  audit?: {
    action: string;
    resourceType: string;
  };
};

export type RepositoryTransaction<TRepository> = <T>(
  operation: (repository: TRepository) => Promise<T>,
) => Promise<T>;

export type StorageAttachmentInput = {
  fileId: string;
  resourceType: string;
  resourceId: string;
  purpose:
    | "resume"
    | "contest-material"
    | "course-resource"
    | "certificate"
    | "enterprise-document";
};

export interface DbReadyPlatformRepositoryContract {
  listCourses(
    query: ListQuery<{ status?: string; category?: string }>,
  ): Promise<PageResult<unknown>>;
  getCourse(id: string, context?: QueryContext): Promise<unknown | null>;
  listJobs(
    query: ListQuery<{ city?: string; status?: string; enterpriseId?: string }>,
  ): Promise<PageResult<unknown>>;
  getJob(id: string, context?: QueryContext): Promise<unknown | null>;
  listCertifications(query: ListQuery<{ status?: string }>): Promise<PageResult<unknown>>;
  getCertification(id: string, context?: QueryContext): Promise<unknown | null>;
  listContests(query: ListQuery<{ status?: string }>): Promise<PageResult<unknown>>;
  getContest(id: string, context?: QueryContext): Promise<unknown | null>;
  listNews(query: ListQuery<{ status?: string; tag?: string }>): Promise<PageResult<unknown>>;
  createEnrollment(input: unknown, context: WriteContext): Promise<unknown>;
  createJobApplication(input: unknown, context: WriteContext): Promise<unknown>;
  createContestRegistration(input: unknown, context: WriteContext): Promise<unknown>;
  verifyCertificate(certificateNo: string, context?: QueryContext): Promise<unknown>;
  writeAuditLog(
    input: { action: string; resourceType: string; resourceId?: string },
    actor: AuthUser,
  ): Promise<void>;
  withTransaction: RepositoryTransaction<DbReadyPlatformRepositoryContract>;
}

export const repositoryContractInvariants = [
  "Server Functions keep returning the existing Result envelope.",
  "Service functions keep receiving repository implementations through options or composition.",
  "Read methods accept locale and pagination without requiring callers to know translation table details.",
  "Write methods receive currentUser from auth context, not from client-submitted identity fields.",
  "Idempotency is enforced in the database repository with unique constraints or serializable transactions.",
  "Audit writes happen in the same transaction as privileged state changes.",
] as const;

export const storageRepositoryContract = {
  methods: ["createUploadUrl", "createDownloadUrl", "attachFileToResource", "deleteFile"],
  attachmentShape: "StorageAttachmentInput",
  invariant:
    "Business tables reference file ids or attachment records, not raw Supabase storage paths.",
} satisfies {
  methods: string[];
  attachmentShape: keyof { StorageAttachmentInput: StorageAttachmentInput };
  invariant: string;
};
