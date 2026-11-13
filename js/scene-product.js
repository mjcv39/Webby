/* Scene 4 · The platform: a monitor mockup with the live dashboard and explorable hotspots */
(function (T) {
  T.scenes = T.scenes || {};
  const I = T.icon;
  const ORDER = { prohibited: 0, high: 1, limited: 2, minimal: 3 };
  const HOTSPOTS = [
    [27, 22, 'Every system, counted', 'Live totals by risk tier, updated as systems are registered.'],
    [17, 50, 'Risk mix at a glance', 'See instantly how much of your AI is high-risk or prohibited.'],
    [44, 50, 'Readiness score', 'One number for how prepared you are, per system and overall.'],
    [40, 83, 'Owned and assessed', 'Each system has an owner, a class and a last-assessed date. Click a row.'],
    [86, 70, 'Nothing slips', 'Deadlines and alerts surface before they become problems.']
  ];

  function screen() {
    const c = { prohibited: 0, high: 0, limited: 0, minimal: 0 }; T.systems.forEach(s => c[s.cls]++);
    const total = T.systems.length, overall = Math.round(T.systems.reduce((a, s) => a + s.score, 0) / total);
    const rows = T.systems.slice().sort((a, b) => (b.owner === 'You (demo)') - (a.owner === 'You (demo)') || ORDER[a.cls] - ORDER[b.cls]).slice(0, 6);
    const kpi = (l, n, col) => `<div class="a-kpi" style="--c:${col}"><small>${l}</small><b data-count="${n}">${n}</b></div>`;
    return `<div class="app" id="app-ui">
      <aside class="a-side">${T.LOGO}${['layers', 'scan', 'pulse', 'file', 'users', 'shield'].map((k, i) => `<span class="${i ? '' : 'on'}">${I(k)}</span>`).join('')}</aside>
      <div class="a-main">
        <div class="a-top"><div><b>Governance overview</b><small>${T.COMPANY} · ${T.fmt(new Date())}</small></div><div class="a-search">${I('search')} Search systems</div><span class="a-av">IK</span></div>
        <div class="a-kpis">${kpi('AI systems', total, '#fbc3b9')}${kpi('High risk', c.high, T.RISK.high.color)}${kpi('Limited', c.limited, T.RISK.limited.color)}${kpi('Minimal', c.minimal, T.RISK.minimal.color)}${kpi('Prohibited', c.prohibited, T.RISK.prohibited.color)}</div>
        <div class="a-row">
          <div class="a-card"><h4>Risk distribution</h4>${T.donut(['minimal', 'limited', 'high', 'prohibited'].map(k => ({ v: c[k], color: T.RISK[k].color, label: T.RISK[k].label })), { size: 150, th: 14, big: total, small: 'systems' })}</div>
          <div class="a-card"><h4>Compliance readiness</h4>${T.gauge(overall)}</div>
          <div class="a-card wide"><h4>Readiness trend · 12 months</h4>${T.line(T.trend, T.trendLabels, { h: 150, color: '#f1745e', suf: '%', min: 40, max: 80 })}</div>
        </div>
        <div class="a-row b">
          <div class="a-card wide2"><h4>AI system portfolio <small>${total} registered</small></h4>
            <table class="a-tbl"><tbody>${rows.map(s => `<tr data-act="sys" data-id="${s.id}" tabindex="0" role="button"><td><b>${T.esc(s.name)}</b>${s.owner === 'You (demo)' ? '<em>NEW</em>' : ''}</td><td>${T.esc(s.provider)}</td><td>${s.dept}</td><td>${T.riskBadge(s.cls)}</td><td>${T.statBadge(s.status)}</td></tr>`).join('')}</tbody></table>
            <div class="a-more">+ ${total - rows.length} more systems</div></div>
          <div class="a-card"><h4>Next deadlines</h4><ul class="a-dl">${T.deadlines.slice(0, 3).map(d => `<li><b>${d.date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</b><span>${T.esc(d.label.split(' (')[0])}</span></li>`).join('')}</ul>
            <h4 class="mt">Open alerts</h4><div class="a-al"><b>${T.alerts.filter(a => !a.done).length}</b><span>${T.alerts.filter(a => !a.done && a.sev === 'critical').length} critical</span></div></div>
        </div>
      </div>
    </div>`;
  }

  function fit() {
    const scr = T.$('#screen'); if (!scr) return;
    scr.style.setProperty('--k', (scr.clientWidth / 1180).toFixed(4));
  }
  function refresh() {
    const scr = T.$('#screen-ui'); if (!scr) return;
    scr.innerHTML = screen(); T.countUp(scr);
  }

  function openProfile(id) {
    const s = T.getSystem(id), uc = T.useIndex[s.useId], reqs = T.reqsFor(uc, 'both');
    const done = Math.max(0, reqs.length - s.open), docs = T.docs.filter(d => d.sys === s.id);
    T.openModal(`<div class="prof">
      <div class="prof-h"><div><span class="chap"><b>${s.id}</b>${s.origin}</span><h2>${T.esc(s.name)}</h2><div class="row">${T.riskBadge(s.cls)}${T.statBadge(s.status)}</div></div>${T.ring(s.score, 92, T.RISK[s.cls].color)}</div>
      <dl class="facts"><div><dt>Provider</dt><dd>${T.esc(s.provider)} · ${T.esc(s.model)}</dd></div><div><dt>Owner</dt><dd>${s.owner}</dd></div><div class="w2"><dt>Intended use</dt><dd>${T.esc(s.use)}</dd></div><div><dt>Legal basis (simulated)</dt><dd>${uc.ref}</dd></div><div><dt>Requirements met</dt><dd>${done} of ${reqs.length}</dd></div></dl>
      <ul class="chk">${reqs.slice(0, 6).map((q, i) => `<li class="${i < done ? 'done' : ''}">${I(i < done ? 'check' : 'clock')}<span>${T.esc(q.title)}</span><code>${q.art}</code></li>`).join('')}</ul>
      ${docs.length ? `<div class="row mt">${docs.map(d => `<button class="chip" data-act="doc" data-id="${d.id}">${I('file')} ${T.esc(d.cat)}</button>`).join('')}</div>` : ''}
      <p class="foot-note">Simulated profile for an educational demo.</p></div>`, true);
  }

  Object.assign(T.actions, {
    sys: el => openProfile(el.dataset.id),
    hs: el => { const on = !el.classList.contains('open'); T.$$('.hs').forEach(h => h.classList.remove('open')); el.classList.toggle('open', on); }
  });

  T.scenes.product = {
    id: 'product', label: 'The platform',
    render() {
      return `<section id="product" class="scene">
  <div class="wrap">
    <div class="scene-h"><span class="chap rv"><b>04</b>The platform</span><h2>One screen for your <span class="warm">whole AI estate.</span></h2><p class="sub rv">Tap the glowing points to explore. Anything you added in chapter 3 is already here.</p></div>
  </div>
  <div class="imac-wrap" data-scrub>
    <div class="imac">
      <div class="bezel"><div class="screen" id="screen"><div id="screen-ui">${screen()}</div>
        ${HOTSPOTS.map((h, i) => `<button class="hs ${h[0] > 60 ? 'left' : ''}" style="left:${h[0]}%;top:${h[1]}%" data-act="hs" aria-label="${h[2]}"><span>${i + 1}</span><div class="hs-tip"><b>${h[2]}</b><small>${h[3]}</small></div></button>`).join('')}
      </div><div class="chin"><i></i></div></div>
      <div class="neck"></div><div class="foot"></div>
    </div>
  </div>
</section>`;
    },
    init() { fit(); window.addEventListener('resize', fit); T.listeners.push(refresh); }
  };
})(window.T);
