// Scoring engine v3 — 6-axis percentage scoring, 7-level system, adaptive branching, guardrails

const AXES = ['adoption', 'mindset', 'craft', 'tech_depth', 'reliability', 'agents'];
const AXIS_DESCRIPTIONS = {
  adoption: { en: "How embedded AI is in your life and work — frequency, breadth, and dependency.", cn: "AI 在你生活和工作中的融入程度 —— 使用频率、覆盖范围和依赖程度。" },
  mindset: { en: "Curiosity, confidence, motivation direction, trust posture, and learning habits.", cn: "好奇心、自信度、动力方向、信任姿态和学习习惯。" },
  craft: { en: "Day-to-day skill — iteration, structure, reuse, templates, turning wins into workflows.", cn: "日常技艺 —— 迭代、结构化、复用、模板化，把成功经验转化为工作流。" },
  tech_depth: { en: "Technical integration — extensions, automation, APIs, product integration.", cn: "技术集成能力 —— 扩展、自动化、API、产品集成。" },
  reliability: { en: "Correctness and consistency — verification, structured outputs, eval, monitoring.", cn: "正确性和一致性 —— 验证、结构化输出、评估、监控。" },
  agents: { en: "Autonomy and orchestration — multi-step tool use, agent loops, real production usage.", cn: "自主性和编排能力 —— 多步骤工具使用、智能体循环、真实生产使用。" }
};

// Weights rebalanced for 12-question set:
// adoption (3 Qs: a1, a2, impact+self), mindset (2: m1, m2), craft (2: c1, c3+self),
// tech_depth (1: t1), reliability (1: c3 cross-score), agents (2: g1, impact)
const AXIS_WEIGHTS = { adoption: 0.15, mindset: 0.15, craft: 0.25, tech_depth: 0.10, reliability: 0.15, agents: 0.20 };

// === BRANCHING ===

// Calibration questions: a1_frequency, m2_confidence, c1_repeat
function getCalibrationIds() { return ['domain', 'a1_frequency', 'm2_confidence', 'c1_repeat']; }

function determineScanType(answers) {
  const calIds = ['a1_frequency', 'm2_confidence', 'c1_repeat'];
  let levelSum = 0, count = 0;
  for (const qid of calIds) {
    const idx = answers[qid];
    if (idx === undefined) continue;
    const q = QUESTIONS.find(q => q.id === qid);
    if (!q) continue;
    levelSum += q.options[idx].level || 0;
    count++;
  }
  const avg = count ? levelSum / count : 0;
  if (avg <= 1.5) return 'quick';
  if (avg >= 3.5) return 'advanced';
  return 'core';
}

function getAdaptiveQuestions(scanType) {
  const cal = QUESTIONS.filter(q => getCalibrationIds().includes(q.id));
  const tools = QUESTIONS.filter(q => q.id === 'ai_tools');
  const selfId = QUESTIONS.filter(q => q.id === 'self_identify');
  const impact = QUESTIONS.filter(q => q.id === 'impact_scope');

  if (scanType === 'quick') {
    // Quick: calibration + m1_reaction + self_identify + impact + tools (~8 questions)
    const extra = QUESTIONS.filter(q => ['m1_reaction'].includes(q.id));
    return [...cal, ...extra, ...selfId, ...impact, ...tools];
  }

  if (scanType === 'advanced') {
    return [...QUESTIONS];
  }

  // Core: all non-calibration questions except tools/self/impact (already included)
  const rest = QUESTIONS.filter(q =>
    !getCalibrationIds().includes(q.id) &&
    q.id !== 'ai_tools' && q.id !== 'self_identify' && q.id !== 'impact_scope'
  );

  const pool = [...cal, ...rest, ...selfId, ...impact, ...tools];
  const seen = new Set();
  return pool.filter(q => { if (seen.has(q.id)) return false; seen.add(q.id); return true; });
}

// === SCORING ===

function calculateScores(answers) {
  const points = {}, maxPoints = {};
  for (const a of AXES) { points[a] = 0; maxPoints[a] = 0; }
  let levelSum = 0, levelCount = 0;

  for (const [qid, ans] of Object.entries(answers)) {
    const q = QUESTIONS.find(q => q.id === qid);
    if (!q || !q.axes) continue;
    const idx = ans instanceof Set ? null : ans;
    if (idx === null || idx === undefined) continue;

    for (const [axis, pointsArr] of Object.entries(q.axes)) {
      if (!pointsArr || !AXES.includes(axis)) continue;
      const maxPossible = Math.max(...pointsArr);
      points[axis] += pointsArr[idx] || 0;
      maxPoints[axis] += maxPossible;
    }

    levelSum += q.options[idx]?.level || 0;
    levelCount++;
  }

  const axisScores = {};
  for (const a of AXES) {
    axisScores[a] = maxPoints[a] > 0 ? Math.round(Math.min(100, Math.max(0, (points[a] / maxPoints[a]) * 100))) : 0;
  }

  let overall = 0;
  for (const a of AXES) overall += (AXIS_WEIGHTS[a] || 0) * axisScores[a];
  overall = Math.round(overall);

  const avgLevel = levelCount ? levelSum / levelCount : 1;
  return { axisScores, overall, avgLevel, answeredCount: levelCount };
}

// === LEVEL DETERMINATION (7 levels) ===

const LEVELS = [
  { key: 'dabbler', min: 0, max: 14 },
  { key: 'prompter', min: 15, max: 28 },
  { key: 'collaborator', min: 29, max: 42 },
  { key: 'designer', min: 43, max: 56 },
  { key: 'system_builder', min: 57, max: 72 },
  { key: 'amplifier', min: 73, max: 87 },
  { key: 'visionary', min: 88, max: 100 }
];

function determineArchetype(scores) {
  let { overall, axisScores } = scores;

  // Guardrails
  if (axisScores.adoption <= 20 && axisScores.craft <= 20) {
    overall = Math.min(overall, 28); // cap at Prompter
  }
  if (axisScores.reliability >= 70 && axisScores.craft >= 60) {
    overall = Math.max(overall, 57); // floor at System Builder
  }
  if (axisScores.agents >= 75 && axisScores.reliability >= 60) {
    overall = Math.max(overall, 73); // floor at Amplifier
  }
  if (axisScores.agents >= 85 && axisScores.reliability >= 75 && axisScores.craft >= 70) {
    overall = Math.max(overall, 88); // floor at Visionary
  }

  scores.overall = overall;

  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (overall >= LEVELS[i].min) return LEVELS[i].key;
  }
  return 'dabbler';
}

// Cross-check stub (kept for API compatibility)
function applyCrossCheck(scores, answers) {
  return scores;
}

// === SENTIMENT ===

function calculateSentiment(answers) {
  const sent = { confidence: 0, anxiety: 0, motivation: 0 };
  for (const [qid, ans] of Object.entries(answers)) {
    const q = QUESTIONS.find(q => q.id === qid);
    if (!q?.sentiment && !q?.options?.[ans]?.sent) continue;
    const opt = q.options[ans];
    if (!opt?.sent) continue;
    for (const [k, v] of Object.entries(opt.sent)) sent[k] = (sent[k] || 0) + v;
  }
  return sent;
}

function getSentimentProfile(sent) {
  if (sent.anxiety >= 3) return sent.motivation >= 2 ? 'anxious_achiever' : 'cautious_observer';
  if (sent.confidence >= 5 && sent.motivation >= 6) return 'confident_builder';
  if (sent.confidence >= 3) return 'steady_optimizer';
  if (sent.motivation >= 4) return 'curious_explorer';
  return 'pragmatic_adopter';
}

const SENTIMENT_PROFILES = {
  anxious_achiever: { en: "Anxious Achiever", cn: "焦虑型行动者", desc_en: "You feel the pressure but channel it into action.", desc_cn: "你感受到压力，但把它转化为行动力。" },
  cautious_observer: { en: "Cautious Observer", cn: "谨慎观察者", desc_en: "You prefer to watch and learn before committing.", desc_cn: "你更喜欢先观察学习，再做决定。" },
  confident_builder: { en: "Confident Builder", cn: "自信构建者", desc_en: "You see AI as opportunity and you're building with it.", desc_cn: "你把 AI 视为机会，正在用它构建。" },
  steady_optimizer: { en: "Steady Optimizer", cn: "稳健优化者", desc_en: "You adopt AI methodically and improve continuously.", desc_cn: "你有条不紊地采用 AI，持续改进。" },
  curious_explorer: { en: "Curious Explorer", cn: "好奇探索者", desc_en: "High motivation drives your AI journey forward.", desc_cn: "强烈的好奇心驱动你的 AI 旅程。" },
  pragmatic_adopter: { en: "Pragmatic Adopter", cn: "务实采用者", desc_en: "You use AI when it clearly helps, no hype needed.", desc_cn: "AI 有明确帮助时你才用，不追风口。" }
};

// === EXPOSURE / READINESS ===

function computeAIExposure(answers) {
  const domainQ = QUESTIONS.find(q => q.id === 'domain');
  const domainExposure = domainQ?.options[answers['domain']]?.exposure || 55;
  const freqQ = QUESTIONS.find(q => q.id === 'a1_frequency');
  const freqLevel = freqQ?.options[answers['a1_frequency']]?.level || 1;
  return Math.min(100, Math.round(domainExposure + (freqLevel - 1) * 5));
}

function computeReadiness(axisScores) {
  return Math.min(100, Math.round(
    axisScores.craft * 0.3 + axisScores.adoption * 0.2 + axisScores.tech_depth * 0.2 +
    axisScores.reliability * 0.2 + axisScores.agents * 0.1
  ));
}

function getToolSelections(answers) {
  const toolQ = QUESTIONS.find(q => q.id === 'ai_tools');
  if (!toolQ || !answers.ai_tools || !(answers.ai_tools instanceof Set)) return [];
  return [...answers.ai_tools].map(i => toolQ.options[i]?.text).filter(Boolean);
}

function getDomainTags(answers) {
  const domainQ = QUESTIONS.find(q => q.id === 'domain');
  return domainQ?.options[answers['domain']]?.tags || [];
}

// === INSIGHT GENERATION ===

function generateSituation(axisScores, archetypeKey) {
  const cn = typeof isCN === 'function' && isCN();
  const { adoption, craft, tech_depth, reliability, agents, mindset } = axisScores;

  if (adoption >= 60 && craft < 40) return cn
    ? "你大量使用 AI，但在重复性上付出了代价 —— 每次都在重新发明轮子。模板化你的最佳实践会带来巨大回报。"
    : "You're using AI a lot, but paying a repeatability tax. Templating your best practices would unlock huge gains.";
  if (craft >= 60 && adoption < 40) return cn
    ? "你很有技巧，但 AI 还没有完全融入日常 —— 可能只用于高价值任务。扩大使用范围会放大你的优势。"
    : "You're skilled, but AI isn't fully embedded — likely used only for high-value tasks. Broadening usage would amplify your edge.";
  if (tech_depth >= 60 && reliability < 40) return cn
    ? "你能快速构建，但可靠性是安全扩展的瓶颈。加入评估和监控会让你的系统真正可用。"
    : "You can build fast; reliability is the limiter to safe scale. Adding eval and monitoring makes your systems production-ready.";
  if (reliability >= 60 && agents < 40) return cn
    ? "你运行得很安全；下一个杠杆是将步骤编排成自主循环。"
    : "You operate safely; next leverage is orchestrating steps into autonomous loops.";
  if (mindset >= 60 && craft < 40) return cn
    ? "你的心态很好 —— 好奇且有动力。现在需要把热情转化为可重复的技能。"
    : "Great mindset — curious and motivated. Now channel that energy into repeatable craft.";

  const arch = ARCHETYPES[archetypeKey];
  return cn && ARCHETYPES_CN[archetypeKey]?.desc ? ARCHETYPES_CN[archetypeKey].desc : (arch?.desc || '');
}

// Industry automation rates by domain tag
const INDUSTRY_AUTOMATION = {
  tech: { rate: 35, en: "In tech, ~35% of work hours are already automatable. Those who learn to automate first gain a compounding advantage.", cn: "在科技行业，约 35% 的工作时间已经可以自动化。先学会自动化的人会获得持续累积的优势。" },
  creative: { rate: 28, en: "In creative fields, ~28% of work is automatable — mostly production, not ideation. Using AI for the routine parts frees you for the work that matters most.", cn: "在创意领域，约 28% 的工作可以自动化 —— 主要是生产环节，而非创意本身。用 AI 处理常规部分，让你专注于最重要的工作。" },
  business: { rate: 30, en: "In business/operations, ~30% of tasks are automatable. Those who direct this change — rather than react to it — will define the next era.", cn: "在商业/运营领域，约 30% 的任务可以自动化。主导这个变化的人 —— 而非被动应对的人 —— 将定义下一个时代。" },
  regulated: { rate: 22, en: "In regulated fields, ~22% of work is automatable — slower but inevitable. Early movers gain disproportionate advantage when the wave arrives.", cn: "在受监管行业，约 22% 的工作可以自动化 —— 变化更慢但不可避免。当浪潮来临时，先行者获得的优势是不成比例的。" },
  physical: { rate: 15, en: "In physical/trades work, ~15% is automatable today, but AI is reshaping planning, logistics, and coordination fast. The edge goes to those who see it coming.", cn: "在实体/技工行业，目前约 15% 可以自动化，但 AI 正在快速重塑规划、物流和协调工作。优势属于那些提前看到趋势的人。" },
  early: { rate: 25, en: "You're entering a job market where AI fluency is the new baseline. Building AI skills now puts you ahead of most candidates before you even start.", cn: "你正在进入一个 AI 素养成为基本门槛的就业市场。现在就建立 AI 技能，让你在起跑前就领先大多数候选人。" }
};

// Level-based motivational message (7 levels)
function getLevelMotivation(archetypeKey) {
  const cn = typeof isCN === 'function' && isCN();
  const msgs = {
    dabbler: {
      en: "AI-skilled professionals earn 56% more on average. You haven't started yet — which means every small step from here has outsized ROI.",
      cn: "掌握 AI 技能的专业人士平均收入高出 56%。你还没开始 —— 这意味着从现在起每一小步都有超额回报。"
    },
    prompter: {
      en: "AI-skilled professionals earn 56% more on average. You've started — now learning to write better prompts will separate you from the 59% who'll need reskilling by 2030.",
      cn: "掌握 AI 技能的专业人士平均收入高出 56%。你已经开始了 —— 学会写更好的提示词会让你领先于 2030 年前需要再培训的 59% 的人。"
    },
    collaborator: {
      en: "You're ahead of most. AI-skilled professionals earn 56% more — and 40% of job skills will change by 2030. Turning your collaboration patterns into systems is your next multiplier.",
      cn: "你已经领先大多数人。AI 技能者收入高 56%，而到 2030 年 40% 的工作技能将改变。把你的协作模式系统化是下一个倍增器。"
    },
    designer: {
      en: "Your workflow thinking puts you in the top tier. Companies investing in AI workflows report 1.8x better financial results — and they need people like you.",
      cn: "你的工作流思维让你处于顶尖水平。投资 AI 工作流的公司财务表现好 1.8 倍 —— 他们需要你这样的人。"
    },
    system_builder: {
      en: "72% of employers can't find AI talent at your level. You build and operate AI systems — that's the supply they're desperate for, at a 56%+ salary premium.",
      cn: "72% 的雇主找不到你这个水平的 AI 人才。你能构建和运营 AI 系统 —— 这正是他们急需的能力，薪资溢价超过 56%。"
    },
    amplifier: {
      en: "72% of employers can't find AI talent — at your level, the premium is even higher. Your leverage now is making your entire organization more capable.",
      cn: "72% 的雇主找不到 AI 人才 —— 在你这个水平，溢价更高。你现在的杠杆是让整个组织变得更强。"
    },
    visionary: {
      en: "You're shaping the AI ecosystem itself. At this level, your impact comes from building infrastructure, frontier models, and foundations that enable thousands of others.",
      cn: "你在塑造 AI 生态本身。在这个水平，你的影响力来自构建基础设施、前沿模型和让成千上万人受益的底层能力。"
    }
  };
  return msgs[archetypeKey] ? (cn ? msgs[archetypeKey].cn : msgs[archetypeKey].en) : '';
}

function getIndustryInsight(tags) {
  const cn = typeof isCN === 'function' && isCN();
  for (const tag of (tags || [])) {
    if (INDUSTRY_AUTOMATION[tag]) return cn ? INDUSTRY_AUTOMATION[tag].cn : INDUSTRY_AUTOMATION[tag].en;
  }
  return '';
}

// Mission selection based on weakest axes
function generateMissions(axisScores, archetypeKey, answers) {
  const cn = typeof isCN === 'function' && isCN();
  const missions = [];
  const sorted = AXES.slice().sort((a, b) => axisScores[a] - axisScores[b]);

  const MISSION_BANK = {
    craft: {
      en: { title: "\uD83C\uDFAF Template Pack", why: "Repeatable quality beats one-off brilliance.", metric: "Create 2 templates, use each 3+ times in 2 weeks.", upgrade: "Convert one template into a shared team playbook." },
      cn: { title: "\uD83C\uDFAF 存好你的「万能提示词」", why: "能反复用的好方法，比每次灵光一现更有价值。", metric: "存 2 个好用的提示词模板，2 周内各复用 3 次以上。", upgrade: "把一个模板整理成同事也能直接用的版本。" }
    },
    reliability: {
      en: { title: "\uD83D\uDEE1\uFE0F Eval Lite", why: "You can't improve what you can't measure.", metric: "Build a 15-example eval set with a 1\u20135 rubric.", upgrade: "Add an eval gate to your workflow." },
      cn: { title: "\uD83D\uDEE1\uFE0F 建一个「质量对照表」", why: "不能衡量的东西就无法改进。", metric: "准备 15 个你知道正确答案的例子，给 AI 回答打 1-5 分。", upgrade: "每次改提示词后都跑一遍对照表，确保没变差。" }
    },
    tech_depth: {
      en: { title: "\u26A1 Automation Wedge", why: "One automated step changes your relationship with AI.", metric: "Automate 1 step so a task becomes push-button.", upgrade: "Add cost/latency routing by difficulty." },
      cn: { title: "\u26A1 自动化一个小步骤", why: "哪怕只自动化一步，你和 AI 的关系就会改变。", metric: "找到最枯燥的一步，让它变成一键完成。", upgrade: "尝试让多个步骤自动衔接。" }
    },
    agents: {
      en: { title: "\uD83E\uDD16 Checklist \u2192 Chain", why: "Manual coordination is your current bottleneck.", metric: "Convert one multi-step checklist into a semi-automated chain.", upgrade: "Add state tracking and retry logic." },
      cn: { title: "\uD83E\uDD16 把手动步骤串起来", why: "每次都手动协调多个步骤，是你当前最大的效率瓶颈。", metric: "选一个多步骤任务，让 AI 自动串联起来。", upgrade: "加入出错自动重试的机制。" }
    },
    adoption: {
      en: { title: "\uD83D\uDE80 3 Reps Challenge", why: "Consistency beats intensity for building AI habits.", metric: "Use AI for 3 different real tasks this week.", upgrade: "Expand to a new domain you haven't tried AI in." },
      cn: { title: "\uD83D\uDE80 这周用 AI 做 3 件真事", why: "养成习惯靠的是持续，不是一次猛冲。", metric: "本周用 AI 完成 3 个不同的真实任务。", upgrade: "扩展到一个你还没试过 AI 的新场景。" }
    },
    mindset: {
      en: { title: "\uD83D\uDCA1 Low-Risk Wins", why: "Confidence comes from small successes, not big leaps.", metric: "Find 3 low-stakes tasks where AI saves you 10+ minutes each.", upgrade: "Share one win with a colleague." },
      cn: { title: "\uD83D\uDCA1 从不怕出错的事开始", why: "信心来自小成功，不是大冒险。", metric: "找 3 个出错也没关系的任务，用 AI 各省 10 分钟以上。", upgrade: "把一个成功案例分享给同事。" }
    }
  };

  for (const axis of sorted) {
    if (missions.length >= 3) break;
    if (axisScores[axis] >= 70) continue;
    const m = MISSION_BANK[axis];
    if (m) missions.push(cn ? m.cn : m.en);
  }

  if (missions.length < 3) {
    const arch = ARCHETYPES[archetypeKey];
    const archCN = ARCHETYPES_CN?.[archetypeKey];
    const actions = cn && archCN?.actions ? archCN.actions : arch?.actions || [];
    for (const a of actions) {
      if (missions.length >= 3) break;
      missions.push({ title: a.what, why: '', metric: a.how, upgrade: '' });
    }
  }

  return missions;
}

// Detect strengths and bottleneck from axis scores
function detectSignals(axisScores) {
  const sorted = AXES.slice().sort((a, b) => axisScores[b] - axisScores[a]);
  const strengths = sorted.filter(a => axisScores[a] >= 40).slice(0, 3);

  const overall = Object.values(axisScores).reduce((s, v) => s + v, 0) / AXES.length;
  const skipIfEarly = overall < 40 ? ['agents', 'reliability'] : overall < 60 ? ['agents'] : [];
  const candidates = sorted.filter(a => !skipIfEarly.includes(a));
  const bottleneck = candidates[candidates.length - 1] || sorted[sorted.length - 1];

  return { strengths, bottleneck };
}

// Confidence meter
function getConfidence(scores) {
  if (scores.answeredCount >= 10) return 'high';
  if (scores.answeredCount >= 6) return 'medium';
  return 'low';
}

// === SKILLS & ROLES (axis-based) ===

const SKILLS_BANK = {
  adoption: {
    en: { name: "One-Use-Case Embed", detail: "Pick one recurring task and make AI part of it. Use AI 3x/week with the same template and track time saved. Start small — one task, one tool, one week." },
    cn: { name: "让 AI 融入一件事", detail: "选一个你经常重复做的事（比如写周报、整理笔记、回邮件），让 AI 帮你做。每周用同样的方式做 3 次，记录省了多少时间。" }
  },
  craft: {
    en: { name: "Template Pack", detail: "Turn your best prompts into reusable templates with 3 fields: Context / Constraints / Output format. Create 2 templates and reuse each at least 5 times. You'll stop reinventing the wheel." },
    cn: { name: "把好用的提示词存成「模板」(Template)", detail: "模板就是一段写好的提示词，每次只需要换几个关键词就能复用。比如：「请帮我把以下会议记录整理成要点，格式为……」。存 2 个这样的模板，各复用 5 次以上，你就不用每次从零开始了。" }
  },
  tech_depth: {
    en: { name: "Automation Wedge", detail: "Automate one step in your most repeated workflow — batching, scheduling, or connecting tools. Pick the most tedious step and make it push-button. No-code tools count." },
    cn: { name: "自动化一个小步骤", detail: "在你最重复的工作里，找到最枯燥的那一步，让它自动运行。比如用 Zapier、快捷指令或浏览器插件，把「复制→粘贴→格式化」变成一键完成。不需要写代码。" }
  },
  reliability: {
    en: { name: "Eval Lite", detail: "Build a small evaluation set: 15 examples with a 1-5 rubric. Use it to compare before/after when you change prompts. This one habit prevents silent quality drops." },
    cn: { name: "建一个简单的「质量对照表」(Eval Set)", detail: "准备 15 个你知道正确答案的例子，给 AI 的回答打 1-5 分。每次改提示词后重新跑一遍，看分数有没有变差。这个习惯能防止 AI 输出质量悄悄下滑。" }
  },
  agents: {
    en: { name: "Checklist \u2192 Chain", detail: "Take a multi-step task you do manually and convert it into a structured chain: define steps, inputs/outputs, and state. Start with semi-automation — you stay in the loop but stop doing the boring parts." },
    cn: { name: "把手动步骤串成自动链条", detail: "你有没有一件事需要好几步才能完成？比如「搜索→总结→发邮件」。把每一步写清楚，然后让 AI 自动串起来。你还是负责检查，但不用再手动做每一步了。" }
  },
  mindset: {
    en: { name: "Low-Risk Wins", detail: "Find 3 tasks where mistakes don't matter and use AI for all of them this week. Track your successes. Confidence comes from small wins, not big leaps." },
    cn: { name: "从不怕出错的事开始", detail: "找 3 个就算 AI 搞错了也没关系的任务（比如头脑风暴、草稿、个人笔记），这周全部用 AI 来做。记录成功次数，信心是从小胜利里长出来的。" }
  }
};

const ROLES_BANK = {
  adoption: {
    en: { name: "AI-in-Your-Function User", detail: "Someone who uses AI consistently for one specific domain — writing, research, analysis, or coding. Standardize one workflow and reuse it until it's second nature." },
    cn: { name: "在自己的领域用好 AI 的人", detail: "在一个你熟悉的场景里（写作、研究、分析、编程）持续使用 AI。把一个做法固定下来，反复用到变成习惯。" }
  },
  craft: {
    en: { name: "Prompt Librarian", detail: "Maintains a curated collection of high-quality prompts and templates for yourself or your team. Collect the top 10, prune monthly, add examples of good output." },
    cn: { name: "提示词整理者 (Prompt Librarian)", detail: "为自己或团队维护一个「好用提示词合集」。收集最好的 10 个，每月淘汰不好用的，附上成功案例。" }
  },
  tech_depth: {
    en: { name: "Tool Integrator", detail: "Connects AI to existing tools and systems. Start with no-code/low-code integrations, then progress to APIs. The goal: make AI do real work, not just chat." },
    cn: { name: "工具连接者 (Tool Integrator)", detail: "把 AI 和你现有的工具打通。先从不需要写代码的方式开始（比如浏览器插件、Zapier），再进阶到 API。目标：让 AI 做真正的工作，而不只是聊天。" }
  },
  reliability: {
    en: { name: "Quality Gatekeeper", detail: "Adds simple review gates to AI workflows — rubrics, structured output checks, sampling reviews. You're the person who makes AI output trustworthy." },
    cn: { name: "AI 输出质量把关人", detail: "在 AI 工作流里加入简单的检查环节 —— 比如评分标准、固定输出格式、抽样审核。你是让 AI 输出值得信赖的那个人。" }
  },
  agents: {
    en: { name: "Orchestration Designer", detail: "Designs plan\u2192act\u2192check flows for multi-step AI tasks. Start with low-risk tasks like research and summarization. Keep humans in the loop; log errors." },
    cn: { name: "AI 流程编排者 (Orchestration Designer)", detail: "为多步骤任务设计「计划→执行→检查」的流程。从低风险的事开始，比如让 AI 自动搜索+总结。你负责监督，AI 负责跑腿。" }
  },
  mindset: {
    en: { name: "Opportunity Spotter", detail: "The person who notices where AI could save time for the team. Keep a list of 5 repeated pains you observe; bring 1 suggestion per month." },
    cn: { name: "AI 机会发现者", detail: "留意团队里哪些重复工作可以用 AI 省时间的人。记下你观察到的 5 个痛点，每月提出 1 个「这个可以用 AI」的建议。" }
  }
};

function generateSkillsAndRoles(axisScores) {
  const cn = typeof isCN === 'function' && isCN();
  const sorted = AXES.slice().sort((a, b) => axisScores[a] - axisScores[b]);

  const skills = [], roles = [];
  for (const axis of sorted) {
    if (skills.length >= 3) break;
    if (axisScores[axis] >= 70) continue;
    const s = SKILLS_BANK[axis];
    if (s) skills.push(cn ? s.cn : s.en);
  }
  for (const axis of sorted) {
    if (roles.length >= 2) break;
    if (axisScores[axis] >= 70) continue;
    const r = ROLES_BANK[axis];
    if (r) roles.push(cn ? r.cn : r.en);
  }

  if (!skills.length) {
    const adv = [
      { en: { name: "Multiplier Builder", detail: "Build rails others can run on: tool registry, eval harness, governance framework, or training program. Pick one and roll it out beyond your team." },
        cn: { name: "帮别人也用好 AI", detail: "你已经很强了，下一步是让更多人也能用好 AI。比如做一套别人能直接用的工具、模板或培训材料，推广到团队之外。" } },
      { en: { name: "Ecosystem Contributor", detail: "Move from 'my system works' to 'my system spreads'. Publish a benchmark, open-source a component, or lead a cross-team AI program." },
        cn: { name: "把你的经验变成公共资源", detail: "从「我自己能用」到「别人也能用」。写一篇实践总结、开源一个小工具，或者主导一个跨团队的 AI 项目。" } },
      { en: { name: "Guild Builder", detail: "Grow a cohort of operators and builders so your impact scales beyond you. Run workshops, office hours, and certify people through shipped projects." },
        cn: { name: "培养下一批 AI 高手", detail: "你的影响力不应该只靠自己。组织工作坊、定期答疑，通过实际项目带人成长，让更多人达到你的水平。" } }
    ];
    for (const a of adv) skills.push(cn ? a.cn : a.en);
  }
  if (!roles.length) {
    const advR = [
      { en: { name: "AI Platform Architect", detail: "Define architecture, standards, and reusable components across teams. Create contracts, versioning, and governance; measure adoption and ROI." },
        cn: { name: "AI 架构设计者", detail: "为多个团队定义统一的 AI 使用方式：哪些工具用、怎么用、质量怎么保证。让好的做法能被复制和扩展。" } },
      { en: { name: "Talent Multiplier", detail: "The person who makes other people better at AI. Run monthly workshops, pair with juniors, and build a community of practice." },
        cn: { name: "AI 导师", detail: "让身边的人也变得擅长 AI。每月组织一次分享、和新手结对练习、建立一个互相学习的小圈子。" } }
    ];
    for (const r of advR) roles.push(cn ? r.cn : r.en);
  }

  return { skills, roles };
}

// === LABELS ===

const EXPOSURE_LABELS = {
  high: { label: "High Transformation Zone", detail: "AI will significantly reshape your work within 2\u20133 years." },
  moderate: { label: "Moderate Evolution Zone", detail: "AI will augment parts of your work. Starting now gives you an edge." },
  low: { label: "Gradual Change Zone", detail: "AI changes will come slower to your field, but AI literacy still matters." }
};

const READINESS_LABELS = {
  strong: { label: "Well Prepared", detail: "Strong AI skill foundation. Focus on deepening expertise." },
  building: { label: "Building Momentum", detail: "Right direction. Consistent AI skill-building will compound." },
  early: { label: "Early Stage \u2014 High Growth Potential", detail: "Lots of room to grow. Small AI learning investments yield outsized returns." }
};
