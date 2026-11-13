/* Hero + Platform overview sections */
(function (T) {
  const I = T.icon;
  T.sections = T.sections || {};

  const problems = [
    ['eye', 'No visibility', 'AI tools hidden in every department', 'One live registry of every AI system'],
    ['scale', 'Unclear rules', 'Which EU AI Act duties apply?', 'Purpose-based risk classification'],
    ['alert', 'Hidden risks', 'Issues surface only after incidents', 'Continuous monitoring and alerts'],
    ['file', 'Scattered records', 'Evidence lives in inboxes and drives', 'One governed document library'],
    ['clock', 'Growing duties', 'Deadlines stack up unnoticed', 'Deadline and readiness tracking'],
    ['link', 'Vendor blind spots', 'Third-party AI with no oversight', 'Provider-agnostic model registry']
  ];
  const modules = [
    ['dashboard', 'layers', 'Dashboard', 'Portfolio, risk mix, readiness'],
    ['assess', 'scan', 'Risk assessment', 'Model + purpose = classification'],
    ['eu-act', 'book', 'EU AI Act guide', 'Pyramid, timeline, penalties'],
    ['docs', 'file', 'Documentation', 'Records, previews, checklists'],
    ['monitoring', 'pulse', 'Monitoring', 'Alerts before incidents'],
    ['value', 'trend', 'Business value', 'Before vs after governance']
  ];
  const steps = [['cpu', 'Pick a model'], ['target', 'State the purpose'], ['scan', 'Get a classification'], ['scale', 'See the duties'], ['chart', 'Review the gaps'], ['file', 'Act on next steps']];

  function heroVisual() {
    return `<div class="hv" data-parallax="0.06">
      <svg class="hv-net" viewBox="0 0 600 520" aria-hidden="true">
        <g stroke="rgba(120,170,255,.25)" fill="none"><path d="M60 80L200 160L330 90L520 170"/><path d="M200 160L150 330L320 380L520 170"/><path d="M150 330L60 450M320 380L450 470M330 90L400 20"/></g>
        ${[[60, 80], [200, 160], [330, 90], [520, 170], [150, 330], [320, 380], [60, 450], [450, 470], [400, 20]].map((p, i) => `<circle class="nn" style="animation-delay:${i * .4}s" cx="${p[0]}" cy="${p[1]}" r="5" fill="#22d3ee"/>`).join('')}
      </svg>
      <div class="hv-win">
        <div class="hv-bar"><i></i><i></i><i></i><span>tessera.app / dashboard</span></div>
        <div class="hv-body">
          <div class="hv-kpis"><div><small>AI systems</small><b data-count="18">0</b></div><div><small>High risk</small><b style="color:var(--r-high)" data-count="5">0</b></div><div><small>Open alerts</small><b style="color:var(--r-prohibited)" data-count="7">0</b></div></div>
          <div class="hv-row"><div class="hv-card">${T.donut([{ v: 6, color: '#2dd4a7', label: 'Minimal' }, { v: 5, color: '#4da3ff', label: 'Limited' }, { v: 5, color: '#ffa94d', label: 'High' }, { v: 2, color: '#ff5c6c', label: 'Prohibited' }], { size: 120, th: 14, big: 18, small: 'systems' })}</div>
            <div class="hv-card hv-list">${T.systems.slice(0, 4).map(s => `<div class="hv-li"><span>${T.esc(s.name)}</span>${T.riskBadge(s.cls)}</div>`).join('')}</div></div>
          <div class="hv-card">${T.line(T.trend, T.trendLabels, { h: 120, color: '#22d3ee', suf: '%', label: 'Compliance trend' })}</div>
        </div>
      </div>
      <div class="hv-float f1">${I('alert')}<div><b>Model updated</b><small>Reassessment needed</small></div></div>
      <div class="hv-float f2">${I('shield')}<div><b>Classified: High risk</b><small>Annex III(4)(a)</small></div></div>
      <div class="hv-float f3">${I('check')}<div><b>Disclosure live</b><small>Chatbot verified</small></div></div>
    </div>`;
  }

  T.sections.hero = {
    id: 'top',
    render() {
      return `<section id="top" class="hero dk"><div class="hero-bg" data-parallax="-0.04"></div><div class="wrap hero-in">
  <div class="hero-t">
    <span class="pill rv">${I('shield')} AI governance for the EU AI Act era</span>
    <h1 class="rv" style="--d:100ms">Adopt AI with <span class="grad">confidence</span>, not guesswork.</h1>
    <ul class="hero-points" data-stagger>
      <li>${I('eye')}<b>See</b> every AI system you run</li>
      <li>${I('scale')}<b>Know</b> your EU AI Act duties</li>
      <li>${I('shield')}<b>Prove</b> it with audit-ready records</li>
    </ul>
    <div class="cta-row rv" style="--d:500ms"><a class="btn btn-primary btn-lg" href="#demo">${I('play')} Try the guided demo</a><a class="btn btn-ghost btn-lg" href="#dashboard">See the dashboard ${I('arrow')}</a></div>
  </div>
  ${heroVisual()}
  <a class="scroll-cue" href="#platform" aria-label="Scroll down"><span></span></a>
</div></section>`;
    }
  };

  T.sections.platform = {
    id: 'platform',
    render() {
      return `<section id="platform" class="sec"><div class="wrap">
  <div class="sec-h"><span class="eyebrow rv">01 · The challenge</span><h2 class="rv">AI is spreading faster than oversight</h2></div>
  <div class="grid g3 pgrid" data-stagger>
    ${problems.map(p => `<div class="pcard"><div class="ico bad">${I(p[0])}</div><h3>${p[1]}</h3><div class="p-line bad">${I('x')}${p[2]}</div><div class="p-line good">${I('check')}${p[3]}</div></div>`).join('')}
  </div>
  <div class="sec-h gap-top"><span class="eyebrow rv">One platform</span><h2 class="rv">Six connected modules</h2></div>
  <div class="grid g3 mgrid2" data-stagger>
    ${modules.map(m => `<a class="mtile" href="#${m[0]}"><div class="ico">${I(m[1])}</div><div><b>${m[2]}</b><small>${m[3]}</small></div>${I('arrow')}</a>`).join('')}
  </div>
  <div class="how rv" data-anim="zoom" data-scrollprog><div class="how-line"><i></i></div>
    ${steps.map((s, i) => `<div class="how-s"><div class="hnum">${i + 1}</div><div class="ico">${I(s[0])}</div><b>${s[1]}</b></div>`).join('')}
  </div>
  <div class="built rv"><span class="muted">Built for</span>${['Startups', 'SMEs', 'Enterprises', 'Finance', 'Healthcare', 'HR', 'Public sector', 'Education', 'Energy'].map(x => `<span class="chip">${x}</span>`).join('')}</div>
</div></section>`;
    }
  };
})(window.T);
