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
  // Explorer also gets some usage questions
  const usage = track === 'explorer' ? QUESTIONS.filter(q => q.track === 'explorer') : [];
  const pool = [...calibration, ...(track === 'explorer' ? usage : trackQs), ...future, ...crossCheck];
  // Deduplicate
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

// Exposure/readiness labels (kept for compatibility)
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
