// App engine — i18n-aware navigation, scoring, multi-select, results, feedback

let currentQ = 0;
let answers = {};
let userTags = [];
let filteredQuestions = [];
let currentSessionId = null;

function $(id) { return document.getElementById(id); }
function t(key) { return I18N.t(key); }
function isCN() { return I18N.lang() === "cn"; }

// Get localized question text
function qText(q, field) {
  if (isCN() && QUESTIONS_CN[q.id] && QUESTIONS_CN[q.id][field]) return QUESTIONS_CN[q.id][field];
  return q[field] || '';
}
function qOption(q, idx) {
  if (isCN() && QUESTIONS_CN[q.id] && QUESTIONS_CN[q.id].options && QUESTIONS_CN[q.id].options[idx] !== undefined)
    return QUESTIONS_CN[q.id].options[idx];
  return q.options[idx]?.text || '';
}
function sectionName(key) {
  if (isCN() && SECTIONS_CN[key]) return SECTIONS_CN[key];
  return SECTIONS[key] || key;
}
function archName(key) {
  if (isCN() && ARCHETYPES_CN[key]) return ARCHETYPES_CN[key].emoji + ' ' + ARCHETYPES_CN[key].name;
  const a = ARCHETYPES[key];
  return a ? a.emoji + ' ' + a.name : key;
}
function archDesc(key) {
  if (isCN() && ARCHETYPES_CN[key]) return ARCHETYPES_CN[key].desc;
  return ARCHETYPES[key]?.desc || '';
}
function dimLabel(key) { return t('dim_' + key); }
function exposureLabel(pct) {
  if (isCN()) {
    if (pct >= 75) return { label: EXPOSURE_LABELS_CN.high.label, color: "var(--warning)", detail: EXPOSURE_LABELS_CN.high.detail };
    if (pct >= 45) return { label: EXPOSURE_LABELS_CN.moderate.label, color: "var(--accent2)", detail: EXPOSURE_LABELS_CN.moderate.detail };
    return { label: EXPOSURE_LABELS_CN.low.label, color: "var(--success)", detail: EXPOSURE_LABELS_CN.low.detail };
  }
  return getExposureLabel(pct);
}
function readinessLabel(pct) {
  if (isCN()) {
    if (pct >= 70) return { label: READINESS_LABELS_CN.strong.label, color: "var(--success)", detail: READINESS_LABELS_CN.strong.detail };
    if (pct >= 40) return { label: READINESS_LABELS_CN.building.label, color: "var(--accent2)", detail: READINESS_LABELS_CN.building.detail };
    return { label: READINESS_LABELS_CN.early.label, color: "var(--warning)", detail: READINESS_LABELS_CN.early.detail };
  }
  return getReadinessLabel(pct);
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  $(id).classList.add('active');
  $(id).style.animation = 'none'; $(id).offsetHeight; $(id).style.animation = '';
}

function updateProgress() {
  const pct = Math.round(((currentQ + 1) / filteredQuestions.length) * 100);
  $('progressBar').style.setProperty('--pct', pct + '%');
  $('progressText').textContent = pct + '%';
}

function getFilteredQuestions() {
  return QUESTIONS.filter(q => {
    if (!q.showIf) return true;
    return q.showIf.some(tag => userTags.includes(tag));
  });
}

// Initialize on load
window.addEventListener('DOMContentLoaded', async () => {
  I18N.init();
  $('langEn').classList.toggle('active', I18N.lang() === 'en');
  $('langCn').classList.toggle('active', I18N.lang() === 'cn');
  $('logoText').textContent = t('logo');

  // Fetch shared community data from Supabase
  await Analytics.fetchCommunityStats();

  // Check for saved session in URL
  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get('id');
  if (sessionId) {
    const saved = await Analytics.fetchSession(sessionId);
    if (saved) {
      currentSessionId = sessionId;
      answers = saved.answers || {};
      userTags = saved.tags || [];
      showSavedResults(saved);
      return;
    }
  }
  renderWelcome();
});

function renderWelcome() {
  document.querySelector('#welcome h1').textContent = t('welcome_title');
  document.querySelector('#welcome .subtitle').textContent = t('welcome_subtitle');
  const features = document.querySelectorAll('#welcome .feature');
  const fData = [
    ['🎯', 'feature_analysis', 'feature_analysis_desc'],
    ['📊', 'feature_exposure', 'feature_exposure_desc'],
    ['🗺️', 'feature_plan', 'feature_plan_desc']
  ];
  features.forEach((el, i) => {
    if (fData[i]) el.innerHTML = `<strong>${fData[i][0]} ${t(fData[i][1])}</strong><br>${t(fData[i][2])}`;
  });
  document.querySelector('#welcome .data-note').innerHTML = `<strong>${t('research_note')}</strong> ${t('research_sources')}`;
  document.querySelector('#welcome .time-note').textContent = t('time_note');
  $('privacyNote').textContent = t('privacy_note');
  document.querySelector('#welcome .btn').textContent = t('btn_begin');
}

function startAssessment() {
  userTags = []; answers = {}; currentQ = 0;
  filteredQuestions = getFilteredQuestions();
  $('progressContainer').style.display = 'flex';
  showScreen('questionScreen');
  renderQuestion();
}

function renderQuestion() {
  const q = filteredQuestions[currentQ];
  const isMulti = q.type === "multi";

  $('sectionLabel').textContent = sectionName(q.section);
  // Insights: show CN translation if available, otherwise EN, hide if neither
  const cnInsight = isCN() && QUESTIONS_CN[q.id]?.insight;
  $('insightBox').innerHTML = cnInsight || (!isCN() && q.insight ? q.insight : '');
  $('questionTitle').textContent = qText(q, 'title');
  $('questionDesc').textContent = qText(q, 'desc');

  const optionsEl = $('options');
  optionsEl.innerHTML = '';

  const visibleOptions = q.options.filter(o => {
    if (!o.showIf) return true;
    return o.showIf.some(tag => userTags.includes(tag));
  });

  // Build index map: visible index -> original index
  const visibleIndices = [];
  q.options.forEach((o, origIdx) => {
    if (!o.showIf || o.showIf.some(tag => userTags.includes(tag))) visibleIndices.push(origIdx);
  });

  if (isMulti) {
    if (!answers[q.id] || !(answers[q.id] instanceof Set)) answers[q.id] = new Set();
    visibleIndices.forEach((origIdx, vi) => {
      const btn = document.createElement('button');
      btn.className = 'option' + (answers[q.id].has(origIdx) ? ' selected' : '');
      // Tools keep English names (they're proper nouns)
      btn.textContent = q.id === 'ai_tools' ? q.options[origIdx].text : qOption(q, origIdx);
      btn.onclick = () => toggleMulti(q.id, origIdx, btn, q.options);
      optionsEl.appendChild(btn);
    });
  } else {
    visibleIndices.forEach((origIdx, vi) => {
      const btn = document.createElement('button');
      btn.className = 'option' + (answers[q.id] === origIdx ? ' selected' : '');
      btn.textContent = qOption(q, origIdx);
      btn.onclick = () => selectOption(q.id, origIdx, q.options[origIdx], btn);
      optionsEl.appendChild(btn);
    });
  }

  $('backBtn').textContent = t('btn_back');
  $('backBtn').style.visibility = currentQ === 0 ? 'hidden' : 'visible';
  updateNextButton(q);
  updateProgress();
}

function updateNextButton(q) {
  const isMulti = q.type === "multi";
  const hasAnswer = isMulti ? (answers[q.id] instanceof Set && answers[q.id].size > 0) : (answers[q.id] !== undefined);
  $('nextBtn').disabled = !hasAnswer;
  $('nextBtn').textContent = currentQ === filteredQuestions.length - 1 ? t('btn_results') : t('btn_next');
}

function selectOption(qId, idx, opt, btn) {
  answers[qId] = idx;
  if (qId === 'domain' && opt.tags) { userTags = [...opt.tags]; filteredQuestions = getFilteredQuestions(); }
  document.querySelectorAll('.option').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  $('nextBtn').disabled = false;
}

function toggleMulti(qId, idx, btn, allOptions) {
  const set = answers[qId];
  const isNone = allOptions[idx].text === "None of the above";
  if (isNone) { set.clear(); set.add(idx); }
  else {
    allOptions.forEach((o, i) => { if (o.text === "None of the above") set.delete(i); });
    if (set.has(idx)) set.delete(idx); else set.add(idx);
  }
  document.querySelectorAll('.option').forEach((b, i) => {
    // Rebuild visible index mapping
    const q = filteredQuestions[currentQ];
    const visibleIndices = [];
    q.options.forEach((o, origIdx) => {
      if (!o.showIf || o.showIf.some(tag => userTags.includes(tag))) visibleIndices.push(origIdx);
    });
    b.classList.toggle('selected', set.has(visibleIndices[i]));
  });
  updateNextButton(filteredQuestions[currentQ]);
}

function goNext() {
  if (currentQ < filteredQuestions.length - 1) { currentQ++; showScreen('questionScreen'); renderQuestion(); }
  else showResults();
}
function goBack() { if (currentQ > 0) { currentQ--; renderQuestion(); } }

function computeScores() {
  const scores = { adaptability: 0, technical: 0, creative: 0, leadership: 0, aiReadiness: 0, humanEdge: 0 };
  for (const q of filteredQuestions) {
    if (q.type === "multi") continue;
    const idx = answers[q.id];
    if (idx === undefined) continue;
    const opt = q.options[idx];
    if (!opt || !opt.scores) continue;
    for (const [dim, val] of Object.entries(opt.scores)) scores[dim] = (scores[dim] || 0) + val;
  }
  return scores;
}

function getToolSelections() {
  const toolQ = QUESTIONS.find(q => q.id === "ai_tools");
  if (!toolQ || !answers.ai_tools || !(answers.ai_tools instanceof Set)) return [];
  return [...answers.ai_tools].map(i => toolQ.options[i]?.text).filter(Boolean);
}

function generateActionContext(scores, archetypeKey) {
  const cn = isCN();
  const dims = ["adaptability", "technical", "creative", "leadership", "aiReadiness", "humanEdge"];
  const sorted = dims.slice().sort((a, b) => (scores[b] || 0) - (scores[a] || 0));
  const top = sorted[0], weak = sorted[sorted.length - 1];
  const dimNames = cn
    ? { adaptability: "适应力", technical: "技术深度", creative: "创造力", leadership: "领导力", aiReadiness: "AI就绪度", humanEdge: "人类优势" }
    : { adaptability: "adaptability", technical: "technical depth", creative: "creative thinking", leadership: "leadership", aiReadiness: "AI readiness", humanEdge: "human edge" };
  if (cn) return `基于你在「${dimNames[top]}」方面的优势和「${dimNames[weak]}」方面的成长空间，以下建议专为你定制：`;
  return `Based on your strength in ${dimNames[top]} and growth opportunity in ${dimNames[weak]}, these recommendations are tailored for you:`;
}

function renderActionItem(a, i, archetypeKey, scores) {
  let what = a.what, how = a.how;
  if (isCN() && ARCHETYPES_CN[archetypeKey] && ARCHETYPES_CN[archetypeKey].actions && ARCHETYPES_CN[archetypeKey].actions[i]) {
    what = ARCHETYPES_CN[archetypeKey].actions[i].what;
    how = ARCHETYPES_CN[archetypeKey].actions[i].how;
  }
  return `<div class="action-item"><strong>${i + 1}.</strong> ${what}<div class="how">📋 <strong>${t('how_label')}</strong> ${how}</div></div>`;
}

function renderToolRankings(toolRankings, userTools) {
  if (!toolRankings || toolRankings.ranked.length === 0) return '';
  const top = toolRankings.ranked.slice(0, 12);
  const maxCount = top[0]?.count || 1;
  return `
  <div class="result-section">
    <h3>${t('tools_title')}</h3>
    <p style="font-size:14px;color:var(--text2);margin-bottom:16px">${t('tools_desc').replace('{n}', toolRankings.totalUsers)}</p>
    ${top.map((ti, i) => {
      const isYours = userTools.includes(ti.name);
      const barColor = isYours ? 'var(--accent2)' : 'rgba(156,163,184,0.3)';
      const labelStyle = isYours ? 'color:var(--accent2);font-weight:600' : 'color:var(--text2)';
      return `<div class="score-label"><span style="${labelStyle}">${i + 1}. ${ti.name}${isYours ? ' ✓' : ''}</span><span style="color:var(--text2)">${ti.pct}% (${ti.count})</span></div>
        <div class="score-bar"><div class="score-fill" style="width:${(ti.count / maxCount) * 100}%;background:${barColor}"></div></div>`;
    }).join('')}
  </div>`;
}

// Render results from a saved session (URL ?id=UUID)
function showSavedResults(saved) {
  renderResultsPage(saved.scores, saved.archetype, saved.exposure, saved.readiness, saved.toolSelections || [], saved.answers);
}

async function showResults() {
  $('progressContainer').style.display = 'none';
  const scores = computeScores();
  const archetypeKey = determineArchetype(scores, userTags);
  const exposure = computeAIExposure(scores, userTags);
  const readiness = computeReadiness(scores);
  const userTools = getToolSelections();

  currentSessionId = await Analytics.recordSession(answers, userTags, scores, archetypeKey, exposure, readiness, userTools);

  // Push session ID to URL for sharing
  const url = new URL(window.location);
  url.searchParams.set('id', currentSessionId);
  history.replaceState(null, '', url);

  renderResultsPage(scores, archetypeKey, exposure, readiness, userTools, answers);
}

function renderResultsPage(scores, archetypeKey, exposure, readiness, userTools, sessionAnswers) {
  const arch = ARCHETYPES[archetypeKey];
  const expInfo = exposureLabel(exposure);
  const readInfo = readinessLabel(readiness);
  const community = Analytics.getCommunityStats();
  const toolRankings = Analytics.getToolRankings();

  const dims = [
    { key: 'adaptability', icon: '🔄' }, { key: 'technical', icon: '⚙️' },
    { key: 'creative', icon: '💡' }, { key: 'leadership', icon: '🧭' },
    { key: 'aiReadiness', icon: '🤖' }, { key: 'humanEdge', icon: '💎' }
  ];
  const maxDim = Math.max(...Object.values(scores).map(v => Math.abs(v)), 1);

  const MIN_COMMUNITY = 2;
  let communityHTML = '';
  if (community && community.totalSessions >= MIN_COMMUNITY) {
    const topArch = Object.entries(community.archetypeCounts).sort((a, b) => b[1] - a[1])[0];
    const topArchPct = Math.round(topArch[1] / community.totalSessions * 100);
    const archetypeLine = topArchPct < 100
      ? `<p style="font-size:13px;color:var(--text2)"><strong style="color:var(--text)">${t('common_archetype')}</strong> ${archName(topArch[0])} (${topArchPct}%)</p>`
      : '';
    communityHTML = `
    <div class="result-section">
      <h3>${t('community_title')}</h3>
      <p style="font-size:14px;color:var(--text2);margin-bottom:16px">${t('community_desc').replace('{n}', community.totalSessions)}${community.totalSessions < 50 ? ' ' + t('community_early_note') : ''}</p>
      <div class="chart-container">
        <div id="radarChart"></div>
        <div class="chart-legend">
          <span><span class="legend-dot" style="background:#818cf8"></span>${t('legend_you')}</span>
          <span><span class="legend-dot" style="background:rgba(156,163,184,0.5)"></span>${t('legend_community')}</span>
        </div>
      </div>
      <div class="community-stats">
        <div class="stat-card"><div class="stat-value">${community.totalSessions}</div><div class="stat-label">${t('stat_total')}</div></div>
        <div class="stat-card">
          <div class="stat-value" style="color:var(--text2)">${community.avgExposure}% <span style="color:#818cf8">(${exposure}%)</span></div>
          <div class="stat-label">${t('stat_exposure')}</div>
        </div>
        <div class="stat-card">
          <div class="stat-value" style="color:var(--text2)">${community.avgReadiness}% <span style="color:#818cf8">(${readiness}%)</span></div>
          <div class="stat-label">${t('stat_readiness')}</div>
        </div>
      </div>
      <div style="margin-top:16px">
        ${archetypeLine}
        <p style="font-size:13px;color:var(--text2);margin-top:4px"><strong style="color:var(--text)">${t('readiness_dist')}</strong> ${community.readinessBuckets.strong} ${t('readiness_strong')} · ${community.readinessBuckets.building} ${t('readiness_building')} · ${community.readinessBuckets.early} ${t('readiness_early')}</p>
      </div>
    </div>`;
  }

  let yourToolsHTML = '';
  if (userTools.length > 0 && !userTools.includes("None of the above")) {
    const advice = userTools.length >= 5 ? t('toolkit_many') : userTools.length >= 3 ? t('toolkit_mid') : t('toolkit_few');
    yourToolsHTML = `
    <div class="result-section">
      <h3>${t('toolkit_title')}</h3>
      <div>${userTools.map(ti => `<span class="tag">${ti}</span>`).join('')}</div>
      <p style="font-size:13px;color:var(--text2);margin-top:12px">${t('using_tools').replace('{n}', userTools.length)} ${advice}</p>
    </div>`;
  }

  $('resultsContent').innerHTML = `
    <div class="results-header">
      <div class="archetype-badge">${archName(archetypeKey)}</div>
      <h1>${t('results_title')}</h1>
      <p class="subtitle" style="max-width:560px;margin:0 auto">${archDesc(archetypeKey)}</p>
    </div>
    <div class="result-section">
      <h3>${t('impact_title')}</h3>
      <div class="score-label"><span>${t('exposure_label')} — ${expInfo.label}</span><span>${exposure}%</span></div>
      <div class="score-bar"><div class="score-fill" style="width:${exposure}%;background:${expInfo.color}"></div></div>
      <p style="font-size:14px;color:var(--text2);margin:8px 0 16px">${expInfo.detail}</p>
      <div class="score-label"><span>${t('readiness_label')} — ${readInfo.label}</span><span>${readiness}%</span></div>
      <div class="score-bar"><div class="score-fill" style="width:${readiness}%;background:${readInfo.color}"></div></div>
      <p style="font-size:14px;color:var(--text2);margin:8px 0 0">${readInfo.detail} ${t('readiness_action_hint')}</p>
    </div>
    <div class="result-section" id="dashboardSection"></div>
    ${communityHTML}
    <div class="result-section">
      <h3>${t('strength_title')}</h3>
      ${dims.map(d => {
        const val = Math.max(0, scores[d.key]);
        const pct = Math.round((val / maxDim) * 100);
        return `<div class="score-label"><span>${d.icon} ${dimLabel(d.key)}</span><span>${val}</span></div>
          <div class="score-bar"><div class="score-fill" style="width:${pct}%;background:var(--accent2)"></div></div>`;
      }).join('')}
    </div>
    ${renderToolRankings(toolRankings, userTools)}
    <div class="result-section">
      <h3>${t('action_title')}</h3>
      <p style="font-size:14px;color:var(--text2);margin-bottom:16px">${t('action_desc')}</p>
      <p style="font-size:13px;color:var(--accent2);margin-bottom:16px;font-style:italic">${generateActionContext(scores, archetypeKey)}</p>
      ${arch.actions.map((a, i) => renderActionItem(a, i, archetypeKey, scores)).join('')}
    </div>
    <div class="result-section">
      <h3>${t('skills_title')}</h3>
      <p style="font-size:12px;color:var(--text-secondary);margin:-4px 0 10px">${t('tap_tag_hint')}</p>
      <div>${getItems('skills', archetypeKey, arch).map(s => renderExpandTag(s)).join('')}</div>
    </div>
    <div class="result-section">
      <h3>${t('roles_title')}</h3>
      <p style="font-size:12px;color:var(--text-secondary);margin:-4px 0 10px">${t('tap_tag_hint')}</p>
      <div>${getItems('roles', archetypeKey, arch).map(r => renderExpandTag(r)).join('')}</div>
    </div>
    ${arch.resources ? `
    <div class="result-section">
      <h3>${t('resources_title')}</h3>
      ${isCN() && ARCHETYPES_CN[archetypeKey]?.resources ? `
      <div style="display:flex;gap:8px;margin-bottom:16px">
        <button class="btn secondary resource-tab active" onclick="switchResourceTab('cn',this)">${t('resources_tab_cn')}</button>
        <button class="btn secondary resource-tab" onclick="switchResourceTab('en',this)">${t('resources_tab_en')}</button>
      </div>
      <div id="resourcesCN">${renderResources(ARCHETYPES_CN[archetypeKey].resources)}</div>
      <div id="resourcesEN" style="display:none">${renderResources(arch.resources)}</div>
      ` : renderResources(arch.resources)}
    </div>` : ''}
    <div class="result-section">
      <h3>${t('insight_title')}</h3>
      <p style="font-size:15px;color:var(--text2);line-height:1.7">${generateInsight(scores, exposure, readiness, archetypeKey, community)}</p>
      <p style="font-size:12px;color:var(--text2);margin-top:12px;font-style:italic">${t('insight_sources')}</p>
    </div>
    <div class="restart-btn">
      <button class="btn primary" onclick="openFeedback()">${t('btn_feedback')}</button>
      <button class="btn secondary" onclick="retakeAssessment()">${t('btn_retake')}</button>
    </div>
    <div class="share-note" id="shareNote">
      <p>🔗 ${t('share_note')}</p>
      <div class="share-url-row">
        <input type="text" id="shareUrl" readonly value="" onclick="this.select()">
        <button class="btn secondary" onclick="copyShareUrl()">${t('share_copy')}</button>
      </div>
      <p style="font-size:12px;color:var(--text2);margin-top:6px">${t('share_id')}: <code id="shareId"></code></p>
    </div>
    <div style="text-align:center;margin-top:20px">
      <button class="btn secondary" onclick="showFeedbackViewer()">${t('view_feedbacks')}</button>
    </div>
    <div id="feedbackViewer" style="display:none"></div>
  `;

  showScreen('results');

  // Populate share URL
  if (currentSessionId) {
    const shareUrl = new URL(window.location);
    shareUrl.searchParams.set('id', currentSessionId);
    if ($('shareUrl')) $('shareUrl').value = shareUrl.toString();
    if ($('shareId')) $('shareId').textContent = currentSessionId;
  }

  // Render charts after DOM is ready
  setTimeout(async () => {
    if (community && community.totalSessions >= MIN_COMMUNITY) {
      drawRadarChart('radarChart', scores, community.avgScores);
    }

    // Dashboard: scatter plots + sentiment chart
    const allSessions = await Analytics.getScatterData();
    if (allSessions.length >= MIN_COMMUNITY) {
      const currentPt = { exposure, readiness, aiReadiness: scores.aiReadiness || 0, adaptability: scores.adaptability || 0 };

      // Sentiment distribution for ai_perception question
      const perceptionQ = QUESTIONS.find(q => q.id === 'ai_perception');
      const perceptionOpts = perceptionQ ? perceptionQ.options : [];
      const sentLabels = isCN() && QUESTIONS_CN.ai_perception
        ? QUESTIONS_CN.ai_perception.options.map((text, i) => ({ text, origIdx: i }))
        : perceptionOpts.map((o, i) => ({ text: o.text, origIdx: i }));
      const sentDist = Analytics.getAnswerDistribution('ai_perception', perceptionOpts);
      const sentData = sentLabels.map((sl, i) => ({ label: sl.text, count: sentDist[i].count, pct: sentDist[i].pct }));
      const userPerceptionIdx = sessionAnswers.ai_perception;

      const dashEl = $('dashboardSection');
      dashEl.innerHTML = `
        <h3>${t('dashboard_title')}</h3>
        <p style="font-size:14px;color:var(--text2);margin-bottom:20px">${t('dashboard_desc')}</p>
        <div class="chart-grid">
          <div class="chart-box">
            <h4>${t('scatter_exposure_readiness')}</h4>
            <div id="scatterExposure"></div>
          </div>
          <div class="chart-box">
            <h4>${t('scatter_adoption_adaptability')}</h4>
            <div id="scatterAdoption"></div>
          </div>
        </div>
        <div style="margin-top:20px">
          <div class="chart-box">
            <h4>${t('sentiment_title')}</h4>
            <div id="sentimentChart"></div>
            <div class="chart-note">${t('sentiment_note')}</div>
          </div>
        </div>
      `;

      // Normalize AI readiness and adaptability to 0-100 for scatter
      const maxAI = Math.max(...allSessions.map(s => s.aiReadiness), currentPt.aiReadiness, 1);
      const maxAdapt = Math.max(...allSessions.map(s => s.adaptability), currentPt.adaptability, 1);
      const normalizedSessions = allSessions.map(s => ({
        ...s,
        aiReadinessNorm: Math.round((s.aiReadiness / maxAI) * 100),
        adaptabilityNorm: Math.round((s.adaptability / maxAdapt) * 100)
      }));
      const normalizedCurrent = {
        ...currentPt,
        aiReadinessNorm: Math.round((currentPt.aiReadiness / maxAI) * 100),
        adaptabilityNorm: Math.round((currentPt.adaptability / maxAdapt) * 100)
      };

      drawScatterPlot('scatterExposure', allSessions, currentPt, 'exposure', 'readiness', t('scatter_exposure_label'), t('scatter_readiness_label'));
      drawScatterPlot('scatterAdoption', normalizedSessions, normalizedCurrent, 'aiReadinessNorm', 'adaptabilityNorm', t('scatter_adoption_label'), t('scatter_adaptability_label'));
      drawSentimentChart('sentimentChart', sentData, userPerceptionIdx);
    } else {
      $('dashboardSection').style.display = 'none';
    }
  }, 100);
}

function getItems(field, key, arch) {
  return isCN() && ARCHETYPES_CN[key]?.[field] || arch[field];
}

function renderExpandTag(item) {
  if (typeof item === 'string') return `<span class="tag">${item}</span>`;
  const parts = item.detail.split('⚡');
  const html = parts.length > 1
    ? `${parts[0]}<br><span style="color:var(--accent2)">⚡${parts[1]}</span>`
    : item.detail;
  return `<span class="tag has-detail" onclick="event.stopPropagation();showTagDetail(this)">${item.name}<div class="tag-popover">${html}</div></span>`;
}

function showTagDetail(el) {
  hideTagDetail();
  const pop = el.querySelector('.tag-popover');
  if (!pop) return;
  let overlay = document.getElementById('tagOverlay');
  if (!overlay) { overlay = document.createElement('div'); overlay.id = 'tagOverlay'; overlay.className = 'tag-overlay'; overlay.onclick = hideTagDetail; document.body.appendChild(overlay); }
  overlay.classList.add('visible');
  pop.classList.add('visible');
  const tr = el.getBoundingClientRect();
  const w = Math.min(400, window.innerWidth - 16);
  pop.style.width = w + 'px';
  let left = tr.left + tr.width / 2 - w / 2;
  left = Math.max(8, Math.min(left, window.innerWidth - w - 8));
  pop.style.left = left + 'px';
  pop.style.bottom = (window.innerHeight - tr.top + 6) + 'px';
  pop.style.top = '';
  if (tr.top < pop.offsetHeight + 16) {
    pop.style.bottom = '';
    pop.style.top = (tr.bottom + 6) + 'px';
  }
}

function hideTagDetail() {
  document.querySelectorAll('.tag-popover.visible').forEach(p => {
    p.classList.remove('visible');
    p.style.bottom = ''; p.style.top = ''; p.style.left = ''; p.style.width = '';
  });
  document.getElementById('tagOverlay')?.classList.remove('visible');
}
function renderResources(res) {
  return `
    <div style="margin-bottom:14px">
      <h4 style="font-size:14px;color:var(--accent2);margin-bottom:8px">${t('resources_people')}</h4>
      ${res.people.map(p => `<div class="action-item" style="padding:10px 14px;margin-bottom:6px">${p}</div>`).join('')}
    </div>
    <div style="margin-bottom:14px">
      <h4 style="font-size:14px;color:var(--accent2);margin-bottom:8px">${t('resources_books')}</h4>
      ${res.books.map(b => `<div class="action-item" style="padding:10px 14px;margin-bottom:6px">${b}</div>`).join('')}
    </div>
    <div>
      <h4 style="font-size:14px;color:var(--accent2);margin-bottom:8px">${t('resources_articles')}</h4>
      ${res.articles.map(a => `<div class="action-item" style="padding:10px 14px;margin-bottom:6px">${a}</div>`).join('')}
    </div>`;
}

function switchResourceTab(tab, btn) {
  document.querySelectorAll('.resource-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  $('resourcesCN').style.display = tab === 'cn' ? 'block' : 'none';
  $('resourcesEN').style.display = tab === 'en' ? 'block' : 'none';
}

// Feedback viewer with pagination
let _fbPage = 1;
const _fbPerPage = 5;

async function showFeedbackViewer(page) {
  _fbPage = page || 1;
  const viewer = $('feedbackViewer');
  viewer.style.display = 'block';
  viewer.innerHTML = `<div class="result-section" style="margin-top:20px"><p style="color:var(--text2)">${isCN() ? '加载中...' : 'Loading...'}</p></div>`;

  const { rows, total } = await Analytics.getFeedbacks(_fbPage, _fbPerPage);
  const totalPages = Math.ceil(total / _fbPerPage);
  const archNames = isCN() && typeof ARCHETYPES_CN !== 'undefined' ? ARCHETYPES_CN : ARCHETYPES;
  const starStr = (n) => '★'.repeat(n || 0) + '☆'.repeat(5 - (n || 0));

  let html = `<div class="result-section" style="margin-top:20px"><h3>${t('feedbacks_title')}</h3>`;
  if (rows.length === 0) {
    html += `<p style="color:var(--text2)">${isCN() ? '暂无反馈' : 'No feedback yet'}</p>`;
  } else {
    html += rows.map(r => {
      const fb = r.feedback;
      const name = archNames[r.archetype]?.name || r.archetype;
      const date = new Date(r.created_at).toLocaleDateString();
      return `<div class="action-item">
        <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text2);margin-bottom:8px">
          <span>${name}</span><span>${date}</span>
        </div>
        <div style="font-size:13px;color:var(--text2)">
          ${fb.ratings ? Object.entries(fb.ratings).filter(([,v]) => v).map(([k,v]) => `<span style="margin-right:12px">${k}: <span style="color:var(--warning)">${starStr(v)}</span></span>`).join('') : ''}
        </div>
        ${fb.comment ? `<p style="font-size:14px;color:var(--text);margin-top:8px">"${fb.comment}"</p>` : ''}
      </div>`;
    }).join('');

    // Pagination
    if (totalPages > 1) {
      html += `<div style="display:flex;justify-content:center;gap:8px;margin-top:16px">`;
      for (let p = 1; p <= totalPages; p++) {
        html += `<button class="btn ${p === _fbPage ? 'primary' : 'secondary'}" style="padding:6px 14px;font-size:13px" onclick="showFeedbackViewer(${p})">${p}</button>`;
      }
      html += `</div>`;
    }
  }
  html += `<p style="font-size:12px;color:var(--text2);margin-top:12px">${total} ${isCN() ? '条反馈' : 'feedback(s) total'}</p></div>`;
  viewer.innerHTML = html;
}

function retakeAssessment() {
  const url = new URL(window.location);
  url.searchParams.delete('id');
  window.location = url.toString();
}

function copyShareUrl() {
  const input = $('shareUrl');
  if (!input) return;
  navigator.clipboard.writeText(input.value).then(() => {
    const btn = input.nextElementSibling;
    const orig = btn.textContent;
    btn.textContent = '✓';
    setTimeout(() => { btn.textContent = orig; }, 1500);
  });
}

// Feedback
const FEEDBACK_DIMS = [
  { key: "accuracy", tKey: "fb_accuracy" },
  { key: "actionability", tKey: "fb_actionability" },
  { key: "insight", tKey: "fb_insight" },
  { key: "overall", tKey: "fb_overall" }
];

function openFeedback() {
  document.querySelector('#feedbackModal h3').textContent = t('fb_title');
  document.querySelector('#feedbackModal .modal-desc').textContent = t('fb_desc');
  document.querySelector('#feedbackModal label').textContent = t('fb_comment');
  $('feedbackComment').placeholder = t('fb_placeholder');
  document.querySelector('#feedbackModal .btn.secondary').textContent = t('fb_skip');
  document.querySelector('#feedbackModal .btn.primary').textContent = t('fb_submit');

  $('feedbackGrid').innerHTML = FEEDBACK_DIMS.map(d => `
    <div class="star-row">
      <span class="dim-label">${t(d.tKey)}</span>
      <div class="stars" data-dim="${d.key}">
        ${[1,2,3,4,5].map(n => `<button onclick="rateStar('${d.key}',${n})" data-n="${n}">★</button>`).join('')}
      </div>
    </div>
  `).join('');
  $('feedbackComment').value = '';
  $('feedbackModal').style.display = 'flex';
}

function closeFeedback() { $('feedbackModal').style.display = 'none'; }

function rateStar(dim, n) {
  const stars = document.querySelector(`.stars[data-dim="${dim}"]`);
  stars.querySelectorAll('button').forEach(btn => btn.classList.toggle('active', parseInt(btn.dataset.n) <= n));
  stars.dataset.rating = n;
}

function submitFeedback() {
  const ratings = {};
  FEEDBACK_DIMS.forEach(d => {
    const stars = document.querySelector(`.stars[data-dim="${d.key}"]`);
    ratings[d.key] = parseInt(stars.dataset.rating) || null;
  });
  if (currentSessionId) Analytics.recordFeedback(currentSessionId, { ratings, comment: $('feedbackComment').value.trim() });
  closeFeedback();
}
