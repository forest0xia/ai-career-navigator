// SVG chart renderers — crisp text at any resolution, CJK-friendly

function svgEl(tag, attrs) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const [k, v] of Object.entries(attrs || {})) el.setAttribute(k, v);
  return el;
}

function svgText(x, y, text, attrs) {
  const el = svgEl("text", { x, y, fill: "#9ca3b8", "font-family": "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif", "font-size": "13", "text-anchor": "middle", ...attrs });
  el.textContent = text;
  return el;
}

// ─── Radar Chart ───
function drawRadarChart(containerId, userScores, communityAvg) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  const W = 400, H = 400, cx = W / 2, cy = H / 2, R = 140;
  const svg = svgEl("svg", { viewBox: `0 0 ${W} ${H}`, width: "100%", style: "max-width:400px;display:block;margin:0 auto" });

  const dims = ["adaptability", "technical", "creative", "leadership", "aiReadiness", "humanEdge"];
  const labels = typeof isCN === 'function' && isCN()
    ? ["适应力", "技术深度", "创造力", "领导力", "AI 就绪度", "人类优势"]
    : ["Adaptability", "Technical", "Creative", "Leadership", "AI Readiness", "Human Edge"];
  const n = dims.length;
  const step = (2 * Math.PI) / n;
  const start = -Math.PI / 2;
  const maxVal = Math.max(...dims.map(d => Math.max(Math.abs(userScores[d] || 0), Math.abs(communityAvg ? communityAvg[d] || 0 : 0))), 1);

  function pt(i, val) {
    const a = start + i * step;
    const r = (Math.max(0, val) / maxVal) * R;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  }

  // Grid rings
  for (let ring = 1; ring <= 4; ring++) {
    const rr = (ring / 4) * R;
    const pts = Array.from({ length: n }, (_, i) => {
      const a = start + i * step;
      return `${cx + rr * Math.cos(a)},${cy + rr * Math.sin(a)}`;
    }).join(' ');
    svg.appendChild(svgEl("polygon", { points: pts, fill: "none", stroke: "#2e3345", "stroke-width": "1" }));
  }

  // Axis lines
  for (let i = 0; i < n; i++) {
    const a = start + i * step;
    svg.appendChild(svgEl("line", { x1: cx, y1: cy, x2: cx + R * Math.cos(a), y2: cy + R * Math.sin(a), stroke: "#2e3345", "stroke-width": "1" }));
  }

  // Labels
  for (let i = 0; i < n; i++) {
    const a = start + i * step;
    const lx = cx + (R + 28) * Math.cos(a);
    const ly = cy + (R + 28) * Math.sin(a);
    svg.appendChild(svgText(lx, ly + 5, labels[i], { "font-size": "13", "font-weight": "500" }));
  }

  // Polygon helper
  function addPoly(scores, fillColor, strokeColor) {
    const pts = dims.map((d, i) => pt(i, scores[d] || 0).join(',')).join(' ');
    svg.appendChild(svgEl("polygon", { points: pts, fill: fillColor, stroke: strokeColor, "stroke-width": "2" }));
  }

  if (communityAvg) addPoly(communityAvg, "rgba(156,163,184,0.12)", "rgba(156,163,184,0.4)");
  addPoly(userScores, "rgba(99,102,241,0.2)", "#818cf8");

  // Dots
  dims.forEach((d, i) => {
    const [x, y] = pt(i, userScores[d] || 0);
    svg.appendChild(svgEl("circle", { cx: x, cy: y, r: "4", fill: "#818cf8" }));
  });

  container.appendChild(svg);
}

// ─── Scatter Plot ───
function drawScatterPlot(containerId, sessions, currentSession, xKey, yKey, xLabel, yLabel) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  const W = 420, H = 320;
  const pad = { top: 20, right: 20, bottom: 48, left: 56 };
  const plotW = W - pad.left - pad.right;
  const plotH = H - pad.top - pad.bottom;
  const svg = svgEl("svg", { viewBox: `0 0 ${W} ${H}`, width: "100%", style: "display:block" });

  function toX(v) { return pad.left + (v / 100) * plotW; }
  function toY(v) { return pad.top + plotH - (v / 100) * plotH; }

  // Grid
  for (let v = 0; v <= 100; v += 25) {
    svg.appendChild(svgEl("line", { x1: pad.left, y1: toY(v), x2: W - pad.right, y2: toY(v), stroke: "#2e3345", "stroke-width": "1" }));
    svg.appendChild(svgEl("line", { x1: toX(v), y1: pad.top, x2: toX(v), y2: pad.top + plotH, stroke: "#2e3345", "stroke-width": "1" }));
    svg.appendChild(svgText(toX(v), H - pad.bottom + 18, v + '%', { "font-size": "12" }));
    svg.appendChild(svgText(pad.left - 10, toY(v) + 4, v + '%', { "font-size": "12", "text-anchor": "end" }));
  }

  // Quadrant dividers
  svg.appendChild(svgEl("line", { x1: toX(50), y1: pad.top, x2: toX(50), y2: pad.top + plotH, stroke: "rgba(99,102,241,0.2)", "stroke-width": "1", "stroke-dasharray": "4,4" }));
  svg.appendChild(svgEl("line", { x1: pad.left, y1: toY(50), x2: W - pad.right, y2: toY(50), stroke: "rgba(99,102,241,0.2)", "stroke-width": "1", "stroke-dasharray": "4,4" }));

  // Axis labels
  svg.appendChild(svgText(pad.left + plotW / 2, H - 4, xLabel, { "font-size": "13", "font-weight": "500" }));
  const yLbl = svgText(0, 0, yLabel, { "font-size": "13", "font-weight": "500" });
  yLbl.setAttribute("transform", `translate(14,${pad.top + plotH / 2}) rotate(-90)`);
  svg.appendChild(yLbl);

  // Session dots
  sessions.forEach(s => {
    svg.appendChild(svgEl("circle", { cx: toX(s[xKey] || 0), cy: toY(s[yKey] || 0), r: "4", fill: "rgba(156,163,184,0.35)" }));
  });

  // Current user
  if (currentSession) {
    const x = toX(currentSession[xKey] || 0), y = toY(currentSession[yKey] || 0);
    svg.appendChild(svgEl("circle", { cx: x, cy: y, r: "14", fill: "rgba(99,102,241,0.15)" }));
    svg.appendChild(svgEl("circle", { cx: x, cy: y, r: "7", fill: "#818cf8", stroke: "#fff", "stroke-width": "2" }));
  }

  container.appendChild(svg);
}

// ─── Sentiment Bar Chart ───
// Labels on left (multi-line wrapped), bars on right
function drawSentimentChart(containerId, distribution, currentIdx) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  const labelW = 220;
  const barMaxW = 150;
  const rowH = 48;
  const W = labelW + barMaxW + 70;
  const H = distribution.length * rowH + 8;
  const maxCount = Math.max(...distribution.map(d => d.count), 1);
  const maxCharsPerLine = 16;

  const svg = svgEl("svg", { viewBox: `0 0 ${W} ${H}`, width: "100%", style: "display:block" });

  distribution.forEach((d, i) => {
    const y = i * rowH + 6;
    const barW = Math.max(2, (d.count / maxCount) * barMaxW);
    const isUser = i === currentIdx;

    // Wrap label into lines
    const lines = [];
    let remaining = d.label;
    while (remaining.length > maxCharsPerLine) {
      // Find a good break point
      let breakAt = remaining.lastIndexOf('—', maxCharsPerLine);
      if (breakAt < 4) breakAt = remaining.lastIndexOf('，', maxCharsPerLine);
      if (breakAt < 4) breakAt = remaining.lastIndexOf(' ', maxCharsPerLine);
      if (breakAt < 4) breakAt = maxCharsPerLine;
      lines.push(remaining.slice(0, breakAt).trim());
      remaining = remaining.slice(breakAt).replace(/^[—\s]/, '').trim();
    }
    if (remaining) lines.push(remaining);

    // Multi-line label (right-aligned to labelW - 12)
    const lineH = 15;
    const totalTextH = lines.length * lineH;
    const textStartY = y + (rowH - totalTextH) / 2 + 11;

    const textEl = svgEl("text", {
      x: labelW - 12, y: textStartY,
      fill: isUser ? "#818cf8" : "#9ca3b8",
      "font-family": "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif",
      "font-size": "12", "text-anchor": "end",
      "font-weight": isUser ? "600" : "400"
    });
    lines.forEach((line, li) => {
      const tspan = svgEl("tspan", { x: labelW - 12, dy: li === 0 ? "0" : lineH + "" });
      tspan.textContent = line;
      textEl.appendChild(tspan);
    });
    svg.appendChild(textEl);

    // Bar (vertically centered in row)
    const barY = y + (rowH - 24) / 2;
    svg.appendChild(svgEl("rect", {
      x: labelW, y: barY, width: barW, height: 24, rx: 4,
      fill: isUser ? "rgba(99,102,241,0.45)" : "rgba(156,163,184,0.18)",
      stroke: isUser ? "#818cf8" : "none", "stroke-width": isUser ? "2" : "0"
    }));

    // Count
    svg.appendChild(svgText(labelW + barW + 8, barY + 16, `${d.count} (${d.pct}%)`, {
      "text-anchor": "start", "font-size": "12",
      fill: isUser ? "#e4e7ef" : "#9ca3b8"
    }));
  });

  container.appendChild(svg);
}
