/* Scene 3 · Try it: a working mini-version of Tessera.
   Assess → Requirements → Documents → Monitor, all driven by the system you classify. */
(function (T) {
  T.scenes = T.scenes || {};
  const I = T.icon, st = T.state;
  const MODELS = ['gpt-5', 'claude-sonnet', 'gemini-pro', 'llama-4', 'mistral-large', 'deepseek-v3'];
  const USES = [['m-write', 'Draft emails'], ['m-summary', 'Summarise meetings'], ['l-chatbot', 'Customer chatbot'], ['l-genimage', 'Generate ad images'], ['h-recruit', 'Screen CVs'], ['h-credit', 'Score loan applicants'], ['h-learning', 'Grade exams'], ['p-emotion', 'Track staff emotions']];
  const ORDER = ['minimal', 'limited', 'high', 'prohibited'];
  const ICON = { prohibited: 'ban', high: 'alert', limited: 'eye', minimal: 'check' };
  const TABS = [['assess', 'scan', 'Assess'], ['reqs', 'check', 'Requirements'], ['docs', 'file', 'Documents'], ['monitor', 'pulse', 'Monitor']];
  const DOCNAME = { 'Risk Assessment': 'Risk assessment report', 'Technical Documentation': 'Technical documentation (Annex IV)', 'Data Governance': 'Data governance record', 'Human Oversight': 'Human oversight procedure', 'Model Evaluation': 'Model evaluation report', 'Checklist': 'Compliance checklist', 'Transparency': 'Transparency disclosure', 'Incident Report': 'Escalation & incident record', 'Audit Log': 'Audit log export', 'Inventory': 'AI inventory entry' };
  const DOCICON = { 'Risk Assessment': 'scan', 'Technical Documentation': 'cpu', 'Data Governance': 'lock', 'Human Oversight': 'users', 'Model Evaluation': 'chart', 'Checklist': 'check', 'Transparency': 'eye', 'Incident Report': 'alert', 'Audit Log': 'clock', 'Inventory': 'layers' };
  st.cls = { model: 'gpt-5', use: 'm-write', text: '' };
  st.sim = { tab: 'assess', key: '', done: new Set(), docs: {}, alerts: [], log: [], filter: 'all' };

  const now = () => new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const useLabel = r => st.cls.text || (USES.find(u => u[0] === st.cls.use) || [, r.useCase.label])[1];
  const log = text => { st.sim.log.unshift({ t: now(), text }); st.sim.log = st.sim.log.slice(0, 12); };

  /* starting alerts depend on the risk class */
  function seedAlerts(r) {
    const A = (sev, title, why, fix) => ({ id: Math.random().toString(36).slice(2, 7), sev, title, why, fix, done: false });
    return ({
      prohibited: [A('critical', 'Prohibited practice detected: system blocked', 'Art. 5 bans this use. Penalties reach €35M or 7% of turnover.', 'Keep suspended and escalate to Legal')],
      high: [A('high', 'Human oversight not yet assigned', 'Art. 14 requires people who can understand, override or stop the system.', 'Name trained reviewers'), A('medium', 'Technical documentation missing', 'Art. 11 requires an Annex IV file before go-live.', 'Generate the draft in Documents')],
      limited: [A('medium', 'AI disclosure missing in one channel', 'Art. 50 requires people to know they are dealing with AI.', 'Publish the disclosure text')],
      minimal: []
    })[r.cls];
  }

  /* ---------- result card (Assess tab) ---------- */
  function card(r) {
    const c = T.RISK[r.cls], idx = ORDER.indexOf(r.cls), more = r.reqs.length - 4;
    return `<div class="res r-${r.cls}">
      <div class="res-top"><span class="m-logo" style="background:${r.model.color}">${r.model.provider[0]}</span><span><b>${T.esc(r.model.name)}</b> · ${T.esc(useLabel(r))}</span><span class="sim-tag">Simulated</span></div>
      <div class="res-tier"><span class="res-ic">${I(ICON[r.cls])}</span><div><h3>${c.label}</h3><code>${T.esc(r.ref)}</code></div></div>
      <div class="spectrum">${ORDER.map(k => `<i style="background:${T.RISK[k].color}"></i>`).join('')}<span class="marker" data-to="${idx * 25 + 12.5}" style="left:${(st.prevIdx == null ? idx : st.prevIdx) * 25 + 12.5}%"></span></div>
      <div class="spec-l"><span>Minimal</span><span>Limited</span><span>High</span><span>Prohibited</span></div>
      <p class="res-why">${T.esc(r.why)}</p>
      <div class="res-reqs"><b>${r.cls === 'prohibited' ? 'Required action' : r.reqs.length + ' potential requirements'}</b><div class="chips">${r.reqs.slice(0, 4).map(q => `<span class="chip" title="${T.esc(q.desc)}">${T.esc(q.title)} <small>${q.art}</small></span>`).join('')}${more > 0 ? `<span class="chip ghost">+${more} more</span>` : ''}</div></div>
      <div class="res-act"><button class="btn btn-sun" data-act="stab" data-t="reqs">Work through the requirements ${I('arrow')}</button><span class="note">${T.esc(r.provider)} supplies the model. Your company owns the risk of the <i>system</i>.</span></div>
    </div>`;
  }

  /* ---------- Requirements tab ---------- */
  function reqsPane(r) {
    const s = st.sim, list = r.reqs.map((q, i) => ({ q, i })).filter(x => s.filter === 'all' || x.q.who === s.filter || x.q.who === 'both');
    const pct = Math.round(s.done.size / r.reqs.length * 100);
    return `<div class="pane-h"><div><h3>${r.cls === 'prohibited' ? 'Required actions' : 'Requirements'} <small>${s.done.size} of ${r.reqs.length} in place</small></h3><p>Tick what your company already has. Readiness updates live.</p></div>${T.ring(pct, 76, T.RISK[r.cls].color)}</div>
      <div class="pane-tools"><div class="seg">${[['all', 'All'], ['provider', 'Provider'], ['deployer', 'Deployer']].map(f => `<button class="${s.filter === f[0] ? 'on' : ''}" data-act="rfilter" data-f="${f[0]}">${f[1]}</button>`).join('')}</div><button class="btn btn-ghost btn-xs" data-act="rauto">${I('zap')} Auto-detect existing controls</button></div>
      <ul class="rlist">${list.map(({ q, i }) => `<li class="${s.done.has(i) ? 'done' : ''}"><label><input type="checkbox" data-act="rtick" data-i="${i}" ${s.done.has(i) ? 'checked' : ''}><span class="box">${I('check')}</span><span class="ct"><b>${T.esc(q.title)}</b><small>${q.desc}</small></span><span class="who">${q.who === 'both' ? 'Both' : q.who[0].toUpperCase() + q.who.slice(1)}</span><code>${q.art}</code></label></li>`).join('')}</ul>
      <div class="pane-f"><button class="btn btn-sun" data-act="stab" data-t="docs">Next: generate the documents ${I('arrow')}</button></div>`;
  }

  /* ---------- Documents tab ---------- */
  function docsPane(r) {
    const s = st.sim, n = r.docs.filter(c => s.docs[c] === 'draft').length;
    return `<div class="pane-h"><div><h3>Documents <small>${n} of ${r.docs.length} drafted</small></h3><p>Tessera pre-fills each record from the assessment. Generate, preview, download.</p></div><button class="btn btn-ghost btn-xs" data-act="dall">${I('zap')} Generate all</button></div>
      <div class="dgrid2">${r.docs.map(c => { const v = s.docs[c] || 'missing'; return `<div class="dcard2 st-${v}" data-cat="${c}">
        <div class="dc2-top"><span class="dc2-i">${I(DOCICON[c] || 'file')}</span>${v === 'draft' ? T.statBadge('Draft') : v === 'gen' ? '<span class="stat s-rev">Generating…</span>' : T.statBadge('Missing')}</div>
        <b>${DOCNAME[c] || c}</b><small>${c}</small>
        <div class="dc2-prog"><i></i></div><span class="dc2-step"></span>
        <div class="dc2-act">${v === 'draft' ? `<button class="btn btn-ghost btn-xs" data-act="dprev" data-cat="${c}">${I('eye')} Preview</button><button class="btn btn-ghost btn-xs" data-act="ddl" data-cat="${c}">${I('download')}</button>` : `<button class="btn btn-sun btn-xs" data-act="dgen" data-cat="${c}" ${v === 'gen' ? 'disabled' : ''}>${I('zap')} Generate draft</button>`}</div></div>`; }).join('')}</div>
      <div class="pane-f"><button class="btn btn-sun" data-act="stab" data-t="monitor">Next: monitor it live ${I('arrow')}</button></div>`;
  }

  /* ---------- Monitor tab ---------- */
  function monitorPane(r) {
    const s = st.sim, open = s.alerts.filter(a => !a.done), blocked = r.cls === 'prohibited';
    const drift = T.series(r.useCase.id + r.model.id, 24, 12, 3, s.alerts.some(a => a.model && !a.done) ? 16 : 0);
    return `<div class="pane-h"><div><h3>Monitor <small>${blocked ? 'Blocked' : 'Live'}</small></h3><p>Tessera watches the system after go-live and logs every action.</p></div><button class="btn btn-ghost btn-xs" data-act="msim">${I('refresh')} Simulate a model update</button></div>
      <div class="mkpis"><div class="mk"><small>Status</small><b class="${blocked ? 'bad' : 'ok'}"><i></i>${blocked ? 'Blocked' : 'Monitoring'}</b></div><div class="mk"><small>Open alerts</small><b>${open.length}</b></div><div class="mk wide"><small>Output drift · 24 h</small>${T.spark(drift, '#ff4fa8')}</div></div>
      <div class="mcols"><div><h4>Alerts</h4>${s.alerts.length ? `<ul class="malerts">${s.alerts.map(a => `<li class="lv-${a.sev} ${a.done ? 'res' : ''} ${a.fresh ? 'fresh' : ''}"><div><b>${T.esc(a.title)}</b><small>${T.esc(a.why)}</small><em>${I('arrow')} ${T.esc(a.fix)}</em></div>${a.done ? '<span class="stat s-ok">Resolved</span>' : `<button class="btn btn-ghost btn-xs" data-act="mres" data-id="${a.id}">${I('check')} Resolve</button>`}</li>`).join('')}</ul>` : `<p class="calm">${I('shield')} No issues detected. Minimal-risk systems still get periodic checks.</p>`}</div>
        <div><h4>Audit trail</h4><ul class="mlog">${s.log.map(l => `<li><time>${l.t}</time>${T.esc(l.text)}</li>`).join('')}</ul></div></div>`;
  }

  /* ---------- document preview (built from the live assessment) ---------- */
  function paper(cat, r) {
    const s = st.sim, tbl = (h, rows) => `<table class="dt"><thead><tr>${h.map(x => `<th>${x}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
    const status = i => s.done.has(i) ? T.statBadge('Approved') : T.statBadge('Draft');
    const B = {
      'Risk Assessment': `<h4>1. System</h4><p>${T.esc(r.name)}. Intended purpose: ${T.esc(r.purpose)}.</p><h4>2. Simulated classification</h4><p>${T.riskBadge(r.cls)} <b>${T.esc(r.ref)}</b></p><p>${T.esc(r.why)}</p><h4>3. Requirements</h4>${tbl(['Requirement', 'Article', 'Status'], r.reqs.slice(0, 7).map((q, i) => [T.esc(q.title), q.art, status(i)]))}`,
      'Technical Documentation': `<h4>Annex IV structure</h4>${tbl(['§', 'Section', 'Status'], ['General description & intended purpose', 'Design and development', 'Monitoring and control', 'Performance metrics', 'Risk management', 'Lifecycle changes', 'Standards applied', 'EU declaration of conformity', 'Post-market monitoring plan'].map((x, i) => [i + 1, x, i < 2 ? T.statBadge('In review') : T.statBadge('Draft')]))}`,
      'Data Governance': `<h4>Data sources</h4>${tbl(['Source', 'Purpose', 'Bias check'], [['Historical records', 'Training', T.statBadge('Draft')], ['Benchmark set', 'Validation', T.statBadge('Draft')], ['Production feedback', 'Monitoring', T.statBadge('Draft')]])}`,
      'Human Oversight': `<h4>Oversight roles</h4>${tbl(['Role', 'Responsibility', 'Authority'], [['Reviewer', 'Checks outputs before action', 'Override'], ['System owner', 'Weekly sampling of decisions', 'Pause system'], ['Governance board', 'Quarterly review', 'Withdraw approval']])}`,
      'Model Evaluation': `<h4>Evaluation plan</h4>${tbl(['Test', 'Method', 'Result'], [['Accuracy', 'Held-out test set', T.statBadge('Draft')], ['Robustness', 'Perturbation and adversarial prompts', T.statBadge('Draft')], ['Group parity', 'Outcome gaps across groups', T.statBadge('Draft')]])}<p class="small muted">Results are filled in once tests run.</p>`,
      'Checklist': `<h4>Requirement checklist</h4><ul class="chk">${r.reqs.map((q, i) => `<li class="${s.done.has(i) ? 'done' : ''}">${I(s.done.has(i) ? 'check' : 'clock')}<span>${T.esc(q.title)}</span><code>${q.art}</code></li>`).join('')}</ul>`,
      'Transparency': `<h4>Disclosure text</h4><div class="disclosure">${I('shield')}<div><b>You are interacting with an AI system.</b><br>Content may be generated automatically. Ask for a human at any time.</div></div>`,
      'Incident Report': `<h4>Escalation</h4>${tbl(['Field', 'Detail'], [['Severity', T.sevBadge('critical')], ['Finding', 'Prohibited practice (' + T.esc(r.ref) + ')'], ['Action', 'System suspended pending legal review']])}`,
      'Audit Log': `<h4>Events</h4>${tbl(['Time', 'Event'], s.log.map(l => [l.t, T.esc(l.text)]))}`,
      'Inventory': `<h4>Inventory entry</h4>${tbl(['System', 'Provider', 'Risk', 'Owner'], [[T.esc(r.name), T.esc(r.provider), T.riskBadge(r.cls), 'You (demo)']])}`
    };
    return `<div class="paper"><div class="paper-h"><div class="paper-brand">${T.LOGO}<span>Tessera</span></div><div class="paper-w">SIMULATED SAMPLE</div></div>
      <h2>${DOCNAME[cat] || cat}</h2>
      <div class="paper-meta"><span><small>System</small>${T.esc(r.name)}</span><span><small>Category</small>${cat}</span><span><small>Status</small>${T.statBadge('Draft')}</span><span><small>Version</small>v0.1</span><span><small>Generated</small>${T.fmt(new Date())}</span><span><small>Owner</small>You (demo)</span></div>
      ${B[cat] || ''}<div class="paper-f">Generated in the Tessera demo · Educational simulation, not a real compliance record or legal advice.</div></div>`;
  }

  /* ---------- rendering ---------- */
  function side(r) {
    const s = st.sim, docsN = r.docs.filter(c => s.docs[c] === 'draft').length, open = s.alerts.filter(a => !a.done).length;
    const ready = r.cls === 'prohibited' ? 0 : Math.round(s.done.size / r.reqs.length * 70 + docsN / r.docs.length * 30);
    T.$('#sim-sys').innerHTML = `<span class="m-logo" style="background:${r.model.color}">${r.model.provider[0]}</span><div><b>${T.esc(useLabel(r))}</b><small>${T.esc(r.model.name)} · ${T.esc(r.provider)}</small>${T.riskBadge(r.cls)}</div>`;
    const badge = { assess: '', reqs: `${s.done.size}/${r.reqs.length}`, docs: `${docsN}/${r.docs.length}`, monitor: open ? String(open) : '' };
    T.$$('.sim-tabs button').forEach(b => { b.classList.toggle('on', b.dataset.t === s.tab); const e = T.$('em', b); e.textContent = badge[b.dataset.t]; e.classList.toggle('hot', b.dataset.t === 'monitor' && open > 0); });
    T.$('#sim-ready').innerHTML = r.cls === 'prohibited' ? `<small>Readiness</small><b class="blocked">Blocked</b><div class="rbar"><i style="width:100%;background:var(--r-prohibited)"></i></div>` : `<small>Readiness</small><b>${ready}%</b><div class="rbar"><i style="width:${ready}%"></i></div>`;
  }
  function pane(r) {
    const p = T.$(`[data-pane="${st.sim.tab}"]`); if (!p || st.sim.tab === 'assess') return;
    p.innerHTML = { reqs: reqsPane, docs: docsPane, monitor: monitorPane }[st.sim.tab](r);
  }
  function refresh() { const r = st.lastCls; if (!r) return; side(r); pane(r); }

  function run() {
    const s = st.cls;
    const r = T.assess({ modelId: s.model, useId: s.text ? '' : s.use, text: s.text, role: 'both' });
    st.lastCls = r;
    const key = r.model.id + '|' + r.purpose;
    if (key !== st.sim.key) {
      st.sim = Object.assign(st.sim, { key, done: new Set(), docs: {}, alerts: seedAlerts(r), log: [] });
      log(`Assessed ${r.model.name} for “${useLabel(r)}”: ${T.RISK[r.cls].label}`);
      const add = T.$('[data-act=cadd]'); if (add) { add.disabled = false; add.innerHTML = I('plus') + ' Add to portfolio'; }
    }
    const out = T.$('#c-out');
    out.innerHTML = card(r);
    out.className = 'c-out pulse r-' + r.cls;
    void out.offsetWidth; out.classList.add('go');
    const mk = T.$('.marker', out); requestAnimationFrame(() => requestAnimationFrame(() => { mk.style.left = mk.dataset.to + '%'; }));
    st.prevIdx = ORDER.indexOf(r.cls);
    T.$('#classify').style.setProperty('--rc', T.RISK[r.cls].color);
    refresh();
  }

  function generate(cat, quiet) {
    const s = st.sim; if (s.docs[cat] === 'draft' || s.docs[cat] === 'gen') return;
    s.docs[cat] = 'gen'; refresh();
    const steps = ['Reading the assessment…', 'Mapping requirements…', 'Drafting sections…', 'Formatting…'];
    let k = 0; const tick = setInterval(() => { const c2 = T.$(`.dcard2[data-cat="${cat}"]`), sp = c2 && T.$('.dc2-step', c2); if (sp) sp.textContent = steps[Math.min(k++, steps.length - 1)]; }, 380);
    setTimeout(() => {
      clearInterval(tick); s.docs[cat] = 'draft'; log(`Draft generated: ${DOCNAME[cat] || cat}`);
      if (cat === 'Technical Documentation') s.alerts.forEach(a => { if (/documentation/i.test(a.title)) { a.done = true; log('Alert auto-resolved: technical documentation now exists'); } });
      refresh(); if (!quiet) T.toast('Draft ready: ' + (DOCNAME[cat] || cat));
    }, 1650);
  }

  Object.assign(T.actions, {
    cmodel: el => { st.cls.model = el.dataset.id; T.$$('[data-act=cmodel]').forEach(b => b.classList.toggle('on', b === el)); run(); },
    cuse: el => { st.cls.use = el.dataset.id; st.cls.text = ''; T.$('#c-text').value = ''; T.$$('[data-act=cuse]').forEach(b => b.classList.toggle('on', b === el)); run(); },
    stab: el => {
      st.sim.tab = el.dataset.t;
      T.$$('#sim [data-pane]').forEach(p => { p.hidden = p.dataset.pane !== st.sim.tab; });
      const p = T.$(`[data-pane="${st.sim.tab}"]`); p.classList.remove('enter'); void p.offsetWidth; p.classList.add('enter');
      refresh(); T.initBars(p);
    },
    rtick: el => { const i = +el.dataset.i, s = st.sim, q = st.lastCls.reqs[i]; el.checked ? s.done.add(i) : s.done.delete(i); log(`${el.checked ? 'Marked in place' : 'Reopened'}: ${q.title}`); refresh(); },
    rfilter: el => { st.sim.filter = el.dataset.f; refresh(); },
    rauto: el => {
      const r = st.lastCls, picks = r.reqs.map((q, i) => i).filter(i => /literacy|inventory|Record-keeping|logs|other laws|Inform people|Tell people/i.test(r.reqs[i].title) && !st.sim.done.has(i));
      el.disabled = true; el.innerHTML = I('refresh', 'spin') + ' Scanning connected systems…';
      picks.forEach((i, k) => setTimeout(() => { st.sim.done.add(i); log('Detected existing control: ' + r.reqs[i].title); refresh(); }, 600 + k * 450));
      setTimeout(() => { T.toast(picks.length ? `Found ${picks.length} control${picks.length > 1 ? 's' : ''} already in place` : 'No additional controls found'); refresh(); }, 700 + picks.length * 450);
    },
    dgen: el => generate(el.dataset.cat),
    dall: () => { st.lastCls.docs.forEach((c, k) => setTimeout(() => generate(c, true), k * 250)); setTimeout(() => T.toast('All drafts generated'), 1700 + st.lastCls.docs.length * 250); },
    dprev: el => T.openModal(`<div class="doc-view">${paper(el.dataset.cat, st.lastCls)}<div class="modal-f"><button class="btn btn-sun" data-act="ddl" data-cat="${el.dataset.cat}">${I('download')} Download</button></div></div>`, true),
    ddl: el => {
      const cat = el.dataset.cat, html = `<!doctype html><meta charset="utf-8"><title>${DOCNAME[cat] || cat}</title><style>body{font:15px/1.55 system-ui,sans-serif;max-width:820px;margin:40px auto;padding:0 20px;color:#2a0a22}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ecd9cf;padding:6px 10px;text-align:left}svg{display:none}.paper-meta{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.paper-meta small{display:block;color:#866}</style>` + paper(cat, st.lastCls);
      T.download('tessera-' + cat.toLowerCase().replace(/[^a-z]+/g, '-') + '.html', html, 'text/html'); log('Downloaded: ' + (DOCNAME[cat] || cat));
    },
    msim: () => {
      const r = st.lastCls;
      st.sim.alerts.unshift({ id: Math.random().toString(36).slice(2, 7), sev: r.cls === 'minimal' ? 'medium' : 'high', title: `${r.model.provider} updated ${r.model.name}: reassessment required`, why: 'A new model version can change behaviour, so earlier tests may no longer hold.', fix: 'Re-run evaluation and re-approve', done: false, fresh: true, model: true });
      log(`Provider change detected on ${r.model.name}`); refresh(); T.toast('New alert: model update detected', 'warn');
      setTimeout(() => st.sim.alerts.forEach(a => { a.fresh = false; }), 1500);
    },
    mres: el => { const a = st.sim.alerts.find(x => x.id === el.dataset.id); a.done = true; log('Alert resolved: ' + a.title); refresh(); T.toast('Resolved and logged'); },
    cadd: el => {
      const r = st.lastCls; if (!r) return;
      T.addToPortfolio(r); el.disabled = true; el.innerHTML = I('check') + ' In portfolio';
      log('Registered in the AI portfolio'); refresh();
      T.toast('Added. Keep scrolling: it is now on the dashboard.');
    }
  });

  T.scenes.classify = {
    id: 'classify', label: 'Try it',
    render() {
      return `<section id="classify" class="scene">${T.art.classify()}<span class="bignum" data-par aria-hidden="true">03</span>
  <div class="wrap">
    <div class="scene-h"><span class="chap rv"><b>03</b>Try it</span><h2>Same model. Different purpose. <span class="warm">Different risk.</span></h2><p class="sub rv">Classification follows what an AI system is <i>used for</i>, not whose model is inside. Try the product below.</p></div>
    <div class="sim rv" data-anim="zoom" id="sim">
      <div class="sim-bar"><div class="dots"><i></i><i></i><i></i></div><span>tessera.app / new-ai-system</span><span class="live"><i></i>Interactive demo</span></div>
      <div class="sim-body">
        <aside class="sim-side">
          <div class="sim-sys" id="sim-sys"></div>
          <nav class="sim-tabs" aria-label="Demo sections">${TABS.map(t => `<button data-act="stab" data-t="${t[0]}" class="${t[0] === 'assess' ? 'on' : ''}">${I(t[1])}<span>${t[2]}</span><em></em></button>`).join('')}</nav>
          <div class="sim-ready" id="sim-ready"></div>
          <button class="btn btn-sun sim-add" data-act="cadd">${I('plus')} Add to portfolio</button>
        </aside>
        <div class="sim-main">
          <div data-pane="assess" class="enter"><div class="classifier">
            <div class="c-in">
              <div class="step-l"><span>1</span>Pick a model</div>
              <div class="models">${MODELS.map(id => { const m = T.modelIndex[id]; return `<button class="mpick ${id === st.cls.model ? 'on' : ''}" data-act="cmodel" data-id="${id}"><span class="m-logo" style="background:${m.color}">${m.provider[0]}</span><span><b>${m.name}</b><small>${m.provider}</small></span></button>`; }).join('')}</div>
              <div class="step-l"><span>2</span>Pick a purpose</div>
              <div class="uses">${USES.map(u => `<button class="upick ${u[0] === st.cls.use ? 'on' : ''}" data-act="cuse" data-id="${u[0]}">${u[1]}</button>`).join('')}</div>
              <form class="c-form" id="c-form"><input id="c-text" type="text" maxlength="140" placeholder="…or describe your own, e.g. ‘rank job applicants’" aria-label="Describe an intended use"><button class="btn btn-ghost" type="submit">${I('scan')}</button></form>
            </div>
            <div class="c-out" id="c-out"></div>
          </div></div>
          <div data-pane="reqs" hidden></div>
          <div data-pane="docs" hidden></div>
          <div data-pane="monitor" hidden></div>
        </div>
      </div>
    </div>
    <p class="foot-note center rv">Educational simulation. Rule-based, not live AI analysis or a legal determination.</p>
  </div>
</section>`;
    },
    init(root) {
      run();
      T.$('#c-form', root).addEventListener('submit', e => {
        e.preventDefault(); const v = T.$('#c-text').value.trim(); if (!v) return;
        st.cls.text = v; T.$$('[data-act=cuse]').forEach(b => b.classList.remove('on')); run();
      });
    }
  };
})(window.T);
