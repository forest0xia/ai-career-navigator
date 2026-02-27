// Radar chart renderer (pure canvas, no dependencies)

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

  // Grid rings
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

  // Axis lines
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

  // Community average layer
  if (communityAvg) drawPoly(communityAvg, "rgba(156,163,184,0.12)", "rgba(156,163,184,0.4)");

  // User scores layer
  drawPoly(userScores, "rgba(99,102,241,0.2)", "#818cf8");

  // Dots on user polygon
  ctx.fillStyle = "#818cf8";
  for (let i = 0; i < n; i++) {
    const [x, y] = getPoint(i, userScores[dims[i]] || 0);
    ctx.beginPath(); ctx.arc(x, y, 4, 0, 2 * Math.PI); ctx.fill();
  }
}
