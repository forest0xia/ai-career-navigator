// Scoring engine — archetype determination, exposure/readiness calculations

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
