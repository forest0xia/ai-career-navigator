// Scoring engine — archetype determination, exposure/readiness, personalized insights

function determineArchetype(scores, tags) {
  const { technical, creative, leadership, adaptability, aiReadiness, humanEdge } = scores;
  const isTech = tags.includes("tech");

  const archetypeScores = {
    aiArchitect: technical * 2 + aiReadiness * 2 + (isTech ? 4 : 0),
    aiCollaborator: adaptability * 2 + aiReadiness * 1.5 + technical,
    humanEdge: humanEdge * 2.5 + leadership - aiReadiness * 0.5,
    strategicLeader: leadership * 2.5 + adaptability + aiReadiness * 0.5,
    creativeInnovator: creative * 2.5 + adaptability + aiReadiness * 0.5,
    careerPivot: adaptability * 2 - technical * 0.5 - leadership * 0.5 + (tags.includes("early") ? 4 : 0)
  };

  let best = "aiCollaborator", bestScore = -Infinity;
  for (const [k, v] of Object.entries(archetypeScores)) {
    if (v > bestScore) { bestScore = v; best = k; }
  }
  return best;
}

function computeAIExposure(scores, tags) {
  let exposure = 50;
  if (tags.includes("tech")) exposure += 15;
  if (tags.includes("creative")) exposure += 10;
  if (tags.includes("physical")) exposure -= 20;
  if (tags.includes("regulated")) exposure -= 5;
  exposure += scores.technical * 3;
  exposure -= scores.humanEdge * 2;
  return Math.max(10, Math.min(95, exposure));
}

function computeReadiness(scores) {
  const max = 50;
  const total = Object.values(scores).reduce((a, b) => a + Math.max(0, b), 0);
  return Math.max(5, Math.min(95, Math.round((total / max) * 100)));
}

function getExposureLabel(pct) {
  if (pct >= 75) return { label: "High Transformation Zone", color: "var(--warning)", detail: "AI will significantly reshape your day-to-day work within 2–3 years. This isn't a threat — it's an opportunity to redefine your role. Act now for maximum advantage." };
  if (pct >= 45) return { label: "Moderate Evolution Zone", color: "var(--accent2)", detail: "AI will augment and change parts of your work. You have time to prepare, but starting now gives you a major advantage over peers who wait." };
  return { label: "Gradual Shift Zone", color: "var(--success)", detail: "AI will change your field more slowly. Your human-centric skills provide natural resilience, but AI literacy still matters for long-term competitiveness." };
}

function getReadinessLabel(pct) {
  if (pct >= 70) return { label: "Well Positioned", color: "var(--success)" };
  if (pct >= 40) return { label: "Building Momentum", color: "var(--accent2)" };
  return { label: "Early Stage — High Growth Potential", color: "var(--warning)" };
}

// Generate personalized insight text based on user's unique profile
function generateInsight(scores, exposure, readiness, archetypeKey, community) {
  const dims = ["adaptability", "technical", "creative", "leadership", "aiReadiness", "humanEdge"];
  const sorted = dims.slice().sort((a, b) => (scores[b] || 0) - (scores[a] || 0));
  const top1 = sorted[0], top2 = sorted[1];
  const lowest = sorted[sorted.length - 1];

  const cn = typeof isCN === 'function' && isCN();

  const dimNames = cn
    ? { adaptability: "适应力", technical: "技术深度", creative: "创造力", leadership: "领导力", aiReadiness: "AI就绪度", humanEdge: "人类优势" }
    : { adaptability: "adaptability", technical: "technical depth", creative: "creative thinking", leadership: "leadership", aiReadiness: "AI readiness", humanEdge: "human edge" };

  const archLabel = cn && typeof ARCHETYPES_CN !== 'undefined' && ARCHETYPES_CN[archetypeKey]
    ? ARCHETYPES_CN[archetypeKey].name
    : (typeof ARCHETYPES !== 'undefined' && ARCHETYPES[archetypeKey] ? ARCHETYPES[archetypeKey].name : archetypeKey);

  const parts = [];

  // Opening — varies by archetype
  if (cn) {
    parts.push(`你的画像显示你最适合作为<strong style="color:var(--accent2)">${archLabel}</strong>。`);
  } else {
    parts.push(`Your profile identifies you as <strong style="color:var(--accent2)">${archLabel}</strong>.`);
  }

  // Strength combo — unique per user
  if (cn) {
    parts.push(`你最突出的优势组合是<strong style="color:var(--accent2)">${dimNames[top1]}</strong>和<strong style="color:var(--accent2)">${dimNames[top2]}</strong>——这种组合在 AI 时代尤其有价值，因为它很难被自动化复制。`);
  } else {
    parts.push(`Your standout combination of <strong style="color:var(--accent2)">${dimNames[top1]}</strong> and <strong style="color:var(--accent2)">${dimNames[top2]}</strong> is particularly valuable in the AI era — this pairing is difficult for automation to replicate.`);
  }

  // Exposure-readiness gap analysis
  if (exposure >= 65 && readiness >= 65) {
    parts.push(cn
      ? '你的 AI 影响度和准备度都很高——你处于最佳位置，可以将 AI 变革转化为职业加速器。'
      : 'Both your AI exposure and readiness are high — you\'re in the best position to turn AI disruption into a career accelerator.');
  } else if (exposure >= 65 && readiness < 45) {
    parts.push(cn
      ? '你的工作面临较高的 AI 变革，但准备度还有提升空间。好消息是：你的优势基础扎实，集中精力提升 AI 技能将带来显著回报。'
      : 'Your work faces significant AI transformation, but your readiness has room to grow. The good news: your strength foundation is solid — focused AI upskilling will yield outsized returns.');
  } else if (exposure < 45 && readiness >= 65) {
    parts.push(cn
      ? '虽然 AI 对你当前工作的直接影响较小，但你的高准备度意味着你可以主动选择如何利用 AI 来扩展你的影响力。'
      : 'While AI\'s direct impact on your current work is moderate, your high readiness means you can proactively choose how to leverage AI to expand your impact.');
  } else {
    parts.push(cn
      ? '你有充足的时间来建立 AI 能力。关键是从小处开始，保持一致性——每周投入少量时间学习 AI 工具，效果会随时间复利增长。'
      : 'You have time to build AI capabilities at your own pace. The key is starting small and staying consistent — even a few hours per week on AI tools compounds dramatically over time.');
  }

  // Growth area — personalized
  if (scores[lowest] <= 0) {
    parts.push(cn
      ? `你的<strong style="color:var(--text2)">${dimNames[lowest]}</strong>是最大的成长空间。即使小幅提升这个维度，也能显著拓宽你的职业选择。`
      : `Your biggest growth opportunity is <strong style="color:var(--text2)">${dimNames[lowest]}</strong>. Even a modest improvement here would significantly broaden your career options.`);
  }

  // Community comparison (if available)
  if (community && community.totalSessions > 2) {
    const pctile = Math.round(
      community.avgReadiness < readiness
        ? 50 + ((readiness - community.avgReadiness) / (100 - community.avgReadiness)) * 50
        : (readiness / community.avgReadiness) * 50
    );
    if (pctile >= 70) {
      parts.push(cn
        ? `在所有参与评估的用户中，你的准备度高于大多数人。继续保持这种势头。`
        : `Among all assessment participants, your readiness is above the majority. Keep building on this momentum.`);
    } else if (pctile <= 30) {
      parts.push(cn
        ? `许多参与者的准备度比你更高——但这正是机会所在。从上面的行动 #1 开始，本周就行动起来。`
        : `Many participants score higher on readiness — but that\'s exactly where the opportunity lies. Start with action #1 above this week.`);
    }
  }

  // Closing — always action-oriented, varies
  parts.push(cn
    ? '世界经济论坛预测到 2030 年将新增 1.7 亿个岗位。主动规划的人始终优于被动等待的人。小而持续的行动会带来巨大的职业转变。'
    : 'The WEF projects 170 million new roles by 2030. Those who act intentionally consistently outperform those who wait. Small, consistent steps compound into transformative career moves.');

  return parts.join(' ');
}
