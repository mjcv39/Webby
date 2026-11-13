/* EU AI Act section */
(function (T) {
  const I = T.icon;
  const pyr = {
    prohibited: { t: 'Unacceptable risk: banned', pts: ['Clear threat to safety and rights', 'Banned since 2 Feb 2025', 'Fines up to €35M or 7% of turnover'], ex: ['Social scoring', 'Workplace emotion AI', 'Face scraping'] },
    high: { t: 'High risk: strict requirements', pts: ['Allowed if requirements are met', 'Risk management, data, documentation, logs', 'Human oversight, accuracy, conformity'], ex: ['CV screening', 'Credit scoring', 'Exam scoring', 'Critical infrastructure'] },
    limited: { t: 'Limited risk: transparency', pts: ['People must know it is AI', 'AI-generated content must be disclosed or marked'], ex: ['Chatbots', 'Deepfakes', 'Generated media'] },
    minimal: { t: 'Minimal risk: free to use', pts: ['Most AI systems', 'AI literacy expected', 'Voluntary codes encouraged'], ex: ['Spam filters', 'Summaries', 'Assistants'] }
  };
  const prohibited = [
    ['5(1)(a)', 'Manipulation', 'Subliminal or deceptive techniques causing harm'], ['5(1)(b)', 'Exploiting vulnerabilities', 'Age, disability, social or economic situation'],
    ['5(1)(c)', 'Social scoring', 'Unjustified detrimental treatment'], ['5(1)(d)', 'Crime prediction by profiling', 'Based solely on profiling or traits'],
    ['5(1)(e)', 'Face scraping', 'Untargeted internet or CCTV images'], ['5(1)(f)', 'Emotion recognition', 'At work or school (medical/safety exceptions)'],
    ['5(1)(g)', 'Sensitive biometric categorisation', 'Race, politics, religion, orientation'], ['5(1)(h)', 'Real-time biometric ID', 'Public spaces, law enforcement (narrow exceptions)']
  ];
  const annex3 = [['users', 'Biometrics'], ['cpu', 'Critical infrastructure'], ['book', 'Education'], ['users', 'Employment'], ['building', 'Essential services'], ['flag', 'Law enforcement'], ['globe', 'Migration & borders'], ['scale', 'Justice & democracy']];
  const flow = [['Classify', 'Art. 6 + Annex III'], ['Meet requirements', 'Arts. 9–15'], ['Assess conformity', 'Art. 43'], ['Declare & CE mark', 'Arts. 47–48'], ['Register', 'Art. 49'], ['Monitor', 'Arts. 72–73']];
  const timeline = [
    ['2024-08-01', 'Entry into force', 'The AI Act becomes law'],
    ['2025-02-02', 'Prohibitions + AI literacy', 'Art. 5 bans and Art. 4 apply'],
    ['2025-08-02', 'General-purpose AI + governance', 'GPAI duties, penalties framework'],
    ['2026-08-02', 'General application', 'Art. 50 transparency, most remaining rules'],
    ['2027-08-02', 'Legacy GPAI models', 'Models placed before Aug 2025 comply'],
    ['2027-12-02', 'High-risk: Annex III', 'HR, credit, education, etc. (postponed from Aug 2026)'],
    ['2028-08-02', 'High-risk: Annex I products', 'AI in regulated products (postponed from Aug 2027)']
  ];
  const roles = [
    ['Provider', 'cpu', ['Builds or brands the AI system', 'Risk management + documentation', 'Conformity, CE mark, registration', 'Post-market monitoring, incident reports']],
    ['Deployer', 'users', ['Uses the system professionally', 'Follows instructions, assigns human oversight', 'Keeps logs, informs workers', 'FRIA where required']]
  ];

  Object.assign(T.actions, {
    pyr: el => {
      const k = el.dataset.k, d = pyr[k];
      T.$$('.pyr-l').forEach(b => b.classList.toggle('on', b === el));
      T.$('#pyr-d').innerHTML = `<div class="pd r-${k}"><h3>${d.t}</h3><ul class="ticks">${d.pts.map(x => `<li>${I('check')}${x}</li>`).join('')}</ul><div class="chips">${d.ex.map(e => `<span class="chip">${e}</span>`).join('')}</div></div>`;
    },
    fine: () => {
      const t = Math.max(0, +T.$('#turn').value || 0), sme = T.$('#sme').checked;
      const calc = (fix, pc) => { const b = t * 1e6 * pc / 100; return sme ? Math.min(fix, b) : Math.max(fix, b); };
      const f = n => n >= 1e6 ? '€' + (n / 1e6).toFixed(n % 1e6 ? 1 : 0) + 'M' : '€' + Math.round(n).toLocaleString();
      T.$('#fine-out').innerHTML = [['Prohibited practices', 35e6, 7, '#ff5c6c'], ['Other obligations', 15e6, 3, '#ffa94d'], ['Incorrect information', 7.5e6, 1, '#4da3ff']].map(x => `<div class="fine" style="--c:${x[3]}"><span>${x[0]}</span><b>${f(calc(x[1], x[2]))}</b><small>${sme ? 'lower' : 'higher'} of ${f(x[1])} or ${x[2]}%</small></div>`).join('');
    }
  });

  T.sections['eu-act'] = {
    id: 'eu-act',
    render() {
      const now = Date.now();
      const tl = timeline.map(x => { const d = new Date(x[0]), past = d <= now; return `<div class="tli ${past ? 'past' : 'future'}"><div class="tli-dot">${past ? I('check') : I('clock')}</div><div class="tli-c"><span class="tli-d">${T.fmt(d)}</span><b>${x[1]}</b><p>${x[2]}</p><span class="tag ${past ? 'ok' : 'soon'}">${past ? 'Applicable now' : 'Scheduled'}</span></div></div>`; }).join('');
      return `<section id="eu-act" class="sec tint"><div class="wrap">
  <div class="sec-h"><span class="eyebrow rv">04 · EU AI Act</span><h2 class="rv">The rulebook, explained visually</h2>
    <ul class="pts rv"><li>Regulation (EU) 2024/1689, the first comprehensive AI law</li><li>Risk-based: higher risk means stricter rules</li></ul></div>
  <div class="grid g3 trio" data-stagger>
    <div class="icard"><div class="ico">${I('book')}</div><h3>What</h3><ul class="ticks"><li>${I('check')}EU-wide AI rulebook</li><li>${I('check')}In force 1 Aug 2024</li><li>${I('check')}Phased application</li></ul></div>
    <div class="icard"><div class="ico">${I('shield')}</div><h3>Why</h3><ul class="ticks"><li>${I('check')}Protect health, safety, rights</li><li>${I('check')}Build trust in AI</li><li>${I('check')}One rulebook for 27 states</li></ul></div>
    <div class="icard"><div class="ico">${I('globe')}</div><h3>Who</h3><ul class="ticks"><li>${I('check')}Providers, deployers, importers</li><li>${I('check')}Applies to non-EU firms too</li><li>${I('check')}Not: military, pure research</li></ul></div>
  </div>

  <div class="sec-h gap-top"><span class="eyebrow rv">Risk-based approach</span><h2 class="rv">Four tiers. Click a layer.</h2></div>
  <div class="pyr-wrap">
    <div class="pyr" data-stagger>${['prohibited', 'high', 'limited', 'minimal'].map((k, i) => `<button class="pyr-l r-${k} ${k === 'high' ? 'on' : ''}" data-act="pyr" data-k="${k}" style="--w:${30 + i * 23}%"><b>${T.RISK[k].label}</b><small>${T.RISK[k].blurb}</small></button>`).join('')}</div>
    <div class="card rv" data-anim="right" id="pyr-d"><div class="pd r-high"><h3>${pyr.high.t}</h3><ul class="ticks">${pyr.high.pts.map(x => `<li>${I('check')}${x}</li>`).join('')}</ul><div class="chips">${pyr.high.ex.map(e => `<span class="chip">${e}</span>`).join('')}</div></div></div>
  </div>

  <div class="sec-h gap-top"><span class="eyebrow rv">Article 5 · applicable since 2 Feb 2025</span><h2 class="rv">Prohibited AI practices</h2></div>
  <div class="grid g4 pro-g" data-stagger>${prohibited.map(p => `<div class="prc"><span class="acc-n">Art. ${p[0]}</span><b>${p[1]}</b><small>${p[2]}</small></div>`).join('')}</div>

  <div class="sec-h gap-top"><span class="eyebrow rv">Articles 6–15 · Annexes I & III</span><h2 class="rv">What makes AI high-risk?</h2>
    <ul class="pts rv"><li><b>Route 1:</b> safety component of a regulated product (Annex I)</li><li><b>Route 2:</b> a listed use case in Annex III</li></ul></div>
  <div class="grid g4 a3g" data-stagger>${annex3.map(a => `<div class="a3"><div class="ico">${I(a[0])}</div><b>${a[1]}</b></div>`).join('')}</div>
  <div class="pflow2" data-stagger>${flow.map((s, i) => `<div class="pf"><span>${i + 1}</span><b>${s[0]}</b><small>${s[1]}</small></div>`).join('')}</div>

  <div class="sec-h gap-top"><span class="eyebrow rv">Article 50</span><h2 class="rv">Transparency obligations</h2></div>
  <div class="grid g4" data-stagger>${[['users', 'Talking to AI', 'Chatbots must say so', '50(1)'], ['layers', 'Synthetic output', 'Mark AI audio, image, video, text', '50(2)'], ['eye', 'Emotion & biometrics', 'Inform exposed people', '50(3)'], ['alert', 'Deepfakes & public text', 'Disclose AI-generated content', '50(4)']].map(t => `<div class="a3 tall"><div class="ico">${I(t[0])}</div><b>${t[1]}</b><small>${t[2]}</small><code>Art. ${t[3]}</code></div>`).join('')}</div>

  <div class="sec-h gap-top"><span class="eyebrow rv">Articles 51–55 · applicable since 2 Aug 2025</span><h2 class="rv">General-purpose AI models</h2><p class="sub rv">GPT, Claude, Gemini, Llama, Mistral, DeepSeek and others</p></div>
  <div class="cmp">
    <div class="cmp-c rv" data-anim="left"><span class="eyebrow">All GPAI providers · Art. 53</span><ul class="ticks">${['Model technical documentation', 'Information for downstream builders', 'Copyright policy', 'Training-content summary'].map(x => `<li>${I('check')}${x}</li>`).join('')}</ul></div>
    <div class="cmp-c hl rv" data-anim="right"><span class="eyebrow">Systemic-risk models · Art. 55</span><ul class="ticks">${['Adversarial testing and evaluation', 'Assess and mitigate systemic risk', 'Serious-incident reporting', 'Cybersecurity safeguards'].map(x => `<li>${I('check')}${x}</li>`).join('')}<li>${I('zap')}Presumed above 10²⁵ FLOPs training compute</li></ul></div>
  </div>

  <div class="sec-h gap-top"><span class="eyebrow rv">Responsibilities</span><h2 class="rv">Providers vs deployers</h2></div>
  <div class="cmp">${roles.map((r, i) => `<div class="cmp-c rv" data-anim="${i ? 'right' : 'left'}"><div class="ico">${I(r[1])}</div><h3>${r[0]}</h3><ul class="ticks">${r[2].map(x => `<li>${I('check')}${x}</li>`).join('')}</ul></div>`).join('')}</div>
  <div class="built rv"><span class="muted">Also covered</span><span class="chip">Importers</span><span class="chip">Distributors</span><span class="chip">Authorised representatives</span><span class="chip">Product manufacturers</span></div>

  <div class="sec-h gap-top"><span class="eyebrow rv">Implementation</span><h2 class="rv">What applies now, and what is coming</h2></div>
  <div class="tline" data-scrollprog><div class="tline-bar"><i></i></div>${tl}</div>
  <p class="callout wide-c rv"><b>Dates moved in 2026.</b> The Digital Omnibus on AI postponed high-risk rules to 2 Dec 2027 (Annex III) and 2 Aug 2028 (Annex I). Always confirm on <a href="https://eur-lex.europa.eu/eli/reg/2024/1689/oj" target="_blank" rel="noopener">EUR-Lex</a> and the <a href="https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai" target="_blank" rel="noopener">European Commission</a>.</p>

  <div class="sec-h gap-top"><span class="eyebrow rv">Article 99</span><h2 class="rv">What non-compliance can cost</h2></div>
  <div class="card pen-calc rv" data-anim="zoom"><div class="row"><label>Annual turnover (€M)<input id="turn" type="number" min="0" value="500" oninput="T.actions.fine()"></label><label class="chk-l"><input id="sme" type="checkbox" onchange="T.actions.fine()"> SME / start-up (lower cap applies)</label></div><div class="fines" id="fine-out"></div></div>
  <div class="srcs rv"><a class="src" href="https://eur-lex.europa.eu/eli/reg/2024/1689/oj" target="_blank" rel="noopener">${I('link')}EUR-Lex: Regulation 2024/1689</a><a class="src" href="https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai" target="_blank" rel="noopener">${I('link')}European Commission: AI Act</a></div>
  <p class="disc rv">${I('alert')}<span>Simplified educational summary, not legal advice.</span></p>
</div></section>`;
    },
    init() { T.actions.fine(); }
  };
})(window.T);
