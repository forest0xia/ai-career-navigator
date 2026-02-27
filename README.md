# AI Career Navigator

A research-backed, interactive web assessment that helps professionals understand their position in the AI era — and gives them concrete, actionable steps to future-proof their careers.

**[Live Demo →](#)** · **No build step** · **No dependencies** · **Pure HTML/CSS/JS**

---

## What It Does

Users complete a 6–8 minute in-depth assessment across 5 sections and receive a personalized career profile including:

- **AI Career Archetype** — one of 6 research-backed profiles (AI Architect, AI Collaborator, Human Edge Specialist, Strategic Leader, Creative Innovator, Career Reinventor)
- **AI Exposure Score** — how much AI will transform their specific work
- **Readiness Score** — how prepared they are for the shift
- **6-Dimension Strength Profile** — Adaptability, Technical Depth, Creative Thinking, Leadership, AI Readiness, Human Edge
- **Personalized Action Plan** — 5 concrete steps with specific how-to instructions and resource links
- **AI Toolkit Analysis** — what tools they use vs. what the community uses (ranked)
- **Community Comparison** — radar chart and stats comparing against all other users
- **Skills & Roles** — recommended skills to develop and roles to explore

## Research Sources

All questions and insights are grounded in current professional research:

| Source | Key Data |
|--------|----------|
| [WEF Future of Jobs Report 2025](https://www.weforum.org/publications/the-future-of-jobs-report-2025/) | 170M new roles created, 92M eliminated by 2030 (net +78M) |
| [Forbes Career Strategy, Feb 2026](https://www.forbes.com/sites/carolinecastrillon/2026/02/16/40-of-job-skills-will-change-by-2030-heres-how-to-prepare/) | 40% of job skills will change by 2030; durable skills outperform technical ones |
| [Deloitte Human Capital Trends 2025](https://www.deloitte.com/us/en/insights/topics/talent/human-capital-trends/2025.html) | Orgs investing in workforce development are 1.8x more likely to report better financial results |
| [ManpowerGroup Talent Shortage 2026](https://www.wjfw.com/online_features/press_releases/global-talent-shortage-reaches-turning-point-as-ai-skills-claim-top-spot/) | AI Model & App Development (20%) and AI Literacy (19%) are the top hard-to-find skills globally |
| [IDC Skills Crisis Forecast](https://insights.manageengine.com/artificial-intelligence/ai-driven-employee-training/) | By 2026, 90%+ of orgs will feel the IT skills crisis — $5.5T in projected losses |
| [BusinessWorld, Feb 2026](https://www.businessworld.in/article/ai-upskilling-the-best-career-insurance-for-youth-in-todays-changing-job-market-571053) | Professionals with AI skills command a 56% wage premium |

## Assessment Structure

### 23 Questions Across 5 Sections

| Section | Questions | Purpose |
|---------|-----------|---------|
| **Your Current Role** | 4 | Domain, experience, daily tasks, team size — adapts subsequent questions for tech vs. non-tech |
| **Skills & Learning** | 5 | Strongest skills, skill combinations, learning style, cross-functional work, recent learning velocity |
| **AI Familiarity** | 3–4 | Current AI usage, perception of AI, technical depth (adaptive) |
| **AI Tools & Agents** | 2 | Multi-select tool inventory (17 tools), most-valued AI capability |
| **Work Style & Values** | 4 | Work values, disruption response, collaboration style, decision-making approach |
| **Future Orientation** | 4 | 5-year goals, learning investment, risk tolerance, biggest AI concern |

### Adaptive Logic

- First question (domain) sets user tags (`tech`, `creative`, `business`, `regulated`, `physical`, `early`)
- Technical AI depth question only shown to tech professionals
- General tech comfort question only shown to non-tech professionals
- Answer options within questions can be conditionally shown based on tags

### 6 Career Archetypes

| Archetype | Profile |
|-----------|---------|
| 🏗️ **AI Architect** | Deep technical + high AI readiness → build AI systems |
| 🤝 **AI Collaborator** | Solid adaptability + growing AI fluency → master working with AI |
| 💎 **Human Edge Specialist** | Strong human skills → double down on what AI can't replicate |
| 🧭 **Strategic Leader** | Leadership + forward-looking → lead AI transformation |
| 🎨 **Creative Innovator** | Creative thinking + adaptability → AI as creative amplifier |
| 🔄 **Career Reinventor** | High adaptability + inflection point → build AI-native skills from scratch |

Each archetype includes 5 action items with:
- **What** to do (the goal)
- **How** to do it (specific steps, timelines, tools)
- **Resource links** (Google AI Essentials, Coursera, Hugging Face, NIST, etc.)

## Analytics & Data Collection

All data is stored in `localStorage` (browser-side, no server needed).

### What's Recorded Per Session

```json
{
  "id": "m1abc123",
  "ts": "2026-02-27T17:30:00.000Z",
  "answers": { "domain": 0, "experience": 1, "ai_tools": [0, 1, 4] },
  "tags": ["tech"],
  "scores": { "adaptability": 8, "technical": 12, "creative": 3, "leadership": 4, "aiReadiness": 10, "humanEdge": 2 },
  "archetype": "aiArchitect",
  "exposure": 78,
  "readiness": 72,
  "toolSelections": ["ChatGPT / GPT-4", "Claude (Anthropic)", "GitHub Copilot / Cursor / Windsurf"],
  "feedback": {
    "ratings": { "accuracy": 4, "actionability": 5, "insight": 4, "overall": 4 },
    "comment": "Very actionable advice"
  }
}
```

### Community Features

After 2+ sessions, the results page shows:

- **Radar chart** — your 6-dimension profile overlaid on community average
- **Stats cards** — total assessments, average exposure, average readiness
- **Archetype distribution** — most common archetype with percentage
- **Readiness breakdown** — how many users are well-positioned vs. building vs. early stage
- **Tool rankings** — bar chart of most popular AI tools across all users, with your selections highlighted

### Feedback Collection

Users can rate the assessment on 4 dimensions (1–5 stars each):
- Accuracy of archetype assignment
- Actionability of the advice
- Quality of insights and data
- Overall usefulness

Plus optional free-text comments. All feedback is stored per session for analysis.

### Data Export

Click "Export All Data" on the results page to download a JSON file containing all sessions, answers, scores, and feedback — ready for analysis in Python, Excel, or any data tool.

## Quick Start

```bash
# Clone
git clone git@github.com:forest0xia/ai-career-navigator.git
cd ai-career-navigator

# Open in browser (no build step needed)
open index.html
```

Or serve locally:

```bash
python3 -m http.server 8000
# Visit http://localhost:8000
```

## Project Structure

```
ai-career-navigator/
├── index.html              # Entry point — screens, modals, script loading
├── css/
│   └── style.css           # Dark theme, responsive layout, animations
├── src/
│   ├── data/               # Pure data — no logic, easy to edit
│   │   ├── questions.js    # 23 questions, options, scoring weights, citations
│   │   └── archetypes.js   # 6 archetypes, action plans, skills, roles
│   ├── engine/             # Business logic — scoring, storage, aggregation
│   │   ├── scoring.js      # Archetype determination, exposure/readiness calculators
│   │   └── analytics.js    # localStorage persistence, community stats, tool rankings
│   └── ui/                 # Rendering — DOM manipulation, charts, user interaction
│       ├── app.js          # Navigation, question rendering, results, feedback modal
│       └── charts.js       # Canvas radar chart renderer
└── README.md
```

### Architecture

```
index.html
  ├── css/style.css              (presentation)
  ├── src/data/questions.js      (question definitions + research citations)
  ├── src/data/archetypes.js     (archetype definitions + action plans)
  ├── src/engine/scoring.js      (scoring algorithms)
  ├── src/engine/analytics.js    (data persistence + aggregation)
  ├── src/ui/charts.js           (canvas radar chart)
  └── src/ui/app.js              (navigation + rendering + feedback)
```

| Layer | Files | Responsibility |
|-------|-------|----------------|
| **Data** | `questions.js`, `archetypes.js` | Pure data definitions. Edit these to change questions, options, archetypes, or action plans. No logic. |
| **Engine** | `scoring.js`, `analytics.js` | Business logic. Scoring algorithms, archetype determination, localStorage CRUD, community aggregation. |
| **UI** | `app.js`, `charts.js` | DOM rendering, screen navigation, multi-select handling, radar chart, feedback modal. |

## Customization

### Adding Questions

Add to the `QUESTIONS` array in `src/data/questions.js`:

```js
{
  id: "unique_id",
  section: "role",           // must match a key in SECTIONS
  title: "Your question?",
  insight: "Educational context with <div class=\"source\">— Citation</div>",
  // Optional:
  desc: "Subtitle text",
  showIf: ["tech"],          // only show if user has these tags
  type: "multi",             // for multi-select (omit for single-select)
  options: [
    { text: "Option A", scores: { technical: 2, aiReadiness: 1 } },
    { text: "Option B", scores: { humanEdge: 3 }, tags: ["business"] },  // tags set on first question only
    { text: "Option C", scores: {}, showIf: ["tech"] }                   // conditional option
  ]
}
```

### Adding Archetypes

Add to the `ARCHETYPES` object in `src/data/archetypes.js` and update the scoring logic in `src/engine/scoring.js`.

### Adding AI Tools

Add options to the `ai_tools` question in `src/data/questions.js`. Include a `toolCategory` field for potential future filtering.

## Backend: Supabase (Community Data)

The app uses [Supabase](https://supabase.com) (free tier) as a shared backend for community data. No SDK — just plain `fetch()` calls to Supabase's REST API.

### How It Works

```
User completes assessment
  → POST to Supabase (insert session row)
  → PostgreSQL trigger auto-updates community_stats (single row)
  → Next user loads page → GET community_stats (1 row, instant)
  → Scatter plots → GET sessions (exposure, readiness, scores only)
```

### Setup (One-Time, 2 Minutes)

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → **New Query** → paste `scripts/supabase-setup.sql` → **Run**
3. Go to **Settings** → **API** → copy the **`anon` `public`** key (starts with `eyJ...`)
4. Update `SUPABASE_URL` and `SUPABASE_KEY` in `src/engine/analytics.js`
5. Deploy — community data is now shared across all users

### What the SQL Script Creates

| Object | Purpose |
|--------|---------|
| `sessions` table | Stores each assessment result (scores, archetype, exposure, readiness, tools, answers) |
| `community_stats` table | Single row with pre-aggregated community data (updated by trigger) |
| `update_community_stats()` function | PostgreSQL trigger function — incrementally updates stats on every new session |
| RLS policies | Insert-only for sessions (no read/update/delete), read-only for stats |

### Security

- **Anon key is safe to expose** in client code (same model as Firebase — identifies the project, doesn't grant access)
- **Row Level Security (RLS)** enforces access control server-side:
  - Users can insert sessions but cannot read, update, or delete other sessions
  - Users can read aggregate stats but cannot write them
  - The trigger function runs as `security definer` (server-side, bypasses RLS)
- **No authentication required** — anonymous survey submissions by design

### Offline / China Support

- Supabase is hosted on AWS — **works in China** (unlike Firebase/Google)
- Community stats cached in `localStorage` — if fetch fails, shows cached data
- Sessions always saved locally too for `?id=UUID` report retrieval

### Shareable Report URLs

Each completed assessment generates a UUID. The URL updates to `?id=<uuid>`:

```
https://yoursite.github.io/ai-career-navigator/?id=a1b2c3d4-...&lang=cn
```

- Opening this URL loads the saved user results (fixed) with live community data (updates)
- Report page includes a copy-URL button and report ID for bookmarking
- Sessions stored in `localStorage` for retrieval (Supabase stores the canonical copy)

## Tech Stack

- **Zero frontend dependencies** — pure HTML, CSS, JavaScript
- **Supabase** — PostgreSQL backend for shared community data (free tier)
- **No SDK** — plain `fetch()` to Supabase REST API
- **No build step** — open `index.html` directly
- **SVG charts** — crisp text at any DPI, CJK-friendly
- **Mobile responsive** — works on all screen sizes
- **Dark theme** — professional, modern UI
- **i18n** — English + Chinese, URL-based switching (`?lang=cn`)

## Browser Support

Works in all modern browsers (Chrome, Firefox, Safari, Edge). Requires `localStorage` for analytics persistence.

## License

MIT
