import {
  DEFAULT_PLATFORM_LOCALE,
  type PlatformLocale,
  type PlatformPermission,
  type PlatformRole,
} from "./platformSystem";

export type PlatformResult<T> = {
  success: boolean;
  data: T | null;
  message: string;
  errors: Array<{ code: string; field?: string; message: string }>;
};

export type PlatformRequestContext = {
  locale: PlatformLocale;
  viewerId?: string;
  viewerRole: PlatformRole;
  permissions: PlatformPermission[];
};

export type PlatformApiOptions = {
  context?: Partial<PlatformRequestContext>;
  signal?: AbortSignal;
};

export type PlatformApiIntegrationStatus =
  | "mock-only"
  | "ready-for-server-function"
  | "requires-auth"
  | "requires-db-auth";

export type PlatformApiRoadmapItem = {
  status: PlatformApiIntegrationStatus;
  nextStep: string;
};

export function createDefaultPlatformContext(
  context: Partial<PlatformRequestContext> = {},
): PlatformRequestContext {
  return {
    locale: context.locale ?? DEFAULT_PLATFORM_LOCALE,
    viewerId: context.viewerId,
    viewerRole: context.viewerRole ?? "guest",
    permissions: context.permissions ?? ["content:browse", "certificate:verify"],
  };
}

export function unwrapPlatformResult<T>(result: PlatformResult<T>): T {
  if (!result.success || result.data === null) {
    throw new Error(result.message || "平台接口请求失败");
  }

  return result.data;
}

export function getPlatformErrorMessage(result: PlatformResult<unknown>) {
  if (result.message) return result.message;
  return (
    result.errors
      .map((error) => error.message)
      .filter(Boolean)
      .join("，") || "平台接口请求失败"
  );
}

export function getDuplicateSubmitMessage(result: PlatformResult<{ duplicate?: boolean }>) {
  if (result.success && result.data?.duplicate) {
    return result.message || "已收到你的提交，请勿重复提交";
  }

  return null;
}

export const platformApiRoadmap = {
  overview: {
    status: "ready-for-server-function",
    nextStep: "用 getPlatformOverview 替换首页统计、精选课程、岗位、赛事和资讯 mock。",
  },
  search: {
    status: "ready-for-server-function",
    nextStep: "用 searchPlatform 替换搜索结果页本地 searchableResources，并保留分组筛选 UI。",
  },
  publicDetail: {
    status: "ready-for-server-function",
    nextStep: "课程、岗位、认证、赛事详情优先接公开详情接口。",
  },
  enrollment: {
    status: "requires-db-auth",
    nextStep: "课程报名、考试报名需要 Auth、重复提交判断和报名记录表后接入。",
  },
  jobApplication: {
    status: "requires-db-auth",
    nextStep: "岗位投递需要学生登录态、简历资料和企业处理流后接入。",
  },
  contestRegistration: {
    status: "requires-db-auth",
    nextStep: "赛事报名需要学生/团队身份、报名记录和审核状态后接入。",
  },
  certificateVerification: {
    status: "ready-for-server-function",
    nextStep: "公开证书核验可先接 verifyCertificate；个人证书查看再接登录态。",
  },
} as const satisfies Record<string, PlatformApiRoadmapItem>;

export const platformApiStatus = {
  overview: "pending-integration",
  search: "pending-integration",
  courseDetail: "pending-integration",
  jobApplication: "pending-integration",
  contestRegistration: "pending-integration",
  certificateVerification: "pending-integration",
} as const;
