// Scoring engine — adaptive branching + 5-level archetype determination

// Determine which track to branch into after calibration
function determineTrack(answers) {
  let levelSum = 0, count = 0, builderHits = 0;
  for (const [qid, ans] of Object.entries(answers)) {
    const q = QUESTIONS.find(q => q.id === qid);
    if (!q) continue;
    const selections = ans instanceof Set ? [...ans] : [ans];
    for (const idx of selections) {
      const opt = q.options[idx];
      if (!opt) continue;
      levelSum += opt.level || 0;
      count++;
      if (opt.level >= 5) builderHits++;
    }
  }
  const avg = count ? levelSum / count : 0;
  if (builderHits >= 2) return "builder";
  if (avg >= 3.5) return "operator";
  if (avg >= 2.2) return "workflow";
  return "explorer";
}

// Get questions for a track (calibration + track-specific + future + crosscheck)
function getAdaptiveQuestions(track) {
  const calibration = QUESTIONS.filter(q => q.section === 'calibration');
  const trackQs = QUESTIONS.filter(q => q.track === track);
  const future = QUESTIONS.filter(q => q.section === 'future' && !q.track && !q.crossCheck);
  const crossCheck = QUESTIONS.filter(q => q.crossCheck);
  const sentimentQs = QUESTIONS.filter(q => q.sentiment && q.section !== 'calibration');
  const usage = track === 'explorer' ? QUESTIONS.filter(q => q.track === 'explorer') : [];
  const pool = [...calibration, ...(track === 'explorer' ? usage : trackQs), ...sentimentQs, ...future, ...crossCheck];
  const seen = new Set();
  return pool.filter(q => { if (seen.has(q.id)) return false; seen.add(q.id); return true; });
}

// Calculate scores from all answers
function calculateScores(answers) {
  const raw = { usage_depth: 0, workflow: 0, system: 0, adaptability: 0, builder: 0 };
  let levelSum = 0, levelCount = 0;

  for (const [qid, ans] of Object.entries(answers)) {
    const q = QUESTIONS.find(q => q.id === qid);
    if (!q) continue;
    const selections = ans instanceof Set ? [...ans] : [ans];
    for (const idx of selections) {
      const opt = q.options[idx];
      if (!opt) continue;
      for (const [dim, val] of Object.entries(opt.scores || {})) {
        raw[dim] = (raw[dim] || 0) + val;
      }
      levelSum += opt.level || 0;
      levelCount++;
    }
  }

  // Normalize to 0-10
  const maxExpected = { usage_depth: 18, workflow: 18, system: 16, adaptability: 12, builder: 16 };
  const normalized = {};
  for (const d of Object.keys(maxExpected)) {
    normalized[d] = Math.min(10, Math.max(0, (raw[d] || 0) / maxExpected[d] * 10));
  }

  const avgLevel = levelCount ? levelSum / levelCount : 1;
  return { raw, normalized, avgLevel };
}

// Determine archetype from scores
function determineArchetype(scores) {
  const { normalized, avgLevel } = scores;
  // Primary signal: average level from option selections
  // Secondary: dimension scores for tie-breaking
  if (avgLevel >= 4.2 || normalized.builder >= 6) return 'architect';
  if (avgLevel >= 3.4 || normalized.system >= 5) return 'operator';
  if (avgLevel >= 2.4 || normalized.workflow >= 4) return 'hacker';
  if (avgLevel >= 1.6 || normalized.usage_depth >= 3) return 'explorer';
  return 'tourist';
}

// Cross-check: detect inconsistency between claimed level and pressure behavior
function applyCrossCheck(scores, answers) {
  const pressureAns = answers['deadline_pressure'];
  if (pressureAns === undefined) return scores;
  const pressureLevel = QUESTIONS.find(q => q.id === 'deadline_pressure')?.options[pressureAns]?.level || 0;
  const gap = scores.avgLevel - pressureLevel;
  // If pressure behavior is 2+ levels below claimed, adjust down
  if (gap >= 2) {
    scores.avgLevel = (scores.avgLevel + pressureLevel) / 2;
  }
  return scores;
}

// Generate personalized insight based on scores
function generateInsight(archetypeKey, scores) {
  const arch = ARCHETYPES[archetypeKey];
  const { normalized } = scores;
  const top = Object.entries(normalized).sort((a, b) => b[1] - a[1]);
  const strongest = top[0][0];
  const weakest = top[top.length - 1][0];

  const dimNames = {
    usage_depth: 'AI usage depth', workflow: 'workflow thinking',
    system: 'system thinking', adaptability: 'adaptability', builder: 'builder instinct'
  };
  const dimNamesCN = {
    usage_depth: 'AI 使用深度', workflow: '工作流思维',
    system: '系统思维', adaptability: '适应力', builder: '构建者直觉'
  };

  const names = typeof isCN === 'function' && isCN() ? dimNamesCN : dimNames;
  return `Your strongest signal is ${names[strongest]}. Your biggest growth opportunity is ${names[weakest]}. ${arch.blindSpot}`;
}

// Compute AI exposure based on domain + usage level
function computeAIExposure(answers) {
  const domainQ = QUESTIONS.find(q => q.id === 'domain');
  const domainIdx = answers['domain'];
  const domainExposure = domainQ?.options[domainIdx]?.exposure || 55;
  // Blend domain exposure with usage depth
  const usageQ = QUESTIONS.find(q => q.id === 'cal_usage');
  const usageLevel = usageQ?.options[answers['cal_usage']]?.level || 1;
  const usageBoost = (usageLevel - 1) * 5; // 0-20 boost
  return Math.min(100, Math.round(domainExposure + usageBoost));
}

// Compute readiness from normalized scores
function computeReadiness(normalized) {
  return Math.min(100, Math.round(((normalized.usage_depth + normalized.workflow + normalized.system + normalized.builder) / 40) * 100));
}

// Get tool selections for tool rankings
function getToolSelections(answers) {
  const toolQ = QUESTIONS.find(q => q.id === 'ai_tools');
  if (!toolQ || !answers.ai_tools || !(answers.ai_tools instanceof Set)) return [];
  return [...answers.ai_tools].map(i => toolQ.options[i]?.text).filter(Boolean);
}

// Get domain tags
function getDomainTags(answers) {
  const domainQ = QUESTIONS.find(q => q.id === 'domain');
  return domainQ?.options[answers['domain']]?.tags || [];
}

// Calculate sentiment from sentiment questions
function calculateSentiment(answers) {
  const sent = { confidence: 0, anxiety: 0, motivation: 0 };
  for (const [qid, ans] of Object.entries(answers)) {
    const q = QUESTIONS.find(q => q.id === qid);
    if (!q?.sentiment) continue;
    const opt = q.options[ans];
    if (!opt?.sent) continue;
    for (const [k, v] of Object.entries(opt.sent)) sent[k] = (sent[k] || 0) + v;
  }
  return sent;
}

// Get sentiment profile label
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

// Exposure/readiness labels
const EXPOSURE_LABELS = {
  high: { label: "High Transformation Zone", detail: "AI will significantly reshape your work within 2–3 years." },
  moderate: { label: "Moderate Evolution Zone", detail: "AI will augment parts of your work. Starting now gives you an edge." },
  low: { label: "Gradual Change Zone", detail: "AI changes will come slower to your field, but AI literacy still matters." }
};

const READINESS_LABELS = {
  strong: { label: "Well Prepared", detail: "Strong AI skill foundation. Focus on deepening expertise." },
  building: { label: "Building Momentum", detail: "Right direction. Consistent AI skill-building will compound." },
  early: { label: "Early Stage — High Growth Potential", detail: "Lots of room to grow. Small AI learning investments yield outsized returns." }
};
