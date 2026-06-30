import {
  mockPlatformRepository,
  type Certification,
  type Contest,
  type Course,
  type Job,
  type NewsItem,
  type PlatformRepository,
} from "./platform-data.server";

export type ApiError = {
  code: string;
  field?: string;
  message: string;
};

export type ServiceResult<T> =
  | {
      success: true;
      data: T;
      message: string;
      errors: [];
    }
  | {
      success: false;
      data: null;
      message: string;
      errors: ApiError[];
    };

export type SearchEntity = "all" | "course" | "job" | "certification" | "contest" | "news";

export type SearchResult =
  | { entity: "course"; item: Course }
  | { entity: "job"; item: Job }
  | { entity: "certification"; item: Certification }
  | { entity: "contest"; item: Contest }
  | { entity: "news"; item: NewsItem };

export type PlatformOverview = {
  stats: ReturnType<PlatformRepository["getStats"]>;
  featuredCourses: Course[];
  featuredJobs: Job[];
  certifications: Certification[];
  activeContests: Contest[];
  latestNews: NewsItem[];
  submissionCounts: ReturnType<PlatformRepository["getSubmissionCounts"]>;
};

export type PlatformServiceOptions = {
  repository?: PlatformRepository;
};

export type SubmissionResult<T> = {
  record: T;
  duplicate: boolean;
};

export const backendSecurityNotes = [
  {
    scope: "authentication",
    status: "pending",
    message: "报名、投递、赛事报名未来应要求登录或短信校验，当前原型阶段仅做字段校验。",
  },
  {
    scope: "authorization",
    status: "pending",
    message: "课程、岗位、认证、赛事的管理接口尚未开放；未来管理端必须加管理员权限。",
  },
  {
    scope: "persistence",
    status: "mock-only",
    message: "当前 repository 为内存 mock，重启或多实例部署会丢失提交记录和幂等状态。",
  },
] as const;

const phonePattern = /^1[3-9]\d{9}$/;

function ok<T>(data: T, message = "操作成功"): ServiceResult<T> {
  return { success: true, data, message, errors: [] };
}

export function fail<T = never>(
  message: string,
  errors: ApiError[] = [{ code: "BAD_REQUEST", message }],
): ServiceResult<T> {
  return { success: false, data: null, message, errors };
}

export function validationFailure(errors: ApiError[]): ServiceResult<never> {
  return fail("请检查提交信息", errors);
}

function getRepository(options?: PlatformServiceOptions) {
  return options?.repository ?? mockPlatformRepository;
}

function normalizeKeyword(keyword?: string) {
  return keyword?.trim().toLowerCase() ?? "";
}

function includesKeyword(values: Array<string | number | undefined>, keyword: string) {
  if (!keyword) return true;
  return values
    .filter((value): value is string | number => value !== undefined)
    .some((value) => String(value).toLowerCase().includes(keyword));
}

function byNewestDate<T extends { date?: string; postedAt?: string }>(a: T, b: T) {
  const aDate = a.date ?? a.postedAt ?? "";
  const bDate = b.date ?? b.postedAt ?? "";
  return bDate.localeCompare(aDate);
}

function phoneError(phone: string): ApiError | undefined {
  if (phonePattern.test(phone)) return undefined;
  return { code: "INVALID_PHONE", field: "phone", message: "请输入有效的中国大陆手机号" };
}

export function getPlatformOverview(
  options?: PlatformServiceOptions,
): ServiceResult<PlatformOverview> {
  const repository = getRepository(options);
  const contests = repository.listContests();
  const news = repository.listNews();

  return ok(
    {
      stats: repository.getStats(),
      featuredCourses: repository.listCourses().slice(0, 3),
      featuredJobs: repository.listJobs().slice(0, 3),
      certifications: repository.listCertifications(),
      activeContests: contests.filter((contest) => contest.status !== "已结束"),
      latestNews: [...news].sort(byNewestDate).slice(0, 5),
      submissionCounts: repository.getSubmissionCounts(),
    },
    "平台概览获取成功",
  );
}

export function searchPlatform(
  input: {
    keyword?: string;
    entity?: SearchEntity;
    limit?: number;
  },
  options?: PlatformServiceOptions,
): ServiceResult<{ results: SearchResult[]; total: number }> {
  const repository = getRepository(options);
  const keyword = normalizeKeyword(input.keyword);
  const entity = input.entity ?? "all";
  const limit = input.limit ?? 20;
  const results: SearchResult[] = [];

  if (entity === "all" || entity === "course") {
    results.push(
      ...repository
        .listCourses()
        .filter((course) =>
          includesKeyword(
            [
              course.title,
              course.category,
              course.level,
              course.instructor,
              course.summary,
              ...course.tags,
            ],
            keyword,
          ),
        )
        .map((item) => ({ entity: "course" as const, item })),
    );
  }

  if (entity === "all" || entity === "job") {
    results.push(
      ...repository
        .listJobs()
        .filter((job) =>
          includesKeyword(
            [job.title, job.company, job.city, job.type, ...job.tags, ...job.requirements],
            keyword,
          ),
        )
        .map((item) => ({ entity: "job" as const, item })),
    );
  }

  if (entity === "all" || entity === "certification") {
    results.push(
      ...repository
        .listCertifications()
        .filter((certification) =>
          includesKeyword(
            [certification.name, certification.level, certification.code, ...certification.modules],
            keyword,
          ),
        )
        .map((item) => ({ entity: "certification" as const, item })),
    );
  }

  if (entity === "all" || entity === "contest") {
    results.push(
      ...repository
        .listContests()
        .filter((contest) =>
          includesKeyword(
            [contest.title, contest.host, contest.status, ...contest.tracks],
            keyword,
          ),
        )
        .map((item) => ({ entity: "contest" as const, item })),
    );
  }

  if (entity === "all" || entity === "news") {
    results.push(
      ...repository
        .listNews()
        .filter((item) => includesKeyword([item.title, item.tag, item.summary], keyword))
        .map((item) => ({ entity: "news" as const, item })),
    );
  }

  return ok({ results: results.slice(0, limit), total: results.length }, "搜索完成");
}

export function getCourseDetail(
  id: string,
  options?: PlatformServiceOptions,
): ServiceResult<Course> {
  const record = getRepository(options).getCourse(id);
  if (!record) {
    return fail("课程不存在或已下架", [
      { code: "COURSE_NOT_FOUND", field: "courseId", message: "课程不存在或已下架" },
    ]);
  }
  return ok(record, "课程详情获取成功");
}

export function getJobDetail(id: string, options?: PlatformServiceOptions): ServiceResult<Job> {
  const record = getRepository(options).getJob(id);
  if (!record) {
    return fail("岗位不存在或已下架", [
      { code: "JOB_NOT_FOUND", field: "jobId", message: "岗位不存在或已下架" },
    ]);
  }
  return ok(record, "岗位详情获取成功");
}

export function getCertificationDetail(
  id: string,
  options?: PlatformServiceOptions,
): ServiceResult<Certification> {
  const record = getRepository(options).getCertification(id);
  if (!record) {
    return fail("认证项目不存在", [
      {
        code: "CERTIFICATION_NOT_FOUND",
        field: "certificationId",
        message: "认证项目不存在",
      },
    ]);
  }
  return ok(record, "认证详情获取成功");
}

export function getContestDetail(
  id: string,
  options?: PlatformServiceOptions,
): ServiceResult<Contest> {
  const record = getRepository(options).getContest(id);
  if (!record) {
    return fail("赛事不存在或报名已关闭", [
      { code: "CONTEST_NOT_FOUND", field: "contestId", message: "赛事不存在或报名已关闭" },
    ]);
  }
  return ok(record, "赛事详情获取成功");
}

export function createCourseEnrollment(
  input: {
    courseId: string;
    learnerName: string;
    phone: string;
    school?: string;
    idempotencyKey?: string;
  },
  options?: PlatformServiceOptions,
) {
  const repository = getRepository(options);
  const phoneValidationError = phoneError(input.phone);
  if (phoneValidationError) return validationFailure([phoneValidationError]);

  if (!repository.getCourse(input.courseId)) {
    return fail("课程不存在或已下架", [
      { code: "COURSE_NOT_FOUND", field: "courseId", message: "课程不存在或已下架" },
    ]);
  }

  const result = repository.saveEnrollment(input);
  return ok<SubmissionResult<typeof result.record>>(
    { record: result.record, duplicate: result.duplicate },
    result.duplicate ? "已收到报名，请勿重复提交" : "课程报名提交成功",
  );
}

export function createJobApplication(
  input: {
    jobId: string;
    candidateName: string;
    phone: string;
    school?: string;
    major?: string;
    portfolioUrl?: string;
    idempotencyKey?: string;
  },
  options?: PlatformServiceOptions,
) {
  const repository = getRepository(options);
  const phoneValidationError = phoneError(input.phone);
  if (phoneValidationError) return validationFailure([phoneValidationError]);

  if (!repository.getJob(input.jobId)) {
    return fail("岗位不存在或已下架", [
      { code: "JOB_NOT_FOUND", field: "jobId", message: "岗位不存在或已下架" },
    ]);
  }

  const result = repository.saveJobApplication(input);
  return ok<SubmissionResult<typeof result.record>>(
    { record: result.record, duplicate: result.duplicate },
    result.duplicate ? "已收到投递，请勿重复提交" : "岗位投递提交成功",
  );
}

export function createContestRegistration(
  input: {
    contestId: string;
    teamName: string;
    leaderName: string;
    phone: string;
    school: string;
    memberCount: number;
    projectTitle: string;
    idempotencyKey?: string;
  },
  options?: PlatformServiceOptions,
) {
  const repository = getRepository(options);
  const phoneValidationError = phoneError(input.phone);
  if (phoneValidationError) return validationFailure([phoneValidationError]);

  const contest = repository.getContest(input.contestId);
  if (!contest) {
    return fail("赛事不存在或报名已关闭", [
      { code: "CONTEST_NOT_FOUND", field: "contestId", message: "赛事不存在或报名已关闭" },
    ]);
  }

  if (contest.status === "已结束") {
    return fail("赛事已结束，暂不接受报名", [
      { code: "CONTEST_CLOSED", field: "contestId", message: "赛事已结束，暂不接受报名" },
    ]);
  }

  const result = repository.saveContestRegistration(input);
  return ok<SubmissionResult<typeof result.record>>(
    { record: result.record, duplicate: result.duplicate },
    result.duplicate ? "已收到赛事报名，请勿重复提交" : "赛事报名提交成功",
  );
}

export function verifyCertificate(
  input: { certificateCode: string; holderName?: string },
  options?: PlatformServiceOptions,
) {
  const repository = getRepository(options);
  const code = input.certificateCode.trim().toUpperCase();
  const matchedCertification = repository
    .listCertifications()
    .find((certification) => code.startsWith(certification.code));

  return ok(
    {
      valid: Boolean(matchedCertification),
      certificateCode: code,
      holderName: input.holderName?.trim(),
      certification: matchedCertification,
      checkedAt: new Date().toISOString(),
    },
    matchedCertification ? "证书核验通过" : "未查询到有效证书",
  );
}
