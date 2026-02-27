#!/usr/bin/env node
// Aggregate local stats exports into community-data.json
// Usage: Collect exported stats JSON files, then run:
//   node scripts/aggregate.js stats1.json stats2.json ... > community-data.json
//
// Or pipe from stdin:
//   cat exports/*.json | node scripts/aggregate.js > community-data.json

const fs = require('fs');
const DIMS = ["adaptability", "technical", "creative", "leadership", "aiReadiness", "humanEdge"];

function emptyStats() {
  const s = { n: 0, sumExposure: 0, sumReadiness: 0, sumScores: {}, archetypeCounts: {},
    exposureBuckets: { low: 0, moderate: 0, high: 0 }, readinessBuckets: { early: 0, building: 0, strong: 0 },
    toolCounts: {}, toolUsers: 0, answerCounts: {}, scatterPoints: [] };
  DIMS.forEach(d => { s.sumScores[d] = 0; });
  return s;
}

function merge(a, b) {
  a.n += b.n || 0;
  DIMS.forEach(d => { a.sumScores[d] += b.sumScores?.[d] || 0; });
  a.sumExposure += b.sumExposure || 0;
  a.sumReadiness += b.sumReadiness || 0;
  for (const [k, v] of Object.entries(b.archetypeCounts || {})) a.archetypeCounts[k] = (a.archetypeCounts[k] || 0) + v;
  ['low', 'moderate', 'high'].forEach(k => { a.exposureBuckets[k] += b.exposureBuckets?.[k] || 0; });
  ['early', 'building', 'strong'].forEach(k => { a.readinessBuckets[k] += b.readinessBuckets?.[k] || 0; });
  a.toolUsers += b.toolUsers || 0;
  for (const [k, v] of Object.entries(b.toolCounts || {})) a.toolCounts[k] = (a.toolCounts[k] || 0) + v;
  for (const [qId, counts] of Object.entries(b.answerCounts || {})) {
    if (!a.answerCounts[qId]) a.answerCounts[qId] = {};
    for (const [k, v] of Object.entries(counts)) a.answerCounts[qId][k] = (a.answerCounts[qId][k] || 0) + v;
  }
  a.scatterPoints.push(...(b.scatterPoints || []));
}

const result = emptyStats();
const files = process.argv.slice(2);

if (files.length) {
  files.forEach(f => merge(result, JSON.parse(fs.readFileSync(f, 'utf8'))));
} else {
  // Read from stdin
  const input = fs.readFileSync(0, 'utf8');
  merge(result, JSON.parse(input));
}

result.updatedAt = new Date().toISOString();
console.log(JSON.stringify(result, null, 2));
