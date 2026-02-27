// In-memory analytics store with localStorage persistence

const STORAGE_KEY = "ai_career_nav_analytics";

const Analytics = {
  _data: null,

  _load() {
    if (this._data) return this._data;
    try {
      this._data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || { sessions: [] };
    } catch {
      this._data = { sessions: [] };
    }
    return this._data;
  },

  _save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this._data));
  },

  recordSession(answers, tags, scores, archetype, exposure, readiness, toolSelections) {
    const data = this._load();
    // Serialize answers (convert Sets to arrays for JSON)
    const serialized = {};
    for (const [k, v] of Object.entries(answers)) {
      serialized[k] = v instanceof Set ? [...v] : v;
    }
    data.sessions.push({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      ts: new Date().toISOString(),
      answers: serialized, tags, scores, archetype, exposure, readiness,
      toolSelections: toolSelections || [],
      feedback: null
    });
    this._save();
    return data.sessions[data.sessions.length - 1].id;
  },

  recordFeedback(sessionId, feedback) {
    const data = this._load();
    const session = data.sessions.find(s => s.id === sessionId);
    if (session) { session.feedback = feedback; this._save(); }
  },

  // Ranked tool popularity across all sessions
  getToolRankings() {
    const data = this._load();
    const counts = {};
    let sessionsWithTools = 0;
    data.sessions.forEach(s => {
      if (s.toolSelections && s.toolSelections.length > 0) {
        sessionsWithTools++;
        s.toolSelections.forEach(t => { counts[t] = (counts[t] || 0) + 1; });
      }
    });
    const ranked = Object.entries(counts)
      .filter(([name]) => name !== "None of the above")
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count, pct: sessionsWithTools ? Math.round(count / sessionsWithTools * 100) : 0 }));
    return { ranked, totalUsers: sessionsWithTools };
  },

  getCommunityStats() {
    const data = this._load();
    const sessions = data.sessions;
    if (sessions.length === 0) return null;

    const dims = ["adaptability", "technical", "creative", "leadership", "aiReadiness", "humanEdge"];
    const avgScores = {};
    dims.forEach(d => {
      const vals = sessions.map(s => s.scores[d] || 0);
      avgScores[d] = vals.reduce((a, b) => a + b, 0) / vals.length;
    });

    const archetypeCounts = {};
    sessions.forEach(s => { archetypeCounts[s.archetype] = (archetypeCounts[s.archetype] || 0) + 1; });

    const exposureBuckets = { low: 0, moderate: 0, high: 0 };
    const readinessBuckets = { early: 0, building: 0, strong: 0 };
    sessions.forEach(s => {
      if (s.exposure >= 75) exposureBuckets.high++; else if (s.exposure >= 45) exposureBuckets.moderate++; else exposureBuckets.low++;
      if (s.readiness >= 70) readinessBuckets.strong++; else if (s.readiness >= 40) readinessBuckets.building++; else readinessBuckets.early++;
    });

    const feedbackSessions = sessions.filter(s => s.feedback);
    let avgFeedback = null;
    if (feedbackSessions.length > 0) {
      const fbDims = ["accuracy", "actionability", "insight", "overall"];
      avgFeedback = {};
      fbDims.forEach(d => {
        const vals = feedbackSessions.map(s => s.feedback.ratings[d]).filter(v => v != null);
        avgFeedback[d] = vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : null;
      });
    }

    // Domain/tag distribution
    const tagCounts = {};
    sessions.forEach(s => { (s.tags || []).forEach(t => { tagCounts[t] = (tagCounts[t] || 0) + 1; }); });

    return {
      totalSessions: sessions.length,
      avgScores, archetypeCounts, exposureBuckets, readinessBuckets, avgFeedback, tagCounts,
      avgExposure: Math.round(sessions.reduce((a, s) => a + s.exposure, 0) / sessions.length),
      avgReadiness: Math.round(sessions.reduce((a, s) => a + s.readiness, 0) / sessions.length)
    };
  },

  exportData() { return JSON.stringify(this._load(), null, 2); },
  getSessions() { return this._load().sessions; }
};

// Radar chart (pure canvas, no deps)
function drawRadarChart(canvasId, userScores, communityAvg) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const W = 400, H = 400, cx = W / 2, cy = H / 2, R = 150;
  canvas.width = W; canvas.height = H;

  const dims = ["adaptability", "technical", "creative", "leadership", "aiReadiness", "humanEdge"];
  const labels = ["Adaptability", "Technical", "Creative", "Leadership", "AI Readiness", "Human Edge"];
  const n = dims.length;
  const angleStep = (2 * Math.PI) / n;
  const startAngle = -Math.PI / 2;

  const maxVal = Math.max(
    ...dims.map(d => Math.max(Math.abs(userScores[d] || 0), Math.abs(communityAvg ? communityAvg[d] || 0 : 0))), 1
  );

  function getPoint(dimIdx, val) {
    const angle = startAngle + dimIdx * angleStep;
    const r = (Math.max(0, val) / maxVal) * R;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  }

  ctx.clearRect(0, 0, W, H);

  // Grid
  ctx.strokeStyle = "#2e3345"; ctx.lineWidth = 1;
  for (let ring = 1; ring <= 4; ring++) {
    ctx.beginPath();
    const rr = (ring / 4) * R;
    for (let i = 0; i <= n; i++) {
      const angle = startAngle + i * angleStep;
      const x = cx + rr * Math.cos(angle), y = cy + rr * Math.sin(angle);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // Axes
  for (let i = 0; i < n; i++) {
    const angle = startAngle + i * angleStep;
    ctx.beginPath(); ctx.moveTo(cx, cy);
    ctx.lineTo(cx + R * Math.cos(angle), cy + R * Math.sin(angle)); ctx.stroke();
  }

  // Labels
  ctx.fillStyle = "#9ca3b8"; ctx.font = "12px -apple-system, sans-serif"; ctx.textAlign = "center";
  for (let i = 0; i < n; i++) {
    const angle = startAngle + i * angleStep;
    ctx.fillText(labels[i], cx + (R + 24) * Math.cos(angle), cy + (R + 24) * Math.sin(angle) + 4);
  }

  function drawPoly(scores, fillColor, strokeColor) {
    ctx.beginPath();
    for (let i = 0; i <= n; i++) {
      const [x, y] = getPoint(i % n, scores[dims[i % n]] || 0);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = fillColor; ctx.fill();
    ctx.strokeStyle = strokeColor; ctx.lineWidth = 2; ctx.stroke();
  }

  if (communityAvg) drawPoly(communityAvg, "rgba(156,163,184,0.12)", "rgba(156,163,184,0.4)");
  drawPoly(userScores, "rgba(99,102,241,0.2)", "#818cf8");

  ctx.fillStyle = "#818cf8";
  for (let i = 0; i < n; i++) {
    const [x, y] = getPoint(i, userScores[dims[i]] || 0);
    ctx.beginPath(); ctx.arc(x, y, 4, 0, 2 * Math.PI); ctx.fill();
  }
}
