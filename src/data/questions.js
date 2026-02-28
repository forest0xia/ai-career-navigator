// AI Adoption Diagnostic v2 — 6-axis radar, percentage scoring, adaptive branching
// Axes: adoption, mindset, craft, tech_depth, reliability, agents

const SECTIONS = {
  calibration: "Calibration",
  adoption: "Adoption",
  mindset: "Mindset",
  craft: "Craft",
  tech: "Tech Depth",
  reliability: "Reliability",
  agents: "Agents",
  future: "Future Readiness"
};

const QUESTIONS = [
  // === CALIBRATION (domain + 3 calibration Qs used for branching) ===
  {
    id: "domain",
    section: "calibration",
    title: "Which best describes your professional domain?",
    insight: 'The WEF Future of Jobs Report 2025 projects 170 million new roles created by 2030, but 92 million eliminated. The impact varies dramatically by sector.<div class="source">— World Economic Forum, Future of Jobs Report 2025</div>',
    options: [
      { text: "Software Engineering / IT / DevOps", tags: ["tech"], exposure: 85 },
      { text: "Data Science / Analytics / Research", tags: ["tech"], exposure: 80 },
      { text: "Design / Creative / Content / Marketing", tags: ["creative"], exposure: 70 },
      { text: "Business / Management / Operations / Finance", tags: ["business"], exposure: 65 },
      { text: "Healthcare / Education / Legal / Government", tags: ["regulated"], exposure: 50 },
      { text: "Trades / Manufacturing / Logistics / Retail", tags: ["physical"], exposure: 35 },
      { text: "Student / Career Changer / Between roles", tags: ["early"], exposure: 60 },
      { text: "Other", tags: ["business"], exposure: 55 }
    ]
  },

  // === ADOPTION (3) ===
  {
    id: "a1_frequency",
    section: "adoption",
    calibration: true,
    title: "How often do you use AI today?",
    insight: 'Sanctioned access to AI tools is now available to ~60% of workers, up from under 40% a year ago. Professionals with AI skills command an average wage premium of 56%.<div class="source">— Deloitte State of AI in the Enterprise 2026</div>',
    axes: { adoption: [0, 1, 2, 3, 4] },
    options: [
      { text: "Rarely or never", level: 1 },
      { text: "A few times a month", level: 1.5 },
      { text: "1–2 days a week", level: 2 },
      { text: "Most days", level: 3 },
      { text: "Daily, multiple times a day", level: 4 }
    ]
  },
  {
    id: "a2_breadth",
    section: "adoption",
    title: "Where do you use AI regularly?",
    insight: 'The most impactful AI adoption comes from mastering domain-specific tools, not generic chatbots. Specialized AI knowledge in your field makes you significantly more valuable.<div class="source">— ManpowerGroup 2026 Global Talent Shortage Survey</div>',
    axes: { adoption: [0, 1, 2, 3, 4] },
    options: [
      { text: "Not yet", level: 1 },
      { text: "One area (e.g. writing or search)", level: 1.5 },
      { text: "2–3 areas", level: 2 },
      { text: "4+ areas", level: 3 },
      { text: "It touches most of my workflows daily", level: 4 }
    ]
  },
  {
    id: "a3_dependency",
    section: "adoption",
    calibration: true,
    title: "If AI disappeared tomorrow, how disrupted would you be?",
    insight: 'How you handle AI failures reveals your true skill level. The gap between knowing about AI and applying it effectively is where career value lives.<div class="source">— Deloitte State of AI in the Enterprise 2026</div>',
    axes: { adoption: [0, 1, 2, 3, 4] },
    options: [
      { text: "Not disrupted at all", level: 1 },
      { text: "Minor inconvenience", level: 1.5 },
      { text: "Noticeably slower", level: 2 },
      { text: "Some workflows would break", level: 3 },
      { text: "Significant disruption", level: 4 }
    ]
  },

  // === MINDSET (5) ===
  {
    id: "m1_reaction",
    section: "mindset",
    sentiment: true,
    title: "When you hear about rapid AI progress, you mostly feel:",
    insight: 'Research shows that people who channel AI-related concern into action — learning, experimenting, networking — consistently outperform those who either ignore AI or become paralyzed by uncertainty.<div class="source">— Deloitte Human Capital Trends; Forbes Career Strategy, 2026</div>',
    axes: { mindset: [0, 2, 3, 1, 0] },
    options: [
      { text: "Unaffected — doesn't concern me", level: 1, sent: { confidence: 0, anxiety: 0, motivation: 0 } },
      { text: "Curious — want to learn more", level: 2, sent: { confidence: 0, anxiety: 0, motivation: 1 } },
      { text: "Excited — feels like opportunity", level: 3, sent: { confidence: 1, anxiety: 0, motivation: 2 } },
      { text: "Anxious — worried about falling behind", level: 2, sent: { confidence: -1, anxiety: 2, motivation: 1 } },
      { text: "Overwhelmed — trying to avoid it", level: 1, sent: { confidence: -1, anxiety: 3, motivation: 0 } }
    ]
  },
  {
    id: "m2_confidence",
    section: "mindset",
    calibration: true,
    title: "When using AI, you usually feel:",
    insight: 'Your mental model of AI predicts how you will use it. People who see AI as a "system component" adopt it 3x faster than those who see it as a search engine.<div class="source">— McKinsey Global Survey on AI, 2025</div>',
    axes: { mindset: [0, 1, 2, 3, 4] },
    options: [
      { text: "Don't know how to start", level: 1, sent: { confidence: -1, anxiety: 1, motivation: 0 } },
      { text: "I can get basic help from it", level: 2, sent: { confidence: 1, anxiety: 0, motivation: 1 } },
      { text: "Comfortable experimenting and steering", level: 3, sent: { confidence: 2, anxiety: 0, motivation: 2 } },
      { text: "Confident I can get reliable results", level: 4, sent: { confidence: 3, anxiety: 0, motivation: 2 } },
      { text: "In control of outcomes via process design", level: 5, sent: { confidence: 4, anxiety: 0, motivation: 3 } }
    ]
  },
  {
    id: "m3_motivation",
    section: "mindset",
    title: "What drives your AI interest?",
    insight: 'Continuous learning is the strongest signal of career resilience. Professionals who set aside dedicated weekly time for skill development report higher confidence and adaptability.<div class="source">— Forbes, "40% Of Job Skills Will Change By 2030," Feb 2026</div>',
    axes: { mindset: [0, 1, 2, 3, 4] },
    options: [
      { text: "No strong reason yet", level: 1, sent: { confidence: 0, anxiety: 0, motivation: 0 } },
      { text: "Curiosity and learning", level: 2, sent: { confidence: 0, anxiety: 0, motivation: 1 } },
      { text: "Productivity — getting more done", level: 3, sent: { confidence: 1, anxiety: 0, motivation: 2 } },
      { text: "Career advantage", level: 3, sent: { confidence: 1, anxiety: 0, motivation: 3 } },
      { text: "Building systems and products with AI", level: 5, sent: { confidence: 2, anxiety: 0, motivation: 4 } }
    ]
  },
  {
    id: "m4_trust",
    section: "mindset",
    title: "When AI gives you a wrong answer, you:",
    insight: 'The gap between knowing about AI and applying it effectively is where career value lives. How you handle AI failures reveals your true skill level.<div class="source">— Deloitte State of AI in the Enterprise 2026</div>',
    axes: { mindset: [0, 1, 2, 3, 4] },
    options: [
      { text: "Stop relying on AI for that", level: 1 },
      { text: "Reword and retry once", level: 2 },
      { text: "Ask for its reasoning step by step", level: 3 },
      { text: "Add constraints, examples, and ask it to verify", level: 4 },
      { text: "Cross-check with sources/tests and iterate", level: 5 }
    ]
  },
  {
    id: "m5_learning",
    section: "mindset",
    title: "When you see a new AI trend, what do you do?",
    insight: 'The AI tool landscape changes monthly. Professionals who evaluate new tools strategically — not just chase hype — make better adoption decisions.<div class="source">— ManpowerGroup 2026 Global Talent Shortage Survey</div>',
    axes: { mindset: [0, 1, 1, 3, 4] },
    options: [
      { text: "Ignore it", level: 1 },
      { text: "Save it \"for later\"", level: 1.5 },
      { text: "Skim and move on", level: 2 },
      { text: "Test it on a real task", level: 4 },
      { text: "Evaluate with a checklist or benchmark", level: 5 }
    ]
  },

  // === CRAFT (4) ===
  {
    id: "c1_repeat",
    section: "craft",
    calibration: true,
    title: "You did a task with AI today. Tomorrow you need to do it again. You:",
    insight: 'An estimated 25% of all work hours globally are now automatable — up from 18% two years ago. The professionals who systematize repetitive work free themselves for higher-value thinking.<div class="source">— McKinsey Global Institute; WEF Future of Jobs Report</div>',
    axes: { craft: [0, 1, 2, 3, 4] },
    options: [
      { text: "Redo it manually", level: 1 },
      { text: "Ask AI again from scratch", level: 1.5 },
      { text: "Reuse the same prompt", level: 2 },
      { text: "Follow a template or checklist I made", level: 3 },
      { text: "It's already systematized — inputs, outputs, rubric, handoffs", level: 5 }
    ]
  },
  {
    id: "c2_capture",
    section: "craft",
    title: "When you discover a prompt or workflow that works well:",
    insight: 'Knowledge management is becoming a critical AI-era skill. Professionals who systematize their AI interactions compound their productivity gains over time.<div class="source">— Deloitte State of AI in the Enterprise 2026</div>',
    axes: { craft: [0, 1, 2, 3, 4] },
    options: [
      { text: "It disappears — I forget it", level: 1 },
      { text: "Save the chat or screenshot it", level: 1.5 },
      { text: "Write notes about what worked", level: 2 },
      { text: "Add it to a reusable prompt/template library", level: 4 },
      { text: "Convert it into a shared tool with examples", level: 5 }
    ]
  },
  {
    id: "c3_quality",
    section: "craft",
    title: "How do you ensure AI output quality?",
    insight: 'AI-augmented professionals report 30-50% time savings on content creation. But the quality gap between "AI-assisted" and "AI-directed" writing is where career differentiation happens.<div class="source">— Deloitte Human Capital Trends 2025</div>',
    axes: { craft: [0, 1, 2, 3, 4], reliability: [0, 0, 1, 2, 3] },
    options: [
      { text: "Retry until it looks okay", level: 1 },
      { text: "Give clearer instructions", level: 2 },
      { text: "Add constraints and examples", level: 3 },
      { text: "Use a rubric and structured output format", level: 4 },
      { text: "Workflow with review checkpoints and eval criteria", level: 5 }
    ]
  },
  {
    id: "c4_deadline",
    section: "craft",
    crossCheck: true,
    title: "Deadline pressure hits. You:",
    insight: 'How you behave under pressure reveals your true operating level — not your aspirational one. The gap between "what I do when relaxed" and "what I do under stress" is your real skill floor.<div class="source">— Deloitte Human Capital Trends 2025</div>',
    axes: { craft: [0, 1, 2, 3, 4] },
    options: [
      { text: "Go fully manual — no time to experiment", level: 1 },
      { text: "Quick AI help for speed only", level: 2 },
      { text: "Reuse prompts I know work", level: 3 },
      { text: "Follow my repeatable workflow", level: 4 },
      { text: "Systems and automation already in place", level: 5 }
    ]
  },

  // === TECH DEPTH (2) ===
  {
    id: "t1_mode",
    section: "tech",
    title: "How do you typically interact with AI?",
    insight: 'Organizations investing in workforce development alongside AI are 1.8x more likely to report better financial results. System-level thinking is the differentiator.<div class="source">— Deloitte State of AI in the Enterprise 2026</div>',
    axes: { tech_depth: [0, 1, 2, 3, 4] },
    options: [
      { text: "Chat UI only", level: 1 },
      { text: "Copy/paste between AI and other tools", level: 2 },
      { text: "Browser extensions or no-code automation", level: 3 },
      { text: "APIs, scripts, or programmatic access", level: 4 },
      { text: "Integrated AI services in my products/workflows", level: 5 }
    ]
  },
  {
    id: "t2_knowledge",
    section: "tech",
    title: "When you need AI to work with your own documents or data:",
    insight: 'AI skills have surpassed all others as the most difficult for employers to find globally, with 72% reporting hiring difficulty. Knowing how to handle AI failures is a premium skill.<div class="source">— ManpowerGroup 2026 Global Talent Shortage Survey</div>',
    axes: { tech_depth: [0, 1, 2, 3, 4] },
    options: [
      { text: "I don't do this", level: 1 },
      { text: "Paste minimal text and hope", level: 1.5 },
      { text: "Curate relevant snippets carefully", level: 3 },
      { text: "Prepare a reference pack or prompt kit", level: 4 },
      { text: "Use retrieval/search or structured data pipelines", level: 5 }
    ]
  },

  // === RELIABILITY (2) ===
  {
    id: "r1_consistency",
    section: "reliability",
    title: "You need consistent AI results at scale. You:",
    insight: 'By 2030, 70% of workplace skills will change because of AI. Teams that standardize AI workflows outperform those where everyone experiments individually.<div class="source">— BusinessWorld, Feb 2026; Forbes Career Strategy</div>',
    axes: { reliability: [0, 1, 2, 3, 4] },
    options: [
      { text: "Avoid using AI for important things", level: 1 },
      { text: "Manual review of everything", level: 2 },
      { text: "Tighten prompts and output formats", level: 3 },
      { text: "Rubrics, rules, and structured outputs", level: 4 },
      { text: "Eval sets, automated scoring, and tests", level: 5 }
    ]
  },
  {
    id: "r2_mistake",
    section: "reliability",
    title: "AI makes a serious mistake in production. You:",
    insight: 'The ability to evaluate AI reliably is rare and extremely valuable. Most organizations lack systematic approaches to AI quality assurance.<div class="source">— Deloitte State of AI in the Enterprise 2026</div>',
    axes: { reliability: [0, 1, 2, 3, 4] },
    options: [
      { text: "Stop using AI for important tasks", level: 1 },
      { text: "Add more human review", level: 2 },
      { text: "Improve prompts and instructions", level: 3 },
      { text: "Add safeguards and monitoring triggers", level: 4 },
      { text: "Build feedback loop — logs, regression tests, eval gates", level: 5 }
    ]
  },

  // === AGENTS (2) ===
  {
    id: "g1_maturity",
    section: "agents",
    title: "Your experience with AI agents (multi-step, tool-using AI):",
    insight: 'IDC predicts that by 2026, over 90% of organizations will feel the pain of the IT skills crisis. The demand for people who can work with AI agents far outstrips supply.<div class="source">— IDC Survey 2024; ManageEngine</div>',
    axes: { agents: [0, 1, 2, 3, 4] },
    options: [
      { text: "Not sure what \"agents\" means", level: 1 },
      { text: "Seen demos but never used one", level: 1.5 },
      { text: "Tried toy agents or simple automations", level: 2 },
      { text: "Built agents for personal workflows (weekly use)", level: 4 },
      { text: "Built or ran agents for team/users (production-ish)", level: 5 }
    ]
  },
  {
    id: "g2_orchestration",
    section: "agents",
    title: "How do you handle multi-step AI tasks?",
    insight: 'Companies with 40%+ AI projects in production are set to double in six months. The ability to deploy AI for teams — not just yourself — is a leadership multiplier.<div class="source">— Deloitte State of AI in the Enterprise 2026</div>',
    axes: { agents: [0, 1, 2, 3, 4] },
    options: [
      { text: "Manual steps only — I do each part", level: 1 },
      { text: "Ask AI step by step, I coordinate", level: 2 },
      { text: "Repeatable checklist or workflow", level: 3 },
      { text: "Semi-automated chaining across tools", level: 4 },
      { text: "Plan → act → check loops with state and retries", level: 5 }
    ]
  },

  // === TOOLS (multi-select, everyone sees) ===
  {
    id: "ai_tools",
    section: "future",
    type: "multi",
    title: "Which AI tools do you actively use?",
    insight: 'The most impactful AI adoption comes from mastering domain-specific tools, not generic chatbots. Specialized AI knowledge in your field makes you significantly more valuable.<div class="source">— ManpowerGroup 2026 Global Talent Shortage Survey</div>',
    options: [
      { text: "ChatGPT (OpenAI)", toolCategory: "general" },
      { text: "Claude (Anthropic)", toolCategory: "general" },
      { text: "Google Gemini", toolCategory: "general" },
      { text: "DeepSeek", toolCategory: "general" },
      { text: "Doubao / 豆包 (ByteDance)", toolCategory: "general" },
      { text: "Kimi (Moonshot AI)", toolCategory: "general" },
      { text: "Qwen / 通义千问 (Alibaba)", toolCategory: "general" },
      { text: "Perplexity", toolCategory: "research" },
      { text: "Microsoft Copilot", toolCategory: "productivity" },
      { text: "GitHub Copilot", toolCategory: "coding" },
      { text: "Cursor", toolCategory: "coding" },
      { text: "Windsurf", toolCategory: "coding" },
      { text: "Kiro (prev. Amazon Q Developer)", toolCategory: "coding" },
      { text: "Claude Code", toolCategory: "coding" },
      { text: "MiniMax / Hailuo AI", toolCategory: "creative" },
      { text: "Midjourney", toolCategory: "creative" },
      { text: "DALL·E / ChatGPT Images", toolCategory: "creative" },
      { text: "Stable Diffusion / FLUX", toolCategory: "creative" },
      { text: "Adobe Firefly", toolCategory: "creative" },
      { text: "Canva AI", toolCategory: "creative" },
      { text: "Suno / Udio (music)", toolCategory: "creative" },
      { text: "ElevenLabs (voice)", toolCategory: "creative" },
      { text: "Notion AI", toolCategory: "productivity" },
      { text: "Grammarly AI", toolCategory: "productivity" },
      { text: "LangChain / LlamaIndex / AI frameworks", toolCategory: "advanced" },
      { text: "Hugging Face / open-source models", toolCategory: "advanced" },
      { text: "Other", toolCategory: "other" }
    ]
  },

  // === SELF-IDENTIFY (calibration anchor) ===
  {
    id: "self_identify",
    section: "future",
    title: "Which feels closest to you right now?",
    insight: 'Self-awareness about your current position is the first step to intentional growth. Where you are matters less than knowing where you want to go.<div class="source">— Deloitte Human Capital Trends 2025</div>',
    axes: { adoption: [0, 1, 2, 2, 3], craft: [0, 0, 1, 2, 3] },
    options: [
      { text: "AI observer — watching from the sidelines", level: 1 },
      { text: "Casual user — it helps sometimes", level: 2 },
      { text: "Power user — AI is part of my daily work", level: 3 },
      { text: "Workflow optimizer — I design how AI fits into processes", level: 4 },
      { text: "AI builder — I create tools and systems with AI", level: 5 }
    ]
  }
];
