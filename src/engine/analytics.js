// Analytics: Supabase for shared community data + localStorage for local session retrieval
// Supabase REST API via plain fetch() — no SDK needed

const SUPABASE_URL = 'https://esymcblyhmeuiudpmdff.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzeW1jYmx5aG1ldWl1ZHBtZGZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMTU3ODIsImV4cCI6MjA4Nzc5MTc4Mn0.rTHFZ9yBxdz5Uy70pQRE7avt5k_mwUVOxmCEyAF3LiA';
const LOCAL_KEY = 'ai_career_nav_sessions';
const STATS_CACHE_KEY = 'ai_career_nav_stats_cache';
const _DIMS = ["adoption", "mindset", "craft", "tech_depth", "reliability", "agents"];

function _sbHeaders() {
  return { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Content-Type': 'application/json', 'Prefer': 'return=representation' };
}

async function _sbPost(table, data) {
  const resp = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, { method: 'POST', headers: _sbHeaders(), body: JSON.stringify(data) });
  if (!resp.ok) throw new Error(await resp.text());
  return resp.json();
}

async function _sbGet(table, query) {
  const resp = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query || ''}`, { headers: _sbHeaders() });
  if (!resp.ok) throw new Error(await resp.text());
  return resp.json();
}

const Analytics = {
  _localSessions: null,
  _communityStats: null,

  // Local session storage (for URL-based report retrieval)
  _loadLocal() {
    if (this._localSessions) return this._localSessions;
    try { this._localSessions = JSON.parse(localStorage.getItem(LOCAL_KEY)) || {}; } catch { this._localSessions = {}; }
    // Migrate from old storage key
    try {
      const old = JSON.parse(localStorage.getItem('ai_career_nav_analytics'));
      if (old) {
        const oldSessions = old.sessions || old;
        const map = Array.isArray(oldSessions) ? {} : oldSessions;
        if (Array.isArray(oldSessions)) oldSessions.forEach(s => { map[s.id] = s; });
        Object.assign(this._localSessions, map);
        localStorage.removeItem('ai_career_nav_analytics');
        this._saveLocal();
      }
    } catch {}
    // Migrate from array or nested format
    if (Array.isArray(this._localSessions)) {
      const map = {}; this._localSessions.forEach(s => { map[s.id] = s; }); this._localSessions = map;
    }
    if (this._localSessions.sessions && typeof this._localSessions.sessions === 'object') {
      this._localSessions = this._localSessions.sessions;
    }
    return this._localSessions;
  },
  _saveLocal() { localStorage.setItem(LOCAL_KEY, JSON.stringify(this._localSessions)); },

  // Fetch community stats from Supabase (single row, fast)
  async fetchCommunityStats() {
    try {
      const rows = await _sbGet('community_stats', 'select=*&id=eq.1');
      if (rows.length > 0) {
        this._communityStats = rows[0];
        localStorage.setItem(STATS_CACHE_KEY, JSON.stringify(this._communityStats));
      }
    } catch {
      // Offline — use cache
      try { this._communityStats = JSON.parse(localStorage.getItem(STATS_CACHE_KEY)); } catch {}
    }
  },

  // Submit session to Supabase + save locally
  async recordSession(answers, tags, scores, archetype, exposure, readiness, toolSelections) {
    const serialized = {};
    for (const [k, v] of Object.entries(answers)) { serialized[k] = v instanceof Set ? [...v] : v; }

    const session = {
      scores, archetype, exposure, readiness,
      tool_selections: toolSelections || [],
      answers: serialized, tags
    };

    let id;
    try {
      const rows = await _sbPost('sessions', session);
      id = rows[0].id;
    } catch {
      // Offline fallback — generate local ID
      id = crypto.randomUUID ? crypto.randomUUID() : (Date.now().toString(36) + Math.random().toString(36).slice(2, 10));
    }

    // Save locally for report retrieval
    const local = this._loadLocal();
    local[id] = { id, ts: new Date().toISOString(), answers: serialized, tags, scores, archetype, exposure, readiness, toolSelections: toolSelections || [], feedback: null };
    this._saveLocal();

    // Refresh stats cache
    this.fetchCommunityStats().catch(() => {});

    return id;
  },

  getSession(id) { return this._loadLocal()[id] || null; },

  // Fetch a session from Supabase when not found locally
  async fetchSession(id) {
    const local = this.getSession(id);
    if (local) return local;
    try {
      const rows = await _sbGet('sessions', `select=id,scores,archetype,exposure,readiness,tool_selections,answers,tags,feedback&id=eq.${id}`);
      if (rows.length > 0) {
        const r = rows[0];
        const session = { id: r.id, scores: r.scores, archetype: r.archetype, exposure: r.exposure, readiness: r.readiness, toolSelections: r.tool_selections || [], answers: r.answers || {}, tags: r.tags || [], feedback: r.feedback };
        // Cache locally
        const loc = this._loadLocal();
        loc[id] = session;
        this._saveLocal();
        return session;
      }
    } catch {}
    return null;
  },

  async recordFeedback(sessionId, feedback) {
    const local = this._loadLocal();
    if (local[sessionId]) { local[sessionId].feedback = feedback; this._saveLocal(); }
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/sessions?id=eq.${sessionId}`, {
        method: 'PATCH', headers: _sbHeaders(), body: JSON.stringify({ feedback })
      });
    } catch {}
  },

  getCommunityStats() {
    const s = this._communityStats;
    if (!s || !s.n) return null;
    const avgScores = {};
    _DIMS.forEach(d => { avgScores[d] = (s.sum_scores?.[d] || 0) / s.n; });
    return {
      totalSessions: s.n, avgScores,
      archetypeCounts: s.archetype_counts || {},
      exposureBuckets: s.exposure_buckets || { low: 0, moderate: 0, high: 0 },
      readinessBuckets: s.readiness_buckets || { early: 0, building: 0, strong: 0 },
      avgExposure: Math.round(s.sum_exposure / s.n),
      avgReadiness: Math.round(s.sum_readiness / s.n)
    };
  },

  getToolRankings() {
    const s = this._communityStats;
    if (!s) return { ranked: [], totalUsers: 0 };
    const ranked = Object.entries(s.tool_counts || {})
      .filter(([name]) => name !== "None of the above")
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count, pct: s.tool_users ? Math.round(count / s.tool_users * 100) : 0 }));
    return { ranked, totalUsers: s.tool_users || 0 };
  },

  getAnswerDistribution(questionId, options) {
    const s = this._communityStats;
    const qCounts = s?.answer_counts?.[questionId] || {};
    const total = s?.n || 1;
    return options.map((opt, i) => ({
      label: typeof opt === 'string' ? opt : (opt.text || ''),
      count: qCounts[i] || 0, pct: Math.round((qCounts[i] || 0) / total * 100)
    }));
  },

  // Scatter data
  async getScatterData() {
    try {
      const rows = await _sbGet('sessions', 'select=exposure,readiness,scores');
      return rows.map(r => ({
        exposure: r.exposure, readiness: r.readiness,
        adoption: r.scores?.adoption || 0, mindset: r.scores?.mindset || 0,
        craft: r.scores?.craft || 0, tech_depth: r.scores?.tech_depth || 0,
        reliability: r.scores?.reliability || 0, agents: r.scores?.agents || 0
      }));
    } catch {
      return [];
    }
  },

  async getFeedbacks(page, perPage) {
    const offset = (page - 1) * perPage;
    try {
      const resp = await fetch(
        `${SUPABASE_URL}/rest/v1/sessions?select=id,created_at,archetype,feedback&feedback=not.is.null&order=created_at.desc&offset=${offset}&limit=${perPage}`,
        { headers: { ..._sbHeaders(), 'Prefer': 'count=exact' } }
      );
      if (!resp.ok) return { rows: [], total: 0 };
      const rows = await resp.json();
      const range = resp.headers.get('content-range') || '';
      const total = parseInt(range.split('/')[1]) || rows.length;
      return { rows, total };
    } catch {
      return { rows: [], total: 0 };
    }
  }
};
