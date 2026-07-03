export type LocaleCode = "zh-CN" | "en-US";

export const defaultLocale: LocaleCode = "zh-CN";
export const supportedLocales: LocaleCode[] = ["zh-CN", "en-US"];

export type UserRole = "guest" | "student" | "enterprise" | "teacher" | "admin";

export type PermissionKey =
  | "content:browse"
  | "course:enroll"
  | "exam:register"
  | "job:apply"
  | "contest:register"
  | "certificate:verify"
  | "certificate:view"
  | "job:publish"
  | "course:manage"
  | "content:review"
  | "user:review"
  | "submission:process"
  | "certificate:manage";

export type EntityCoverageStatus = "mocked" | "partial" | "missing";
export type ApiStatus = "exists" | "adjust" | "new";

export type TableDraft = {
  name: string;
  purpose: string;
  keyFields: string[];
  notes?: string;
};

export type ApiDraft = {
  name: string;
  status: ApiStatus;
  purpose: string;
  auth: UserRole[];
  notes?: string;
};

export const rolePermissionDraft: Record<
  UserRole,
  {
    label: string;
    permissions: PermissionKey[];
    notes: string;
  }
> = {
  guest: {
    label: "游客",
    permissions: ["content:browse", "certificate:verify"],
    notes: "可浏览公开课程、岗位、赛事、认证与资讯，可公开核验证书编号；不可报名、投递或管理内容。",
  },
  student: {
    label: "学生",
    permissions: [
      "content:browse",
      "course:enroll",
      "exam:register",
      "job:apply",
      "contest:register",
      "certificate:verify",
      "certificate:view",
    ],
    notes: "可报名课程/赛事、投递岗位，公开核验证书编号，并查看自己的证书与提交记录。",
  },
  enterprise: {
    label: "企业",
    permissions: [
      "content:browse",
      "job:publish",
      "certificate:verify",
      "certificate:view",
      "submission:process",
    ],
    notes: "可发布岗位、处理本企业岗位投递、公开核验证书编号，并查看授权候选人资料。",
  },
  teacher: {
    label: "教师/机构",
    permissions: [
      "content:browse",
      "course:manage",
      "certificate:verify",
      "certificate:view",
      "submission:process",
    ],
    notes: "可维护自己负责的课程、公开核验证书编号，并查看课程相关报名与证书记录。",
  },
  admin: {
    label: "管理员",
    permissions: [
      "content:browse",
      "course:enroll",
      "exam:register",
      "job:apply",
      "contest:register",
      "certificate:verify",
      "certificate:view",
      "job:publish",
      "course:manage",
      "content:review",
      "user:review",
      "submission:process",
      "certificate:manage",
    ],
    notes: "拥有内容审核、用户/企业/课程/岗位/证书管理权限，应接入后台 RBAC。",
  },
};

export const entityCoverageMatrix: Array<{
  entity: string;
  status: EntityCoverageStatus;
  currentCoverage: string;
  gap: string;
}> = [
  {
    entity: "User / Student / Admin / Enterprise / Teacher",
    status: "missing",
    currentCoverage: "当前 mock 只采集提交表单姓名、手机号、学校等字段。",
    gap: "缺统一用户、角色、资料、企业认证、教师/机构归属、管理员权限模型。",
  },
  {
    entity: "Course",
    status: "partial",
    currentCoverage: "已有课程基础展示字段、价格、讲师、章节、标签。",
    gap: "缺课程状态、所属机构/教师、库存/名额、内容多语言、审核、学习进度。",
  },
  {
    entity: "Job / Internship",
    status: "partial",
    currentCoverage: "已有岗位标题、企业、城市、薪资、类型、要求、截止日期。",
    gap: "缺企业 owner、审核状态、岗位上下架、招聘人数、投递处理流、多语言字段。",
  },
  {
    entity: "Certification / Exam",
    status: "partial",
    currentCoverage: "已有认证名称、等级、编码、考试日期、费用、模块。",
    gap: "缺考试场次、报名记录、题库/成绩、证书签发、证书唯一编号与核验日志。",
  },
  {
    entity: "Contest",
    status: "partial",
    currentCoverage: "已有赛事标题、主办方、状态、奖金、报名截止、赛道。",
    gap: "缺团队成员、项目材料、评审、获奖记录、赛事阶段、多语言字段。",
  },
  {
    entity: "News",
    status: "partial",
    currentCoverage: "已有资讯标题、标签、日期、摘要、热门标记。",
    gap: "缺正文、作者、发布/审核状态、多语言正文、SEO 元数据。",
  },
  {
    entity: "Enrollment",
    status: "mocked",
    currentCoverage: "已有课程报名 mock 记录、手机号和幂等 key。",
    gap: "缺用户关联、支付/订单、审核状态、取消/退款、跨实例唯一约束。",
  },
  {
    entity: "JobApplication",
    status: "mocked",
    currentCoverage: "已有岗位投递 mock 记录、作品集 URL 和幂等 key。",
    gap: "缺简历附件、处理状态、企业反馈、面试安排、用户/企业双向权限。",
  },
  {
    entity: "ContestRegistration",
    status: "mocked",
    currentCoverage: "已有赛事报名 mock 记录、团队、学校、项目名称、幂等 key。",
    gap: "缺团队成员、材料附件、阶段状态、评委评分和获奖记录。",
  },
  {
    entity: "CertificateVerification / Award",
    status: "partial",
    currentCoverage: "已有按认证 code 前缀的轻量证书核验。",
    gap: "缺真实证书表、签发记录、持有人、核验日志、获奖证书/赛事奖项关联。",
  },
];

export const databaseTableDrafts: TableDraft[] = [
  {
    name: "users",
    purpose: "统一账号主体，承载登录身份与全局状态。",
    keyFields: ["id", "phone", "email", "role", "status", "locale", "created_at"],
    notes: "phone/email 需唯一索引；游客不落库或延迟转化为学生账号。",
  },
  {
    name: "student_profiles",
    purpose: "学生资料与学校专业信息。",
    keyFields: ["user_id", "real_name", "school", "major", "graduation_year"],
  },
  {
    name: "enterprise_profiles",
    purpose: "企业账号资料、认证状态和岗位发布主体。",
    keyFields: ["user_id", "company_name", "license_no", "verified_status", "contact_name"],
  },
  {
    name: "teacher_profiles",
    purpose: "教师/机构资料和课程管理主体。",
    keyFields: ["user_id", "display_name", "organization", "bio", "verified_status"],
  },
  {
    name: "roles / permissions / role_permissions",
    purpose: "后台 RBAC，可从当前 rolePermissionDraft 初始化。",
    keyFields: ["role_id", "permission_key", "scope"],
    notes: "管理员后台和企业/教师工作台接入前必须落库；用户/企业/机构资质审核使用 user:review。",
  },
  {
    name: "courses / course_translations",
    purpose: "课程 base table + 多语言内容。",
    keyFields: ["course.id", "owner_user_id", "status", "price", "translation.locale", "title"],
    notes: "title/summary/outcomes/syllabus 等业务文案进入 translation table。",
  },
  {
    name: "jobs / job_translations",
    purpose: "岗位 base table + 多语言标题/描述/要求。",
    keyFields: ["job.id", "enterprise_id", "status", "city", "salary", "translation.locale"],
  },
  {
    name: "certifications / certification_translations / exam_sessions",
    purpose: "认证项目、考试场次和多语言说明。",
    keyFields: ["certification.id", "code", "exam_session.id", "starts_at", "locale"],
    notes:
      "考试报名使用 exam:register；公开证书编号核验使用 certificate:verify；登录/授权查看证书详情使用 certificate:view。",
  },
  {
    name: "contests / contest_translations / contest_stages",
    purpose: "赛事基础信息、阶段和多语言内容。",
    keyFields: ["contest.id", "status", "signup_deadline", "stage.id", "translation.locale"],
  },
  {
    name: "news / news_translations",
    purpose: "资讯发布和多语言正文。",
    keyFields: ["news.id", "author_user_id", "status", "published_at", "translation.locale"],
  },
  {
    name: "enrollments / job_applications / contest_registrations",
    purpose: "学生提交记录与处理状态。",
    keyFields: ["id", "user_id", "target_id", "status", "idempotency_key", "created_at"],
    notes: "idempotency_key 和 user/phone + target 应建唯一或时间窗口约束。",
  },
  {
    name: "certificates / certificate_verification_logs / awards",
    purpose: "证书签发、核验日志和赛事/课程奖项。",
    keyFields: ["certificate_no", "holder_user_id", "issued_at", "verification_log.id", "award.id"],
    notes:
      "certificate:verify 面向公开编号核验并写 verification logs；certificate:view 面向登录用户查看个人/授权/关联证书详情。",
  },
  {
    name: "audit_logs",
    purpose: "管理员审核、内容上下架、证书处理等操作审计。",
    keyFields: ["id", "actor_user_id", "action", "resource_type", "resource_id", "created_at"],
  },
];

export const apiRoadmap: ApiDraft[] = [
  {
    name: "getPlatformOverview",
    status: "exists",
    purpose: "首页/平台概览数据。",
    auth: ["guest", "student", "enterprise", "teacher", "admin"],
    notes: "后续增加 locale 参数并从 translation fallback 取业务内容。",
  },
  {
    name: "searchPlatform",
    status: "adjust",
    purpose: "跨课程、岗位、认证、赛事、资讯搜索。",
    auth: ["guest", "student", "enterprise", "teacher", "admin"],
    notes:
      "后续增加 locale、分页、排序、筛选；搜索 title/summary/requirements 等 translation 字段。",
  },
  {
    name: "getCourseDetail / getJobDetail / getCertificationDetail / getContestDetail",
    status: "exists",
    purpose: "主体详情。",
    auth: ["guest", "student", "enterprise", "teacher", "admin"],
    notes: "后续增加 locale；管理端详情需权限区分草稿/审核中/已发布。",
  },
  {
    name: "createCourseEnrollment / createJobApplication / createContestRegistration",
    status: "adjust",
    purpose: "学生报名、投递和赛事报名。",
    auth: ["student"],
    notes: "当前允许表单直提；接入登录后 user_id 来自 session，手机号可来自实名资料或短信校验。",
  },
  {
    name: "verifyCertificate",
    status: "adjust",
    purpose: "公开证书核验。",
    auth: ["guest", "student", "enterprise", "teacher", "admin"],
    notes: "后续从 certificates 表核验，并写 certificate_verification_logs。",
  },
  {
    name: "create/update/reviewCourse",
    status: "new",
    purpose: "教师/机构创建课程，管理员审核。",
    auth: ["teacher", "admin"],
  },
  {
    name: "create/update/reviewJob",
    status: "new",
    purpose: "企业发布岗位，管理员审核。",
    auth: ["enterprise", "admin"],
  },
  {
    name: "list/processSubmissions",
    status: "new",
    purpose: "企业、教师、管理员处理报名/投递/赛事提交。",
    auth: ["enterprise", "teacher", "admin"],
  },
  {
    name: "issue/revokeCertificate",
    status: "new",
    purpose: "证书签发、撤销和管理。",
    auth: ["admin"],
  },
  {
    name: "auth.login / auth.logout / auth.me",
    status: "new",
    purpose: "账号登录、退出和当前用户上下文。",
    auth: ["guest", "student", "enterprise", "teacher", "admin"],
    notes: "本轮不实现；后续所有提交类接口应依赖 auth.me。",
  },
];

export const localizationDraft = {
  defaultLocale,
  supportedLocales,
  futureLocales: ["ru-RU", "ar-SA", "tr-TR", "id-ID"],
  fallbackOrder: ["requested locale", defaultLocale, "first available translation"],
  uiCopy: "界面文案由前端 i18n 管理，后端只返回稳定 code/message 或由 adapter 映射。",
  businessContent:
    "课程、岗位、认证、赛事、资讯等主体采用 base table + *_translations；base table 存价格、状态、时间、owner 等非语言字段，translation table 存 title、summary、description、requirements、modules、tracks、body 等语言字段。",
  apiImpact:
    "公开读取和搜索接口后续增加 locale?: LocaleCode，默认 zh-CN；返回内容按 fallbackOrder 回退，并可附带 resolvedLocale 供前端提示。",
  searchImpact:
    "搜索应按 locale 优先匹配 translation 字段；无对应 locale 时回退 zh-CN；正式数据库阶段可为每个 locale 建全文索引或搜索向量。",
} as const;
