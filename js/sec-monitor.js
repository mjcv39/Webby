/* Monitoring section */
(function (T) {
  const I = T.icon, st = T.state;
  const TYPE_ICON = { 'Prohibited-use flag': 'ban', 'Model updated': 'refresh', 'Missing documentation': 'file', 'Unapproved deployment': 'scan', 'Data governance': 'lock', 'Deadline approaching': 'clock', 'Human oversight': 'users' };
  const SHORT = { 'A-1': ['Banned practice; fines up to 7%', 'Keep suspended, escalate to Legal'], 'A-2': ['Prior testing may no longer apply', 'Re-test, update docs, re-approve'], 'A-3': ['Required evidence is stale (Art. 11)', 'Refresh sections 2 and 4'], 'A-4': ['No owner, class or disclosure', 'Register, classify, approve or block'], 'A-5': ['GDPR exposure on top of AI duties', 'Purge expired logs, add check'], 'A-6': ['Missed gates squeeze the timeline', 'Close gaps or request extension'], 'A-7': ['Possible automation bias (Art. 14)', 'Audit samples, retrain reviewers'] };
  const METRICS = { drift: ['Output drift', 14, 3, 18, '', '#ffa94d'], override: ['Human override rate', 18, 2.5, -14, '%', '#22d3ee'] };
  st.mon = { sys: 'S-001' };
  let ticker = null;
  const sevOrder = { critical: 0, high: 1, medium: 2 };

  function cards() {
    return T.alerts.slice().sort((a, b) => (!!a.done - !!b.done) || sevOrder[a.sev] - sevOrder[b.sev]).map(a => {
      const s = T.getSystem(a.sys), sh = SHORT[a.id];
      return `<button class="alc lv-${a.sev} ${a.done ? 'resolved' : ''}" data-act="alert" data-id="${a.id}"><div class="alc-h"><span class="al-ic">${I(TYPE_ICON[a.type] || 'alert')}</span>${a.done ? '<span class="stat s-ok">Resolved</span>' : a.ack ? '<span class="stat s-rev">Acknowledged</span>' : T.sevBadge(a.sev)}</div>
        <b>${T.esc(a.title)}</b><small>${a.type} · ${s ? T.esc(s.name) : 'Unregistered tool'}</small>
        <ul><li><i>Why</i>${sh[0]}</li><li><i>Action</i>${sh[1]}</li></ul></button>`;
    }).join('');
  }
  function chart(metric) {
    const m = st.mon, M = METRICS[metric], hasAlert = T.alerts.some(a => a.sys === m.sys && !a.done);
    const vals = T.series(m.sys + metric, 30, M[1], M[2], hasAlert ? M[3] : 0);
    const labels = vals.map((_, i) => i === vals.length - 1 ? 'Today' : (vals.length - 1 - i) + 'd');
    return `<div class="mc-head"><b>${M[0]}</b><span class="mc-v">${vals[vals.length - 1].toFixed(1)}${M[4]}</span></div>${T.line(vals, labels, { h: 170, color: hasAlert ? M[5] : '#2dd4a7', min: 0, max: Math.ceil(Math.max(...vals) / 5) * 5 + 5, suf: M[4], label: M[0] })}`;
  }
  function counters() {
    const open = T.alerts.filter(a => !a.done), set = (id, v) => { const e = T.$(id); if (e) e.textContent = v; };
    set('#m-open', open.length); set('#m-crit', open.filter(a => a.sev === 'critical').length); set('#m-high', open.filter(a => a.sev === 'high').length); set('#m-med', open.filter(a => a.sev === 'medium').length);
  }
  const refreshAlerts = () => { const e = T.$('#al-cards'); if (e) e.innerHTML = cards(); counters(); T.refreshBell(); };
  const feedItem = a => `<li class="new"><span class="tl-i">${I(a.icon)}</span><div>${a.text}<small>Just now</small></div></li>`;

  Object.assign(T.actions, {
    alert: el => {
      const a = T.alerts.find(x => x.id === el.dataset.id), s = T.getSystem(a.sys);
      T.openModal(`<div class="alm lv-${a.sev}"><span class="eyebrow">${a.type}</span><h2>${T.esc(a.title)}</h2>
        <div class="alm-g"><div><small>What happened</small><p>${T.esc(a.what)}</p></div><div><small>Affected AI system</small><p>${s ? T.esc(s.name) + ' ' + T.riskBadge(s.cls) : 'Not yet registered'}</p></div><div><small>Why it matters</small><p>${T.esc(a.why)}</p></div><div><small>Recommended action</small><p>${T.esc(a.action)}</p></div></div>
        <div class="modal-f">${a.done ? '<span class="stat s-ok">Resolved</span>' : `<button class="btn btn-primary" data-act="resolve" data-id="${a.id}">${I('check')} Mark resolved</button><button class="btn btn-ghost-d" data-act="ack" data-id="${a.id}">Acknowledge</button><button class="btn btn-ghost-d" data-act="task" data-id="${a.id}">${I('plus')} Create task</button>`}</div></div>`);
    },
    resolve: el => { T.alerts.find(x => x.id === el.dataset.id).done = true; T.closeModal(); refreshAlerts(); T.toast('Alert resolved and logged in the audit trail'); },
    ack: el => { T.alerts.find(x => x.id === el.dataset.id).ack = true; T.closeModal(); refreshAlerts(); T.toast('Acknowledged. Owner notified.'); },
    task: el => { T.toast('Task created: ' + T.alerts.find(x => x.id === el.dataset.id).action.split('.')[0].slice(0, 60)); },
    msys: () => { st.mon.sys = T.$('#m-sys').value; T.$('#m-c1').innerHTML = chart('drift'); T.$('#m-c2').innerHTML = chart('override'); },
    simev: () => {
      const it = T.activityPool[Math.floor(Math.random() * T.activityPool.length)];
      T.$('#m-feed').insertAdjacentHTML('afterbegin', feedItem(it));
      if (it.icon === 'alert') T.toast('New event: ' + it.text.replace(/<[^>]+>/g, ''), 'warn');
    }
  });

  T.sections.monitoring = {
    id: 'monitoring',
    render() {
      const open = T.alerts.filter(a => !a.done), lane = (cls, items) => `<div class="lane ${cls}" data-stagger>${items.map((x, i) => `<div class="ln"><span>${i + 1}</span>${x}</div>`).join('<i class="la">→</i>')}</div>`;
      return `<section id="monitoring" class="sec tint"><div class="wrap">
  <div class="sec-h"><span class="eyebrow rv">06 · Monitoring</span><h2 class="rv">From reactive to proactive governance</h2></div>
  <div class="lanes">
    <div class="lane-w rv" data-anim="left"><span class="lane-t bad">${I('alert')} Reactive</span>${lane('bad', ['Change unnoticed', 'Issue grows', 'Audit or complaint', 'Scramble', 'Fine or damage'])}</div>
    <div class="lane-w rv" data-anim="right"><span class="lane-t good">${I('shield')} Proactive with Tessera</span>${lane('good', ['Change detected', 'Alert with context', 'Reassess', 'Fix early', 'Evidence logged'])}</div>
  </div>
  <div class="win dk rv" data-anim="zoom" data-zoom>
    <div class="win-bar"><div class="dots"><i></i><i></i><i></i></div><span>tessera.app / monitoring</span><span class="live"><i></i>Live simulation</span></div>
    <div class="win-body">
      <div class="kpis k4"><div class="kpi static"><small>Open alerts</small><b id="m-open">${open.length}</b></div><div class="kpi static" style="--c:#ff5c6c"><small>Critical</small><b id="m-crit">${open.filter(a => a.sev === 'critical').length}</b></div><div class="kpi static" style="--c:#ffa94d"><small>High</small><b id="m-high">${open.filter(a => a.sev === 'high').length}</b></div><div class="kpi static" style="--c:#4da3ff"><small>Medium</small><b id="m-med">${open.filter(a => a.sev === 'medium').length}</b></div></div>
      <h3 class="win-h">Risk alerts <small class="muted">Click a card for details and actions</small></h3>
      <div class="alc-grid" id="al-cards">${cards()}</div>
      <div class="card"><div class="card-h"><h3>Metrics by system</h3><select id="m-sys" onchange="T.actions.msys()" aria-label="System">${T.systems.filter(s => s.cls !== 'prohibited').map(s => `<option value="${s.id}" ${s.id === 'S-001' ? 'selected' : ''}>${T.esc(s.name)}</option>`).join('')}</select></div>
        <div class="two"><div id="m-c1">${chart('drift')}</div><div id="m-c2">${chart('override')}</div></div></div>
      <div class="mgrid">
        <div class="card"><h3>Compliance status</h3><div class="ind">${T.systems.map(s => `<button class="ind-i st-${s.status.replace(/ /g, '')}" data-act="sys" data-id="${s.id}" title="${T.esc(s.name)} · ${s.status}"><i></i><span>${T.esc(s.name)}</span></button>`).join('')}</div>
          <div class="legend inline"><span><i style="background:#2dd4a7"></i>Compliant</span><span><i style="background:#4da3ff"></i>In progress</span><span><i style="background:#ffa94d"></i>Action needed</span><span><i style="background:#ff5c6c"></i>Blocked</span></div></div>
        <div class="card"><div class="card-h"><h3>Live activity</h3><button class="btn btn-ghost-d btn-sm" data-act="simev">${I('zap')} Simulate event</button></div><ul class="tl-feed" id="m-feed">${T.activity.slice(0, 4).map(a => `<li><span class="tl-i">${I(a.icon)}</span><div>${a.text}<small>${a.t}</small></div></li>`).join('')}</ul></div>
      </div>
    </div>
  </div>
  <p class="disc center-d rv">${I('alert')}<span>All alerts and metrics are simulated.</span></p>
</div></section>`;
    },
    init() {
      clearInterval(ticker); let n = 0;
      ticker = setInterval(() => { const f = T.$('#m-feed'); if (!f) { clearInterval(ticker); return; } if (n++ % 2 === 0) f.insertAdjacentHTML('afterbegin', feedItem(T.activityPool[Math.floor(Math.random() * T.activityPool.length)])); }, 8000);
    }
  };
})(window.T);
