/* Guided demo: three steps */
(function (T) {
  const I = T.icon, st = T.state;
  const STEPS = ['Choose', 'Classify & review', 'Act'];
  const DOCMAP = { 'Risk Assessment': 'Risk assessment', 'Technical Documentation': 'Technical documentation', 'Data Governance': 'Data governance', 'Human Oversight': 'Human oversight', 'Model Evaluation': 'Model evaluation', 'Checklist': 'Compliance checklist', 'Transparency': 'Transparency disclosure', 'Incident Report': 'Incident record', 'Audit Log': 'Audit log', 'Inventory': 'Inventory entry' };
  const reset = () => { st.demo = { step: 0, model: 'gpt-5', useId: '', text: '', r: null, have: new Set() }; st.lastStepSeen = false; };
  reset();
  const D = () => st.demo;
  const icon = c => c === 'prohibited' ? 'ban' : c === 'high' ? 'alert' : c === 'limited' ? 'eye' : 'check';

  const stepper = () => `<ol class="stepper">${STEPS.map((s, i) => `<li class="${i < D().step ? 'done' : ''} ${i === D().step ? 'cur' : ''}"><button ${i < D().step ? `data-act="dgo" data-i="${i}"` : 'disabled'}><span>${i < D().step ? I('check') : i + 1}</span><b>${s}</b></button></li>`).join('')}</ol>`;

  function panel() {
    const d = D(), r = d.r;
    if (d.step === 0) return `<h3 class="d-h">1 · What AI, and what for?</h3>
      <div class="dflat"><label>AI model${T.modelSelect('d-model', d.model)}</label><label>Intended use ${T.useSelect('d-use', d.useId)}</label><label>…or describe it<input id="d-text" type="text" maxlength="160" placeholder="e.g. rank job applicants" value="${T.esc(d.text)}"></label>
      <div class="ex">${[['Recruitment', 'h-recruit'], ['Chatbot', 'l-chatbot'], ['Summaries', 'm-summary'], ['Loan scoring', 'h-credit'], ['Staff emotions', 'p-emotion']].map(e => `<button class="chip btn-chip" data-act="duse" data-u="${e[1]}">${e[0]}</button>`).join('')}</div></div>`;
    if (d.step === 1) {
      const n = r.reqs.length, k = d.have.size, pct = Math.round(k / n * 100);
      return `<div id="d-cls"></div>
        <div class="co hidden-until" id="d-gap"><div class="co-l">${T.ring(pct, 130, T.RISK[r.cls].color)}<div class="co-s"><div><b>${k}</b><small>in place</small></div><div><b>${n - k}</b><small>gaps</small></div></div></div>
        <div><h4>Tick what you already have</h4><ul class="chk big">${r.reqs.map((q, i) => `<li class="${d.have.has(i) ? 'done' : ''}"><label><input type="checkbox" data-act="dtick" data-i="${i}" ${d.have.has(i) ? 'checked' : ''}><span class="box">${I('check')}</span><span class="ct"><b>${T.esc(q.title)}</b><small>${q.art}</small></span><code>${d.have.has(i) ? 'In place' : 'Gap'}</code></label></li>`).join('')}</ul></div></div>`;
    }
    return `<h3 class="d-h">3 · Documents and next steps</h3>
      <div class="split top"><div><h4>Prepare</h4><div class="grid g1">${r.docs.map(c => { const doc = T.docs.find(x => x.cat === c); return `<button class="mini-doc big" data-act="doc" data-id="${doc.id}">${I('file')}<span>${DOCMAP[c] || c}</span>${I('eye')}</button>`; }).join('')}</div></div>
      <div><h4>Next steps</h4><ol class="steps">${r.next.map(n => `<li>${T.esc(n)}</li>`).join('')}</ol></div></div>
      <div class="done-box">${I('shield')}<div><b>Demo complete.</b> Add it to the dashboard portfolio.</div><button class="btn btn-primary" data-act="dadd">${I('plus')} Add to dashboard</button><a class="btn btn-ghost-l" href="#dashboard">${I('layers')} View dashboard</a></div>`;
  }

  function draw() {
    const d = D(), root = T.$('#demo-root'); if (!root) return;
    const fresh = d.step !== st.lastStep || !st.lastStepSeen; st.lastStep = d.step; st.lastStepSeen = true;
    root.innerHTML = `${stepper()}<div class="card demo-card ${fresh ? 'fade' : ''}">${panel()}<div class="demo-nav"><button class="btn btn-ghost-l" data-act="dback" ${d.step === 0 ? 'disabled' : ''}>Back</button><span class="muted small">Step ${d.step + 1} of ${STEPS.length} · simulated</span>${d.step === 0 ? `<button class="btn btn-primary" data-act="dnext">Classify ${I('arrow')}</button>` : d.step === 1 ? `<button class="btn btn-primary" data-act="dnext">Next ${I('arrow')}</button>` : `<button class="btn btn-ghost-l" data-act="drestart">${I('refresh')} Restart</button>`}</div></div>`;
    if (d.step === 1) {
      const out = T.$('#d-cls'), gap = T.$('#d-gap');
      if (fresh) T.runAssessment(r2(), out, () => { out.innerHTML = summary(d.r); gap.classList.remove('hidden-until'); });
      else { out.innerHTML = summary(d.r); gap.classList.remove('hidden-until'); }
    }
  }
  const r2 = () => D().r;
  function summary(r) {
    return `<div class="result r-${r.cls}"><div class="res-head"><div class="res-ring">${I(icon(r.cls))}</div><div><div class="eyebrow">${T.esc(r.name)}</div><h3>${T.RISK[r.cls].label}</h3><div class="muted">${r.ref}</div></div><span class="sim-tag">Simulated</span></div>
      <p class="why">${T.esc(r.why)}</p><div class="contrast inline-c"><small>Same model, other purposes:</small>${T.contrast(r.useCase.id).map(u => `<div class="ct-row"><span>${T.esc(u.label.split(':')[0].split(' (')[0])}</span>${T.riskBadge(u.cls)}</div>`).join('')}</div></div>`;
  }
  const go = n => { D().step = n; draw(); const e = T.$('#demo'); e && e.scrollIntoView({ behavior: 'smooth', block: 'start' }); };

  Object.assign(T.actions, {
    duse: el => { T.$('#d-use').value = el.dataset.u; T.$('#d-text').value = ''; },
    dnext: () => {
      const d = D();
      if (d.step === 0) {
        d.model = T.$('#d-model').value; d.useId = T.$('#d-use').value; d.text = T.$('#d-text').value;
        if (!d.useId && !d.text.trim()) { T.toast('Choose or describe an intended use', 'warn'); return; }
        d.r = T.assess({ modelId: d.model, useId: d.text.trim() ? '' : d.useId, text: d.text, role: 'both' }); d.have = new Set();
      }
      go(d.step + 1);
    },
    dback: () => go(Math.max(0, D().step - 1)),
    dgo: el => go(+el.dataset.i),
    drestart: () => { reset(); draw(); },
    dtick: el => { const d = D(), i = +el.dataset.i; el.checked ? d.have.add(i) : d.have.delete(i); const y = window.scrollY; draw(); window.scrollTo(0, y); },
    dadd: el => { T.addToPortfolio(D().r); el.disabled = true; el.innerHTML = I('check') + ' Added'; T.toast('Added. The dashboard counts have updated.'); T.refreshDashboard && T.refreshDashboard(); }
  });

  T.sections.demo = {
    id: 'demo',
    render() {
      reset();
      return `<section id="demo" class="sec dark dk"><div class="wrap">
  <div class="sec-h"><span class="eyebrow rv">08 · Guided demo</span><h2 class="rv">Try it in three steps</h2>
    <ul class="pts rv"><li>Choose a model and a purpose</li><li>Get a classification and gap analysis</li><li>Receive documents and next steps</li></ul></div>
  <div id="demo-root" class="rv" data-anim="zoom"></div>
</div></section>`;
    },
    init() { draw(); }
  };
})(window.T);
