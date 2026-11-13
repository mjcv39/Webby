/* Tessera — simulated data. Every company, system and figure is hypothetical. */
window.T = window.T || {};
T.pages = {}; T.cleanup = []; T.state = {};
(function (T) {
  const day = 86400000;
  T.daysAgo = n => new Date(Date.now() - n * day);
  T.inDays = n => new Date(Date.now() + n * day);
  T.fmt = d => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  T.COMPANY = 'Halvorsen Group (fictional)';

  T.RISK = {
    prohibited: { label: 'Prohibited', color: '#ff4d6d', art: 'Article 5', blurb: 'Banned outright' },
    high: { label: 'High risk', color: '#f1745e', art: 'Article 6 · Annexes I & III', blurb: 'Strict requirements' },
    limited: { label: 'Limited risk', color: '#edd0ac', art: 'Article 50', blurb: 'Must disclose AI' },
    minimal: { label: 'Minimal risk', color: '#7fd1c7', art: 'No specific AI Act duties', blurb: 'Free to use' }
  };

  /* Models offered in the registry. `kind` distinguishes GPAI models from other AI. */
  T.PROVIDERS = [
    { id: 'openai', name: 'OpenAI', color: '#10a37f', models: [
      { id: 'gpt-5', name: 'GPT-5', access: 'Proprietary API', kind: 'General-purpose model' },
      { id: 'gpt-4o', name: 'GPT-4o', access: 'Proprietary API', kind: 'General-purpose model' }] },
    { id: 'anthropic', name: 'Anthropic', color: '#d4825b', models: [
      { id: 'claude-opus', name: 'Claude Opus', access: 'Proprietary API', kind: 'General-purpose model' },
      { id: 'claude-sonnet', name: 'Claude Sonnet', access: 'Proprietary API', kind: 'General-purpose model' },
      { id: 'claude-haiku', name: 'Claude Haiku', access: 'Proprietary API', kind: 'General-purpose model' }] },
    { id: 'google', name: 'Google', color: '#4285f4', models: [
      { id: 'gemini-pro', name: 'Gemini Pro', access: 'Proprietary API', kind: 'General-purpose model' },
      { id: 'gemini-flash', name: 'Gemini Flash', access: 'Proprietary API', kind: 'General-purpose model' }] },
    { id: 'meta', name: 'Meta', color: '#0a7cff', models: [
      { id: 'llama-4', name: 'Llama 4', access: 'Open weights', kind: 'General-purpose model' },
      { id: 'llama-3', name: 'Llama 3.3', access: 'Open weights', kind: 'General-purpose model' }] },
    { id: 'microsoft', name: 'Microsoft', color: '#00a4ef', models: [
      { id: 'copilot', name: 'Microsoft Copilot', access: 'SaaS product', kind: 'AI system built on GPAI models' },
      { id: 'azure-openai', name: 'Azure OpenAI Service', access: 'Cloud API', kind: 'General-purpose model' },
      { id: 'phi', name: 'Phi (small models)', access: 'Open weights', kind: 'General-purpose model' }] },
    { id: 'mistral', name: 'Mistral AI', color: '#ff7a1a', models: [
      { id: 'mistral-large', name: 'Mistral Large', access: 'Proprietary API', kind: 'General-purpose model' },
      { id: 'mixtral', name: 'Mixtral', access: 'Open weights', kind: 'General-purpose model' }] },
    { id: 'deepseek', name: 'DeepSeek', color: '#5b6cff', models: [
      { id: 'deepseek-v3', name: 'DeepSeek-V3', access: 'Open weights', kind: 'General-purpose model' },
      { id: 'deepseek-r1', name: 'DeepSeek-R1', access: 'Open weights', kind: 'General-purpose model' }] },
    { id: 'other', name: 'Other / in-house', color: '#8b5cf6', models: [
      { id: 'internal-ml', name: 'In-house custom model', access: 'Internally developed', kind: 'Purpose-built AI system' },
      { id: 'oss-hf', name: 'Open-source model (Hugging Face)', access: 'Open source', kind: 'Open-source model' },
      { id: 'vendor-saas', name: 'Third-party AI SaaS tool', access: 'Vendor-managed', kind: 'AI system from a vendor' }] }
  ];
  T.modelIndex = {};
  T.PROVIDERS.forEach(p => p.models.forEach(m => { m.provider = p.name; m.providerId = p.id; m.color = p.color; T.modelIndex[m.id] = m; }));

  /* Registered AI systems (the Halvorsen Group portfolio) */
  const S = (id, name, provider, model, use, dept, cls, status, assessed, score, open, owner, env, origin, useId) =>
    ({ id, name, provider, model, use, dept, cls, status, assessed: T.daysAgo(assessed), score, open, owner, env, origin, useId });
  T.systems = [
    S('S-001', 'TalentRank CV Screener', 'OpenAI', 'GPT-5', 'Ranks and shortlists job applicants from CVs', 'Human Resources', 'high', 'Action required', 6, 58, 7, 'Ines Kowalski', 'Production', 'Third-party model', 'h-recruit'),
    S('S-002', 'Credit Decision Assist', 'Meta', 'Llama 3.3 (fine-tuned)', 'Creditworthiness scoring for consumer loans', 'Retail Banking', 'high', 'In progress', 12, 66, 6, 'Marcus Adeyemi', 'Production', 'Fine-tuned open model', 'h-credit'),
    S('S-003', 'Premium Pricing Engine', 'Mistral AI', 'Mistral Large', 'Risk assessment & pricing for health insurance', 'Underwriting', 'high', 'Under review', 21, 71, 5, 'Sofia Lindqvist', 'Production', 'Third-party model', 'h-insure'),
    S('S-004', 'Academy Assessment Scorer', 'Anthropic', 'Claude Sonnet', 'Evaluates learning outcomes of trainees', 'Learning & Development', 'high', 'In progress', 17, 74, 4, 'Tom Brandt', 'Pilot', 'Third-party model', 'h-learning'),
    S('S-005', 'Grid Load Safety Monitor', 'In-house', 'Custom vision/forecast model', 'Safety component managing energy-grid load', 'Operations', 'high', 'Compliant', 9, 92, 1, 'Priya Raman', 'Production', 'Internally developed', 'h-infra'),
    S('S-006', 'Aria Customer Chatbot', 'Anthropic', 'Claude Haiku', 'Customer-support chatbot on website and app', 'Customer Service', 'limited', 'Compliant', 14, 91, 1, 'Lena Fischer', 'Production', 'Third-party model', 'l-chatbot'),
    S('S-007', 'Campaign Visual Studio', 'Google', 'Gemini Pro (image)', 'Generates marketing images and video', 'Marketing', 'limited', 'In progress', 5, 78, 3, 'Diego Morales', 'Production', 'Third-party model', 'l-genimage'),
    S('S-008', 'VoiceLine Assistant', 'Microsoft', 'Azure OpenAI Service', 'Voice agent handling inbound calls', 'Customer Service', 'limited', 'Action required', 3, 62, 4, 'Lena Fischer', 'Pilot', 'Third-party model', 'l-voice'),
    S('S-009', 'Newsroom Draft Publisher', 'Meta', 'Llama 4', 'Publishes AI-written briefs on public-interest topics', 'Corporate Comms', 'limited', 'Under review', 26, 69, 3, 'Hana Sato', 'Production', 'Open-weights model', 'l-textpub'),
    S('S-010', 'Onboarding Avatar Presenter', 'Google', 'Gemini Flash', 'Synthetic presenter avatars for onboarding videos', 'Human Resources', 'limited', 'Compliant', 33, 88, 1, 'Ines Kowalski', 'Production', 'Third-party model', 'l-deepfake'),
    S('S-011', 'Meeting Summaries', 'Microsoft', 'Microsoft Copilot', 'Summarises internal meetings', 'Operations', 'minimal', 'Compliant', 40, 96, 0, 'Priya Raman', 'Production', 'SaaS product', 'm-summary'),
    S('S-012', 'MailGuard Spam Filter', 'In-house', 'Custom classifier', 'Filters spam and phishing emails', 'IT', 'minimal', 'Compliant', 52, 97, 0, 'Jonas Weber', 'Production', 'Internally developed', 'm-spam'),
    S('S-013', 'DevAssist Code Review', 'DeepSeek', 'DeepSeek-V3', 'Suggests improvements during code review', 'Engineering', 'minimal', 'Under review', 8, 80, 2, 'Aiko Tanaka', 'Production', 'Open-weights model', 'm-code'),
    S('S-014', 'DocuSum Report Summariser', 'OpenAI', 'GPT-4o', 'Summarises long internal reports', 'Finance', 'minimal', 'Compliant', 29, 95, 0, 'Marcus Adeyemi', 'Production', 'Third-party model', 'm-summary'),
    S('S-015', 'Demand Forecaster', 'In-house', 'Custom forecasting model', 'Forecasts product demand and inventory', 'Supply Chain', 'minimal', 'Compliant', 61, 98, 0, 'Jonas Weber', 'Production', 'Internally developed', 'm-forecast'),
    S('S-016', 'Translate Hub', 'Google', 'Gemini Flash', 'Translates internal documents', 'Operations', 'minimal', 'Compliant', 47, 94, 0, 'Priya Raman', 'Production', 'Third-party model', 'm-translate'),
    S('S-017', 'MoodLens Call Analytics', 'In-house', 'Custom emotion model', 'Infers call-centre agents’ emotions during shifts', 'Customer Service', 'prohibited', 'Blocked', 2, 12, 4, 'Lena Fischer', 'Suspended', 'Internally developed', 'p-emotion'),
    S('S-018', 'FaceHarvest Pilot', 'Open source', 'Face-embedding model', 'Scrapes facial images to build a recognition database', 'Security', 'prohibited', 'Blocked', 1, 8, 4, 'Jonas Weber', 'Suspended', 'Open-source model', 'p-scrape')
  ];

  /* Documents */
  T.DOC_CATS = ['Inventory', 'Risk Assessment', 'Technical Documentation', 'Data Governance', 'Human Oversight', 'Model Evaluation', 'Transparency', 'Audit Log', 'Checklist', 'Incident Report'];
  const D = (id, name, cat, sys, upd, status, ver) => ({ id, name, cat, sys, upd: T.daysAgo(upd), status, ver });
  T.docs = [
    D('D-101', 'AI System Inventory — Group Register', 'Inventory', 'All systems', 1, 'Approved', 'v14.2'),
    D('D-102', 'Risk Assessment Report — TalentRank', 'Risk Assessment', 'S-001', 6, 'In review', 'v3.1'),
    D('D-103', 'Risk Assessment Report — Credit Decision Assist', 'Risk Assessment', 'S-002', 12, 'Approved', 'v2.4'),
    D('D-104', 'Technical Documentation (Annex IV) — Credit Decision Assist', 'Technical Documentation', 'S-002', 38, 'Outdated', 'v1.7'),
    D('D-105', 'Technical Documentation (Annex IV) — TalentRank', 'Technical Documentation', 'S-001', 0, 'Draft', 'v0.6'),
    D('D-106', 'Data Governance Record — Training & Validation Data', 'Data Governance', 'S-002', 19, 'Approved', 'v2.0'),
    D('D-107', 'Data Governance Record — Candidate Data', 'Data Governance', 'S-001', 4, 'In review', 'v1.2'),
    D('D-108', 'Human Oversight Procedure — Premium Pricing', 'Human Oversight', 'S-003', 25, 'In review', 'v1.1'),
    D('D-109', 'Human Oversight Procedure — Grid Load Monitor', 'Human Oversight', 'S-005', 15, 'Approved', 'v2.2'),
    D('D-110', 'Model Evaluation Report — Bias & Robustness (TalentRank)', 'Model Evaluation', 'S-001', 10, 'In review', 'v1.0'),
    D('D-111', 'Model Evaluation Report — Aria Chatbot Quality', 'Model Evaluation', 'S-006', 22, 'Approved', 'v1.5'),
    D('D-112', 'Transparency Disclosure — Aria Chatbot', 'Transparency', 'S-006', 14, 'Approved', 'v1.3'),
    D('D-113', 'Transparency Disclosure — VoiceLine Assistant', 'Transparency', 'S-008', 3, 'Missing', '—'),
    D('D-114', 'Content Marking Policy — Campaign Visual Studio', 'Transparency', 'S-007', 5, 'Draft', 'v0.4'),
    D('D-115', 'Audit Log Export — Q3 Access & Changes', 'Audit Log', 'All systems', 30, 'Approved', 'Q3'),
    D('D-116', 'High-Risk Compliance Checklist — Credit Decision Assist', 'Checklist', 'S-002', 2, 'In review', 'v2.0'),
    D('D-117', 'High-Risk Compliance Checklist — TalentRank', 'Checklist', 'S-001', 1, 'Draft', 'v1.0'),
    D('D-118', 'Incident Report — Chatbot Hallucinated Policy Claim', 'Incident Report', 'S-006', 44, 'Approved', 'INC-2026-007'),
    D('D-119', 'Incident Report — MoodLens Prohibited-Practice Escalation', 'Incident Report', 'S-017', 2, 'In review', 'INC-2026-012'),
    D('D-120', 'Inventory Entry — Shadow AI Tool “PixelForge”', 'Inventory', 'Unregistered', 1, 'Draft', 'v0.1')
  ];

  /* Monitoring alerts */
  T.alerts = [
    { id: 'A-1', sev: 'critical', type: 'Prohibited-use flag', sys: 'S-017', title: 'Emotion inference of employees detected',
      what: 'MoodLens infers call-centre agents’ emotional state during shifts.', why: 'Emotion recognition in the workplace is a prohibited practice under Art. 5(1)(f) (narrow medical/safety exceptions only). Fines reach up to €35M or 7% of worldwide turnover.', action: 'Keep the system suspended, escalate to Legal & the AI Governance Board, and document the decommissioning decision.', ago: '2 days ago' },
    { id: 'A-2', sev: 'high', type: 'Model updated', sys: 'S-001', title: 'Underlying model version changed — reassessment required',
      what: 'The provider released a new GPT-5 minor version that TalentRank now calls automatically.', why: 'A substantial change to a high-risk system can invalidate prior testing and the conformity evidence built on it.', action: 'Re-run bias and robustness evaluation, update Annex IV documentation, and re-approve before the new version serves candidates.', ago: '3 hours ago' },
    { id: 'A-3', sev: 'high', type: 'Missing documentation', sys: 'S-002', title: 'Technical documentation is outdated',
      what: 'Annex IV technical documentation was last updated 38 days ago, before the latest model fine-tune.', why: 'High-risk providers must keep technical documentation current (Art. 11). Gaps delay conformity assessment.', action: 'Assign the model owner to refresh sections 2 (design) and 4 (validation) and attach the new evaluation report.', ago: '1 day ago' },
    { id: 'A-4', sev: 'medium', type: 'Unapproved deployment', sys: 'Unregistered', title: 'Shadow AI tool “PixelForge” found in Marketing',
      what: 'Network discovery found 14 users sending brand assets to an AI image tool that is not in the registry.', why: 'Unregistered tools have no owner, risk classification or content-marking process, so transparency duties may be missed.', action: 'Register the tool, classify its intended use and either approve with controls or block access.', ago: '6 hours ago' },
    { id: 'A-5', sev: 'medium', type: 'Data governance', sys: 'S-006', title: 'Chat transcripts retained beyond policy',
      what: 'Aria chatbot logs containing personal data exceed the 90-day retention limit.', why: 'Excess retention creates data-protection exposure (GDPR) alongside AI governance gaps.', action: 'Apply the retention rule, purge expired logs and add a retention check to the monthly control run.', ago: '1 day ago' },
    { id: 'A-6', sev: 'medium', type: 'Deadline approaching', sys: 'S-002', title: 'Conformity-readiness review due in 21 days',
      what: 'The internal readiness review for Credit Decision Assist is due soon and 6 requirements remain open.', why: 'High-risk obligations for Annex III systems are approaching, and missed internal gates compress the remaining time.', action: 'Close open requirements or request a scoped extension from the governance board.', ago: 'Today' },
    { id: 'A-7', sev: 'high', type: 'Human oversight', sys: 'S-003', title: 'Human override rate dropped to 2%',
      what: 'Underwriters now accept 98% of AI pricing recommendations without changes.', why: 'Very low override rates can signal automation bias and weak effective human oversight (Art. 14).', action: 'Sample and audit decisions, retrain reviewers, and add mandatory review for edge-case premiums.', ago: '5 hours ago' }
  ];

  T.deadlines = [
    { label: 'TalentRank — Annex IV documentation freeze', date: T.inDays(21), tag: 'Internal', sys: 'S-001' },
    { label: 'Credit Decision Assist — readiness review', date: T.inDays(21), tag: 'Internal', sys: 'S-002' },
    { label: 'VoiceLine — publish AI-interaction disclosure', date: T.inDays(10), tag: 'Transparency', sys: 'S-008' },
    { label: 'Annex III high-risk obligations apply (as amended by the Digital Omnibus)', date: new Date('2027-12-02'), tag: 'EU AI Act', sys: '' },
    { label: 'Annex I (product-embedded) high-risk obligations apply (as amended)', date: new Date('2028-08-02'), tag: 'EU AI Act', sys: '' }
  ];

  T.activity = [
    { t: '12 min ago', icon: 'refresh', text: 'Re-assessment of <b>TalentRank CV Screener</b> started by Ines Kowalski' },
    { t: '1 h ago', icon: 'file', text: 'Document <b>Technical Documentation — TalentRank</b> saved as draft v0.6' },
    { t: '3 h ago', icon: 'alert', text: 'Alert raised: model version changed on <b>TalentRank CV Screener</b>' },
    { t: '5 h ago', icon: 'check', text: '<b>Aria Customer Chatbot</b> disclosure banner verified live' },
    { t: 'Yesterday', icon: 'scan', text: 'Shadow-AI scan discovered <b>PixelForge</b> (unregistered)' },
    { t: 'Yesterday', icon: 'users', text: 'AI Governance Board approved <b>Grid Load Safety Monitor</b> annual review' },
    { t: '2 days ago', icon: 'shield', text: '<b>MoodLens Call Analytics</b> suspended after prohibited-use flag' }
  ];
  T.activityPool = [
    { icon: 'scan', text: 'Scheduled discovery scan completed — <b>0 new</b> unregistered tools' },
    { icon: 'check', text: 'Human-oversight sample review passed for <b>Grid Load Safety Monitor</b>' },
    { icon: 'file', text: 'Evidence file attached to <b>Credit Decision Assist</b> checklist item 4' },
    { icon: 'alert', text: 'Drift indicator for <b>Premium Pricing Engine</b> crossed warning threshold' },
    { icon: 'refresh', text: 'Provider changelog check: <b>Claude Haiku</b> — no material change' },
    { icon: 'users', text: 'Owner assigned: <b>DevAssist Code Review</b> → Aiko Tanaka' },
    { icon: 'check', text: 'Disclosure text for <b>VoiceLine Assistant</b> approved by Legal' }
  ];
  T.recent = [
    { sys: 'S-001', result: 'high', ago: 6 }, { sys: 'S-007', result: 'limited', ago: 5 },
    { sys: 'S-013', result: 'minimal', ago: 8 }, { sys: 'S-017', result: 'prohibited', ago: 2 }, { sys: 'S-005', result: 'high', ago: 9 }
  ];

  T.outstanding = [
    { k: 'Technical documentation', v: 11 }, { k: 'Data governance', v: 8 }, { k: 'Human oversight', v: 7 },
    { k: 'Transparency disclosures', v: 7 }, { k: 'Risk management', v: 6 }, { k: 'Registration & conformity', v: 5 }
  ];
  T.trend = [52, 54, 53, 58, 61, 60, 64, 67, 66, 70, 72, 74];
  T.trendLabels = ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];

  T.getSystem = id => T.systems.find(s => s.id === id);
})(window.T);
