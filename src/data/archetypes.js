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
    skills: ["AI Agent Development", "Prompt Engineering & Design", "API Integration & Automation", "AI Output Evaluation", "Product Thinking with AI", "Rapid Prototyping"],
    roles: ["AI Application Developer", "AI Solutions Engineer", "AI Automation Specialist", "AI Product Builder", "Technical AI Consultant", "AI Agent Developer"],
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
    skills: ["Prompt Engineering", "AI Workflow Design", "Domain-Specific AI Application", "AI Output Quality Judgment", "Change Management & AI Adoption"],
    roles: ["AI-Enhanced [Your Current Role]", "AI Workflow Specialist", "AI Adoption Champion", "AI-Powered Consultant", "Digital Transformation Lead"],
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
    skills: ["Emotional Intelligence", "Ethical Reasoning & AI Oversight", "AI Literacy (for quality control)", "Complex Negotiation & Persuasion", "Trust Building & Relationship Management"],
    roles: ["AI Ethics Advisor", "Human-AI Interaction Designer", "Client Relationship Lead", "AI Quality Reviewer", "Change Management Consultant"],
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
    skills: ["AI Strategy & Vision", "Organizational Change Leadership", "AI ROI & Business Case Development", "Cross-Functional Team Building", "AI Governance & Policy"],
    roles: ["Head of AI Transformation", "AI Strategy Director", "Chief AI Officer", "AI Program Manager", "Innovation Lead"],
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
    skills: ["AI Creative Tool Mastery", "Creative Direction & Curation", "AI-Augmented Storytelling", "Generative Design Thinking", "Taste & Quality Judgment"],
    roles: ["AI Creative Director", "Generative Designer", "AI Content Strategist", "Creative Technologist", "AI-Augmented Art Director"],
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
    skills: ["AI Fundamentals & Literacy", "Rapid Prototyping", "Transferable Skill Mapping", "Networking & Community Building", "Portfolio Development"],
    roles: ["AI Trainer / Evaluator", "AI Product Manager", "AI-Enhanced [Target Role]", "AI Consultant (domain expertise)", "AI Content Strategist"],
    resources: {
      people: ["Andrew Ng (DeepLearning.AI — best AI educator)", "Ali Abdaal (YouTube — productivity & career change)", "Tina Huang (YouTube — tech career transitions)", "Cassie Kozyrkov (Google — making AI accessible)", "Greg Brockman (OpenAI — AI opportunity)"],
      books: ["Range by David Epstein — why generalists thrive in a specialized world", "Designing Your Life by Burnett & Evans — career pivoting framework", "The Alchemist by Paulo Coelho — courage to pursue a new path"],
      articles: ["How to Transition Into AI — practical career change roadmap", "The 100-Hour AI Upskilling Plan — structured learning path"]
    }
  }
};
