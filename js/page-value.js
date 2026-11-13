/* Business Value page */
(function (T) {
  const I = T.icon;
  const benefits = [
    ['scale', 'Regulatory preparedness', 'Understand which obligations may apply to each AI system, and when.', 'Purpose-based classification + timeline'],
    ['shield', 'Reduced compliance exposure', 'Find gaps early and fix them before they become findings or fines.', 'Gap analysis + proactive alerts'],
    ['eye', 'Centralised AI visibility', 'One consolidated view of every AI system, including vendor and shadow AI.', 'Registry + discovery scans'],
    ['users', 'Improved accountability', 'Named owners, approvals and immutable audit trails.', 'Ownership + audit log'],
    ['zap', 'Operational efficiency', 'Replace spreadsheets and email chains with structured workflows.', 'Templates + checklists'],
    ['brain', 'Responsible AI adoption', 'Move faster on AI because the guardrails are already in place.', 'Guided governance workflow'],
    ['star', 'Competitive advantage', 'Show customers, partners and regulators you can prove how your AI is governed.', 'Evidence on demand']
  ];
  const without = ['Scattered AI tools', 'Unclear system ownership', 'Manual risk assessments', 'Missing documentation', 'Limited visibility', 'Reactive compliance'];
  const withp = ['Centralised AI inventory', 'Clear risk classifications', 'Organised documentation', 'Compliance visibility', 'Proactive alerts', 'Structured governance'];
  const personas = {
    exec: ['Executives', 'trend', 'See AI risk and readiness at a glance, and make investment decisions with confidence.', ['Portfolio risk mix', 'Readiness score', 'Board-ready reports']],
    comp: ['Compliance officers', 'scale', 'Map systems to obligations, track evidence and prepare for audits.', ['Requirement mapping', 'Document library', 'Audit trail']],
    it: ['IT managers', 'cpu', 'Discover shadow AI, track vendors and models, and control deployment.', ['Discovery scans', 'Vendor registry', 'Change alerts']],
    dev: ['AI developers', 'brain', 'Know what documentation and testing each system needs before release.', ['Annex IV templates', 'Evaluation records', 'Model-change workflow']],
    risk: ['Risk professionals', 'alert', 'Quantify, monitor and mitigate AI risk across the lifecycle.', ['Risk registers', 'Monitoring metrics', 'Incident records']]
  };

  Object.assign(T.actions, {
    persona: el => {
      const p = personas[el.dataset.p];
      T.$$('[data-act="persona"]').forEach(b => b.classList.toggle('on', b === el));
      T.$('#persona-d').innerHTML = `<div class="ico">${I(p[1])}</div><div><h3>${p[0]}</h3><p>${p[2]}</p><ul class="ticks">${p[3].map(x => `<li>${I('check')}${x}</li>`).join('')}</ul></div>`;
    },
    roi: () => {
      const n = +T.$('#roi-n').value, h = +T.$('#roi-h').value, r = +T.$('#roi-r').value;
      T.$('#roi-nv').textContent = n; T.$('#roi-hv').textContent = h + ' h'; T.$('#roi-rv').textContent = r + '%';
      const saved = Math.round(n * 2 * h * r / 100);
      T.$('#roi-out').innerHTML = `<b>${saved.toLocaleString()}</b><span>staff hours potentially saved per year</span><small>= ${n} systems × 2 reviews/year × ${h} h × ${r}% assumed reduction</small>`;
    }
  });

  function slider() {
    return `<div class="ba" id="ba" style="--x:50%">
      <div class="ba-layer ba-without"><div class="ba-tag bad">Without a governance platform</div>
        <div class="chaos">${['GPT tab', 'shadow tool', 'vendor bot', 'untracked API', 'old spreadsheet', 'email thread', 'who owns this?', 'v7_FINAL.docx', 'Slack export'].map((x, i) => `<span style="--x:${(i * 29) % 82}%;--y:${(i * 41) % 78}%;--r:${(i * 23) % 30 - 15}deg">${x}</span>`).join('')}</div>
        <ul>${without.map(x => `<li>${I('x')}${x}</li>`).join('')}</ul></div>
      <div class="ba-layer ba-with"><div class="ba-tag good">With Tessera</div>
        <div class="order">${['Registry', 'Classified', 'Owned', 'Documented', 'Monitored', 'Audit-ready'].map(x => `<span>${I('check')}${x}</span>`).join('')}</div>
        <ul>${withp.map(x => `<li>${I('check')}${x}</li>`).join('')}</ul></div>
      <div class="ba-handle"><span>${I('chevron')}</span></div>
      <input type="range" min="2" max="98" value="50" id="ba-r" aria-label="Compare without and with Tessera" oninput="document.getElementById('ba').style.setProperty('--x',this.value+'%')">
    </div>`;
  }

  T.pages.value = {
    render() {
      return `
<section class="phead dk"><div class="wrap"><span class="eyebrow">Business value</span><h1>Why organisations need AI governance</h1>
<p class="lead">AI adoption is accelerating, and so are the expectations of regulators, customers and boards. Governance is how you keep both in step.</p></div></section>
<section class="sec"><div class="wrap">
  <div class="sec-h"><h2>Seven ways Tessera creates value</h2></div>
  <div class="grid g4 bgrid">${benefits.map((b, i) => `<div class="bcard rv ${i === 6 ? 'last' : ''}" style="--d:${i * 50}ms"><div class="ico">${I(b[0])}</div><h3>${b[1]}</h3><p>${b[2]}</p><span class="chip">${b[3]}</span></div>`).join('')}</div>
</div></section>
<section class="sec tint"><div class="wrap">
  <div class="sec-h"><span class="eyebrow">Before and after</span><h2>Drag to see the difference</h2><p class="lead">Slide the handle to compare life without and with an AI governance platform.</p></div>
  ${slider()}
</div></section>
<section class="sec"><div class="wrap">
  <div class="sec-h"><span class="eyebrow">For every role</span><h2>One platform, five perspectives</h2></div>
  <div class="persona-w"><div class="persona-l">${Object.keys(personas).map((k, i) => `<button class="role ${i ? '' : 'on'}" data-act="persona" data-p="${k}">${I(personas[k][1])}${personas[k][0]}</button>`).join('')}</div>
  <div class="card persona-d" id="persona-d"><div class="ico">${I(personas.exec[1])}</div><div><h3>${personas.exec[0]}</h3><p>${personas.exec[2]}</p><ul class="ticks">${personas.exec[3].map(x => `<li>${I('check')}${x}</li>`).join('')}</ul></div></div></div>
</div></section>
<section class="sec tint"><div class="wrap split">
  <div><span class="eyebrow">Illustrative estimator</span><h2>What could centralised workflows save?</h2><p class="lead">Adjust the assumptions to match your organisation. This is a simple illustration, not a prediction or a measured result.</p></div>
  <div class="card roi"><label>AI systems in portfolio <b id="roi-nv">40</b><input id="roi-n" type="range" min="5" max="200" value="40" oninput="T.actions.roi()"></label>
    <label>Hours per manual review <b id="roi-hv">16 h</b><input id="roi-h" type="range" min="4" max="60" value="16" oninput="T.actions.roi()"></label>
    <label>Assumed time reduction <b id="roi-rv">40%</b><input id="roi-r" type="range" min="10" max="80" value="40" oninput="T.actions.roi()"></label>
    <div class="roi-out" id="roi-out"></div></div>
</div></section>
<section class="cta dk"><div class="wrap"><h2>Ready to see it work?</h2><p class="lead">Classify an AI system and explore its compliance overview in the guided demo.</p><div class="cta-row center"><a class="btn btn-primary btn-lg" href="#/demo">${I('play')} Start the guided demo</a><a class="btn btn-ghost btn-lg" href="#/dashboard">Explore the dashboard</a></div></div></section>`;
    },
    init() { T.actions.roi(); T.reveal(document); }
  };
})(window.T);
