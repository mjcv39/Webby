/* EU AI Act Information Center */
(function (T) {
  const I = T.icon;
  const pyr = {
    prohibited: { t: 'Unacceptable risk: prohibited', d: 'Practices considered a clear threat to safety, livelihoods and rights. Banned outright since 2 February 2025.', ex: ['Social scoring', 'Workplace emotion recognition', 'Untargeted facial scraping'], pen: 'Fines up to €35M or 7% of worldwide turnover' },
    high: { t: 'High risk: strict requirements', d: 'Allowed on the market if requirements are met: risk management, data governance, documentation, logging, human oversight, accuracy and conformity assessment.', ex: ['CV screening', 'Credit scoring', 'Exam scoring', 'Critical-infrastructure safety'], pen: 'Fines up to €15M or 3% for non-compliance with obligations' },
    limited: { t: 'Limited risk: transparency obligations', d: 'People must know when they interact with AI or see AI-generated or manipulated content.', ex: ['Chatbots', 'Deepfakes', 'Generated images and audio'], pen: 'Fines up to €15M or 3%' },
    minimal: { t: 'Minimal risk: no specific obligations', d: 'The vast majority of AI systems. Free to use, with AI literacy expected and voluntary codes encouraged.', ex: ['Spam filters', 'Basic assistants', 'Routine summarisation'], pen: 'No AI-Act-specific penalties (other laws still apply)' }
  };
  const prohibited = [
    ['Art. 5(1)(a)', 'Manipulative or deceptive techniques', 'Subliminal or purposefully manipulative techniques that materially distort behaviour and cause or are likely to cause significant harm.', 'Example: an app that uses hidden audio cues to push people into harmful purchases.'],
    ['Art. 5(1)(b)', 'Exploiting vulnerabilities', 'Exploiting age, disability or a specific social or economic situation to distort behaviour in a harmful way.', 'Example: a toy that nudges children toward dangerous behaviour.'],
    ['Art. 5(1)(c)', 'Social scoring', 'Scoring people over time based on social behaviour or personality traits, leading to unjustified or disproportionate detrimental treatment.', 'Example: restricting services based on a general “trustworthiness” score.'],
    ['Art. 5(1)(d)', 'Predicting criminal offences from profiling alone', 'Assessing the risk that a person will commit a crime based solely on profiling or personality traits.', 'Supporting a human assessment based on objective, verifiable facts is not covered.'],
    ['Art. 5(1)(e)', 'Untargeted facial-image scraping', 'Creating or expanding facial-recognition databases by untargeted scraping from the internet or CCTV.', 'Example: harvesting social-media photos to build a face search engine.'],
    ['Art. 5(1)(f)', 'Emotion recognition at work and school', 'Inferring emotions of people in workplaces and education institutions.', 'Exception: medical or safety reasons (e.g. detecting pilot fatigue).'],
    ['Art. 5(1)(g)', 'Biometric categorisation of sensitive traits', 'Categorising people based on biometrics to infer race, political opinions, trade-union membership, religion, sex life or orientation.', 'Narrow exceptions exist for lawfully acquired datasets in law enforcement.'],
    ['Art. 5(1)(h)', 'Real-time remote biometric ID in public spaces', 'Real-time remote biometric identification in publicly accessible spaces for law enforcement.', 'Exceptions: targeted search for victims, preventing specific serious threats, locating suspects of serious crimes, with prior authorisation.']
  ];
  const annex3 = [['users', 'Biometrics', 'Remote identification, categorisation, emotion recognition (where permitted)'], ['cpu', 'Critical infrastructure', 'Safety components in digital infrastructure, traffic, water, gas, heating, electricity'], ['book', 'Education & training', 'Admission, evaluating learning outcomes, proctoring'], ['users', 'Employment & workers', 'Recruitment, promotion, termination, task allocation, monitoring'], ['building', 'Essential services', 'Public benefits, credit scoring, life and health insurance, emergency triage'], ['flag', 'Law enforcement', 'Evidence reliability, risk assessments, profiling'], ['globe', 'Migration & borders', 'Asylum, visa and border-control support'], ['scale', 'Justice & democracy', 'Assisting judicial authorities; influencing elections']];
  const roles = [
    ['Provider', 'Develops an AI system or GPAI model, or has one developed, and places it on the market or puts it into service under its own name.', ['Risk management system', 'Technical documentation', 'Conformity assessment & CE marking', 'Registration', 'Post-market monitoring', 'Serious-incident reporting']],
    ['Deployer', 'Uses an AI system under its authority in a professional capacity.', ['Use per instructions', 'Human oversight by trained staff', 'Monitor and keep logs', 'Inform workers and affected people', 'FRIA where required', 'AI literacy']],
    ['Importer', 'Places on the EU market a system from a non-EU provider.', ['Verify conformity before placing on market', 'Keep documentation available']],
    ['Distributor', 'Makes a system available on the market without being provider or importer.', ['Verify CE marking and documentation']],
    ['Authorised rep.', 'Acts in the EU for a non-EU provider.', ['Hold documentation', 'Cooperate with authorities']]
  ];
  const timeline = [
    ['2024-07-12', 'Published in the Official Journal', 'Regulation (EU) 2024/1689 published.'],
    ['2024-08-01', 'Entry into force', 'The AI Act becomes law, with obligations phased in over time.'],
    ['2025-02-02', 'Prohibitions & AI literacy', 'Prohibited practices (Art. 5) and AI literacy (Art. 4) apply.'],
    ['2025-08-02', 'GPAI obligations & governance', 'General-purpose AI model obligations, governance structure and penalty provisions apply.'],
    ['2026-08-02', 'General application date', 'Most remaining provisions, including Art. 50 transparency duties and Commission enforcement powers over GPAI providers. (Transitional arrangements may apply to some Art. 50 duties.)'],
    ['2027-08-02', 'Legacy GPAI models', 'GPAI models placed on the market before 2 Aug 2025 must be compliant.'],
    ['2027-12-02', 'High-risk (Annex III)', 'Standalone high-risk systems such as HR, credit and education use cases. Postponed from 2 Aug 2026 by the Digital Omnibus on AI.'],
    ['2028-08-02', 'High-risk (Annex I products)', 'AI that is a safety component of regulated products. Postponed from 2 Aug 2027 by the Digital Omnibus on AI.'],
    ['2030-08-02', 'Legacy public-sector systems', 'High-risk systems already used by public authorities must comply.']
  ];

  Object.assign(T.actions, {
    pyr: el => {
      const k = el.dataset.k, d = pyr[k];
      T.$$('.pyr-l').forEach(b => b.classList.toggle('on', b === el));
      T.$('#pyr-d').innerHTML = `<div class="pd r-${k}"><h3>${d.t}</h3><p>${d.d}</p><div class="chips">${d.ex.map(e => `<span class="chip">${e}</span>`).join('')}</div><p class="small muted">${I('scale')} ${d.pen}</p></div>`;
    },
    role: el => {
      const r = roles[+el.dataset.i];
      T.$$('.role').forEach(b => b.classList.toggle('on', b === el));
      T.$('#role-d').innerHTML = `<h4>${r[0]}</h4><p>${r[1]}</p><ul class="ticks">${r[2].map(x => `<li>${I('check')}${x}</li>`).join('')}</ul>`;
    },
    flow: el => { T.$$('.pstep').forEach(b => b.classList.toggle('on', b === el)); T.$('#flow-d').textContent = el.dataset.d; },
    fine: () => {
      const t = Math.max(0, +T.$('#turn').value || 0), sme = T.$('#sme').checked;
      const calc = (fix, pc) => { const a = fix, b = t * 1e6 * pc / 100; return sme ? Math.min(a, b) : Math.max(a, b); };
      const f = n => n >= 1e6 ? '€' + (n / 1e6).toFixed(n % 1e6 ? 1 : 0) + 'M' : '€' + Math.round(n).toLocaleString();
      T.$('#fine-out').innerHTML = [['Prohibited practices', 35e6, 7, '#ff5c6c'], ['Other operator obligations', 15e6, 3, '#ffa94d'], ['Incorrect information to authorities', 7.5e6, 1, '#4da3ff']].map(x => `<div class="fine"><span style="color:${x[3]}">${x[0]}</span><b>${f(calc(x[1], x[2]))}</b><small>${sme ? 'lower of' : 'higher of'} ${f(x[1])} or ${x[2]}% turnover</small></div>`).join('');
    },
    jump: el => { const t = T.$(el.getAttribute('data-to')); t && t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });

  const acc = (items) => `<div class="acc">${items.map(i => `<div class="acc-item"><button class="acc-h" data-act="acc" aria-expanded="false"><span class="acc-n">${i[0]}</span><b>${i[1]}</b>${I('chevron')}</button><div class="acc-b"><div><p>${i[2]}</p><p class="muted small">${i[3]}</p></div></div></div>`).join('')}</div>`;

  T.pages['eu-ai-act'] = {
    render() {
      const now = Date.now();
      const tl = timeline.map(x => { const d = new Date(x[0]), past = d <= now; return `<div class="tli ${past ? 'past' : 'future'}"><div class="tli-dot">${past ? I('check') : I('clock')}</div><div class="tli-c"><span class="tli-d">${T.fmt(d)}</span><b>${x[1]}</b><p>${x[2]}</p><span class="tag ${past ? 'ok' : 'soon'}">${past ? 'Already applicable' : 'Scheduled'}</span></div></div>`; }).join('');
      return `
<section class="phead dk"><div class="wrap"><span class="eyebrow">EU AI Act information centre</span><h1>The EU AI Act, explained visually</h1>
<p class="lead">Regulation (EU) 2024/1689 is the world’s first comprehensive AI law. It takes a <b>risk-based approach</b>: the higher the risk of a use, the stricter the rules.</p>
<div class="subnav">${[['#s-what', 'Overview'], ['#s-risk', 'Risk pyramid'], ['#s-prohib', 'Prohibited'], ['#s-high', 'High-risk'], ['#s-trans', 'Transparency'], ['#s-gpai', 'GPAI'], ['#s-roles', 'Roles'], ['#s-time', 'Timeline'], ['#s-pen', 'Penalties']].map(s => `<button data-act="jump" data-to="${s[0]}">${s[1]}</button>`).join('')}</div></div></section>

<section class="sec" id="s-what"><div class="wrap">
  <div class="sec-h"><span class="eyebrow">Overview</span><h2>What it is, why it exists and who it covers</h2></div>
  <div class="grid g3">
    <div class="icard rv"><div class="ico">${I('book')}</div><h3>What is it?</h3><p>A directly applicable EU regulation setting harmonised rules for developing, placing on the market and using AI in the Union. In force since 1 August 2024, applying in phases.</p></div>
    <div class="icard rv"><div class="ico">${I('shield')}</div><h3>Why was it introduced?</h3><p>To protect health, safety and fundamental rights, build trust in AI, and give businesses one clear rulebook across 27 Member States while supporting innovation.</p></div>
    <div class="icard rv"><div class="ico">${I('globe')}</div><h3>Who does it apply to?</h3><p>Providers placing AI on the EU market (wherever they are based), deployers in the EU, and non-EU operators whose AI output is used in the EU. Not covered: military and national-security use, pure scientific research, personal non-professional use.</p></div>
  </div>
  <div class="models-v rv"><div class="mv-box"><b>AI model</b><p>The trained engine (e.g. a large language model). Regulated mainly when it is a <i>general-purpose AI model</i>.</p></div><div class="mv-plus">+</div><div class="mv-box"><b>Interface, data & purpose</b><p>Prompts, integrations, users and a defined use such as screening CVs.</p></div><div class="mv-plus">=</div><div class="mv-box hl"><b>AI system</b><p>This is what gets risk-classified, based on its <b>intended purpose</b> and deployment context.</p></div></div>
</div></section>

<section class="sec tint" id="s-risk"><div class="wrap">
  <div class="sec-h"><span class="eyebrow">Risk-based approach</span><h2>Four tiers of risk</h2><p class="lead">Click a layer of the pyramid.</p></div>
  <div class="pyr-wrap">
    <div class="pyr">${['prohibited', 'high', 'limited', 'minimal'].map((k, i) => `<button class="pyr-l r-${k} ${k === 'high' ? 'on' : ''}" data-act="pyr" data-k="${k}" style="--w:${28 + i * 24}%"><b>${T.RISK[k].label}</b><small>${T.RISK[k].blurb}</small></button>`).join('')}</div>
    <div class="card" id="pyr-d"><div class="pd r-high"><h3>${pyr.high.t}</h3><p>${pyr.high.d}</p><div class="chips">${pyr.high.ex.map(e => `<span class="chip">${e}</span>`).join('')}</div><p class="small muted">${I('scale')} ${pyr.high.pen}</p></div></div>
  </div>
  <div class="callout wide-c"><b>Not every AI system has the same obligations.</b> Most AI is minimal risk. Classification depends on what the system is used <i>for</i>, and the same underlying model can land in different tiers.</div>
</div></section>

<section class="sec" id="s-prohib"><div class="wrap">
  <div class="sec-h"><span class="eyebrow">Article 5</span><h2>Prohibited AI practices</h2><p class="lead">Applicable since <b>2 February 2025</b>. Expand each practice. Prohibited is different from high-risk: it is banned, not regulated.</p></div>
  ${acc(prohibited)}
</div></section>

<section class="sec tint" id="s-high"><div class="wrap">
  <div class="sec-h"><span class="eyebrow">Articles 6–15 · Annexes I & III</span><h2>What makes an AI system high-risk?</h2></div>
  <div class="two-routes"><div class="route rv"><span class="eyebrow">Route 1 · Art. 6(1)</span><h3>Safety component of a regulated product</h3><p>AI embedded in products under EU product legislation (Annex I), such as medical devices or machinery, that need third-party conformity assessment.</p></div><div class="route rv"><span class="eyebrow">Route 2 · Art. 6(2)</span><h3>Listed use case in Annex III</h3><p>Eight areas below. Systems may escape high-risk status if they do not pose a significant risk and only perform narrow procedural or preparatory tasks (Art. 6(3)), but profiling of people is always high-risk.</p></div></div>
  <div class="grid g4">${annex3.map((a, i) => `<div class="a3 rv" style="--d:${i * 40}ms"><div class="ico">${I(a[0])}</div><b>${a[1]}</b><p class="small muted">${a[2]}</p></div>`).join('')}</div>
  <h3 class="sub-h">From classification to market: the provider process</h3>
  <div class="pflow">${[['Classify', 'Determine whether the system is high-risk under Art. 6 and Annex III.'], ['Meet requirements', 'Implement Arts. 9–15: risk management, data governance, documentation, logging, transparency, human oversight, accuracy, robustness, cybersecurity.'], ['Assess conformity', 'Usually internal control; notified body in some cases (Art. 43).'], ['Declare & mark', 'EU declaration of conformity and CE marking.'], ['Register', 'Enter the system in the EU database (Art. 49).'], ['Monitor', 'Post-market monitoring and serious-incident reporting (Arts. 72–73).']].map((s, i) => `<button class="pstep ${i === 0 ? 'on' : ''}" data-act="flow" data-d="${T.esc(s[1])}"><span>${i + 1}</span>${s[0]}</button>`).join('')}</div>
  <div class="card" id="flow-d" style="margin-top:12px">Determine whether the system is high-risk under Art. 6 and Annex III.</div>
</div></section>

<section class="sec" id="s-trans"><div class="wrap">
  <div class="sec-h"><span class="eyebrow">Article 50</span><h2>Transparency obligations</h2><p class="lead">When people must be told that AI is involved.</p></div>
  <div class="grid g4">${[['users', 'Interacting with AI', 'Chatbots and voice agents must make clear the person is dealing with AI, unless obvious.', 'Art. 50(1) · providers'], ['layers', 'Marking synthetic output', 'Generated audio, image, video and text must be machine-readable marked as AI-generated.', 'Art. 50(2) · providers'], ['eye', 'Emotion recognition & categorisation', 'People exposed must be informed that such a system is operating.', 'Art. 50(3) · deployers'], ['alert', 'Deepfakes & public-interest text', 'Disclose deepfakes and AI-generated text published to inform the public (unless human-edited with editorial responsibility).', 'Art. 50(4) · deployers']].map(t => `<div class="a3 rv"><div class="ico">${I(t[0])}</div><b>${t[1]}</b><p class="small muted">${t[2]}</p><code>${t[3]}</code></div>`).join('')}</div>
</div></section>

<section class="sec tint" id="s-gpai"><div class="wrap">
  <div class="sec-h"><span class="eyebrow">Articles 51–55</span><h2>General-purpose AI models</h2><p class="lead">Obligations for providers of models like GPT, Claude, Gemini, Llama, Mistral or DeepSeek. Applicable since <b>2 August 2025</b>.</p></div>
  <div class="cmp">
    <div class="cmp-c"><span class="eyebrow">All GPAI model providers · Art. 53</span><ul class="ticks">${['Technical documentation of the model', 'Information for downstream providers building AI systems', 'Copyright-compliance policy', 'Public summary of training content'].map(x => `<li>${I('check')}${x}</li>`).join('')}</ul><p class="small muted">Open-source models released under a free licence get a partial exemption, but not if they present systemic risk.</p></div>
    <div class="cmp-c hl"><span class="eyebrow">Systemic-risk models · Art. 55</span><ul class="ticks">${['Model evaluation including adversarial testing', 'Assess and mitigate systemic risks', 'Serious-incident reporting', 'Adequate cybersecurity protection', 'Notify the Commission'].map(x => `<li>${I('check')}${x}</li>`).join('')}</ul><p class="small muted">Presumed when training compute exceeds 10²⁵ FLOPs, or designated by the Commission. A voluntary Code of Practice helps providers demonstrate compliance.</p></div>
  </div>
  <div class="callout wide-c"><b>Your role as a downstream company:</b> you are usually not the GPAI model provider. If you build an AI system on a model and give it a purpose, you may be the <i>provider of an AI system</i> and carry the duties of the tier that purpose triggers.</div>
</div></section>

<section class="sec" id="s-roles"><div class="wrap">
  <div class="sec-h"><span class="eyebrow">Responsibilities</span><h2>Who has to do what?</h2><p class="lead">Select a role.</p></div>
  <div class="roles"><div class="role-list">${roles.map((r, i) => `<button class="role ${i === 0 ? 'on' : ''}" data-act="role" data-i="${i}">${I(['cpu', 'users', 'globe', 'link', 'flag'][i])}${r[0]}</button>`).join('')}</div><div class="card" id="role-d"><h4>${roles[0][0]}</h4><p>${roles[0][1]}</p><ul class="ticks">${roles[0][2].map(x => `<li>${I('check')}${x}</li>`).join('')}</ul></div></div>
</div></section>

<section class="sec tint" id="s-time"><div class="wrap">
  <div class="sec-h"><span class="eyebrow">Implementation timeline</span><h2>What applies now, and what is coming</h2><p class="lead">Status is computed from today’s date (${T.fmt(new Date())}).</p></div>
  <div class="tline">${tl}</div>
  <div class="callout wide-c"><b>Dates changed in 2026.</b> The <a href="https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai" target="_blank" rel="noopener">Digital Omnibus on AI</a> postponed the application of high-risk rules to 2 December 2027 (Annex III) and 2 August 2028 (Annex I). The Council gave final approval on 29 June 2026. Always confirm current dates on <a href="https://eur-lex.europa.eu/eli/reg/2024/1689/oj" target="_blank" rel="noopener">EUR-Lex</a> and the European Commission website, because this demo may lag behind official publications.</div>
</div></section>

<section class="sec" id="s-pen"><div class="wrap">
  <div class="sec-h"><span class="eyebrow">Article 99</span><h2>Penalties for non-compliance</h2><p class="lead">Maximum administrative fines. Enter a turnover to see the cap that would apply.</p></div>
  <div class="pen-calc card"><div class="row"><label>Worldwide annual turnover (€M)<input id="turn" type="number" min="0" value="500" data-act="fine" oninput="T.actions.fine()"></label><label class="chk-l"><input id="sme" type="checkbox" onchange="T.actions.fine()"> SME / start-up (lower of the two caps applies)</label></div>
    <div class="fines" id="fine-out"></div></div>
  <div class="pen-bars"><div><b>€35M / 7%</b><i style="--w:100%;--c:#ff5c6c"></i><span>Prohibited practices</span></div><div><b>€15M / 3%</b><i style="--w:43%;--c:#ffa94d"></i><span>Other obligations (providers, deployers, GPAI, transparency…)</span></div><div><b>€7.5M / 1%</b><i style="--w:21%;--c:#4da3ff"></i><span>Supplying incorrect information</span></div></div>
  <p class="small muted">Illustrative reading of Art. 99. Real fines depend on the case, mitigating factors and national enforcement.</p>
</div></section>

<section class="sec tint tight"><div class="wrap"><div class="sec-h"><span class="eyebrow">Official sources</span><h2>Read the primary texts</h2></div>
  <div class="srcs">${[['Regulation (EU) 2024/1689 on EUR-Lex', 'https://eur-lex.europa.eu/eli/reg/2024/1689/oj'], ['European Commission: AI Act regulatory framework', 'https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai'], ['AI Act Service Desk (European Commission)', 'https://ai-act-service-desk.ec.europa.eu/'], ['European AI Office', 'https://digital-strategy.ec.europa.eu/en/policies/ai-office']].map(s => `<a class="src" href="${s[1]}" target="_blank" rel="noopener">${I('link')}<span>${s[0]}</span></a>`).join('')}</div>
  <p class="disc">${I('alert')}<span>Summaries here are simplified educational explanations, not legal advice.</span></p></div></section>`;
    },
    init(root) { T.reveal(root); T.actions.fine(); }
  };
})(window.T);
