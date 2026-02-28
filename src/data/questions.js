// Research-backed questions with cited insights
// Dimensions: adaptability, technical, creative, leadership, aiReadiness, humanEdge
// Multi-select questions use type: "multi"

const SECTIONS = {
  role: "Your Current Role",
  skills: "Skills & Learning Style",
  ai: "AI Familiarity & Mindset",
  tools: "AI Tools & Agents",
  work: "Work Style & Values",
  future: "Future Orientation"
};

const QUESTIONS = [
  // === ROLE (4 questions) ===
  {
    id: "domain",
    section: "role",
    title: "Which best describes your professional domain?",
    insight: 'The WEF Future of Jobs Report 2025 projects 170 million new roles created by 2030, but 92 million eliminated — a net gain of 78 million. The impact varies dramatically by sector.<div class="source">— World Economic Forum, Future of Jobs Report 2025</div>',
    options: [
      { text: "Software Engineering / IT / DevOps", scores: { technical: 3, aiReadiness: 2 }, tags: ["tech"] },
      { text: "Data Science / Analytics / Research", scores: { technical: 2, aiReadiness: 2 }, tags: ["tech"] },
      { text: "Design / Creative / Content / Marketing", scores: { creative: 3, humanEdge: 1 }, tags: ["creative"] },
      { text: "Business / Management / Operations / Finance", scores: { leadership: 2, humanEdge: 1 }, tags: ["business"] },
      { text: "Healthcare / Education / Legal / Government", scores: { humanEdge: 3 }, tags: ["regulated"] },
      { text: "Trades / Manufacturing / Logistics / Retail", scores: { adaptability: 1 }, tags: ["physical"] },
      { text: "Student / Career Changer / Between roles", scores: { adaptability: 2 }, tags: ["early"] },
      { text: "Other", scores: { adaptability: 1 }, tags: ["business"] }
    ]
  },
  {
    id: "experience",
    section: "role",
    title: "How many years of professional experience do you have?",
    insight: 'Entry and junior-level roles with routine digital work face the highest near-term AI displacement risk. Senior professionals with deep domain expertise have natural resilience — AI struggles to replicate judgment built over years.<div class="source">— Forbes, "How To Protect Your Career From AI Job Displacement," Feb 2026</div>',
    options: [
      { text: "0–2 years (early career)", scores: { adaptability: 2 } },
      { text: "3–7 years (mid-career)", scores: { adaptability: 1, leadership: 1 } },
      { text: "8–15 years (senior)", scores: { leadership: 2, humanEdge: 1 } },
      { text: "15+ years (veteran)", scores: { leadership: 2, humanEdge: 2 } }
    ]
  },
  {
    id: "daily_tasks",
    section: "role",
    title: "What takes up most of your working hours?",
    desc: "Select the activity that dominates your typical day.",
    insight: 'An estimated 25% of all work hours globally are now considered automatable — up from 18% two years ago.<div class="source">— McKinsey Global Institute; WEF Future of Jobs Report</div>',
    options: [
      { text: "Writing code, debugging, system design", scores: { technical: 2, aiReadiness: 1 }, showIf: ["tech"] },
      { text: "Analyzing data, building models, research", scores: { technical: 2, aiReadiness: 1 }, showIf: ["tech"] },
      { text: "Writing, designing, creating content", scores: { creative: 3 } },
      { text: "Meetings, strategy, managing people", scores: { leadership: 3, humanEdge: 1 } },
      { text: "Client/patient/student interaction, advising", scores: { humanEdge: 4 } },
      { text: "Hands-on physical or operational work", scores: { humanEdge: 3, adaptability: 1 } },
      { text: "Administrative tasks, data entry, processing", scores: { adaptability: -1 } },
      { text: "A mix of the above / Other", scores: { adaptability: 1 } }
    ]
  },
  {
    id: "team_size",
    section: "role",
    title: "How large is the team or organization you work in?",
    insight: 'Larger organizations are adopting AI faster — 72% of large enterprises have deployed AI in at least one function, compared to 35% of small businesses. But smaller teams often have more freedom to experiment and adopt tools individually.<div class="source">— McKinsey Global Survey on AI, 2025</div>',
    options: [
      { text: "Solo / freelance / independent", scores: { adaptability: 2, creative: 1 } },
      { text: "Small team (2–10 people)", scores: { adaptability: 1, humanEdge: 1 } },
      { text: "Medium team (11–50 people)", scores: { leadership: 1 } },
      { text: "Large organization (50+ people)", scores: { leadership: 1 } }
    ]
  },

  // === SKILLS (5 questions) ===
  {
    id: "strongest_skill",
    section: "skills",
    title: "What is your strongest professional skill?",
    insight: 'McKinsey now operates with 20,000 AI agents alongside 40,000 humans. 30% of companies are planning AI-driven workforce reductions in 2026. Yet despite surging AI demand, communication, collaboration, and adaptability remain the most sought-after human attributes (cited by 39% of employers).<div class="source">— McKinsey, Jan 2026; ManpowerGroup 2026 Talent Shortage Survey</div>',
    options: [
      { text: "Analytical thinking and complex problem-solving", scores: { technical: 2, aiReadiness: 1 } },
      { text: "Communication, persuasion, and storytelling", scores: { humanEdge: 4 } },
      { text: "Creative ideation and design thinking", scores: { creative: 4 } },
      { text: "Leadership, team building, and strategic thinking", scores: { leadership: 4 } },
      { text: "Deep technical expertise in a specialized area", scores: { technical: 3 } },
      { text: "Empathy, relationship building, and emotional intelligence", scores: { humanEdge: 3 } },
      { text: "Adaptability and rapid learning", scores: { adaptability: 3 } }
    ]
  },
  {
    id: "secondary_skill",
    section: "skills",
    title: "What's your second strongest skill?",
    desc: "Your skill combination matters — people with complementary strengths are harder to replace.",
    insight: 'Cross-functional skill combinations are increasingly valuable. A developer who communicates well, a designer who understands data, a manager who can code — these "T-shaped" professionals command premium compensation because AI can\'t replicate their cross-domain synthesis.<div class="source">— Deloitte Human Capital Trends 2025</div>',
    options: [
      { text: "Analytical thinking and complex problem-solving", scores: { technical: 2 } },
      { text: "Communication, persuasion, and storytelling", scores: { humanEdge: 2 } },
      { text: "Creative ideation and design thinking", scores: { creative: 2 } },
      { text: "Leadership, team building, and strategic thinking", scores: { leadership: 2 } },
      { text: "Deep technical expertise in a specialized area", scores: { technical: 2 } },
      { text: "Empathy, relationship building, and emotional intelligence", scores: { humanEdge: 2 } },
      { text: "Adaptability and rapid learning", scores: { adaptability: 2 } }
    ]
  },
  {
    id: "learning_approach",
    section: "skills",
    title: "How do you approach learning new professional skills?",
    insight: 'The WEF reports that 59% of workers globally will need reskilling by 2030. But how you learn matters as much as what you learn. Professionals who combine hands-on experimentation with structured learning adopt AI tools 2–3x faster.<div class="source">— World Economic Forum, Future of Jobs Report 2025</div>',
    options: [
      { text: "I experiment first, then formalize — learning by doing", scores: { adaptability: 3, aiReadiness: 1 } },
      { text: "I take structured courses and earn certifications", scores: { adaptability: 1, technical: 1 } },
      { text: "I learn from peers, mentors, and communities", scores: { humanEdge: 1, leadership: 1 } },
      { text: "I read documentation, papers, and deep-dive independently", scores: { technical: 2 } },
      { text: "I learn best under pressure — on-the-job, real stakes", scores: { adaptability: 2 } }
    ]
  },
  {
    id: "cross_functional",
    section: "skills",
    title: "How often do you work across different disciplines?",
    desc: "E.g., a developer who also does product design, or a marketer who analyzes data.",
    insight: 'AI handles narrow, well-defined tasks well. But connecting insights across domains — seeing patterns between marketing data and engineering constraints, for example — remains a distinctly human capability and is increasingly valued by employers.<div class="source">— Deloitte Human Capital Trends 2025</div>',
    options: [
      { text: "Constantly — I wear many hats and bridge multiple functions", scores: { adaptability: 2, creative: 2 } },
      { text: "Often — I collaborate across teams on most projects", scores: { adaptability: 1, leadership: 2 } },
      { text: "Sometimes — when specific projects require it", scores: { adaptability: 1 } },
      { text: "Rarely — I'm deep in my specialty and that's where I add value", scores: { technical: 2 } }
    ]
  },
  {
    id: "recent_learning",
    section: "skills",
    title: "In the past 6 months, have you learned a significant new skill or tool?",
    insight: 'Continuous learning is the strongest signal of career resilience. Professionals who set aside dedicated weekly time for skill development report higher confidence, composure, and creativity — traits that become more valuable as AI handles routine work.<div class="source">— Forbes, "40% Of Job Skills Will Change By 2030," Feb 2026</div>',
    options: [
      { text: "Yes — multiple new skills or tools", scores: { adaptability: 3, aiReadiness: 1 } },
      { text: "Yes — one meaningful new skill or tool", scores: { adaptability: 2 } },
      { text: "Explored a bit but nothing I use regularly", scores: { adaptability: 1 } },
      { text: "No — focused on executing with current skills", scores: { technical: 1 } }
    ]
  },

  // === AI FAMILIARITY (4 questions) ===
  {
    id: "ai_usage",
    section: "ai",
    title: "How do you currently use AI tools in your work?",
    insight: 'Sanctioned access to AI tools is now available to roughly 60% of workers, up from under 40% a year ago. Professionals with AI skills command an average wage premium of 56%, and AI job postings are 134% above 2020 levels.<div class="source">— Deloitte State of AI in the Enterprise 2026; BusinessWorld, Feb 2026</div>',
    options: [
      { text: "Daily — AI is a core part of my workflow", scores: { aiReadiness: 3, adaptability: 2 } },
      { text: "Several times a week for specific tasks", scores: { aiReadiness: 2, adaptability: 1 } },
      { text: "Occasionally — I've tried a few tools", scores: { aiReadiness: 1 } },
      { text: "Rarely — haven't explored much yet", scores: {} },
      { text: "Tried them but prefer my current methods", scores: { humanEdge: 1 } }
    ]
  },
  {
    id: "ai_perception",
    section: "ai",
    title: "Which statement best reflects your view of AI's role in work?",
    insight: 'Worker access to AI rose 50% in 2025, and companies with 40%+ AI projects in production are set to double in six months. Organizations investing in workforce development alongside AI are 1.8x more likely to report better financial results.<div class="source">— Deloitte State of AI in the Enterprise 2026; Deloitte Human Capital Trends</div>',
    options: [
      { text: "It amplifies what I'm already good at", scores: { aiReadiness: 3, adaptability: 2 } },
      { text: "Useful for specific tasks, but has clear limits", scores: { aiReadiness: 1, humanEdge: 1 } },
      { text: "Interesting technology, but fundamentals matter more", scores: { humanEdge: 2 } },
      { text: "A major shift — many roles will change significantly", scores: { adaptability: 1 } },
      { text: "Still forming my view — watching how it develops", scores: { adaptability: 1 } }
    ]
  },
  {
    id: "ai_technical",
    section: "ai",
    title: "How would you rate your understanding of how AI/ML systems work?",
    showIf: ["tech"],
    insight: 'AI skills have surpassed all others to become the most difficult for employers to find globally, with 72% of employers reporting hiring difficulty. AI Model &amp; Application Development (20%) and AI Literacy (19%) now lead the global ranking of hard-to-find skills.<div class="source">— ManpowerGroup 2026 Global Talent Shortage Survey (39,000 employers, 41 countries)</div>',
    options: [
      { text: "Deep — I build/train models or work with ML infrastructure", scores: { technical: 3, aiReadiness: 3 } },
      { text: "Solid — I understand architectures, can fine-tune, use APIs effectively", scores: { technical: 2, aiReadiness: 2 } },
      { text: "Conceptual — I grasp the basics (neural nets, training, prompting)", scores: { technical: 1, aiReadiness: 1 } },
      { text: "Surface-level — I use AI tools but don't understand the internals", scores: { aiReadiness: 1 } }
    ]
  },
  {
    id: "ai_general",
    section: "ai",
    title: "What's your comfort level with adopting new technology?",
    showIf: ["creative", "business", "regulated", "physical", "early"],
    insight: 'You don\'t need to become a programmer to work effectively with AI. But you do need to understand how AI tools function, where they fail, and how to use them strategically. AI literacy — not coding — is the critical skill.<div class="source">— Forbes, "40% Of Job Skills Will Change By 2030," Feb 2026</div>',
    options: [
      { text: "Very comfortable — I pick up new tools quickly and enjoy it", scores: { aiReadiness: 2, adaptability: 2 } },
      { text: "Comfortable — I can learn with some guidance and practice", scores: { aiReadiness: 1, adaptability: 1 } },
      { text: "Cautious — I prefer proven, well-documented tools", scores: { humanEdge: 1 } },
      { text: "Uncomfortable — technology isn't my strength", scores: {} }
    ]
  },
  {
    id: "ai_depth",
    section: "ai",
    title: "Which of these have you actually done? (Select all that apply)",
    desc: "Be honest — this helps us calibrate your recommendations accurately.",
    type: "multi",
    insight: 'There is a wide gap between knowing about AI and applying it. This question helps distinguish awareness from hands-on experience, which matters for career positioning.<div class="source">— Deloitte State of AI in the Enterprise 2026</div>',
    options: [
      { text: "Written detailed prompts with system instructions or few-shot examples", scores: { aiReadiness: 1 } },
      { text: "Built a workflow that connects AI to other tools (APIs, automation)", scores: { aiReadiness: 2, technical: 1 } },
      { text: "Fine-tuned or trained a model on custom data", scores: { aiReadiness: 3, technical: 2 } },
      { text: "Evaluated AI output quality systematically (not just casual use)", scores: { aiReadiness: 1, humanEdge: 1 } },
      { text: "Deployed an AI-powered feature or product to real users", scores: { aiReadiness: 3, technical: 2, leadership: 1 } },
      { text: "Taught others how to use AI tools effectively", scores: { leadership: 2, aiReadiness: 1 } },
      { text: "None of these yet", scores: {} }
    ]
  },

  // === AI TOOLS (2 questions, including multi-select) ===
  {
    id: "ai_tools",
    section: "tools",
    type: "multi",
    title: "Which AI tools and agents do you actively use?",
    desc: "Select all that apply. This helps us show you what tools others in similar roles are using.",
    insight: 'The most impactful AI adoption comes from mastering domain-specific tools, not generic chatbots. Specialized AI knowledge in your field makes you significantly more valuable to employers.<div class="source">— ManpowerGroup 2026 Global Talent Shortage Survey</div>',
    options: [
      { text: "ChatGPT (OpenAI)", toolCategory: "general" },
      { text: "Claude (Anthropic)", toolCategory: "general" },
      { text: "Google Gemini", toolCategory: "general" },
      { text: "Perplexity", toolCategory: "research" },
      { text: "Microsoft Copilot (Office / Windows)", toolCategory: "productivity" },
      { text: "GitHub Copilot", toolCategory: "coding" },
      { text: "Cursor", toolCategory: "coding" },
      { text: "Windsurf", toolCategory: "coding" },
      { text: "Kiro (prev. Amazon Q Developer)", toolCategory: "coding" },
      { text: "Claude Code", toolCategory: "coding" },
      { text: "Midjourney", toolCategory: "creative" },
      { text: "DALL·E / ChatGPT Images", toolCategory: "creative" },
      { text: "Stable Diffusion / FLUX", toolCategory: "creative" },
      { text: "Adobe Firefly", toolCategory: "creative" },
      { text: "Canva AI (Magic Studio)", toolCategory: "creative" },
      { text: "Runway (video)", toolCategory: "creative" },
      { text: "Suno / Udio (music)", toolCategory: "creative" },
      { text: "ElevenLabs (voice / audio)", toolCategory: "creative" },
      { text: "Jasper", toolCategory: "writing" },
      { text: "Copy.ai", toolCategory: "writing" },
      { text: "Notion AI", toolCategory: "productivity" },
      { text: "Grammarly AI", toolCategory: "productivity" },
      { text: "Zapier AI / Make.com (automation)", toolCategory: "automation" },
      { text: "Custom GPTs / AI agents I've built", toolCategory: "advanced" },
      { text: "LangChain / LlamaIndex / AI frameworks", toolCategory: "advanced" },
      { text: "Hugging Face / open-source models", toolCategory: "advanced" },
      { text: "None of the above", toolCategory: "none" }
    ]
  },
  {
    id: "ai_application",
    section: "tools",
    title: "Which AI capability would be most valuable in your current role?",
    insight: 'Employers now value judgment and output quality over effort alone. Professionals who use AI to focus on higher-value work report greater job satisfaction and career growth.<div class="source">— Deloitte State of AI in the Enterprise 2026</div>',
    options: [
      { text: "Automating repetitive tasks so I can focus on higher-value work", scores: { adaptability: 2, aiReadiness: 1 } },
      { text: "Generating first drafts of content, code, or analysis", scores: { creative: 2, aiReadiness: 2 } },
      { text: "Analyzing large datasets to find patterns I'd miss", scores: { technical: 2, aiReadiness: 1 } },
      { text: "Helping me learn new skills and domains faster", scores: { adaptability: 2 } },
      { text: "Improving communication — writing, presentations, translations", scores: { humanEdge: 1, aiReadiness: 1 } },
      { text: "I'm not sure what AI could do for my specific work", scores: {} }
    ]
  },

  // === WORK STYLE (4 questions) ===
  {
    id: "work_value",
    section: "work",
    title: "What do you value most in your work?",
    insight: 'As AI absorbs routine tasks, it shifts human work toward judgment, strategy, and complex problem-solving. Roles centered on meaning, relationships, and creative expression are more resilient than those centered purely on efficiency and output volume.<div class="source">— Forbes, "40% Of Job Skills Will Change By 2030," Feb 2026</div>',
    options: [
      { text: "Solving complex, novel problems nobody else can crack", scores: { technical: 2, creative: 1 } },
      { text: "Making a direct, visible impact on people's lives", scores: { humanEdge: 4 } },
      { text: "Building and creating tangible things", scores: { creative: 3, technical: 1 } },
      { text: "Leading teams and shaping organizational direction", scores: { leadership: 4 } },
      { text: "Stability, predictability, and work-life balance", scores: { adaptability: -1, humanEdge: 1 } },
      { text: "Continuous learning, growth, and new challenges", scores: { adaptability: 3 } }
    ]
  },
  {
    id: "change_response",
    section: "work",
    title: "When your industry undergoes major disruption, you typically…",
    insight: 'Reskilling isn\'t a last resort — it\'s a strategic move. The professionals who treat learning as an ongoing process stay ahead of change instead of scrambling to catch up. Adaptability is the #1 predictor of career resilience.<div class="source">— Forbes, "40% Of Job Skills Will Change By 2030," Feb 2026</div>',
    options: [
      { text: "Move early — I prefer to be ahead of changes", scores: { adaptability: 3, aiReadiness: 1 } },
      { text: "Observe first, then act decisively", scores: { adaptability: 2, leadership: 1 } },
      { text: "Adapt when my role requires it", scores: { adaptability: 1 } },
      { text: "Stay with proven approaches — I value consistency", scores: { humanEdge: 1, adaptability: -1 } }
    ]
  },
  {
    id: "collaboration",
    section: "work",
    title: "How do you prefer to work?",
    insight: 'The WEF framework emphasizes cross-functional "innovation pods" combining HR, technology, and operations. Individual contributors who can orchestrate AI tools become force multipliers; collaborative leaders who integrate AI into team workflows are in highest demand.<div class="source">— WEF Workforce Transformation Framework, Feb 2026</div>',
    options: [
      { text: "Independently — deep focus, minimal interruptions", scores: { technical: 1, creative: 1 } },
      { text: "Small team — close collaboration with a few trusted people", scores: { humanEdge: 2, leadership: 1 } },
      { text: "Cross-functional — I thrive connecting different groups and ideas", scores: { leadership: 3, adaptability: 1 } },
      { text: "Client/stakeholder-facing — I'm energized by external interaction", scores: { humanEdge: 3 } }
    ]
  },
  {
    id: "decision_making",
    section: "work",
    title: "How do you typically make important professional decisions?",
    insight: 'AI excels at data-driven pattern recognition but struggles with decisions involving ambiguity, ethics, stakeholder politics, and novel situations. Understanding your decision-making style reveals where you naturally complement AI — and where you might over-rely on it.<div class="source">— Deloitte Human Capital Trends 2025</div>',
    options: [
      { text: "Data-driven — I gather evidence and analyze before deciding", scores: { technical: 2, aiReadiness: 1 } },
      { text: "Intuition-guided — I trust my experience and gut feeling", scores: { humanEdge: 3 } },
      { text: "Collaborative — I consult others and build consensus", scores: { leadership: 3, humanEdge: 1 } },
      { text: "Experimental — I try things quickly and iterate based on results", scores: { adaptability: 3 } }
    ]
  },

  // === FUTURE (4 questions) ===
  {
    id: "five_year",
    section: "future",
    title: "Where do you want to be in 5 years?",
    insight: 'By 2030, 70% of workplace skills will change because of AI. People with a clear direction can use AI to accelerate toward their goals. Those without one risk being swept along by default — the "safe" choice of staying still is becoming the riskiest strategy.<div class="source">— BusinessWorld, Feb 2026; Forbes Career Strategy</div>',
    options: [
      { text: "Leading a team, department, or organization", scores: { leadership: 4 } },
      { text: "Recognized as a deep technical expert or thought leader", scores: { technical: 4 } },
      { text: "Running my own business, consultancy, or freelance practice", scores: { adaptability: 2, leadership: 2 } },
      { text: "Doing meaningful work with more autonomy and impact", scores: { creative: 1, humanEdge: 1, adaptability: 1 } },
      { text: "Working in a completely different field than today", scores: { adaptability: 3 } },
      { text: "Honestly, I'm still figuring that out", scores: { adaptability: 1 } }
    ]
  },
  {
    id: "ai_invest",
    section: "future",
    title: "How much time are you willing to invest in AI-related learning?",
    insight: 'IDC predicts that by 2026, over 90% of organizations worldwide will feel the pain of the IT skills crisis, amounting to $5.5 trillion in losses. The demand for AI-skilled professionals far outstrips supply — even modest investment in AI learning creates outsized career returns.<div class="source">— IDC Survey 2024; ManageEngine, "The Future of Workforce Reskilling"</div>',
    options: [
      { text: "Significant — I'd dedicate several hours per week", scores: { aiReadiness: 3, adaptability: 2 } },
      { text: "Moderate — a few hours per month, consistently", scores: { aiReadiness: 2, adaptability: 1 } },
      { text: "Minimal — only if directly relevant to my current job", scores: { aiReadiness: 1 } },
      { text: "None right now — I have other priorities", scores: {} }
    ]
  },
  {
    id: "risk_tolerance",
    section: "future",
    title: "How do you feel about career risk?",
    insight: 'Calculated career moves — even lateral ones — build the adaptability that the AI era demands. The WEF reports that 40% of job skills will change by 2030, making intentional career planning more important than ever.<div class="source">— WEF Future of Jobs Report; Forbes Career Strategy, 2026</div>',
    options: [
      { text: "I seek out bold career moves", scores: { adaptability: 3, leadership: 1 } },
      { text: "I take calculated risks when the upside is clear", scores: { adaptability: 2 } },
      { text: "I prefer steady, incremental progression", scores: { humanEdge: 1 } },
      { text: "Stability is my top priority right now", scores: { adaptability: -1 } }
    ]
  },
  {
    id: "biggest_concern",
    section: "future",
    title: "What's your biggest concern about AI and your career?",
    insight: 'Research shows that people who channel AI-related concern into action — learning, experimenting, networking — consistently outperform those who either ignore AI or become paralyzed by uncertainty.<div class="source">— Deloitte Human Capital Trends; Forbes Career Strategy, 2026</div>',
    options: [
      { text: "My current skills becoming obsolete", scores: { adaptability: 1 } },
      { text: "Not knowing which AI skills to invest in", scores: { aiReadiness: 1 } },
      { text: "AI replacing my specific role or function", scores: {} },
      { text: "Falling behind peers who adopt AI faster", scores: { adaptability: 1, aiReadiness: 1 } },
      { text: "Ethical concerns about AI in my industry", scores: { humanEdge: 3 } },
      { text: "I'm not particularly concerned — I see mostly opportunity", scores: { aiReadiness: 2, adaptability: 1 } }
    ]
  }
];
