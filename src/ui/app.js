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
  const labels = isCN() ? EXPOSURE_LABELS_CN : EXPOSURE_LABELS;
  if (pct >= 75) return { label: labels.high.label, color: "var(--warning)", detail: labels.high.detail };
  if (pct >= 45) return { label: labels.moderate.label, color: "var(--accent2)", detail: labels.moderate.detail };
  return { label: labels.low.label, color: "var(--success)", detail: labels.low.detail };
}
function readinessLabel(pct) {
  const labels = isCN() ? READINESS_LABELS_CN : READINESS_LABELS;
  if (pct >= 70) return { label: labels.strong.label, color: "var(--success)", detail: labels.strong.detail };
  if (pct >= 40) return { label: labels.building.label, color: "var(--accent2)", detail: labels.building.detail };
  return { label: labels.early.label, color: "var(--warning)", detail: labels.early.detail };
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

let currentTrack = null;

function getFilteredQuestions() {
  // Phase 1: calibration only
  if (!currentTrack) return QUESTIONS.filter(q => q.section === 'calibration');
  // Phase 2: full adaptive set
  return getAdaptiveQuestions(currentTrack);
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
  userTags = []; answers = {}; currentQ = 0; currentTrack = null;
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
  $('questionTitle').innerHTML = (q.type === 'multi' ? `<span class="multi-label">${t('multi_label')}</span> ` : '') + qText(q, 'title');
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
  if (qId === 'domain' && opt.tags) userTags = [...opt.tags];
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
  if (currentQ < filteredQuestions.length - 1) {
    currentQ++;
    // After calibration (4 questions), determine track and expand question set
    if (!currentTrack && currentQ >= 4) {
      currentTrack = determineTrack(answers);
      const newQs = getFilteredQuestions();
      currentQ = newQs.findIndex(q => !answers.hasOwnProperty(q.id));
      if (currentQ < 0) currentQ = newQs.length - 1;
      filteredQuestions = newQs;
    }
    showScreen('questionScreen'); renderQuestion();
  }
  else showResults();
}
function goBack() { if (currentQ > 0) { currentQ--; renderQuestion(); } }

function computeScores() {
  const result = calculateScores(answers);
  applyCrossCheck(result, answers);
  return result;
}

function getToolSelections() { return []; }

function generateActionContext(scores, archetypeKey) {
  const cn = isCN();
  const { normalized } = scores;
  const dims = Object.keys(normalized);
  const sorted = dims.slice().sort((a, b) => (normalized[b] || 0) - (normalized[a] || 0));
  const top = sorted[0], weak = sorted[sorted.length - 1];
  const dimNames = cn
    ? { usage_depth: "AI 使用深度", workflow: "工作流思维", system: "系统思维", adaptability: "适应力", builder: "构建者直觉" }
    : { usage_depth: "AI usage depth", workflow: "workflow thinking", system: "system thinking", adaptability: "adaptability", builder: "builder instinct" };
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
  const archetypeKey = determineArchetype(scores);
  const exposure = computeAIExposure(answers);
  const readiness = computeReadiness(scores.normalized);
  const userTools = getToolSelections(answers);
  userTags = getDomainTags(answers);
  const sentiment = calculateSentiment(answers);
  const sentProfile = getSentimentProfile(sentiment);
  scores.normalized.mindset = sentiment.mindset;

  currentSessionId = await Analytics.recordSession(answers, userTags, scores.normalized, archetypeKey, exposure, readiness, userTools);

  const url = new URL(window.location);
  url.searchParams.set('id', currentSessionId);
  history.replaceState(null, '', url);

  renderResultsPage(scores, archetypeKey, exposure, readiness, userTools, answers, sentProfile);
}

function renderResultsPage(scores, archetypeKey, exposure, readiness, userTools, sessionAnswers, sentProfile) {
  const arch = ARCHETYPES[archetypeKey];
  const expInfo = exposureLabel(exposure);
  const readInfo = readinessLabel(readiness);
  const community = Analytics.getCommunityStats();
  const toolRankings = Analytics.getToolRankings();

  let yourToolsHTML = '';
  if (userTools.length > 0) {
    const advice = userTools.length >= 5 ? t('toolkit_many') : userTools.length >= 3 ? t('toolkit_mid') : t('toolkit_few');
    yourToolsHTML = `
    <div class="result-section">
      <h3>${t('toolkit_title')}</h3>
      <div>${userTools.map(ti => `<span class="tag">${ti}</span>`).join('')}</div>
      <p style="font-size:13px;color:var(--text2);margin-top:12px">${t('using_tools').replace('{n}', userTools.length)} ${advice}</p>
    </div>`;
  }

  const dims = [
    { key: 'usage_depth', icon: '📊' }, { key: 'workflow', icon: '⚙️' },
    { key: 'system', icon: '🧠' }, { key: 'adaptability', icon: '🔄' },
    { key: 'builder', icon: '🏗️' }, { key: 'mindset', icon: '💡' }
  ];
  const norm = scores.normalized || scores;
  const maxDim = Math.max(...dims.map(d => norm[d.key] || 0), 1);

  const MIN_COMMUNITY = 2;
  let communityHTML = '';
  if (community && community.totalSessions >= MIN_COMMUNITY) {
    communityHTML = `
    <div class="result-section">
      <h3>${t('community_title')}</h3>
      <p style="font-size:14px;color:var(--text2);margin-bottom:16px">${t('community_desc').replace('{n}', community.totalSessions)}${community.totalSessions < 50 ? ' ' + t('community_early_note') : ''}</p>
      <div class="chart-container">
        <div id="radarChart"></div>
      </div>
    </div>`;
  }

  // Strengths detected
  const strengthsHTML = arch.strengths ? arch.strengths.map(s => {
    const str = isCN() && ARCHETYPES_CN[archetypeKey]?.strengths ? ARCHETYPES_CN[archetypeKey].strengths[arch.strengths.indexOf(s)] || s : s;
    return `<div class="action-item" style="padding:10px 14px;margin-bottom:6px">✔ ${str}</div>`;
  }).join('') : '';

  // Blind spot
  const blindSpot = isCN() && ARCHETYPES_CN[archetypeKey]?.blindSpot ? ARCHETYPES_CN[archetypeKey].blindSpot : arch.blindSpot;

  // Next level hint
  const nextLevel = isCN() && ARCHETYPES_CN[archetypeKey]?.nextLevel ? ARCHETYPES_CN[archetypeKey].nextLevel : arch.nextLevel;

  // Evolution map
  const levels = ['tourist', 'explorer', 'hacker', 'operator', 'architect'];
  const levelNames = isCN()
    ? { tourist: '🌱 AI 游客', explorer: '🧭 提示词探索者', hacker: '⚙️ 工作流黑客', operator: '🧠 AI 操作者', architect: '🏗️ 系统架构师' }
    : { tourist: '🌱 AI Tourist', explorer: '🧭 Prompt Explorer', hacker: '⚙️ Workflow Hacker', operator: '🧠 AI Operator', architect: '🏗️ System Architect' };
  const evolutionMap = levels.map(l =>
    `<span style="padding:6px 12px;border-radius:6px;font-size:13px;${l === archetypeKey ? 'background:var(--accent-glow);color:var(--accent2);border:1px solid var(--accent);font-weight:600' : 'color:var(--text2);opacity:0.5'}">${levelNames[l]}</span>`
  ).join('<span style="color:var(--text2);opacity:0.3;margin:0 2px">→</span>');

  const sp = SENTIMENT_PROFILES[sentProfile] || SENTIMENT_PROFILES.pragmatic_adopter;
  const sentName = isCN() ? sp.cn : sp.en;
  const sentDesc = isCN() ? sp.desc_cn : sp.desc_en;

  $('resultsContent').innerHTML = `
    <div class="results-header">
      <div class="archetype-badge">${archName(archetypeKey)}</div>
      <p style="font-size:14px;color:var(--accent2);margin:8px 0 4px">— ${sentName}</p>
      <p style="font-size:13px;color:var(--text2);margin:0 0 12px">${sentDesc}</p>
      <h1>${t('results_title')}</h1>
      <p class="subtitle" style="max-width:560px;margin:0 auto">${archDesc(archetypeKey)}</p>
    </div>
    <div class="result-section">
      <h3>${t('evolution_title') || '🗺️ Your Position'}</h3>
      <div style="display:flex;flex-wrap:wrap;align-items:center;gap:4px;margin-bottom:16px">${evolutionMap}</div>
      ${nextLevel ? `<p style="font-size:13px;color:var(--text2);line-height:1.6;font-style:italic">⬆️ ${nextLevel}</p>` : ''}
    </div>
    <div class="result-section">
      <h3>${t('detected_title') || '🔍 What We Detected'}</h3>
      ${strengthsHTML}
      ${blindSpot ? `<p style="font-size:14px;color:var(--text2);margin-top:12px;line-height:1.6">⚠️ <strong>${t('blind_spot') || 'Blind spot'}:</strong> ${blindSpot}</p>` : ''}
    </div>
    <div class="result-section">
      <h3>${t('strength_title')}</h3>
      ${dims.map(d => {
        const val = Math.round((norm[d.key] || 0) * 10) / 10;
        const pct = Math.round((val / 10) * 100);
        return `<div class="score-label"><span>${d.icon} ${dimLabel(d.key)}</span><span>${val.toFixed(1)}</span></div>
          <div class="score-bar"><div class="score-fill" style="width:${pct}%;background:var(--accent2)"></div></div>`;
      }).join('')}
    </div>
    ${communityHTML}
    ${yourToolsHTML}
    ${renderToolRankings(toolRankings, userTools)}
    <div class="result-section" id="dashboardSection"></div>
    <div class="result-section">
      <h3>${t('action_title')}</h3>
      <p style="font-size:14px;color:var(--text2);margin-bottom:16px">${t('action_desc')}</p>
      <p style="font-size:13px;color:var(--accent2);margin-bottom:16px;font-style:italic">${generateActionContext(scores, archetypeKey)}</p>
      ${arch.actions.map((a, i) => renderActionItem(a, i, archetypeKey, scores)).join('')}
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

  if (currentSessionId) {
    const shareUrl = new URL(window.location);
    shareUrl.searchParams.set('id', currentSessionId);
    if ($('shareUrl')) $('shareUrl').value = shareUrl.toString();
    if ($('shareId')) $('shareId').textContent = currentSessionId;
  }

  setTimeout(async () => {
    if (community && community.totalSessions >= MIN_COMMUNITY) {
      drawRadarChart('radarChart', norm, community.avgScores);
    }

    const allSessions = await Analytics.getScatterData();
    if (allSessions.length >= MIN_COMMUNITY) {
      const currentPt = { exposure, readiness, usage_depth: norm.usage_depth || 0, adaptability: norm.adaptability || 0 };

      // Sentiment distribution for sent_emotion question
      const sentQ = QUESTIONS.find(q => q.id === 'sent_emotion');
      const sentOpts = sentQ ? sentQ.options : [];
      const sentLabels = isCN() && QUESTIONS_CN.sent_emotion
        ? QUESTIONS_CN.sent_emotion.options.map((text, i) => ({ text, origIdx: i }))
        : sentOpts.map((o, i) => ({ text: o.text, origIdx: i }));
      const sentDist = Analytics.getAnswerDistribution('sent_emotion', sentOpts);
      const sentData = sentLabels.map((sl, i) => ({ label: sl.text, count: sentDist[i]?.count || 0, pct: sentDist[i]?.pct || 0 }));
      const userSentIdx = sessionAnswers.sent_emotion;

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

      // Normalize usage_depth and adaptability to 0-100 for scatter
      const maxUD = Math.max(...allSessions.map(s => s.aiReadiness || s.usage_depth || 0), currentPt.usage_depth, 1);
      const maxAdapt = Math.max(...allSessions.map(s => s.adaptability || 0), currentPt.adaptability, 1);
      const normalizedSessions = allSessions.map(s => ({
        ...s,
        aiReadinessNorm: Math.round(((s.aiReadiness || s.usage_depth || 0) / maxUD) * 100),
        adaptabilityNorm: Math.round(((s.adaptability || 0) / maxAdapt) * 100)
      }));
      const normalizedCurrent = {
        ...currentPt,
        aiReadinessNorm: Math.round((currentPt.usage_depth / maxUD) * 100),
        adaptabilityNorm: Math.round((currentPt.adaptability / maxAdapt) * 100)
      };

      drawScatterPlot('scatterExposure', allSessions, currentPt, 'exposure', 'readiness', t('scatter_exposure_label'), t('scatter_readiness_label'));
      drawScatterPlot('scatterAdoption', normalizedSessions, normalizedCurrent, 'aiReadinessNorm', 'adaptabilityNorm', t('scatter_adoption_label'), t('scatter_adaptability_label'));
      drawSentimentChart('sentimentChart', sentData, userSentIdx);
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
