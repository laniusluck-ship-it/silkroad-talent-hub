import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Search, Phone, MessageCircle, QrCode, Bell, X, ChevronRight, Flame,
  Clock, User, MapPin, Briefcase, GraduationCap, Calendar, ArrowRight,
  Home, BookOpen, Award, Newspaper, Info, Building2, Sparkles, PlayCircle,
  CheckCircle2, Star, TrendingUp, ShieldCheck, FileText, Users, Trophy,
  Download, BadgeCheck, Target, Layers,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "丝路电商人才平台 — 湖北跨境电商人才培训与就业平台" },
      { name: "description", content: "湖北省跨境电商人才一站式培训、认证与就业平台。" },
    ],
  }),
  component: Index,
});

type Tab = "home" | "academy" | "exam" | "jobs" | "news" | "about";

const NAV: { key: Tab; label: string; icon: typeof Home }[] = [
  { key: "home", label: "首页", icon: Home },
  { key: "academy", label: "跨境学院", icon: BookOpen },
  { key: "exam", label: "认证考试", icon: Award },
  { key: "jobs", label: "实习招聘", icon: Briefcase },
  { key: "news", label: "跨境资讯", icon: Newspaper },
  { key: "about", label: "关于", icon: Info },
];

function Index() {
  const [tab, setTab] = useState<Tab>("home");
  const [banner, setBanner] = useState(true);

  return (
    <div className="min-h-screen">
      {/* Top Nav */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 border-b border-blue-100">
        <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 grid place-items-center text-white font-bold shadow-lg shadow-blue-500/30">丝</div>
            <div className="leading-tight">
              <div className="font-bold text-slate-800">丝路云课堂</div>
              <div className="text-[10px] text-blue-600 tracking-widest">SILKROAD EDU</div>
            </div>
          </div>
          <nav className="flex items-center gap-1 flex-1">
            {NAV.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-1.5 ${
                  tab === key
                    ? "text-blue-600 bg-blue-50"
                    : "text-slate-600 hover:text-blue-600 hover:bg-blue-50/50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
                {tab === key && <span className="absolute -bottom-[17px] left-1/2 -translate-x-1/2 w-8 h-0.5 bg-blue-600 rounded-full" />}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <button className="text-slate-500 hover:text-blue-600 transition-colors"><Bell className="w-5 h-5" /></button>
            <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 grid place-items-center text-white text-sm font-bold">F</div>
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
            <button className="ml-auto px-3 py-1 bg-white text-blue-600 rounded-md text-xs font-semibold hover:bg-blue-50 transition">去实训</button>
            <button onClick={() => setBanner(false)} className="hover:bg-white/20 rounded p-1 transition"><X className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      {/* Body */}
      <main className="max-w-[1280px] mx-auto px-6 py-8">
        <div key={tab} className="animate-fade-in-up">
          {tab === "home" && <HomeView />}
          {tab === "academy" && <AcademyView />}
          {tab === "jobs" && <JobsView />}
          {tab === "news" && <NewsView />}
          {tab === "exam" && <ExamView />}
          {tab === "about" && <AboutView />}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-blue-100 mt-12 bg-white/60">
        <div className="max-w-[1280px] mx-auto px-6 py-8 text-center text-xs text-slate-500">
          © 2025 武汉市跨境电子商务协会 · 丝路云课堂 · 鄂ICP备2025001234号
        </div>
      </footer>

      {/* Floating toolbar */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-xl shadow-blue-500/10 border border-blue-100 p-2 flex flex-col gap-1">
        {[
          { icon: Phone, label: "电话咨询", color: "text-blue-600" },
          { icon: MessageCircle, label: "专家微信", color: "text-green-600" },
          { icon: QrCode, label: "小程序", color: "text-orange-500" },
        ].map(({ icon: Icon, label, color }) => (
          <button key={label} className="group relative w-11 h-11 grid place-items-center rounded-xl hover:bg-blue-50 transition-all duration-300 hover:scale-110">
            <Icon className={`w-5 h-5 ${color} group-hover:scale-110 transition`} />
            <span className="absolute right-full mr-3 px-3 py-1.5 bg-slate-800 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all -translate-x-2 group-hover:translate-x-0">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ============ HOME ============ */
function HomeView() {
  const [searchType, setSearchType] = useState<"job" | "course">("course");
  const categories = [
    "跨境电商运营", "跨境直播", "产品研发与供应链", "品牌与营销",
    "支付/仓储/合规", "技术开发", "海外业务拓展", "人力资源与行政", "跨境教育/会展服务",
  ];
  const [activeCat, setActiveCat] = useState(0);

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="bg-white rounded-2xl shadow-sm shadow-blue-500/5 p-6 border border-blue-50">
        <h1 className="text-center text-2xl font-bold text-slate-800 mb-1">湖北跨境电商人才 · 学习与就业一站式平台</h1>
        <p className="text-center text-sm text-slate-500 mb-5">汇聚 200+ 跨境名企 · 50+ 行业专家 · 1200+ 精品课程</p>
        <div className="max-w-3xl mx-auto flex items-stretch rounded-full border-2 border-blue-500 overflow-hidden shadow-lg shadow-blue-500/20">
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value as "job" | "course")}
            className="px-5 bg-blue-50 text-blue-700 font-medium text-sm outline-none cursor-pointer border-r border-blue-100"
          >
            <option value="course">找课程</option>
            <option value="job">找职位</option>
          </select>
          <input
            placeholder={searchType === "course" ? "搜索：TikTok 直播运营、亚马逊选品、海外仓..." : "搜索：跨境运营、独立站、Amazon Account Manager..."}
            className="flex-1 px-5 outline-none text-sm"
          />
          <button className="px-8 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold text-sm hover:from-blue-600 hover:to-blue-700 transition flex items-center gap-2">
            <Search className="w-4 h-4" /> 搜索
          </button>
        </div>
        <div className="flex flex-wrap justify-center gap-2 mt-4 text-xs">
          <span className="text-slate-400">热门：</span>
          {["TikTok Shop", "亚马逊运营", "RCEP 原产地证", "Shopify 独立站", "义乌选品"].map((t) => (
            <a key={t} className="text-slate-500 hover:text-blue-600 cursor-pointer transition">{t}</a>
          ))}
        </div>
      </div>

      {/* Categories + Banner */}
      <div className="grid grid-cols-12 gap-6">
        <aside className="col-span-12 lg:col-span-3 bg-white rounded-2xl shadow-sm shadow-blue-500/5 p-3 border border-blue-50">
          <div className="px-3 py-2 text-sm font-bold text-slate-800 flex items-center justify-between">
            <span>岗位分类导航</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
          <div className="space-y-0.5">
            {categories.map((c, i) => (
              <button
                key={c}
                onMouseEnter={() => setActiveCat(i)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-200 flex items-center justify-between group ${
                  activeCat === i ? "bg-blue-50 text-blue-700 font-medium" : "text-slate-600 hover:bg-blue-50/50"
                }`}
              >
                <span>{c}</span>
                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${activeCat === i ? "translate-x-1 text-blue-600" : "text-slate-300"}`} />
              </button>
            ))}
          </div>
        </aside>

        <section className="col-span-12 lg:col-span-9 space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 p-8 min-h-[280px] shadow-lg shadow-blue-500/20">
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: "radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 70% 60%, white 1px, transparent 1px)",
              backgroundSize: "60px 60px, 80px 80px",
            }} />
            <div className="relative">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full mb-4">
                <Sparkles className="w-3 h-3" /> 官方认证
              </div>
              <h2 className="text-4xl font-bold text-white mb-2">武汉市跨境电子商务协会</h2>
              <p className="text-white/90 text-base mb-4">链接全球贸易 · 赋能荆楚企业 · 培育丝路人才</p>
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 text-white text-sm font-medium shadow-lg">
                共商 · 共建 · 共赢
              </div>
              <div className="mt-6 bg-white/95 backdrop-blur rounded-xl p-4 flex items-center gap-4 max-w-xl">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 grid place-items-center">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-slate-800 text-sm">武汉华天境外贸易有限公司</div>
                  <div className="text-xs text-slate-500 mt-0.5">RCEP 认证企业 · 主营东南亚日化品出口 · 招募中</div>
                </div>
                <button className="px-4 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition">查看</button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { num: "12,800+", label: "在校学员", c: "from-blue-500 to-cyan-500" },
              { num: "320+", label: "合作名企", c: "from-orange-500 to-red-500" },
              { num: "98.6%", label: "结业就业率", c: "from-emerald-500 to-teal-500" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl p-4 border border-blue-50 shadow-sm">
                <div className={`text-2xl font-bold bg-gradient-to-r ${s.c} bg-clip-text text-transparent`}>{s.num}</div>
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
            <p className="text-sm text-slate-500 mt-1">武汉光谷 · 武汉汉阳 · 武汉江岸 三大实训中心</p>
          </div>
          <a className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer flex items-center gap-1">查看全部 <ArrowRight className="w-3.5 h-3.5" /></a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            { title: '跨境电商 TikTok "0" 到 "1" 实战启航班', date: "2025-06-15 ~ 06-28", teacher: "陈志远 · 字节跳动前 TSP 顾问", place: "武汉光谷实训中心", tag: "热招" },
            { title: "亚马逊 FBA 选品与精品化运营进阶营", date: "2025-07-05 ~ 07-19", teacher: "刘晓楠 · 亚马逊 Top1000 卖家", place: "武汉汉阳实训中心", tag: "新开" },
          ].map((c) => (
            <div key={c.title} className="group bg-white rounded-2xl overflow-hidden border border-blue-50 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
              <div className="h-40 bg-gradient-to-br from-blue-400 via-blue-500 to-cyan-500 relative overflow-hidden">
                <div className="absolute inset-0 opacity-30 group-hover:scale-110 transition-transform duration-700" style={{
                  backgroundImage: "linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)",
                  backgroundSize: "200% 200%",
                }} />
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-orange-500 text-white text-xs font-semibold rounded-md flex items-center gap-1">
                  <Flame className="w-3 h-3" /> {c.tag}
                </div>
                <div className="absolute bottom-3 right-3 text-white/90 text-xs font-medium flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {c.place}
                </div>
              </div>
              <div className="p-5">
                <h4 className="font-semibold text-slate-800 group-hover:text-blue-600 transition">{c.title}</h4>
                <div className="mt-3 space-y-1.5 text-sm text-slate-500">
                  <div className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5" />开课时间：{c.date}</div>
                  <div className="flex items-center gap-2"><User className="w-3.5 h-3.5" />主讲：{c.teacher}</div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-slate-400">已报名 <b className="text-orange-500">128</b> 人 / 共 200 席</span>
                  <button className="px-4 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition font-medium">查看详情</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============ ACADEMY ============ */
function AcademyView() {
  const [cat, setCat] = useState("精选课程");
  const cats = ["精选课程", "专业能力", "通用能力", "社会能力", "发展能力", "拓展能力"];

  const lives = [
    { title: "AI 时代数智驱动下沉市场新增长", time: "2025-06-08 19:30-21:00", expert: "周明 · 阿里国际站资深专家", status: "live" },
    { title: "RCEP 原产地证签发实务与典型案例解析", time: "2025-05-22 14:00-16:00", expert: "李华 · 武汉海关关税处", status: "past" },
    { title: "TikTok Shop 美区半托管模式爆发增长策略", time: "2025-06-12 20:00-21:30", expert: "Vivian · TikTok 官方运营顾问", status: "open" },
    { title: "独立站 SEO 与 Google Ads 投放实操工坊", time: "2025-05-18 19:00-21:00", expert: "张涛 · 谷歌大中华区合作伙伴", status: "past" },
  ];

  const courses = [
    { title: "跨境电商运营全流程精讲", teacher: "陈志远", total: "12h 30m", learned: "6h 12m", progress: 49 },
    { title: "亚马逊广告 ACoS 优化实战", teacher: "刘晓楠", total: "8h 20m", learned: "0h", progress: 0 },
    { title: "海外社媒红人营销与 KOL 谈判", teacher: "Vivian Wu", total: "6h 45m", learned: "6h 45m", progress: 100 },
    { title: "跨境支付与外汇合规深度解读", teacher: "周明伟", total: "5h 10m", learned: "1h 22m", progress: 26 },
    { title: "Shopify 独立站从 0 到 1 搭建", teacher: "张涛", total: "10h 00m", learned: "3h 40m", progress: 36 },
    { title: "海外仓选址与库存周转优化", teacher: "黄浩", total: "4h 30m", learned: "0h", progress: 0 },
    { title: "跨境直播话术与转化设计", teacher: "林薇", total: "7h 15m", learned: "2h 10m", progress: 30 },
    { title: "RCEP 关税筹划与原产地规则", teacher: "李华", total: "5h 50m", learned: "0h", progress: 0 },
  ];

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
            <div key={l.title} className="bg-white rounded-2xl p-5 border border-blue-50 shadow-sm hover:shadow-lg transition-all flex gap-4">
              <div className="w-28 h-28 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 grid place-items-center text-white flex-shrink-0 relative overflow-hidden">
                <PlayCircle className="w-10 h-10 relative z-10" />
                {l.status === "live" && <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-red-500 text-[10px] rounded font-bold">LIVE</span>}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-slate-800 line-clamp-2">{l.title}</h4>
                <div className="mt-2 text-xs text-slate-500 space-y-1">
                  <div className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {l.time}</div>
                  <div className="flex items-center gap-1.5"><User className="w-3 h-3" /> {l.expert}</div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <TrendingUp className="w-3 h-3 text-orange-500" /> {Math.floor(Math.random() * 2000) + 500} 已预约
                  </div>
                  {l.status === "past" ? (
                    <button disabled className="px-3 py-1.5 text-xs bg-slate-100 text-slate-400 rounded-md cursor-not-allowed">已过期</button>
                  ) : l.status === "live" ? (
                    <button className="px-3 py-1.5 text-xs bg-red-500 text-white rounded-md font-medium hover:bg-red-600 transition">立即进入</button>
                  ) : (
                    <button className="px-3 py-1.5 text-xs bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-md font-medium hover:from-orange-600 hover:to-orange-700 transition flex items-center gap-1">
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
      <div className="bg-white rounded-2xl p-2 border border-blue-50 shadow-sm flex flex-wrap gap-1">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${
              cat === c
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/30"
                : "text-slate-600 hover:bg-blue-50"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Course grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {courses.map((c) => (
          <div key={c.title} className="group bg-white rounded-2xl overflow-hidden border border-blue-50 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all cursor-pointer">
            <div className="relative h-32 bg-gradient-to-br from-blue-400 to-cyan-500 overflow-hidden">
              <div className="absolute top-2 left-2 px-2 py-0.5 bg-orange-500 text-white text-[11px] font-semibold rounded">精品</div>
              <PlayCircle className="absolute inset-0 m-auto w-12 h-12 text-white/80 group-hover:scale-110 transition" />
              <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/40 backdrop-blur text-white text-[10px] rounded">{c.total}</div>
            </div>
            <div className="p-4">
              <h4 className="font-semibold text-slate-800 text-sm line-clamp-2 group-hover:text-blue-600 transition min-h-[40px]">{c.title}</h4>
              <div className="mt-2 text-xs text-slate-500 flex items-center gap-1"><User className="w-3 h-3" /> {c.teacher}</div>
              <div className="mt-3">
                <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                  <span>已学 {c.learned}</span>
                  <span>{c.progress}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all" style={{ width: `${c.progress}%` }} />
                </div>
              </div>
              <button className={`mt-3 w-full py-1.5 rounded-lg text-xs font-medium transition ${
                c.progress > 0 ? "bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white" : "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700"
              }`}>
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
            <p className="text-sm text-slate-500 mt-1">小班实操 · 名企导师 · 武汉光谷 / 汉阳 / 江岸 三大实训中心同步开班</p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-md bg-orange-50 text-orange-600 font-medium">7 天无理由退款</span>
            <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 font-medium">结业推荐就业</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              title: "TikTok 跨境直播操盘手·实战集训营",
              level: "进阶班",
              days: "12 天 / 96 课时",
              place: "武汉光谷实训中心",
              start: "2025-07-08 开班",
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
              start: "2025-07-15 开班",
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
              start: "2025-07-22 开班",
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
              start: "2025-08-05 开班",
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
              start: "2025-08-12 开班",
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
              start: "2025-09-06 开班",
              teacher: "协会专家委员会 · 12 位行业大咖",
              price: 19800,
              origin: 25800,
              quota: "限招 20 人 · 已报 6 人",
              tags: ["游学考察", "私董会", "资源对接"],
              hot: true,
            },
          ].map((c) => (
            <div key={c.title} className="group relative bg-white rounded-2xl overflow-hidden border border-blue-50 shadow-sm hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1 transition-all cursor-pointer flex flex-col">
              <div className="relative h-32 bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 overflow-hidden">
                <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, white 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
                {c.hot && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/95 text-orange-600 text-xs font-bold rounded-md flex items-center gap-1 shadow">
                    <Flame className="w-3 h-3" /> 热报
                  </div>
                )}
                <div className="absolute top-3 right-3 px-2 py-0.5 bg-black/30 backdrop-blur text-white text-[11px] rounded">{c.level}</div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{c.place}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{c.days}</span>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h4 className="font-semibold text-slate-800 group-hover:text-orange-600 transition line-clamp-2 min-h-[48px]">{c.title}</h4>
                <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5"><User className="w-3.5 h-3.5" />{c.teacher}</div>
                <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{c.start}</div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {c.tags.map((t) => (
                    <span key={t} className="px-2 py-0.5 text-[11px] bg-blue-50 text-blue-600 rounded">{t}</span>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-dashed border-slate-100 flex items-end justify-between">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[11px] text-orange-500">¥</span>
                      <span className="text-2xl font-bold text-orange-600">{c.price.toLocaleString()}</span>
                      <span className="text-xs text-slate-400 line-through">¥{c.origin.toLocaleString()}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{c.quota}</div>
                  </div>
                  <button className="px-4 py-2 text-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition shadow shadow-orange-500/30">
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
function JobsView() {
  const [filters, setFilters] = useState({ cat: "运营类", city: "武汉市", salary: "10-20K", edu: "本科" });
  const cities = ["不限", "武汉市", "黄石市", "十堰市", "宜昌市", "襄阳市", "鄂州市", "荆门市", "孝感市", "荆州市", "黄冈市"];
  const cats = ["不限", "运营类", "产品研发", "供应链", "市场营销", "技术开发", "海外BD"];
  const salaries = ["不限", "5K以下", "5-10K", "10-20K", "20-30K", "30K以上"];
  const edus = ["不限", "大专", "本科", "硕士及以上"];

  const jobs = [
    { title: "供应链管理负责人", company: "武汉华天境外贸易有限公司", hot: true, salary: "20K以上", exp: "5年以上", edu: "本科", tags: ["双休", "五险一金", "年终奖", "交通补贴", "海外出差"] },
    { title: "高级产品研发经理 (3C 出海)", company: "湖北安克创新科技", hot: true, salary: "25-40K", exp: "3-5年", edu: "本科", tags: ["股票期权", "弹性工作", "六险一金", "免费三餐"] },
    { title: "亚马逊运营专员", company: "武汉象豹跨境电商", hot: false, salary: "10K以上", exp: "1-3年", edu: "大专", tags: ["双休", "五险一金", "提成丰厚", "晋升通道"] },
    { title: "TikTok 海外直播主播", company: "黄石云途出海 MCN", hot: true, salary: "15-30K", exp: "经验不限", edu: "学历不限", tags: ["底薪+提成", "包住宿", "出国机会", "新人扶持"] },
    { title: "跨境支付合规专员", company: "PingPong 武汉分公司", hot: false, salary: "12-18K", exp: "3-5年", edu: "本科", tags: ["双休", "六险一金", "餐补", "节日福利"] },
    { title: "海外仓运营主管 (美西)", company: "宜昌丝路云仓物流", hot: true, salary: "18-25K", exp: "3年以上", edu: "本科", tags: ["外派津贴", "签证办理", "包住宿", "年假20天"] },
  ];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 border border-blue-50 shadow-sm space-y-4">
        {[
          { label: "职位类别", key: "cat" as const, opts: cats },
          { label: "工作地点", key: "city" as const, opts: cities },
          { label: "薪资范围", key: "salary" as const, opts: salaries },
          { label: "学历要求", key: "edu" as const, opts: edus },
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
        {/* Jobs list */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
          {jobs.map((j) => (
            <div key={j.title} className="group bg-white rounded-2xl p-5 border border-blue-50 shadow-sm hover:shadow-lg hover:shadow-blue-500/10 hover:border-blue-200 transition-all cursor-pointer">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-slate-800 text-lg group-hover:text-blue-600 transition">{j.title}</h4>
                    {j.hot && <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-red-50 text-red-500 text-xs rounded font-medium"><Flame className="w-3 h-3" />热招</span>}
                  </div>
                  <div className="mt-1.5 text-sm text-slate-500 flex items-center gap-3 flex-wrap">
                    <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" />{j.company}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{filters.city === "不限" ? "湖北" : filters.city}</span>
                    <span>·</span>
                    <span>{j.exp}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5" />{j.edu}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-orange-500">{j.salary}</div>
                  <button className="mt-2 px-4 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition font-medium opacity-0 group-hover:opacity-100">立即投递</button>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-50 flex flex-wrap gap-2">
                {j.tags.map((t) => (
                  <span key={t} className="px-2.5 py-0.5 bg-slate-50 text-slate-500 text-xs rounded">{t}</span>
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
              <div className="text-xs font-medium text-white/80 mb-1">官方权威 · 政府支持</div>
              <h4 className="text-xl font-bold mb-1">湖北省丝路电商人才</h4>
              <div className="text-sm text-white/90 mb-5">小程序 · 精选职位推送</div>
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
              <div className="mt-4 text-center text-sm text-white/90">打开微信扫一扫<br />查看更多精选职位</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-blue-50 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><Star className="w-4 h-4 text-orange-500" />求职热门企业</h4>
            <div className="space-y-3">
              {["武汉华天境外贸易", "湖北安克创新", "PingPong 跨境支付", "宜昌丝路云仓"].map((c, i) => (
                <div key={c} className="flex items-center gap-3 group cursor-pointer">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 grid place-items-center text-blue-600 font-bold text-sm">{c[0]}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-800 group-hover:text-blue-600 transition truncate">{c}</div>
                    <div className="text-xs text-slate-400">在招 {12 - i * 2} 个职位</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
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
    { title: "关于举办 2025 年湖北省跨境电商创业大赛的通知", date: "2025-05-20" },
    { title: "丝路云课堂 6 月份课程更新与直播排期公告", date: "2025-05-18" },
    { title: "RCEP 原产地证签发培训班开始报名（限 50 人）", date: "2025-05-15" },
  ];
  const news = [
    { d: 24, m: 12, y: 2025, title: "2025 第三届中国（武汉）国际跨境电商博览会启幕", desc: "本届展会聚焦 RCEP 机遇，吸引来自 38 个国家和地区的近 800 家企业参展，展览面积达 5 万平方米。" },
    { d: 18, m: 12, y: 2025, title: "湖北自贸区跨境电商出口同比增长 42.6%", desc: "据武汉海关统计，今年前 11 月湖北自贸区跨境电商进出口额突破 280 亿元，其中 B2B 出口表现亮眼。" },
    { d: 12, m: 12, y: 2025, title: "TikTok Shop 美区半托管模式正式上线 跨境卖家迎新红利", desc: "新模式降低了中小卖家进入门槛，平台承担物流和售后服务，预计将带动新一波出海热潮。" },
    { d: 5, m: 12, y: 2025, title: "光谷跨境电商产业园获评\"国家电子商务示范基地\"", desc: "园区聚集了 320 余家跨境电商企业，2024 年实现交易额超 180 亿元，带动就业 2.8 万人。" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-7 rounded-2xl overflow-hidden shadow-sm border border-blue-50 relative h-[360px] bg-gradient-to-br from-blue-700 via-blue-500 to-cyan-400 group cursor-pointer">
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: "radial-gradient(circle at 30% 40%, white 1.5px, transparent 1.5px), radial-gradient(circle at 70% 70%, white 1px, transparent 1px)",
            backgroundSize: "80px 80px, 50px 50px",
          }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute top-4 left-4 px-2.5 py-1 bg-red-500 text-white text-xs font-semibold rounded">置顶</div>
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="text-xs text-white/80 mb-2 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" /> 2025-05-22 · 协会要闻
            </div>
            <h3 className="text-2xl font-bold mb-2 group-hover:translate-x-1 transition">武汉市跨境电商协会与马来西亚槟城工商总会签署战略合作备忘录</h3>
            <p className="text-sm text-white/80 line-clamp-2">双方将在跨境电商人才培养、海外仓共建、东盟市场拓展等领域开展深度合作，共同推动 RCEP 框架下的数字贸易发展。</p>
          </div>
          <div className="absolute bottom-6 right-6 flex gap-1.5">
            {[1, 2, 3, 4].map((i) => <div key={i} className={`h-1.5 rounded-full transition-all ${i === 1 ? "w-6 bg-white" : "w-1.5 bg-white/50"}`} />)}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-5 bg-white rounded-2xl p-5 border border-blue-50 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2"><Bell className="w-4 h-4 text-blue-600" />通知公告</h3>
            <a className="text-xs text-blue-600 cursor-pointer hover:underline">更多</a>
          </div>
          <div className="space-y-1">
            {notices.map((n, i) => (
              <a key={n.title} className="flex items-start gap-3 py-3 border-b border-slate-50 last:border-0 group cursor-pointer">
                <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xs grid place-items-center font-bold flex-shrink-0 mt-0.5">{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-slate-700 group-hover:text-blue-600 transition line-clamp-2">{n.title}</div>
                </div>
                <div className="text-xs text-slate-400 flex-shrink-0 mt-0.5">{n.date}</div>
              </a>
            ))}
          </div>
          <button className="w-full mt-3 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition flex items-center justify-center gap-1">
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
            <article key={n.title} className="group bg-white rounded-2xl p-5 border border-blue-50 shadow-sm hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-0.5 transition-all cursor-pointer flex gap-4">
              <div className="w-20 flex-shrink-0 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white grid place-items-center text-center py-3 shadow-md shadow-blue-500/30">
                <div>
                  <div className="text-2xl font-bold leading-none">{String(n.d).padStart(2, "0")}/{String(n.m).padStart(2, "0")}</div>
                  <div className="text-[10px] mt-1 text-white/80">{n.y}</div>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-slate-800 group-hover:text-blue-600 transition line-clamp-2">{n.title}</h4>
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

function ExamView() {
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
      next: "2025-07-12",
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
      next: "2025-07-20",
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
      next: "2025-08-03",
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
      next: "2025-08-15",
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
    { q: "证书在全国范围内是否通用？", a: "本认证由湖北省商务厅指导、武汉市跨境电子商务协会颁发，全国跨境电商行业互认，可在「人社部国家职业资格证书查询系统」官网验证。" },
    { q: "考试形式与补考政策？", a: "全程线上机考（含人脸识别 + 双机位监考），未通过可在 6 个月内免费补考一次，补考仅需在系统内重新预约考期。" },
    { q: "是否提供企业团报与发票？", a: "5 人以上团报享 8.5 折，20 人以上享 7 折并支持上门定制培训，开具正规增值税专用发票。" },
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
              覆盖运营、直播、合规、供应链四大方向，权威认证 · 全国通用 · 名企直推。2025 年度第三批考试报名通道已开启。
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 transition font-semibold text-sm shadow-lg shadow-orange-500/30 flex items-center gap-2">
                立即报名 <ArrowRight className="w-4 h-4" />
              </button>
              <button className="px-5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur transition font-medium text-sm flex items-center gap-2">
                <Download className="w-4 h-4" /> 下载考试大纲
              </button>
            </div>
          </div>
          <div className="md:col-span-4 grid grid-cols-2 gap-3">
            {stats.slice(0, 4).map((s) => (
              <div key={s.l} className="bg-white/10 backdrop-blur rounded-xl p-3 border border-white/15">
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
          <button className="hidden md:flex items-center gap-1 text-sm text-blue-600 hover:gap-2 transition-all font-medium">
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
                  <span className="text-3xl font-black text-blue-100 group-hover:text-blue-200 transition">0{i + 1}</span>
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
              <Award className="w-5 h-5 text-blue-600" /> 在招认证 · 2025 年度第三批
            </h2>
            <p className="text-sm text-slate-500 mt-1">4 个认证方向 · 覆盖跨境电商核心岗位能力模型</p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            {["全部方向", "运营", "直播", "合规", "供应链"].map((c, i) => (
              <button key={c} className={`px-3 py-1.5 rounded-full transition ${i === 0 ? "bg-blue-600 text-white shadow shadow-blue-500/30" : "bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600"}`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {certs.map((c) => (
            <article key={c.code} className="group relative rounded-2xl border border-blue-50 bg-gradient-to-br from-white to-blue-50/40 p-5 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-100/60 hover:-translate-y-0.5 transition-all">
              {c.hot && (
                <div className="absolute -top-2 -right-2 px-2.5 py-1 rounded-lg bg-gradient-to-r from-orange-500 to-rose-500 text-white text-[10px] font-bold flex items-center gap-1 shadow-lg shadow-orange-500/30">
                  <Flame className="w-3 h-3" /> 热门
                </div>
              )}
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${c.levelColor} grid place-items-center text-white shadow-lg shrink-0`}>
                  <Award className="w-7 h-7" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded bg-gradient-to-r ${c.levelColor} text-white`}>{c.level}</span>
                    <span className="text-[11px] text-slate-400 font-mono">{c.code}</span>
                  </div>
                  <h3 className="mt-1.5 font-bold text-slate-800 group-hover:text-blue-600 transition leading-snug">{c.name}</h3>
                  <p className="mt-1.5 text-xs text-slate-500 leading-relaxed line-clamp-2">{c.desc}</p>
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
                  <div className="text-sm font-semibold text-blue-600 mt-0.5">{(c.enrolled / 1000).toFixed(1)}k</div>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {c.tags.map((t) => (
                  <span key={t} className="text-[11px] px-2 py-0.5 rounded-md bg-blue-50 text-blue-600">#{t}</span>
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
                <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium hover:from-blue-600 hover:to-blue-700 shadow-md shadow-blue-500/30 hover:shadow-lg transition-all flex items-center gap-1 group-hover:gap-2">
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
            <Layers className="w-5 h-5 text-blue-600" /> 2025 年度考期安排
          </h2>
          <div className="mt-5 relative">
            <div className="absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-blue-200 via-blue-100 to-transparent" />
            {[
              { d: "07/12", s: "周六", t: "第三批 · 运营 / 直播方向", st: "报名中", c: "bg-emerald-500" },
              { d: "08/03", s: "周日", t: "第三批 · 合规 / 供应链方向", st: "报名中", c: "bg-emerald-500" },
              { d: "10/18", s: "周六", t: "第四批 · 全方向开考", st: "预约中", c: "bg-blue-500" },
              { d: "12/13", s: "周六", t: "年度补考 · 全方向", st: "未开放", c: "bg-slate-400" },
            ].map((e) => (
              <div key={e.d} className="relative pl-10 pb-5 last:pb-0 group">
                <div className={`absolute left-1.5 top-1 w-3 h-3 rounded-full ${e.c} ring-4 ring-white shadow`} />
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-slate-800">{e.d}</span>
                    <span className="text-xs text-slate-400">{e.s}</span>
                  </div>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full text-white ${e.c}`}>{e.st}</span>
                </div>
                <div className="text-sm text-slate-600 mt-0.5">{e.t}</div>
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
              <details key={i} className="group bg-white/10 backdrop-blur rounded-xl p-3 border border-white/10 hover:bg-white/15 transition">
                <summary className="cursor-pointer text-sm font-medium flex items-center justify-between list-none">
                  <span className="flex items-center gap-2"><span className="text-orange-300">Q{i + 1}</span> {f.q}</span>
                  <ChevronRight className="w-4 h-4 transition group-open:rotate-90" />
                </summary>
                <p className="mt-2 text-xs text-blue-50/90 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
          <button className="mt-5 w-full py-2.5 rounded-xl bg-white text-blue-700 font-semibold text-sm hover:bg-orange-300 hover:text-white transition flex items-center justify-center gap-2">
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
    { y: "2016", t: "协会成立", d: "武汉市跨境电子商务协会经市民政局批准成立，首批会员单位 86 家。" },
    { y: "2019", t: "国家级示范基地落地光谷", d: "推动光谷跨境电商产业园获批国家电子商务示范基地。" },
    { y: "2022", t: "丝路云课堂上线", d: "联合 12 家头部企业共建一站式人才培训与就业服务平台。" },
    { y: "2024", t: "三大实训中心建成", d: "武汉光谷、武汉汉阳、武汉江岸三大线下实训中心同步运营。" },
    { y: "2025", t: "服务学员突破 5 万人", d: "累计认证持证人才 32,860 名，对接岗位 18,600+ 个。" },
  ];

  const partners = [
    "亚马逊全球开店", "TikTok Shop", "阿里国际站", "速卖通", "Shopify",
    "PingPong", "连连国际", "安克创新", "斑马技术", "极兔国际", "云途物流", "谷歌大中华区",
  ];

  const centers = [
    { name: "武汉光谷实训中心", addr: "东湖高新区光谷大道 77 号 · 光谷跨境电商产业园 B 座 5F", area: "3,200㎡", seats: "320 工位", focus: "TikTok 直播 · 亚马逊运营" },
    { name: "武汉汉阳实训中心", addr: "汉阳区龙阳大道 168 号 · 武汉跨境电商人才港 4F", area: "2,400㎡", seats: "240 工位", focus: "独立站 · 海外社媒营销" },
    { name: "武汉江岸实训中心", addr: "江岸区解放大道 1158 号 · 长江紫都 T2 18F", area: "2,000㎡", seats: "200 工位", focus: "RCEP 关务 · 供应链管理" },
  ];

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 text-white p-8 md:p-12 shadow-xl shadow-blue-500/20">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="relative max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-xs font-medium mb-4">
            <ShieldCheck className="w-3.5 h-3.5" /> 武汉市跨境电子商务协会 · 官方授权
          </div>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight">让每一位湖北青年<br />都能搭上跨境出海的快车</h1>
          <p className="mt-4 text-blue-50/90 leading-relaxed max-w-2xl">
            丝路云课堂是由武汉市跨境电子商务协会发起、湖北省商务厅指导、联合 320 余家头部跨境企业共建的"培训—认证—实训—就业"一站式人才服务平台，
            旨在为湖北省乃至中部地区培育新一代跨境电商数字贸易人才。
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 transition font-semibold text-sm shadow-lg shadow-orange-500/30 flex items-center gap-1.5">
              <Download className="w-4 h-4" /> 下载平台介绍手册
            </button>
            <button className="px-5 py-2.5 rounded-xl bg-white/15 backdrop-blur hover:bg-white/25 transition font-medium text-sm border border-white/30 flex items-center gap-1.5">
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
            <div key={s.l} className="bg-white/15 backdrop-blur rounded-2xl p-4 border border-white/20">
              <div className="text-2xl md:text-3xl font-bold">{s.n}</div>
              <div className="text-xs text-blue-50/80 mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { icon: Target, t: "使命", d: "以数字贸易教育赋能产业，让湖北跨境电商人才供给走在全国前列。", c: "from-blue-500 to-cyan-500" },
          { icon: Sparkles, t: "愿景", d: "成为中部地区最具影响力的跨境电商人才孵化与产教融合枢纽。", c: "from-orange-500 to-red-500" },
          { icon: Trophy, t: "价值观", d: "实战为本 · 学员第一 · 拥抱变化 · 长期主义。", c: "from-emerald-500 to-teal-500" },
        ].map(({ icon: Ic, t, d, c }) => (
          <div key={t} className="bg-white rounded-2xl p-6 border border-blue-50 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c} grid place-items-center text-white mb-4 shadow-md`}>
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
            <p className="text-sm text-slate-500 mt-1">总面积 7,600㎡ · 760 个标准实操工位 · 7×12 小时开放</p>
          </div>
          <a className="hidden md:flex text-sm text-blue-600 hover:text-blue-700 cursor-pointer items-center gap-1">预约参观 <ArrowRight className="w-3.5 h-3.5" /></a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {centers.map((c, i) => (
            <div key={c.name} className="group relative rounded-2xl p-5 border border-blue-50 bg-gradient-to-br from-blue-50/60 to-white hover:shadow-lg hover:-translate-y-0.5 transition">
              <div className="absolute top-5 right-5 w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white grid place-items-center font-bold text-sm shadow">0{i + 1}</div>
              <h4 className="font-bold text-slate-800 text-lg pr-12">{c.name}</h4>
              <div className="mt-3 space-y-2 text-sm text-slate-600">
                <div className="flex items-start gap-2"><MapPin className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" /><span className="leading-relaxed">{c.addr}</span></div>
                <div className="flex items-center gap-2"><Layers className="w-4 h-4 text-blue-500" /><span>{c.area} · {c.seats}</span></div>
                <div className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-blue-500" /><span>主攻方向：{c.focus}</span></div>
              </div>
              <button className="mt-4 w-full py-2 rounded-lg bg-white border border-blue-100 text-blue-600 text-sm font-medium hover:bg-blue-600 hover:text-white hover:border-blue-600 transition">查看实训环境</button>
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
            <div key={t} className="rounded-xl p-4 border border-blue-50 hover:bg-blue-50/40 hover:border-blue-200 transition cursor-pointer text-center">
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
              <div key={m.y} className={`relative md:grid md:grid-cols-2 md:gap-10 ${i % 2 === 0 ? "" : "md:[&>*:first-child]:order-2"}`}>
                <div className={`pl-8 md:pl-0 ${i % 2 === 0 ? "md:text-right md:pr-10" : "md:pl-10"}`}>
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
            <div key={p} className="aspect-[3/1] rounded-xl bg-gradient-to-br from-blue-50 to-white border border-blue-50 grid place-items-center text-xs md:text-sm font-medium text-slate-700 hover:shadow-md hover:text-blue-600 transition cursor-pointer text-center px-2">
              {p}
            </div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-blue-900 to-blue-700 text-white p-8 md:p-10">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(45deg, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="relative grid md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2">
            <h3 className="text-2xl md:text-3xl font-bold">企业 · 高校 · 政府 合作请联系我们</h3>
            <p className="mt-3 text-blue-100/80 max-w-xl">无论您是希望招募跨境人才的企业、共建专业的高校，还是希望落地培训项目的政府部门，我们都将提供定制化的解决方案。</p>
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-blue-50"><Phone className="w-4 h-4" /> 027-8888 6688</div>
              <div className="flex items-center gap-2 text-blue-50"><MessageCircle className="w-4 h-4" /> 商务合作：silkroad@whcbec.org</div>
              <div className="flex items-center gap-2 text-blue-50"><MapPin className="w-4 h-4" /> 武汉东湖高新区光谷大道 77 号</div>
              <div className="flex items-center gap-2 text-blue-50"><Clock className="w-4 h-4" /> 周一至周日 9:00 - 21:00</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 text-center text-slate-700">
            <div className="w-32 h-32 mx-auto rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 grid place-items-center">
              <QrCode className="w-16 h-16 text-blue-600" />
            </div>
            <div className="mt-3 text-sm font-semibold text-slate-800">扫码添加专属顾问</div>
            <div className="text-xs text-slate-500 mt-1">领取《跨境电商人才白皮书 2025》</div>
          </div>
        </div>
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
      <button className="mt-6 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition">敬请期待</button>
    </div>
  );
}
