// Analytics store with pre-computed community stats for O(1) reads
// Handles tens of thousands of sessions without slow community stat recalculation

const STORAGE_KEY = "ai_career_nav_analytics";
const STATS_KEY = "ai_career_nav_stats";

const Analytics = {
  _data: null,
  _stats: null,

  _load() {
    if (this._data) return this._data;
    try { this._data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || { sessions: {} }; }
    catch { this._data = { sessions: {} }; }
    // Migrate from array format
    if (Array.isArray(this._data.sessions)) {
      const map = {};
      this._data.sessions.forEach(s => { map[s.id] = s; });
      this._data.sessions = map;
      this._save();
    }
    return this._data;
  },

  _save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(this._data)); },

  _loadStats() {
    if (this._stats) return this._stats;
    try { this._stats = JSON.parse(localStorage.getItem(STATS_KEY)); } catch {}
    if (!this._stats) this._stats = this._rebuildStats();
    return this._stats;
  },

  _saveStats() { localStorage.setItem(STATS_KEY, JSON.stringify(this._stats)); },

  // Full rebuild (only on first run or migration)
  _rebuildStats() {
    const data = this._load();
    const sessions = Object.values(data.sessions);
    const dims = ["adaptability", "technical", "creative", "leadership", "aiReadiness", "humanEdge"];
    const stats = {
      n: 0,
      sumScores: {}, sumExposure: 0, sumReadiness: 0,
      archetypeCounts: {},
      exposureBuckets: { low: 0, moderate: 0, high: 0 },
      readinessBuckets: { early: 0, building: 0, strong: 0 },
      toolCounts: {}, toolUsers: 0,
      answerCounts: {} // questionId -> { optionIdx: count }
    };
    dims.forEach(d => { stats.sumScores[d] = 0; });
    sessions.forEach(s => this._addToStats(stats, s));
    this._stats = stats;
    this._saveStats();
    return stats;
  },

  _addToStats(stats, s) {
    stats.n++;
    const dims = ["adaptability", "technical", "creative", "leadership", "aiReadiness", "humanEdge"];
    dims.forEach(d => { stats.sumScores[d] = (stats.sumScores[d] || 0) + (s.scores?.[d] || 0); });
    stats.sumExposure += s.exposure || 0;
    stats.sumReadiness += s.readiness || 0;
    stats.archetypeCounts[s.archetype] = (stats.archetypeCounts[s.archetype] || 0) + 1;
    if (s.exposure >= 75) stats.exposureBuckets.high++; else if (s.exposure >= 45) stats.exposureBuckets.moderate++; else stats.exposureBuckets.low++;
    if (s.readiness >= 70) stats.readinessBuckets.strong++; else if (s.readiness >= 40) stats.readinessBuckets.building++; else stats.readinessBuckets.early++;
    if (s.toolSelections && s.toolSelections.length > 0) {
      stats.toolUsers++;
      s.toolSelections.forEach(t => { stats.toolCounts[t] = (stats.toolCounts[t] || 0) + 1; });
    }
    // Answer distribution
    const answers = s.answers || {};
    for (const [qId, ans] of Object.entries(answers)) {
      if (!stats.answerCounts[qId]) stats.answerCounts[qId] = {};
      if (Array.isArray(ans)) ans.forEach(i => { stats.answerCounts[qId][i] = (stats.answerCounts[qId][i] || 0) + 1; });
      else if (ans !== undefined && ans !== null) stats.answerCounts[qId][ans] = (stats.answerCounts[qId][ans] || 0) + 1;
    }
  },

  // Record a new session — O(1) stats update
  recordSession(answers, tags, scores, archetype, exposure, readiness, toolSelections) {
    const data = this._load();
    const serialized = {};
    for (const [k, v] of Object.entries(answers)) {
      serialized[k] = v instanceof Set ? [...v] : v;
    }
    const id = crypto.randomUUID ? crypto.randomUUID() : (Date.now().toString(36) + Math.random().toString(36).slice(2, 10));
    const session = {
      id, ts: new Date().toISOString(),
      answers: serialized, tags, scores, archetype, exposure, readiness,
      toolSelections: toolSelections || [], feedback: null
    };
    data.sessions[id] = session;
    this._save();
    // Incremental stats update
    const stats = this._loadStats();
    this._addToStats(stats, session);
    this._saveStats();
    return id;
  },

  getSession(id) {
    return this._load().sessions[id] || null;
  },

  recordFeedback(sessionId, feedback) {
    const data = this._load();
    if (data.sessions[sessionId]) { data.sessions[sessionId].feedback = feedback; this._save(); }
  },

  getToolRankings() {
    const stats = this._loadStats();
    const ranked = Object.entries(stats.toolCounts || {})
      .filter(([name]) => name !== "None of the above")
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count, pct: stats.toolUsers ? Math.round(count / stats.toolUsers * 100) : 0 }));
    return { ranked, totalUsers: stats.toolUsers || 0 };
  },

  getCommunityStats() {
    const stats = this._loadStats();
    if (stats.n === 0) return null;
    const dims = ["adaptability", "technical", "creative", "leadership", "aiReadiness", "humanEdge"];
    const avgScores = {};
    dims.forEach(d => { avgScores[d] = (stats.sumScores[d] || 0) / stats.n; });
    return {
      totalSessions: stats.n,
      avgScores,
      archetypeCounts: stats.archetypeCounts,
      exposureBuckets: stats.exposureBuckets,
      readinessBuckets: stats.readinessBuckets,
      avgExposure: Math.round(stats.sumExposure / stats.n),
      avgReadiness: Math.round(stats.sumReadiness / stats.n)
    };
  },

  // Scatter data — only load exposure/readiness/scores (lightweight)
  getScatterData() {
    const sessions = Object.values(this._load().sessions);
    return sessions.map(s => ({
      exposure: s.exposure, readiness: s.readiness,
      aiReadiness: s.scores?.aiReadiness || 0,
      adaptability: s.scores?.adaptability || 0
    }));
  },

  getAnswerDistribution(questionId, options) {
    const stats = this._loadStats();
    const qCounts = stats.answerCounts[questionId] || {};
    const total = stats.n || 1;
    return options.map((opt, i) => ({
      label: typeof opt === 'string' ? opt : (opt.text || ''),
      count: qCounts[i] || 0,
      pct: Math.round((qCounts[i] || 0) / total * 100)
    }));
  },

  getSessions() { return Object.values(this._load().sessions); }
};
