// AI Adoption Diagnostic — scenario-based, adaptive branching
// Dimensions: usage_depth, workflow, system, adaptability, builder
// Adaptive: 3 calibration → branch into track → ~12-15 total questions

const SECTIONS = {
  calibration: "Calibration",
  usage: "How You Use AI",
  workflow: "Workflow Thinking",
  system: "System Thinking",
  future: "Future Readiness"
};

const QUESTIONS = [
  // === CALIBRATION (3 questions — everyone sees these) ===
  {
    id: "cal_usage",
    section: "calibration",
    title: "Your most common AI usage looks like:",
    insight: 'Sanctioned access to AI tools is now available to ~60% of workers, up from under 40% a year ago. Professionals with AI skills command an average wage premium of 56%.<div class="source">— Deloitte State of AI in the Enterprise 2026</div>',
    options: [
      { text: "Rare experimentation — tried it a few times", scores: { usage_depth: 1 }, level: 1 },
      { text: "Writing or summarizing text", scores: { usage_depth: 2 }, level: 2 },
      { text: "Problem solving, coding help, or daily tasks", scores: { usage_depth: 2, workflow: 1 }, level: 3 },
      { text: "Daily work assistant across multiple tasks", scores: { usage_depth: 3, workflow: 1 }, level: 4 },
      { text: "Core part of how I work — can't imagine without it", scores: { usage_depth: 3, workflow: 2 }, level: 5 }
    ]
  },
  {
    id: "cal_error",
    section: "calibration",
    title: "When AI gives you a wrong or mediocre answer, you:",
    insight: 'The gap between knowing about AI and applying it effectively is where career value lives. How you handle AI failures reveals your true skill level.<div class="source">— Deloitte State of AI in the Enterprise 2026</div>',
    options: [
      { text: "Give up or stop trusting it", scores: { adaptability: -1 }, level: 1 },
      { text: "Retry with the same question", scores: { usage_depth: 1 }, level: 2 },
      { text: "Rewrite the prompt with more detail", scores: { usage_depth: 2, workflow: 1 }, level: 3 },
      { text: "Add examples, context, and constraints", scores: { workflow: 2, usage_depth: 1 }, level: 4 },
      { text: "Change my approach — different model, system prompt, or process", scores: { system: 2, workflow: 1 }, level: 5 }
    ]
  },
  {
    id: "cal_mental",
    section: "calibration",
    title: "AI feels most like:",
    insight: 'Your mental model of AI predicts how you will use it. People who see AI as a "system component" adopt it 3x faster than those who see it as a search engine.<div class="source">— McKinsey Global Survey on AI, 2025</div>',
    options: [
      { text: "A smarter search engine", scores: { usage_depth: 1 }, level: 1 },
      { text: "A helpful assistant", scores: { usage_depth: 2 }, level: 2 },
      { text: "A creative collaborator", scores: { workflow: 2, adaptability: 1 }, level: 3 },
      { text: "A thinking partner I reason with", scores: { workflow: 2, system: 1 }, level: 4 },
      { text: "A programmable system I design around", scores: { system: 3, builder: 1 }, level: 5 }
    ]
  },

  // === USAGE — How You Actually Use AI ===
  {
    id: "start_unfamiliar",
    section: "usage",
    title: "When you start something unfamiliar, you usually:",
    track: "explorer",
    insight: 'Professionals who combine hands-on experimentation with structured learning adopt AI tools 2–3x faster than those who rely on passive consumption.<div class="source">— World Economic Forum, Future of Jobs Report 2025</div>',
    options: [
      { text: "Google it or search articles", scores: { adaptability: 1 }, level: 1 },
      { text: "Ask AI for a quick answer", scores: { usage_depth: 1 }, level: 2 },
      { text: "Ask AI to explain step-by-step", scores: { usage_depth: 2 }, level: 3 },
      { text: "Ask AI to plan how to approach it", scores: { workflow: 2 }, level: 4 },
      { text: "Build a reusable workflow immediately", scores: { builder: 2, system: 1 }, level: 5 }
    ]
  },
  {
    id: "time_saved",
    section: "usage",
    title: "AI saves you time. You typically:",
    track: "explorer",
    insight: 'The WEF reports that 59% of workers globally will need reskilling by 2030. How you reinvest time saved by AI determines whether you grow or plateau.<div class="source">— World Economic Forum, Future of Jobs Report 2025</div>',
    options: [
      { text: "Finish earlier and relax", scores: { usage_depth: 1 }, level: 1 },
      { text: "Do more of the same work faster", scores: { usage_depth: 2 }, level: 2 },
      { text: "Take on bigger or harder problems", scores: { adaptability: 2, workflow: 1 }, level: 3 },
      { text: "Redesign how the work gets done", scores: { system: 2, workflow: 1 }, level: 4 },
      { text: "Automate it so it runs without me", scores: { builder: 2, system: 1 }, level: 5 }
    ]
  },
  {
    id: "tool_count",
    section: "usage",
    title: "How many AI tools do you actively use?",
    track: "explorer",
    insight: 'The most impactful AI adoption comes from mastering domain-specific tools, not generic chatbots. Specialized AI knowledge in your field makes you significantly more valuable.<div class="source">— ManpowerGroup 2026 Global Talent Shortage Survey</div>',
    options: [
      { text: "None or tried once", scores: {}, level: 1 },
      { text: "One main tool", scores: { usage_depth: 1 }, level: 2 },
      { text: "2–3 tools for different tasks", scores: { usage_depth: 2, workflow: 1 }, level: 3 },
      { text: "A tool stack organized by task type", scores: { workflow: 2, system: 1 }, level: 4 },
      { text: "Constantly testing and rotating new ones", scores: { adaptability: 2, builder: 1 }, level: 5 }
    ]
  },
  {
    id: "learning_skill",
    section: "usage",
    title: "When learning a new skill, you:",
    track: "explorer",
    insight: 'Continuous learning is the strongest signal of career resilience. Professionals who set aside dedicated weekly time for skill development report higher confidence and adaptability.<div class="source">— Forbes, "40% Of Job Skills Will Change By 2030," Feb 2026</div>',
    options: [
      { text: "Watch videos and read articles", scores: { adaptability: 1 }, level: 1 },
      { text: "Ask AI questions as they come up", scores: { usage_depth: 1 }, level: 2 },
      { text: "Practice with AI guidance and feedback", scores: { usage_depth: 2, adaptability: 1 }, level: 3 },
      { text: "Design a learning plan with AI", scores: { workflow: 2, adaptability: 1 }, level: 4 },
      { text: "Build a personal knowledge system with AI", scores: { system: 2, builder: 1 }, level: 5 }
    ]
  },

  // === WORKFLOW — Process Thinking ===
  {
    id: "repeat_task",
    section: "workflow",
    title: "You do the same task every day. You:",
    track: "workflow",
    insight: 'An estimated 25% of all work hours globally are now automatable — up from 18% two years ago. The professionals who systematize repetitive work free themselves for higher-value thinking.<div class="source">— McKinsey Global Institute; WEF Future of Jobs Report</div>',
    options: [
      { text: "Just repeat it manually each time", scores: { usage_depth: 1 }, level: 1 },
      { text: "Ask AI to help each time", scores: { usage_depth: 2 }, level: 2 },
      { text: "Reuse old prompts I've saved", scores: { workflow: 2 }, level: 3 },
      { text: "Create a structured template with instructions", scores: { workflow: 3 }, level: 4 },
      { text: "Automate the entire workflow", scores: { system: 2, builder: 1 }, level: 5 }
    ]
  },
  {
    id: "writing_important",
    section: "workflow",
    title: "Writing something important, you:",
    track: "workflow",
    insight: 'AI-augmented professionals report 30-50% time savings on content creation. But the quality gap between "AI-assisted" and "AI-directed" writing is where career differentiation happens.<div class="source">— Deloitte Human Capital Trends 2025</div>',
    options: [
      { text: "Write it myself fully", scores: { adaptability: 1 }, level: 1 },
      { text: "Ask AI for a draft, then edit", scores: { usage_depth: 2 }, level: 2 },
      { text: "Co-write iteratively with AI", scores: { workflow: 2 }, level: 3 },
      { text: "Provide style, constraints, and examples to AI", scores: { workflow: 3 }, level: 4 },
      { text: "Maintain a reusable writing system with AI", scores: { system: 2, builder: 1 }, level: 5 }
    ]
  },
  {
    id: "useful_prompt",
    section: "workflow",
    title: "You discover a prompt that works really well. You:",
    track: "workflow",
    insight: 'Knowledge management is becoming a critical AI-era skill. Professionals who systematize their AI interactions compound their productivity gains over time.<div class="source">— Deloitte State of AI in the Enterprise 2026</div>',
    options: [
      { text: "Forget about it later", scores: {}, level: 1 },
      { text: "Screenshot or bookmark it", scores: { usage_depth: 1 }, level: 2 },
      { text: "Save it in a notes app", scores: { workflow: 1 }, level: 3 },
      { text: "Add it to an organized prompt library", scores: { workflow: 2, system: 1 }, level: 4 },
      { text: "Convert it into a reusable tool or template", scores: { system: 2, builder: 1 }, level: 5 }
    ]
  },
  {
    id: "new_model",
    section: "workflow",
    title: "A new AI model drops. You:",
    track: "workflow",
    insight: 'The AI tool landscape changes monthly. Professionals who evaluate new tools strategically — not just chase hype — make better adoption decisions.<div class="source">— ManpowerGroup 2026 Global Talent Shortage Survey</div>',
    options: [
      { text: "Ignore it — too much noise", scores: {}, level: 1 },
      { text: "Try it once out of curiosity", scores: { adaptability: 1 }, level: 2 },
      { text: "Compare it casually with what I use", scores: { adaptability: 2 }, level: 3 },
      { text: "Evaluate it against my specific use cases", scores: { workflow: 2, system: 1 }, level: 4 },
      { text: "Redesign workflows if it's meaningfully better", scores: { system: 2, builder: 1 }, level: 5 }
    ]
  },

  // === SYSTEM — Architecture Thinking ===
  {
    id: "large_project",
    section: "system",
    title: "Facing a large repetitive project, you:",
    track: "operator",
    insight: 'Organizations investing in workforce development alongside AI are 1.8x more likely to report better financial results. System-level thinking is the differentiator.<div class="source">— Deloitte State of AI in the Enterprise 2026</div>',
    options: [
      { text: "Do it manually, piece by piece", scores: { adaptability: 1 }, level: 1 },
      { text: "Ask AI to help with each piece", scores: { usage_depth: 2 }, level: 2 },
      { text: "Batch similar tasks together", scores: { workflow: 2 }, level: 3 },
      { text: "Script or template the workflow", scores: { system: 2 }, level: 4 },
      { text: "Build an agent or automation loop", scores: { builder: 3 }, level: 5 }
    ]
  },
  {
    id: "hallucination",
    section: "system",
    title: "AI hallucination happens in something important. You:",
    track: "operator",
    insight: 'AI skills have surpassed all others as the most difficult for employers to find globally, with 72% reporting hiring difficulty. Knowing how to handle AI failures is a premium skill.<div class="source">— ManpowerGroup 2026 Global Talent Shortage Survey</div>',
    options: [
      { text: "Accept the risk — it's AI", scores: {}, level: 1 },
      { text: "Double-check everything manually", scores: { usage_depth: 1 }, level: 2 },
      { text: "Add constraints to reduce errors", scores: { workflow: 2 }, level: 3 },
      { text: "Build a validation process", scores: { system: 2 }, level: 4 },
      { text: "Create an automated evaluation loop", scores: { builder: 2, system: 1 }, level: 5 }
    ]
  },
  {
    id: "consistent_results",
    section: "system",
    title: "You need consistent AI results across a team. You:",
    track: "operator",
    insight: 'By 2030, 70% of workplace skills will change because of AI. Teams that standardize AI workflows outperform those where everyone experiments individually.<div class="source">— BusinessWorld, Feb 2026; Forbes Career Strategy</div>',
    options: [
      { text: "Hope the prompts work each time", scores: {}, level: 1 },
      { text: "Retry until it looks right", scores: { usage_depth: 1 }, level: 2 },
      { text: "Write better, more specific prompts", scores: { workflow: 2 }, level: 3 },
      { text: "Create structured templates with examples", scores: { system: 2, workflow: 1 }, level: 4 },
      { text: "Use programmatic control — APIs, system prompts, guardrails", scores: { builder: 3 }, level: 5 }
    ]
  },
  {
    id: "bottleneck",
    section: "system",
    title: "A work bottleneck appears. You:",
    track: "operator",
    insight: 'As AI absorbs routine tasks, it shifts human work toward judgment, strategy, and complex problem-solving. How you respond to bottlenecks reveals your operating level.<div class="source">— Forbes, "40% Of Job Skills Will Change By 2030," Feb 2026</div>',
    options: [
      { text: "Work harder and push through", scores: { adaptability: 1 }, level: 1 },
      { text: "Ask AI for help with the stuck part", scores: { usage_depth: 2 }, level: 2 },
      { text: "Optimize the specific steps that are slow", scores: { workflow: 2 }, level: 3 },
      { text: "Remove unnecessary work entirely", scores: { system: 2 }, level: 4 },
      { text: "Rebuild the workflow with AI at the center", scores: { builder: 2, system: 1 }, level: 5 }
    ]
  },

  // === FUTURE — Readiness & Direction ===
  {
    id: "agents_view",
    section: "future",
    title: "AI agents replacing manual workflows — you think:",
    insight: 'IDC predicts that by 2026, over 90% of organizations will feel the pain of the IT skills crisis. The demand for people who can work with AI agents far outstrips supply.<div class="source">— IDC Survey 2024; ManageEngine</div>',
    options: [
      { text: "Sounds like hype", scores: {}, level: 1 },
      { text: "Interesting idea, watching from the side", scores: { adaptability: 1 }, level: 2 },
      { text: "Probably useful — I'd try it", scores: { adaptability: 2 }, level: 3 },
      { text: "Already experimenting with agents", scores: { builder: 2, system: 1 }, level: 4 },
      { text: "Building or planning agent-based workflows", scores: { builder: 3 }, level: 5 }
    ]
  },
  {
    id: "ideal_future",
    section: "future",
    title: "Your ideal future work style:",
    insight: 'Research shows that people who channel AI-related concern into action — learning, experimenting, networking — consistently outperform those who either ignore AI or become paralyzed by uncertainty.<div class="source">— Deloitte Human Capital Trends; Forbes Career Strategy, 2026</div>',
    options: [
      { text: "Mostly manual — AI as occasional helper", scores: { adaptability: 1 }, level: 1 },
      { text: "AI assists me on specific tasks", scores: { usage_depth: 2 }, level: 2 },
      { text: "AI collaborates with me throughout the day", scores: { workflow: 2, adaptability: 1 }, level: 3 },
      { text: "AI-first workflow — I direct, AI executes", scores: { system: 2, workflow: 1 }, level: 4 },
      { text: "I design systems where humans direct AI systems", scores: { builder: 3 }, level: 5 }
    ]
  },
  {
    id: "new_tech",
    section: "future",
    title: "When facing completely new technology, you:",
    insight: 'Calculated career moves — even lateral ones — build the adaptability that the AI era demands. 40% of job skills will change by 2030.<div class="source">— WEF Future of Jobs Report; Forbes Career Strategy, 2026</div>',
    options: [
      { text: "Wait until it's mature and proven", scores: {}, level: 1 },
      { text: "Follow what friends or colleagues recommend", scores: { adaptability: 1 }, level: 2 },
      { text: "Try the popular tools myself", scores: { adaptability: 2 }, level: 3 },
      { text: "Explore deeply — read docs, test edge cases", scores: { system: 1, adaptability: 2 }, level: 4 },
      { text: "Build something with it early", scores: { builder: 3 }, level: 5 }
    ]
  },
  {
    id: "self_identify",
    section: "future",
    title: "Which feels closest to you right now?",
    insight: 'Self-awareness about your current position is the first step to intentional growth. Where you are matters less than knowing where you want to go.<div class="source">— Deloitte Human Capital Trends 2025</div>',
    options: [
      { text: "AI observer — watching from the sidelines", scores: { usage_depth: 1 }, level: 1 },
      { text: "Casual user — it helps sometimes", scores: { usage_depth: 2 }, level: 2 },
      { text: "Power user — AI is part of my daily work", scores: { workflow: 2, usage_depth: 1 }, level: 3 },
      { text: "Workflow optimizer — I design how AI fits into processes", scores: { system: 2, workflow: 1 }, level: 4 },
      { text: "AI builder — I create tools and systems with AI", scores: { builder: 3 }, level: 5 }
    ]
  },

  // === BUILDER FAST-TRACK (only if ≥2 level-5 answers in calibration+early) ===
  {
    id: "deploy_team",
    section: "system",
    title: "You need to deploy AI capability for your team. You:",
    track: "builder",
    insight: 'Companies with 40%+ AI projects in production are set to double in six months. The ability to deploy AI for teams — not just yourself — is a leadership multiplier.<div class="source">— Deloitte State of AI in the Enterprise 2026</div>',
    options: [
      { text: "Share useful prompts in chat", scores: { workflow: 1 }, level: 2 },
      { text: "Create shared templates and guides", scores: { workflow: 2 }, level: 3 },
      { text: "Build an internal tool or dashboard", scores: { system: 2, builder: 1 }, level: 4 },
      { text: "Set up API-based services the team can use", scores: { builder: 2, system: 1 }, level: 5 },
      { text: "Design an autonomous agent system", scores: { builder: 3 }, level: 5 }
    ]
  },
  {
    id: "reliability",
    section: "system",
    title: "AI output reliability matters for your project. You:",
    track: "builder",
    insight: 'The ability to evaluate AI reliably is rare and extremely valuable. Most organizations lack systematic approaches to AI quality assurance.<div class="source">— Deloitte State of AI in the Enterprise 2026</div>',
    options: [
      { text: "Manual spot-checking", scores: { usage_depth: 1 }, level: 2 },
      { text: "Sampling review on a percentage", scores: { workflow: 2 }, level: 3 },
      { text: "Prompt constraints and structured output", scores: { system: 2 }, level: 4 },
      { text: "Evaluation dataset with scoring criteria", scores: { builder: 2, system: 1 }, level: 5 },
      { text: "Automated scoring and monitoring loop", scores: { builder: 3 }, level: 5 }
    ]
  },
  {
    id: "biggest_bottleneck",
    section: "future",
    title: "Your biggest AI bottleneck right now:",
    track: "builder",
    insight: 'Understanding your specific bottleneck is the fastest path to your next level. Most people overestimate their tool knowledge and underestimate their system design gaps.<div class="source">— McKinsey Global Survey on AI, 2025</div>',
    options: [
      { text: "Learning the basics of prompting", scores: { usage_depth: 1 }, level: 1 },
      { text: "Organizing my AI knowledge and prompts", scores: { workflow: 2 }, level: 3 },
      { text: "Scaling workflows beyond myself", scores: { system: 2 }, level: 4 },
      { text: "System integration and reliability", scores: { builder: 2 }, level: 5 },
      { text: "Evaluation, monitoring, and governance", scores: { builder: 3 }, level: 5 }
    ]
  },

  // === CROSS-CHECK (confidence verification — everyone sees 1) ===
  {
    id: "deadline_pressure",
    section: "future",
    title: "Deadline pressure hits. You:",
    crossCheck: true,
    insight: 'How you behave under pressure reveals your true operating level — not your aspirational one. The gap between "what I do when relaxed" and "what I do under stress" is your real skill floor.<div class="source">— Deloitte Human Capital Trends 2025</div>',
    options: [
      { text: "Revert to manual — no time to experiment", scores: { adaptability: -1 }, level: 1 },
      { text: "Quick AI answers for speed", scores: { usage_depth: 1 }, level: 2 },
      { text: "Reuse my existing workflows", scores: { workflow: 2 }, level: 3 },
      { text: "Automate the urgent parts quickly", scores: { system: 2 }, level: 4 },
      { text: "Rely on systems I've already built", scores: { builder: 2, system: 1 }, level: 5 }
    ]
  }
];
