import { useEffect, useRef, useState } from "react";
import {
  Search,
  Phone,
  MessageCircle,
  QrCode,
  Bell,
  X,
  ChevronRight,
  Flame,
  Clock,
  User,
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  ArrowRight,
  Home,
  BookOpen,
  Award,
  Newspaper,
  Info,
  Building2,
  Sparkles,
  PlayCircle,
  CheckCircle2,
  Star,
  TrendingUp,
  ShieldCheck,
  FileText,
  Users,
  Trophy,
  Download,
  BadgeCheck,
  Target,
  Layers,
  ArrowLeft,
  MonitorPlay,
  ClipboardList,
} from "lucide-react";

export type Tab = "home" | "academy" | "exam" | "contest" | "jobs" | "news" | "about";
export type Page =
  | "index"
  | "search"
  | "jobDetail"
  | "courseDetail"
  | "courseLearn"
  | "certificateDetail"
  | "contestDetail";

export const TABS: Tab[] = ["home", "academy", "exam", "contest", "jobs", "news", "about"];
export const PAGES: Page[] = [
  "index",
  "search",
  "jobDetail",
  "courseDetail",
  "courseLearn",
  "certificateDetail",
  "contestDetail",
];
export const pageHref = (tab: Tab, page: Page = "index", detail = "") => {
  const params = new URLSearchParams({ tab, page });
  const cleanDetail = detail.trim();
  if (page === "search" && cleanDetail) params.set("q", cleanDetail);
  if (page === "jobDetail" && cleanDetail) params.set("job", cleanDetail);
  return `/?${params.toString()}`;
};

function readPlatformSearch() {
  if (typeof window === "undefined")
    return { tab: "home" as Tab, page: "index" as Page, query: "", jobId: "" };
  const params = new URLSearchParams(window.location.search);
  const tabParam = params.get("tab") as Tab | null;
  const pageParam = params.get("page") as Page | null;
  const queryParam = params.get("q") || "";
  const jobParam = params.get("job") || "";

  return {
    tab: tabParam && TABS.includes(tabParam) ? tabParam : "home",
    page: pageParam && PAGES.includes(pageParam) ? pageParam : "index",
    query: queryParam.trim(),
    jobId: jobParam.trim(),
  };
}

function pushPlatformUrl(tab: Tab, page: Page, detail = "") {
  if (typeof window === "undefined") return;
  const nextUrl = pageHref(tab, page, detail);
  if (`${window.location.pathname}${window.location.search}` !== nextUrl) {
    window.history.pushState(null, "", nextUrl);
  }
}

function notifyPlatform(message: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("platform-notice", { detail: message }));
}

const NAV: { key: Tab; label: string; icon: typeof Home }[] = [
  { key: "home", label: "首页", icon: Home },
  { key: "academy", label: "跨境学院", icon: BookOpen },
  { key: "exam", label: "认证考试", icon: Award },
  { key: "contest", label: "比赛专区", icon: Trophy },
  { key: "jobs", label: "实习招聘", icon: Briefcase },
  { key: "news", label: "跨境资讯", icon: Newspaper },
  { key: "about", label: "关于", icon: Info },
];

type SearchResourceType = "课程" | "实习" | "比赛/项目" | "认证/证书" | "资讯";
type SearchFilter = "全部" | SearchResourceType;
type SearchableResource = {
  id: string;
  type: SearchResourceType;
  title: string;
  summary: string;
  source: string;
  tags: string[];
  tab: Tab;
  page: Page;
  icon: typeof Home;
  accent: string;
};
type SearchResult = {
  resource: SearchableResource;
  score: number;
  matchedTokens: string[];
};
type InternshipDetail = {
  id: string;
  role: string;
  company: string;
  pay: string;
  place: string;
  city: string;
  period: string;
  daysPerWeek: string;
  arrival: string;
  direction: string;
  tags: string[];
  responsibilities: string[];
  requirements: string[];
  support: string[];
};

const SEARCH_FILTERS: SearchFilter[] = ["全部", "课程", "实习", "比赛/项目", "认证/证书", "资讯"];
const SEARCH_RECOMMENDATIONS = ["TikTok 直播", "亚马逊运营", "RCEP 原产地", "海外仓", "数据分析"];
const featuredInternships: InternshipDetail[] = [
  {
    id: "tiktok-live-intern",
    role: "TikTok Shop 直播运营实习生",
    company: "武汉华天境外贸易有限公司",
    pay: "180-220/天",
    place: "武汉光谷",
    city: "武汉",
    period: "3-6 个月",
    daysPerWeek: "每周 4-5 天",
    arrival: "2 周内到岗",
    direction: "跨境直播运营",
    tags: ["可转正", "导师带教", "直播复盘", "东南亚市场"],
    responsibilities: [
      "协助 TikTok Shop 直播排期、商品脚本和直播间场控准备。",
      "记录直播数据，整理场观、停留、点击和成交复盘。",
      "跟进样品、达人素材和短视频引流内容，配合运营完成日常优化。",
    ],
    requirements: [
      "在校本科或研究生，跨境电商、英语、市场营销相关方向优先。",
      "对 TikTok、直播带货或短视频内容有兴趣，能稳定实习 3 个月以上。",
      "具备基础 Excel/表格整理能力，沟通主动，执行力强。",
    ],
    support: [
      "企业运营负责人 1 对 1 带教，每周一次复盘会。",
      "提供直播间真实项目记录，可沉淀为实习作品集。",
      "表现优秀可优先推荐转正或进入协会企业人才库。",
    ],
  },
  {
    id: "amazon-listing-intern",
    role: "亚马逊选品与 Listing 优化实习生",
    company: "极光跨境供应链湖北分部",
    pay: "150-200/天",
    place: "武汉汉阳",
    city: "武汉",
    period: "3 个月起",
    daysPerWeek: "每周 4 天以上",
    arrival: "一周内面试",
    direction: "亚马逊运营",
    tags: ["双休", "项目实战", "FBA", "Listing"],
    responsibilities: [
      "协助完成竞品调研、关键词整理和亚马逊 Listing 页面优化。",
      "跟进 FBA 库存、广告基础数据和周度运营报表。",
      "参与选品讨论，整理目标市场价格、评论和卖点信息。",
    ],
    requirements: [
      "英语读写基础较好，能阅读海外商品页面和用户评论。",
      "熟悉 Excel 或数据表格整理，对亚马逊平台运营有学习意愿。",
      "细心、有耐心，能够按模板输出调研和优化建议。",
    ],
    support: [
      "配套亚马逊运营入门课和企业实操模板。",
      "资深运营带教，完成一个真实 Listing 优化项目。",
      "可获得企业实习评价和平台学习记录。",
    ],
  },
  {
    id: "shopify-content-intern",
    role: "Shopify 独立站内容运营实习生",
    company: "安克创新华中人才基地",
    pay: "200-260/天",
    place: "远程/武汉",
    city: "武汉/远程",
    period: "2-4 个月",
    daysPerWeek: "每周 3-5 天",
    arrival: "滚动入组",
    direction: "独立站内容与品牌营销",
    tags: ["名企项目", "英文优先", "远程协作", "作品集"],
    responsibilities: [
      "协助 Shopify 独立站商品页、博客和邮件营销内容整理。",
      "参与海外用户调研，输出卖点、FAQ 和内容优化建议。",
      "配合设计与投放同学完成素材归档和活动页面检查。",
    ],
    requirements: [
      "英语阅读和基础写作能力较好，关注海外消费品或 DTC 品牌。",
      "有内容运营、公众号、小红书、短视频脚本或网站编辑经验优先。",
      "能够远程协作，按节点提交内容和修改记录。",
    ],
    support: [
      "真实品牌项目参与机会，产出可展示的内容作品。",
      "提供独立站内容规范、SEO 基础和转化页检查清单。",
      "优秀学生可推荐至品牌营销或独立站运营岗位。",
    ],
  },
  {
    id: "platform-operation-intern",
    role: "跨境电商运营实习生",
    company: "武汉华天境外贸易有限公司",
    pay: "150-200/天",
    place: "武汉",
    city: "武汉",
    period: "3 个月",
    daysPerWeek: "每周 4 天",
    arrival: "两周内到岗",
    direction: "平台运营与 Listing 优化",
    tags: ["亚马逊", "Listing 优化", "可开实习证明", "优秀可转正"],
    responsibilities: [
      "协助运营同学维护商品 Listing、关键词和基础活动信息。",
      "整理亚马逊、TikTok Shop 等平台日常运营数据和竞品变化。",
      "配合完成商品上新、价格检查和周度运营复盘。",
    ],
    requirements: [
      "跨境电商、英语、市场营销相关专业优先，愿意从运营基础做起。",
      "具备基础表格整理能力，对平台规则和商品运营有学习兴趣。",
      "每周可稳定实习 4 天，沟通主动，执行反馈及时。",
    ],
    support: [
      "运营主管带教，提供标准化 Listing 与运营日报模板。",
      "可开具实习证明，表现优秀进入企业转正评估。",
      "可同步学习平台运营课程，补齐岗位基础能力。",
    ],
  },
  {
    id: "tiktok-content-intern",
    role: "TikTok Shop 内容运营实习生",
    company: "湖北安克创新科技",
    pay: "180-220/天",
    place: "武汉",
    city: "武汉",
    period: "2 个月",
    daysPerWeek: "每周 3-5 天",
    arrival: "两周内到岗",
    direction: "短视频内容与达人运营",
    tags: ["短视频脚本", "达人对接", "接受大三/研一", "作品集加分"],
    responsibilities: [
      "协助拆解 TikTok 爆款短视频脚本，整理内容选题和素材清单。",
      "跟进达人沟通、样品寄送和内容发布反馈。",
      "配合直播团队沉淀短视频引流素材和内容复盘。",
    ],
    requirements: [
      "熟悉短视频平台内容形式，有脚本、剪辑、社媒运营经验优先。",
      "英语阅读基础良好，能理解海外用户评论和达人内容风格。",
      "愿意快速试错，能按节点提交脚本和素材整理结果。",
    ],
    support: [
      "达人运营带教，提供内容脚本模板和达人沟通话术。",
      "优秀内容可进入企业素材库，作为作品集案例。",
      "可衔接 TikTok 直播与内容运营方向岗位推荐。",
    ],
  },
  {
    id: "data-selection-intern",
    role: "跨境选品与数据分析实习生",
    company: "武汉象豹跨境电商",
    pay: "120-180/天",
    place: "武汉/可远程",
    city: "武汉/远程",
    period: "3 个月",
    daysPerWeek: "每周 3 天",
    arrival: "两周内到岗",
    direction: "选品与数据分析",
    tags: ["Excel/BI", "竞品调研", "可远程 2 天", "课程学员优先"],
    responsibilities: [
      "协助整理平台热销品、竞品价格、评论关键词和利润测算表。",
      "跟进选品数据看板，输出周度机会品类和风险提示。",
      "参与商品上新前的市场调研，沉淀选品报告和复盘记录。",
    ],
    requirements: [
      "熟悉 Excel 或 BI 工具基础操作，对数据整理和跨境选品有兴趣。",
      "能够阅读英文商品页面，具备基础信息检索和归纳能力。",
      "每周可稳定投入 3 天以上，按模板提交分析结论。",
    ],
    support: [
      "提供选品模型、利润测算模板和竞品调研清单。",
      "选品经理带教，完成至少一份可展示的选品分析报告。",
      "优秀报告可推荐进入平台选品项目库。",
    ],
  },
  {
    id: "live-assistant-intern",
    role: "海外直播助播实习生",
    company: "黄石云途出海 MCN",
    pay: "160/天 + 场次奖励",
    place: "黄石/排班制",
    city: "黄石",
    period: "1 个月",
    daysPerWeek: "排班制",
    arrival: "本周可面试",
    direction: "跨境直播助播",
    tags: ["英语口语优先", "镜头训练", "晚间场次", "可提供住宿"],
    responsibilities: [
      "协助主播完成直播前商品检查、脚本提示和场控配合。",
      "记录直播间互动问题、转化节点和用户反馈。",
      "配合剪辑同学整理直播切片和短视频二创素材。",
    ],
    requirements: [
      "愿意出镜或配合镜头训练，英语口语基础较好优先。",
      "能接受晚间或周末排班，有直播、主持或社群经验优先。",
      "执行细致，能快速响应直播间临时需求。",
    ],
    support: [
      "提供直播话术训练、镜头表达训练和复盘指导。",
      "表现优秀可获得 MCN 项目推荐和直播作品证明。",
      "外地学生可协助对接住宿和排班安排。",
    ],
  },
  {
    id: "payment-risk-intern",
    role: "跨境支付风控实习生",
    company: "PingPong 武汉分公司",
    pay: "180/天",
    place: "武汉",
    city: "武汉",
    period: "6 个月",
    daysPerWeek: "每周 4 天",
    arrival: "两周内到岗",
    direction: "支付风控与合规",
    tags: ["金融/法学优先", "英文资料阅读", "实习证明", "留用面试"],
    responsibilities: [
      "协助整理跨境收款、账户审核和交易异常案例材料。",
      "跟进基础风控规则标注，完成英文资料阅读和信息归档。",
      "配合合规团队输出商户资料核验和问题清单。",
    ],
    requirements: [
      "金融、法学、国际贸易或英语相关专业优先。",
      "具备较强的信息敏感度和文档整理能力，能处理英文材料。",
      "可稳定实习 6 个月，每周至少 4 天到岗。",
    ],
    support: [
      "合规专员带教，熟悉跨境支付基础风控流程。",
      "提供实习证明和留用面试机会。",
      "可参与真实案例复盘，积累合规方向项目经历。",
    ],
  },
  {
    id: "warehouse-logistics-intern",
    role: "海外仓物流运营实习生",
    company: "宜昌丝路云仓物流",
    pay: "130-170/天",
    place: "宜昌",
    city: "宜昌",
    period: "3 个月",
    daysPerWeek: "每周 5 天",
    arrival: "两周内到岗",
    direction: "海外仓履约与物流",
    tags: ["WMS 系统", "现场实训", "接受专科", "包工作餐"],
    responsibilities: [
      "协助跟进入库、出库、盘点和异常件处理流程。",
      "整理 WMS 系统数据，记录尾程物流时效和异常原因。",
      "配合仓配主管完成日常运营报表和现场流程检查。",
    ],
    requirements: [
      "物流管理、供应链、跨境电商相关专业优先，专科可投递。",
      "能适应仓储现场工作节奏，具备基础表格记录能力。",
      "责任心强，愿意从履约一线理解跨境供应链。",
    ],
    support: [
      "仓配主管现场带教，完整学习海外仓履约流程。",
      "提供工作餐和实训记录，可开具实习证明。",
      "优秀学生可推荐至仓配运营或供应链助理岗位。",
    ],
  },
];
const searchableResources: SearchableResource[] = [
  {
    id: "course-tiktok-live-basic",
    type: "课程",
    title: "TikTok Shop 直播运营实战课",
    summary: "从账号定位、直播脚本、场控节奏到复盘数据，适合想进入 TikTok 直播方向的学生。",
    source: "跨境学院 · 直播运营方向",
    tags: ["TikTok 直播", "直播运营", "短视频", "选品", "在校生"],
    tab: "academy",
    page: "courseDetail",
    icon: BookOpen,
    accent: "text-blue-600 bg-blue-50",
  },
  {
    id: "course-tiktok-content",
    type: "课程",
    title: "短视频内容策划与 TikTok 达人合作",
    summary: "学习短视频选题、达人邀约、脚本拆解和投放协同，衔接直播间转化。",
    source: "跨境学院 · 内容营销方向",
    tags: ["TikTok", "短视频", "达人合作", "内容策划", "直播转化"],
    tab: "academy",
    page: "courseDetail",
    icon: BookOpen,
    accent: "text-blue-600 bg-blue-50",
  },
  {
    id: "course-live-data",
    type: "课程",
    title: "直播间数据分析与运营看板",
    summary: "用场观、停留、点击、转化等指标判断直播效果，形成可复盘的运营看板。",
    source: "跨境学院 · 数据分析方向",
    tags: ["直播", "数据分析", "运营看板", "TikTok Shop", "Excel"],
    tab: "academy",
    page: "courseDetail",
    icon: BookOpen,
    accent: "text-blue-600 bg-blue-50",
  },
  {
    id: "course-amazon-listing",
    type: "课程",
    title: "亚马逊 FBA 选品与 Listing 优化进阶",
    summary: "围绕选品、关键词、Listing 页面和广告基础，建立亚马逊运营入门路径。",
    source: "跨境学院 · 亚马逊运营方向",
    tags: ["亚马逊运营", "Amazon", "FBA", "Listing", "选品"],
    tab: "academy",
    page: "courseDetail",
    icon: BookOpen,
    accent: "text-blue-600 bg-blue-50",
  },
  {
    id: "course-rcep-origin",
    type: "课程",
    title: "RCEP 原产地证与跨境合规实务",
    summary: "理解原产地规则、出口单证、关税优惠和企业合规流程。",
    source: "跨境学院 · 合规方向",
    tags: ["RCEP 原产地", "合规", "关税", "单证", "出口"],
    tab: "academy",
    page: "courseDetail",
    icon: BookOpen,
    accent: "text-blue-600 bg-blue-50",
  },
  {
    id: "course-overseas-warehouse",
    type: "课程",
    title: "海外仓选址、库存周转与履约管理",
    summary: "了解海外仓备货、库存周转、尾程配送和异常处理的核心流程。",
    source: "跨境学院 · 供应链方向",
    tags: ["海外仓", "物流", "履约", "库存", "供应链"],
    tab: "academy",
    page: "courseDetail",
    icon: BookOpen,
    accent: "text-blue-600 bg-blue-50",
  },
  {
    id: "job-tiktok-live",
    type: "实习",
    title: "TikTok Shop 直播运营实习生",
    summary: "参与直播排期、脚本准备、样品协调和直播复盘，导师带教，适合在校生。",
    source: "武汉华天境外贸易有限公司 · 武汉光谷",
    tags: ["TikTok 直播", "直播运营", "实习机会", "可转正", "武汉"],
    tab: "jobs",
    page: "index",
    icon: Briefcase,
    accent: "text-orange-600 bg-orange-50",
  },
  {
    id: "job-live-assistant",
    type: "实习",
    title: "跨境直播场控与内容助理",
    summary: "协助直播间商品讲解节奏、评论互动、数据记录和短视频素材归档。",
    source: "湖北丝路直播基地 · 武汉洪山",
    tags: ["直播", "TikTok", "内容助理", "场控", "实践机会"],
    tab: "jobs",
    page: "index",
    icon: Briefcase,
    accent: "text-orange-600 bg-orange-50",
  },
  {
    id: "job-amazon-listing",
    type: "实习",
    title: "亚马逊选品与 Listing 优化实习生",
    summary: "参与竞品调研、关键词整理、Listing 文案优化和运营周报。",
    source: "极光跨境供应链湖北分部 · 武汉汉阳",
    tags: ["亚马逊运营", "Listing", "FBA", "选品", "实习机会"],
    tab: "jobs",
    page: "index",
    icon: Briefcase,
    accent: "text-orange-600 bg-orange-50",
  },
  {
    id: "job-warehouse",
    type: "实习",
    title: "海外仓物流运营实习生",
    summary: "跟进入库、出库、异常件和尾程物流数据，适合供应链方向学生。",
    source: "安克创新华中人才基地 · 远程/武汉",
    tags: ["海外仓", "物流", "履约", "供应链", "实习"],
    tab: "jobs",
    page: "index",
    icon: Briefcase,
    accent: "text-orange-600 bg-orange-50",
  },
  {
    id: "contest-tiktok-campus",
    type: "比赛/项目",
    title: "TikTok Shop 校园直播带货精英赛",
    summary: "围绕真实商品完成直播策划、短视频引流和成交复盘，沉淀作品集。",
    source: "比赛专区 · 校园实战项目",
    tags: ["TikTok 直播", "比赛", "校园项目", "短视频", "直播带货"],
    tab: "contest",
    page: "contestDetail",
    icon: Trophy,
    accent: "text-amber-600 bg-amber-50",
  },
  {
    id: "contest-data",
    type: "比赛/项目",
    title: "跨境电商数据分析挑战赛",
    summary: "基于平台运营数据完成选品判断、流量诊断和增长建议。",
    source: "比赛专区 · 数据实践",
    tags: ["数据分析", "运营看板", "选品", "比赛", "项目"],
    tab: "contest",
    page: "contestDetail",
    icon: Trophy,
    accent: "text-amber-600 bg-amber-50",
  },
  {
    id: "cert-operation",
    type: "认证/证书",
    title: "跨境电商运营能力认证",
    summary: "覆盖平台规则、商品运营、直播基础、数据复盘和合规意识。",
    source: "认证考试 · 能力证书",
    tags: ["认证", "证书", "跨境电商运营", "TikTok", "亚马逊运营"],
    tab: "exam",
    page: "certificateDetail",
    icon: BadgeCheck,
    accent: "text-emerald-600 bg-emerald-50",
  },
  {
    id: "cert-rcep",
    type: "认证/证书",
    title: "RCEP 原产地证专项认证",
    summary: "面向外贸单证、关务合规和出口企业服务岗位的专项能力证明。",
    source: "认证考试 · 合规方向",
    tags: ["RCEP 原产地", "证书", "合规", "关税", "单证"],
    tab: "exam",
    page: "certificateDetail",
    icon: BadgeCheck,
    accent: "text-emerald-600 bg-emerald-50",
  },
  {
    id: "news-tiktok-policy",
    type: "资讯",
    title: "TikTok Shop 美区半托管模式上线，湖北卖家如何抢占红利？",
    summary: "梳理半托管模式对直播、选品、履约和实习岗位需求的影响。",
    source: "跨境资讯 · 行业",
    tags: ["TikTok Shop", "直播", "半托管", "海外仓", "岗位趋势"],
    tab: "news",
    page: "index",
    icon: Newspaper,
    accent: "text-purple-600 bg-purple-50",
  },
  {
    id: "news-live-recruit",
    type: "资讯",
    title: "武汉跨境直播岗位升温，企业更看重脚本和数据复盘能力",
    summary: "来自协会企业走访的一线观察，帮助学生理解直播运营岗位能力。",
    source: "跨境资讯 · 招聘观察",
    tags: ["跨境直播", "TikTok 直播", "实习机会", "数据复盘", "武汉"],
    tab: "news",
    page: "index",
    icon: Newspaper,
    accent: "text-purple-600 bg-purple-50",
  },
  {
    id: "news-rcep",
    type: "资讯",
    title: "RCEP 原产地证签发新规解读，企业出口成本可降 8%-15%",
    summary: "结合湖北企业案例说明原产地规则、单证流程和人才需求变化。",
    source: "跨境资讯 · 政策",
    tags: ["RCEP 原产地", "合规", "关税", "出口", "政策"],
    tab: "news",
    page: "index",
    icon: Newspaper,
    accent: "text-purple-600 bg-purple-50",
  },
];

function normalizeSearchText(value: string) {
  return value.trim().toLowerCase();
}

function tokenizeSearchQuery(query: string) {
  return normalizeSearchText(query).split(/\s+/).filter(Boolean);
}

function resourceSearchText(resource: SearchableResource) {
  return normalizeSearchText(
    [resource.title, resource.summary, resource.source, ...resource.tags].join(" "),
  );
}

function searchPlatformResources(query: string) {
  const fullQuery = normalizeSearchText(query);
  const tokens = tokenizeSearchQuery(query);
  if (!fullQuery || tokens.length === 0) return [];

  return searchableResources
    .map((resource, index) => {
      const searchText = resourceSearchText(resource);
      const matchedTokens = tokens.filter((token) => searchText.includes(token));
      const fullMatch = searchText.includes(fullQuery);
      if (!fullMatch && matchedTokens.length === 0) return null;

      return {
        resource,
        score: (fullMatch ? 100 : 0) + matchedTokens.length * 10 - index / 100,
        matchedTokens: fullMatch ? [query.trim(), ...matchedTokens] : matchedTokens,
      };
    })
    .filter((result): result is SearchResult => Boolean(result))
    .sort((left, right) => right.score - left.score);
}

function SearchResultsView({
  initialQuery,
  onSearch,
  onOpenPage,
  onBack,
}: {
  initialQuery: string;
  onSearch: (query: string) => void;
  onOpenPage: (page: Page, tab?: Tab) => void;
  onBack: () => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [query, setQuery] = useState(initialQuery);
  const [activeFilter, setActiveFilter] = useState<SearchFilter>("全部");
  const [hint, setHint] = useState("");

  useEffect(() => {
    setQuery(initialQuery);
    setActiveFilter("全部");
    setHint("");
  }, [initialQuery]);

  const cleanQuery = query.trim();
  const allResults = searchPlatformResources(cleanQuery);
  const filteredResults =
    activeFilter === "全部"
      ? allResults
      : allResults.filter(({ resource }) => resource.type === activeFilter);
  const counts = SEARCH_FILTERS.reduce(
    (next, filter) => ({
      ...next,
      [filter]:
        filter === "全部"
          ? allResults.length
          : allResults.filter(({ resource }) => resource.type === filter).length,
    }),
    {} as Record<SearchFilter, number>,
  );

  const submitSearch = (nextQuery = query) => {
    const value = nextQuery.trim();
    if (!value) {
      setHint("请输入一个想搜索的方向或关键词。");
      inputRef.current?.focus();
      return;
    }

    setHint("");
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm shadow-blue-500/5">
        <button
          type="button"
          onClick={onBack}
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-blue-600"
        >
          <ArrowLeft className="w-4 h-4" />
          返回首页
        </button>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-blue-600">全站资源搜索</p>
            <h1 className="mt-1 text-2xl font-bold text-slate-800 break-words">
              {cleanQuery ? `“${cleanQuery}”的搜索结果` : "搜索平台课程、实习与项目资源"}
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              结果来自课程、实习机会、比赛项目、认证证书和行业资讯，优先展示完整关键词命中的内容。
            </p>
          </div>
          <form
            className="flex min-w-0 overflow-hidden rounded-full border-2 border-blue-500 bg-white shadow-lg shadow-blue-500/15 lg:w-[520px]"
            onSubmit={(event) => {
              event.preventDefault();
              submitSearch();
            }}
          >
            <div className="flex items-center pl-4 pr-2 text-blue-600">
              <Search className="w-4 h-4" />
            </div>
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="输入关键词，如 TikTok 直播、海外仓、亚马逊运营"
              className="min-w-0 flex-1 px-2 text-sm outline-none"
            />
            <button
              type="submit"
              className="shrink-0 bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              搜索
            </button>
          </form>
        </div>
        {hint && <p className="mt-3 text-xs text-orange-500">{hint}</p>}
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="py-1 text-slate-400">推荐：</span>
          {SEARCH_RECOMMENDATIONS.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => submitSearch(term)}
              className="rounded-full bg-blue-50 px-3 py-1 font-medium text-blue-600 transition hover:bg-blue-100"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {cleanQuery ? (
        <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm shadow-blue-500/5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                共找到 {allResults.length} 条相关资源
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                空格关键词按任一词命中纳入结果，完整关键词命中的内容会排在更前面。
              </p>
            </div>
            <div className="flex max-w-full gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {SEARCH_FILTERS.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    activeFilter === filter
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "bg-slate-50 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  {filter} {counts[filter]}
                </button>
              ))}
            </div>
          </div>

          {filteredResults.length > 0 ? (
            <div className="mt-5 space-y-3">
              {filteredResults.map(({ resource, matchedTokens }) => {
                const Icon = resource.icon;
                const uniqueMatches = Array.from(
                  new Set(matchedTokens.map((token) => token.trim()).filter(Boolean)),
                );
                return (
                  <a
                    key={resource.id}
                    href={pageHref(resource.tab, resource.page)}
                    onClick={() => onOpenPage(resource.page, resource.tab)}
                    className="block min-w-0 rounded-xl border border-slate-100 bg-gradient-to-br from-white to-blue-50/30 p-4 transition hover:border-blue-200 hover:shadow-md"
                  >
                    <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div className="min-w-0">
                        <div
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${resource.accent}`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          {resource.type}
                        </div>
                        <h3 className="mt-3 text-base font-bold leading-snug text-slate-800 break-words">
                          {resource.title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-slate-500 break-words">
                          {resource.summary}
                        </p>
                        <p className="mt-2 text-xs text-slate-400 break-words">{resource.source}</p>
                      </div>
                      <div className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-blue-600">
                        查看入口 <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {resource.tags.slice(0, 5).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-white px-2.5 py-1 text-xs text-slate-500"
                        >
                          {tag}
                        </span>
                      ))}
                      {uniqueMatches.slice(0, 3).map((token) => (
                        <span
                          key={token}
                          className="rounded-full bg-orange-50 px-2.5 py-1 text-xs text-orange-600"
                        >
                          命中：{token}
                        </span>
                      ))}
                    </div>
                  </a>
                );
              })}
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-dashed border-blue-200 bg-blue-50/40 p-8 text-center">
              <Search className="mx-auto h-9 w-9 text-blue-400" />
              <h3 className="mt-3 text-lg font-bold text-slate-800">暂时没有找到匹配资源</h3>
              <p className="mt-2 text-sm text-slate-500">
                可以换一个更宽泛的方向，或从下面的推荐关键词开始探索。
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {SEARCH_RECOMMENDATIONS.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => submitSearch(term)}
                    className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-blue-600 shadow-sm transition hover:bg-blue-50"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-blue-200 bg-white p-8 text-center">
          <Search className="mx-auto h-9 w-9 text-blue-400" />
          <h2 className="mt-3 text-lg font-bold text-slate-800">输入关键词后查看全站资源</h2>
          <p className="mt-2 text-sm text-slate-500">
            例如 TikTok 直播、海外仓、亚马逊运营、RCEP 原产地或数据分析。
          </p>
        </div>
      )}
    </div>
  );
}

function JobDetailView({ jobId, onBack }: { jobId: string; onBack: () => void }) {
  const job = featuredInternships.find((item) => item.id === jobId) || featuredInternships[0];

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-blue-600"
      >
        <ArrowLeft className="w-4 h-4" />
        返回实习列表
      </button>

      <section className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm shadow-blue-500/5">
        <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 p-6 text-white md:p-8">
          <div className="flex min-w-0 flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
                <Briefcase className="w-3.5 h-3.5" />
                {job.direction}
              </div>
              <h1 className="mt-4 text-3xl font-bold leading-tight break-words">{job.role}</h1>
              <p className="mt-2 text-sm text-blue-50/90 break-words">{job.company}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {job.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-white/15 px-3 py-1 text-xs text-white">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={() => notifyPlatform("已记录申请意向，下一阶段接入正式投递接口")}
              className="shrink-0 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition hover:bg-orange-600"
            >
              申请实习
            </button>
          </div>
        </div>

        <div className="grid gap-4 border-b border-blue-50 p-5 md:grid-cols-2 lg:grid-cols-5">
          {[
            { label: "城市/地点", value: job.place, icon: MapPin },
            { label: "实习补贴", value: job.pay, icon: Award },
            { label: "实习周期", value: job.period, icon: Calendar },
            { label: "每周天数", value: job.daysPerWeek, icon: Clock },
            { label: "到岗安排", value: job.arrival, icon: CheckCircle2 },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="min-w-0 rounded-xl bg-blue-50/50 p-4">
              <Icon className="h-4 w-4 text-blue-600" />
              <div className="mt-2 text-xs text-slate-500">{label}</div>
              <div className="mt-1 font-semibold text-slate-800 break-words">{value}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 p-5 md:p-8 lg:grid-cols-3">
          {[
            { title: "岗位职责", items: job.responsibilities, icon: ClipboardList },
            { title: "任职要求", items: job.requirements, icon: Target },
            { title: "带教/保障", items: job.support, icon: ShieldCheck },
          ].map(({ title, items, icon: Icon }) => (
            <div key={title} className="min-w-0 rounded-2xl border border-blue-50 bg-white p-5">
              <h2 className="flex items-center gap-2 font-bold text-slate-800">
                <Icon className="h-5 w-5 text-blue-600" />
                {title}
              </h2>
              <ul className="mt-4 space-y-3">
                {items.map((item) => (
                  <li key={item} className="flex gap-2 text-sm leading-6 text-slate-600">
                    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-500" />
                    <span className="min-w-0 break-words">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function PlatformApp({
  initialTab,
  initialPage,
  initialQuery = "",
  initialJobId = "",
}: {
  initialTab: Tab;
  initialPage: Page;
  initialQuery?: string;
  initialJobId?: string;
}) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const [page, setPage] = useState<Page>(initialPage);
  const [searchTerm, setSearchTerm] = useState(
    () => initialQuery.trim() || readPlatformSearch().query,
  );
  const [activeJobId, setActiveJobId] = useState(
    () => initialJobId.trim() || readPlatformSearch().jobId,
  );
  const [banner, setBanner] = useState(true);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    setTab(initialTab);
    setPage(initialPage);
    setSearchTerm(initialQuery.trim());
    setActiveJobId(initialJobId.trim());
  }, [initialTab, initialPage, initialQuery, initialJobId]);

  useEffect(() => {
    const handler = () => {
      const next = readPlatformSearch();
      setTab(next.tab);
      setPage(next.page);
      setSearchTerm(next.query);
      setActiveJobId(next.jobId);
    };
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  useEffect(() => {
    const handler = (event: Event) => {
      setNotice((event as CustomEvent<string>).detail || "功能暂未开放");
      window.setTimeout(() => setNotice(""), 2400);
    };
    window.addEventListener("platform-notice", handler);
    return () => window.removeEventListener("platform-notice", handler);
  }, []);

  const goTab = (next: Tab) => {
    setTab(next);
    setPage("index");
    setSearchTerm("");
    setActiveJobId("");
    pushPlatformUrl(next, "index");
  };
  const openPage = (next: Page, nextTab = tab) => {
    setTab(nextTab);
    setPage(next);
    setSearchTerm("");
    setActiveJobId("");
    pushPlatformUrl(nextTab, next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const openSearch = (query: string) => {
    const cleanQuery = query.trim();
    if (!cleanQuery) return;
    setTab("home");
    setPage("search");
    setSearchTerm(cleanQuery);
    setActiveJobId("");
    pushPlatformUrl("home", "search", cleanQuery);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const openJobDetail = (jobId: string) => {
    setTab("jobs");
    setPage("jobDetail");
    setSearchTerm("");
    setActiveJobId(jobId);
    pushPlatformUrl("jobs", "jobDetail", jobId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const closePage = () => {
    setPage("index");
    setSearchTerm("");
    setActiveJobId("");
    pushPlatformUrl(tab, "index");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      {/* Top Nav */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 border-b border-blue-100 overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-3 md:px-6 min-h-16 flex items-center gap-3 md:gap-8 min-w-0">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 grid place-items-center text-white font-bold shadow-lg shadow-blue-500/30">
              丝
            </div>
            <div className="leading-tight">
              <div className="font-bold text-slate-800">丝路电商人才平台</div>
              <div className="text-[10px] text-blue-600 tracking-widest">SILKROAD EDU</div>
            </div>
          </div>
          <nav className="flex items-center gap-1 flex-1 min-w-0 overflow-x-auto overscroll-x-contain py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {NAV.map(({ key, label, icon: Icon }) => (
              <a
                key={key}
                href={pageHref(key)}
                onClick={() => goTab(key)}
                className={`relative shrink-0 px-3 md:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-1.5 whitespace-nowrap ${
                  tab === key
                    ? "text-blue-600 bg-blue-50"
                    : "text-slate-600 hover:text-blue-600 hover:bg-blue-50/50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
                {tab === key && (
                  <span className="absolute -bottom-[17px] left-1/2 -translate-x-1/2 w-8 h-0.5 bg-blue-600 rounded-full" />
                )}
              </a>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <a
              href={pageHref("news")}
              onClick={() => goTab("news")}
              className="text-slate-500 hover:text-blue-600 transition-colors"
            >
              <Bell className="w-5 h-5" />
            </a>
            <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 grid place-items-center text-white text-sm font-bold">
                F
              </div>
              <div className="text-sm">
                <div className="font-medium text-slate-800">fustin</div>
                <div className="text-[11px] text-slate-400">学员 · Lv.3</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sub banner */}
      {tab !== "home" && banner && (
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="max-w-[1280px] mx-auto px-6 h-11 flex items-center gap-3 text-sm">
            <Sparkles className="w-4 h-4" />
            <span>课程实训系统已开启 · 跨境电商虚拟仿真平台上线，立即开启沉浸式实操</span>
            <a
              href={pageHref("academy", "courseLearn")}
              onClick={() => openPage("courseLearn", "academy")}
              className="ml-auto px-3 py-1 bg-white text-blue-600 rounded-md text-xs font-semibold hover:bg-blue-50 transition"
            >
              去实训
            </a>
            <button
              onClick={() => setBanner(false)}
              className="hover:bg-white/20 rounded p-1 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Body */}
      <main className="max-w-[1280px] mx-auto px-6 py-8">
        <div key={`${tab}-${page}`} className="animate-fade-in-up">
          {page === "courseDetail" && (
            <CourseDetailView
              onBack={closePage}
              onLearn={() => openPage("courseLearn", "academy")}
            />
          )}
          {page === "courseLearn" && (
            <CourseLearningView onBack={() => openPage("courseDetail", "academy")} />
          )}
          {page === "certificateDetail" && <CertificateDetailView onBack={closePage} />}
          {page === "contestDetail" && <ContestDetailView onBack={closePage} />}
          {page === "jobDetail" && tab === "jobs" && (
            <JobDetailView jobId={activeJobId} onBack={() => openPage("index", "jobs")} />
          )}
          {page === "search" && tab === "home" && (
            <SearchResultsView
              initialQuery={searchTerm}
              onSearch={openSearch}
              onOpenPage={openPage}
              onBack={() => openPage("index", "home")}
            />
          )}
          {page === "index" && tab === "home" && (
            <HomeView onOpenPage={openPage} onSearch={openSearch} onOpenJob={openJobDetail} />
          )}
          {page === "index" && tab === "academy" && <AcademyView onOpenPage={openPage} />}
          {page === "index" && tab === "jobs" && <JobsView onOpenJob={openJobDetail} />}
          {page === "index" && tab === "news" && <NewsView />}
          {page === "index" && tab === "exam" && <ExamView onOpenPage={openPage} />}
          {page === "index" && tab === "contest" && <ContestView onOpenPage={openPage} />}
          {page === "index" && tab === "about" && <AboutView />}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-blue-100 mt-12 bg-white/60">
        <div className="max-w-[1280px] mx-auto px-6 py-8 text-center text-xs text-slate-500">
          © 2026 武汉市跨境电子商务协会 · 丝路电商人才平台 · 鄂ICP备2026001234号
        </div>
      </footer>

      {/* Floating toolbar */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-xl shadow-blue-500/10 border border-blue-100 p-2 flex flex-col gap-1">
        {[
          { icon: Phone, label: "电话咨询", color: "text-blue-600", href: "tel:027-88888888" },
          {
            icon: MessageCircle,
            label: "专家微信",
            color: "text-green-600",
            href: pageHref("about"),
          },
          { icon: QrCode, label: "小程序", color: "text-orange-500", href: pageHref("about") },
        ].map(({ icon: Icon, label, color, href }) => (
          <a
            key={label}
            href={href}
            className="group relative w-11 h-11 grid place-items-center rounded-xl hover:bg-blue-50 transition-all duration-300 hover:scale-110"
          >
            <Icon className={`w-5 h-5 ${color} group-hover:scale-110 transition`} />
            <span className="absolute right-full mr-3 px-3 py-1.5 bg-slate-800 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all -translate-x-2 group-hover:translate-x-0">
              {label}
            </span>
          </a>
        ))}
      </div>
      {notice && (
        <div className="fixed left-1/2 top-20 z-[60] -translate-x-1/2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-xl">
          {notice}
        </div>
      )}
    </div>
  );
}

/* ============ HOME ============ */
function HomeView({
  onOpenPage,
  onSearch,
  onOpenJob,
}: {
  onOpenPage: (page: Page, tab?: Tab) => void;
  onSearch: (query: string) => void;
  onOpenJob: (jobId: string) => void;
}) {
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchHint, setSearchHint] = useState("");
  const internships = [
    {
      role: "TikTok Shop 直播运营实习生",
      company: "武汉华天境外贸易有限公司",
      pay: "180-220/天",
      place: "武汉光谷",
      tags: ["可转正", "导师带教"],
    },
    {
      role: "亚马逊选品与 Listing 优化实习生",
      company: "极兔跨境供应链湖北分部",
      pay: "150-200/天",
      place: "武汉汉阳",
      tags: ["双休", "项目实战"],
    },
    {
      role: "Shopify 独立站内容运营实习生",
      company: "安克创新华中人才基地",
      pay: "200-260/天",
      place: "远程/武汉",
      tags: ["名企项目", "英文优先"],
    },
  ];

  const explorationTerms = ["TikTok 直播", "亚马逊运营", "RCEP 原产地", "海外仓", "数据分析"];

  const submitExploration = (keyword = searchQuery) => {
    const value = keyword.trim();
    if (!value) {
      setSearchHint("请输入一个想了解的方向，比如 TikTok 直播、海外仓、亚马逊运营。");
      searchInputRef.current?.focus();
      return;
    }

    setSearchHint("");
    setSearchQuery(value);
    onSearch(value);
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="rounded-2xl border border-blue-50 bg-white p-5 shadow-sm shadow-blue-500/5 md:p-7">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-2xl font-bold leading-tight text-slate-800 md:text-3xl">
            湖北跨境电商人才 · 学习与就业一站式平台
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            汇聚课程、实习、认证、赛事与行业资讯，帮助学生系统了解跨境电商方向
          </p>
        </div>

        <div className="mx-auto mt-5 max-w-3xl">
          <form
            className="flex min-w-0 flex-col gap-2 rounded-2xl border-2 border-blue-500 bg-white p-2 shadow-lg shadow-blue-500/15 sm:flex-row sm:items-center"
            onSubmit={(event) => {
              event.preventDefault();
              submitExploration();
            }}
          >
            <div className="flex min-w-0 flex-1 items-center gap-2 px-2">
              <Search className="h-4 w-4 shrink-0 text-blue-600" />
              <input
                ref={searchInputRef}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="输入想了解的方向，如 TikTok 直播、海外仓、亚马逊运营"
                className="min-w-0 flex-1 py-2 text-sm outline-none"
              />
            </div>
            <button
              type="submit"
              className="flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 sm:w-auto"
            >
              探索方向
            </button>
          </form>
          {searchHint && <p className="mt-2 text-center text-xs text-orange-500">{searchHint}</p>}
          <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs">
            <span className="py-1 text-slate-400">热门探索：</span>
            {explorationTerms.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => submitExploration(term)}
                className="rounded-full bg-slate-50 px-3 py-1 text-slate-500 ring-1 ring-blue-100 transition hover:bg-blue-50 hover:text-blue-600"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Association hero + stats */}
      <div className="grid grid-cols-12 gap-6">
        <aside className="order-2 col-span-12 bg-white rounded-2xl shadow-sm shadow-blue-500/5 p-5 border border-blue-50">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 text-orange-600 text-[11px] font-semibold">
                <Briefcase className="w-3.5 h-3.5" /> 名企直推
              </div>
              <h3 className="mt-2 text-lg font-bold text-slate-800">精选实习推荐</h3>
              <p className="mt-1 text-xs text-slate-500">
                适合跨境电商方向在校生，优先推荐给已学习/认证学员。
              </p>
            </div>
            <a
              href={pageHref("jobs")}
              onClick={() => onOpenPage("index", "jobs")}
              className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 whitespace-nowrap"
            >
              更多 <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {internships.map((job, index) => (
              <div
                key={job.role}
                className="rounded-xl border border-blue-50 bg-gradient-to-br from-white to-blue-50/40 p-3 hover:border-blue-200 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h4 className="font-semibold text-slate-800 text-sm leading-snug">
                      {job.role}
                    </h4>
                    <div className="mt-1 text-xs text-slate-500 truncate">{job.company}</div>
                  </div>
                  <span className="shrink-0 px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 text-[11px] font-semibold">
                    {job.pay}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-blue-500" /> {job.place}
                </div>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1.5">
                    {job.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-orange-50 text-orange-600 text-[11px] rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <a
                    href={pageHref("jobs", "jobDetail", featuredInternships[index].id)}
                    onClick={() => onOpenJob(featuredInternships[index].id)}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition whitespace-nowrap"
                  >
                    立即投递
                  </a>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 p-3 text-white">
            <div className="text-sm font-semibold">本周新增 48 个实习岗位</div>
            <div className="mt-1 text-xs text-white/80">
              运营、直播、选品、独立站、海外仓方向持续更新。
            </div>
          </div>
        </aside>

        <section className="order-1 col-span-12 space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 p-8 md:p-10 min-h-[340px] shadow-lg shadow-blue-500/20">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 70% 60%, white 1px, transparent 1px)",
                backgroundSize: "60px 60px, 80px 80px",
              }}
            />
            <div className="relative">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full mb-4">
                <Sparkles className="w-3 h-3" /> 官方认证
              </div>
              <h2 className="text-4xl font-bold text-white mb-2">武汉市跨境电子商务协会</h2>
              <p className="text-white/90 text-base mb-4">
                链接全球贸易 · 赋能荆楚企业 · 培育丝路人才
              </p>
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 text-white text-sm font-medium shadow-lg">
                共商 · 共建 · 共赢
              </div>
              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl">
                {[
                  { title: "人才培养", desc: "课程、实训、认证一体化", icon: GraduationCap },
                  { title: "企业服务", desc: "用工对接与岗位共建", icon: Building2 },
                  { title: "赛事孵化", desc: "以赛促学、获奖直通", icon: Trophy },
                  { title: "政策链接", desc: "补贴、合规、出海资源", icon: ShieldCheck },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-xl bg-white/15 backdrop-blur p-4 border border-white/20 text-white"
                  >
                    <item.icon className="w-5 h-5" />
                    <div className="mt-2 font-semibold text-sm">{item.title}</div>
                    <div className="mt-1 text-xs text-white/75">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { num: "12,800+", label: "在校学员", c: "from-blue-500 to-cyan-500" },
              { num: "320+", label: "合作名企", c: "from-orange-500 to-red-500" },
              { num: "98.6%", label: "结业就业率", c: "from-emerald-500 to-teal-500" },
              { num: "1,200+", label: "精品课程", c: "from-purple-500 to-indigo-500" },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-white rounded-xl p-5 border border-blue-50 shadow-sm"
              >
                <div
                  className={`text-3xl font-bold bg-gradient-to-r ${s.c} bg-clip-text text-transparent`}
                >
                  {s.num}
                </div>
                <div className="text-xs text-slate-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Offline training */}
      <div>
        <div className="flex items-end justify-between mb-4 px-1">
          <div>
            <h3 className="text-xl font-bold text-slate-800">线下培训 · 实操基地</h3>
            <p className="text-sm text-slate-500 mt-1">
              武汉光谷 · 武汉汉阳 · 武汉江岸 三大实训中心
            </p>
          </div>
          <a
            href={pageHref("academy", "courseDetail")}
            onClick={() => onOpenPage("courseDetail", "academy")}
            className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer flex items-center gap-1"
          >
            查看全部 <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            {
              title: '跨境电商 TikTok "0" 到 "1" 实战启航班',
              date: "2026-06-15 ~ 06-28",
              teacher: "陈志远 · 字节跳动前 TSP 顾问",
              place: "武汉光谷实训中心",
              tag: "热招",
            },
            {
              title: "亚马逊 FBA 选品与精品化运营进阶营",
              date: "2026-07-05 ~ 07-19",
              teacher: "刘晓楠 · 亚马逊 Top1000 卖家",
              place: "武汉汉阳实训中心",
              tag: "新开",
            },
          ].map((c) => (
            <div
              key={c.title}
              className="group bg-white rounded-2xl overflow-hidden border border-blue-50 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              <div className="h-40 bg-gradient-to-br from-blue-400 via-blue-500 to-cyan-500 relative overflow-hidden">
                <div
                  className="absolute inset-0 opacity-30 group-hover:scale-110 transition-transform duration-700"
                  style={{
                    backgroundImage:
                      "linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)",
                    backgroundSize: "200% 200%",
                  }}
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-orange-500 text-white text-xs font-semibold rounded-md flex items-center gap-1">
                  <Flame className="w-3 h-3" /> {c.tag}
                </div>
                <div className="absolute bottom-3 right-3 text-white/90 text-xs font-medium flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {c.place}
                </div>
              </div>
              <div className="p-5">
                <h4 className="font-semibold text-slate-800 group-hover:text-blue-600 transition">
                  {c.title}
                </h4>
                <div className="mt-3 space-y-1.5 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" />
                    开课时间：{c.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5" />
                    主讲：{c.teacher}
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    已报名 <b className="text-orange-500">128</b> 人 / 共 200 席
                  </span>
                  <a
                    href={pageHref("academy", "courseDetail")}
                    onClick={() => onOpenPage("courseDetail", "academy")}
                    className="px-4 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition font-medium"
                  >
                    查看详情
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 精品在线课程推荐 */}
      <div>
        <div className="flex items-end justify-between mb-4 px-1">
          <div>
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-blue-600" /> 精品在线课程推荐
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              1,200+ 名师课程 · 边学边练 · 学完即可参加官方认证考试
            </p>
          </div>
          <a
            href={pageHref("academy")}
            onClick={() => onOpenPage("index", "academy")}
            className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer flex items-center gap-1"
          >
            全部课程 <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              t: "TikTok Shop 美区小店从 0 到 1 实战",
              lv: "入门",
              price: "¥ 199",
              n: 8624,
              c: "from-pink-500 to-rose-500",
              lessons: 32,
            },
            {
              t: "亚马逊 FBA 精品化运营全流程精讲",
              lv: "进阶",
              price: "¥ 399",
              n: 6128,
              c: "from-orange-500 to-amber-500",
              lessons: 48,
            },
            {
              t: "Shopify 独立站 + Google Ads 实操",
              lv: "进阶",
              price: "¥ 459",
              n: 4287,
              c: "from-emerald-500 to-teal-500",
              lessons: 42,
            },
            {
              t: "跨境直播主播 · 镜头表现力训练营",
              lv: "入门",
              price: "¥ 129",
              n: 5326,
              c: "from-purple-500 to-indigo-500",
              lessons: 24,
            },
            {
              t: "RCEP 原产地证申领与关务合规精讲",
              lv: "认证",
              price: "¥ 299",
              n: 2186,
              c: "from-blue-500 to-cyan-500",
              lessons: 28,
            },
            {
              t: "海外仓与跨境供应链管理实务",
              lv: "高阶",
              price: "¥ 599",
              n: 1942,
              c: "from-slate-600 to-slate-800",
              lessons: 36,
            },
          ].map((j) => (
            <div
              key={j.t}
              className="group bg-white rounded-2xl overflow-hidden border border-blue-50 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all cursor-pointer"
            >
              <div className={`h-28 bg-gradient-to-br ${j.c} relative`}>
                <div className="absolute top-3 left-3 px-2 py-0.5 bg-white/95 text-slate-700 text-[11px] rounded font-semibold">
                  {j.lv}
                </div>
                <PlayCircle className="absolute right-3 bottom-3 w-9 h-9 text-white/90 group-hover:scale-110 transition" />
                <div className="absolute left-3 bottom-3 text-white/90 text-[11px]">
                  {j.lessons} 节 · 直播+录播
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-slate-800 text-sm group-hover:text-blue-600 transition line-clamp-2 min-h-[40px]">
                  {j.t}
                </h4>
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <span className="text-orange-500 font-bold">{j.price}</span>
                    <span className="text-[11px] text-slate-400 ml-2">
                      {j.n.toLocaleString()} 人学
                    </span>
                  </div>
                  <a
                    href={pageHref("academy", "courseDetail")}
                    onClick={() => onOpenPage("courseDetail", "academy")}
                    className="text-xs text-blue-600 hover:text-white hover:bg-blue-600 px-3 py-1 rounded-md transition font-medium"
                  >
                    立即学习
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 认证考试速通 */}
      <MentorSection onOpenPage={onOpenPage} />

      <div className="bg-white rounded-2xl p-6 border border-blue-50 shadow-sm">
        <div className="flex items-end justify-between mb-5">
          <div>
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <BadgeCheck className="w-5 h-5 text-orange-500" /> 职业能力等级认证 · 报考入口
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              商务部 · 中国电子商会联合认证 · 全国 23 个考点 · 通过率 78.6%
            </p>
          </div>
          <a
            href={pageHref("exam")}
            onClick={() => onOpenPage("index", "exam")}
            className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer flex items-center gap-1"
          >
            查看全部 <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              code: "CBEC-L1",
              n: "跨境电商运营专员",
              lv: "初级",
              color: "bg-emerald-500",
              price: "¥ 380",
              deadline: "07-12 截止",
            },
            {
              code: "CBEC-TK2",
              n: "TikTok 跨境直播运营师",
              lv: "中级",
              color: "bg-orange-500",
              price: "¥ 880",
              deadline: "08-03 截止",
            },
            {
              code: "CBEC-RCEP",
              n: "RCEP 国际贸易合规师",
              lv: "高级",
              color: "bg-blue-600",
              price: "¥ 1,680",
              deadline: "10-18 截止",
            },
            {
              code: "CBEC-WH3",
              n: "海外仓供应链管理师",
              lv: "高级",
              color: "bg-purple-600",
              price: "¥ 1,480",
              deadline: "12-13 截止",
            },
          ].map((e) => (
            <div
              key={e.code}
              className="group border border-blue-50 rounded-xl p-4 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/10 transition cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`px-2 py-0.5 ${e.color} text-white text-[10px] rounded font-semibold`}
                >
                  {e.lv}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">{e.code}</span>
              </div>
              <h4 className="mt-3 font-semibold text-slate-800 group-hover:text-blue-600 transition">
                {e.n}
              </h4>
              <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {e.deadline}
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-orange-500 font-bold">{e.price}</span>
                <a
                  href={pageHref("exam", "certificateDetail")}
                  onClick={() => onOpenPage("certificateDetail", "exam")}
                  className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white px-3 py-1 rounded-md transition font-medium"
                >
                  立即报名
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 大学生比赛专区 */}
      <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 rounded-2xl p-6 border border-orange-100">
        <div className="flex items-end justify-between mb-5">
          <div>
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-orange-500" /> 大学生跨境电商比赛
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              国家级 · 省级 · 行业级三大赛事 · 比赛获奖直通名企就业绿色通道
            </p>
          </div>
          <a
            href={pageHref("contest")}
            onClick={() => onOpenPage("index", "contest")}
            className="text-sm text-orange-600 hover:text-orange-700 cursor-pointer flex items-center gap-1 font-medium"
          >
            全部赛事 <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              lvl: "国家级",
              lvlColor: "bg-red-500",
              t: '第十届"互联网+"大学生跨境电商创新创业大赛',
              host: "教育部 · 中国电子商务协会",
              ddl: "2026-07-30",
              num: "12,860",
              prize: "¥ 50万",
            },
            {
              lvl: "省级",
              lvlColor: "bg-blue-600",
              t: "2026 湖北省大学生跨境电商技能大赛",
              host: "湖北省商务厅 · 湖北省教育厅",
              ddl: "2026-08-15",
              num: "3,628",
              prize: "¥ 20万",
            },
            {
              lvl: "行业级",
              lvlColor: "bg-orange-500",
              t: "TikTok Shop 校园直播带货精英赛",
              host: "TikTok Shop · 武汉跨境电商协会",
              ddl: "2026-09-10",
              num: "5,128",
              prize: "¥ 30万",
            },
          ].map((co) => (
            <div
              key={co.t}
              className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 ${co.lvlColor} text-white text-[10px] rounded font-semibold`}
                >
                  {co.lvl}
                </span>
                <span className="text-[11px] text-slate-400">报名中</span>
              </div>
              <h4 className="mt-3 font-semibold text-slate-800 leading-snug line-clamp-2 min-h-[44px]">
                {co.t}
              </h4>
              <div className="mt-3 space-y-1.5 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-3 h-3" />
                  主办：{co.host}
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3" />
                  报名截止：{co.ddl}
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-3 h-3" />
                  已报名：<b className="text-orange-500">{co.num}</b> 人 · 奖金池{" "}
                  <b className="text-orange-500">{co.prize}</b>
                </div>
              </div>
              <a
                href={pageHref("contest", "contestDetail")}
                onClick={() => onOpenPage("contestDetail", "contest")}
                className="mt-4 w-full block text-center py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm rounded-lg hover:from-orange-600 hover:to-amber-600 transition font-medium shadow-md shadow-orange-500/30"
              >
                立即报名参赛
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* 明星导师团 */}
      <div className="hidden">
        <div className="flex items-end justify-between mb-4 px-1">
          <div>
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Star className="w-5 h-5 text-orange-500" /> 明星导师团
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              来自字节、亚马逊、阿里国际站、Google 的资深专家亲授
            </p>
          </div>
          <a className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer flex items-center gap-1">
            全部师资 <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
        <div className="overflow-x-auto pb-3">
          <div className="flex gap-4 min-w-max">
            {[
              {
                n: "陈志远",
                t: "TikTok Shop 操盘专家",
                c: "from-blue-500 to-cyan-500",
                tag: "10年+ 跨境直播",
                st: 3286,
              },
              {
                n: "刘晓楠",
                t: "亚马逊 Top1000 卖家",
                c: "from-orange-500 to-red-500",
                tag: "FBA 精品化运营",
                st: 2654,
              },
              {
                n: "Vivian Wu",
                t: "TikTok 官方运营顾问",
                c: "from-purple-500 to-pink-500",
                tag: "海外社媒爆款",
                st: 4128,
              },
              {
                n: "张涛",
                t: "Google 大中华区 PA",
                c: "from-emerald-500 to-teal-500",
                tag: "独立站 SEO/SEM",
                st: 1986,
              },
              {
                n: "李华",
                t: "武汉海关关务专家",
                c: "from-indigo-500 to-blue-600",
                tag: "RCEP 合规实务",
                st: 1762,
              },
              {
                n: "黄浩",
                t: "海外仓供应链顾问",
                c: "from-slate-600 to-slate-800",
                tag: "履约与库存周转",
                st: 1488,
              },
            ].map((p) => (
              <div
                key={p.n}
                className="w-[230px] shrink-0 bg-white rounded-2xl p-5 border border-blue-50 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all text-center"
              >
                <div
                  className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${p.c} grid place-items-center text-white text-2xl font-bold ring-4 ring-blue-50`}
                >
                  {p.n.charAt(0)}
                </div>
                <div className="mt-3 font-semibold text-slate-800">{p.n}</div>
                <div className="text-xs text-slate-500 mt-0.5">{p.t}</div>
                <div className="mt-2 inline-block px-2 py-0.5 bg-blue-50 text-blue-600 text-[11px] rounded">
                  {p.tag}
                </div>
                <div className="mt-3 text-[11px] text-slate-400">
                  {p.st.toLocaleString()} 学员 · 4.9 ★
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 比赛获奖榜 + 政策资讯 */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-7 bg-white rounded-2xl p-6 border border-blue-50 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-orange-500" /> 大学生比赛获奖喜报
            </h3>
            <a
              href={pageHref("contest")}
              onClick={() => onOpenPage("index", "contest")}
              className="text-xs text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              更多榜单 →
            </a>
          </div>
          <div className="space-y-3">
            {[
              {
                n: "武汉大学 · 丝路战队",
                from: '第十届"互联网+"跨境电商赛',
                project: "楚茶出海东南亚 DTC 品牌孵化项目",
                to: "全国一等奖",
                prize: "¥ 80,000",
                c: "from-red-500 to-orange-500",
                rank: "🏆 冠军",
              },
              {
                n: "华中科技大学 · TK 出海队",
                from: "TikTok Shop 校园直播带货精英赛",
                project: "湖北非遗香氛 TikTok 直播矩阵运营",
                to: "全国二等奖",
                prize: "¥ 50,000",
                c: "from-pink-500 to-rose-500",
                rank: "🥈 亚军",
              },
              {
                n: "湖北经济学院 · 跨境精英社",
                from: "湖北省大学生跨境电商技能大赛",
                project: "武汉智能小家电亚马逊精品化运营",
                to: "省级特等奖",
                prize: "¥ 30,000",
                c: "from-blue-500 to-cyan-500",
                rank: "🥇 特等",
              },
              {
                n: "武汉商学院 · 出海少年",
                from: "亚马逊全球开店校园模拟挑战赛",
                project: "江汉平价美妆跨境选品与 Listing 优化",
                to: "华中赛区一等奖",
                prize: "¥ 20,000",
                c: "from-emerald-500 to-teal-500",
                rank: "🥉 一等",
              },
            ].map((s) => (
              <div
                key={s.n}
                className="flex items-center gap-4 p-3 bg-gradient-to-r from-orange-50/50 to-transparent rounded-xl hover:from-orange-50 transition group"
              >
                <div
                  className={`w-11 h-11 rounded-full bg-gradient-to-br ${s.c} grid place-items-center text-white font-semibold flex-shrink-0 text-xs`}
                >
                  {s.rank.slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-slate-800">
                    <b>{s.n}</b> <span className="text-slate-400">荣获</span>{" "}
                    <span className="text-orange-600 font-medium">{s.to}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                    <Trophy className="w-3 h-3 text-orange-500" /> 赛事：{s.from}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                    <FileText className="w-3 h-3 text-blue-500" /> 获奖项目：{s.project}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-orange-500 font-bold text-sm">{s.prize}</div>
                  <div className="text-[10px] text-slate-400">奖金已发放</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-5 bg-white rounded-2xl p-6 border border-blue-50 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-blue-600" /> 政策与行业资讯
            </h3>
            <a
              href={pageHref("news")}
              onClick={() => onOpenPage("index", "news")}
              className="text-xs text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              全部 →
            </a>
          </div>
          <div className="space-y-3">
            {[
              {
                tag: "政策",
                title: "湖北省商务厅发布《2026 跨境电商高质量发展三年行动方案》",
                date: "06-02",
                hot: true,
              },
              {
                tag: "补贴",
                title: "武汉光谷自贸片区跨境电商人才培训补贴申报指南（最高 5000 元/人）",
                date: "05-28",
                hot: true,
              },
              {
                tag: "活动",
                title: '第三届"楚汉出海"跨境电商人才双选会本月 18 日在汉举行',
                date: "05-25",
                hot: false,
              },
              {
                tag: "行业",
                title: "TikTok Shop 美区半托管模式上线，湖北卖家如何抢占红利？",
                date: "05-22",
                hot: false,
              },
              {
                tag: "认证",
                title: "RCEP 原产地证签发新规解读，企业出口成本可降 8%-15%",
                date: "05-19",
                hot: false,
              },
            ].map((n) => (
              <div key={n.title} className="flex items-start gap-3 group cursor-pointer">
                <span
                  className={`mt-0.5 px-1.5 py-0.5 text-[10px] rounded font-medium flex-shrink-0 ${
                    n.tag === "政策"
                      ? "bg-blue-100 text-blue-600"
                      : n.tag === "补贴"
                        ? "bg-orange-100 text-orange-600"
                        : n.tag === "活动"
                          ? "bg-emerald-100 text-emerald-600"
                          : n.tag === "认证"
                            ? "bg-purple-100 text-purple-600"
                            : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {n.tag}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-slate-700 group-hover:text-blue-600 transition line-clamp-2">
                    {n.title}
                    {n.hot && <Flame className="inline w-3 h-3 text-orange-500 ml-1" />}
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 flex-shrink-0">{n.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 平台服务能力 */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 rounded-2xl p-8 shadow-lg shadow-blue-500/20 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 30% 40%, white 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative">
          <h3 className="text-2xl font-bold text-white text-center">一站式跨境电商人才培养闭环</h3>
          <p className="text-white/80 text-center text-sm mt-2">
            培训 · 认证 · 实训 · 就业 · 创业 · 出海，五位一体服务体系
          </p>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { i: BookOpen, t: "在线培训", d: "1,200+ 精品课" },
              { i: BadgeCheck, t: "职业认证", d: "23 个考点" },
              { i: Target, t: "实训基地", d: "三大实训中心" },
              { i: Briefcase, t: "就业服务", d: "98.6% 就业率" },
              { i: Layers, t: "企业内训", d: "186 家服务" },
            ].map((s) => (
              <div
                key={s.t}
                className="bg-white/15 backdrop-blur rounded-xl p-4 text-center hover:bg-white/25 transition cursor-pointer"
              >
                <s.i className="w-7 h-7 text-white mx-auto" />
                <div className="mt-2 text-white font-semibold text-sm">{s.t}</div>
                <div className="text-white/70 text-[11px] mt-0.5">{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 合作伙伴 */}
      <div className="bg-white rounded-2xl p-6 border border-blue-50 shadow-sm">
        <div className="text-center mb-5">
          <h3 className="text-lg font-bold text-slate-800">战略合作伙伴</h3>
          <p className="text-xs text-slate-500 mt-1">
            政府机构 · 行业协会 · 头部平台 · 金融服务 共筑生态
          </p>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {[
            "湖北省商务厅",
            "武汉海关",
            "光谷自贸区",
            "Amazon",
            "TikTok Shop",
            "阿里国际站",
            "Shopee",
            "Lazada",
            "Google",
            "Meta",
            "PayPal",
            "义乌商城",
          ].map((p) => (
            <div
              key={p}
              className="h-14 rounded-lg border border-slate-100 bg-slate-50/50 grid place-items-center text-xs text-slate-500 hover:text-blue-600 hover:border-blue-200 hover:bg-white transition cursor-pointer text-center px-2"
            >
              {p}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============ ACADEMY ============ */
function MentorSection({ onOpenPage }: { onOpenPage: (page: Page, tab?: Tab) => void }) {
  const mentorScrollerRef = useRef<HTMLDivElement | null>(null);
  const mentorPauseUntilRef = useRef(0);
  const mentors = [
    {
      n: "陈志远",
      t: "TikTok Shop 操盘专家",
      c: "from-blue-500 to-cyan-500",
      tag: "10年+ 跨境直播",
      st: 3286,
    },
    {
      n: "刘晓楠",
      t: "亚马逊 Top1000 卖家",
      c: "from-orange-500 to-red-500",
      tag: "FBA 精品化运营",
      st: 2654,
    },
    {
      n: "Vivian Wu",
      t: "TikTok 官方运营顾问",
      c: "from-purple-500 to-pink-500",
      tag: "海外社媒爆款",
      st: 4128,
    },
    {
      n: "张涛",
      t: "Google 大中华区 PA",
      c: "from-emerald-500 to-teal-500",
      tag: "独立站 SEO/SEM",
      st: 1986,
    },
    {
      n: "李华",
      t: "武汉海关关务专家",
      c: "from-indigo-500 to-blue-600",
      tag: "RCEP 合规实务",
      st: 1762,
    },
    {
      n: "黄浩",
      t: "海外仓供应链顾问",
      c: "from-slate-600 to-slate-800",
      tag: "履约与库存周转",
      st: 1488,
    },
  ];

  useEffect(() => {
    const scroller = mentorScrollerRef.current;
    if (!scroller) return;

    const intervalId = window.setInterval(() => {
      const maxScroll = scroller.scrollWidth - scroller.clientWidth;
      const isPaused = Date.now() < mentorPauseUntilRef.current;
      if (maxScroll > 2) {
        if (scroller.scrollLeft >= maxScroll - 1) {
          scroller.scrollLeft = 0;
        } else if (!isPaused) {
          scroller.scrollLeft += 1;
        }
      }
    }, 32);

    return () => window.clearInterval(intervalId);
  }, []);

  const pauseMentorScroll = () => {
    mentorPauseUntilRef.current = Date.now() + 1200;
  };

  return (
    <div>
      <div className="flex items-end justify-between mb-4 px-1">
        <div>
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Star className="w-5 h-5 text-orange-500" /> 明星导师团
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            来自字节、亚马逊、阿里国际站、Google 的资深专家亲授
          </p>
        </div>
        <a
          href={pageHref("academy")}
          onClick={() => onOpenPage("index", "academy")}
          className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer flex items-center gap-1"
        >
          全部师资 <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
      <div
        ref={mentorScrollerRef}
        onMouseEnter={pauseMentorScroll}
        onFocus={pauseMentorScroll}
        onTouchStart={pauseMentorScroll}
        onWheel={pauseMentorScroll}
        onPointerDown={pauseMentorScroll}
        className="overflow-x-auto overscroll-x-contain pb-3"
      >
        <div className="flex gap-4 min-w-max">
          {mentors.map((p) => (
            <div
              key={p.n}
              className="w-[230px] shrink-0 bg-white rounded-2xl p-5 border border-blue-50 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all text-center"
            >
              <div
                className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${p.c} grid place-items-center text-white text-2xl font-bold ring-4 ring-blue-50`}
              >
                {p.n.charAt(0)}
              </div>
              <div className="mt-3 font-semibold text-slate-800">{p.n}</div>
              <div className="text-xs text-slate-500 mt-0.5">{p.t}</div>
              <div className="mt-2 inline-block px-2 py-0.5 bg-blue-50 text-blue-600 text-[11px] rounded">
                {p.tag}
              </div>
              <div className="mt-3 text-[11px] text-slate-400">
                {p.st.toLocaleString()} 学员 · 4.9 ★
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AcademyView({ onOpenPage }: { onOpenPage: (page: Page, tab?: Tab) => void }) {
  const [cat, setCat] = useState("精选课程");
  const cats = ["精选课程", "平台运营", "直播与内容", "选品与供应链", "物流与关务", "数据与增长"];

  const lives = [
    {
      title: "AI 时代数智驱动下沉市场新增长",
      time: "2026-06-08 19:30-21:00",
      expert: "周明 · 阿里国际站资深专家",
      status: "live",
    },
    {
      title: "RCEP 原产地证签发实务与典型案例解析",
      time: "2026-05-22 14:00-16:00",
      expert: "李华 · 武汉海关关税处",
      status: "past",
    },
    {
      title: "TikTok Shop 美区半托管模式爆发增长策略",
      time: "2026-06-12 20:00-21:30",
      expert: "Vivian · TikTok 官方运营顾问",
      status: "open",
    },
    {
      title: "独立站 SEO 与 Google Ads 投放实操工坊",
      time: "2026-05-18 19:00-21:00",
      expert: "张涛 · 谷歌大中华区合作伙伴",
      status: "past",
    },
  ];

  const courses = [
    {
      title: "跨境电商运营全流程精讲",
      category: "平台运营",
      teacher: "陈志远",
      total: "12h 30m",
      learned: "6h 12m",
      progress: 49,
    },
    {
      title: "亚马逊广告 ACoS 优化实战",
      category: "数据与增长",
      teacher: "刘晓楠",
      total: "8h 20m",
      learned: "0h",
      progress: 0,
    },
    {
      title: "海外社媒红人营销与 KOL 谈判",
      category: "直播与内容",
      teacher: "Vivian Wu",
      total: "6h 45m",
      learned: "6h 45m",
      progress: 100,
    },
    {
      title: "跨境支付与外汇合规深度解读",
      category: "物流与关务",
      teacher: "周明伟",
      total: "5h 10m",
      learned: "1h 22m",
      progress: 26,
    },
    {
      title: "Shopify 独立站从 0 到 1 搭建",
      category: "平台运营",
      teacher: "张涛",
      total: "10h 00m",
      learned: "3h 40m",
      progress: 36,
    },
    {
      title: "海外仓选址与库存周转优化",
      category: "选品与供应链",
      teacher: "黄浩",
      total: "4h 30m",
      learned: "0h",
      progress: 0,
    },
    {
      title: "跨境直播话术与转化设计",
      category: "直播与内容",
      teacher: "林薇",
      total: "7h 15m",
      learned: "2h 10m",
      progress: 30,
    },
    {
      title: "RCEP 关税筹划与原产地规则",
      category: "物流与关务",
      teacher: "李华",
      total: "5h 50m",
      learned: "0h",
      progress: 0,
    },
  ];
  const filteredCourses =
    cat === "精选课程" ? courses : courses.filter((course) => course.category === cat);

  return (
    <div className="space-y-6">
      {/* Live */}
      <div>
        <div className="flex items-end justify-between mb-4 px-1">
          <div>
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
              </span>
              直播课堂
            </h3>
            <p className="text-sm text-slate-500 mt-1">行业大咖在线直播 · 实时互动答疑</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lives.map((l) => (
            <div
              key={l.title}
              className="bg-white rounded-2xl p-5 border border-blue-50 shadow-sm hover:shadow-lg transition-all flex gap-4"
            >
              <div className="w-28 h-28 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 grid place-items-center text-white flex-shrink-0 relative overflow-hidden">
                <PlayCircle className="w-10 h-10 relative z-10" />
                {l.status === "live" && (
                  <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-red-500 text-[10px] rounded font-bold">
                    LIVE
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-slate-800 line-clamp-2">{l.title}</h4>
                <div className="mt-2 text-xs text-slate-500 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3" /> {l.time}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User className="w-3 h-3" /> {l.expert}
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <TrendingUp className="w-3 h-3 text-orange-500" />{" "}
                    {Math.floor(Math.random() * 2000) + 500} 已预约
                  </div>
                  {l.status === "past" ? (
                    <button
                      disabled
                      className="px-3 py-1.5 text-xs bg-slate-100 text-slate-400 rounded-md cursor-not-allowed"
                    >
                      已过期
                    </button>
                  ) : l.status === "live" ? (
                    <button
                      onClick={() => notifyPlatform("直播间演示暂未开放")}
                      className="px-3 py-1.5 text-xs bg-red-500 text-white rounded-md font-medium hover:bg-red-600 transition"
                    >
                      立即进入
                    </button>
                  ) : (
                    <button
                      onClick={() => notifyPlatform("扫码报名将在正式版接入")}
                      className="px-3 py-1.5 text-xs bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-md font-medium hover:from-orange-600 hover:to-orange-700 transition flex items-center gap-1"
                    >
                      <QrCode className="w-3 h-3" /> 扫码报名
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category chips */}
      <div className="bg-white rounded-2xl p-2 border border-blue-50 shadow-sm overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex min-w-max gap-1">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`shrink-0 px-5 py-2 rounded-xl text-sm font-medium transition-all ${
                cat === c
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/30"
                  : "text-slate-600 hover:bg-blue-50"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Course grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredCourses.map((c) => (
          <div
            key={c.title}
            className="group bg-white rounded-2xl overflow-hidden border border-blue-50 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all cursor-pointer"
          >
            <div className="relative h-32 bg-gradient-to-br from-blue-400 to-cyan-500 overflow-hidden">
              <div className="absolute top-2 left-2 px-2 py-0.5 bg-orange-500 text-white text-[11px] font-semibold rounded">
                {c.category}
              </div>
              <PlayCircle className="absolute inset-0 m-auto w-12 h-12 text-white/80 group-hover:scale-110 transition" />
              <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/40 backdrop-blur text-white text-[10px] rounded">
                {c.total}
              </div>
            </div>
            <div className="p-4">
              <h4 className="font-semibold text-slate-800 text-sm line-clamp-2 group-hover:text-blue-600 transition min-h-[40px]">
                {c.title}
              </h4>
              <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
                <User className="w-3 h-3" /> {c.teacher}
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                  <span>已学 {c.learned}</span>
                  <span>{c.progress}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all"
                    style={{ width: `${c.progress}%` }}
                  />
                </div>
              </div>
              <button
                onClick={() => onOpenPage("courseDetail", "academy")}
                className={`mt-3 w-full py-1.5 rounded-lg text-xs font-medium transition ${
                  c.progress > 0
                    ? "bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white"
                    : "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700"
                }`}
              >
                {c.progress === 100 ? "重新学习" : c.progress > 0 ? "继续学习" : "立即学习"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ====== 线下付费课程 ====== */}
      <div>
        <div className="flex items-end justify-between mb-4 px-1">
          <div>
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-500" /> 线下付费课程
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              小班实操 · 名企导师 · 武汉光谷 / 汉阳 / 江岸 三大实训中心同步开班
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-md bg-orange-50 text-orange-600 font-medium">
              7 天无理由退款
            </span>
            <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 font-medium">
              结业推荐就业
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              title: "TikTok 跨境直播操盘手·实战集训营",
              level: "进阶班",
              days: "12 天 / 96 课时",
              place: "武汉光谷实训中心",
              start: "2026-07-08 开班",
              teacher: "陈志远 · 字节跳动前 TSP 顾问",
              price: 5980,
              origin: 7980,
              quota: "限招 30 人 · 已报 22 人",
              tags: ["真号实操", "提供选品", "包就业推荐"],
              hot: true,
            },
            {
              title: "亚马逊精品化运营·企业内训营",
              level: "高阶班",
              days: "10 天 / 80 课时",
              place: "武汉汉阳实训中心",
              start: "2026-07-15 开班",
              teacher: "刘晓楠 · 亚马逊 Top1000 卖家",
              price: 6880,
              origin: 8880,
              quota: "限招 25 人 · 已报 18 人",
              tags: ["ACoS 优化", "广告打法", "选品诊断"],
              hot: false,
            },
            {
              title: "独立站 + Google Ads 全链路实操班",
              level: "进阶班",
              days: "8 天 / 64 课时",
              place: "武汉江岸实训中心",
              start: "2026-07-22 开班",
              teacher: "张涛 · 谷歌大中华区合作伙伴",
              price: 4980,
              origin: 6580,
              quota: "限招 35 人 · 已报 27 人",
              tags: ["Shopify 建站", "投放复盘", "数据追踪"],
              hot: true,
            },
            {
              title: "RCEP 关务合规与原产地实务班",
              level: "认证班",
              days: "5 天 / 40 课时",
              place: "武汉光谷实训中心",
              start: "2026-08-05 开班",
              teacher: "李华 · 武汉海关关税处特聘讲师",
              price: 3680,
              origin: 4680,
              quota: "限招 40 人 · 已报 12 人",
              tags: ["证书可考", "海关现场", "案例教学"],
              hot: false,
            },
            {
              title: "海外社媒 KOL 营销操盘工坊",
              level: "实战班",
              days: "6 天 / 48 课时",
              place: "武汉汉阳实训中心",
              start: "2026-08-12 开班",
              teacher: "Vivian Wu · TikTok 官方运营顾问",
              price: 4280,
              origin: 5680,
              quota: "限招 30 人 · 已报 9 人",
              tags: ["红人谈判", "脚本共创", "投流配合"],
              hot: false,
            },
            {
              title: "跨境电商管理者·总裁加速营",
              level: "高管班",
              days: "3 个月 · 周末班",
              place: "武汉江岸实训中心",
              start: "2026-09-06 开班",
              teacher: "协会专家委员会 · 12 位行业大咖",
              price: 19800,
              origin: 25800,
              quota: "限招 20 人 · 已报 6 人",
              tags: ["游学考察", "私董会", "资源对接"],
              hot: true,
            },
          ].map((c) => (
            <div
              key={c.title}
              className="group relative bg-white rounded-2xl overflow-hidden border border-blue-50 shadow-sm hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1 transition-all cursor-pointer flex flex-col"
            >
              <div className="relative h-32 bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 overflow-hidden">
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 20% 20%, white 1px, transparent 1px)",
                    backgroundSize: "16px 16px",
                  }}
                />
                {c.hot && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/95 text-orange-600 text-xs font-bold rounded-md flex items-center gap-1 shadow">
                    <Flame className="w-3 h-3" /> 热报
                  </div>
                )}
                <div className="absolute top-3 right-3 px-2 py-0.5 bg-black/30 backdrop-blur text-white text-[11px] rounded">
                  {c.level}
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {c.place}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {c.days}
                  </span>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h4 className="font-semibold text-slate-800 group-hover:text-orange-600 transition line-clamp-2 min-h-[48px]">
                  {c.title}
                </h4>
                <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  {c.teacher}
                </div>
                <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {c.start}
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {c.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 text-[11px] bg-blue-50 text-blue-600 rounded"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-dashed border-slate-100 flex items-end justify-between">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[11px] text-orange-500">¥</span>
                      <span className="text-2xl font-bold text-orange-600">
                        {c.price.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-400 line-through">
                        ¥{c.origin.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{c.quota}</div>
                  </div>
                  <button
                    onClick={() => onOpenPage("courseDetail", "academy")}
                    className="px-4 py-2 text-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition shadow shadow-orange-500/30"
                  >
                    立即报名
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============ JOBS ============ */
function JobsView({ onOpenJob }: { onOpenJob: (jobId: string) => void }) {
  const [filters, setFilters] = useState({
    cat: "平台运营",
    city: "武汉市",
    cycle: "3个月",
    start: "两周内",
  });
  const cities = [
    "不限",
    "武汉市",
    "黄石市",
    "十堰市",
    "宜昌市",
    "襄阳市",
    "鄂州市",
    "荆门市",
    "孝感市",
    "荆州市",
    "黄冈市",
  ];
  const cats = ["不限", "平台运营", "直播短视频", "选品助理", "海外仓", "数据分析", "内容设计"];
  const cycles = ["不限", "1个月", "2个月", "3个月", "6个月"];
  const starts = ["不限", "本周", "两周内", "寒暑假", "可协商"];

  const internships = [
    {
      jobId: "platform-operation-intern",
      title: "跨境电商运营实习生",
      company: "武汉华天境外贸易有限公司",
      hot: true,
      allowance: "150-200元/天",
      schedule: "每周 4 天",
      cycle: "3个月",
      mentor: "运营主管带教",
      tags: ["亚马逊", "Listing优化", "可开实习证明", "优秀可转正"],
    },
    {
      jobId: "tiktok-content-intern",
      title: "TikTok Shop 内容运营实习生",
      company: "湖北安克创新科技",
      hot: true,
      allowance: "180-220元/天",
      schedule: "每周 3-5 天",
      cycle: "2个月",
      mentor: "达人运营带教",
      tags: ["短视频脚本", "达人对接", "接受大三/研一", "作品集加分"],
    },
    {
      jobId: "data-selection-intern",
      title: "跨境选品与数据分析实习生",
      company: "武汉象豹跨境电商",
      hot: false,
      allowance: "120-180元/天",
      schedule: "每周 3 天",
      cycle: "3个月",
      mentor: "选品经理带教",
      tags: ["Excel/BI", "竞品调研", "可远程1天", "课程学员优先"],
    },
    {
      jobId: "live-assistant-intern",
      title: "海外直播助播实习生",
      company: "黄石云途出海 MCN",
      hot: true,
      allowance: "160元/天+场次奖励",
      schedule: "排班制",
      cycle: "1个月",
      mentor: "主播导师带教",
      tags: ["英语口语优先", "镜头训练", "晚间场次", "可提供住宿"],
    },
    {
      jobId: "payment-risk-intern",
      title: "跨境支付风控实习生",
      company: "PingPong 武汉分公司",
      hot: false,
      allowance: "180元/天",
      schedule: "每周 4 天",
      cycle: "6个月",
      mentor: "合规专员带教",
      tags: ["金融/法学优先", "英文资料阅读", "实习证明", "留用面试"],
    },
    {
      jobId: "warehouse-logistics-intern",
      title: "海外仓物流运营实习生",
      company: "宜昌丝路云仓物流",
      hot: true,
      allowance: "130-170元/天",
      schedule: "每周 5 天",
      cycle: "3个月",
      mentor: "仓配主管带教",
      tags: ["WMS系统", "现场实训", "接受专科", "包工作餐"],
    },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-500 to-emerald-400 p-6 md:p-8 text-white shadow-lg shadow-blue-500/20">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
              <GraduationCap className="h-3.5 w-3.5" />
              面向在校生的跨境电商实习机会
            </div>
            <h2 className="mt-4 text-2xl md:text-3xl font-bold">
              从课堂到实战，找到适合你的跨境电商实习
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/90">
              聚合校企合作、平台认证企业和课程配套实训岗位，优先展示可带教、可开证明、周期清晰的实习机会，帮助学生从课程学习自然过渡到真实项目。
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              ["126", "在招实习"],
              ["82%", "带教岗位"],
              ["48h", "平均反馈"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-xl bg-white/12 p-3 backdrop-blur">
                <div className="text-2xl font-bold">{value}</div>
                <div className="mt-1 text-xs text-white/80">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 border border-blue-50 shadow-sm space-y-4">
        {[
          { label: "实习方向", key: "cat" as const, opts: cats },
          { label: "实习城市", key: "city" as const, opts: cities },
          { label: "实习周期", key: "cycle" as const, opts: cycles },
          { label: "到岗时间", key: "start" as const, opts: starts },
        ].map(({ label, key, opts }) => (
          <div key={label} className="flex items-start gap-4">
            <div className="w-20 text-sm text-slate-500 pt-1.5 flex-shrink-0">{label}</div>
            <div className="flex flex-wrap gap-2 flex-1">
              {opts.map((o) => (
                <button
                  key={o}
                  onClick={() => setFilters({ ...filters, [key]: o })}
                  className={`px-3.5 py-1.5 rounded-full text-sm transition-all ${
                    filters[key] === o
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                      : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Internship list */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
          {internships.map((j) => (
            <div
              key={j.title}
              className="group bg-white rounded-2xl p-5 border border-blue-50 shadow-sm hover:shadow-lg hover:shadow-blue-500/10 hover:border-blue-200 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-slate-800 text-lg group-hover:text-blue-600 transition">
                      {j.title}
                    </h4>
                    {j.hot && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-red-50 text-red-500 text-xs rounded font-medium">
                        <Flame className="w-3 h-3" />
                        急招实习
                      </span>
                    )}
                  </div>
                  <div className="mt-1.5 text-sm text-slate-500 flex items-center gap-3 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5" />
                      {j.company}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {filters.city === "不限" ? "湖北" : filters.city}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {j.cycle}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {j.schedule}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {j.mentor}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-orange-500">{j.allowance}</div>
                  <div className="mt-1 text-[11px] text-slate-400">实习补贴</div>
                  <a
                    href={pageHref("jobs", "jobDetail", j.jobId)}
                    onClick={() => onOpenJob(j.jobId)}
                    className="mt-2 inline-flex px-4 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    申请实习
                  </a>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-50 flex flex-wrap gap-2">
                {j.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-0.5 bg-slate-50 text-slate-500 text-xs rounded"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Right rail */}
        <aside className="col-span-12 lg:col-span-4 space-y-4">
          <div className="rounded-2xl p-6 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 text-white shadow-xl shadow-blue-500/30 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full" />
            <div className="absolute -right-20 -bottom-20 w-56 h-56 bg-white/10 rounded-full" />
            <div className="relative">
              <div className="text-xs font-medium text-white/80 mb-1">学生实习服务</div>
              <h4 className="text-xl font-bold mb-1">实习投递助手</h4>
              <div className="text-sm text-white/90 mb-5">扫码完善简历 · 接收实习反馈</div>
              <div className="w-44 h-44 mx-auto bg-white rounded-xl p-3 shadow-lg">
                <div className="w-full h-full rounded-lg bg-[conic-gradient(at_50%_50%,#1e40af,#0ea5e9,#1e40af)] relative grid place-items-center">
                  <div className="w-10 h-10 bg-white rounded grid place-items-center">
                    <QrCode className="w-7 h-7 text-blue-700" />
                  </div>
                  <div className="absolute top-2 left-2 w-6 h-6 border-4 border-blue-700 border-r-transparent border-b-transparent" />
                  <div className="absolute top-2 right-2 w-6 h-6 border-4 border-blue-700 border-l-transparent border-b-transparent" />
                  <div className="absolute bottom-2 left-2 w-6 h-6 border-4 border-blue-700 border-r-transparent border-t-transparent" />
                </div>
              </div>
              <div className="mt-4 text-center text-sm text-white/90">
                打开微信扫一扫
                <br />
                查看更多实习机会
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-blue-50 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-orange-500" />
              投递前准备
            </h4>
            <div className="space-y-3 text-sm text-slate-600">
              {[
                "完善课程学习记录与证书",
                "上传一页中文简历",
                "补充每周可实习时间",
                "准备 1 个项目作品或店铺分析",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-blue-50 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-500" />
              实习保障
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {[
                ["带教", "明确导师"],
                ["证明", "可开具"],
                ["反馈", "48h内"],
                ["安全", "平台备案"],
              ].map(([title, desc]) => (
                <div key={title} className="rounded-xl bg-slate-50 p-3">
                  <div className="text-sm font-semibold text-slate-800">{title}</div>
                  <div className="mt-1 text-xs text-slate-500">{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ============ NEWS ============ */
function NewsView() {
  const notices = [
    { title: "关于举办 2026 年湖北省跨境电商创业大赛的通知", date: "2026-05-20" },
    { title: "丝路电商人才平台 6 月份课程更新与直播排期公告", date: "2026-05-18" },
    { title: "RCEP 原产地证签发培训班开始报名（限 50 人）", date: "2026-05-15" },
  ];
  const news = [
    {
      d: 24,
      m: 12,
      y: 2026,
      title: "2026 第三届中国（武汉）国际跨境电商博览会启幕",
      desc: "本届展会聚焦 RCEP 机遇，吸引来自 38 个国家和地区的近 800 家企业参展，展览面积达 5 万平方米。",
    },
    {
      d: 18,
      m: 12,
      y: 2026,
      title: "湖北自贸区跨境电商出口同比增长 42.6%",
      desc: "据武汉海关统计，今年前 11 月湖北自贸区跨境电商进出口额突破 280 亿元，其中 B2B 出口表现亮眼。",
    },
    {
      d: 12,
      m: 12,
      y: 2026,
      title: "TikTok Shop 美区半托管模式正式上线 跨境卖家迎新红利",
      desc: "新模式降低了中小卖家进入门槛，平台承担物流和售后服务，预计将带动新一波出海热潮。",
    },
    {
      d: 5,
      m: 12,
      y: 2026,
      title: '光谷跨境电商产业园获评"国家电子商务示范基地"',
      desc: "园区聚集了 320 余家跨境电商企业，2024 年实现交易额超 180 亿元，带动就业 2.8 万人。",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-7 rounded-2xl overflow-hidden shadow-sm border border-blue-50 relative h-[360px] bg-gradient-to-br from-blue-700 via-blue-500 to-cyan-400 group cursor-pointer">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "radial-gradient(circle at 30% 40%, white 1.5px, transparent 1.5px), radial-gradient(circle at 70% 70%, white 1px, transparent 1px)",
              backgroundSize: "80px 80px, 50px 50px",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute top-4 left-4 px-2.5 py-1 bg-red-500 text-white text-xs font-semibold rounded">
            置顶
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="text-xs text-white/80 mb-2 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" /> 2026-05-22 · 协会要闻
            </div>
            <h3 className="text-2xl font-bold mb-2 group-hover:translate-x-1 transition">
              武汉市跨境电商协会与马来西亚槟城工商总会签署战略合作备忘录
            </h3>
            <p className="text-sm text-white/80 line-clamp-2">
              双方将在跨境电商人才培养、海外仓共建、东盟市场拓展等领域开展深度合作，共同推动 RCEP
              框架下的数字贸易发展。
            </p>
          </div>
          <div className="absolute bottom-6 right-6 flex gap-1.5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${i === 1 ? "w-6 bg-white" : "w-1.5 bg-white/50"}`}
              />
            ))}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-5 bg-white rounded-2xl p-5 border border-blue-50 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-600" />
              通知公告
            </h3>
            <a className="text-xs text-blue-600 cursor-pointer hover:underline">更多</a>
          </div>
          <div className="space-y-1">
            {notices.map((n, i) => (
              <a
                key={n.title}
                className="flex items-start gap-3 py-3 border-b border-slate-50 last:border-0 group cursor-pointer"
              >
                <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xs grid place-items-center font-bold flex-shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-slate-700 group-hover:text-blue-600 transition line-clamp-2">
                    {n.title}
                  </div>
                </div>
                <div className="text-xs text-slate-400 flex-shrink-0 mt-0.5">{n.date}</div>
              </a>
            ))}
          </div>
          <button
            onClick={() => notifyPlatform("企业发布岗位入口将在管理端开放")}
            className="w-full mt-3 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition flex items-center justify-center gap-1"
          >
            订阅协会通知 <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div>
        <div className="flex items-end justify-between mb-4 px-1">
          <div>
            <h3 className="text-xl font-bold text-slate-800">招聘热点 · 行业动态</h3>
            <p className="text-sm text-slate-500 mt-1">把握跨境风向 · 抢占就业先机</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {news.map((n) => (
            <article
              key={n.title}
              className="group bg-white rounded-2xl p-5 border border-blue-50 shadow-sm hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-0.5 transition-all cursor-pointer flex gap-4"
            >
              <div className="w-20 flex-shrink-0 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white grid place-items-center text-center py-3 shadow-md shadow-blue-500/30">
                <div>
                  <div className="text-2xl font-bold leading-none">
                    {String(n.d).padStart(2, "0")}/{String(n.m).padStart(2, "0")}
                  </div>
                  <div className="text-[10px] mt-1 text-white/80">{n.y}</div>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-slate-800 group-hover:text-blue-600 transition line-clamp-2">
                  {n.title}
                </h4>
                <p className="mt-2 text-sm text-slate-500 line-clamp-2">{n.desc}</p>
                <div className="mt-3 text-blue-600 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  了解详情 <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

function ExamView({ onOpenPage }: { onOpenPage: (page: Page, tab?: Tab) => void }) {
  const certs = [
    {
      name: "跨境电商运营专员（初级）",
      code: "CBEC-101",
      level: "L1 · 入门",
      levelColor: "from-sky-400 to-sky-600",
      hot: true,
      price: 380,
      origin: 580,
      duration: "120 分钟",
      questions: "客观题 80 + 实操 2",
      passRate: 86,
      enrolled: 12480,
      next: "2026-07-12",
      tags: ["亚马逊", "速卖通", "Shopee"],
      desc: "面向零基础学员，覆盖平台规则、选品、Listing 优化与基础广告投放，省内人社部门联合认证。",
    },
    {
      name: "TikTok Shop 跨境直播运营师",
      code: "TTS-202",
      level: "L2 · 进阶",
      levelColor: "from-orange-400 to-rose-500",
      hot: true,
      price: 880,
      origin: 1280,
      duration: "150 分钟",
      questions: "客观题 60 + 直播实操",
      passRate: 72,
      enrolled: 6320,
      next: "2026-07-20",
      tags: ["东南亚", "短视频", "达人带货"],
      desc: "字节官方课程认证，含直播脚本、千川投放与跨境履约全流程，结业即可对接湖北 TikTok 服务商。",
    },
    {
      name: "RCEP 国际贸易合规师",
      code: "RCEP-301",
      level: "L3 · 高级",
      levelColor: "from-indigo-500 to-purple-600",
      hot: false,
      price: 1680,
      origin: 2280,
      duration: "180 分钟",
      questions: "案例分析 + 实务申报",
      passRate: 58,
      enrolled: 2150,
      next: "2026-08-03",
      tags: ["原产地证", "关税", "RCEP"],
      desc: "联合武汉海关与省商务厅推出，聚焦 RCEP 原产地规则、关税减让与跨境结算合规要点。",
    },
    {
      name: "海外仓供应链管理师",
      code: "OWM-302",
      level: "L3 · 高级",
      levelColor: "from-emerald-500 to-teal-600",
      hot: false,
      price: 1480,
      origin: 1980,
      duration: "150 分钟",
      questions: "客观题 + 沙盘推演",
      passRate: 64,
      enrolled: 1820,
      next: "2026-08-15",
      tags: ["FBA", "海外仓", "尾程派送"],
      desc: "围绕欧美/东南亚海外仓选址、WMS 系统操作与尾程时效优化，培养跨境履约核心岗位人才。",
    },
  ];

  const steps = [
    { icon: User, t: "在线报名", d: "提交资料 · 资格预审" },
    { icon: BookOpen, t: "备考培训", d: "120+ 课时直播 + 题库" },
    { icon: FileText, t: "机位考试", d: "全省 23 个考点机考" },
    { icon: BadgeCheck, t: "颁发证书", d: "电子证书 + 钢印纸证" },
  ];

  const stats = [
    { n: "32,860+", l: "累计认证学员", icon: Users, c: "text-blue-600 bg-blue-50" },
    { n: "78.6%", l: "平均通过率", icon: Trophy, c: "text-orange-600 bg-orange-50" },
    { n: "23", l: "全省机考考点", icon: MapPin, c: "text-emerald-600 bg-emerald-50" },
    { n: "186", l: "合作用人企业", icon: Building2, c: "text-purple-600 bg-purple-50" },
  ];

  const faqs = [
    {
      q: "证书在全国范围内是否通用？",
      a: "本页为国家级考试原型展示，证书查询、考点与准考证以正式通知为准；平台会提供报名记录、电子证书核验和企业认可说明。",
    },
    {
      q: "考试形式与补考政策？",
      a: "考试拟采用统一机考与身份核验流程；未通过学员可在开放补测场次后重新预约，具体补考规则以正式考试通知为准。",
    },
    {
      q: "是否提供企业团报与发票？",
      a: "5 人以上团报享 8.5 折，20 人以上享 7 折并支持上门定制培训，开具正规增值税专用发票。",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white p-8 md:p-10 shadow-xl shadow-blue-500/20">
        <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute right-24 bottom-0 w-40 h-40 rounded-full bg-orange-400/30 blur-2xl" />
        <div className="relative grid md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> 湖北省商务厅 · 武汉海关 联合指导
            </div>
            <h1 className="mt-4 text-3xl md:text-4xl font-bold leading-tight">
              跨境电商职业能力<span className="text-orange-300">等级认证</span>
            </h1>
            <p className="mt-3 text-blue-50/90 max-w-2xl">
              覆盖运营、直播、合规、供应链四大方向，权威认证 · 全国通用 · 名企直推。2026
              年度第三批考试报名通道已开启。
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => onOpenPage("certificateDetail", "exam")}
                className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 transition font-semibold text-sm shadow-lg shadow-orange-500/30 flex items-center gap-2"
              >
                立即报名 <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => notifyPlatform("考试大纲下载将在正式版开放")}
                className="px-5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur transition font-medium text-sm flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> 下载考试大纲
              </button>
            </div>
          </div>
          <div className="md:col-span-4 grid grid-cols-2 gap-3">
            {stats.slice(0, 4).map((s) => (
              <div
                key={s.l}
                className="bg-white/10 backdrop-blur rounded-xl p-3 border border-white/15"
              >
                <s.icon className="w-4 h-4 text-orange-300" />
                <div className="mt-1.5 text-xl font-bold">{s.n}</div>
                <div className="text-[11px] text-blue-100/80">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="bg-white rounded-2xl p-6 md:p-8 border border-blue-50 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" /> 四步获取权威认证
            </h2>
            <p className="text-sm text-slate-500 mt-1">从报名到拿证，全流程线上托管</p>
          </div>
          <button
            onClick={() => notifyPlatform("完整认证流程页面暂未开放")}
            className="hidden md:flex items-center gap-1 text-sm text-blue-600 hover:gap-2 transition-all font-medium"
          >
            查看完整流程 <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {steps.map((s, i) => (
            <div key={s.t} className="relative group">
              <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50/60 to-white p-5 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100 transition-all">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 grid place-items-center text-white shadow-md shadow-blue-500/30">
                    <s.icon className="w-5 h-5" />
                  </div>
                  <span className="text-3xl font-black text-blue-100 group-hover:text-blue-200 transition">
                    0{i + 1}
                  </span>
                </div>
                <div className="mt-3 font-semibold text-slate-800">{s.t}</div>
                <div className="text-xs text-slate-500 mt-1">{s.d}</div>
              </div>
              {i < steps.length - 1 && (
                <ChevronRight className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300 z-10" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Cert list */}
      <section className="bg-white rounded-2xl p-6 md:p-8 border border-blue-50 shadow-sm">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" /> 在招认证 · 2026 年度第三批
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              4 个认证方向 · 覆盖跨境电商核心岗位能力模型
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            {["全部方向", "运营", "直播", "合规", "供应链"].map((c, i) => (
              <button
                key={c}
                className={`px-3 py-1.5 rounded-full transition ${i === 0 ? "bg-blue-600 text-white shadow shadow-blue-500/30" : "bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600"}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {certs.map((c) => (
            <article
              key={c.code}
              className="group relative rounded-2xl border border-blue-50 bg-gradient-to-br from-white to-blue-50/40 p-5 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-100/60 hover:-translate-y-0.5 transition-all"
            >
              {c.hot && (
                <div className="absolute -top-2 -right-2 px-2.5 py-1 rounded-lg bg-gradient-to-r from-orange-500 to-rose-500 text-white text-[10px] font-bold flex items-center gap-1 shadow-lg shadow-orange-500/30">
                  <Flame className="w-3 h-3" /> 热门
                </div>
              )}
              <div className="flex items-start gap-4">
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${c.levelColor} grid place-items-center text-white shadow-lg shrink-0`}
                >
                  <Award className="w-7 h-7" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded bg-gradient-to-r ${c.levelColor} text-white`}
                    >
                      {c.level}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">{c.code}</span>
                  </div>
                  <h3 className="mt-1.5 font-bold text-slate-800 group-hover:text-blue-600 transition leading-snug">
                    {c.name}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {c.desc}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-white border border-blue-50 py-2">
                  <div className="text-xs text-slate-400">考试时长</div>
                  <div className="text-sm font-semibold text-slate-700 mt-0.5">{c.duration}</div>
                </div>
                <div className="rounded-lg bg-white border border-blue-50 py-2">
                  <div className="text-xs text-slate-400">通过率</div>
                  <div className="text-sm font-semibold text-emerald-600 mt-0.5">{c.passRate}%</div>
                </div>
                <div className="rounded-lg bg-white border border-blue-50 py-2">
                  <div className="text-xs text-slate-400">已报名</div>
                  <div className="text-sm font-semibold text-blue-600 mt-0.5">
                    {(c.enrolled / 1000).toFixed(1)}k
                  </div>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {c.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-blue-50 text-blue-600"
                  >
                    #{t}
                  </span>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-dashed border-blue-100 flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xs text-slate-400">认证费</span>
                    <span className="text-2xl font-bold text-orange-500">¥{c.price}</span>
                    <span className="text-xs text-slate-400 line-through">¥{c.origin}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> 下次考期 {c.next}
                  </div>
                </div>
                <button
                  onClick={() => onOpenPage("certificateDetail", "exam")}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium hover:from-blue-600 hover:to-blue-700 shadow-md shadow-blue-500/30 hover:shadow-lg transition-all flex items-center gap-1 group-hover:gap-2"
                >
                  立即报名 <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Bottom: timeline + FAQ */}
      <section className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-2xl p-6 md:p-8 border border-blue-50 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" /> 2026 年国家级认证考试考期安排
          </h2>
          <p className="mt-2 text-xs leading-5 text-slate-500">
            统一报名、统一机考、统一证书核验；具体考点与准考证以正式通知为准。
          </p>
          <div className="mt-5 relative">
            <div className="absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-blue-200 via-blue-100 to-transparent" />
            {[
              {
                d: "07/12",
                s: "周六",
                t: "国家级统考 · 跨境电商运营与直播应用（L1-L2）",
                st: "报名中",
                note: "报名截止 2026-07-05 · 准考证 07-09 开放",
                c: "bg-emerald-500",
              },
              {
                d: "08/03",
                s: "周日",
                t: "国家级统考 · RCEP 合规与海外仓供应链（L2-L3）",
                st: "报名中",
                note: "报名截止 2026-07-27 · 准考证 07-31 开放",
                c: "bg-emerald-500",
              },
              {
                d: "10/18",
                s: "周六",
                t: "国家级统考 · 平台运营、内容增长、数据分析综合场",
                st: "预约中",
                note: "报名截止 2026-10-11 · 考点确认中",
                c: "bg-blue-500",
              },
              {
                d: "12/13",
                s: "周六",
                t: "国家级补测 · 全方向证书复核与补考场",
                st: "未开放",
                note: "预计 2026-11 开放报名",
                c: "bg-slate-400",
              },
            ].map((e) => (
              <div key={e.d} className="relative pl-10 pb-5 last:pb-0 group">
                <div
                  className={`absolute left-1.5 top-1 w-3 h-3 rounded-full ${e.c} ring-4 ring-white shadow`}
                />
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-slate-800">{e.d}</span>
                    <span className="text-xs text-slate-400">{e.s}</span>
                  </div>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full text-white ${e.c}`}>
                    {e.st}
                  </span>
                </div>
                <div className="text-sm text-slate-600 mt-0.5">{e.t}</div>
                <div className="mt-1 text-xs text-slate-400">{e.note}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-orange-400/20 blur-2xl" />
          <h3 className="font-bold text-lg flex items-center gap-2">
            <MessageCircle className="w-5 h-5" /> 常见问题
          </h3>
          <div className="mt-4 space-y-3 relative">
            {faqs.map((f, i) => (
              <details
                key={i}
                className="group bg-white/10 backdrop-blur rounded-xl p-3 border border-white/10 hover:bg-white/15 transition"
              >
                <summary className="cursor-pointer text-sm font-medium flex items-center justify-between list-none">
                  <span className="flex items-center gap-2">
                    <span className="text-orange-300">Q{i + 1}</span> {f.q}
                  </span>
                  <ChevronRight className="w-4 h-4 transition group-open:rotate-90" />
                </summary>
                <p className="mt-2 text-xs text-blue-50/90 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
          <button
            onClick={() => notifyPlatform("证书核验将在下一阶段接入平台接口")}
            className="mt-5 w-full py-2.5 rounded-xl bg-white text-blue-700 font-semibold text-sm hover:bg-orange-300 hover:text-white transition flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4" /> 027-8888 6688 招生专线
          </button>
        </div>
      </section>
    </div>
  );
}

/* ============ ABOUT ============ */
function AboutView() {
  const milestones = [
    {
      y: "2016",
      t: "协会成立",
      d: "武汉市跨境电子商务协会经市民政局批准成立，首批会员单位 86 家。",
    },
    {
      y: "2019",
      t: "国家级示范基地落地光谷",
      d: "推动光谷跨境电商产业园获批国家电子商务示范基地。",
    },
    {
      y: "2022",
      t: "丝路电商人才平台上线",
      d: "联合 12 家头部企业共建一站式人才培训与就业服务平台。",
    },
    {
      y: "2024",
      t: "三大实训中心建成",
      d: "武汉光谷、武汉汉阳、武汉江岸三大线下实训中心同步运营。",
    },
    { y: "2026", t: "服务学员突破 5 万人", d: "累计认证持证人才 32,860 名，对接岗位 18,600+ 个。" },
  ];

  const partners = [
    "亚马逊全球开店",
    "TikTok Shop",
    "阿里国际站",
    "速卖通",
    "Shopify",
    "PingPong",
    "连连国际",
    "安克创新",
    "斑马技术",
    "极兔国际",
    "云途物流",
    "谷歌大中华区",
  ];

  const centers = [
    {
      name: "武汉光谷实训中心",
      addr: "东湖高新区光谷大道 77 号 · 光谷跨境电商产业园 B 座 5F",
      area: "3,200㎡",
      seats: "320 工位",
      focus: "TikTok 直播 · 亚马逊运营",
    },
    {
      name: "武汉汉阳实训中心",
      addr: "汉阳区龙阳大道 168 号 · 武汉跨境电商人才港 4F",
      area: "2,400㎡",
      seats: "240 工位",
      focus: "独立站 · 海外社媒营销",
    },
    {
      name: "武汉江岸实训中心",
      addr: "江岸区解放大道 1158 号 · 长江紫都 T2 18F",
      area: "2,000㎡",
      seats: "200 工位",
      focus: "RCEP 关务 · 供应链管理",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 text-white p-8 md:p-12 shadow-xl shadow-blue-500/20">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-xs font-medium mb-4">
            <ShieldCheck className="w-3.5 h-3.5" /> 武汉市跨境电子商务协会 · 官方授权
          </div>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight">
            让每一位湖北青年
            <br />
            都能搭上跨境出海的快车
          </h1>
          <p className="mt-4 text-blue-50/90 leading-relaxed max-w-2xl">
            丝路电商人才平台是由武汉市跨境电子商务协会发起、湖北省商务厅指导、联合 320
            余家头部跨境企业共建的"培训—认证—实训—就业"一站式人才服务平台，
            旨在为湖北省乃至中部地区培育新一代跨境电商数字贸易人才。
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => notifyPlatform("平台介绍手册下载暂未开放")}
              className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 transition font-semibold text-sm shadow-lg shadow-orange-500/30 flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" /> 下载平台介绍手册
            </button>
            <button
              onClick={() => notifyPlatform("企业合作登记将在正式版开放")}
              className="px-5 py-2.5 rounded-xl bg-white/15 backdrop-blur hover:bg-white/25 transition font-medium text-sm border border-white/30 flex items-center gap-1.5"
            >
              <Phone className="w-4 h-4" /> 027-8888 6688
            </button>
          </div>
        </div>
        <div className="relative mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { n: "9 年", l: "深耕跨境人才赛道" },
            { n: "3 大", l: "武汉实训中心" },
            { n: "320+", l: "共建名企" },
            { n: "5 万+", l: "累计学员" },
          ].map((s) => (
            <div
              key={s.l}
              className="bg-white/15 backdrop-blur rounded-2xl p-4 border border-white/20"
            >
              <div className="text-2xl md:text-3xl font-bold">{s.n}</div>
              <div className="text-xs text-blue-50/80 mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          {
            icon: Target,
            t: "使命",
            d: "以数字贸易教育赋能产业，让湖北跨境电商人才供给走在全国前列。",
            c: "from-blue-500 to-cyan-500",
          },
          {
            icon: Sparkles,
            t: "愿景",
            d: "成为中部地区最具影响力的跨境电商人才孵化与产教融合枢纽。",
            c: "from-orange-500 to-red-500",
          },
          {
            icon: Trophy,
            t: "价值观",
            d: "实战为本 · 学员第一 · 拥抱变化 · 长期主义。",
            c: "from-emerald-500 to-teal-500",
          },
        ].map(({ icon: Ic, t, d, c }) => (
          <div
            key={t}
            className="bg-white rounded-2xl p-6 border border-blue-50 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition"
          >
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c} grid place-items-center text-white mb-4 shadow-md`}
            >
              <Ic className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">{t}</h3>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">{d}</p>
          </div>
        ))}
      </section>

      {/* Training centers */}
      <section className="bg-white rounded-2xl p-6 md:p-8 border border-blue-50 shadow-sm">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" /> 武汉三大实训中心
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              总面积 7,600㎡ · 760 个标准实操工位 · 7×12 小时开放
            </p>
          </div>
          <a className="hidden md:flex text-sm text-blue-600 hover:text-blue-700 cursor-pointer items-center gap-1">
            预约参观 <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {centers.map((c, i) => (
            <div
              key={c.name}
              className="group relative rounded-2xl p-5 border border-blue-50 bg-gradient-to-br from-blue-50/60 to-white hover:shadow-lg hover:-translate-y-0.5 transition"
            >
              <div className="absolute top-5 right-5 w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white grid place-items-center font-bold text-sm shadow">
                0{i + 1}
              </div>
              <h4 className="font-bold text-slate-800 text-lg pr-12">{c.name}</h4>
              <div className="mt-3 space-y-2 text-sm text-slate-600">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="leading-relaxed">{c.addr}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-500" />
                  <span>
                    {c.area} · {c.seats}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-500" />
                  <span>主攻方向：{c.focus}</span>
                </div>
              </div>
              <button
                onClick={() => notifyPlatform("实训环境预览暂未开放")}
                className="mt-4 w-full py-2 rounded-lg bg-white border border-blue-100 text-blue-600 text-sm font-medium hover:bg-blue-600 hover:text-white hover:border-blue-600 transition"
              >
                查看实训环境
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="bg-white rounded-2xl p-6 md:p-8 border border-blue-50 shadow-sm">
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Star className="w-5 h-5 text-orange-500" /> 我们提供的核心服务
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: BookOpen, t: "在线学习", d: "1,200+ 节精品课" },
            { icon: GraduationCap, t: "线下集训", d: "三大中心实操营" },
            { icon: BadgeCheck, t: "职业认证", d: "L1-L3 三级认证" },
            { icon: Briefcase, t: "就业推荐", d: "186 家合作企业" },
            { icon: Users, t: "校企共建", d: "27 所高校合作" },
            { icon: FileText, t: "政策申报", d: "助企申报补贴" },
            { icon: TrendingUp, t: "出海陪跑", d: "店铺诊断咨询" },
            { icon: MessageCircle, t: "专家顾问", d: "1V1 在线答疑" },
          ].map(({ icon: Ic, t, d }) => (
            <div
              key={t}
              className="rounded-xl p-4 border border-blue-50 hover:bg-blue-50/40 hover:border-blue-200 transition cursor-pointer text-center"
            >
              <div className="w-11 h-11 mx-auto rounded-xl bg-blue-50 grid place-items-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
                <Ic className="w-5 h-5" />
              </div>
              <div className="mt-3 font-semibold text-slate-800 text-sm">{t}</div>
              <div className="text-xs text-slate-500 mt-1">{d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Milestones */}
      <section className="bg-white rounded-2xl p-6 md:p-8 border border-blue-50 shadow-sm">
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" /> 发展历程
        </h3>
        <div className="relative">
          <div className="absolute left-[7px] md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-blue-300 to-transparent" />
          <div className="space-y-6">
            {milestones.map((m, i) => (
              <div
                key={m.y}
                className={`relative md:grid md:grid-cols-2 md:gap-10 ${i % 2 === 0 ? "" : "md:[&>*:first-child]:order-2"}`}
              >
                <div
                  className={`pl-8 md:pl-0 ${i % 2 === 0 ? "md:text-right md:pr-10" : "md:pl-10"}`}
                >
                  <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 top-1.5 w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 ring-4 ring-blue-50" />
                  <div className="text-2xl font-bold text-blue-600">{m.y}</div>
                  <div className="mt-1 font-semibold text-slate-800">{m.t}</div>
                  <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">{m.d}</p>
                </div>
                <div />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="bg-white rounded-2xl p-6 md:p-8 border border-blue-50 shadow-sm">
        <div className="flex items-end justify-between mb-5">
          <div>
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" /> 战略合作伙伴
            </h3>
            <p className="text-sm text-slate-500 mt-1">与 320+ 跨境头部平台与服务商深度共建</p>
          </div>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {partners.map((p) => (
            <div
              key={p}
              className="aspect-[3/1] rounded-xl bg-gradient-to-br from-blue-50 to-white border border-blue-50 grid place-items-center text-xs md:text-sm font-medium text-slate-700 hover:shadow-md hover:text-blue-600 transition cursor-pointer text-center px-2"
            >
              {p}
            </div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-blue-900 to-blue-700 text-white p-8 md:p-10">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "linear-gradient(45deg, white 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative grid md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2">
            <h3 className="text-2xl md:text-3xl font-bold">企业 · 高校 · 政府 合作请联系我们</h3>
            <p className="mt-3 text-blue-100/80 max-w-xl">
              无论您是希望招募跨境人才的企业、共建专业的高校，还是希望落地培训项目的政府部门，我们都将提供定制化的解决方案。
            </p>
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-blue-50">
                <Phone className="w-4 h-4" /> 027-8888 6688
              </div>
              <div className="flex items-center gap-2 text-blue-50">
                <MessageCircle className="w-4 h-4" /> 商务合作：silkroad@whcbec.org
              </div>
              <div className="flex items-center gap-2 text-blue-50">
                <MapPin className="w-4 h-4" /> 武汉东湖高新区光谷大道 77 号
              </div>
              <div className="flex items-center gap-2 text-blue-50">
                <Clock className="w-4 h-4" /> 周一至周日 9:00 - 21:00
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 text-center text-slate-700">
            <div className="w-32 h-32 mx-auto rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 grid place-items-center">
              <QrCode className="w-16 h-16 text-blue-600" />
            </div>
            <div className="mt-3 text-sm font-semibold text-slate-800">扫码添加专属顾问</div>
            <div className="text-xs text-slate-500 mt-1">领取《跨境电商人才白皮书 2026》</div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============ CONTEST ============ */
function ContestView({ onOpenPage }: { onOpenPage: (page: Page, tab?: Tab) => void }) {
  const cats = ["全部", "国家级", "省级", "行业级", "校园赛", "创业赛", "直播带货"];
  const [cat, setCat] = useState("全部");
  const [signupOpen, setSignupOpen] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    school: "",
    major: "",
    team: "",
    members: "1",
  });
  const [submitted, setSubmitted] = useState(false);

  const contests = [
    {
      id: "c1",
      lvl: "国家级",
      lvlColor: "bg-red-500",
      status: "报名中",
      statusColor: "bg-emerald-500",
      title: '第十届"互联网+"大学生跨境电商创新创业大赛',
      host: "教育部 · 中国电子商务协会 · 阿里国际站",
      time: "2026-06-01 至 2026-07-30 报名 / 09-15 决赛",
      addr: "线上初赛 + 武汉光谷决赛",
      num: 12860,
      prize: "¥ 50 万",
      quota: "本/专科在校生",
      tags: ["创新创业", "团队赛", "保研加分"],
      cover: "from-red-500 via-orange-500 to-amber-500",
    },
    {
      id: "c2",
      lvl: "省级",
      lvlColor: "bg-blue-600",
      status: "报名中",
      statusColor: "bg-emerald-500",
      title: "2026 湖北省大学生跨境电商技能大赛",
      host: "湖北省商务厅 · 湖北省教育厅 · 武汉跨境电商协会",
      time: "2026-06-15 至 2026-08-15 报名 / 10-12 决赛",
      addr: "湖北省 28 所高校联合举办 · 决赛武汉汉阳实训中心",
      num: 3628,
      prize: "¥ 20 万",
      quota: "湖北高校在校生",
      tags: ["亚马逊", "TikTok", "Shopify"],
      cover: "from-blue-600 via-cyan-500 to-teal-500",
    },
    {
      id: "c3",
      lvl: "行业级",
      lvlColor: "bg-orange-500",
      status: "报名中",
      statusColor: "bg-emerald-500",
      title: "TikTok Shop 校园直播带货精英赛 · 2026",
      host: "TikTok Shop · 武汉跨境电商协会",
      time: "2026-07-01 至 2026-09-10 报名 / 11-08 总决赛",
      addr: "线上直播赛 + 上海总决赛",
      num: 5128,
      prize: "¥ 30 万 + 字节实习 Offer",
      quota: "高校在校生 / 应届生",
      tags: ["直播带货", "短视频", "签约机会"],
      cover: "from-pink-500 via-rose-500 to-orange-500",
    },
    {
      id: "c4",
      lvl: "国家级",
      lvlColor: "bg-red-500",
      status: "即将开始",
      statusColor: "bg-orange-500",
      title: "全国高校跨境电商创新创业实践大赛（POCIB）",
      host: "中国国际贸易学会 · 对外经贸大学",
      time: "2026-09-01 至 2026-10-30 报名 / 12-20 决赛",
      addr: "线上模拟仿真赛",
      num: 8420,
      prize: "¥ 25 万 + 名企保送实习",
      quota: "全国高校在校生",
      tags: ["虚拟仿真", "外贸全流程"],
      cover: "from-indigo-500 via-purple-500 to-pink-500",
    },
    {
      id: "c5",
      lvl: "省级",
      lvlColor: "bg-blue-600",
      status: "报名中",
      statusColor: "bg-emerald-500",
      title: "中部六省高校独立站运营对抗赛",
      host: "湖北省跨境电商商会 · Shopify 大中华区",
      time: "2026-06-20 至 2026-08-25 报名",
      addr: "武汉光谷实训中心",
      num: 1856,
      prize: "¥ 15 万 + Shopify Plus 商家推荐位",
      quota: "高校在校生 / 团队",
      tags: ["独立站", "Google Ads", "团队赛"],
      cover: "from-emerald-500 via-teal-500 to-cyan-500",
    },
    {
      id: "c6",
      lvl: "校园赛",
      lvlColor: "bg-purple-500",
      status: "报名中",
      statusColor: "bg-emerald-500",
      title: "丝路电商人才平台 · 校园选品达人争霸赛",
      host: "丝路电商人才平台 · 安克创新",
      time: "全年滚动报名 · 每月一期",
      addr: "线上 + 武汉江岸实训中心",
      num: 9234,
      prize: "¥ 5 万 / 期 + 实习直通",
      quota: "本/专科在校生 个人",
      tags: ["个人赛", "选品分析", "新手友好"],
      cover: "from-amber-500 via-yellow-500 to-lime-500",
    },
  ];

  const filtered = cat === "全部" ? contests : contests.filter((c) => c.lvl === cat);

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 p-8 shadow-lg shadow-orange-500/20">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, white 1.5px, transparent 1.5px), radial-gradient(circle at 70% 60%, white 1px, transparent 1px)",
            backgroundSize: "60px 60px, 80px 80px",
          }}
        />
        <div className="relative grid md:grid-cols-2 gap-6 items-center">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur text-white text-xs font-semibold rounded-full mb-4">
              <Trophy className="w-3 h-3" /> 大学生跨境电商比赛专区
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              以赛促学 · 以赛促就业
            </h1>
            <p className="text-white/90 mt-3 text-sm md:text-base">
              汇聚 36 项国家级 / 省级 / 行业级跨境电商赛事 · 一站式报名 · 名企直通车 · 奖金池超 ¥
              500 万
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => onOpenPage("contestDetail", "contest")}
                className="px-5 py-2.5 bg-white text-orange-600 font-semibold text-sm rounded-lg hover:bg-orange-50 transition shadow-lg"
              >
                立即报名参赛
              </button>
              <button
                onClick={() => notifyPlatform("赛事手册下载暂未开放")}
                className="px-5 py-2.5 bg-white/15 backdrop-blur text-white font-medium text-sm rounded-lg hover:bg-white/25 transition border border-white/30"
              >
                下载赛事手册
              </button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { n: "36+", l: "在办赛事" },
              { n: "62,800", l: "参赛学员" },
              { n: "¥ 500万", l: "奖金池" },
              { n: "186", l: "保送企业" },
              { n: "78", l: "合作高校" },
              { n: "98.2%", l: "获奖就业率" },
            ].map((s) => (
              <div key={s.l} className="bg-white/15 backdrop-blur rounded-xl p-3 text-center">
                <div className="text-white font-bold text-lg">{s.n}</div>
                <div className="text-white/80 text-[11px] mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 筛选 */}
      <div className="bg-white rounded-2xl p-4 border border-blue-50 shadow-sm flex flex-wrap items-center gap-2">
        <span className="text-sm text-slate-500 mr-2">赛事级别：</span>
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`px-3.5 py-1.5 rounded-full text-sm transition ${
              cat === c
                ? "bg-blue-600 text-white shadow shadow-blue-500/30"
                : "bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-600"
            }`}
          >
            {c}
          </button>
        ))}
        <div className="ml-auto text-xs text-slate-500">
          共 <b className="text-orange-500">{filtered.length}</b> 项赛事
        </div>
      </div>

      {/* 赛事卡片网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((c) => (
          <div
            key={c.id}
            className="group bg-white rounded-2xl overflow-hidden border border-blue-50 shadow-sm hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1 transition-all"
          >
            <div className={`relative h-32 bg-gradient-to-br ${c.cover} overflow-hidden`}>
              <div
                className="absolute inset-0 opacity-25"
                style={{
                  backgroundImage:
                    "linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)",
                  backgroundSize: "200% 200%",
                }}
              />
              <div className="absolute top-3 left-3 flex gap-2">
                <span
                  className={`px-2 py-0.5 ${c.lvlColor} text-white text-[10px] rounded font-semibold`}
                >
                  {c.lvl}
                </span>
                <span
                  className={`px-2 py-0.5 ${c.statusColor} text-white text-[10px] rounded font-semibold`}
                >
                  {c.status}
                </span>
              </div>
              <Trophy className="absolute right-4 bottom-3 w-12 h-12 text-white/60" />
              <div className="absolute left-3 bottom-3 text-white">
                <div className="text-[10px] uppercase tracking-widest opacity-80">PRIZE POOL</div>
                <div className="font-bold text-lg">{c.prize}</div>
              </div>
            </div>
            <div className="p-5">
              <h4 className="font-semibold text-slate-800 leading-snug group-hover:text-blue-600 transition line-clamp-2 min-h-[44px]">
                {c.title}
              </h4>
              <div className="mt-3 space-y-1.5 text-xs text-slate-500">
                <div className="flex items-start gap-1.5">
                  <Building2 className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  <span>主办：{c.host}</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <Clock className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  <span>{c.time}</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  <span>{c.addr}</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <GraduationCap className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  <span>参赛对象：{c.quota}</span>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {c.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 bg-orange-50 text-orange-600 text-[11px] rounded"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  已有 <b className="text-orange-500">{c.num.toLocaleString()}</b> 人报名
                </span>
                <button
                  onClick={() => onOpenPage("contestDetail", "contest")}
                  className="px-4 py-1.5 text-xs bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 transition font-medium shadow-md shadow-orange-500/30"
                >
                  立即报名 →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 报名流程 */}
      <div className="bg-white rounded-2xl p-6 border border-blue-50 shadow-sm">
        <h3 className="text-xl font-bold text-slate-800 text-center">四步参赛流程</h3>
        <p className="text-sm text-slate-500 text-center mt-1">
          最快 3 分钟完成报名，赛前 7 天获赠官方备赛课程
        </p>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { i: "1", t: "在线报名", d: "填写信息 / 组队", c: "from-blue-500 to-cyan-500" },
            { i: "2", t: "赛前培训", d: "导师带训 / 模拟", c: "from-orange-500 to-amber-500" },
            { i: "3", t: "正式参赛", d: "线上 + 线下评审", c: "from-purple-500 to-pink-500" },
            { i: "4", t: "颁奖直通", d: "奖金 / 实习 / 保研", c: "from-emerald-500 to-teal-500" },
          ].map((s, i) => (
            <div key={s.i} className="relative">
              <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-xl p-5 text-center hover:shadow-md transition">
                <div
                  className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-br ${s.c} grid place-items-center text-white font-bold text-lg`}
                >
                  {s.i}
                </div>
                <div className="mt-3 font-semibold text-slate-800">{s.t}</div>
                <div className="text-xs text-slate-500 mt-1">{s.d}</div>
              </div>
              {i < 3 && (
                <ArrowRight className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 历届回顾 + 合作高校 */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-7 bg-white rounded-2xl p-6 border border-blue-50 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-orange-500" /> 历届赛事精彩瞬间
          </h3>
          <div className="space-y-3">
            {[
              { y: "2024", t: '"互联网+"国赛湖北赛区金奖 12 项，创历史新高', n: "湖北高校" },
              {
                y: "2024",
                t: "TikTok Shop 校园赛武汉大学战队全国冠军，签约字节跳动",
                n: "武汉大学",
              },
              {
                y: "2023",
                t: "湖北省跨境电商技能大赛 2,800+ 学员参赛，36 人获保送实习",
                n: "湖北省赛",
              },
              {
                y: "2023",
                t: "POCIB 国赛华中赛区 87 所高校联动，覆盖学员超 2 万人",
                n: "华中赛区",
              },
            ].map((h) => (
              <div
                key={h.t}
                className="flex items-start gap-4 p-3 rounded-xl hover:bg-blue-50/50 transition cursor-pointer group"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 grid place-items-center text-orange-600 font-bold flex-shrink-0">
                  {h.y}
                </div>
                <div className="flex-1">
                  <div className="text-sm text-slate-800 group-hover:text-blue-600 transition">
                    {h.t}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">{h.n}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-12 lg:col-span-5 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl p-6 text-white shadow-lg shadow-blue-500/20">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <GraduationCap className="w-5 h-5" /> 78 所合作高校
          </h3>
          <p className="text-white/80 text-xs mt-1">覆盖湖北全部本/专科跨境电商相关院校</p>
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            {[
              "武汉大学",
              "华中科技大学",
              "武汉理工大学",
              "中南财经政法大学",
              "湖北经济学院",
              "武汉商学院",
              "武汉纺织大学",
              "湖北工业大学",
              "华中师范大学",
              "江汉大学",
              "湖北大学",
              "三峡大学",
            ].map((s) => (
              <div
                key={s}
                className="px-3 py-2 bg-white/15 backdrop-blur rounded-lg hover:bg-white/25 transition cursor-pointer truncate"
              >
                {s}
              </div>
            ))}
          </div>
          <button
            onClick={() => notifyPlatform("合作高校申请将在管理端开放")}
            className="mt-5 w-full py-2 bg-white text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-50 transition"
          >
            申请成为合作高校
          </button>
        </div>
      </div>

      {/* 报名弹窗 */}
      {signupOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 grid place-items-center p-4 animate-fade-in-up"
          onClick={() => setSignupOpen(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {!submitted ? (
              <>
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-5 text-white relative">
                  <button
                    onClick={() => setSignupOpen(null)}
                    className="absolute top-3 right-3 hover:bg-white/20 rounded p-1 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="text-xs opacity-90">比赛报名</div>
                  <div className="font-bold mt-1 line-clamp-2 pr-6">
                    {contests.find((c) => c.id === signupOpen)?.title}
                  </div>
                </div>
                <form
                  className="p-5 space-y-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSubmitted(true);
                  }}
                >
                  {[
                    { k: "name", l: "姓名", p: "请输入真实姓名", type: "text" },
                    { k: "phone", l: "手机号", p: "用于赛事通知与短信验证", type: "tel" },
                    { k: "school", l: "所在学校", p: "如：武汉大学", type: "text" },
                    { k: "major", l: "专业 / 年级", p: "如：国际贸易 大三", type: "text" },
                    { k: "team", l: "战队名称（选填）", p: "个人赛可留空", type: "text" },
                  ].map((f) => (
                    <div key={f.k}>
                      <label className="text-xs text-slate-600 font-medium">{f.l}</label>
                      <input
                        required={f.k !== "team"}
                        type={f.type}
                        value={form[f.k as keyof typeof form]}
                        onChange={(e) => setForm({ ...form, [f.k]: e.target.value })}
                        placeholder={f.p}
                        className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="text-xs text-slate-600 font-medium">参赛人数</label>
                    <select
                      value={form.members}
                      onChange={(e) => setForm({ ...form, members: e.target.value })}
                      className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition cursor-pointer"
                    >
                      <option value="1">1 人（个人赛）</option>
                      <option value="3">3 人（小型团队）</option>
                      <option value="5">5 人（标准团队）</option>
                    </select>
                  </div>
                  <label className="flex items-center gap-2 text-xs text-slate-500 pt-1">
                    <input type="checkbox" required className="accent-orange-500" />
                    我已阅读并同意《赛事报名须知》与《参赛承诺书》
                  </label>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-semibold text-sm hover:from-orange-600 hover:to-amber-600 transition shadow-md shadow-orange-500/30"
                  >
                    确认提交报名
                  </button>
                </form>
              </>
            ) : (
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 grid place-items-center">
                  <CheckCircle2 className="w-9 h-9 text-emerald-500" />
                </div>
                <h4 className="mt-4 text-lg font-bold text-slate-800">报名成功！</h4>
                <p className="text-sm text-slate-500 mt-2">
                  报名编号{" "}
                  <b className="text-orange-500 font-mono">
                    CBEC-{Date.now().toString().slice(-8)}
                  </b>
                  <br />
                  赛事组委会将在 24 小时内通过短信与微信通知您
                </p>
                <button
                  onClick={() => setSignupOpen(null)}
                  className="mt-5 px-6 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  完成
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function BackButton({ onBack, label = "返回列表" }: { onBack: () => void; label?: string }) {
  return (
    <button
      onClick={onBack}
      className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 transition"
    >
      <ArrowLeft className="w-4 h-4" /> {label}
    </button>
  );
}

function CourseDetailView({ onBack, onLearn }: { onBack: () => void; onLearn: () => void }) {
  const chapters = [
    { title: "跨境电商业务全景与岗位能力地图", time: "42 分钟", free: true },
    { title: "TikTok Shop 美区小店入驻与账号风控", time: "68 分钟", free: true },
    { title: "爆品选品：数据指标、利润模型与供应链验证", time: "86 分钟" },
    { title: "短视频脚本、直播间节奏与转化话术", time: "72 分钟" },
    { title: "履约、回款、售后与合规风险处理", time: "65 分钟" },
  ];

  return (
    <div className="space-y-6">
      <BackButton onBack={onBack} />
      <section className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 rounded-2xl overflow-hidden bg-white border border-blue-50 shadow-sm">
          <div className="relative min-h-[300px] bg-gradient-to-br from-blue-700 via-cyan-600 to-emerald-500 p-8 text-white">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: "linear-gradient(135deg, white 1px, transparent 1px)",
                backgroundSize: "22px 22px",
              }}
            />
            <div className="relative max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 backdrop-blur rounded-full text-xs font-semibold">
                <PlayCircle className="w-3.5 h-3.5" /> 热门在线课程
              </span>
              <h1 className="mt-4 text-3xl md:text-4xl font-bold leading-tight">
                TikTok Shop 美区小店从 0 到 1 实战
              </h1>
              <p className="mt-3 text-white/90">
                面向跨境电商新手和转岗学员，覆盖开店、选品、内容、直播、履约和合规，完成后可衔接平台认证考试。
              </p>
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                {[
                  ["32 节", "课程章节"],
                  ["12h 30m", "总时长"],
                  ["8,624", "学习人数"],
                  ["4.9", "学员评分"],
                ].map(([n, l]) => (
                  <div key={l} className="rounded-xl bg-white/15 backdrop-blur p-3">
                    <div className="text-xl font-bold">{n}</div>
                    <div className="text-white/75 text-xs">{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="p-6 grid md:grid-cols-3 gap-4">
            {[
              { icon: Target, t: "学习目标", d: "能独立完成店铺基础运营和首场直播排期" },
              { icon: ClipboardList, t: "实战作业", d: "选品表、脚本表、广告复盘表全流程提交" },
              { icon: BadgeCheck, t: "结业权益", d: "生成学习证明，可抵扣认证考试培训课时" },
            ].map((item) => (
              <div key={item.t} className="rounded-xl bg-blue-50/60 p-4">
                <item.icon className="w-5 h-5 text-blue-600" />
                <div className="mt-2 font-semibold text-slate-800">{item.t}</div>
                <div className="mt-1 text-xs text-slate-500 leading-relaxed">{item.d}</div>
              </div>
            ))}
          </div>
        </div>

        <aside className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-blue-50 shadow-sm">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-orange-500">¥199</span>
              <span className="text-sm text-slate-400 line-through">¥399</span>
            </div>
            <button
              onClick={onLearn}
              className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold hover:from-blue-600 hover:to-blue-700 transition shadow-lg shadow-blue-500/30"
            >
              进入课程学习
            </button>
            <button
              onClick={() => notifyPlatform("已加入学习计划（演示状态）")}
              className="mt-2 w-full py-2.5 rounded-xl bg-orange-50 text-orange-600 font-medium hover:bg-orange-100 transition"
            >
              加入学习计划
            </button>
            <div className="mt-4 space-y-2 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 支持手机端学习
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 配套讲义和作业模板
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 班主任 7 天答疑
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-blue-50 shadow-sm">
            <h3 className="font-bold text-slate-800">授课导师</h3>
            <div className="mt-3 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-rose-500 grid place-items-center text-white font-bold">
                陈
              </div>
              <div>
                <div className="font-semibold text-slate-800">陈志远</div>
                <div className="text-xs text-slate-500">
                  字节跳动前 TSP 顾问 · 服务 300+ 出海商家
                </div>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <section className="bg-white rounded-2xl p-6 border border-blue-50 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800">课程目录</h2>
        <div className="mt-4 divide-y divide-slate-100">
          {chapters.map((c, i) => (
            <button
              key={c.title}
              onClick={onLearn}
              className="w-full py-4 flex items-center gap-4 text-left hover:bg-blue-50/50 px-2 rounded-lg transition"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 grid place-items-center text-sm font-bold">
                {i + 1}
              </div>
              <div className="flex-1">
                <div className="font-medium text-slate-800">{c.title}</div>
                <div className="text-xs text-slate-500 mt-0.5">{c.time} · 视频 + 随堂测验</div>
              </div>
              {c.free && (
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 text-xs">
                  试看
                </span>
              )}
              <PlayCircle className="w-5 h-5 text-blue-500" />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function CourseLearningView({ onBack }: { onBack: () => void }) {
  return (
    <div className="space-y-6">
      <BackButton onBack={onBack} label="返回课程详情" />
      <section className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-slate-950 rounded-2xl overflow-hidden shadow-xl">
          <div className="aspect-video grid place-items-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white relative">
            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/10 backdrop-blur text-xs">
              第 2 课 · 店铺入驻与账号风控
            </div>
            <button
              onClick={() => notifyPlatform("课程播放器演示暂未接入视频源")}
              className="w-20 h-20 rounded-full bg-white/15 backdrop-blur grid place-items-center hover:bg-white/25 transition"
            >
              <PlayCircle className="w-12 h-12" />
            </button>
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/60 to-transparent">
              <div className="absolute left-4 right-4 bottom-4 h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full w-[36%] bg-blue-400 rounded-full" />
              </div>
            </div>
          </div>
          <div className="p-5 bg-white">
            <h1 className="text-xl font-bold text-slate-800">TikTok Shop 美区小店入驻与账号风控</h1>
            <p className="mt-2 text-sm text-slate-500">
              本节演示商家资料准备、主体审核、常见驳回原因和风控红线。
            </p>
          </div>
        </div>
        <aside className="lg:col-span-4 bg-white rounded-2xl border border-blue-50 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h2 className="font-bold text-slate-800">学习任务</h2>
            <div className="mt-3 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full w-[49%] bg-gradient-to-r from-blue-500 to-cyan-400" />
            </div>
            <div className="mt-2 text-xs text-slate-500">已完成 6h 12m / 12h 30m</div>
          </div>
          <div className="p-3 space-y-1">
            {[
              "业务全景与岗位能力地图",
              "美区小店入驻与账号风控",
              "爆品选品与利润模型",
              "直播脚本与转化话术",
              "履约、回款与合规处理",
            ].map((t, i) => (
              <button
                key={t}
                onClick={() => notifyPlatform("课程小节切换将在正式学习系统开放")}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition ${i === 1 ? "bg-blue-50 text-blue-700" : "hover:bg-slate-50 text-slate-600"}`}
              >
                {i < 1 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <MonitorPlay className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">{t}</span>
              </button>
            ))}
          </div>
        </aside>
      </section>

      <section className="grid md:grid-cols-3 gap-4">
        {[
          { t: "随堂测验", d: "10 道题，检验账号入驻知识点", b: "开始测验" },
          { t: "实操作业", d: "提交一份店铺资料准备清单", b: "上传作业" },
          { t: "讲义下载", d: "PDF 课件、风控清单、资料模板", b: "下载资料" },
        ].map((x) => (
          <div key={x.t} className="bg-white rounded-2xl p-5 border border-blue-50 shadow-sm">
            <h3 className="font-bold text-slate-800">{x.t}</h3>
            <p className="mt-1 text-sm text-slate-500">{x.d}</p>
            <button
              onClick={() => notifyPlatform(`${x.b}功能将在学习系统开放`)}
              className="mt-4 px-4 py-2 rounded-lg bg-blue-50 text-blue-600 text-sm font-medium hover:bg-blue-600 hover:text-white transition"
            >
              {x.b}
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}

function CertificateDetailView({ onBack }: { onBack: () => void }) {
  return (
    <div className="space-y-6">
      <BackButton onBack={onBack} />
      <section className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white rounded-2xl border border-blue-50 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-700 p-8 text-white">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> 职业能力等级认证
            </span>
            <h1 className="mt-4 text-3xl md:text-4xl font-bold">跨境电商运营专员（初级）</h1>
            <p className="mt-3 text-blue-50/90 max-w-2xl">
              适合零基础学员、应届毕业生和跨境电商运营助理，覆盖平台规则、选品、Listing
              优化、基础广告和履约合规。
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {["CBEC-101", "L1 入门", "全国互认", "电子证书 + 纸质证书"].map((t) => (
                <span key={t} className="px-3 py-1 rounded-full bg-white/15 text-sm">
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="p-6 grid md:grid-cols-4 gap-4">
            {[
              ["考试时长", "120 分钟"],
              ["题型", "客观题 80 + 实操 2"],
              ["通过率", "86%"],
              ["下次考试", "2026-07-12"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl bg-blue-50/70 p-4 text-center">
                <div className="text-xs text-slate-500">{k}</div>
                <div className="mt-1 font-bold text-slate-800">{v}</div>
              </div>
            ))}
          </div>
        </div>

        <aside className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-blue-50 shadow-sm">
            <div className="text-sm text-slate-500">认证费用</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-orange-500">¥380</span>
              <span className="text-sm text-slate-400 line-through">¥580</span>
            </div>
            <button
              onClick={() => notifyPlatform("认证报名将在下一阶段接入平台提交接口")}
              className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold hover:from-blue-600 hover:to-blue-700 transition shadow-lg shadow-blue-500/30"
            >
              立即报名认证
            </button>
            <button
              onClick={() => notifyPlatform("考试大纲下载将在正式版开放")}
              className="mt-2 w-full py-2.5 rounded-xl bg-blue-50 text-blue-600 font-medium hover:bg-blue-100 transition"
            >
              下载考试大纲
            </button>
          </div>
          <div className="rounded-2xl p-5 bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20">
            <BadgeCheck className="w-8 h-8" />
            <h3 className="mt-3 font-bold">证书样例</h3>
            <p className="mt-1 text-sm text-white/85">
              支持证书编号查询、电子版下载、企业招聘背调验证。
            </p>
          </div>
        </aside>
      </section>

      <section className="grid md:grid-cols-3 gap-4">
        {[
          { icon: BookOpen, t: "备考课程", d: "包含 120+ 课时直播/录播与题库练习" },
          { icon: FileText, t: "考试流程", d: "在线报名、资格预审、预约机考、成绩查询" },
          { icon: Briefcase, t: "就业推荐", d: "通过后进入协会人才库，推荐湖北跨境名企" },
        ].map((x) => (
          <div key={x.t} className="bg-white rounded-2xl p-5 border border-blue-50 shadow-sm">
            <x.icon className="w-6 h-6 text-blue-600" />
            <h3 className="mt-3 font-bold text-slate-800">{x.t}</h3>
            <p className="mt-1 text-sm text-slate-500">{x.d}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

function ContestDetailView({ onBack }: { onBack: () => void }) {
  return (
    <div className="space-y-6">
      <BackButton onBack={onBack} />
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 p-8 text-white shadow-xl shadow-orange-500/20">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(circle at 20% 20%, white 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative grid lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold">
              <Trophy className="w-3.5 h-3.5" /> 国家级 · 报名中
            </span>
            <h1 className="mt-4 text-3xl md:text-4xl font-bold leading-tight">
              第十届“互联网+”大学生跨境电商创新创业大赛
            </h1>
            <p className="mt-3 text-white/90 max-w-3xl">
              以真实出海商品、真实店铺运营和完整商业计划为核心，优秀团队可获得奖金、实习 Offer
              和创业孵化资源。
            </p>
          </div>
          <div className="lg:col-span-4 bg-white/15 backdrop-blur rounded-2xl p-5">
            <div className="text-sm text-white/80">奖金池</div>
            <div className="text-4xl font-bold mt-1">¥50 万</div>
            <button
              onClick={() => notifyPlatform("赛事报名将在下一阶段接入平台提交接口")}
              className="mt-5 w-full py-3 rounded-xl bg-white text-orange-600 font-bold hover:bg-orange-50 transition"
            >
              立即报名参赛
            </button>
          </div>
        </div>
      </section>

      <section className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-blue-50 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800">赛程安排</h2>
          <div className="mt-5 space-y-4">
            {[
              ["06/01 - 07/30", "线上报名与项目提交", "提交团队信息、项目计划书和选品报告"],
              ["08/10 - 08/25", "线上初赛", "完成模拟店铺运营任务和线上答辩"],
              ["09/15", "武汉光谷总决赛", "现场路演、专家评审、名企双选会"],
              ["09/30", "获奖团队孵化", "对接实习、创业辅导和平台招商资源"],
            ].map(([date, title, desc], i) => (
              <div key={title} className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 grid place-items-center font-bold">
                  {i + 1}
                </div>
                <div className="flex-1 pb-4 border-b border-slate-100">
                  <div className="text-xs text-slate-400">{date}</div>
                  <div className="mt-1 font-semibold text-slate-800">{title}</div>
                  <div className="mt-1 text-sm text-slate-500">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-blue-50 shadow-sm">
            <h3 className="font-bold text-slate-800">参赛要求</h3>
            <div className="mt-3 space-y-2 text-sm text-slate-500">
              <div className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5" /> 本专科在校生，1-5
                人组队
              </div>
              <div className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5" />{" "}
                至少完成一份跨境选品报告
              </div>
              <div className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5" />{" "}
                支持亚马逊、TikTok、Shopify 方向
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-blue-50 shadow-sm">
            <h3 className="font-bold text-slate-800">报名资料</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {["学生证", "团队名单", "项目计划书", "选品报告"].map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs"
                >
                  {t}
                </span>
              ))}
            </div>
            <button
              onClick={() => notifyPlatform("赛事手册下载暂未开放")}
              className="mt-4 w-full py-2 rounded-lg bg-orange-50 text-orange-600 text-sm font-medium hover:bg-orange-100 transition"
            >
              下载赛事手册
            </button>
          </div>
        </aside>
      </section>
    </div>
  );
}

function PlaceholderView({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="bg-white rounded-2xl p-16 border border-blue-50 shadow-sm text-center">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 grid place-items-center mb-4">
        <CheckCircle2 className="w-8 h-8 text-white" />
      </div>
      <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
      <p className="mt-2 text-slate-500">{desc}</p>
      <button className="mt-6 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition">
        敬请期待
      </button>
    </div>
  );
}
