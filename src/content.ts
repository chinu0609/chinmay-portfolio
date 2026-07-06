export interface Line {
  text: string;
  cls?: string;
  href?: string;
}

export const WHOAMI: Line[] = [
  { text: 'chinmay hemant bhosale — ai engineer, kolhapur, india.' },
  { text: 'hands-on experience building and deploying agentic AI systems' },
  { text: 'in production SaaS environments.' },
];

export const ABOUT: Line[] = [
  { text: 'AI engineer with hands-on experience building and deploying' },
  { text: 'agentic AI systems in production SaaS environments. Passionate' },
  { text: 'about helping customers unlock value from AI-driven features' },
  { text: 'through scalable, tech-first engagement strategies — designing' },
  { text: 'automation pipelines, translating complex AI capabilities into' },
  { text: 'actionable workflows, and communicating technical concepts' },
  { text: 'clearly to diverse stakeholders.' },
  { text: '' },
  { text: 'I work at Applied AI Consulting on OpsRabbit (opsrabbit.io), an' },
  { text: 'AI-native observability platform for ITOps/DevOps/SRE teams. I' },
  { text: 'drive end-to-end implementation of agentic AI systems that reason' },
  { text: 'over multi-source logs, automate root-cause analysis, and run' },
  { text: 'trigger-based orchestration pipelines — translating that into' },
  { text: 'actionable product workflows for customer onboarding and deep' },
  { text: 'product activation, and converting technical outputs into clear,' },
  { text: 'business-relevant insights for non-technical stakeholders.' },
  { text: '' },
  { text: 'IEEE-published researcher, open-source contributor (Cognee,' },
  { text: 'LlamaIndex), and Smart India Hackathon Grand Finalist with a' },
  { text: 'proven track record of building impactful AI products end-to-end.' },
];

export const SKILLS: Line[] = [
  { text: 'languages         : Python, C++' },
  { text: 'ai / ml           : LLMs, Agentic AI, RAG, Multi-Agent Systems, Deep Learning' },
  { text: 'frameworks        : LangChain, LangGraph, LlamaIndex, Cognee, Ollama, Hugging Face, PyTorch, TensorFlow' },
  { text: 'backend           : FastAPI, REST APIs, workflow automation, CRM data pipelines' },
  { text: 'cloud / devops    : AWS, Docker, Linux, Git, distributed systems, cloud observability' },
  { text: 'data              : NumPy, Pandas, Plotly, Matplotlib, vector databases' },
];

export const PROJECTS: Line[] = [
  { text: '- OpsRabbit — agentic AI cloud observability platform. End-to-end' },
  { text: '  agentic systems for autonomous incident diagnosis, multi-source' },
  { text: '  log reasoning + automated RCA, trigger-based orchestration,' },
  { text: '  scalable AWS backend for concurrent customer workloads.' },
  { text: '' },
  { text: '- FastAPI Garbage Detection System — Smart India Hackathon Grand' },
  { text: '  Finalist, 2024 (50,000+ teams nationwide). Real-time CV pipeline' },
  { text: '  over live camera feeds, DeepSort tracking (+40% reliability over' },
  { text: '  single-frame baselines), LLM-generated recommendations cutting' },
  { text: '  response time from hours to seconds.' },
  { text: '' },
  { text: '- Business Contract Validation System — Intel Unnati, 2024. RAG-' },
  { text: '  based contract clause validation, semantic document indexing so' },
  { text: '  non-technical users can query contracts in natural language,' },
  { text: '  local LLM inference (privacy-preserving, no cloud dependency).' },
  { text: '' },
  { text: '- Hysteresis Curve Analyzer — copyright-registered software, 2024.' },
  { text: '  Sole developer. Automated memristor hysteresis data analysis for' },
  { text: '  Shivaji University\'s NanoScience Dept, cutting manual review time' },
  { text: '  by 80% and parameter extraction from hours to seconds.' },
];

export const EXPERIENCE: Line[] = [
  { text: 'Applied AI Consulting — AI Engineer          Feb 2025 – Present', cls: 'amber' },
  { text: '  opsrabbit.io — agentic AI for cloud observability', cls: 'teal', href: 'https://opsrabbit.io' },
  { text: '  - drove end-to-end agentic AI systems so customers autonomously' },
  { text: '    diagnose & resolve infrastructure incidents' },
  { text: '  - translated multi-source log reasoning + automated RCA into' },
  { text: '    actionable product workflows for customer onboarding' },
  { text: '  - designed trigger-based orchestration pipelines surfacing' },
  { text: '    contextual recommendations from anomalous system states' },
  { text: '  - built scalable AWS backend for concurrent customer workloads' },
  { text: '  tech: Python, FastAPI, LangChain, LangGraph, LLMs, AWS' },
  { text: '' },
  { text: 'Shivaji University, Kolhapur — Research Intern          2025', cls: 'amber' },
  { text: '  NanoScience Department' },
  { text: '  - automated the full memristor hysteresis analysis pipeline' },
  { text: '    (-80% manual review time, 5x more experimental cycles/week)' },
  { text: '  - built an interactive Streamlit dashboard replacing ad-hoc' },
  { text: '    spreadsheet workflows, adopted lab-wide' },
  { text: '  - delivered Hysteresis Curve Analyzer, copyright-registered' },
  { text: '  tech: Python, Streamlit, NumPy, Pandas, Plotly, Matplotlib' },
  { text: '' },
  { text: 'ArthaVedh Consulting Pvt. Ltd. — ML Intern          2024', cls: 'amber' },
  { text: '  - built ML pipelines for financial time-series forecasting' },
  { text: '  - automated data processing workflows, freeing analyst time' },
  { text: '    for higher-value advisory work' },
  { text: '  tech: Python, PyTorch, Pandas, NumPy' },
  { text: '' },
  { text: 'education:', cls: 'teal' },
  { text: '  B.Tech, CS (AI & ML) — KIT\'s College of Engineering, Kolhapur (2025)' },
  { text: '    coursework: ML, Deep Learning, AI, Data Structures, Computer Vision' },
  { text: '  HSC, Gopal Krushna Gokhale College, Kolhapur (2021) — 96.5%' },
  { text: '  SSC, St. Xavier\'s High School, Kolhapur (2019) — 89%' },
  { text: '' },
  { text: 'publications & recognition:', cls: 'teal' },
  { text: '  IEEE AISP Conference, 2024 — deep-learning-based automated' },
  { text: '    question generation for exam systems (-70% manual content' },
  { text: '    creation effort in test environments)' },
  { text: '  Smart India Hackathon Grand Finalist, 2024 (50,000+ teams)' },
  { text: '  Copyright Registered Software — Hysteresis Curve Analyzer, 2024' },
  { text: '' },
  { text: 'open source:', cls: 'teal' },
  { text: '  Cognee (cognee.ai) — persistent, structured LLM memory', cls: 'teal', href: 'https://cognee.ai' },
  { text: '    Sep 2025 – Present' },
  { text: '  LlamaIndex (llamaindex.ai) — LLM data indexing & retrieval', cls: 'teal', href: 'https://llamaindex.ai' },
  { text: '    2025 – Present' },
];

export const CONTACT: Line[] = [
  { text: 'email     → chinmayhbhosale02@gmail.com', cls: 'teal', href: 'mailto:chinmayhbhosale02@gmail.com' },
  { text: 'github    → github.com/chinu0609', cls: 'teal', href: 'https://github.com/chinu0609' },
  {
    text: 'linkedin  → linkedin.com/in/chinmay-bhosale-31340231a',
    cls: 'teal',
    href: 'https://www.linkedin.com/in/chinmay-bhosale-31340231a/',
  },
];
