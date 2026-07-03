export const PLATFORM_LOCALES = ["zh-CN", "en-US"] as const;

export type PlatformLocale = (typeof PLATFORM_LOCALES)[number];

export const DEFAULT_PLATFORM_LOCALE: PlatformLocale = "zh-CN";

export const PLATFORM_ROLES = ["guest", "student", "enterprise", "teacher", "admin"] as const;

export type PlatformRole = (typeof PLATFORM_ROLES)[number];

export type PlatformPermission =
  | "content:browse"
  | "course:enroll"
  | "job:apply"
  | "contest:register"
  | "exam:register"
  | "certificate:verify"
  | "certificate:view"
  | "job:publish"
  | "course:manage"
  | "content:review"
  | "submission:process"
  | "certificate:manage"
  | "user:review";

export type PlatformCapability =
  | "browse-public-content"
  | "start-learning-path"
  | "submit-application"
  | "manage-owned-content"
  | "review-platform-content"
  | "view-admin-console";

export type AuthState =
  | { status: "anonymous"; role: "guest" }
  | {
      status: "authenticated";
      role: Exclude<PlatformRole, "guest">;
      userId: string;
      displayName: string;
      permissions: PlatformPermission[];
    }
  | {
      status: "pending-review";
      role: "enterprise" | "teacher";
      userId: string;
      displayName: string;
      permissions: PlatformPermission[];
    };

export const ROLE_PERMISSIONS = {
  guest: ["content:browse", "certificate:verify"],
  student: [
    "content:browse",
    "course:enroll",
    "job:apply",
    "contest:register",
    "exam:register",
    "certificate:verify",
    "certificate:view",
  ],
  enterprise: [
    "content:browse",
    "job:publish",
    "submission:process",
    "certificate:verify",
    "certificate:view",
  ],
  teacher: [
    "content:browse",
    "course:manage",
    "submission:process",
    "certificate:verify",
    "certificate:view",
  ],
  admin: [
    "content:browse",
    "course:enroll",
    "job:apply",
    "contest:register",
    "exam:register",
    "certificate:verify",
    "certificate:view",
    "job:publish",
    "course:manage",
    "content:review",
    "submission:process",
    "certificate:manage",
    "user:review",
  ],
} as const satisfies Record<PlatformRole, readonly PlatformPermission[]>;

export const CAPABILITY_PERMISSIONS = {
  "browse-public-content": ["content:browse"],
  "start-learning-path": ["course:enroll", "contest:register", "exam:register"],
  "submit-application": ["job:apply"],
  "manage-owned-content": ["job:publish", "course:manage"],
  "review-platform-content": ["content:review", "user:review"],
  "view-admin-console": ["content:review", "submission:process", "certificate:manage"],
} as const satisfies Record<PlatformCapability, readonly PlatformPermission[]>;

export type AdminModule = {
  id:
    | "dashboard"
    | "courses"
    | "jobs"
    | "submissions"
    | "contests"
    | "certificates"
    | "content"
    | "users";
  label: string;
  route: `/admin/${string}`;
  requiredPermissions: PlatformPermission[];
  description: string;
};

export const ADMIN_MODULES = [
  {
    id: "dashboard",
    label: "数据概览",
    route: "/admin/dashboard",
    requiredPermissions: ["content:review", "submission:process"],
    description: "查看待审核内容、报名投递、证书核验等平台运营指标。",
  },
  {
    id: "courses",
    label: "课程管理",
    route: "/admin/courses",
    requiredPermissions: ["course:manage"],
    description: "维护课程、分类、讲师、上下架状态和报名名单。",
  },
  {
    id: "jobs",
    label: "岗位管理",
    route: "/admin/jobs",
    requiredPermissions: ["job:publish", "content:review"],
    description: "处理企业岗位发布、审核、上下架和投递入口。",
  },
  {
    id: "submissions",
    label: "报名与投递",
    route: "/admin/submissions",
    requiredPermissions: ["submission:process"],
    description: "处理课程报名、岗位投递、赛事报名和考试报名记录。",
  },
  {
    id: "contests",
    label: "赛事管理",
    route: "/admin/contests",
    requiredPermissions: ["content:review", "submission:process"],
    description: "维护赛事项目、报名名单、获奖项目和赛事实践内容。",
  },
  {
    id: "certificates",
    label: "认证与证书",
    route: "/admin/certificates",
    requiredPermissions: ["certificate:manage"],
    description: "维护考试场次、证书发放、证书状态和核验记录。",
  },
  {
    id: "content",
    label: "资讯管理",
    route: "/admin/content",
    requiredPermissions: ["content:review"],
    description: "发布和审核政策资讯、行业动态、平台公告。",
  },
  {
    id: "users",
    label: "用户与企业审核",
    route: "/admin/users",
    requiredPermissions: ["user:review"],
    description: "审核学生、企业、教师/机构资料和角色权限。",
  },
] as const satisfies readonly AdminModule[];
