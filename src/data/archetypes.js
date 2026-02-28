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
      { name: "AI Agent Development", detail: "Build autonomous AI systems that chain multiple steps — tool calls, API integrations, error handling, memory. This is the #1 hiring skill in AI right now. ⚡ Start today: build one simple agent that automates a task you do manually. Use any agent framework — the first one you ship teaches more than any course." },
      { name: "Prompt Engineering & Design", detail: "Craft precise instructions that get reliable AI outputs. Learn system prompts, few-shot examples, chain-of-thought, and structured output formats. ⚡ Start today: take your 3 most common work tasks, write optimized prompts for each, and save them as reusable templates." },
      { name: "API Integration & Automation", detail: "Connect AI models to real-world systems — databases, APIs, file systems, messaging. This turns AI from a chatbox into a tool that does real work. ⚡ Start today: connect an AI model to one external service (email, calendar, database) and automate a simple workflow end-to-end." },
      { name: "AI Output Evaluation", detail: "Systematically judge whether AI output is good enough. Build rubrics, test suites, and comparison frameworks. Most people can't do this well — it's rare and extremely valuable. ⚡ Start today: create a 5-point checklist for evaluating AI output in your domain. Test it on 10 real outputs and refine." },
      { name: "Product Thinking with AI", detail: "Identify problems worth solving with AI, design user experiences around AI capabilities and limitations, and ship products people actually use. ⚡ Start today: pick one pain point in your life, sketch a solution that uses AI, and build a working prototype this weekend." },
      { name: "Rapid Prototyping", detail: "Go from idea to working demo in hours, not weeks. Use AI coding tools, no-code platforms, and pre-built components. Speed of iteration is your competitive advantage. ⚡ Start today: use an AI coding assistant to build and deploy a simple web app in under 2 hours. The goal is speed, not perfection." }
    ],
    roles: [
      { name: "AI Application Developer", detail: "Build end-user applications powered by AI — chatbots, content tools, analysis dashboards, automation systems. High demand across every industry. ⚡ Start today: clone an open-source AI app template, customize it for your use case, and deploy it. Having a live app beats any resume bullet." },
      { name: "AI Solutions Engineer", detail: "Help organizations implement AI by designing custom solutions that fit their workflows. Requires both technical depth and the ability to understand business problems. ⚡ Start today: pick a team's workflow, identify where AI could save 5+ hours/week, and build a proof-of-concept." },
      { name: "AI Automation Specialist", detail: "Design and build automated workflows that use AI to handle repetitive tasks — document processing, data extraction, report generation, email triage. ⚡ Start today: automate one repetitive task you do weekly using an AI automation platform. Measure the time saved." },
      { name: "AI Product Builder", detail: "Combine product management with hands-on building. Define what to build, prototype it yourself, test with users, iterate. ⚡ Start today: talk to 5 people about their biggest pain point, then build an AI-powered solution over a weekend and get their feedback." },
      { name: "Technical AI Consultant", detail: "Advise companies on AI strategy and implementation. Requires broad knowledge of AI tools, architectures, and best practices. ⚡ Start today: write up an AI assessment for a company you know well — what they should adopt, what to avoid, expected ROI. This becomes your portfolio piece." },
      { name: "AI Agent Developer", detail: "Specialize in building multi-step AI agents that can plan, use tools, and complete complex tasks autonomously. The newest and fastest-growing role in AI. ⚡ Start today: build an agent that takes a goal, breaks it into steps, executes them with tool calls, and reports results. Ship it publicly." }
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
      { name: "Prompt Engineering", detail: "Write prompts that get consistent, high-quality results for your specific work. Build a personal library of templates organized by task type. ⚡ Start today: take your most common work task, write 3 prompt variations, test which gives the best output, and save the winner." },
      { name: "AI Workflow Design", detail: "Map your work processes and identify where AI fits in. Design end-to-end workflows that combine human judgment with AI speed. ⚡ Start today: draw your typical workday as a flowchart. Circle every step AI could handle. Pick one and automate it this week." },
      { name: "Domain-Specific AI Application", detail: "Apply AI tools to your specific field's problems — legal research, financial analysis, marketing copy, customer support. Domain experts who know AI outperform AI generalists every time. ⚡ Start today: find the top-rated AI tool for your industry and spend 2 hours using it on a real task." },
      { name: "AI Output Quality Judgment", detail: "Develop the 'taste' to know when AI output is good enough and when it needs human editing. This is what separates effective AI users from everyone else. ⚡ Start today: generate 10 AI outputs for a task you know well. Rate each 1-5 and note why. You're building your evaluation instinct." },
      { name: "Change Management & AI Adoption", detail: "Help your team and organization adopt AI tools effectively. Address resistance, design training, measure impact. ⚡ Start today: run a 30-min 'AI show & tell' with your team — demo 3 workflows AI improved for you. Volunteer to be the team's AI point person." }
    ],
    roles: [
      { name: "AI-Enhanced [Your Current Role]", detail: "Your current job title, but 2-5x more productive with AI integrated into your daily workflow. No job change needed, just skill upgrade. ⚡ Start today: pick the one task that eats most of your time. Find an AI tool that handles it. Use it for a week and measure the difference." },
      { name: "AI Workflow Specialist", detail: "Design and optimize AI-powered workflows for teams. You understand both the tools and the human processes, and you bridge the gap. ⚡ Start today: document one team workflow end-to-end, redesign it with AI, and present the before/after to your manager." },
      { name: "AI Adoption Champion", detail: "Lead AI adoption within your organization — training, tool selection, best practices, measuring ROI. Often starts informal, becomes formal. ⚡ Start today: create a shared doc of 'AI tips that actually work' for your team. Add one tip per week. You're now the AI champion." },
      { name: "AI-Powered Consultant", detail: "Use AI to deliver consulting work faster and at higher quality — research, analysis, presentations, recommendations. 3x the workload with better output. ⚡ Start today: take your next deliverable and use AI for the research and first draft. Track how much time you saved." },
      { name: "Digital Transformation Lead", detail: "Guide organizations through AI-driven transformation. Requires understanding of technology, change management, and business strategy. ⚡ Start today: write a 1-page 'AI opportunity assessment' for your team — what to automate, expected impact, timeline. Share it with leadership." }
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
      { name: "Emotional Intelligence", detail: "Read people, manage relationships, navigate conflict, and build trust. As routine work gets automated, EQ becomes the primary differentiator. ⚡ Start today: in your next 3 meetings, focus entirely on reading the room — who's engaged, who's resistant, what's unsaid. Write down your observations." },
      { name: "Ethical Reasoning & AI Oversight", detail: "Evaluate AI decisions for fairness, bias, and unintended consequences. Every organization deploying AI needs people who can ask 'should we?' not just 'can we?'. ⚡ Start today: review one AI-generated output in your work for potential bias or errors. Document what you found and share it." },
      { name: "AI Literacy (for quality control)", detail: "Understand AI well enough to catch its mistakes — hallucinations, bias, missing context, confident-sounding wrong answers. ⚡ Start today: take a free 6-hour AI fundamentals course. Focus on understanding failure modes, not building models." },
      { name: "Complex Negotiation & Persuasion", detail: "Handle high-stakes conversations where context, relationships, and reading the room matter. AI can draft talking points but can't navigate human dynamics. ⚡ Start today: before your next difficult conversation, write down the other person's likely concerns and prepare responses for each." },
      { name: "Trust Building & Relationship Management", detail: "Build and maintain deep professional relationships over time. In a world of AI-generated everything, authentic human connection is the scarcest resource. ⚡ Start today: reach out to 3 people you haven't spoken to in months. No agenda — just genuine connection. Do this monthly." }
    ],
    roles: [
      { name: "AI Ethics Advisor", detail: "Guide organizations on responsible AI use — bias auditing, fairness frameworks, transparency policies. Demand surging as regulations tighten. ⚡ Start today: read your industry's AI guidelines and draft a lightweight AI use policy for your team." },
      { name: "Human-AI Interaction Designer", detail: "Design how humans and AI systems work together — interfaces, handoff points, escalation paths. A new and growing field. ⚡ Start today: map one AI tool your team uses. Identify where users get confused or where AI fails. Propose a better handoff design." },
      { name: "Client Relationship Lead", detail: "Own high-value client relationships where trust and judgment matter more than speed. The human relationship becomes the premium service layer. ⚡ Start today: identify your 3 most important relationships. Schedule a personal check-in with each — no agenda, just listening." },
      { name: "AI Quality Reviewer", detail: "Review and validate AI-generated outputs before they reach customers. Requires deep domain expertise plus understanding of AI failure patterns. ⚡ Start today: volunteer to review AI-generated content in your team. Build a checklist of common errors you catch." },
      { name: "Change Management Consultant", detail: "Help organizations navigate the human side of AI adoption — resistance, reskilling, culture change. Where most AI projects actually fail. ⚡ Start today: interview 5 colleagues about their AI concerns. Document the patterns — this is your change management playbook." }
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
      { name: "AI Strategy & Vision", detail: "See where AI is heading and what it means for your industry. Translate technical possibilities into business opportunities. ⚡ Start today: write a 1-page 'AI vision' for your team — where AI will impact your industry in 2 years and what to do about it." },
      { name: "Organizational Change Leadership", detail: "Guide teams through the uncertainty of AI transformation. The #1 reason AI initiatives fail is people resistance, not technology. ⚡ Start today: host a 'fears and hopes about AI' discussion with your team. Listen more than you talk. Address the top 3 concerns." },
      { name: "AI ROI & Business Case Development", detail: "Quantify the value of AI investments — cost savings, revenue impact, productivity gains. This financial framing is what gets AI projects funded. ⚡ Start today: pick one AI tool your team uses. Calculate hours saved per week × hourly cost × 52 weeks. Present this to your manager." },
      { name: "Cross-Functional Team Building", detail: "Build teams that combine technical AI skills with domain expertise, design thinking, and business acumen. The best AI outcomes come from diverse teams. ⚡ Start today: identify one person from engineering, one from business, and one domain expert. Propose a small AI pilot together." },
      { name: "AI Governance & Policy", detail: "Create frameworks for responsible AI use — data privacy, model oversight, decision accountability. Proactive governance builds trust and prevents costly mistakes. ⚡ Start today: draft a simple 'AI do's and don'ts' for your team. Cover data handling, output review, and escalation." }
    ],
    roles: [
      { name: "Head of AI Transformation", detail: "Lead your organization's AI strategy and execution. Own the roadmap, budget, team building, and stakeholder management. ⚡ Start today: draft an informal AI roadmap for your org — 3 quick wins (this quarter), 3 strategic bets (this year). Share it with your leadership." },
      { name: "AI Strategy Director", detail: "Define where and how AI should be applied across the business. Evaluate opportunities, prioritize investments, and measure outcomes. ⚡ Start today: audit your company's current AI usage. Map every tool, who uses it, and the impact. Gaps in this map are your strategic opportunities." },
      { name: "Chief AI Officer", detail: "C-level role responsible for the organization's entire AI agenda — strategy, governance, talent, partnerships. Emerging role that didn't exist 3 years ago. ⚡ Start today: build your AI leadership brand — write about AI strategy, speak at internal events, and connect with other AI leaders." },
      { name: "AI Program Manager", detail: "Coordinate multiple AI initiatives across teams. Manage timelines, dependencies, resources, and stakeholder expectations. ⚡ Start today: create a simple tracker of all AI projects in your org — status, owner, impact, blockers. This visibility alone makes you invaluable." },
      { name: "Innovation Lead", detail: "Identify and pilot new AI applications before competitors. Run experiments, measure results, and scale winners. ⚡ Start today: set up a monthly 'AI experiment' — try one new AI tool or approach, document results, share learnings. Build a culture of experimentation." }
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
      { name: "AI Creative Tool Mastery", detail: "Go deep on one AI creative tool — image generation, video, music, writing. Daily use for 30 days builds fluency most creatives lack. ⚡ Start today: pick one AI creative tool. Create something with it every day for a week. Post the results publicly — the learning curve is the content." },
      { name: "Creative Direction & Curation", detail: "Articulate a creative vision clearly enough for AI to execute. This is the most valuable creative skill in the AI era. Taste can't be automated. ⚡ Start today: write a detailed creative brief for an AI tool. Compare outputs from vague vs. precise briefs. The gap is your skill to develop." },
      { name: "AI-Augmented Storytelling", detail: "Use AI to expand your storytelling — generate variations, explore visual styles, create interactive narratives. The story stays human; AI handles production. ⚡ Start today: take a story you've told before and use AI to create 3 different visual or format variations of it." },
      { name: "Generative Design Thinking", detail: "Think in systems and variations rather than single outputs. Use AI to explore a design space rapidly, then curate the best results. ⚡ Start today: give AI the same creative prompt 20 times with slight variations. Study what changes and what stays consistent. This builds your design intuition." },
      { name: "Taste & Quality Judgment", detail: "Know what's good. In a world where anyone can generate content, curation and selection become the ultimate creative skill. Taste is the last moat. ⚡ Start today: curate a collection of the best AI-generated work in your field. Write why each piece works. Your taste is your portfolio." }
    ],
    roles: [
      { name: "AI Creative Director", detail: "Direct AI tools to produce creative work that matches your vision. The role shifts from 'making' to 'directing'. ⚡ Start today: create a mood board, then use AI to generate 10 variations. Select and refine the best 2. This is creative direction in practice." },
      { name: "Generative Designer", detail: "Use AI to create visual designs, illustrations, and graphics at scale. Combine AI generation with human refinement. ⚡ Start today: take a real design task and produce it using AI + your refinement. Compare time and quality vs. your traditional process." },
      { name: "AI Content Strategist", detail: "Plan and oversee AI-augmented content production — what to create, how to use AI, quality standards, brand consistency. ⚡ Start today: audit your team's content pipeline. Identify which stages AI could handle. Propose a pilot for one content type." },
      { name: "Creative Technologist", detail: "Bridge creative vision and technical implementation. Build custom AI creative tools, workflows, and experiences. Rare skill combination with high demand. ⚡ Start today: build a simple creative tool using AI APIs — a style transfer app, a prompt-to-poster generator, anything that combines code + creativity." },
      { name: "AI-Augmented Art Director", detail: "Use AI to rapidly prototype visual concepts, explore styles, and produce variations. Present polished concepts faster than traditional methods. ⚡ Start today: for your next project, use AI to generate 20 concept directions in an hour instead of sketching 3 in a day. Present the best 5." }
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
      { name: "AI Fundamentals & Literacy", detail: "Understand what AI can and can't do, how models work at a high level, and the key terminology. ⚡ Start today: take a free AI essentials course (~10 hours). Focus on capabilities and limitations, not math. You'll be able to speak credibly about AI within a week." },
      { name: "Rapid Prototyping", detail: "Build quick demos and proof-of-concepts using AI tools and no-code platforms. Even simple projects demonstrate initiative. ⚡ Start today: use an AI coding tool to build a simple app that solves a problem you have. Deploy it. You now have a portfolio piece." },
      { name: "Transferable Skill Mapping", detail: "Identify which of your existing skills translate to AI-adjacent roles. Domain expertise, communication, and analytical thinking are all highly valued. ⚡ Start today: list your top 5 skills. Search job boards for roles combining each with 'AI'. You'll find more matches than you expect." },
      { name: "Networking & Community Building", detail: "Connect with people already working in AI. Most career pivots happen through relationships, not job applications. ⚡ Start today: join 2 AI communities (Reddit, Discord, or LinkedIn groups). Introduce yourself and ask one thoughtful question. Aim for 2 connections per week." },
      { name: "Portfolio Development", detail: "Document everything you build and learn. A portfolio of small AI projects speaks louder than any certification. ⚡ Start today: create a simple portfolio page. Add your first AI project — even a well-crafted prompt library counts. Update it monthly." }
    ],
    roles: [
      { name: "AI Trainer / Evaluator", detail: "Train and evaluate AI models using your domain expertise. Fastest entry point — your existing knowledge is the qualification. ⚡ Start today: sign up for an AI evaluation platform. Rate 50 AI outputs in your domain. You're now building the exact skill companies pay for." },
      { name: "AI Product Manager", detail: "Define what AI products should do and how they should work. High demand, high impact role that doesn't require deep technical skills. ⚡ Start today: pick an AI product you use. Write a 1-page analysis: what works, what's broken, what you'd build differently. This is PM thinking." },
      { name: "AI-Enhanced [Target Role]", detail: "Your target role, but with AI skills that make you 2-5x more effective. Often the easiest pivot — same domain, upgraded toolkit. ⚡ Start today: find 3 job postings for your target role that mention AI. Note the AI skills they want. Start learning the most common one this week." },
      { name: "AI Consultant (domain expertise)", detail: "Advise companies on AI adoption in your area of expertise. Your deep domain knowledge is what AI teams lack. ⚡ Start today: write a 'state of AI in [your industry]' post. Share it on LinkedIn. This positions you as the domain expert who understands AI." },
      { name: "AI Content Strategist", detail: "Plan and manage AI-augmented content creation. Writers, marketers, and communicators have a natural advantage here. ⚡ Start today: take one piece of content you'd normally create manually. Use AI for the first draft, then refine it. Document the process and time saved." }
    ],
    resources: {
      people: ["Andrew Ng (DeepLearning.AI — best AI educator)", "Ali Abdaal (YouTube — productivity & career change)", "Tina Huang (YouTube — tech career transitions)", "Cassie Kozyrkov (Google — making AI accessible)", "Greg Brockman (OpenAI — AI opportunity)"],
      books: ["Range by David Epstein — why generalists thrive in a specialized world", "Designing Your Life by Burnett & Evans — career pivoting framework", "The Alchemist by Paulo Coelho — courage to pursue a new path"],
      articles: ["How to Transition Into AI — practical career change roadmap", "The 100-Hour AI Upskilling Plan — structured learning path"]
    }
  }
};
