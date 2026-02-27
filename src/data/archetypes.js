// Archetypes with actionable HOW-TO guidance and specific resources

const ARCHETYPES = {
  aiArchitect: {
    name: "The AI Architect",
    emoji: "🏗️",
    desc: "You combine deep technical skills with high AI readiness. You're positioned to build the AI-powered systems that others will use. Your path is about going deeper — mastering AI infrastructure, model deployment, and system design.",
    actions: [
      {
        what: "Build end-to-end AI projects — not just prompting, but training, fine-tuning, and deploying models",
        how: 'Start with a weekend project: fine-tune a small open-source model on a domain-specific dataset using a popular model hub. Deploy it on a free-tier cloud instance. Document the process as a portfolio piece.',
        link: "https://huggingface.co/learn"
      },
      {
        what: "Learn MLOps and AI infrastructure (model serving, monitoring, evaluation pipelines)",
        how: 'Take a free MLOps specialization course online. Apply concepts to a personal project — add monitoring, A/B testing, and automated retraining. Hands-on experience with production ML pipelines is what hiring managers look for.',
        link: "https://www.coursera.org/specializations/machine-learning-engineering-for-production-mlops"
      },
      {
        what: "Develop expertise in AI safety, evaluation, or responsible AI — high-demand niches with less competition",
        how: 'Study the NIST AI Risk Management Framework. Build an evaluation harness for an LLM (test for hallucinations, bias, safety). This is a rare skill that commands premium compensation.',
        link: "https://www.nist.gov/artificial-intelligence"
      },
      {
        what: "Contribute to open-source AI projects to build public credibility",
        how: 'Find "good first issue" tags on popular open-source AI repositories. Even documentation PRs count. Aim for 1 contribution per month — consistency beats volume.',
        link: "https://github.com/topics/artificial-intelligence"
      },
      {
        what: "Position yourself as the bridge between AI research and production engineering",
        how: 'Write technical blog posts translating recent AI papers into practical implementations. Post on your personal blog or Medium. Share on LinkedIn and relevant subreddits. This builds thought leadership faster than certifications.'
      }
    ],
    skills: ["MLOps & Model Deployment", "AI System Design", "Advanced Prompt Engineering", "AI Safety & Evaluation", "Data Pipeline Architecture", "LLM Application Development"],
    roles: ["ML Engineer", "AI Platform Engineer", "AI Solutions Architect", "LLM Application Developer", "AI Technical Lead", "AI Safety Engineer"]
  },
  aiCollaborator: {
    name: "The AI Collaborator",
    emoji: "🤝",
    desc: "You have solid adaptability and growing AI readiness. You're not building AI — you're mastering how to work with it. This is the largest and fastest-growing career archetype. Your edge comes from combining domain expertise with AI fluency.",
    actions: [
      {
        what: "Become the AI champion in your team — learn tools deeply, then teach others",
        how: 'Pick the top-rated AI tool for your specific domain. Spend 2 weeks using it intensively. Then run a 30-minute "lunch and learn" for your team showing 3 specific workflows it improved.'
      },
      {
        what: "Document AI workflows that save measurable time in your specific domain",
        how: 'Create a simple before/after log: track a task you do weekly, measure time without AI, then with AI. After 4 weeks, write up the results. This becomes both a portfolio piece and an internal case study your manager can share upward.'
      },
      {
        what: "Learn prompt engineering patterns specific to your field",
        how: 'Take a free AI essentials course (many are available, 6–10 hours, with certificates). Then build a personal prompt library organized by task type. Share it with your team as a living document.',
        link: "https://grow.google/certificates/ai-essentials/"
      },
      {
        what: "Experiment with AI agents and automation for the repetitive parts of your workflow",
        how: 'Start with a no-code automation platform. Automate one recurring task (e.g., weekly report generation, email triage, data formatting). Expand from there as you see results.'
      },
      {
        what: "Build a portfolio of AI-augmented results to demonstrate your value",
        how: 'Keep a running document of "AI wins" — specific examples where AI helped you deliver faster, better, or more creatively. Update it monthly. Use it in performance reviews and interviews.'
      }
    ],
    skills: ["Prompt Engineering", "AI Workflow Design", "Domain-Specific AI Application", "Change Management", "AI Output Evaluation & Quality Control"],
    roles: ["AI-Augmented [Your Current Role]", "AI Workflow Specialist", "AI Adoption Lead", "Prompt Engineer", "AI-Powered Consultant"]
  },
  humanEdge: {
    name: "The Human Edge Specialist",
    emoji: "💎",
    desc: "Your greatest strengths are distinctly human — empathy, relationships, judgment, and nuanced communication. These skills are becoming more valuable, not less, as AI handles routine work. Your path is about doubling down on what makes you irreplaceable while building enough AI literacy to stay effective.",
    actions: [
      {
        what: "Deepen expertise in areas requiring trust, ethics, and human judgment",
        how: 'Identify the 2–3 decisions in your role that require the most nuanced human judgment. Document your decision-making framework for each. This makes your expertise transferable and positions you as the go-to person for complex cases.'
      },
      {
        what: "Build AI literacy focused on limitations — you'll be the quality check",
        how: 'Take a free introductory AI course designed for non-technical professionals (6 hours, no coding required). Focus specifically on understanding where AI fails — hallucinations, bias, context gaps. Your role is to catch what AI misses.',
        link: "https://www.coursera.org/learn/ai-for-everyone"
      },
      {
        what: "Position yourself at the human-AI interface: reviewing AI output, handling edge cases, managing exceptions",
        how: 'Volunteer to be the person who reviews AI-generated content, decisions, or recommendations in your team. Build a checklist of common AI errors in your domain. This "AI quality assurance" role is emerging and high-value.'
      },
      {
        what: "Develop skills in AI ethics, bias detection, and responsible AI governance",
        how: 'Study your industry\'s emerging AI regulations (EU AI Act, sector-specific guidelines). Take a free course on AI ethics from MIT OpenCourseWare or edX. Position yourself as the person who ensures AI is used responsibly.',
        link: "https://www.edx.org/learn/artificial-intelligence"
      },
      {
        what: "Build your personal brand around the human skills AI can't replicate",
        how: 'Write LinkedIn posts sharing real examples of where human judgment outperformed AI in your field. Speak at team meetings or local meetups about the human side of AI adoption. Authentic stories resonate more than credentials.'
      }
    ],
    skills: ["Emotional Intelligence", "Ethical Reasoning & AI Governance", "AI Literacy (for oversight)", "Complex Negotiation", "Trust Building & Stakeholder Management"],
    roles: ["AI Ethics Advisor", "Human-AI Interaction Designer", "Client Relationship Lead", "AI Output Reviewer / Quality Analyst", "Change Management Consultant"]
  },
  strategicLeader: {
    name: "The Strategic Leader",
    emoji: "🧭",
    desc: "You combine leadership instincts with a forward-looking mindset. The AI era needs people who can see the big picture, make decisions under uncertainty, and guide organizations through transformation. Your path is about leading the change, not just adapting to it.",
    actions: [
      {
        what: "Develop an AI strategy for your team or organization — even informally",
        how: 'Use the WEF\'s 5-pillar framework: Vision → Skills → Technology → Process → Culture. Draft a 1-page AI adoption plan for your team covering each pillar. Share it with your manager. Even an informal plan positions you as a strategic thinker.',
        link: "https://www.weforum.org/stories/2026/02/workforce-transformation-ai-jobs/"
      },
      {
        what: "Learn to evaluate AI ROI and make build-vs-buy decisions",
        how: 'For your next project involving AI, create a simple cost-benefit analysis: implementation cost, time saved, quality improvement, risk. Present it to leadership. This financial framing is what gets AI initiatives funded.'
      },
      {
        what: "Build cross-functional AI literacy programs for your teams",
        how: 'Organize a monthly "AI Hour" where team members demo how they\'re using AI. Rotate presenters. Create a shared Slack channel or doc for AI tips. Start small — even 3 people sharing is enough to build momentum.'
      },
      {
        what: "Study AI governance frameworks and responsible AI principles",
        how: 'Read the NIST AI Risk Management Framework and your industry\'s specific AI guidelines. Draft a lightweight AI use policy for your team (what\'s OK to put into AI tools, what isn\'t). This proactive governance builds trust.',
        link: "https://www.nist.gov/artificial-intelligence"
      },
      {
        what: "Network with AI leaders in your industry",
        how: 'Join 2 AI-focused communities (LinkedIn groups, Discord servers, or local meetups). Attend one AI conference or virtual summit per quarter. Set a goal of 2 meaningful conversations per month with people working on AI in your field.'
      }
    ],
    skills: ["AI Strategy & Governance", "Organizational Change Leadership", "AI ROI Evaluation", "Cross-Functional Team Building", "Stakeholder Communication"],
    roles: ["Head of AI Transformation", "VP/Director of AI Strategy", "Chief AI Officer", "AI Program Manager", "Innovation Lead"]
  },
  creativeInnovator: {
    name: "The Creative Innovator",
    emoji: "🎨",
    desc: "You bring creative thinking and originality to your work. AI is a powerful creative amplifier — it can generate variations, handle production work, and expand your creative range. Your edge is taste, vision, and the ability to direct AI as a creative tool.",
    actions: [
      {
        what: "Master AI creative tools in your specific medium",
        how: 'Commit to one AI creative tool for 30 days — pick the best one for your medium (image, text, video, or audio). Create one piece daily. By day 30, you\'ll have a portfolio and deep tool fluency that most creatives lack.'
      },
      {
        what: "Develop a \"human + AI\" creative workflow that multiplies your output",
        how: 'Map your creative process (ideation → drafting → refinement → production). Identify which stages AI can handle (usually drafting and variation). Keep ideation and final curation human. Document this workflow — it\'s your competitive advantage.'
      },
      {
        what: "Focus on creative direction, curation, and quality judgment — not just production",
        how: 'Practice giving AI detailed creative briefs. The skill of articulating vision clearly enough for AI to execute is essentially "creative direction" — and it\'s the role that survives automation. Build a portfolio of AI-directed work with your creative commentary.'
      },
      {
        what: "Explore new creative formats enabled by AI (interactive, generative, personalized)",
        how: 'Build one experimental project: a generative art piece, an interactive story, or a personalized content experience. Use free creative coding tools combined with AI APIs. Novel formats attract attention and demonstrate forward thinking.'
      },
      {
        what: "Build a portfolio explicitly showcasing AI-augmented creative work",
        how: 'Create a dedicated section on your portfolio site: "AI-Augmented Work." For each piece, explain your creative process, what AI contributed, and what you contributed. Transparency about AI use builds trust and demonstrates sophistication.'
      }
    ],
    skills: ["AI Creative Tools Mastery", "Creative Direction & Curation", "Generative Design", "AI-Augmented Storytelling", "Taste & Quality Judgment"],
    roles: ["AI Creative Director", "Generative Designer", "AI-Augmented Content Strategist", "Creative Technologist", "AI Art Director"]
  },
  careerPivot: {
    name: "The Career Reinventor",
    emoji: "🔄",
    desc: "You're at an inflection point — high adaptability signals readiness for change, and the AI era is creating entirely new career paths that didn't exist two years ago. This is actually an advantage: you can build AI-native skills from the ground up without legacy habits holding you back.",
    actions: [
      {
        what: "Take a structured AI foundations course to build credible baseline knowledge",
        how: 'Start with a free AI foundations certificate (self-paced, ~10 hours), then take an introductory AI course for non-technical learners. These two give you vocabulary, concepts, and a certificate — enough to speak credibly about AI in interviews.',
        link: "https://grow.google/certificates/ai-essentials/"
      },
      {
        what: "Build 2–3 small AI projects to demonstrate capability",
        how: 'Project ideas: (1) Build a chatbot for a topic you know well using a free API. (2) Create an AI-powered workflow automation for a real task. (3) Fine-tune a model on data from your domain. Even simple projects show initiative and practical skill.'
      },
      {
        what: "Map your transferable skills to AI-adjacent roles",
        how: 'List your top 5 skills. For each, search LinkedIn Jobs for roles that combine that skill with "AI" (e.g., "project management + AI" → AI Program Manager). Identify 3 target roles. Note the skill gaps and create a 90-day learning plan to close them.'
      },
      {
        what: "Join AI communities in your target field for networking and learning",
        how: 'Join 2–3 communities: r/MachineLearning or r/artificial on Reddit, relevant Discord servers, and one LinkedIn group. Contribute by asking thoughtful questions and sharing your learning journey. Aim for 2 meaningful connections per week.'
      },
      {
        what: "Consider \"bridge roles\" that combine your existing expertise with AI",
        how: 'Bridge roles are the fastest path: domain expert → AI trainer/evaluator, teacher → AI curriculum designer, writer → AI content strategist, analyst → AI-augmented analyst. These roles value your existing knowledge while building AI skills on the job.'
      }
    ],
    skills: ["AI Fundamentals & Literacy", "Rapid Prototyping", "Transferable Skill Mapping", "Networking & Community Building", "Portfolio Development"],
    roles: ["AI Trainer / Data Evaluator (entry)", "AI Product Manager", "AI-Augmented [Target Role]", "AI Consultant (leveraging domain expertise)", "Prompt Engineer"]
  }
};
