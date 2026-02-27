// Chart renderers (pure canvas, no dependencies)

function drawRadarChart(canvasId, userScores, communityAvg) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const W = 400, H = 400, cx = W / 2, cy = H / 2, R = 150;
  canvas.width = W; canvas.height = H;

  const dims = ["adaptability", "technical", "creative", "leadership", "aiReadiness", "humanEdge"];
  const labels = isCN()
    ? ["适应力", "技术", "创造力", "领导力", "AI就绪", "人类优势"]
    : ["Adaptability", "Technical", "Creative", "Leadership", "AI Readiness", "Human Edge"];
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
  for (let i = 0; i < n; i++) {
    const angle = startAngle + i * angleStep;
    ctx.beginPath(); ctx.moveTo(cx, cy);
    ctx.lineTo(cx + R * Math.cos(angle), cy + R * Math.sin(angle)); ctx.stroke();
  }
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

// Scatter plot: each session is a dot, current user highlighted
// xKey/yKey are fields on session objects (e.g. "exposure", "readiness")
function drawScatterPlot(canvasId, sessions, currentSession, xKey, yKey, xLabel, yLabel) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const W = 400, H = 300;
  canvas.width = W; canvas.height = H;

  const pad = { top: 20, right: 20, bottom: 40, left: 50 };
  const plotW = W - pad.left - pad.right;
  const plotH = H - pad.top - pad.bottom;

  // Axis ranges 0-100 for exposure/readiness
  const xMin = 0, xMax = 100, yMin = 0, yMax = 100;

  function toX(v) { return pad.left + ((v - xMin) / (xMax - xMin)) * plotW; }
  function toY(v) { return pad.top + plotH - ((v - yMin) / (yMax - yMin)) * plotH; }

  ctx.clearRect(0, 0, W, H);

  // Grid lines
  ctx.strokeStyle = "#2e3345"; ctx.lineWidth = 1;
  for (let v = 0; v <= 100; v += 25) {
    // Horizontal
    ctx.beginPath(); ctx.moveTo(pad.left, toY(v)); ctx.lineTo(W - pad.right, toY(v)); ctx.stroke();
    // Vertical
    ctx.beginPath(); ctx.moveTo(toX(v), pad.top); ctx.lineTo(toX(v), pad.top + plotH); ctx.stroke();
  }

  // Axis labels
  ctx.fillStyle = "#9ca3b8"; ctx.font = "11px -apple-system, sans-serif";
  ctx.textAlign = "center";
  for (let v = 0; v <= 100; v += 25) {
    ctx.fillText(v + '%', toX(v), H - pad.bottom + 16);
  }
  ctx.textAlign = "right";
  for (let v = 0; v <= 100; v += 25) {
    ctx.fillText(v + '%', pad.left - 8, toY(v) + 4);
  }

  // Axis titles
  ctx.fillStyle = "#9ca3b8"; ctx.font = "12px -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(xLabel, pad.left + plotW / 2, H - 4);
  ctx.save();
  ctx.translate(14, pad.top + plotH / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText(yLabel, 0, 0);
  ctx.restore();

  // Quadrant labels (subtle)
  ctx.fillStyle = "rgba(156,163,184,0.25)"; ctx.font = "10px -apple-system, sans-serif";
  ctx.textAlign = "center";
  const qLabels = isCN()
    ? [["低影响 · 高准备", 25, 75], ["高影响 · 高准备", 75, 75], ["低影响 · 低准备", 25, 25], ["高影响 · 低准备", 75, 25]]
    : [["Low Exposure · High Readiness", 25, 75], ["High Exposure · High Readiness", 75, 75], ["Low Exposure · Low Readiness", 25, 25], ["High Exposure · Low Readiness", 75, 25]];
  qLabels.forEach(([label, x, y]) => ctx.fillText(label, toX(x), toY(y)));

  // Quadrant divider lines
  ctx.strokeStyle = "rgba(99,102,241,0.2)"; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
  ctx.beginPath(); ctx.moveTo(toX(50), pad.top); ctx.lineTo(toX(50), pad.top + plotH); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(pad.left, toY(50)); ctx.lineTo(W - pad.right, toY(50)); ctx.stroke();
  ctx.setLineDash([]);

  // All session dots
  sessions.forEach(s => {
    const x = toX(s[xKey] || 0);
    const y = toY(s[yKey] || 0);
    ctx.beginPath(); ctx.arc(x, y, 4, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(156,163,184,0.35)"; ctx.fill();
  });

  // Current user dot (larger, highlighted)
  if (currentSession) {
    const x = toX(currentSession[xKey] || 0);
    const y = toY(currentSession[yKey] || 0);
    // Glow
    ctx.beginPath(); ctx.arc(x, y, 12, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(99,102,241,0.2)"; ctx.fill();
    // Dot
    ctx.beginPath(); ctx.arc(x, y, 6, 0, 2 * Math.PI);
    ctx.fillStyle = "#818cf8"; ctx.fill();
    ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.stroke();
  }
}

// Horizontal bar chart for sentiment/perception distribution
function drawSentimentChart(canvasId, distribution, currentIdx) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const W = 400, H = distribution.length * 40 + 10;
  canvas.width = W; canvas.height = H;

  const maxCount = Math.max(...distribution.map(d => d.count), 1);
  const barMaxW = W - 160;

  ctx.clearRect(0, 0, W, H);

  distribution.forEach((d, i) => {
    const y = i * 40 + 8;
    const barW = (d.count / maxCount) * barMaxW;
    const isUser = i === currentIdx;

    // Bar
    ctx.fillStyle = isUser ? "rgba(99,102,241,0.5)" : "rgba(156,163,184,0.2)";
    ctx.beginPath();
    ctx.roundRect(150, y, barW, 24, 4);
    ctx.fill();

    if (isUser) {
      ctx.strokeStyle = "#818cf8"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.roundRect(150, y, barW, 24, 4); ctx.stroke();
    }

    // Label
    ctx.fillStyle = isUser ? "#818cf8" : "#9ca3b8";
    ctx.font = (isUser ? "bold " : "") + "11px -apple-system, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(d.label, 142, y + 16);

    // Count
    ctx.fillStyle = isUser ? "#e4e7ef" : "#9ca3b8";
    ctx.font = "11px -apple-system, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`${d.count} (${d.pct}%)`, 150 + barW + 6, y + 16);
  });
}
