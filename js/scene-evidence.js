/* Scene 6 · Evidence: fanned document stack with real previews and downloads */
(function (T) {
  const I = T.icon, st = T.state = T.state || {};

  const CI = { 'Inventory': 'layers', 'Risk Assessment': 'scan', 'Technical Documentation': 'cpu', 'Data Governance': 'lock', 'Human Oversight': 'users', 'Model Evaluation': 'chart', 'Transparency': 'eye', 'Audit Log': 'clock', 'Checklist': 'check', 'Incident Report': 'alert' };

  const tbl = (h, rows) => `<table class="dt"><thead><tr>${h.map(x => `<th>${x}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  const sec = (t, body) => `<h4>${t}</h4>${body}`;
  const sysOf = d => T.getSystem(d.sys) || { name: d.sys === 'Unregistered' ? 'PixelForge (unregistered)' : 'All registered systems', id: d.sys, cls: 'limited', provider: 'Various', model: '—', owner: 'AI Governance Office', use: 'Portfolio-wide', dept: 'Group', status: 'In progress', score: 70, useId: 'l-genimage' };

  function body(d) {
    const s = sysOf(d), uc = T.useIndex[s.useId] || T.useIndex['m-write'];
    switch (d.cat) {
      case 'Inventory': {
        const list = d.sys === 'Unregistered' ? [{ id: 'NEW', name: 'PixelForge', provider: 'Unknown vendor', cls: 'limited', owner: 'Unassigned', status: 'Under review', dept: 'Marketing' }] : T.systems;
        return sec('Registered systems', tbl(['ID', 'System', 'Provider', 'Dept.', 'Risk', 'Owner', 'Status'], list.map(x => [x.id, T.esc(x.name), x.provider, x.dept, T.riskBadge(x.cls), x.owner, T.statBadge(x.status)]))) + `<p class="small muted">${d.sys === 'Unregistered' ? 'Discovered via network scan. Classification pending owner input.' : 'Maintained automatically from registry changes.'}</p>`;
      }
      case 'Risk Assessment':
        return sec('1. System summary', `<p>${T.esc(s.name)} (${T.esc(s.provider)} · ${T.esc(s.model)}). Intended use: ${T.esc(s.use)}. Owner: ${s.owner}.</p>`) +
          sec('2. Simulated classification', `<p>${T.riskBadge(s.cls)} <b>${uc.ref}</b></p><p>${T.esc(uc.why)}</p>`) +
          sec('3. Identified risks', tbl(['Risk', 'Likelihood', 'Impact', 'Mitigation'], [['Biased or unrepresentative outputs', 'Medium', 'High', 'Bias testing on representative data; periodic review'], ['Over-reliance on automated output', 'Medium', 'High', 'Mandatory human review and override logging'], ['Model update changes behaviour', 'High', 'Medium', 'Change control with re-evaluation before release'], ['Personal-data exposure', 'Low', 'High', 'Data minimisation; retention limits; access controls']])) +
          sec('4. Conclusion', `<p>Residual risk acceptable subject to open actions (${s.open} outstanding requirements). Next review in 90 days.</p>`) + sign(s);
      case 'Technical Documentation':
        return sec('Annex IV structure (simulated)', tbl(['Section', 'Content', 'Status'], [['1', 'General description and intended purpose', T.statBadge('Approved')], ['2', 'Design specifications, architecture, development process', T.statBadge(d.status === 'Outdated' ? 'Outdated' : 'In review')], ['3', 'Monitoring, functioning and control', T.statBadge('In review')], ['4', 'Performance metrics and validation results', T.statBadge(d.status === 'Draft' ? 'Draft' : 'Outdated')], ['5', 'Risk management system', T.statBadge('Approved')], ['6', 'Lifecycle changes', T.statBadge('In review')], ['7', 'Standards applied', T.statBadge('Draft')], ['8', 'EU declaration of conformity', T.statBadge('Draft')], ['9', 'Post-market monitoring plan', T.statBadge('Draft')]])) + `<p class="small muted">Reference: Art. 11 and Annex IV of Regulation (EU) 2024/1689.</p>`;
      case 'Data Governance':
        return sec('Data sources', tbl(['Source', 'Purpose', 'Legal basis', 'Bias check', 'Retention'], [['Internal records 2019–2025', 'Training', 'Legitimate interest', T.statBadge('Approved'), '5 years'], ['Vendor benchmark set', 'Validation', 'Licence', T.statBadge('Approved'), 'Licence term'], ['Production feedback', 'Monitoring', 'Contract', T.statBadge('In review'), '12 months']])) + sec('Controls', `<ul class="ticks">${['Representativeness reviewed against the target population', 'Special-category data excluded from features', 'Data lineage recorded for every dataset version', 'Access restricted to named roles'].map(x => `<li>${I('check')}${x}</li>`).join('')}</ul>`) + `<p class="small muted">Reference: Art. 10.</p>`;
      case 'Human Oversight':
        return sec('Oversight design', tbl(['Role', 'Responsibility', 'Authority'], [['Reviewer', 'Checks each recommendation before action', 'Can override any output'], ['System owner', 'Samples decisions weekly; reviews override rates', 'Can pause the system'], ['Governance board', 'Quarterly oversight review', 'Can withdraw approval']])) + sec('Safeguards', `<ul class="ticks">${['Stop button and manual fallback tested quarterly', 'Automation-bias training for reviewers', 'Confidence thresholds trigger mandatory review', 'Override reasons logged for audit'].map(x => `<li>${I('check')}${x}</li>`).join('')}</ul>`) + `<p class="small muted">Reference: Art. 14 (provider design) and Art. 26 (deployer measures).</p>`;
      case 'Model Evaluation':
        return sec('Results', T.hbars([{ k: 'Accuracy', v: 91 }, { k: 'Robustness (perturbation)', v: 84 }, { k: 'Group parity', v: 88 }, { k: 'Safety refusals', v: 96 }], 100, 'linear-gradient(90deg,#ff3e7f,#ff4fa8,#ffb3da)')) +
          sec('Findings', `<p>Performance gap between demographic groups within the ${T.esc('3%')} tolerance; one failure mode found under adversarial prompts and tracked as an open action.</p>`) + `<p class="small muted">Simulated figures for demonstration only.</p>`;
      case 'Transparency':
        return sec('Disclosure text (as shown to users)', `<div class="disclosure">${I('shield')}<div><b>You are chatting with an AI assistant.</b><br>Answers are generated automatically and may contain mistakes. You can ask for a human agent at any time.</div></div>`) +
          sec('Placement & marking checklist', `<ul class="ticks">${['Shown before the first message', 'Visible in web, app and voice channels', 'AI-generated media carries machine-readable marking', 'Translated into all supported languages'].map(x => `<li>${I('check')}${x}</li>`).join('')}</ul>`) + `<p class="small muted">Reference: Art. 50.</p>`;
      case 'Audit Log':
        return sec('Events', tbl(['Timestamp', 'User', 'Action', 'Object'], [['09:14:02', 'i.kowalski', 'Updated classification', 'S-001'], ['09:31:47', 'system', 'Alert raised: model version change', 'S-001'], ['10:02:10', 'm.adeyemi', 'Uploaded evidence file', 'D-104'], ['11:45:33', 'governance.board', 'Approved annual review', 'S-005'], ['13:20:09', 'l.fischer', 'Suspended system', 'S-017'], ['15:03:58', 'system', 'Disclosure check passed', 'S-006']])) + `<p class="small muted">Immutable, time-stamped and exportable for auditors.</p>`;
      case 'Checklist': {
        const rq = T.reqsFor(uc, 'both'), done = Math.max(0, rq.length - s.open);
        return sec('Requirement checklist', `<ul class="chk">${rq.map((q, i) => `<li class="${i < done ? 'done' : ''}">${I(i < done ? 'check' : 'clock')}<span>${T.esc(q.title)}</span><code>${q.art}</code></li>`).join('')}</ul>`) + `<p class="small muted">${done}/${rq.length} complete. Use the Compliance checklist tab to tick items interactively.</p>`;
      }
      case 'Incident Report':
        return sec('Summary', tbl(['Field', 'Detail'], [['Severity', T.sevBadge(s.cls === 'prohibited' ? 'critical' : 'medium')], ['System', T.esc(s.name)], ['Detected', T.fmt(d.upd)], ['Reported to authority', s.cls === 'prohibited' ? 'Pending legal review' : 'Not required (below threshold)']])) +
          sec('Timeline', `<ul class="tl">${[['Issue detected by monitoring', '09:12'], ['Owner notified', '09:20'], ['System paused / mitigated', '10:05'], ['Root-cause analysis', 'Next day']].map(x => `<li><b>${x[0]}</b><small>${x[1]}</small></li>`).join('')}</ul>`) + sec('Corrective actions', `<p>Add pre-release checks, update documentation and re-assess the system before resuming service. Serious incidents involving high-risk systems must be reported under Art. 73.</p>`);
    }
    return '';
  }
  const sign = s => `<div class="sign"><div><small>Prepared by</small><b>${s.owner}</b></div><div><small>Reviewed by</small><b>AI Governance Board</b></div><div><small>Next review</small><b>${T.fmt(T.inDays(90))}</b></div></div>`;

  function docHTML(d) {
    const s = sysOf(d);
    const missing = d.status === 'Missing';
    return `<div class="paper"><div class="paper-h"><div class="paper-brand">${T.LOGO}<span>Tessera</span></div><div class="paper-w">SIMULATED SAMPLE</div></div>
      <h2>${T.esc(d.name)}</h2>
      <div class="paper-meta"><span><small>Document ID</small>${d.id}</span><span><small>Category</small>${d.cat}</span><span><small>System</small>${T.esc(d.sys === s.id ? s.name : d.sys)}</span><span><small>Version</small>${d.ver}</span><span><small>Updated</small>${T.fmt(d.upd)}</span><span><small>Status</small>${T.statBadge(d.status)}</span></div>
      ${missing ? `<div class="callout"><b>This document does not exist yet.</b> Tessera flagged it as required for this system. Generate a pre-filled draft from the template below.</div><div class="paper-ph">${body(Object.assign({}, d, { status: 'Draft' }))}</div>` : body(d)}
      <div class="paper-f">Fictional organisation · Confidential · Educational demonstration, not a real compliance record or legal advice.</div></div>`;
  }

  /* A miniature, realistic-looking document page for the fan */
  const FAN = ['D-102', 'D-104', 'D-112', 'D-116', 'D-118'];
  function mini(d, i) {
    const s = T.getSystem(d.sys);
    return `<button class="sheet" data-act="doc" data-id="${d.id}" style="--i:${i - 2};--a:${Math.abs(i - 2)}" aria-label="Open ${T.esc(d.name)}">
      <span class="sh-top">${T.LOGO}<i>${d.id}</i></span>
      <span class="sh-cat">${I(CI[d.cat])}${d.cat}</span>
      <b>${T.esc(d.name.split(' — ')[0])}</b><small>${s ? T.esc(s.name) : ''} · ${d.ver}</small>
      <span class="sh-lines"><i></i><i></i><i></i><i class="s"></i></span>
      <span class="sh-tbl">${'<i></i>'.repeat(6)}</span>
      <span class="sh-lines"><i></i><i class="s"></i></span>
      <span class="stamp st-${d.status.replace(/ /g, '')}">${d.status}</span>
    </button>`;
  }

  Object.assign(T.actions, {
    doc: el => {
      const d = T.docs.find(x => x.id === el.dataset.id);
      T.openModal(`<div class="doc-view">${docHTML(d)}<div class="modal-f"><button class="btn btn-sun" data-act="dldoc" data-id="${d.id}">${I('download')} Download sample</button></div></div>`, true);
    },
    dldoc: el => {
      const d = T.docs.find(x => x.id === el.dataset.id);
      const html = `<!doctype html><meta charset="utf-8"><title>${T.esc(d.name)}</title><style>body{font:15px/1.55 system-ui,sans-serif;max-width:820px;margin:40px auto;padding:0 20px;color:#2a0a22}table{border-collapse:collapse;width:100%;margin:8px 0}td,th{border:1px solid #ecd9cf;padding:6px 10px;text-align:left}th{background:#fbf1ec}.badge,.stat,.sev{padding:2px 8px;border-radius:99px;background:#fbe9e3;font-size:12px}.paper-w{color:#b91c1c;font-weight:700;letter-spacing:.1em}svg{display:none}.paper-meta{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:12px 0}.paper-meta small{display:block;color:#866}.hb-t{height:8px;background:#f3e3dc;border-radius:9px}.hb-t i{display:block;height:100%;background:#ff4fa8;border-radius:9px}.hb{display:grid;grid-template-columns:200px 1fr 40px;gap:8px;align-items:center;margin:6px 0}</style>` + docHTML(d).replace(/data-w="(\d+)"/g, 'style="width:$1%"');
      T.download(d.id + '-' + d.name.replace(/[^a-z0-9]+/gi, '-').slice(0, 40).toLowerCase() + '.html', html, 'text/html');
    }
  });

  T.scenes = T.scenes || {};
  T.scenes.evidence = {
    id: 'evidence', label: 'Evidence',
    render() {
      const n = s => T.docs.filter(d => d.status === s).length;
      return `<section id="evidence" class="scene"><span class="bignum" data-par aria-hidden="true">05</span>
  <div class="wrap evidence">
    <div class="ev-l">
      <span class="chap rv"><b>05</b>Evidence</span>
      <h2>Audit-ready <span class="warm">by default.</span></h2>
      <ul class="facts-l rv"><li><b>${T.docs.length}</b>governed records</li><li><b>${T.DOC_CATS.length}</b>document types</li><li><b>${n('Approved')}</b>approved, <b>${n('Missing') + n('Outdated')}</b> flagged</li></ul>
      <div class="chips rv">${T.DOC_CATS.map(c => `<span class="chip">${I(CI[c])}${c}</span>`).join('')}</div>
      <p class="hint-t rv">${I('eye')} Click any document to open it</p>
    </div>
    <div class="fan" data-scrub><div class="ph ph-card fan-ph" data-par aria-hidden="true"><img src="img/signing.jpg" alt="" loading="lazy" decoding="async"></div><span class="fan-cap">Every decision, on record</span>${FAN.map((id, i) => mini(T.docs.find(d => d.id === id), i)).join('')}</div>
  </div>
</section>`;
    }
  };
})(window.T);

