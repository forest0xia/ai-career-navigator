// i18n — language detection, switching, and translation lookup
// URL param: ?lang=en or ?lang=cn
// Supports: en (English), cn (简体中文)

const I18N = {
  _lang: "en",
  _strings: {},

  init() {
    // Detect from URL param, then localStorage, then browser
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get("lang");
    const stored = localStorage.getItem("ai_nav_lang");
    const browserLang = navigator.language?.startsWith("zh") ? "cn" : "en";
    this._lang = urlLang || stored || browserLang;
    if (!LANGS[this._lang]) this._lang = "en";
    this._strings = LANGS[this._lang];
    localStorage.setItem("ai_nav_lang", this._lang);
    document.documentElement.lang = this._lang === "cn" ? "zh-CN" : "en";
  },

  t(key) { return this._strings[key] || LANGS.en[key] || key; },
  lang() { return this._lang; },

  setLang(lang) {
    const params = new URLSearchParams(window.location.search);
    params.set("lang", lang);
    window.location.search = params.toString();
  }
};

const LANGS = {
  en: {
    // Header
    logo: "AI Career Navigator",
    // Welcome
    welcome_title: "Discover Your Path in the AI Era",
    welcome_subtitle: "A research-backed assessment to help you understand how AI reshapes your career — and concrete steps you can take starting this week.",
    feature_analysis: "Personalized Analysis",
    feature_analysis_desc: "Tailored to your role, skills, and goals",
    feature_exposure: "AI Exposure Score",
    feature_exposure_desc: "How AI impacts your specific work",
    feature_plan: "Action Plan",
    feature_plan_desc: "Concrete how-to steps with resources",
    research_note: "Built on research from:",
    research_sources: "World Economic Forum Future of Jobs Report 2025, Forbes Career Strategy, Deloitte Human Capital Trends 2025, and current labor market data.",
    time_note: "⏱ Takes about 6–8 minutes · Your results include community comparison data",
    btn_begin: "Begin Assessment",
    // Navigation
    btn_back: "← Back",
    btn_next: "Next →",
    btn_results: "See Results →",
    // Results
    results_title: "Your AI Career Profile",
    impact_title: "📊 AI Impact Analysis",
    exposure_label: "AI Exposure",
    readiness_label: "Your Readiness",
    strength_title: "🧬 Your Strength Profile",
    community_title: "👥 Community Comparison",
    community_desc: "How your profile compares to {n} other people who've taken this assessment.",
    stat_total: "Total Assessments",
    stat_exposure: "Avg AI Exposure",
    stat_readiness: "Avg Readiness",
    common_archetype: "Most common archetype:",
    readiness_dist: "Readiness distribution:",
    readiness_strong: "well-positioned",
    readiness_building: "building",
    readiness_early: "early stage",
    toolkit_title: "🧰 Your AI Toolkit",
    toolkit_many: "That's a strong toolkit — focus on going deeper with your top 2–3 rather than adding more.",
    toolkit_mid: "Good breadth. Consider mastering 1–2 domain-specific tools to differentiate yourself.",
    toolkit_few: "Consider expanding your toolkit with domain-specific tools relevant to your field.",
    tools_title: "🛠️ Most Popular AI Tools Across All Users",
    tools_desc: "Based on {n} users. Tools you selected are highlighted.",
    action_title: "🎯 Your Action Plan — With Specific How-To Steps",
    action_desc: "Each action includes concrete next steps and resources you can start with this week.",
    skills_title: "📚 Skills to Develop",
    roles_title: "💼 Roles to Explore",
    insight_title: "💡 Key Insight",
    insight_text: 'The AI era doesn\'t have a single "right answer." Your profile suggests you\'re best positioned as <strong style="color:var(--accent2)">{archetype}</strong> — but the most important thing is intentionality. The WEF projects 170 million new roles by 2030. People who actively choose their path through the AI transition consistently outperform those who wait and react. Start with action #1 above this week. Small, consistent steps compound into transformative career moves.',
    insight_sources: "Sources: World Economic Forum Future of Jobs Report 2025, Forbes Career Strategy 2026, Deloitte Human Capital Trends 2025, ManpowerGroup Global Talent Shortage Survey 2026.",
    btn_feedback: "📝 Rate This Assessment",
    btn_retake: "↺ Retake",
    btn_export: "📥 Export All Data",
    // Feedback
    fb_title: "How useful was this assessment?",
    fb_desc: "Your feedback helps us improve. Rate each dimension:",
    fb_accuracy: "Accuracy of your archetype",
    fb_actionability: "Actionability of the advice",
    fb_insight: "Quality of insights & data",
    fb_overall: "Overall usefulness",
    fb_comment: "Overall comments (optional):",
    fb_placeholder: "What was most/least helpful?",
    fb_skip: "Skip",
    fb_submit: "Submit Feedback",
    // Dimensions
    dim_adaptability: "Adaptability",
    dim_technical: "Technical Depth",
    dim_creative: "Creative Thinking",
    dim_leadership: "Leadership",
    dim_aiReadiness: "AI Readiness",
    dim_humanEdge: "Human Edge",
    // Chart legend
    legend_you: "You",
    legend_community: "Community Average",
    // Misc
    how_label: "How:",
    resource_link: "→ Resource",
    using_tools: "You're using {n} AI tool(s).",
  },

  cn: {
    logo: "AI 职业导航",
    welcome_title: "探索你在 AI 时代的发展路径",
    welcome_subtitle: "基于权威研究的职业评估，帮助你了解 AI 如何重塑你的职业——以及本周就能开始的具体行动。",
    feature_analysis: "个性化分析",
    feature_analysis_desc: "根据你的角色、技能和目标量身定制",
    feature_exposure: "AI 影响评分",
    feature_exposure_desc: "AI 对你具体工作的影响程度",
    feature_plan: "行动计划",
    feature_plan_desc: "附带资源的具体操作步骤",
    research_note: "研究数据来源：",
    research_sources: "世界经济论坛《2025未来就业报告》、福布斯职业策略、德勤《2025人力资本趋势》及最新劳动力市场数据。",
    time_note: "⏱ 大约需要 6–8 分钟 · 结果包含社区对比数据",
    btn_begin: "开始评估",
    btn_back: "← 返回",
    btn_next: "下一题 →",
    btn_results: "查看结果 →",
    results_title: "你的 AI 职业画像",
    impact_title: "📊 AI 影响分析",
    exposure_label: "AI 影响度",
    readiness_label: "你的准备度",
    strength_title: "🧬 你的优势画像",
    community_title: "👥 社区对比",
    community_desc: "你的画像与其他 {n} 位评估者的对比。",
    stat_total: "总评估数",
    stat_exposure: "平均 AI 影响度",
    stat_readiness: "平均准备度",
    common_archetype: "最常见类型：",
    readiness_dist: "准备度分布：",
    readiness_strong: "准备充分",
    readiness_building: "正在积累",
    readiness_early: "起步阶段",
    toolkit_title: "🧰 你的 AI 工具箱",
    toolkit_many: "工具箱很丰富——建议深耕最常用的 2–3 个，而非继续增加。",
    toolkit_mid: "覆盖面不错。建议精通 1–2 个领域专用工具来建立差异化优势。",
    toolkit_few: "建议扩展你的工具箱，加入与你领域相关的专用 AI 工具。",
    tools_title: "🛠️ 所有用户最常用的 AI 工具",
    tools_desc: "基于 {n} 位用户的数据。你选择的工具已高亮显示。",
    action_title: "🎯 你的行动计划——附具体操作步骤",
    action_desc: "每个行动都包含本周就能开始的具体步骤和资源。",
    skills_title: "📚 建议发展的技能",
    roles_title: "💼 值得探索的角色",
    insight_title: "💡 核心洞察",
    insight_text: 'AI 时代没有唯一的"正确答案"。你的画像表明你最适合作为 <strong style="color:var(--accent2)">{archetype}</strong>——但最重要的是主动选择。世界经济论坛预测到 2030 年将新增 1.7 亿个岗位。主动规划 AI 转型路径的人，始终优于被动等待的人。从上面的行动 #1 开始，本周就行动起来。',
    insight_sources: "数据来源：世界经济论坛《2025未来就业报告》、福布斯2026职业策略、德勤《2025人力资本趋势》、万宝盛华2026全球人才短缺调查。",
    btn_feedback: "📝 评价本次评估",
    btn_retake: "↺ 重新评估",
    btn_export: "📥 导出全部数据",
    fb_title: "这次评估对你有帮助吗？",
    fb_desc: "你的反馈帮助我们改进。请对以下维度评分：",
    fb_accuracy: "类型判定的准确性",
    fb_actionability: "建议的可操作性",
    fb_insight: "洞察与数据的质量",
    fb_overall: "整体实用性",
    fb_comment: "补充评论（可选）：",
    fb_placeholder: "哪些最有帮助/最没帮助？",
    fb_skip: "跳过",
    fb_submit: "提交反馈",
    dim_adaptability: "适应力",
    dim_technical: "技术深度",
    dim_creative: "创造力",
    dim_leadership: "领导力",
    dim_aiReadiness: "AI 就绪度",
    dim_humanEdge: "人类优势",
    legend_you: "你",
    legend_community: "社区平均",
    how_label: "怎么做：",
    resource_link: "→ 资源",
    using_tools: "你正在使用 {n} 个 AI 工具。",
  }
};
