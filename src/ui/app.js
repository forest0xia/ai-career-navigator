// App engine — navigation, scoring, multi-select, tool rankings, feedback

let currentQ = 0;
let answers = {};       // questionId -> optionIndex (single) or Set of indices (multi)
let userTags = [];
let filteredQuestions = [];
let currentSessionId = null;

function $(id) { return document.getElementById(id); }

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  $(id).classList.add('active');
  $(id).style.animation = 'none';
  $(id).offsetHeight;
  $(id).style.animation = '';
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

  $('sectionLabel').textContent = SECTIONS[q.section];
  $('insightBox').innerHTML = q.insight || '';
  $('questionTitle').textContent = q.title;
  $('questionDesc').textContent = q.desc || '';

  const optionsEl = $('options');
  optionsEl.innerHTML = '';

  const visibleOptions = q.options.filter(o => {
    if (!o.showIf) return true;
    return o.showIf.some(tag => userTags.includes(tag));
  });

  if (isMulti) {
    // Initialize multi-select set
    if (!answers[q.id] || !(answers[q.id] instanceof Set)) {
      answers[q.id] = new Set();
    }
    visibleOptions.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'option' + (answers[q.id].has(i) ? ' selected' : '');
      btn.textContent = opt.text;
      btn.onclick = () => toggleMulti(q.id, i, btn, visibleOptions);
      optionsEl.appendChild(btn);
    });
  } else {
    visibleOptions.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'option' + (answers[q.id] === i ? ' selected' : '');
      btn.textContent = opt.text;
      btn.onclick = () => selectOption(q.id, i, opt, btn);
      optionsEl.appendChild(btn);
    });
  }

  $('backBtn').style.visibility = currentQ === 0 ? 'hidden' : 'visible';
  updateNextButton(q);
  updateProgress();
}

function updateNextButton(q) {
  const isMulti = q.type === "multi";
  const hasAnswer = isMulti
    ? (answers[q.id] instanceof Set && answers[q.id].size > 0)
    : (answers[q.id] !== undefined);
  $('nextBtn').disabled = !hasAnswer;
  $('nextBtn').textContent = currentQ === filteredQuestions.length - 1 ? 'See Results →' : 'Next →';
}

function selectOption(qId, idx, opt, btn) {
  answers[qId] = idx;
  if (qId === 'domain' && opt.tags) {
    userTags = [...opt.tags];
    filteredQuestions = getFilteredQuestions();
  }
  document.querySelectorAll('.option').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  $('nextBtn').disabled = false;
}

function toggleMulti(qId, idx, btn, visibleOptions) {
  const set = answers[qId];
  // "None of the above" logic
  const isNone = visibleOptions[idx].text === "None of the above";
  if (isNone) {
    set.clear();
    set.add(idx);
  } else {
    // Remove "none" if selecting something else
    visibleOptions.forEach((o, i) => { if (o.text === "None of the above") set.delete(i); });
    if (set.has(idx)) set.delete(idx); else set.add(idx);
  }
  // Update all button states
  document.querySelectorAll('.option').forEach((b, i) => {
    b.classList.toggle('selected', set.has(i));
  });
  updateNextButton(filteredQuestions[currentQ]);
}

function goNext() {
  if (currentQ < filteredQuestions.length - 1) {
    currentQ++;
    showScreen('questionScreen');
    renderQuestion();
  } else {
    showResults();
  }
}

function goBack() {
  if (currentQ > 0) { currentQ--; renderQuestion(); }
}

function computeScores() {
  const scores = { adaptability: 0, technical: 0, creative: 0, leadership: 0, aiReadiness: 0, humanEdge: 0 };
  for (const q of filteredQuestions) {
    if (q.type === "multi") continue; // multi-select doesn't contribute to dimension scores
    const idx = answers[q.id];
    if (idx === undefined) continue;
    const visibleOptions = q.options.filter(o => !o.showIf || o.showIf.some(t => userTags.includes(t)));
    const opt = visibleOptions[idx];
    if (!opt || !opt.scores) continue;
    for (const [dim, val] of Object.entries(opt.scores)) {
      scores[dim] = (scores[dim] || 0) + val;
    }
  }
  return scores;
}

function getToolSelections() {
  const toolQ = QUESTIONS.find(q => q.id === "ai_tools");
  if (!toolQ || !answers.ai_tools || !(answers.ai_tools instanceof Set)) return [];
  return [...answers.ai_tools].map(i => toolQ.options[i]?.text).filter(Boolean);
}

function renderActionItem(a, i) {
  let html = `<div class="action-item"><strong>${i + 1}.</strong> ${a.what}`;
  html += `<div class="how">📋 <strong>How:</strong> ${a.how}`;
  if (a.link) html += ` <a href="${a.link}" target="_blank" rel="noopener">→ Resource</a>`;
  html += `</div></div>`;
  return html;
}

function renderToolRankings(toolRankings, userTools) {
  if (!toolRankings || toolRankings.ranked.length === 0) return '';
  const top = toolRankings.ranked.slice(0, 12);
  const maxCount = top[0]?.count || 1;

  return `
  <div class="result-section">
    <h3>🛠️ Most Popular AI Tools Across All Users</h3>
    <p style="font-size:14px;color:var(--text2);margin-bottom:16px">
      Based on ${toolRankings.totalUsers} users. Tools you selected are highlighted.
    </p>
    ${top.map((t, i) => {
      const isYours = userTools.includes(t.name);
      const barColor = isYours ? 'var(--accent2)' : 'rgba(156,163,184,0.3)';
      const labelStyle = isYours ? 'color:var(--accent2);font-weight:600' : 'color:var(--text2)';
      return `
        <div class="score-label">
          <span style="${labelStyle}">${i + 1}. ${t.name}${isYours ? ' ✓' : ''}</span>
          <span style="color:var(--text2)">${t.pct}% (${t.count})</span>
        </div>
        <div class="score-bar"><div class="score-fill" style="width:${(t.count / maxCount) * 100}%;background:${barColor}"></div></div>`;
    }).join('')}
  </div>`;
}

function showResults() {
  $('progressContainer').style.display = 'none';
  const scores = computeScores();
  const archetypeKey = determineArchetype(scores, userTags);
  const arch = ARCHETYPES[archetypeKey];
  const exposure = computeAIExposure(scores, userTags);
  const readiness = computeReadiness(scores);
  const expInfo = getExposureLabel(exposure);
  const readInfo = getReadinessLabel(readiness);
  const userTools = getToolSelections();

  // Record to analytics
  currentSessionId = Analytics.recordSession(answers, userTags, scores, archetypeKey, exposure, readiness, userTools);

  const community = Analytics.getCommunityStats();
  const toolRankings = Analytics.getToolRankings();

  const dims = [
    { key: 'adaptability', label: 'Adaptability', icon: '🔄' },
    { key: 'technical', label: 'Technical Depth', icon: '⚙️' },
    { key: 'creative', label: 'Creative Thinking', icon: '💡' },
    { key: 'leadership', label: 'Leadership', icon: '🧭' },
    { key: 'aiReadiness', label: 'AI Readiness', icon: '🤖' },
    { key: 'humanEdge', label: 'Human Edge', icon: '💎' }
  ];

  const maxDim = Math.max(...Object.values(scores).map(v => Math.abs(v)), 1);

  // Community comparison section
  let communityHTML = '';
  if (community && community.totalSessions > 1) {
    const archNames = {
      aiArchitect: "🏗️ AI Architect", aiCollaborator: "🤝 AI Collaborator",
      humanEdge: "💎 Human Edge", strategicLeader: "🧭 Strategic Leader",
      creativeInnovator: "🎨 Creative Innovator", careerPivot: "🔄 Career Reinventor"
    };
    const topArchetype = Object.entries(community.archetypeCounts).sort((a, b) => b[1] - a[1])[0];

    communityHTML = `
    <div class="result-section">
      <h3>👥 Community Comparison</h3>
      <p style="font-size:14px;color:var(--text2);margin-bottom:16px">
        How your profile compares to ${community.totalSessions} other people who've taken this assessment.
      </p>
      <div class="chart-container">
        <canvas id="radarChart" class="radar-canvas"></canvas>
        <div class="chart-legend">
          <span><span class="legend-dot" style="background:#818cf8"></span>You</span>
          <span><span class="legend-dot" style="background:rgba(156,163,184,0.5)"></span>Community Average</span>
        </div>
      </div>
      <div class="community-stats">
        <div class="stat-card">
          <div class="stat-value">${community.totalSessions}</div>
          <div class="stat-label">Total Assessments</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${community.avgExposure}%</div>
          <div class="stat-label">Avg AI Exposure</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${community.avgReadiness}%</div>
          <div class="stat-label">Avg Readiness</div>
        </div>
      </div>
      <div style="margin-top:16px">
        <p style="font-size:13px;color:var(--text2)">
          <strong style="color:var(--text)">Most common archetype:</strong> ${archNames[topArchetype[0]] || topArchetype[0]}
          (${Math.round(topArchetype[1] / community.totalSessions * 100)}% of users)
        </p>
        <p style="font-size:13px;color:var(--text2);margin-top:4px">
          <strong style="color:var(--text)">Readiness distribution:</strong>
          ${community.readinessBuckets.strong} well-positioned ·
          ${community.readinessBuckets.building} building ·
          ${community.readinessBuckets.early} early stage
        </p>
      </div>
    </div>`;
  }

  // Your tools section
  let yourToolsHTML = '';
  if (userTools.length > 0 && !userTools.includes("None of the above")) {
    yourToolsHTML = `
    <div class="result-section">
      <h3>🧰 Your AI Toolkit</h3>
      <div>${userTools.map(t => `<span class="tag">${t}</span>`).join('')}</div>
      <p style="font-size:13px;color:var(--text2);margin-top:12px">
        You're using ${userTools.length} AI tool${userTools.length > 1 ? 's' : ''}. 
        ${userTools.length >= 5 ? 'That\'s a strong toolkit — focus on going deeper with your top 2–3 rather than adding more.' :
          userTools.length >= 3 ? 'Good breadth. Consider mastering 1–2 domain-specific tools to differentiate yourself.' :
          'Consider expanding your toolkit with domain-specific tools relevant to your field.'}
      </p>
    </div>`;
  }

  $('resultsContent').innerHTML = `
    <div class="results-header">
      <div class="archetype-badge">${arch.emoji} ${arch.name}</div>
      <h1>Your AI Career Profile</h1>
      <p class="subtitle" style="max-width:560px;margin:0 auto">${arch.desc}</p>
    </div>

    <div class="result-section">
      <h3>📊 AI Impact Analysis</h3>
      <div class="score-label"><span>AI Exposure — ${expInfo.label}</span><span>${exposure}%</span></div>
      <div class="score-bar"><div class="score-fill" style="width:${exposure}%;background:${expInfo.color}"></div></div>
      <p style="font-size:14px;color:var(--text2);margin:8px 0 16px">${expInfo.detail}</p>
      <div class="score-label"><span>Your Readiness — ${readInfo.label}</span><span>${readiness}%</span></div>
      <div class="score-bar"><div class="score-fill" style="width:${readiness}%;background:${readInfo.color}"></div></div>
    </div>

    <div class="result-section">
      <h3>🧬 Your Strength Profile</h3>
      ${dims.map(d => {
        const val = Math.max(0, scores[d.key]);
        const pct = Math.round((val / maxDim) * 100);
        return `
          <div class="score-label"><span>${d.icon} ${d.label}</span><span>${val}</span></div>
          <div class="score-bar"><div class="score-fill" style="width:${pct}%;background:var(--accent2)"></div></div>`;
      }).join('')}
    </div>

    ${communityHTML}
    ${yourToolsHTML}
    ${renderToolRankings(toolRankings, userTools)}

    <div class="result-section">
      <h3>🎯 Your Action Plan — With Specific How-To Steps</h3>
      <p style="font-size:14px;color:var(--text2);margin-bottom:16px">Each action includes concrete next steps and resources you can start with this week.</p>
      ${arch.actions.map((a, i) => renderActionItem(a, i)).join('')}
    </div>

    <div class="result-section">
      <h3>📚 Skills to Develop</h3>
      <div>${arch.skills.map(s => `<span class="tag">${s}</span>`).join('')}</div>
    </div>

    <div class="result-section">
      <h3>💼 Roles to Explore</h3>
      <div>${arch.roles.map(r => `<span class="tag">${r}</span>`).join('')}</div>
    </div>

    <div class="result-section">
      <h3>💡 Key Insight</h3>
      <p style="font-size:15px;color:var(--text2);line-height:1.7">
        The AI era doesn't have a single "right answer." Your profile suggests you're best positioned as
        <strong style="color:var(--accent2)">${arch.name}</strong> — but the most important thing is intentionality.
        The WEF projects 170 million new roles by 2030. People who actively choose their path through the AI transition
        consistently outperform those who wait and react. Start with action #1 above this week.
        Small, consistent steps compound into transformative career moves.
      </p>
      <p style="font-size:12px;color:var(--text2);margin-top:12px;font-style:italic">
        Sources: World Economic Forum Future of Jobs Report 2025, Forbes Career Strategy 2026,
        Deloitte Human Capital Trends 2025, ManpowerGroup Global Talent Shortage Survey 2026.
      </p>
    </div>

    <div class="restart-btn">
      <button class="btn primary" onclick="openFeedback()">📝 Rate This Assessment</button>
      <button class="btn secondary" onclick="location.reload()">↺ Retake</button>
      <button class="btn secondary" onclick="exportData()">📥 Export All Data</button>
    </div>
  `;

  showScreen('results');
  if (community && community.totalSessions > 1) {
    setTimeout(() => drawRadarChart('radarChart', scores, community.avgScores), 100);
  }
}

// Feedback
const FEEDBACK_DIMS = [
  { key: "accuracy", label: "Accuracy of your archetype" },
  { key: "actionability", label: "Actionability of the advice" },
  { key: "insight", label: "Quality of insights & data" },
  { key: "overall", label: "Overall usefulness" }
];

function openFeedback() {
  $('feedbackGrid').innerHTML = FEEDBACK_DIMS.map(d => `
    <div class="star-row">
      <span class="dim-label">${d.label}</span>
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
  stars.querySelectorAll('button').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.n) <= n);
  });
  stars.dataset.rating = n;
}

function submitFeedback() {
  const ratings = {};
  FEEDBACK_DIMS.forEach(d => {
    const stars = document.querySelector(`.stars[data-dim="${d.key}"]`);
    ratings[d.key] = parseInt(stars.dataset.rating) || null;
  });
  if (currentSessionId) {
    Analytics.recordFeedback(currentSessionId, { ratings, comment: $('feedbackComment').value.trim() });
  }
  closeFeedback();
}

function exportData() {
  const blob = new Blob([Analytics.exportData()], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `ai-career-navigator-data-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
}
