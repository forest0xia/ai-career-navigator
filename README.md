# AI Career Navigator

An interactive web assessment that helps professionals understand their position in the AI era — with personalized insights, community comparison, and concrete next steps.

**[Live Demo →](https://forest0xia.github.io/ai-career-navigator)** · **No build step** · **No frontend dependencies** · **Pure HTML/CSS/JS**

---

## What It Does

Users complete a 4–6 minute adaptive assessment and receive a personalized career profile including:

- **AI Maturity Level** — one of 7 progression levels (Dabbler → Prompter → Collaborator → Designer → System Builder → Amplifier → Visionary)
- **6-Axis Radar Profile** — Adoption, Mindset, Craft, Tech Depth, Reliability, Agents (0-100% each)
- **Sentiment Profile** — psychological orientation (Curious Explorer, Anxious Achiever, Confident Builder, etc.)
- **AI Exposure Score** — how much AI will transform your specific industry
- **Readiness Score** — how prepared you are for the shift
- **Personalized Missions** — 3 targeted actions based on your weakest axes, with success metrics
- **Skills & Roles** — recommended skills to develop and roles to explore, tailored to your gaps
- **Community Comparison** — radar chart + grid cards comparing your scores against all users
- **AI Toolkit Analysis** — what tools you use vs. community rankings (top 8)
- **Industry Insights** — automation rates and motivational data specific to your domain

## Assessment Structure

### Adaptive Branching (3 Scan Types)

| Scan | Trigger | Questions | Focus |
|------|---------|-----------|-------|
| **Quick Scan** | Low calibration scores | ~8 | Adoption + Mindset basics |
| **Core Scan** | Most users | ~10 | Balanced across all 6 axes |
| **Advanced Scan** | High calibration scores | ~12 | Full depth including all axes |

4 calibration questions (domain + 3 scored) determine which scan path you take. Progress bar shows current stage (Calibration → Scan → Wrap-up).

### 6 Radar Axes

| Axis | What It Measures |
|------|-----------------|
| **Adoption** | How embedded AI is in your life/work — frequency, breadth, dependency |
| **Mindset** | Curiosity, confidence, motivation, trust posture, learning habits |
| **Craft** | Day-to-day skill — iteration, templates, reuse, quality control |
| **Tech Depth** | Technical integration — extensions, automation, APIs, product integration |
| **Reliability** | Correctness discipline — verification, structured outputs, eval, monitoring |
| **Agents** | Autonomy & orchestration — multi-step tool use, agent loops, production usage |

### Scoring

- **Per-axis**: `points / max_possible × 100` (only counts questions the user actually answered)
- **Overall**: weighted sum — Craft 25%, Agents 20%, Adoption 15%, Mindset 15%, Reliability 15%, Tech Depth 10%
- **Guardrails**: low adoption+craft caps at Prompter; high reliability+craft floors at System Builder; high agents+reliability floors at Amplifier; top-tier across all three floors at Visionary
- **Cross-scoring**: c3_quality scores into both Craft and Reliability axes; impact_scope scores into both Agents and Adoption; self_identify scores into both Adoption and Craft

### Questions per Axis

| Axis | Weight | Questions | Max Points |
|------|--------|-----------|------------|
| Adoption | 15% | a1_frequency, a2_breadth, impact_scope, self_identify | 12 |
| Mindset | 15% | m1_reaction, m2_confidence | 6 |
| Craft | 25% | c1_repeat, c3_quality, self_identify | 9 |
| Tech Depth | 10% | t1_mode | 3 |
| Reliability | 15% | c3_quality (cross-score) | 3 |
| Agents | 20% | g1_maturity, impact_scope | 6 |

### 7 Progression Levels

| Emoji | Key | EN Name | CN Name | Score Range |
|-------|-----|---------|---------|-------------|
| 👀 | dabbler | Tool Dabbler | 工具体验者 | 0–14 |
| ✏️ | prompter | Prompt User | Prompt 使用者 | 15–28 |
| 🤝 | collaborator | AI Collaborator | AI 合作者 | 29–42 |
| 🔀 | designer | Workflow Designer | 工作流设计者 | 43–56 |
| ⚙️ | system_builder | System Builder | 系统构建者 | 57–72 |
| 📡 | amplifier | Org Amplifier | 组织放大者 | 73–87 |
| 🏗️ | visionary | Ecosystem Builder | 生态构建者 | 88–100 |

**Level design**: Levels 1–4 cover individual AI proficiency. System Builder represents mastery of building and operating AI systems. Amplifier is for those who scale AI capabilities across teams and organizations. Visionary is an aspirational ceiling for those building AI infrastructure, frontier models, or shaping the ecosystem itself.

## Data Sources

Questions include contextual insights drawn from public industry reports:

| Source | Key Data Used |
|--------|--------------|
| WEF Future of Jobs Report 2025 | 170M new roles by 2030; 59% workforce needs reskilling |
| Deloitte State of AI in the Enterprise 2026 | 60% worker AI access; 1.8x financial performance with AI investment |
| ManpowerGroup 2026 Global Talent Shortage | 72% hiring difficulty for AI skills; 56% wage premium |
| Forbes Career Strategy, Feb 2026 | 40% of job skills will change by 2030 |
| McKinsey Global Survey on AI, 2025 | 25% of work hours automatable; 3x faster adoption with systems mindset |

## Quick Start

```bash
git clone git@github.com:forest0xia/ai-career-navigator.git
cd ai-career-navigator
open index.html
# Or: python3 -m http.server 8000
```

## Project Structure

```
ai-career-navigator/
├── index.html
├── css/style.css
├── src/
│   ├── data/
│   │   ├── questions.js      # 12 questions, 6-axis scoring, adaptive branching
│   │   └── archetypes.js     # 7 levels with actions, resources, skills
│   ├── engine/
│   │   ├── scoring.js        # Axis scoring, level determination, missions, skills/roles
│   │   └── analytics.js      # Supabase REST API + localStorage
│   ├── i18n/
│   │   ├── lang.js           # EN/CN translations
│   │   └── cn.js             # Chinese questions, archetypes, insights
│   └── ui/
│       ├── app.js            # Navigation, rendering, results page
│       └── charts.js         # SVG radar, scatter plots, sentiment chart
└── scripts/
    ├── supabase-setup.sql    # Initial table + trigger setup
    └── migrate-v3.sql        # v2→v3 migration (6-axis scoring)
```

## Backend: Supabase

Free-tier Supabase for shared community data. No SDK — plain `fetch()` to REST API.

### Setup

1. Create project at [supabase.com](https://supabase.com)
2. SQL Editor → paste `scripts/supabase-setup.sql` → Run
3. If upgrading from v1/v2: also run `scripts/migrate-v3.sql`
4. Copy anon key → update `SUPABASE_URL` and `SUPABASE_KEY` in `analytics.js`

### What's Stored

- `sessions` table: scores (jsonb), archetype, exposure, readiness, tools, answers, feedback
- `community_stats` table: single row with aggregated data, updated by trigger
- RLS: insert-only for sessions, read-only for stats

### Offline Support

- Community stats cached in localStorage
- Sessions saved locally for `?id=UUID` report retrieval
- Works in China (Supabase on AWS, not blocked)

## i18n

English + Chinese. Switch via `?lang=cn` URL param or auto-detect from browser.

- All questions, options, insights, archetypes, and UI strings translated
- Chinese AI models included (DeepSeek, Doubao, Kimi, Qwen, MiniMax)
- CN resources tab shows verified Chinese AI KOLs

## Tech Stack

- Zero frontend dependencies — pure HTML, CSS, JavaScript
- SVG charts — crisp at any DPI, CJK-friendly
- Mobile responsive, dark theme
- No build step required

## License

MIT
