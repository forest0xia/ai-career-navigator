// AI Adoption Diagnostic v3 — 8-level system, 12 questions, 6-axis radar
// Axes: adoption, mindset, craft, tech_depth, reliability, agents
// Levels: dabbler, prompter, collaborator, designer, builder, leverager, amplifier, visionary

const SECTIONS = {
  calibration: "Calibration",
  adoption: "Adoption",
  mindset: "Mindset",
  craft: "Craft",
  tech: "Tech Depth",
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

  // === ADOPTION (2) ===
  {
    id: "a1_frequency",
    section: "adoption",
    calibration: true,
    title: "How often do you use AI today?",
    insight: 'Sanctioned access to AI tools is now available to ~60% of workers, up from under 40% a year ago. Professionals with AI skills command an average wage premium of 56%.<div class="source">— Deloitte State of AI in the Enterprise 2026</div>',
    axes: { adoption: [0, 1, 2, 3] },
    options: [
      { text: "Rarely or never", level: 1 },
      { text: "A few times a month", level: 2 },
      { text: "Most workdays", level: 3 },
      { text: "Daily, multiple times a day", level: 4 }
    ]
  },
  {
    id: "a2_breadth",
    section: "adoption",
    title: "How broadly do you use AI?",
    insight: 'The most impactful AI adoption comes from mastering domain-specific tools, not generic chatbots. Specialized AI knowledge in your field makes you significantly more valuable.<div class="source">— ManpowerGroup 2026 Global Talent Shortage Survey</div>',
    axes: { adoption: [0, 1, 2, 3] },
    options: [
      { text: "Not yet", level: 1 },
      { text: "One area (e.g. writing or search)", level: 2 },
      { text: "2\u20133 different areas", level: 3 },
      { text: "It touches most of my workflows", level: 4 }
    ]
  },

  // === MINDSET (2) ===
  {
    id: "m1_reaction",
    section: "mindset",
    sentiment: true,
    title: "When you hear about rapid AI progress, you mostly feel:",
    insight: 'Research shows that people who channel AI-related concern into action \u2014 learning, experimenting, networking \u2014 consistently outperform those who either ignore AI or become paralyzed by uncertainty.<div class="source">— Deloitte Human Capital Trends; Forbes Career Strategy, 2026</div>',
    axes: { mindset: [0, 2, 3, 1, 0] },
    options: [
      { text: "Unaffected \u2014 doesn\u2019t concern me", level: 1, sent: { confidence: 0, anxiety: 0, motivation: 0 } },
      { text: "Curious \u2014 want to learn more", level: 2, sent: { confidence: 0, anxiety: 0, motivation: 1 } },
      { text: "Excited \u2014 feels like opportunity", level: 3, sent: { confidence: 1, anxiety: 0, motivation: 2 } },
      { text: "Anxious \u2014 worried about falling behind", level: 2, sent: { confidence: -1, anxiety: 2, motivation: 1 } },
      { text: "Overwhelmed \u2014 trying to avoid it", level: 1, sent: { confidence: -1, anxiety: 3, motivation: 0 } }
    ]
  },
  {
    id: "m2_confidence",
    section: "mindset",
    calibration: true,
    title: "When using AI, you usually feel:",
    insight: 'Your mental model of AI predicts how you will use it. People who see AI as a "system component" adopt it 3x faster than those who see it as a search engine.<div class="source">— McKinsey Global Survey on AI, 2025</div>',
    axes: { mindset: [0, 1, 2, 3] },
    options: [
      { text: "Don\u2019t know how to start", level: 1, sent: { confidence: -1, anxiety: 1, motivation: 0 } },
      { text: "I can get basic help from it", level: 2, sent: { confidence: 1, anxiety: 0, motivation: 1 } },
      { text: "Comfortable getting good results", level: 3, sent: { confidence: 2, anxiety: 0, motivation: 2 } },
      { text: "In control of outcomes via process design", level: 5, sent: { confidence: 4, anxiety: 0, motivation: 3 } }
    ]
  },

  // === CRAFT (2) — merged quality + reliability into one question ===
  {
    id: "c1_repeat",
    section: "craft",
    calibration: true,
    title: "You did a task with AI today. Tomorrow you need to do it again. You:",
    insight: 'An estimated 25% of all work hours globally are now automatable \u2014 up from 18% two years ago. The professionals who systematize repetitive work free themselves for higher-value thinking.<div class="source">— McKinsey Global Institute; WEF Future of Jobs Report</div>',
    axes: { craft: [0, 1, 2, 3] },
    options: [
      { text: "Redo it manually or ask AI from scratch", level: 1 },
      { text: "Reuse the same prompt", level: 2 },
      { text: "Follow a template or checklist I made", level: 3 },
      { text: "Already systematized \u2014 inputs, outputs, quality checks", level: 5 }
    ]
  },
  {
    id: "c3_quality",
    section: "craft",
    title: "How do you ensure AI output is good enough to use?",
    insight: 'AI-augmented professionals report 30-50% time savings on content creation. But the quality gap between "AI-assisted" and "AI-directed" output is where career differentiation happens.<div class="source">— Deloitte Human Capital Trends 2025</div>',
    axes: { craft: [0, 1, 2, 3], reliability: [0, 1, 2, 3] },
    options: [
      { text: "Retry until it looks okay", level: 1 },
      { text: "Give clearer instructions with examples", level: 2 },
      { text: "Use structured outputs, rubrics, and constraints", level: 4 },
      { text: "Systematic eval, automated checks, and review gates", level: 5 }
    ]
  },

  // === TECH DEPTH (1) ===
  {
    id: "t1_mode",
    section: "tech",
    title: "How do you typically interact with AI?",
    insight: 'Organizations investing in workforce development alongside AI are 1.8x more likely to report better financial results. System-level thinking is the differentiator.<div class="source">— Deloitte State of AI in the Enterprise 2026</div>',
    axes: { tech_depth: [0, 1, 2, 3] },
    options: [
      { text: "Chat UI only", level: 1 },
      { text: "Copy/paste between AI and other tools", level: 2 },
      { text: "Browser extensions, no-code automation, or APIs", level: 4 },
      { text: "AI integrated into my products or workflows", level: 5 }
    ]
  },

  // === AGENTS (1) ===
  {
    id: "g1_maturity",
    section: "agents",
    title: "Your experience with AI agents (multi-step, tool-using AI):",
    insight: 'IDC predicts that by 2026, over 90% of organizations will feel the pain of the IT skills crisis. The demand for people who can work with AI agents far outstrips supply.<div class="source">— IDC Survey 2024; ManageEngine</div>',
    axes: { agents: [0, 1, 2, 3] },
    options: [
      { text: "Not sure what \"agents\" means", level: 1 },
      { text: "Seen demos or tried simple ones", level: 2 },
      { text: "Built agents for personal workflows", level: 4 },
      { text: "Built or ran agents for team/production use", level: 5 }
    ]
  },

  // === IMPACT SCOPE (differentiates levels 6-8) ===
  {
    id: "impact_scope",
    section: "future",
    title: "What\u2019s the scope of your AI impact?",
    insight: 'Companies with 40%+ AI projects in production are set to double in six months. The ability to deploy AI for teams \u2014 not just yourself \u2014 is a leadership multiplier.<div class="source">— Deloitte State of AI in the Enterprise 2026</div>',
    axes: { agents: [0, 0, 1, 3], adoption: [0, 1, 2, 3] },
    options: [
      { text: "Still learning for myself", level: 1 },
      { text: "Use AI effectively in my own work", level: 2 },
      { text: "Help my team or design AI workflows for my org", level: 4 },
      { text: "Build AI products, platforms, or contribute to the ecosystem", level: 5 }
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
      { text: "Doubao / \u8c46\u5305 (ByteDance)", toolCategory: "general" },
      { text: "Kimi (Moonshot AI)", toolCategory: "general" },
      { text: "Qwen / \u901a\u4e49\u5343\u95ee (Alibaba)", toolCategory: "general" },
      { text: "Perplexity", toolCategory: "research" },
      { text: "Microsoft Copilot", toolCategory: "productivity" },
      { text: "GitHub Copilot", toolCategory: "coding" },
      { text: "Cursor", toolCategory: "coding" },
      { text: "Windsurf", toolCategory: "coding" },
      { text: "Kiro (prev. Amazon Q Developer)", toolCategory: "coding" },
      { text: "Claude Code", toolCategory: "coding" },
      { text: "MiniMax / Hailuo AI", toolCategory: "creative" },
      { text: "Midjourney", toolCategory: "creative" },
      { text: "DALL\u00b7E / ChatGPT Images", toolCategory: "creative" },
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

  // === SELF-IDENTIFY (4-tier anchor) ===
  {
    id: "self_identify",
    section: "future",
    title: "Which feels closest to you right now?",
    insight: 'Self-awareness about your current position is the first step to intentional growth. Where you are matters less than knowing where you want to go.<div class="source">— Deloitte Human Capital Trends 2025</div>',
    axes: { adoption: [0, 1, 2, 3], craft: [0, 1, 2, 3] },
    options: [
      { text: "Beginner \u2014 still exploring what AI can do", level: 1 },
      { text: "Active user \u2014 AI helps me get work done faster", level: 3 },
      { text: "Builder \u2014 I design workflows or automations with AI", level: 5 },
      { text: "Leader \u2014 I build AI systems for my team, org, or the ecosystem", level: 8 }
    ]
  }
];
