/* AI Monitoring & Risk Management */
(function (T) {
  const I = T.icon, st = T.state = T.state || {};
  const TYPE_ICON = { 'Prohibited-use flag': 'ban', 'Model updated': 'refresh', 'Missing documentation': 'file', 'Unapproved deployment': 'scan', 'Data governance': 'lock', 'Deadline approaching': 'clock', 'Human oversight': 'users' };
  const METRICS = { drift: ['Output drift index', 14, 3, 18, '', 'Distance between recent outputs and the validated baseline. Spikes after model updates.'], override: ['Human override rate', 18, 2.5, -14, '%', 'Share of AI recommendations changed by reviewers. A collapse can signal automation bias.'], incidents: ['Flagged outputs per 1,000', 6, 1.2, 8, '', 'Outputs flagged by quality or policy checks.'] };
  st.mon = { sev: 'all', sys: 'S-001', metric: 'drift' };
  let ticker = null;

  const sevOrder = { critical: 0, high: 1, medium: 2 };
  function alertList() {
    const list = T.alerts.filter(a => st.mon.sev === 'all' || a.sev === st.mon.sev).sort((a, b) => (a.done - b.done) || sevOrder[a.sev] - sevOrder[b.sev]);
    return list.map(a => {
      const s = T.getSystem(a.sys);
      return `<div class="alert acc-item ${a.done ? 'resolved' : ''} lv-${a.sev}"><button class="acc-h" data-act="acc" aria-expanded="false"><span class="al-ic">${I(TYPE_ICON[a.type] || 'alert')}</span><span class="al-t"><b>${T.esc(a.title)}</b><small>${a.type} · ${s ? T.esc(s.name) : 'Unregistered tool'} · ${a.ago}</small></span>${a.done ? '<span class="stat s-ok">Resolved</span>' : a.ack ? '<span class="stat s-rev">Acknowledged</span>' : T.sevBadge(a.sev)}${I('chevron')}</button>
      <div class="acc-b"><div><div class="al-body">
        <div><small>What happened</small><p>${T.esc(a.what)}</p></div>
        <div><small>Affected AI system</small><p>${s ? `<a data-act="sys" data-id="${s.id}" role="button" tabindex="0" class="lnk">${T.esc(s.name)}</a> · ${T.riskBadge(s.cls)}` : 'Not yet registered'}</p></div>
        <div><small>Why it matters</small><p>${T.esc(a.why)}</p></div>
        <div><small>Recommended action</small><p>${T.esc(a.action)}</p></div>
        <div class="al-act">${a.done ? '' : `<button class="btn btn-primary btn-sm" data-act="resolve" data-id="${a.id}">${I('check')} Mark resolved</button><button class="btn btn-ghost-d btn-sm" data-act="ack" data-id="${a.id}">Acknowledge</button><button class="btn btn-ghost-d btn-sm" data-act="task" data-id="${a.id}">${I('plus')} Create task</button>`}</div>
      </div></div></div></div>`;
    }).join('') || '<p class="empty">No alerts for this filter.</p>';
  }
  function chart() {
    const m = st.mon, M = METRICS[m.metric], hasAlert = T.alerts.some(a => a.sys === m.sys && !a.done);
    const vals = T.series(m.sys + m.metric, 30, M[1], M[2], hasAlert ? M[3] : 0);
    const labels = vals.map((_, i) => i === vals.length - 1 ? 'Today' : (vals.length - 1 - i) + 'd');
    const s = T.getSystem(m.sys), last = vals[vals.length - 1], first = vals[0];
    return `<div class="mc-head"><div><b>${M[0]}</b><small>${T.esc(s.name)}</small></div><div class="mc-v">${last.toFixed(1)}${M[4]}<small class="${(last - first) * (M[3] < 0 ? -1 : 1) > 0 && hasAlert ? 'bad' : ''}">${last >= first ? '▲' : '▼'} ${Math.abs(last - first).toFixed(1)} vs 30 days ago</small></div></div>${T.line(vals, labels, { h: 200, color: hasAlert ? '#ffa94d' : '#22d3ee', min: 0, max: Math.ceil(Math.max(...vals) / 5) * 5 + 5, suf: M[4], label: M[0] })}<p class="small muted">${M[5]} ${hasAlert ? 'An open alert is linked to this system.' : ''}</p>`;
  }
  const refreshAlerts = () => { const e = T.$('#al-list'); if (e) { e.innerHTML = alertList(); } counters(); T.refreshBell(); };
  function counters() {
    const open = T.alerts.filter(a => !a.done), set = (id, v) => { const e = T.$(id); if (e) e.textContent = v; };
    set('#m-open', open.length); set('#m-crit', open.filter(a => a.sev === 'critical').length); set('#m-high', open.filter(a => a.sev === 'high').length); set('#m-med', open.filter(a => a.sev === 'medium').length);
  }
  const feedItem = a => `<li class="new"><span class="tl-i">${I(a.icon)}</span><div>${a.text}<small>Just now</small></div></li>`;

  Object.assign(T.actions, {
    resolve: el => { const a = T.alerts.find(x => x.id === el.dataset.id); a.done = true; refreshAlerts(); T.toast('Alert resolved and evidence logged in the audit trail'); },
    ack: el => { const a = T.alerts.find(x => x.id === el.dataset.id); a.ack = true; refreshAlerts(); T.toast('Alert acknowledged. Owner notified.'); },
    task: el => { const a = T.alerts.find(x => x.id === el.dataset.id); T.toast('Task created and assigned: ' + a.action.split('.')[0].slice(0, 70)); },
    msev: el => { st.mon.sev = el.dataset.s; T.$$('[data-act="msev"]').forEach(b => b.classList.toggle('on', b === el)); refreshAlerts(); },
    msys: () => { st.mon.sys = T.$('#m-sys').value; T.$('#m-chart').innerHTML = chart(); },
    mmet: el => { st.mon.metric = el.dataset.m; T.$$('[data-act="mmet"]').forEach(b => b.classList.toggle('on', b === el)); T.$('#m-chart').innerHTML = chart(); },
    simev: () => {
      const pool = T.activityPool, it = pool[Math.floor(Math.random() * pool.length)];
      T.$('#m-feed').insertAdjacentHTML('afterbegin', feedItem(it));
      if (it.icon === 'alert') T.toast('New monitoring event: ' + it.text.replace(/<[^>]+>/g, ''), 'warn');
    }
  });

  T.pages.monitoring = {
    render() {
      const open = T.alerts.filter(a => !a.done);
      return `
<section class="phead dk"><div class="wrap"><span class="eyebrow">AI monitoring & risk management</span><h1>From reactive compliance to proactive governance</h1>
<p class="lead">Tessera watches your AI estate continuously and turns signals into clear, actionable alerts.</p></div></section>
<section class="sec tint tight"><div class="wrap">
  <div data-tabs class="shift rv">
    <div class="tabs center-t" role="tablist"><button class="tab on" role="tab" aria-selected="true" data-act="tab" data-t="pro">${I('shield')} Proactive with Tessera</button><button class="tab" role="tab" aria-selected="false" data-act="tab" data-t="rea">${I('alert')} Reactive without</button></div>
    <div data-pane="pro" class="lane good">${['Change detected', 'Alert with context', 'Reassess & document', 'Fix before impact', 'Evidence in audit trail'].map((x, i) => `<div class="ln"><span>${i + 1}</span>${x}</div>`).join('<i class="la">→</i>')}</div>
    <div data-pane="rea" class="lane bad" hidden>${['Change unnoticed', 'Issue grows silently', 'Audit or complaint', 'Scramble for evidence', 'Fine or reputational damage'].map((x, i) => `<div class="ln"><span>${i + 1}</span>${x}</div>`).join('<i class="la">→</i>')}</div>
  </div>
  <div class="win dk">
    <div class="win-bar"><div class="dots"><i></i><i></i><i></i></div><span>tessera.app / monitoring</span><span class="live"><i></i>Live simulation</span></div>
    <div class="win-body">
      <div class="kpis k4"><div class="kpi static"><small>Open alerts</small><b id="m-open">${open.length}</b></div><div class="kpi static" style="--c:#ff5c6c"><small>Critical</small><b id="m-crit">${open.filter(a => a.sev === 'critical').length}</b></div><div class="kpi static" style="--c:#ffa94d"><small>High</small><b id="m-high">${open.filter(a => a.sev === 'high').length}</b></div><div class="kpi static" style="--c:#4da3ff"><small>Medium</small><b id="m-med">${open.filter(a => a.sev === 'medium').length}</b></div></div>
      <div class="mgrid">
        <div class="card"><div class="card-h"><h3>Risk alerts</h3><div class="filters tight-f">${['all', 'critical', 'high', 'medium'].map(s => `<button class="fchip sm ${s === 'all' ? 'on' : ''}" data-act="msev" data-s="${s}">${s}</button>`).join('')}</div></div><p class="small muted">Click an alert to see what happened, why it matters and what to do.</p><div id="al-list" class="al-list">${alertList()}</div></div>
        <div class="mright">
          <div class="card"><div class="card-h"><h3>Monitoring chart</h3><select id="m-sys" data-act="msys" onchange="T.actions.msys()" aria-label="System">${T.systems.filter(s => s.cls !== 'prohibited').map(s => `<option value="${s.id}" ${s.id === 'S-001' ? 'selected' : ''}>${T.esc(s.name)}</option>`).join('')}</select></div>
            <div class="filters tight-f">${Object.keys(METRICS).map((k, i) => `<button class="fchip sm ${i ? '' : 'on'}" data-act="mmet" data-m="${k}">${METRICS[k][0]}</button>`).join('')}</div><div id="m-chart">${chart()}</div></div>
          <div class="card"><h3>Compliance status indicators</h3><div class="ind">${T.systems.map(s => `<button class="ind-i st-${s.status.replace(/ /g, '')}" data-act="sys" data-id="${s.id}" title="${T.esc(s.name)} · ${s.status}"><i></i><span>${T.esc(s.name)}</span></button>`).join('')}</div>
            <div class="legend inline"><span><i style="background:#2dd4a7"></i>Compliant</span><span><i style="background:#4da3ff"></i>In progress / review</span><span><i style="background:#ffa94d"></i>Action required</span><span><i style="background:#ff5c6c"></i>Blocked</span></div></div>
          <div class="card"><div class="card-h"><h3>Live activity feed</h3><button class="btn btn-ghost-d btn-sm" data-act="simev">${I('zap')} Simulate event</button></div><ul class="tl-feed" id="m-feed">${T.activity.slice(0, 4).map(a => `<li><span class="tl-i">${I(a.icon)}</span><div>${a.text}<small>${a.t}</small></div></li>`).join('')}</ul></div>
        </div>
      </div>
    </div>
  </div>
  <p class="disc">${I('alert')}<span>All alerts and metrics are simulated for demonstration. Tessera is a fictional product.</span></p>
</div></section>`;
    },
    init() {
      clearInterval(ticker);
      let n = 0;
      ticker = setInterval(() => { const f = T.$('#m-feed'); if (!f) { clearInterval(ticker); return; } if (n++ % 2 === 0) { const it = T.activityPool[Math.floor(Math.random() * T.activityPool.length)]; f.insertAdjacentHTML('afterbegin', feedItem(it)); } }, 7000);
      T.cleanup.push(() => clearInterval(ticker));
    }
  };
})(window.T);
