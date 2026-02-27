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
