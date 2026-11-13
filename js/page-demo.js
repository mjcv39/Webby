/* Guided interactive product demonstration */
(function (T) {
  const I = T.icon, st = T.state = T.state || {};
  const STEPS = ['Select model', 'Intended use', 'Classification', 'Requirements', 'Compliance overview', 'Docs & next steps'];
  const DOCMAP = { 'Risk Assessment': 'Risk assessment report', 'Technical Documentation': 'Technical documentation (Annex IV)', 'Data Governance': 'Data governance record', 'Human Oversight': 'Human oversight procedure', 'Model Evaluation': 'Model evaluation report', 'Checklist': 'Compliance checklist', 'Transparency': 'Transparency disclosure', 'Incident Report': 'Incident / escalation record', 'Audit Log': 'Audit log export', 'Inventory': 'Inventory entry' };
  const reset = () => { st.demo = { step: 0, model: null, useId: '', text: '', r: null, have: new Set(), prov: 'openai' }; };
  reset();
  const D = () => st.demo;

  function stepper() {
    const d = D();
    return `<ol class="stepper">${STEPS.map((s, i) => `<li class="${i < d.step ? 'done' : ''} ${i === d.step ? 'cur' : ''}"><button ${i <= d.step ? `data-act="dgo" data-i="${i}"` : 'disabled'}><span>${i < d.step ? I('check') : i + 1}</span><b>${s}</b></button></li>`).join('')}</ol>`;
  }

  function panel() {
    const d = D(), r = d.r;
    switch (d.step) {
      case 0: {
        const p = T.PROVIDERS.find(x => x.id === d.prov);
        return `<h2>1 · Which AI model is your company using?</h2><p class="muted">Pick a provider, then a model. Third-party, open-source and in-house AI are all governed the same way.</p>
          <div class="filters">${T.PROVIDERS.map(x => `<button class="fchip ${x.id === d.prov ? 'on' : ''}" data-act="dprov" data-id="${x.id}">${x.name}</button>`).join('')}</div>
          <div class="grid g3">${p.models.map(m => `<button class="pick ${d.model === m.id ? 'on' : ''}" data-act="dmodel" data-id="${m.id}"><span class="mc-logo" style="background:${p.color}">${p.name[0]}</span><div><b>${m.name}</b><small>${m.access} · ${m.kind}</small></div>${d.model === m.id ? I('check') : ''}</button>`).join('')}</div>`;
      }
      case 1:
        return `<h2>2 · What will it be used for?</h2><p class="muted">Selected model: <b>${T.modelIndex[d.model].name}</b>. The <b>intended purpose</b> decides the classification, not the model.</p>
          <div class="form dflat"><label>Choose a use ${T.useSelect('d-use', d.useId)}</label><label>…or describe it<input id="d-text" type="text" maxlength="160" placeholder="e.g. rank job applicants" value="${T.esc(d.text)}"></label>
          <div class="ex">${[['Recruitment', 'h-recruit'], ['Customer chatbot', 'l-chatbot'], ['Meeting summaries', 'm-summary'], ['Loan scoring', 'h-credit'], ['Emotion tracking of staff', 'p-emotion']].map(e => `<button class="chip btn-chip" data-act="duse" data-u="${e[1]}">${e[0]}</button>`).join('')}</div></div>`;
      case 2:
        return `<h2>3 · Simulated risk classification</h2><div id="d-cls"></div>`;
      case 3:
        return `<h2>4 · Potentially applicable EU AI Act requirements</h2><p class="muted">${r.cls === 'prohibited' ? 'A prohibited practice has no compliance path: the duty is to stop.' : `${r.reqs.length} requirements for a <b>${T.RISK[r.cls].label.toLowerCase()}</b> system, with your role considered.`}</p>
          <div class="acc">${r.reqs.map(q => `<div class="acc-item"><button class="acc-h" data-act="acc" aria-expanded="false"><span class="acc-n">${q.art}</span><b>${T.esc(q.title)}</b><span class="chip">${q.who === 'both' ? 'Provider & deployer' : q.who === 'provider' ? 'Provider' : 'Deployer'}</span>${I('chevron')}</button><div class="acc-b"><div><p>${q.desc}</p></div></div></div>`).join('')}</div>`;
      case 4: {
        const n = r.reqs.length, k = d.have.size, pct = Math.round(k / n * 100);
        return `<h2>5 · Compliance overview</h2><p class="muted">Tick what your company already has in place. Tessera shows the remaining gaps (simulated gap analysis).</p>
          <div class="co"><div class="co-l">${T.ring(pct, 150, T.RISK[r.cls].color)}<div class="co-s"><div><b>${k}</b><small>in place</small></div><div><b>${n - k}</b><small>gaps</small></div></div></div>
          <ul class="chk big">${r.reqs.map((q, i) => `<li class="${d.have.has(i) ? 'done' : ''}"><label><input type="checkbox" data-act="dtick" data-i="${i}" ${d.have.has(i) ? 'checked' : ''}><span class="box">${I('check')}</span><span class="ct"><b>${T.esc(q.title)}</b><small>${q.art}</small></span><code>${d.have.has(i) ? 'In place' : 'Gap'}</code></label></li>`).join('')}</ul></div>`;
      }
      case 5:
        return `<h2>6 · Recommended documentation and next steps</h2>
          <div class="split"><div><h4>Documents to prepare</h4><div class="grid g1">${r.docs.map(c => { const doc = T.docs.find(x => x.cat === c); return `<button class="mini-doc big" data-act="doc" data-id="${doc.id}">${I('file')}<span>${DOCMAP[c] || c}</span>${I('eye')}</button>`; }).join('')}</div></div>
          <div><h4>Next steps</h4><ol class="steps">${r.next.map(n => `<li>${T.esc(n)}</li>`).join('')}</ol></div></div>
          <div class="done-box">${I('shield')}<div><b>Demo complete.</b> Add this system to the portfolio to see it appear in the dashboard counts.</div><button class="btn btn-primary" data-act="dadd">${I('plus')} Add to dashboard</button><a class="btn btn-ghost-l" href="#/dashboard">${I('layers')} Open dashboard</a></div>`;
    }
  }

  function canNext() {
    const d = D();
    if (d.step === 0) return !!d.model;
    if (d.step === 1) return !!(d.useId || d.text.trim());
    return true;
  }
  function draw() {
    const d = D(), root = T.$('#demo-root'); if (!root) return;
    const fresh = d.step !== st.lastStep || !st.lastStepSeen; st.lastStep = d.step; st.lastStepSeen = true;
    root.innerHTML = `${stepper()}<div class="card demo-card ${fresh ? 'fade' : ''}">${panel()}<div class="demo-nav"><button class="btn btn-ghost-l" data-act="dback" ${d.step === 0 ? 'disabled' : ''}>Back</button><span class="muted small">Step ${d.step + 1} of ${STEPS.length} · simulated demonstration</span>${d.step < 5 ? `<button class="btn btn-primary" data-act="dnext" ${canNext() ? '' : 'disabled'}>${d.step === 1 ? 'Classify' : 'Next'} ${I('arrow')}</button>` : `<button class="btn btn-ghost-l" data-act="drestart">${I('refresh')} Restart</button>`}</div></div>`;
    if (d.step === 2) {
      const out = T.$('#d-cls');
      T.runAssessment(d.r, out, () => {
        out.innerHTML = `<div class="result r-${d.r.cls}"><div class="res-head"><div class="res-ring">${I(d.r.cls === 'prohibited' ? 'ban' : d.r.cls === 'high' ? 'alert' : d.r.cls === 'limited' ? 'eye' : 'check')}</div><div><div class="eyebrow">${T.esc(d.r.name)}</div><h3>${T.RISK[d.r.cls].label}</h3><div class="muted">${d.r.ref}</div></div><span class="sim-tag">Simulated</span></div>
          <p class="why">${T.esc(d.r.why)}</p><div class="callout"><b>Same model, different purpose:</b> ${T.esc(d.r.model.name)} can fall into other tiers for other uses.<div class="contrast">${T.contrast(d.r.useCase.id).map(u => `<div class="ct-row"><span>${T.esc(u.label)}</span>${T.riskBadge(u.cls)}</div>`).join('')}</div></div>
          <p class="disc">${I('alert')}<span>Educational simulation, not a legal determination.</span></p></div>`;
      });
    }
  }
  const go = n => { D().step = n; draw(); const e = T.$('#demo-root'); e && window.scrollTo({ top: e.offsetTop - 90, behavior: 'smooth' }); };

  Object.assign(T.actions, {
    dprov: el => { D().prov = el.dataset.id; draw(); },
    dmodel: el => { D().model = el.dataset.id; draw(); },
    duse: el => { const u = T.$('#d-use'); u.value = el.dataset.u; T.$('#d-text').value = ''; D().useId = el.dataset.u; D().text = ''; T.$('[data-act="dnext"]').disabled = false; },
    dnext: () => {
      const d = D();
      if (d.step === 1) {
        d.useId = T.$('#d-use').value; d.text = T.$('#d-text').value;
        if (!d.useId && !d.text.trim()) { T.toast('Choose or describe an intended use', 'warn'); return; }
        d.r = T.assess({ modelId: d.model, useId: d.text.trim() ? '' : d.useId, text: d.text, role: 'both' }); d.have = new Set();
      }
      go(d.step + 1);
    },
    dback: () => go(Math.max(0, D().step - 1)),
    dgo: el => go(+el.dataset.i),
    drestart: () => { reset(); draw(); },
    dtick: el => { const d = D(), i = +el.dataset.i; el.checked ? d.have.add(i) : d.have.delete(i); const y = window.scrollY; draw(); window.scrollTo(0, y); },
    dadd: el => { T.addToPortfolio(D().r); el.disabled = true; el.innerHTML = I('check') + ' Added'; T.toast('System added. It now appears in the dashboard portfolio.'); }
  });
  /* enable the Classify button as soon as the user picks or types a use */
  document.addEventListener('input', e => {
    if (e.target.id === 'd-use' || e.target.id === 'd-text') { const b = T.$('[data-act="dnext"]'); if (b) b.disabled = !(T.$('#d-use').value || T.$('#d-text').value.trim()); }
  });
  document.addEventListener('change', e => { if (e.target.id === 'd-use') { const b = T.$('[data-act="dnext"]'); if (b) b.disabled = false; if (T.$('#d-text')) T.$('#d-text').value = ''; } });

  T.pages.demo = {
    render() {
      reset(); st.lastStepSeen = false;
      return `
<section class="phead dk"><div class="wrap"><span class="eyebrow">Interactive product demonstration</span><h1>Guided demo: from AI model to compliance overview</h1>
<p class="lead">Six steps, about three minutes. Everything is simulated for education, and nothing is stored or sent anywhere.</p></div></section>
<section class="sec tint tight"><div class="wrap"><div id="demo-root"></div></div></section>`;
    },
    init() { draw(); }
  };
})(window.T);
