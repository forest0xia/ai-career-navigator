// Archetypes with practical guidance and recommended resources

const ARCHETYPES = {
  aiArchitect: {
    name: "The AI Builder",
    emoji: "🏗️",
    desc: "You're technically strong and excited about building with AI — not necessarily building AI itself. You want to create AI-powered products, automate complex workflows, and push the boundaries of what's possible with agents and tools.",
    actions: [
      { what: "Build AI-powered applications and automations that solve real problems", how: "Pick a pain point in your work or life. Build a solution using AI APIs and agent frameworks — a smart assistant, an automated pipeline, a data analysis tool. Ship it to real users, even if it's just your team." },
      { what: "Master AI agent orchestration — the hottest skill in tech right now", how: "Learn to chain AI calls, connect tools, handle errors, and build reliable multi-step workflows. Build one agent that does something useful end-to-end. This is what companies are hiring for." },
      { what: "Develop your AI evaluation skills — knowing when AI output is good enough", how: "Build systematic ways to test AI output quality. Create rubrics, test suites, or comparison frameworks. The ability to evaluate AI reliably is rare and extremely valuable." },
      { what: "Share what you build — visibility compounds faster than skill alone", how: "Write about your projects, demo them publicly, or open-source them. Even short posts about what worked and what didn't attract opportunities. Aim for one share per month." },
      { what: "Stay current with the AI tool landscape — it changes monthly", how: "Follow AI news sources and try new tools as they launch. Dedicate 1-2 hours per week to experimentation. The best builders are the ones who know what's possible right now." }
    ],
    skills: [
      { name: "AI Agent Development", detail: "Build autonomous AI systems that chain multiple steps — tool calls, API integrations, error handling, memory. Start with a simple agent that does one useful thing, then add complexity. This is the #1 hiring skill in AI right now." },
      { name: "Prompt Engineering & Design", detail: "Craft precise instructions that get reliable AI outputs. Learn system prompts, few-shot examples, chain-of-thought, and structured output formats. Good prompts are the difference between toy demos and production systems." },
      { name: "API Integration & Automation", detail: "Connect AI models to real-world systems — databases, APIs, file systems, messaging. Learn to handle rate limits, errors, and async workflows. This turns AI from a chatbox into a tool that does real work." },
      { name: "AI Output Evaluation", detail: "Systematically judge whether AI output is good enough for your use case. Build rubrics, test suites, and comparison frameworks. Most people can't do this well — it's rare and extremely valuable." },
      { name: "Product Thinking with AI", detail: "Identify problems worth solving with AI, design user experiences around AI capabilities and limitations, and ship products people actually use. The best AI builders think product-first, technology-second." },
      { name: "Rapid Prototyping", detail: "Go from idea to working demo in hours, not weeks. Use AI coding tools, no-code platforms, and pre-built components. Speed of iteration is your competitive advantage — ship fast, learn fast." }
    ],
    roles: [
      { name: "AI Application Developer", detail: "Build end-user applications powered by AI — chatbots, content tools, analysis dashboards, automation systems. You own the full stack from prompt design to deployment. High demand across every industry." },
      { name: "AI Solutions Engineer", detail: "Help organizations implement AI by designing custom solutions that fit their workflows. Requires both technical depth and the ability to understand business problems. Often client-facing." },
      { name: "AI Automation Specialist", detail: "Design and build automated workflows that use AI to handle repetitive tasks — document processing, data extraction, report generation, email triage. Focus on reliability and ROI." },
      { name: "AI Product Builder", detail: "Combine product management with hands-on building. Define what to build, prototype it yourself, test with users, iterate. Startups and innovation teams need people who can do both." },
      { name: "Technical AI Consultant", detail: "Advise companies on AI strategy and implementation. Requires broad knowledge of AI tools, architectures, and best practices. High earning potential, especially with domain expertise." },
      { name: "AI Agent Developer", detail: "Specialize in building multi-step AI agents that can plan, use tools, and complete complex tasks autonomously. The newest and fastest-growing role in AI engineering." }
    ],
    resources: {
      people: ["Andrej Karpathy (YouTube — AI concepts explained clearly)", "Simon Willison (blog — practical AI tools & agents)", "Swyx (Latent Space podcast — AI engineering)", "Riley Brown (YouTube — AI agents & automation)", "Matt Shumer (X/Twitter — AI product building)"],
      books: ["Antifragile by Nassim Taleb — thriving in chaos and uncertainty", "The Obstacle Is the Way by Ryan Holiday — turning challenges into advantages", "Mindset by Carol Dweck — the growth mindset that builders need"],
      articles: ["Building Effective Agents — Anthropic's guide to agent design", "What I Think About When I Think About AI Agents — Simon Willison"]
    }
  },
  aiCollaborator: {
    name: "The AI Collaborator",
    emoji: "🤝",
    desc: "You're not building AI — you're mastering how to work with it to amplify your existing expertise. This is the largest and fastest-growing career profile. Your edge comes from combining deep domain knowledge with AI fluency.",
    actions: [
      { what: "Become the AI go-to person in your team", how: "Pick the best AI tool for your specific work. Use it intensively for 2 weeks. Then show your team 3 workflows it improved. Being the person who helps others adopt AI is a career accelerator." },
      { what: "Build a personal AI workflow library for your domain", how: "Document your best prompts, templates, and AI-assisted processes. Organize by task type. Share with your team. This becomes your competitive advantage and makes you indispensable." },
      { what: "Track and quantify your AI-augmented results", how: "Keep a simple log: task, time without AI, time with AI, quality difference. After a month, you'll have concrete data for performance reviews and interviews." },
      { what: "Automate the repetitive parts of your work", how: "Identify one task you do weekly that's tedious. Use an AI automation tool to handle it. Start simple, expand as you see results. Even saving 2 hours/week compounds to 100+ hours/year." },
      { what: "Develop your AI judgment — knowing when to trust AI and when not to", how: "Pay attention to where AI helps and where it fails in your domain. Document the patterns. This 'AI taste' is what separates effective users from everyone else." }
    ],
    skills: [
      { name: "Prompt Engineering", detail: "Write prompts that get consistent, high-quality results for your specific work. Build a personal library of templates organized by task type. Good prompting is the single highest-ROI AI skill for non-technical professionals." },
      { name: "AI Workflow Design", detail: "Map your work processes and identify where AI fits in. Design end-to-end workflows that combine human judgment with AI speed. Document and share these — they become your team's competitive advantage." },
      { name: "Domain-Specific AI Application", detail: "Apply AI tools to your specific field's problems — legal research, financial analysis, marketing copy, customer support. Domain experts who know AI outperform AI generalists every time." },
      { name: "AI Output Quality Judgment", detail: "Develop the 'taste' to know when AI output is good enough and when it needs human editing. This requires deep domain knowledge plus understanding of AI failure modes. It's what separates effective AI users from everyone else." },
      { name: "Change Management & AI Adoption", detail: "Help your team and organization adopt AI tools effectively. Address resistance, design training, measure impact. People who can drive AI adoption are career accelerators — every company needs them." }
    ],
    roles: [
      { name: "AI-Enhanced [Your Current Role]", detail: "Your current job title, but you're 2-5x more productive because you've integrated AI into your daily workflow. This is the most common and immediate path — no job change needed, just skill upgrade." },
      { name: "AI Workflow Specialist", detail: "Design and optimize AI-powered workflows for teams. You understand both the tools and the human processes, and you bridge the gap. Growing demand as companies move past experimentation." },
      { name: "AI Adoption Champion", detail: "Lead AI adoption within your organization — training, tool selection, best practices, measuring ROI. Often an informal role that becomes formal as companies realize they need it." },
      { name: "AI-Powered Consultant", detail: "Use AI to deliver consulting work faster and at higher quality — research, analysis, presentations, recommendations. AI-augmented consultants can handle 3x the workload with better output." },
      { name: "Digital Transformation Lead", detail: "Guide organizations through AI-driven transformation. Requires understanding of technology, change management, and business strategy. Senior role with high impact and compensation." }
    ],
    resources: {
      people: ["Ethan Mollick (Wharton — practical AI for professionals)", "Lenny Rachitsky (Lenny's Podcast — AI in product/business)", "Dan Shipper (Every — AI for knowledge workers)", "Tina Huang (YouTube — AI productivity)", "Sahil Lavingia (X/Twitter — AI for entrepreneurs)"],
      books: ["Man's Search for Meaning by Viktor Frankl — finding purpose amid change", "Thinking, Fast and Slow by Daniel Kahneman — better decision-making", "Atomic Habits by James Clear — building the learning habits that compound"],
      articles: ["How to Use AI to Do Stuff — Ethan Mollick's practical guide", "Why AI Will Save the World — Marc Andreessen"]
    }
  },
  humanEdge: {
    name: "The Human Edge Specialist",
    emoji: "💎",
    desc: "Your greatest strengths are distinctly human — empathy, relationships, judgment, and nuanced communication. As AI handles routine work, these skills become more valuable, not less. Your path is about doubling down on what makes you irreplaceable while building enough AI literacy to stay effective.",
    actions: [
      { what: "Deepen your expertise in areas that require trust and human judgment", how: "Identify the 2-3 decisions in your role that need the most nuanced judgment. Document your decision-making framework. This makes your expertise visible and transferable." },
      { what: "Learn AI well enough to know its limits — you'll be the quality check", how: "Take a free introductory AI course (6 hours, no coding). Focus on understanding where AI fails — hallucinations, bias, missing context. Your role is to catch what AI misses." },
      { what: "Position yourself at the human-AI boundary", how: "Volunteer to review AI-generated content or decisions in your team. Build a checklist of common AI errors in your domain. This 'AI quality assurance' role is emerging and high-value." },
      { what: "Build your personal brand around human skills", how: "Share real examples of where human judgment mattered more than AI in your field. Speak at team meetings or write about the human side of AI adoption. Authentic stories resonate." },
      { what: "Don't ignore AI — use it to amplify your human strengths", how: "Use AI for research, drafting, and preparation so you can spend more time on the high-judgment, high-relationship work that only you can do." }
    ],
    skills: [
      { name: "Emotional Intelligence", detail: "Read people, manage relationships, navigate conflict, and build trust. AI can analyze sentiment but can't genuinely empathize. As routine work gets automated, EQ becomes the primary differentiator in most roles." },
      { name: "Ethical Reasoning & AI Oversight", detail: "Evaluate AI decisions for fairness, bias, and unintended consequences. Every organization deploying AI needs people who can ask 'should we?' not just 'can we?'. This is a growing compliance and leadership need." },
      { name: "AI Literacy (for quality control)", detail: "Understand AI well enough to catch its mistakes — hallucinations, bias, missing context, confident-sounding wrong answers. You don't need to build AI, but you need to know where it fails in your domain." },
      { name: "Complex Negotiation & Persuasion", detail: "Handle high-stakes conversations where context, relationships, and reading the room matter. AI can draft talking points but can't navigate the human dynamics of a difficult negotiation." },
      { name: "Trust Building & Relationship Management", detail: "Build and maintain deep professional relationships over time. In a world of AI-generated everything, authentic human connection becomes the scarcest and most valuable resource." }
    ],
    roles: [
      { name: "AI Ethics Advisor", detail: "Guide organizations on responsible AI use — bias auditing, fairness frameworks, transparency policies. Demand is surging as regulations tighten and companies face public scrutiny over AI decisions." },
      { name: "Human-AI Interaction Designer", detail: "Design how humans and AI systems work together — interfaces, handoff points, escalation paths. Requires understanding both human psychology and AI capabilities. A new and growing field." },
      { name: "Client Relationship Lead", detail: "Own high-value client relationships where trust and judgment matter more than speed. As AI handles routine client work, the human relationship becomes the premium service layer." },
      { name: "AI Quality Reviewer", detail: "Review and validate AI-generated outputs before they reach customers or stakeholders. Requires deep domain expertise plus understanding of AI failure patterns. Critical role in regulated industries." },
      { name: "Change Management Consultant", detail: "Help organizations navigate the human side of AI adoption — resistance, reskilling, culture change. Technical implementation is the easy part; people change is where most AI projects fail." }
    ],
    resources: {
      people: ["Brené Brown (leadership & human connection)", "Adam Grant (WorkLife podcast — future of work)", "Lex Fridman (podcast — AI & humanity)", "Cal Newport (Deep Work — focus in an AI world)", "Joanna Maciejewska (X/Twitter — human creativity vs AI)"],
      books: ["Meditations by Marcus Aurelius — inner calm amid external chaos", "Emotional Intelligence 2.0 by Bradberry & Greaves — the skills AI can't replicate", "The Courage to Be Disliked by Kishimi & Koga — freedom from others' expectations"],
      articles: ["The Ones Who Walk Away from AI — on choosing the human path", "Why Soft Skills Are the New Hard Skills — LinkedIn"]
    }
  },
  strategicLeader: {
    name: "The Strategic Leader",
    emoji: "🧭",
    desc: "You combine leadership instincts with a forward-looking mindset. The AI era needs people who can see the big picture, make decisions under uncertainty, and guide teams through transformation. Your path is about leading the change, not just adapting to it.",
    actions: [
      { what: "Develop an AI strategy for your team — even informally", how: "Draft a 1-page plan: what AI tools your team should adopt, what skills to build, what to automate first. Share it with your manager. Even an informal plan positions you as a strategic thinker." },
      { what: "Build AI literacy across your team", how: "Organize a monthly 'AI Hour' where team members demo how they use AI. Rotate presenters. Create a shared channel for AI tips. Start small — even 3 people sharing builds momentum." },
      { what: "Learn to evaluate AI investments — the ROI conversation", how: "For your next AI-related project, create a simple cost-benefit analysis. Present it to leadership. This financial framing is what gets AI initiatives funded and gets you noticed." },
      { what: "Study AI governance and responsible AI principles", how: "Read your industry's AI guidelines. Draft a lightweight AI use policy for your team. Proactive governance builds trust and positions you as a thoughtful leader." },
      { what: "Build your network of AI-savvy leaders", how: "Join 2 AI-focused communities. Attend one AI event per quarter. Have 2 meaningful conversations per month with people working on AI in your field." }
    ],
    skills: [
      { name: "AI Strategy & Vision", detail: "See where AI is heading and what it means for your industry. Translate technical possibilities into business opportunities. Leaders who can articulate an AI vision attract talent, funding, and executive support." },
      { name: "Organizational Change Leadership", detail: "Guide teams through the uncertainty of AI transformation. Address fears, build excitement, create safe spaces to experiment. The #1 reason AI initiatives fail is people resistance, not technology." },
      { name: "AI ROI & Business Case Development", detail: "Quantify the value of AI investments — cost savings, revenue impact, productivity gains. Speak the language of CFOs and boards. This financial framing is what gets AI projects funded." },
      { name: "Cross-Functional Team Building", detail: "Build teams that combine technical AI skills with domain expertise, design thinking, and business acumen. The best AI outcomes come from diverse teams, not pure engineering groups." },
      { name: "AI Governance & Policy", detail: "Create frameworks for responsible AI use — data privacy, model oversight, decision accountability, vendor management. Proactive governance builds trust and prevents costly mistakes." }
    ],
    roles: [
      { name: "Head of AI Transformation", detail: "Lead your organization's AI strategy and execution. Own the roadmap, budget, team building, and stakeholder management. Requires both strategic vision and operational execution ability." },
      { name: "AI Strategy Director", detail: "Define where and how AI should be applied across the business. Evaluate opportunities, prioritize investments, and measure outcomes. Often reports to C-suite with significant organizational influence." },
      { name: "Chief AI Officer", detail: "C-level role responsible for the organization's entire AI agenda — strategy, governance, talent, partnerships. Emerging role that didn't exist 3 years ago. Requires breadth across technology, business, and ethics." },
      { name: "AI Program Manager", detail: "Coordinate multiple AI initiatives across teams. Manage timelines, dependencies, resources, and stakeholder expectations. The operational backbone that turns AI strategy into reality." },
      { name: "Innovation Lead", detail: "Identify and pilot new AI applications before competitors. Run experiments, measure results, and scale winners. Requires comfort with ambiguity and the ability to kill projects that don't work." }
    ],
    resources: {
      people: ["Satya Nadella (Microsoft — AI transformation leadership)", "Andrew Ng (DeepLearning.AI — AI strategy)", "Cassie Kozyrkov (Google — decision intelligence)", "Amy Webb (futurist — AI trends)", "Sam Altman (OpenAI — where AI is heading)"],
      books: ["The Art of War by Sun Tzu — strategy under uncertainty", "Principles by Ray Dalio — decision-making frameworks for leaders", "Who Moved My Cheese by Spencer Johnson — leading through change"],
      articles: ["AI Strategy for Leaders — Harvard Business Review", "The CEO's Guide to AI — McKinsey"]
    }
  },
  creativeInnovator: {
    name: "The Creative Innovator",
    emoji: "🎨",
    desc: "You bring creative thinking and originality to your work. AI is a powerful creative amplifier — it generates variations, handles production work, and expands your range. Your edge is taste, vision, and the ability to direct AI as a creative tool.",
    actions: [
      { what: "Master one AI creative tool deeply — go beyond casual use", how: "Pick the best AI tool for your medium. Use it daily for 30 days. Push its limits. By day 30, you'll have a portfolio and fluency that most creatives lack." },
      { what: "Develop a 'human + AI' creative workflow", how: "Map your creative process. Identify which stages AI can handle (usually drafting and variations). Keep ideation and final curation human. Document this workflow — it's your competitive advantage." },
      { what: "Focus on creative direction — the role that survives automation", how: "Practice giving AI detailed creative briefs. The skill of articulating vision clearly enough for AI to execute is essentially 'creative direction' — and it's the most valuable creative skill now." },
      { what: "Explore new formats that AI makes possible", how: "Build one experimental project: interactive content, personalized experiences, or generative art. Novel formats attract attention and demonstrate forward thinking." },
      { what: "Build a portfolio that showcases your AI-augmented process", how: "For each piece, explain your creative process, what AI contributed, and what you contributed. Transparency about AI use builds trust and demonstrates sophistication." }
    ],
    skills: [
      { name: "AI Creative Tool Mastery", detail: "Go deep on one AI creative tool — image generation, video, music, writing. Daily use for 30 days builds fluency most creatives lack. Know the tool's strengths, limits, and workarounds inside out." },
      { name: "Creative Direction & Curation", detail: "The ability to articulate a creative vision clearly enough for AI to execute. This is essentially 'creative direction' — and it's the most valuable creative skill in the AI era. Taste can't be automated." },
      { name: "AI-Augmented Storytelling", detail: "Use AI to expand your storytelling capabilities — generate variations, explore visual styles, create interactive narratives. The story and emotional arc remain human; AI handles production and exploration." },
      { name: "Generative Design Thinking", detail: "Think in terms of systems and variations rather than single outputs. Use AI to explore a design space rapidly, then curate the best results. This changes how you approach creative problems." },
      { name: "Taste & Quality Judgment", detail: "Know what's good. In a world where anyone can generate content, the ability to curate, refine, and select the best output becomes the ultimate creative skill. Taste is the last moat." }
    ],
    roles: [
      { name: "AI Creative Director", detail: "Direct AI tools to produce creative work that matches your vision. Manage the human + AI creative process end-to-end. The role shifts from 'making' to 'directing' — and the best directors command premium rates." },
      { name: "Generative Designer", detail: "Use AI to create visual designs, illustrations, and graphics at scale. Combine AI generation with human refinement. Growing demand in marketing, product design, and media." },
      { name: "AI Content Strategist", detail: "Plan and oversee AI-augmented content production — what to create, how to use AI, quality standards, brand consistency. Every content team needs someone who understands both strategy and AI tools." },
      { name: "Creative Technologist", detail: "Bridge the gap between creative vision and technical implementation. Build custom AI creative tools, workflows, and experiences. Rare combination of skills with high demand." },
      { name: "AI-Augmented Art Director", detail: "Use AI to rapidly prototype visual concepts, explore styles, and produce variations. Present polished concepts faster than traditional methods. The art director role evolves, not disappears." }
    ],
    resources: {
      people: ["Chase Reeves (YouTube — creativity & AI)", "Matt Wolfe (YouTube — AI tools for creators)", "Karen X. Cheng (Instagram — AI creative work)", "Refik Anadol (AI artist)", "Joanna Maciejewska (X/Twitter — AI & creativity)"],
      books: ["The Creative Act by Rick Rubin — creativity principles that transcend tools", "Steal Like an Artist by Austin Kleon — creative process in any era", "Flow by Mihaly Csikszentmihalyi — the psychology of optimal creative experience"],
      articles: ["The AI-Augmented Creative — how top creatives use AI", "Why Taste Is the Last Moat — on human curation"]
    }
  },
  careerPivot: {
    name: "The Career Reinventor",
    emoji: "🔄",
    desc: "You're at an inflection point — high adaptability signals readiness for change, and the AI era is creating entirely new career paths that didn't exist two years ago. This is an advantage: you can build AI-native skills from the ground up without legacy habits.",
    actions: [
      { what: "Take a structured AI foundations course", how: "Start with a free AI essentials certificate (self-paced, ~10 hours). This gives you vocabulary, concepts, and a credential — enough to speak credibly about AI in interviews." },
      { what: "Build 2-3 small AI projects to show capability", how: "Ideas: (1) A chatbot for a topic you know well. (2) An automated workflow for a real task. (3) An AI-enhanced analysis of data you care about. Simple projects show initiative." },
      { what: "Map your existing skills to AI-adjacent roles", how: "List your top 5 skills. Search job boards for roles combining each skill with 'AI'. Identify 3 target roles. Note the gaps and create a 90-day plan to close them." },
      { what: "Join AI communities for networking and learning", how: "Join 2-3 communities: Reddit, Discord, LinkedIn groups in your target field. Ask thoughtful questions and share your learning journey. Aim for 2 meaningful connections per week." },
      { what: "Consider 'bridge roles' that combine your expertise with AI", how: "Bridge roles are the fastest path: domain expert → AI trainer, teacher → AI curriculum designer, writer → AI content strategist, analyst → AI-augmented analyst. These value your existing knowledge." }
    ],
    skills: [
      { name: "AI Fundamentals & Literacy", detail: "Understand what AI can and can't do, how models work at a high level, and the key terminology. A 10-hour free course gives you enough to speak credibly in interviews and identify opportunities." },
      { name: "Rapid Prototyping", detail: "Build quick demos and proof-of-concepts using AI tools and no-code platforms. Even simple projects demonstrate initiative and capability. Aim for 2-3 small projects in your first 90 days." },
      { name: "Transferable Skill Mapping", detail: "Identify which of your existing skills translate directly to AI-adjacent roles. Domain expertise, communication, project management, and analytical thinking are all highly valued in AI teams." },
      { name: "Networking & Community Building", detail: "Connect with people already working in AI. Join communities, ask questions, share your learning journey. Most career pivots happen through relationships, not job applications." },
      { name: "Portfolio Development", detail: "Document everything you build and learn. A portfolio of small AI projects, blog posts about your learning journey, and documented results speaks louder than any certification." }
    ],
    roles: [
      { name: "AI Trainer / Evaluator", detail: "Train and evaluate AI models using your domain expertise. Companies need people who understand specific fields to judge AI quality. Fastest entry point — your existing knowledge is the qualification." },
      { name: "AI Product Manager", detail: "Define what AI products should do and how they should work. Requires understanding users, business goals, and AI capabilities — but not deep technical skills. High demand, high impact role." },
      { name: "AI-Enhanced [Target Role]", detail: "Your target role, but with AI skills that make you 2-5x more effective. This is often the easiest pivot — same domain, upgraded toolkit. Employers value domain expertise + AI fluency." },
      { name: "AI Consultant (domain expertise)", detail: "Advise companies on AI adoption in your area of expertise. Your deep domain knowledge is what AI teams lack. Freelance or full-time, this leverages everything you already know." },
      { name: "AI Content Strategist", detail: "Plan and manage AI-augmented content creation. Requires understanding of content strategy, audience, and AI tools. Writers, marketers, and communicators have a natural advantage here." }
    ],
    resources: {
      people: ["Andrew Ng (DeepLearning.AI — best AI educator)", "Ali Abdaal (YouTube — productivity & career change)", "Tina Huang (YouTube — tech career transitions)", "Cassie Kozyrkov (Google — making AI accessible)", "Greg Brockman (OpenAI — AI opportunity)"],
      books: ["Range by David Epstein — why generalists thrive in a specialized world", "Designing Your Life by Burnett & Evans — career pivoting framework", "The Alchemist by Paulo Coelho — courage to pursue a new path"],
      articles: ["How to Transition Into AI — practical career change roadmap", "The 100-Hour AI Upskilling Plan — structured learning path"]
    }
  }
};
