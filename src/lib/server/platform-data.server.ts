export type Course = {
  id: string;
  title: string;
  category: string;
  level: "入门" | "进阶" | "实战";
  format: "online" | "offline" | "hybrid";
  price: number;
  originalPrice?: number;
  durationHours: number;
  lessons: number;
  learners: number;
  rating: number;
  instructor: string;
  location?: string;
  startDate?: string;
  tags: string[];
  summary: string;
  outcomes: string[];
  syllabus: { title: string; minutes: number; freePreview?: boolean }[];
};

export type Job = {
  id: string;
  title: string;
  company: string;
  city: string;
  salary: string;
  type: "实习" | "校招" | "社招";
  workMode: "onsite" | "remote" | "hybrid";
  tags: string[];
  requirements: string[];
  postedAt: string;
  deadline: string;
};

export type Certification = {
  id: string;
  name: string;
  level: string;
  code: string;
  examDate: string;
  fee: number;
  passRate: number;
  modules: string[];
};

export type Contest = {
  id: string;
  title: string;
  host: string;
  status: "报名中" | "备赛中" | "已结束";
  prizePool: number;
  signupDeadline: string;
  teamSize: string;
  tracks: string[];
};

export type NewsItem = {
  id: string;
  title: string;
  tag: string;
  date: string;
  hot: boolean;
  summary: string;
};

export type PlatformStats = {
  learners: number;
  partnerCompanies: number;
  employmentRate: number;
  courses: number;
  certifiedTalents: number;
  jobs: number;
};

type SubmissionBase = {
  id: string;
  phone: string;
  idempotencyKey?: string;
  createdAt: string;
};

export type Enrollment = SubmissionBase & {
  courseId: string;
  learnerName: string;
  school?: string;
};

export type JobApplication = SubmissionBase & {
  jobId: string;
  candidateName: string;
  school?: string;
  major?: string;
  portfolioUrl?: string;
};

export type ContestRegistration = SubmissionBase & {
  contestId: string;
  teamName: string;
  leaderName: string;
  school: string;
  memberCount: number;
  projectTitle: string;
};

export type SubmissionCounts = {
  enrollments: number;
  applications: number;
  registrations: number;
};

export type RepositoryWriteResult<T> = {
  record: T;
  duplicate: boolean;
};

export type CreateEnrollmentRecord = Omit<Enrollment, "id" | "createdAt">;
export type CreateJobApplicationRecord = Omit<JobApplication, "id" | "createdAt">;
export type CreateContestRegistrationRecord = Omit<ContestRegistration, "id" | "createdAt">;

export interface PlatformRepository {
  getStats(): PlatformStats;
  listCourses(): Course[];
  getCourse(id: string): Course | undefined;
  listJobs(): Job[];
  getJob(id: string): Job | undefined;
  listCertifications(): Certification[];
  getCertification(id: string): Certification | undefined;
  listContests(): Contest[];
  getContest(id: string): Contest | undefined;
  listNews(): NewsItem[];
  saveEnrollment(input: CreateEnrollmentRecord): RepositoryWriteResult<Enrollment>;
  saveJobApplication(input: CreateJobApplicationRecord): RepositoryWriteResult<JobApplication>;
  saveContestRegistration(
    input: CreateContestRegistrationRecord,
  ): RepositoryWriteResult<ContestRegistration>;
  getSubmissionCounts(): SubmissionCounts;
  resetSubmissions(): void;
}

const nowIso = () => new Date().toISOString();
const submissionDedupWindowMs = 24 * 60 * 60 * 1000;

export const platformStats: PlatformStats = {
  learners: 12800,
  partnerCompanies: 320,
  employmentRate: 98.6,
  courses: 1200,
  certifiedTalents: 32860,
  jobs: 18600,
};

export const courses: Course[] = [
  {
    id: "course-tiktok-shop-001",
    title: "TikTok Shop 美区小店从 0 到 1 实战",
    category: "精品在线课程",
    level: "入门",
    format: "online",
    price: 199,
    originalPrice: 399,
    durationHours: 12.5,
    lessons: 32,
    learners: 8624,
    rating: 4.9,
    instructor: "陈志远",
    tags: ["TikTok Shop", "直播运营", "美区小店", "平台规则"],
    summary: "覆盖开店、选品、内容、直播、履约和合规，适合跨境电商新人和转岗学员。",
    outcomes: ["完成店铺基础运营", "产出首场直播脚本", "掌握账号风控红线"],
    syllabus: [
      { title: "业务全景与岗位能力地图", minutes: 42, freePreview: true },
      { title: "美区小店入驻与账号风控", minutes: 56 },
      { title: "爆品选品与利润模型", minutes: 68 },
      { title: "直播脚本与转化话术", minutes: 72 },
    ],
  },
  {
    id: "course-amazon-ops-002",
    title: "亚马逊精品化运营与 FBA 选品进阶",
    category: "专业能力",
    level: "进阶",
    format: "hybrid",
    price: 699,
    originalPrice: 999,
    durationHours: 18,
    lessons: 24,
    learners: 4160,
    rating: 4.8,
    instructor: "刘晓楠",
    location: "武汉汉阳实训中心",
    startDate: "2026-07-05",
    tags: ["Amazon", "FBA", "选品", "Listing 优化"],
    summary: "面向具备基础运营经验的学员，训练选品、广告、Listing 与库存周转能力。",
    outcomes: ["搭建选品评分表", "完成 Listing 优化方案", "制定 FBA 补货计划"],
    syllabus: [
      { title: "类目机会识别", minutes: 60, freePreview: true },
      { title: "关键词与 Listing 结构", minutes: 72 },
      { title: "广告投放与预算控制", minutes: 80 },
      { title: "库存周转与利润复盘", minutes: 66 },
    ],
  },
  {
    id: "course-shopify-dtc-003",
    title: "Shopify 独立站内容增长训练营",
    category: "拓展能力",
    level: "实战",
    format: "offline",
    price: 899,
    durationHours: 20,
    lessons: 16,
    learners: 2380,
    rating: 4.7,
    instructor: "周明",
    location: "武汉光谷实训中心",
    startDate: "2026-07-20",
    tags: ["Shopify", "独立站", "SEO", "海外社媒"],
    summary: "围绕品牌站搭建、内容运营、SEO 和海外社媒转化，完成一个可上线的 DTC 项目。",
    outcomes: ["搭建品牌落地页", "规划内容日历", "完成转化漏斗复盘"],
    syllabus: [
      { title: "DTC 商业模型拆解", minutes: 48, freePreview: true },
      { title: "Shopify 主题与商品页", minutes: 90 },
      { title: "SEO 内容集群", minutes: 75 },
      { title: "海外社媒投放复盘", minutes: 70 },
    ],
  },
];

export const jobs: Job[] = [
  {
    id: "job-tiktok-live-001",
    title: "TikTok Shop 直播运营实习生",
    company: "武汉华天境外贸易有限公司",
    city: "武汉光谷",
    salary: "180-220/天",
    type: "实习",
    workMode: "onsite",
    tags: ["可转正", "导师带教", "直播脚本"],
    requirements: ["每周到岗 4 天以上", "了解短视频平台内容节奏", "英语读写能力良好"],
    postedAt: "2026-06-08",
    deadline: "2026-07-15",
  },
  {
    id: "job-amazon-listing-002",
    title: "亚马逊选品与 Listing 优化实习生",
    company: "极兔跨境供应链湖北分部",
    city: "武汉汉阳",
    salary: "150-200/天",
    type: "实习",
    workMode: "hybrid",
    tags: ["双休", "项目实战", "数据分析"],
    requirements: ["熟悉 Excel 或表格工具", "对消费电子或家居类目感兴趣", "能阅读英文资料"],
    postedAt: "2026-06-06",
    deadline: "2026-07-10",
  },
  {
    id: "job-shopify-content-003",
    title: "Shopify 独立站内容运营实习生",
    company: "安克创新华中人才基地",
    city: "远程/武汉",
    salary: "200-260/天",
    type: "实习",
    workMode: "remote",
    tags: ["名企项目", "英文优先", "作品集加分"],
    requirements: ["可独立撰写英文商品文案", "熟悉 Canva 或 Figma 基础操作", "有社媒内容经验优先"],
    postedAt: "2026-06-04",
    deadline: "2026-07-20",
  },
];

export const certifications: Certification[] = [
  {
    id: "cert-cbec-101",
    name: "跨境电商运营专员（初级）",
    level: "L1 入门",
    code: "CBEC-101",
    examDate: "2026-07-12",
    fee: 380,
    passRate: 86,
    modules: ["平台规则", "选品基础", "Listing 优化", "履约合规"],
  },
  {
    id: "cert-rcep-201",
    name: "RCEP 原产地证与合规实务",
    level: "L2 专项",
    code: "RCEP-201",
    examDate: "2026-08-16",
    fee: 480,
    passRate: 82,
    modules: ["原产地规则", "签证流程", "关税测算", "企业案例"],
  },
];

export const contests: Contest[] = [
  {
    id: "contest-internet-plus-2026",
    title: "第十届“互联网+”大学生跨境电商创新创业大赛",
    host: "丝路电商人才平台",
    status: "报名中",
    prizePool: 500000,
    signupDeadline: "2026-07-30",
    teamSize: "3-5 人",
    tracks: ["真实店铺运营", "楚品出海", "海外仓履约", "AI 选品"],
  },
  {
    id: "contest-campus-selection-2026",
    title: "校园选品达人争霸赛",
    host: "丝路电商人才平台 · 安克创新",
    status: "备赛中",
    prizePool: 80000,
    signupDeadline: "2026-06-30",
    teamSize: "1-3 人",
    tracks: ["消费电子", "家居生活", "宠物用品"],
  },
  {
    id: "contest-closed-demo-2025",
    title: "2025 跨境电商运营模拟挑战赛",
    host: "丝路电商人才平台",
    status: "已结束",
    prizePool: 50000,
    signupDeadline: "2025-12-20",
    teamSize: "1-3 人",
    tracks: ["模拟店铺运营", "Listing 优化"],
  },
];

export const news: NewsItem[] = [
  {
    id: "news-subsidy-2026-06",
    title: "武汉光谷自贸片区跨境电商人才培训补贴申报指南",
    tag: "补贴",
    date: "2026-06-01",
    hot: true,
    summary: "符合条件的学员完成指定课程和认证后，可申请最高 5000 元/人的培训补贴。",
  },
  {
    id: "news-job-fair-2026-06",
    title: "第三届“楚汉出海”跨境电商人才双选会将在汉举行",
    tag: "活动",
    date: "2026-06-05",
    hot: false,
    summary: "活动面向高校毕业生和转岗人才开放，现场提供运营、选品、履约等岗位。",
  },
  {
    id: "news-rcep-rule-2026",
    title: "RCEP 原产地证签发规则更新解读",
    tag: "认证",
    date: "2026-05-28",
    hot: false,
    summary: "平台联合专家拆解新规对出口企业合规申报和成本优化的影响。",
  },
];

function createId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function isRecent(createdAt: string) {
  return Date.now() - Date.parse(createdAt) <= submissionDedupWindowMs;
}

function findDuplicate<T extends SubmissionBase>(
  records: T[],
  input: { phone: string; idempotencyKey?: string },
  sameTarget: (record: T) => boolean,
) {
  return records.find((record) => {
    if (input.idempotencyKey && record.idempotencyKey === input.idempotencyKey) return true;
    return record.phone === input.phone && isRecent(record.createdAt) && sameTarget(record);
  });
}

export function createMockPlatformRepository(): PlatformRepository {
  const enrollments: Enrollment[] = [];
  const applications: JobApplication[] = [];
  const registrations: ContestRegistration[] = [];

  return {
    getStats: () => platformStats,
    listCourses: () => courses,
    getCourse: (id) => courses.find((course) => course.id === id),
    listJobs: () => jobs,
    getJob: (id) => jobs.find((job) => job.id === id),
    listCertifications: () => certifications,
    getCertification: (id) => certifications.find((certification) => certification.id === id),
    listContests: () => contests,
    getContest: (id) => contests.find((contest) => contest.id === id),
    listNews: () => news,
    saveEnrollment: (input) => {
      const duplicate = findDuplicate(
        enrollments,
        input,
        (record) => record.courseId === input.courseId,
      );
      if (duplicate) return { record: duplicate, duplicate: true };

      const record: Enrollment = { ...input, id: createId("enroll"), createdAt: nowIso() };
      enrollments.unshift(record);
      return { record, duplicate: false };
    },
    saveJobApplication: (input) => {
      const duplicate = findDuplicate(
        applications,
        input,
        (record) => record.jobId === input.jobId,
      );
      if (duplicate) return { record: duplicate, duplicate: true };

      const record: JobApplication = { ...input, id: createId("jobapp"), createdAt: nowIso() };
      applications.unshift(record);
      return { record, duplicate: false };
    },
    saveContestRegistration: (input) => {
      const duplicate = findDuplicate(
        registrations,
        input,
        (record) => record.contestId === input.contestId,
      );
      if (duplicate) return { record: duplicate, duplicate: true };

      const record: ContestRegistration = {
        ...input,
        id: createId("contestreg"),
        createdAt: nowIso(),
      };
      registrations.unshift(record);
      return { record, duplicate: false };
    },
    getSubmissionCounts: () => ({
      enrollments: enrollments.length,
      applications: applications.length,
      registrations: registrations.length,
    }),
    resetSubmissions: () => {
      enrollments.length = 0;
      applications.length = 0;
      registrations.length = 0;
    },
  };
}

// Mock repository boundary:
// The exported instance is an in-memory repository for prototype integration only.
// Replace `mockPlatformRepository` with a database-backed PlatformRepository implementation
// when persistence, transactions, audit trails, and cross-instance idempotency are required.
export const mockPlatformRepository = createMockPlatformRepository();
