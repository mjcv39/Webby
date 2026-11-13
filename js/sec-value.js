/* Business value section */
(function (T) {
  const I = T.icon;
  const benefits = [
    ['scale', 'Regulatory preparedness', 'Know which duties apply, and when'],
    ['shield', 'Reduced exposure', 'Find gaps before they become findings'],
    ['eye', 'Central visibility', 'Every AI system, vendor and shadow tool'],
    ['users', 'Accountability', 'Owners, approvals, audit trails'],
    ['zap', 'Efficiency', 'Workflows replace spreadsheets'],
    ['brain', 'Responsible adoption', 'Move faster with guardrails in place'],
    ['star', 'Competitive edge', 'Prove trust to customers and regulators']
  ];
  const without = ['Scattered AI tools', 'Unclear ownership', 'Manual risk assessments', 'Missing documentation', 'Limited visibility', 'Reactive compliance'];
  const withp = ['Centralised AI inventory', 'Clear risk classifications', 'Organised documentation', 'Compliance visibility', 'Proactive alerts', 'Structured governance'];
  const personas = [['trend', 'Executives', 'Risk and readiness at a glance'], ['scale', 'Compliance', 'Duties mapped, evidence ready'], ['cpu', 'IT managers', 'Shadow AI found, vendors tracked'], ['brain', 'AI developers', 'Know what to document and test'], ['alert', 'Risk teams', 'Monitor and mitigate in one place']];

  T.actions.roi = () => {
    const n = +T.$('#roi-n').value, h = +T.$('#roi-h').value, r = +T.$('#roi-r').value;
    T.$('#roi-nv').textContent = n; T.$('#roi-hv').textContent = h + ' h'; T.$('#roi-rv').textContent = r + '%';
    T.$('#roi-out').innerHTML = `<b>${Math.round(n * 2 * h * r / 100).toLocaleString()}</b><span>staff hours potentially saved per year</span><small>${n} systems × 2 reviews × ${h} h × ${r}% assumed reduction</small>`;
  };

  T.sections.value = {
    id: 'value',
    render() {
      return `<section id="value" class="sec"><div class="wrap">
  <div class="sec-h"><span class="eyebrow rv">07 · Business value</span><h2 class="rv">Why organisations need AI governance</h2></div>
  <div class="grid g4 bgrid" data-stagger>${benefits.map((b, i) => `<div class="bcard ${i === 6 ? 'last' : ''}"><div class="ico">${I(b[0])}</div><h3>${b[1]}</h3><p>${b[2]}</p></div>`).join('')}</div>

  <div class="sec-h gap-top"><span class="eyebrow rv">Before and after</span><h2 class="rv">Drag to compare</h2></div>
  <div class="ba rv" data-anim="zoom" id="ba" style="--x:50%">
    <div class="ba-layer ba-without"><div class="ba-tag bad">Without governance</div>
      <div class="chaos">${['GPT tab', 'shadow tool', 'vendor bot', 'untracked API', 'old spreadsheet', 'email thread', 'who owns this?', 'v7_FINAL.docx', 'Slack export'].map((x, i) => `<span style="--x:${(i * 29) % 82}%;--y:${(i * 41) % 78}%;--r:${(i * 23) % 30 - 15}deg">${x}</span>`).join('')}</div>
      <ul>${without.map(x => `<li>${I('x')}${x}</li>`).join('')}</ul></div>
    <div class="ba-layer ba-with"><div class="ba-tag good">With Tessera</div>
      <div class="order">${['Registry', 'Classified', 'Owned', 'Documented', 'Monitored', 'Audit-ready'].map(x => `<span>${I('check')}${x}</span>`).join('')}</div>
      <ul>${withp.map(x => `<li>${I('check')}${x}</li>`).join('')}</ul></div>
    <div class="ba-handle"><span>${I('chevron')}</span></div>
    <input type="range" min="2" max="98" value="50" id="ba-r" aria-label="Compare without and with Tessera" oninput="document.getElementById('ba').style.setProperty('--x',this.value+'%')">
  </div>

  <div class="sec-h gap-top"><span class="eyebrow rv">For every role</span><h2 class="rv">One platform, five perspectives</h2></div>
  <div class="grid g5" data-stagger>${personas.map(p => `<div class="persona"><div class="ico">${I(p[0])}</div><b>${p[1]}</b><small>${p[2]}</small></div>`).join('')}</div>

  <div class="split gap-top">
    <div><span class="eyebrow rv">Illustrative estimator</span><h2 class="rv">What could workflows save?</h2><ul class="pts rv"><li>Adjust the assumptions</li><li>A simple illustration, not a prediction</li></ul></div>
    <div class="card roi rv" data-anim="right"><label>AI systems <b id="roi-nv">40</b><input id="roi-n" type="range" min="5" max="200" value="40" oninput="T.actions.roi()"></label>
      <label>Hours per manual review <b id="roi-hv">16 h</b><input id="roi-h" type="range" min="4" max="60" value="16" oninput="T.actions.roi()"></label>
      <label>Assumed time reduction <b id="roi-rv">40%</b><input id="roi-r" type="range" min="10" max="80" value="40" oninput="T.actions.roi()"></label>
      <div class="roi-out" id="roi-out"></div></div>
  </div>
</div></section>`;
    },
    init() {
      T.actions.roi();
      /* auto-sweep the before/after slider once when it scrolls into view */
      const ba = T.$('#ba'); if (!ba || !('IntersectionObserver' in window)) return;
      const io = new IntersectionObserver(es => { if (!es[0].isIntersecting) return; io.disconnect();
        const rng = T.$('#ba-r'), t0 = performance.now();
        const step = t => { const p = Math.min(1, (t - t0) / 1800), e = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2, x = 92 - 42 * e; ba.style.setProperty('--x', x + '%'); rng.value = x; if (p < 1) requestAnimationFrame(step); };
        requestAnimationFrame(step); }, { threshold: .5 });
      io.observe(ba);
    }
  };
})(window.T);
