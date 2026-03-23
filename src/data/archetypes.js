// 7-level AI adoption archetypes — progression model
// Based on: 工具体验者 → Prompt使用者 → AI合作者 → 工作流设计者 → 系统构建者 → 组织放大者 → 生态构建者

const ARCHETYPES = {
  dabbler: {
    name: "Tool Dabbler",
    emoji: "👀",
    level: 0,
    desc: "You're just starting to explore AI tools — trying things out, asking basic questions, generating simple content. This is a valid starting point with massive upside. Every small step from here creates outsized returns.",
    strengths: ["Low overconfidence — you won't over-rely on AI", "Fresh perspective unbiased by tool habits", "High growth potential from any small investment"],
    blindSpot: "You haven't experienced what AI can actually do for you yet. One real task will change your mental model more than any article.",
    actions: [
      { what: "Try one real task with AI this week", how: "Pick something you actually need to do — draft an email, summarize a document, plan a project. Use AI for it. The goal isn't perfection, it's getting started." },
      { what: "Ask AI 'how' instead of 'what'", how: "Instead of 'What is X?', try 'How should I approach X?' This one shift changes everything." },
      { what: "Spend 30 minutes exploring", how: "Pick ChatGPT, Claude, or Gemini. Ask it 10 different things. Try to break it. Curiosity is the only prerequisite." }
    ],
    nextLevel: "Use AI for one real task. When you find yourself going back to it voluntarily, you've crossed into Prompt User territory.",
    resources: {
      people: ["Ethan Mollick (Wharton — practical AI for beginners)", "Andrej Karpathy (YouTube — AI concepts explained clearly)", "Tina Huang (YouTube — AI productivity)"],
      books: ["Mindset by Carol Dweck — the growth mindset you need right now", "Atomic Habits by James Clear — small steps compound fast", "The Alchemist by Paulo Coelho — courage to start a new path"],
      articles: ["How to Use AI to Do Stuff — Ethan Mollick's practical guide", "AI Won't Replace You. A Person Using AI Will — Harvard Business Review"]
    }
  },
  prompter: {
    name: "Prompt User",
    emoji: "✏️",
    level: 1,
    desc: "You've moved beyond basic questions. You're learning to write clearer, more structured prompts — setting roles, defining output formats, getting better results. The shift from 'asking questions' to 'directing AI thinking' is your biggest unlock.",
    strengths: ["Open to new technology", "Learning by observation before committing", "Beginning to see AI's practical value"],
    blindSpot: "You ask AI for answers — but not yet for structured thinking. The shift from 'what is X?' to 'how should I approach X as a [role]?' is your biggest unlock.",
    actions: [
      { what: "Write structured prompts with role + context + format", how: "Instead of vague questions, try: 'You are a [role]. Given [context], help me [task]. Output as [format].' This formula transforms results." },
      { what: "Use AI for one real task every day this week", how: "Pick something you actually need to do. Use AI for it. Build the habit of reaching for AI first." },
      { what: "Save your best prompts", how: "When something works well, copy it to a note. After a week you'll have the start of a personal toolkit." }
    ],
    nextLevel: "Start asking AI to plan and structure your thinking. When you find yourself iterating back and forth with AI, you're entering Collaborator territory.",
    resources: {
      people: ["Ethan Mollick (Wharton — practical AI for beginners)", "Andrej Karpathy (YouTube — AI concepts explained clearly)", "Tina Huang (YouTube — AI productivity)"],
      books: ["Mindset by Carol Dweck — the growth mindset you need right now", "Atomic Habits by James Clear — small steps compound fast", "The Alchemist by Paulo Coelho — courage to start a new path"],
      articles: ["How to Use AI to Do Stuff — Ethan Mollick's practical guide", "AI Won't Replace You. A Person Using AI Will — Harvard Business Review"]
    }
  },
  collaborator: {
    name: "AI Collaborator",
    emoji: "🤝",
    level: 2,
    desc: "You treat AI as a thinking partner. You brainstorm, iterate, and refine ideas through multi-turn dialogue. You use AI to challenge your thinking, explore alternatives, and optimize solutions. Systems scale — individual prompts don't.",
    strengths: ["Learns quickly through experimentation", "Comfortable iterating with AI", "Beginning real collaboration — using AI to critique and refine ideas"],
    blindSpot: "You optimize individual conversations instead of workflows. Each great dialogue is a one-off win. Converting your best patterns into reusable templates makes them permanent.",
    actions: [
      { what: "Use AI to critique your own work", how: "Share a draft, plan, or idea with AI and ask 'What are the weaknesses? What am I missing?' Iterative dialogue beats one-shot prompts." },
      { what: "Build one reusable template", how: "Take your most-used prompt pattern. Add a system instruction, examples of good output, and format requirements. Test it 5 times." },
      { what: "Try AI for a task you think it can't do", how: "Pick something you assume requires human judgment. Give AI detailed context and constraints. You'll be surprised how often it gets 80% there." }
    ],
    nextLevel: "When you stop writing prompts from scratch and start designing repeatable workflows, you're becoming a Workflow Designer.",
    resources: {
      people: ["Simon Willison (blog — practical AI tools & workflows)", "Dan Shipper (Every — AI for knowledge workers)", "Lenny Rachitsky (Lenny's Podcast — AI in product/business)"],
      books: ["Thinking, Fast and Slow by Daniel Kahneman — better decision-making with AI", "Antifragile by Nassim Taleb — thriving in chaos and uncertainty", "Range by David Epstein — why generalists thrive"],
      articles: ["Building Effective Agents — Anthropic's guide to agent design", "Prompt Engineering Guide — comprehensive techniques"]
    }
  },
  designer: {
    name: "Workflow Designer",
    emoji: "🔀",
    level: 3,
    desc: "You break complex tasks into multi-step flows and design how AI participates at each stage. You use tools like Notion AI, Make, Zapier, or Midjourney as part of larger creative or operational workflows. Process thinking is your superpower.",
    strengths: ["Strong process thinking", "Designs end-to-end workflows with AI", "Bridges tools into coherent systems"],
    blindSpot: "Manual coordination still limits your scaling. You're the bottleneck in your own workflows. The jump from designed workflows to automated ones is your biggest leverage point.",
    actions: [
      { what: "Map your top workflow end-to-end", how: "Draw out every step in your most important AI workflow. Identify which steps are manual coordination vs. actual thinking. The manual parts are automation candidates." },
      { what: "Add output verification to your AI workflows", how: "For your most important AI-assisted work, create a simple checklist: Does it meet X criteria? Is Y accurate? This 'quality gate' separates professional AI use from casual use." },
      { what: "Teach someone else your best workflow", how: "Pick one workflow that saves you significant time. Write it up or demo it. Teaching forces you to systematize — and builds your reputation." }
    ],
    nextLevel: "When you start automating steps instead of just designing them — when AI runs parts of your workflow without you — you're becoming an Automation Builder.",
    resources: {
      people: ["Simon Willison (blog — practical AI tools & workflows)", "Dan Shipper (Every — AI for knowledge workers)", "Lenny Rachitsky (Lenny's Podcast — AI in product/business)"],
      books: ["Thinking, Fast and Slow by Daniel Kahneman — better decision-making with AI", "Antifragile by Nassim Taleb — thriving in chaos and uncertainty", "Range by David Epstein — why generalists thrive"],
      articles: ["Building Effective Agents — Anthropic's guide to agent design", "Prompt Engineering Guide — comprehensive techniques"]
    }
  },
  system_builder: {
    name: "System Builder",
    emoji: "⚙️",
    level: 4,
    desc: "You build and operate AI-powered systems — using APIs, scripts, agents, or automation platforms. You engineer how AI runs, not just what it does. Your systems handle real work autonomously, with monitoring and quality gates. You think in loops: plan, act, check, retry.",
    strengths: ["Technical integration and automation skills", "Systems mindset — thinks in autonomous loops", "Builds reliable AI pipelines, not just one-off prompts"],
    blindSpot: "You may overbuild for capability instead of simplifying for reliability. The systems you create work for you but may break for others or at scale. Making systems simple, documented, and accessible to others is your next unlock.",
    actions: [
      { what: "Automate one complete workflow end-to-end", how: "Take a multi-step process and automate it fully: input → AI processing → output → delivery. Use APIs, scripts, or no-code tools. One automated workflow teaches more than ten manual ones." },
      { what: "Add evaluation and monitoring to your systems", how: "Build in quality gates: eval criteria, test cases, output validation, logging, and alerts for quality drops. Systems without monitoring are liabilities, not assets." },
      { what: "Document your system for someone else to run", how: "Write up your automated workflow so a colleague could operate it. If only you can run it, it's a toy, not a system. Simplify until someone else can maintain it." }
    ],
    nextLevel: "When you start building AI systems for your team or organization — not just yourself — you're becoming an Org Amplifier.",
    resources: {
      people: ["Swyx (Latent Space podcast — AI engineering)", "Andrew Ng (DeepLearning.AI — AI strategy)", "Riley Brown (YouTube — AI agents & automation)"],
      books: ["The Creative Act by Rick Rubin — creativity principles that transcend tools", "Principles by Ray Dalio — decision-making frameworks", "The Obstacle Is the Way by Ryan Holiday — turning challenges into advantages"],
      articles: ["What I Think About When I Think About AI Agents — Simon Willison", "Building Effective Agents — Anthropic's guide to agent design"]
    }
  },
  amplifier: {
    name: "Org Amplifier",
    emoji: "📡",
    level: 5,
    desc: "You use AI to restructure how your team or organization works. You design AI-powered processes, train colleagues, build shared AI infrastructure, and make AI a core part of organizational productivity. Your impact scales beyond yourself.",
    strengths: ["Organizational design thinking", "Builds AI capability in others", "Designs systems that work for teams, not just individuals"],
    blindSpot: "Your systems may reflect your mental model too strongly. The next challenge is making AI systems accessible to people who think differently than you — and measuring organizational impact.",
    actions: [
      { what: "Deploy an AI workflow that your team uses daily", how: "Ship an AI-powered tool, workflow, or service to real users — even if it's just your team. The gap between 'built for myself' and 'built for others' is where the deepest learning happens." },
      { what: "Build an AI training program for your team", how: "Create a structured onboarding path: templates, best practices, common pitfalls. Run workshops or office hours. Your leverage is making others more capable." },
      { what: "Measure and report AI impact", how: "Track time saved, quality improvements, or revenue impact from AI adoption in your team. Numbers make the case for further investment and expansion." }
    ],
    nextLevel: "When you're building AI products, platforms, or infrastructure that serve users beyond your organization — you're becoming an Ecosystem Builder.",
    resources: {
      people: ["Andrew Ng (DeepLearning.AI — AI strategy)", "Cassie Kozyrkov (Google — decision intelligence)", "Matt Shumer (X/Twitter — AI product building)"],
      books: ["The Art of War by Sun Tzu — strategy under uncertainty", "Principles by Ray Dalio — decision-making frameworks", "The Obstacle Is the Way by Ryan Holiday — turning challenges into advantages"],
      articles: ["AI Strategy for Leaders — Harvard Business Review", "The CEO's Guide to AI — McKinsey"]
    }
  },
  visionary: {
    name: "Ecosystem Builder",
    emoji: "🏗️",
    level: 6,
    desc: "You build AI infrastructure, train frontier models, or shape the AI ecosystem itself. You're not just using AI or building products with it — you're creating the foundations that others build on. Whether it's contributing to open-source AI frameworks, developing foundational models, building AI platforms at scale, or defining how industries adopt AI — you operate at the ecosystem level.",
    strengths: ["Ecosystem-level thinking — builds foundations others rely on", "Deep technical and strategic vision", "Shapes how industries and communities interact with AI"],
    blindSpot: "Operating at the frontier requires balancing innovation speed with governance, safety, and accessibility. The hardest challenge isn't building cutting-edge systems — it's ensuring they're trustworthy, equitable, and sustainable at scale.",
    actions: [
      { what: "Build or contribute to AI infrastructure", how: "Work on foundational models, training pipelines, evaluation frameworks, or open-source AI tools. The ecosystem needs builders who think beyond products to platforms and standards." },
      { what: "Define governance and safety standards", how: "Develop evaluation benchmarks, safety protocols, or compliance frameworks. As AI scales, the people who build trust into the infrastructure become indispensable." },
      { what: "Shape the ecosystem through community", how: "Publish research, mentor the next generation of AI builders, contribute to open standards, or build community infrastructure. Your leverage is making the entire ecosystem stronger." }
    ],
    nextLevel: "You're at the frontier. Your growth comes from pushing the boundaries of what's possible while ensuring AI develops responsibly — through infrastructure, governance, and ecosystem leadership.",
    resources: {
      people: ["Andrej Karpathy (YouTube — AI concepts explained clearly)", "Simon Willison (blog — practical AI tools & agents)", "Sam Altman (OpenAI — where AI is heading)"],
      books: ["Antifragile by Nassim Taleb — building systems that thrive in chaos", "The Creative Act by Rick Rubin — creativity beyond tools", "Designing Your Life by Burnett & Evans — intentional career design"],
      articles: ["Building Effective Agents — Anthropic's guide", "Why Taste Is the Last Moat — on human curation in the AI era"]
    }
  }
};
