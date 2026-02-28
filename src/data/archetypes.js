// 5-level AI adoption archetypes — progression model

const ARCHETYPES = {
  tourist: {
    name: "AI Tourist",
    emoji: "🌱",
    level: 1,
    desc: "You've stepped into the AI era, but you're still exploring what it can really do. That's not a weakness — it means you have low overconfidence and massive room to grow. The best part? Even small steps from here create outsized returns.",
    strengths: ["Open to new technology", "Low overconfidence — you won't over-rely on AI", "Learns by observation before committing"],
    blindSpot: "You ask AI for answers — but not yet for thinking. The shift from 'what is X?' to 'how should I approach X?' is your biggest unlock.",
    actions: [
      { what: "Ask AI 'how' instead of 'what'", how: "Next time you'd Google something, ask AI: 'How should I approach [problem]?' instead of 'What is [thing]?' This one shift changes everything." },
      { what: "Use AI for one real task this week", how: "Pick something you actually need to do — draft an email, summarize a document, plan a project. Use AI for it. The goal isn't perfection, it's getting started." },
      { what: "Spend 30 minutes exploring one AI tool", how: "Pick ChatGPT, Claude, or Gemini. Ask it 10 different things. Try to break it. Try to impress yourself. Curiosity is the only prerequisite." }
    ],
    nextLevel: "Start asking AI to plan and structure your thinking, not just answer questions. When you catch yourself reusing a prompt, you're entering Explorer territory.",
    resources: {
      people: ["Ethan Mollick (Wharton — practical AI for beginners)", "Andrej Karpathy (YouTube — AI concepts explained clearly)", "Tina Huang (YouTube — AI productivity)"],
      books: ["Mindset by Carol Dweck — the growth mindset you need right now", "Atomic Habits by James Clear — small steps compound fast", "The Alchemist by Paulo Coelho — courage to start a new path"],
      articles: ["How to Use AI to Do Stuff — Ethan Mollick's practical guide", "AI Won't Replace You. A Person Using AI Will — Harvard Business Review"]
    }
  },
  explorer: {
    name: "Prompt Explorer",
    emoji: "🧭",
    level: 2,
    desc: "You've discovered that better questions create better AI. You use AI regularly and see real productivity gains. Your next evolution is moving from clever prompts to reusable systems — because systems scale, individual prompts don't.",
    strengths: ["Learns quickly through experimentation", "Comfortable iterating with AI", "Beginning real collaboration with AI"],
    blindSpot: "You optimize individual prompts instead of optimizing workflows. Each great prompt is a one-off win. Converting them into templates makes them permanent wins.",
    actions: [
      { what: "Save and organize your best prompts", how: "Create a simple doc or folder. Every time a prompt works well, save it with a label (writing, analysis, planning). After 2 weeks you'll have a personal AI toolkit." },
      { what: "Try using AI for a task you think it can't do", how: "Pick something you assume requires human judgment. Give AI detailed context and constraints. You'll be surprised how often it gets 80% there — and that 80% saves you hours." },
      { what: "Build one reusable template", how: "Take your most-used prompt. Add a system instruction, examples of good output, and format requirements. Test it 5 times. You now have a tool, not just a prompt." }
    ],
    nextLevel: "When you stop writing prompts from scratch and start maintaining a library of templates, you're becoming a Workflow Hacker.",
    resources: {
      people: ["Simon Willison (blog — practical AI tools & workflows)", "Dan Shipper (Every — AI for knowledge workers)", "Lenny Rachitsky (Lenny's Podcast — AI in product/business)"],
      books: ["Thinking, Fast and Slow by Daniel Kahneman — better decision-making with AI", "Antifragile by Nassim Taleb — thriving in chaos and uncertainty", "Range by David Epstein — why generalists thrive"],
      articles: ["Building Effective Agents — Anthropic's guide to agent design", "Prompt Engineering Guide — comprehensive techniques"]
    }
  },
  hacker: {
    name: "Workflow Hacker",
    emoji: "⚙️",
    level: 3,
    desc: "You don't just use AI — you shape how work flows through it. You have templates, structured processes, and AI integrated into your daily work. This is the power-user sweet spot, and most people plateau here. Your next evolution: making workflows that run without you.",
    strengths: ["Strong process thinking", "High productivity gains from AI", "Fast adaptation to new tools"],
    blindSpot: "Manual coordination still limits your scaling. You're the bottleneck in your own workflows. The jump to self-running systems is your biggest leverage point.",
    actions: [
      { what: "Identify your most repeated workflow and automate one step", how: "Map your top 3 recurring tasks. Pick the most repetitive step in each. Use an automation tool to handle just that one step. Small automation compounds fast." },
      { what: "Add output verification to your AI workflows", how: "For your most important AI-assisted work, create a simple checklist: Does it meet X criteria? Is Y accurate? This 'quality gate' is what separates professional AI use from casual use." },
      { what: "Teach someone else your best workflow", how: "Pick one workflow that saves you significant time. Write it up or demo it for a colleague. Teaching forces you to systematize — and builds your reputation as the AI person." }
    ],
    nextLevel: "When your workflows start running with minimal intervention — when you're designing systems, not executing steps — you're becoming an AI Operator.",
    resources: {
      people: ["Swyx (Latent Space podcast — AI engineering)", "Matt Wolfe (YouTube — AI tools for creators)", "Riley Brown (YouTube — AI agents & automation)"],
      books: ["The Creative Act by Rick Rubin — creativity principles that transcend tools", "Meditations by Marcus Aurelius — calm amid external chaos", "Steal Like an Artist by Austin Kleon — creative process in any era"],
      articles: ["What I Think About When I Think About AI Agents — Simon Willison", "The AI-Augmented Creative — how top professionals use AI"]
    }
  },
  operator: {
    name: "AI Operator",
    emoji: "🧠",
    level: 4,
    desc: "You see AI as infrastructure, not software. You think in pipelines, evaluate tools strategically, and design workflows intentionally. You understand AI's limitations as well as its capabilities. Your challenge now: reliability and simplification.",
    strengths: ["Systems mindset — you think in pipelines", "High-leverage thinking", "Early agent intuition"],
    blindSpot: "You may overbuild instead of simplifying. The best systems are the simplest ones that work reliably. Focus on reliability and evaluation — not just capability.",
    actions: [
      { what: "Build a validation process for your most critical AI workflow", how: "Create evaluation criteria, test cases, and a scoring rubric. Run your AI workflow against them. This is what production-grade AI looks like — and it's what companies pay premium for." },
      { what: "Design one workflow that works for your team, not just you", how: "Take your best personal workflow and make it team-ready: clear instructions, example inputs/outputs, error handling. Deploy it. You're now building organizational capability." },
      { what: "Experiment with AI agents for a real task", how: "Pick a multi-step task. Build an agent that plans the steps, executes them with tool calls, and reports results. Even a simple agent teaches you the future of AI work." }
    ],
    nextLevel: "When you're building tools and systems that other people use — when you're designing human-AI collaboration, not just using it — you're becoming a System Architect.",
    resources: {
      people: ["Andrew Ng (DeepLearning.AI — AI strategy)", "Cassie Kozyrkov (Google — decision intelligence)", "Matt Shumer (X/Twitter — AI product building)"],
      books: ["The Art of War by Sun Tzu — strategy under uncertainty", "Principles by Ray Dalio — decision-making frameworks", "The Obstacle Is the Way by Ryan Holiday — turning challenges into advantages"],
      articles: ["AI Strategy for Leaders — Harvard Business Review", "The CEO's Guide to AI — McKinsey"]
    }
  },
  architect: {
    name: "System Architect",
    emoji: "🏗️",
    level: 5,
    desc: "You don't adapt to AI tools — you shape how AI works. You think in automation, APIs, and human-AI collaboration design. You're operating ahead of mainstream workflows. Your challenge now: making your systems usable by humans who think differently than you.",
    strengths: ["Builder instinct — you create, not just use", "Strategic vision for AI integration", "High future readiness"],
    blindSpot: "Others may struggle to follow your mental model. The next challenge isn't building systems — it's making them accessible and maintainable by people who aren't you.",
    actions: [
      { what: "Deploy something real that others use", how: "Ship an AI-powered tool, workflow, or service to real users — even if it's just your team. The gap between 'built for myself' and 'built for others' is where the deepest learning happens." },
      { what: "Build evaluation and monitoring into your systems", how: "Add automated quality checks, usage tracking, and failure detection. Reliable systems that self-monitor are 10x more valuable than clever systems that break silently." },
      { what: "Teach and share your approach", how: "Write about your systems, open-source a tool, or mentor someone. The AI builder community is small — visibility compounds faster than skill alone. Aim for one share per month." }
    ],
    nextLevel: "You're at the frontier. Your growth now comes from depth (reliability, evaluation, governance) and breadth (teaching others, building community, shaping how organizations adopt AI).",
    resources: {
      people: ["Andrej Karpathy (YouTube — AI concepts explained clearly)", "Simon Willison (blog — practical AI tools & agents)", "Sam Altman (OpenAI — where AI is heading)"],
      books: ["Antifragile by Nassim Taleb — building systems that thrive in chaos", "The Creative Act by Rick Rubin — creativity beyond tools", "Designing Your Life by Burnett & Evans — intentional career design"],
      articles: ["Building Effective Agents — Anthropic's guide", "Why Taste Is the Last Moat — on human curation in the AI era"]
    }
  }
};
