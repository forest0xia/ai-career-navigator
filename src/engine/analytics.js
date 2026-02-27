// Analytics: local sessions + remote community data (fetched from community-data.json)
// Remote data is published aggregate stats you update in the repo.
// Local data is the user's own sessions in this browser.
// Community views merge both: remote + local.

const STORAGE_KEY = "ai_career_nav_analytics";
const LOCAL_STATS_KEY = "ai_career_nav_local_stats";
const REMOTE_CACHE_KEY = "ai_career_nav_remote";

const _DIMS = ["adaptability", "technical", "creative", "leadership", "aiReadiness", "humanEdge"];

function _emptyStats() {
  const s = { n: 0, sumExposure: 0, sumReadiness: 0, sumScores: {}, archetypeCounts: {},
    exposureBuckets: { low: 0, moderate: 0, high: 0 }, readinessBuckets: { early: 0, building: 0, strong: 0 },
    toolCounts: {}, toolUsers: 0, answerCounts: {}, scatterPoints: [] };
  _DIMS.forEach(d => { s.sumScores[d] = 0; });
  return s;
}

function _addSessionToStats(stats, s) {
  stats.n++;
  _DIMS.forEach(d => { stats.sumScores[d] = (stats.sumScores[d] || 0) + (s.scores?.[d] || 0); });
  stats.sumExposure += s.exposure || 0;
  stats.sumReadiness += s.readiness || 0;
  stats.archetypeCounts[s.archetype] = (stats.archetypeCounts[s.archetype] || 0) + 1;
  if (s.exposure >= 75) stats.exposureBuckets.high++; else if (s.exposure >= 45) stats.exposureBuckets.moderate++; else stats.exposureBuckets.low++;
  if (s.readiness >= 70) stats.readinessBuckets.strong++; else if (s.readiness >= 40) stats.readinessBuckets.building++; else stats.readinessBuckets.early++;
  if (s.toolSelections?.length > 0) {
    stats.toolUsers++;
    s.toolSelections.forEach(t => { stats.toolCounts[t] = (stats.toolCounts[t] || 0) + 1; });
  }
  const answers = s.answers || {};
  for (const [qId, ans] of Object.entries(answers)) {
    if (!stats.answerCounts[qId]) stats.answerCounts[qId] = {};
    if (Array.isArray(ans)) ans.forEach(i => { stats.answerCounts[qId][i] = (stats.answerCounts[qId][i] || 0) + 1; });
    else if (ans !== undefined && ans !== null) stats.answerCounts[qId][ans] = (stats.answerCounts[qId][ans] || 0) + 1;
  }
  stats.scatterPoints.push({ exposure: s.exposure, readiness: s.readiness,
    aiReadiness: s.scores?.aiReadiness || 0, adaptability: s.scores?.adaptability || 0 });
}

// Merge two stats objects (remote + local)
function _mergeStats(a, b) {
  if (!a || !a.n) return b || _emptyStats();
  if (!b || !b.n) return a;
  const m = _emptyStats();
  m.n = a.n + b.n;
  _DIMS.forEach(d => { m.sumScores[d] = (a.sumScores[d] || 0) + (b.sumScores[d] || 0); });
  m.sumExposure = a.sumExposure + b.sumExposure;
  m.sumReadiness = a.sumReadiness + b.sumReadiness;
  for (const k of new Set([...Object.keys(a.archetypeCounts || {}), ...Object.keys(b.archetypeCounts || {})])) {
    m.archetypeCounts[k] = (a.archetypeCounts[k] || 0) + (b.archetypeCounts[k] || 0);
  }
  ['low', 'moderate', 'high'].forEach(k => { m.exposureBuckets[k] = (a.exposureBuckets[k] || 0) + (b.exposureBuckets[k] || 0); });
  ['early', 'building', 'strong'].forEach(k => { m.readinessBuckets[k] = (a.readinessBuckets[k] || 0) + (b.readinessBuckets[k] || 0); });
  m.toolUsers = (a.toolUsers || 0) + (b.toolUsers || 0);
  for (const k of new Set([...Object.keys(a.toolCounts || {}), ...Object.keys(b.toolCounts || {})])) {
    m.toolCounts[k] = (a.toolCounts[k] || 0) + (b.toolCounts[k] || 0);
  }
  for (const qId of new Set([...Object.keys(a.answerCounts || {}), ...Object.keys(b.answerCounts || {})])) {
    m.answerCounts[qId] = {};
    const aq = a.answerCounts?.[qId] || {}, bq = b.answerCounts?.[qId] || {};
    for (const k of new Set([...Object.keys(aq), ...Object.keys(bq)])) {
      m.answerCounts[qId][k] = (aq[k] || 0) + (bq[k] || 0);
    }
  }
  m.scatterPoints = [...(a.scatterPoints || []), ...(b.scatterPoints || [])];
  return m;
}

const Analytics = {
  _data: null,
  _localStats: null,
  _remote: null,

  _load() {
    if (this._data) return this._data;
    try { this._data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || { sessions: {} }; } catch { this._data = { sessions: {} }; }
    if (Array.isArray(this._data.sessions)) {
      const map = {}; this._data.sessions.forEach(s => { map[s.id] = s; }); this._data.sessions = map; this._save();
    }
    return this._data;
  },
  _save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(this._data)); },

  _loadLocalStats() {
    if (this._localStats) return this._localStats;
    try { this._localStats = JSON.parse(localStorage.getItem(LOCAL_STATS_KEY)); } catch {}
    if (!this._localStats) {
      this._localStats = _emptyStats();
      Object.values(this._load().sessions).forEach(s => _addSessionToStats(this._localStats, s));
      this._saveLocalStats();
    }
    return this._localStats;
  },
  _saveLocalStats() { localStorage.setItem(LOCAL_STATS_KEY, JSON.stringify(this._localStats)); },

  _getRemote() { return this._remote; },

  // Fetch remote community data (call once on page load)
  async fetchRemote() {
    try {
      const cached = JSON.parse(localStorage.getItem(REMOTE_CACHE_KEY) || 'null');
      // Use cache if less than 5 min old
      if (cached && cached._fetchedAt && Date.now() - cached._fetchedAt < 300000) {
        this._remote = cached;
        return;
      }
      const resp = await fetch('community-data.json?t=' + Date.now());
      if (resp.ok) {
        this._remote = await resp.json();
        this._remote._fetchedAt = Date.now();
        localStorage.setItem(REMOTE_CACHE_KEY, JSON.stringify(this._remote));
      }
    } catch { /* offline — use cached or local only */ }
  },

  // Merged community stats (remote + local)
  _merged() { return _mergeStats(this._remote, this._loadLocalStats()); },

  recordSession(answers, tags, scores, archetype, exposure, readiness, toolSelections) {
    const data = this._load();
    const serialized = {};
    for (const [k, v] of Object.entries(answers)) { serialized[k] = v instanceof Set ? [...v] : v; }
    const id = crypto.randomUUID ? crypto.randomUUID() : (Date.now().toString(36) + Math.random().toString(36).slice(2, 10));
    const session = { id, ts: new Date().toISOString(), answers: serialized, tags, scores, archetype, exposure, readiness, toolSelections: toolSelections || [], feedback: null };
    data.sessions[id] = session;
    this._save();
    const ls = this._loadLocalStats();
    _addSessionToStats(ls, session);
    this._saveLocalStats();
    return id;
  },

  getSession(id) { return this._load().sessions[id] || null; },

  recordFeedback(sessionId, feedback) {
    const data = this._load();
    if (data.sessions[sessionId]) { data.sessions[sessionId].feedback = feedback; this._save(); }
  },

  getToolRankings() {
    const stats = this._merged();
    const ranked = Object.entries(stats.toolCounts || {})
      .filter(([name]) => name !== "None of the above")
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count, pct: stats.toolUsers ? Math.round(count / stats.toolUsers * 100) : 0 }));
    return { ranked, totalUsers: stats.toolUsers || 0 };
  },

  getCommunityStats() {
    const stats = this._merged();
    if (stats.n === 0) return null;
    const avgScores = {};
    _DIMS.forEach(d => { avgScores[d] = (stats.sumScores[d] || 0) / stats.n; });
    return {
      totalSessions: stats.n, avgScores, archetypeCounts: stats.archetypeCounts,
      exposureBuckets: stats.exposureBuckets, readinessBuckets: stats.readinessBuckets,
      avgExposure: Math.round(stats.sumExposure / stats.n),
      avgReadiness: Math.round(stats.sumReadiness / stats.n)
    };
  },

  getScatterData() {
    const merged = this._merged();
    return merged.scatterPoints || [];
  },

  getAnswerDistribution(questionId, options) {
    const stats = this._merged();
    const qCounts = stats.answerCounts[questionId] || {};
    const total = stats.n || 1;
    return options.map((opt, i) => ({
      label: typeof opt === 'string' ? opt : (opt.text || ''),
      count: qCounts[i] || 0, pct: Math.round((qCounts[i] || 0) / total * 100)
    }));
  },

  // Export local sessions for you to aggregate into community-data.json
  exportLocalStats() { return JSON.stringify(this._loadLocalStats(), null, 2); },
  getLocalSessionCount() { return Object.keys(this._load().sessions).length; }
};
