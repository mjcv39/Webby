/* Home / landing page */
(function (T) {
  const I = T.icon;
  const problems = [
    ['eye', 'No visibility', 'AI tools appear in every department, and nobody has the full picture.', 'One live registry of every AI system, owner and vendor, including shadow AI discovery.'],
    ['scale', 'Unclear regulation', 'Teams are unsure which EU AI Act rules apply to which use case.', 'Purpose-based classification that maps each system to Article 5, Annex III or Article 50.'],
    ['alert', 'Hidden risks', 'Risks surface only after an audit, a complaint or an incident.', 'Continuous monitoring with plain-language alerts and recommended actions.'],
    ['file', 'Scattered documents', 'Evidence lives in inboxes, wikis and personal drives.', 'A single documentation hub with owners, versions, status and audit trails.'],
    ['clock', 'Growing obligations', 'Deadlines stack up and nobody tracks what is due next.', 'Deadline tracking and readiness scores per system, per requirement.'],
    ['link', 'Third-party blind spots', 'Vendor AI is embedded in tools you buy, with little oversight.', 'Provider-aware registry: GPT, Claude, Gemini, Llama, Mistral and more under one roof.']
  ];
  const features = [
    ['dashboard', 'layers', 'Executive dashboard', 'Portfolio, risk mix, compliance score and deadlines in one view.', '#/dashboard'],
    ['assess', 'scan', 'Risk classification', 'Pick a model, state its purpose, get a simulated EU AI Act classification.', '#/assess'],
    ['eu-ai-act', 'book', 'EU AI Act centre', 'Visual guides, risk pyramid, timeline and penalties in plain language.', '#/eu-ai-act'],
    ['documents', 'file', 'Documentation hub', 'Technical files, assessments, disclosures and logs with realistic previews.', '#/documents'],
    ['monitoring', 'pulse', 'Proactive monitoring', 'Spot reassessment triggers, missing evidence and shadow AI early.', '#/monitoring'],
    ['value', 'trend', 'Business value', 'See the shift from reactive scrambling to structured governance.', '#/value']
  ];

  function heroVisual() {
    const c = { p: 2, h: 5, l: 5, m: 6 };
    return `<div class="hv">
      <svg class="hv-net" viewBox="0 0 600 520" aria-hidden="true">
        <g class="net-lines" stroke="rgba(120,170,255,.25)" fill="none"><path d="M60 80L200 160L330 90L520 170"/><path d="M200 160L150 330L320 380L520 170"/><path d="M150 330L60 450M320 380L450 470M330 90L400 20"/></g>
        ${[[60, 80], [200, 160], [330, 90], [520, 170], [150, 330], [320, 380], [60, 450], [450, 470], [400, 20]].map((p, i) => `<circle class="nn" style="animation-delay:${i * .4}s" cx="${p[0]}" cy="${p[1]}" r="5" fill="#22d3ee"/>`).join('')}
      </svg>
      <div class="hv-win">
        <div class="hv-bar"><i></i><i></i><i></i><span>tessera.app / dashboard</span></div>
        <div class="hv-body">
          <div class="hv-kpis">
            <div><small>AI systems</small><b data-count="18">0</b></div>
            <div><small>High risk</small><b style="color:var(--r-high)" data-count="5">0</b></div>
            <div><small>Open alerts</small><b style="color:var(--r-prohibited)" data-count="7">0</b></div>
          </div>
          <div class="hv-row">
            <div class="hv-card">${T.donut([{ v: 6, color: '#2dd4a7', label: 'Minimal' }, { v: 5, color: '#4da3ff', label: 'Limited' }, { v: 5, color: '#ffa94d', label: 'High' }, { v: 2, color: '#ff5c6c', label: 'Prohibited' }], { size: 120, th: 14, big: 18, small: 'systems' })}</div>
            <div class="hv-card hv-list">
              ${T.systems.slice(0, 4).map(s => `<div class="hv-li"><span>${T.esc(s.name)}</span>${T.riskBadge(s.cls)}</div>`).join('')}
            </div>
          </div>
          <div class="hv-card">${T.line(T.trend, T.trendLabels, { h: 120, color: '#22d3ee', suf: '%', label: 'Compliance trend' })}</div>
        </div>
      </div>
      <div class="hv-float f1">${I('alert')}<div><b>Model updated</b><small>TalentRank needs reassessment</small></div></div>
      <div class="hv-float f2">${I('shield')}<div><b>Classified: High risk</b><small>Annex III(4)(a) · Recruitment</small></div></div>
      <div class="hv-float f3">${I('check')}<div><b>Disclosure live</b><small>Aria chatbot · verified</small></div></div>
    </div>`;
  }

  T.pages.home = {
    render() {
      return `
<section class="hero dk"><div class="hero-bg"></div><div class="wrap hero-in">
  <div class="hero-t">
    <span class="pill">${I('shield')} AI governance for the EU AI Act era</span>
    <h1>Adopt AI with <span class="grad">confidence</span>, not guesswork.</h1>
    <p class="lead">Tessera gives organisations one place to inventory every AI system, understand their EU AI Act responsibilities, keep the evidence in order and catch governance issues before they become incidents.</p>
    <div class="cta-row"><a class="btn btn-primary btn-lg" href="#/demo">${I('play')} Try Interactive Demo</a><a class="btn btn-ghost btn-lg" href="#/dashboard">Explore the Platform ${I('arrow')}</a></div>
    <div class="hero-proof"><span>${I('check')} Purpose-based classification</span><span>${I('check')} Provider-agnostic</span><span>${I('check')} Audit-ready records</span></div>
  </div>
  ${heroVisual()}
</div></section>

<section class="strip"><div class="wrap strip-in">
  <span class="muted">Built for</span>
  ${['Startups', 'SMEs', 'Large enterprises', 'Financial services', 'Healthcare', 'HR & recruitment', 'Public sector', 'Education', 'Energy & infrastructure'].map(x => `<span class="chip">${x}</span>`).join('')}
</div></section>

<section class="sec"><div class="wrap">
  <div class="sec-h rv"><span class="eyebrow">The challenge</span><h2>AI is spreading faster than oversight</h2><p class="lead">Click a card to see how Tessera answers each governance problem.</p></div>
  <div class="grid g3">
    ${problems.map((p, i) => `<div class="flip rv" style="--d:${i * 60}ms" data-act="flip" role="button" tabindex="0" aria-label="${p[1]}: reveal solution">
      <div class="flip-in"><div class="face front"><div class="ico bad">${I(p[0])}</div><h3>${p[1]}</h3><p>${p[2]}</p><span class="hint">Show the solution ${I('arrow')}</span></div>
      <div class="face back"><div class="ico good">${I('check')}</div><h3>With Tessera</h3><p>${p[3]}</p></div></div></div>`).join('')}
  </div>
</div></section>

<section class="sec tint"><div class="wrap">
  <div class="sec-h rv"><span class="eyebrow">Platform</span><h2>Everything AI governance needs, in one place</h2><p class="lead">Six connected modules, one consistent view of your AI estate.</p></div>
  <div class="grid g3">
    ${features.map((f, i) => `<a class="fcard rv" style="--d:${i * 60}ms" href="${f[4]}">
      <div class="fvis">${featureVis(f[0])}</div>
      <div class="ico">${I(f[1])}</div><h3>${f[2]}</h3><p>${f[3]}</p><span class="more">Open ${I('arrow')}</span></a>`).join('')}
  </div>
</div></section>

<section class="sec dark dk"><div class="wrap">
  <div class="sec-h rv"><span class="eyebrow">How it works</span><h2>From model to compliance overview in six steps</h2></div>
  <div class="hflow rv">
    ${[['cpu', 'Select a model', 'GPT, Claude, Gemini, Llama, Mistral, DeepSeek or in-house'], ['target', 'State the purpose', 'What will the AI system actually be used for?'], ['scan', 'Get a classification', 'Prohibited, high, limited or minimal risk'], ['scale', 'See the requirements', 'Mapped to EU AI Act articles'], ['chart', 'Review compliance', 'Readiness and gaps at a glance'], ['file', 'Act on next steps', 'Recommended documents and actions']].map((s, i) => `<div class="hstep"><div class="hnum">${i + 1}</div><div class="ico">${I(s[0])}</div><h4>${s[1]}</h4><p>${s[2]}</p></div>`).join('')}
  </div>
  <div class="center"><a class="btn btn-primary btn-lg" href="#/demo">${I('play')} Start the guided demo</a></div>
</div></section>

<section class="sec"><div class="wrap">
  <div class="sec-h rv"><span class="eyebrow">Who it is for</span><h2>Scales from first AI pilot to global portfolio</h2></div>
  <div class="grid g3">
    ${[['zap', 'Startups', 'Introduce AI responsibly from day one with lightweight inventory, classification and a clean evidence trail investors and customers ask for.', ['Quick-start registry', 'Classification templates', 'Investor-ready records']],
      ['building', 'SMEs', 'Adopt AI tools without hiring a compliance team. Clear ownership, plain-language duties and guided next steps.', ['Vendor AI tracking', 'Guided checklists', 'Deadline reminders']],
      ['globe', 'Enterprises', 'Govern hundreds of AI systems across business units and jurisdictions with workflows, roles and audit-grade reporting.', ['Multi-department portfolios', 'Role-based approvals', 'Cross-border visibility']]].map((c, i) => `<div class="tier rv" style="--d:${i * 80}ms"><div class="ico">${I(c[0])}</div><h3>${c[1]}</h3><p>${c[2]}</p><ul>${c[3].map(x => `<li>${I('check')}${x}</li>`).join('')}</ul></div>`).join('')}
  </div>
  <div class="personas rv"><span class="muted">Designed for</span>${['Executives', 'Compliance officers', 'IT managers', 'AI developers', 'Risk professionals'].map(x => `<span class="chip">${x}</span>`).join('')}</div>
</div></section>

<section class="sec tint"><div class="wrap split">
  <div class="rv"><span class="eyebrow">Business value</span><h2>Governance is how AI scales safely</h2>
    <p class="lead">Regulators, customers and partners increasingly ask the same question: <i>can you show how you manage your AI?</i> Tessera turns that answer from a scramble into a standing capability.</p>
    <ul class="ticks">${['Regulatory preparedness', 'Centralised AI visibility', 'Clear accountability and audit trails', 'Responsible adoption and trust'].map(x => `<li>${I('check')}${x}</li>`).join('')}</ul>
    <a class="btn btn-dark" href="#/value">See the before and after ${I('arrow')}</a></div>
  <div class="ba-mini rv"><div class="bam bad"><b>Without</b><span>Scattered tools</span><span>Unclear owners</span><span>Missing documents</span><span>Reactive fixes</span></div><div class="bam good"><b>With Tessera</b><span>Central inventory</span><span>Named owners</span><span>Organised evidence</span><span>Proactive alerts</span></div></div>
</div></section>

<section class="cta dk"><div class="wrap"><h2>See governance in action</h2><p class="lead">Walk through a complete classification and compliance overview in under three minutes.</p>
  <div class="cta-row center"><a class="btn btn-primary btn-lg" href="#/demo">${I('play')} Launch the guided demo</a><a class="btn btn-ghost btn-lg" href="#/assess">Try a risk assessment</a></div>
  <p class="small muted">Tessera is a fictional product created for an educational project. All data is simulated.</p></div></section>`;
    },
    init(root) { T.countUp(root); }
  };

  function featureVis(k) {
    const m = {
      dashboard: `<div class="mv"><div class="mv-bars">${[40, 65, 50, 80, 70, 92].map(h => `<i style="height:${h}%"></i>`).join('')}</div></div>`,
      assess: `<div class="mv mv-col"><span class="badge r-high"><i></i>High risk</span><span class="badge r-limited"><i></i>Limited risk</span><span class="badge r-minimal"><i></i>Minimal risk</span></div>`,
      'eu-ai-act': `<div class="mv mv-pyr"><i style="--c:#ff5c6c;width:30%"></i><i style="--c:#ffa94d;width:52%"></i><i style="--c:#4da3ff;width:74%"></i><i style="--c:#2dd4a7;width:96%"></i></div>`,
      documents: `<div class="mv mv-docs"><i></i><i></i><i></i></div>`,
      monitoring: `<div class="mv">${T.spark([3, 5, 4, 7, 6, 9, 5, 12, 8, 15], '#22d3ee')}</div>`,
      value: `<div class="mv mv-ba"><i></i><i></i></div>`
    };
    return m[k];
  }
})(window.T);
