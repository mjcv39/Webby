/* Tessera — simulated classification engine (frontend only, rule-based, educational). */
(function (T) {
  /* Requirement catalogue (article references are to Regulation (EU) 2024/1689) */
  T.REQ = {
    'prohibit': { title: 'Do not place on the market, put into service or use', art: 'Art. 5', who: 'both', desc: 'Prohibited practices may not be offered or used in the EU. Only narrow, specifically defined exceptions exist.' },
    'p-exc': { title: 'Check whether a narrow exception could apply', art: 'Art. 5', who: 'both', desc: 'Some prohibitions carry limited exceptions (e.g. medical or safety reasons). Legal review is essential.' },
    'p-fine': { title: 'Understand penalty exposure', art: 'Art. 99(3)', who: 'both', desc: 'Up to €35 million or 7% of total worldwide annual turnover, whichever is higher (SMEs: whichever is lower).' },
    'p-doc': { title: 'Document the decision and decommission', art: 'Governance', who: 'both', desc: 'Record who decided, why, and confirm the system and its data pipelines are disabled.' },
    'r9': { title: 'Risk management system', art: 'Art. 9', who: 'provider', desc: 'Continuous, documented process to identify, evaluate and mitigate risks across the lifecycle.' },
    'r10': { title: 'Data and data governance', art: 'Art. 10', who: 'provider', desc: 'Training, validation and testing data must be relevant, representative and examined for bias.' },
    'r11': { title: 'Technical documentation', art: 'Art. 11 · Annex IV', who: 'provider', desc: 'Detailed documentation demonstrating compliance, drawn up before market placement and kept up to date.' },
    'r12': { title: 'Record-keeping (automatic logs)', art: 'Art. 12', who: 'provider', desc: 'The system must automatically record events so that its operation can be traced.' },
    'r13': { title: 'Transparency & instructions for use', art: 'Art. 13', who: 'provider', desc: 'Deployers receive clear instructions on capabilities, limits, accuracy and oversight needs.' },
    'r14': { title: 'Human oversight', art: 'Art. 14', who: 'provider', desc: 'Designed so natural persons can effectively oversee, understand, override or stop the system.' },
    'r15': { title: 'Accuracy, robustness & cybersecurity', art: 'Art. 15', who: 'provider', desc: 'Appropriate performance levels, resilience to errors and attacks, declared in the instructions.' },
    'r17': { title: 'Quality management system', art: 'Art. 17', who: 'provider', desc: 'Documented policies and procedures covering design, testing, change control and incident handling.' },
    'r43': { title: 'Conformity assessment, EU declaration & CE marking', art: 'Arts. 43, 47, 48', who: 'provider', desc: 'Demonstrate conformity (often by internal control; some cases need a notified body) before placing on the market.' },
    'r49': { title: 'Registration in the EU database', art: 'Art. 49', who: 'provider', desc: 'High-risk systems are registered in the EU database before being placed on the market or put into service.' },
    'r72': { title: 'Post-market monitoring & serious-incident reporting', art: 'Arts. 72–73', who: 'provider', desc: 'Actively collect performance data and report serious incidents to market-surveillance authorities.' },
    'd26': { title: 'Deployer duties: use as instructed, assign oversight, keep logs', art: 'Art. 26', who: 'deployer', desc: 'Use according to instructions, assign trained overseers, monitor operation, keep logs (at least six months) and inform workers.' },
    'd27': { title: 'Fundamental rights impact assessment (certain deployers)', art: 'Art. 27', who: 'deployer', desc: 'Required for public bodies, private entities providing public services and deployers of credit-scoring or life/health-insurance systems.' },
    'd86': { title: 'Explain individual decisions on request', art: 'Art. 86', who: 'deployer', desc: 'Affected persons can obtain clear explanations of the role of the AI system in decisions with legal or similar effects.' },
    'lit': { title: 'AI literacy of staff', art: 'Art. 4', who: 'both', desc: 'Providers and deployers must ensure a sufficient level of AI literacy of the people operating AI systems. Applicable since 2 Feb 2025.' },
    't1': { title: 'Tell people they are interacting with an AI system', art: 'Art. 50(1)', who: 'provider', desc: 'Design the system so users are informed, unless it is obvious from the context.' },
    't2': { title: 'Mark synthetic audio, image, video or text outputs', art: 'Art. 50(2)', who: 'provider', desc: 'Outputs must be marked in a machine-readable format and detectable as artificially generated, where technically feasible.' },
    't3': { title: 'Inform people exposed to emotion recognition or biometric categorisation', art: 'Art. 50(3)', who: 'deployer', desc: 'Deployers must tell the people concerned that the system is operating, and process data in line with data-protection law.' },
    't4': { title: 'Disclose deepfakes and AI-generated public-interest text', art: 'Art. 50(4)', who: 'deployer', desc: 'Deepfakes must be disclosed. AI-generated text published to inform the public on matters of public interest must be disclosed unless it has human editorial review and responsibility.' },
    'v95': { title: 'Consider voluntary codes of conduct', art: 'Art. 95', who: 'both', desc: 'Providers and deployers are encouraged to apply high-risk-style good practices voluntarily.' },
    'oth': { title: 'Check other laws (GDPR, copyright, consumer, sector rules)', art: 'Other EU/national law', who: 'both', desc: 'Minimal AI Act risk does not mean no legal obligations. Data protection, IP and consumer law still apply.' },
    'inv': { title: 'Keep the system in the inventory with a named owner', art: 'Good practice', who: 'both', desc: 'Visibility lets you notice if the intended purpose changes and the classification with it.' }
  };
  const HIGH = ['r9', 'r10', 'r11', 'r12', 'r13', 'r14', 'r15', 'r17', 'r43', 'r49', 'r72', 'd26', 'd27', 'd86', 'lit'];
  const MIN = ['lit', 'v95', 'oth', 'inv'];
  const PROH = ['prohibit', 'p-exc', 'p-fine', 'p-doc'];

  const U = (id, cls, label, ref, kw, why, o) => Object.assign({ id, cls, label, ref, kw, why }, o || {});
  const HI_NEXT = ['Confirm whether you are the provider, the deployer, or both', 'Start the risk-management file and an Annex IV technical-documentation pack', 'Define human-oversight roles and test override procedures', 'Run bias and robustness evaluation on representative data', 'Plan conformity assessment and EU database registration'];
  T.USE_CASES = [
    // Prohibited
    U('p-manip', 'prohibited', 'Subliminal or manipulative techniques that distort users’ decisions', 'Art. 5(1)(a)', ['subliminal', 'manipulat', 'deceptive technique', 'dark pattern'], 'AI that uses subliminal, purposefully manipulative or deceptive techniques to materially distort behaviour and cause significant harm is prohibited.'),
    U('p-vuln', 'prohibited', 'Exploiting vulnerabilities (age, disability, social or economic situation)', 'Art. 5(1)(b)', ['exploit vulnerab', 'target children', 'toy', 'elderly', 'vulnerable group'], 'Exploiting vulnerabilities due to age, disability or a specific social or economic situation to distort behaviour in a harmful way is prohibited.'),
    U('p-social', 'prohibited', 'Social scoring of people leading to unjustified detrimental treatment', 'Art. 5(1)(c)', ['social scor', 'citizen scor', 'social credit', 'trustworthiness score'], 'Evaluating or classifying people over time based on social behaviour or personality traits, where the score leads to unjustified or disproportionate detrimental treatment, is prohibited.'),
    U('p-emotion', 'prohibited', 'Emotion recognition of employees or students', 'Art. 5(1)(f)', ['emotion', 'mood', 'sentiment of employee', 'engagement of student'], 'Inferring emotions of people in the workplace or in education institutions is prohibited, except for medical or safety reasons.'),
    U('p-scrape', 'prohibited', 'Scraping facial images to build recognition databases', 'Art. 5(1)(e)', ['scrap', 'harvest', 'facial database', 'face database'], 'Building or expanding facial-recognition databases through untargeted scraping of images from the internet or CCTV is prohibited.'),
    U('p-biocat', 'prohibited', 'Biometric categorisation inferring sensitive traits', 'Art. 5(1)(g)', ['categoris', 'categoriz', 'infer political', 'infer religio', 'infer sexual', 'infer race'], 'Categorising people by biometric data to infer race, political opinions, religion, sexual orientation and similar sensitive traits is prohibited (with narrow law-enforcement-related labelling exceptions).'),
    U('p-rbi', 'prohibited', 'Real-time remote biometric identification in public spaces for law enforcement', 'Art. 5(1)(h)', ['real-time biometric', 'live facial recognition', 'live face recognition', 'public space'], 'Real-time remote biometric identification in publicly accessible spaces for law enforcement is prohibited except in strictly defined, authorised situations.'),
    // High-risk
    U('h-recruit', 'high', 'Recruitment: screening, ranking or selecting job applicants', 'Annex III(4)(a)', ['recruit', 'candidate', 'cv', 'resume', 'applicant', 'hiring', 'job screen', 'shortlist'], 'AI used to recruit or select people, for example to place targeted job ads, filter applications or evaluate candidates, is listed as high-risk in Annex III.'),
    U('h-work', 'high', 'Employee evaluation, promotion, termination or task allocation', 'Annex III(4)(b)', ['promotion', 'terminat', 'performance review', 'employee monitor', 'task allocation', 'workforce'], 'AI that makes or supports decisions on working conditions, promotion, termination, task allocation, or monitoring and evaluating worker performance is high-risk.'),
    U('h-credit', 'high', 'Creditworthiness assessment or credit scoring of individuals', 'Annex III(5)(b)', ['credit', 'loan', 'lending', 'mortgage', 'creditworth'], 'Evaluating the creditworthiness of natural persons or establishing their credit score is high-risk (except detecting financial fraud).'),
    U('h-insure', 'high', 'Risk assessment and pricing for life or health insurance', 'Annex III(5)(c)', ['insurance', 'premium', 'underwrit', 'actuar'], 'AI used for risk assessment and pricing of life and health insurance for individuals is high-risk.'),
    U('h-learning', 'high', 'Admissions, exam scoring or evaluating learning outcomes', 'Annex III(3)', ['admission', 'exam', 'student', 'grading', 'learning outcome', 'proctor', 'enrol', 'assessment of trainee', 'school', 'universit'], 'AI that determines access or admission to education, evaluates learning outcomes, assesses education levels, or monitors prohibited behaviour during tests is high-risk.'),
    U('h-benefit', 'high', 'Eligibility for public benefits and essential services', 'Annex III(5)(a)', ['benefit', 'welfare', 'public service', 'social security', 'eligib', 'housing'], 'AI used by or for public authorities to assess eligibility for essential public benefits and services is high-risk.'),
    U('h-emergency', 'high', 'Emergency call triage and dispatch prioritisation', 'Annex III(5)(d)', ['emergency', 'dispatch', '112', 'triage'], 'AI that evaluates and classifies emergency calls or prioritises emergency dispatch is high-risk.'),
    U('h-infra', 'high', 'Safety component in critical infrastructure (energy, water, traffic)', 'Annex III(2)', ['grid', 'energy', 'water supply', 'critical infrastructure', 'traffic control', 'power plant', 'pipeline'], 'AI used as a safety component in managing critical digital infrastructure, road traffic, or the supply of water, gas, heating and electricity is high-risk.'),
    U('h-biometric', 'high', 'Remote biometric identification (not real-time law-enforcement use)', 'Annex III(1)', ['biometric', 'face recogni', 'facial recogni', 'fingerprint', 'identification of people'], 'Remote biometric identification systems (other than mere verification) are high-risk where permitted; some uses are prohibited instead.'),
    U('h-law', 'high', 'Law enforcement, migration, border control or justice support', 'Annex III(6)–(8)', ['police', 'law enforcement', 'asylum', 'visa', 'border', 'court', 'judicial', 'polygraph', 'evidence'], 'Several AI uses by law-enforcement, migration, border-control and judicial authorities are listed as high-risk.'),
    U('h-medical', 'high', 'AI as a safety component of a regulated product (e.g. medical device)', 'Art. 6(1) · Annex I', ['medical device', 'diagnos', 'machinery', 'clinical', 'x-ray', 'radiolog'], 'AI that is a safety component of (or is itself) a product covered by Annex I harmonisation legislation and requires third-party conformity assessment is high-risk. These obligations apply later than Annex III.'),
    // Limited
    U('l-chatbot', 'limited', 'Customer-service chatbot or virtual assistant', 'Art. 50(1)', ['chatbot', 'chat bot', 'customer support', 'customer service', 'virtual assistant', 'help desk', 'conversational'], 'Systems that interact directly with people must make clear that they are AI systems unless this is obvious to a reasonably well-informed person.', { reqs: ['t1', 'lit', 'oth', 'inv'] }),
    U('l-genimage', 'limited', 'Generating marketing images, audio or video', 'Art. 50(2)', ['image generat', 'generate image', 'generates marketing', 'marketing image', 'video generat', 'synthetic media', 'text-to-image', 'generative image', 'generates images', 'image'], 'Providers of systems that generate synthetic audio, image, video or text must ensure outputs are marked in a machine-readable format and detectable as AI-generated.', { reqs: ['t2', 't4', 'lit', 'oth', 'inv'] }),
    U('l-deepfake', 'limited', 'Deepfakes or synthetic avatars resembling real people or places', 'Art. 50(4)', ['deepfake', 'avatar', 'face swap', 'synthetic presenter', 'lookalike'], 'Deployers of AI that generates or manipulates content constituting a deepfake must disclose that it is artificially generated or manipulated (lighter touch for evidently artistic or creative works).', { reqs: ['t2', 't4', 'lit', 'oth', 'inv'] }),
    U('l-voice', 'limited', 'Voice assistant or voice agent speaking with customers', 'Art. 50(1)', ['voice', 'call agent', 'phone bot', 'speech assistant', 'ivr', 'voice clon'], 'A voice agent interacts directly with people, so they must be informed they are speaking to an AI system. Synthetic audio output must also be marked.', { reqs: ['t1', 't2', 'lit', 'oth', 'inv'] }),
    U('l-textpub', 'limited', 'Publishing AI-written text on matters of public interest', 'Art. 50(4)', ['publish', 'news', 'press', 'article', 'public interest', 'ai-written'], 'AI-generated or manipulated text published to inform the public on matters of public interest must be disclosed, unless it undergoes human review or editorial control with someone holding editorial responsibility.', { reqs: ['t2', 't4', 'lit', 'oth', 'inv'] }),
    U('l-emotion', 'limited', 'Emotion recognition of customers (not workplace or education)', 'Art. 50(3)', ['customer emotion', 'shopper emotion', 'audience reaction'], 'Outside workplaces and education, emotion recognition and biometric categorisation are not banned by default, but deployers must inform exposed people. It may also be high-risk in some contexts (Annex III).', { reqs: ['t3', 'lit', 'oth', 'inv'] }),
    // Minimal
    U('m-write', 'minimal', 'General writing and drafting assistant for staff', 'No AI Act risk tier', ['writing', 'draft', 'email', 'brainstorm', 'productivity', 'assistant'], 'Everyday productivity assistance does not fall into a prohibited, high-risk or transparency category by itself.'),
    U('m-summary', 'minimal', 'Summarising internal documents or meetings', 'No AI Act risk tier', ['summar', 'meeting notes', 'minutes'], 'Routine summarisation for internal use carries few AI Act obligations, although confidentiality and data-protection rules still matter.'),
    U('m-spam', 'minimal', 'Spam and phishing filtering', 'No AI Act risk tier', ['spam', 'phishing', 'junk mail'], 'The Commission lists spam filters as a typical minimal-risk example.'),
    U('m-code', 'minimal', 'Code completion and code review suggestions', 'No AI Act risk tier', ['code', 'developer', 'programming', 'software engineer'], 'Developer assistance is typically minimal risk under the AI Act. Security, licensing and data-handling policies still apply.'),
    U('m-translate', 'minimal', 'Translating internal documents', 'No AI Act risk tier', ['translat'], 'Routine translation for internal use carries no specific AI Act duties beyond AI literacy.'),
    U('m-forecast', 'minimal', 'Demand and inventory forecasting', 'No AI Act risk tier', ['forecast', 'inventory', 'demand', 'predictive maintenance', 'logistic'], 'Business forecasting that does not decide about individuals is generally minimal risk.'),
    U('m-reco', 'minimal', 'Product recommendations in a web shop', 'No AI Act risk tier', ['recommend', 'personalis', 'personaliz', 'shop'], 'Recommenders are generally minimal under the AI Act, but other laws (e.g. the Digital Services Act and consumer law) can apply.')
  ];
  T.useIndex = {};
  T.USE_CASES.forEach(u => T.useIndex[u.id] = u);

  const SEV = { prohibited: 4, high: 3, limited: 2, minimal: 1 };

  /** Match free text to the best use case. */
  T.matchText = function (text) {
    const t = ' ' + (text || '').toLowerCase() + ' ';
    let best = null, bestScore = 0;
    T.USE_CASES.forEach(u => {
      const hits = u.kw.filter(k => t.includes(k)).length;
      if (!hits) return;
      const score = SEV[u.cls] * 10 + hits;
      if (score > bestScore) { best = u; bestScore = score; }
    });
    return best;
  };

  T.reqsFor = function (useCase, role) {
    let ids = useCase.reqs || ({ prohibited: PROH, high: HIGH, limited: ['t1', 't2', 't4', 'lit', 'oth', 'inv'], minimal: MIN })[useCase.cls];
    if (useCase.cls === 'high') {
      ids = HIGH.filter(id => {
        const w = T.REQ[id].who;
        return role === 'both' || w === 'both' || w === role;
      });
    } else if (useCase.cls === 'limited' && role !== 'both') {
      ids = ids.filter(id => { const w = T.REQ[id].who; return w === 'both' || w === role; });
    }
    return ids.map(id => Object.assign({ id }, T.REQ[id]));
  };

  const NEXT = {
    prohibited: ['Stop or suspend the system immediately', 'Escalate to Legal and the AI governance board', 'Assess whether a narrow statutory exception could genuinely apply', 'Record the decision and decommission related data pipelines'],
    high: HI_NEXT,
    limited: ['Add a clear AI-interaction or AI-content disclosure', 'Implement machine-readable marking of generated outputs where relevant', 'Assign an owner and verify the disclosure is live', 'Re-assess if the purpose changes (e.g. into recruitment or credit)'],
    minimal: ['Register the system and name an owner', 'Provide AI literacy guidance to users', 'Check data-protection, IP and security policies', 'Re-assess whenever the intended purpose changes']
  };
  const DOCS = {
    prohibited: ['Incident Report', 'Risk Assessment', 'Audit Log'],
    high: ['Risk Assessment', 'Technical Documentation', 'Data Governance', 'Human Oversight', 'Model Evaluation', 'Checklist'],
    limited: ['Transparency', 'Risk Assessment', 'Checklist'],
    minimal: ['Inventory', 'Checklist']
  };

  /** Main assessment. Classification is driven by intended purpose, never by the model name. */
  T.assess = function ({ modelId, useId, text, role }) {
    const model = T.modelIndex[modelId] || T.modelIndex['gpt-5'];
    role = role || 'both';
    let uc = useId ? T.useIndex[useId] : null, matched = !!uc, custom = null;
    if (!uc && text && text.trim()) {
      uc = T.matchText(text); matched = !!uc; custom = text.trim();
    }
    let fallback = false;
    if (!uc) { uc = T.useIndex['m-write']; fallback = true; }
    const purpose = custom || uc.label;
    const reqs = T.reqsFor(uc, role);
    const roleNote = role === 'provider' ? 'You are treated as the provider (you develop, brand or substantially modify the AI system).'
      : role === 'deployer' ? 'You are treated as a deployer (you use an AI system under your authority). Your provider must supply the evidence for provider obligations.'
        : 'You are treated as both provider and deployer, so both sets of duties are shown.';
    const modelNote = (model.kind === 'General-purpose model' || model.kind === 'Open-source model')
      ? `${model.provider} is the provider of the <b>${model.name}</b> general-purpose AI model and has its own obligations under Arts. 53–55 (e.g. technical documentation, copyright policy, training-data summary). Your classification concerns the <b>AI system you build or use with it</b>.`
      : model.kind === 'Purpose-built AI system' ? 'This is an internally developed AI system, so you are its provider and carry the provider obligations for the classification below.'
        : 'This is a packaged AI system or product. Ask the vendor for conformity and transparency evidence relevant to your intended purpose.';
    const sev = uc.cls;
    return {
      id: 'ASM-' + Math.random().toString(36).slice(2, 6).toUpperCase(),
      name: `${model.name} — ${(custom ? shorten(custom) : shorten(uc.label))}`,
      model, provider: model.provider, purpose, useCase: uc, cls: sev, ref: uc.ref, role, matched, fallback,
      why: fallback
        ? 'We could not match your description to a listed use case, so the demo defaults to minimal risk. In a real assessment you would check the description against Article 5, Annex III and Article 50 with a qualified professional.'
        : uc.why,
      reqs, next: NEXT[sev], docs: DOCS[sev], roleNote, modelNote,
      score: { prohibited: 8, high: 55, limited: 78, minimal: 96 }[sev],
      at: new Date()
    };
  };
  function shorten(s) { return s.length > 46 ? s.slice(0, 44).trim() + '…' : s; }

  /** Same model, other intended purposes: shows that purpose drives classification. */
  T.contrast = function (currentUseId) {
    const picks = ['m-write', 'l-chatbot', 'h-recruit', 'p-emotion'].filter(id => id !== currentUseId);
    return picks.slice(0, 3).map(id => T.useIndex[id]);
  };

  T.addToPortfolio = function (r) {
    const dept = { high: 'Risk & Compliance', limited: 'Digital', minimal: 'Operations', prohibited: 'Security' }[r.cls];
    const n = T.systems.length + 1;
    T.systems.unshift({
      id: 'S-' + String(n).padStart(3, '0'), name: r.name.replace(/ — .*/, ' — ' + shorten(r.useCase.label).slice(0, 28)), provider: r.provider, model: r.model.name,
      use: r.purpose, dept, cls: r.cls, status: r.cls === 'prohibited' ? 'Blocked' : r.cls === 'minimal' ? 'Compliant' : 'In progress',
      assessed: new Date(), score: r.score, open: r.cls === 'minimal' ? 0 : r.reqs.length, owner: 'You (demo)', env: 'Pilot', origin: r.model.access, useId: r.useCase.id
    });
    T.refreshBell && T.refreshBell();
  };
})(window.T);
