/* Dashboard section */
(function (T) {
  const I = T.icon, ORDER = { prohibited: 0, high: 1, limited: 2, minimal: 3 };
  const st = T.state;
  st.dash = { filter: 'all', q: '', sort: 'risk', dir: 1 };
  const counts = () => { const c = { prohibited: 0, high: 0, limited: 0, minimal: 0 }; T.systems.forEach(s => c[s.cls]++); return c; };

  function rows() {
    const d = st.dash, q = d.q.toLowerCase();
    const list = T.systems.filter(s => (d.filter === 'all' || s.cls === d.filter) && (!q || (s.name + s.provider + s.use + s.dept + s.model).toLowerCase().includes(q)));
    const key = { name: s => s.name, provider: s => s.provider, dept: s => s.dept, risk: s => ORDER[s.cls], status: s => s.status, date: s => -s.assessed };
    list.sort((a, b) => { const x = key[d.sort](a), y = key[d.sort](b); return (x > y ? 1 : x < y ? -1 : 0) * d.dir; });
    return list;
  }
  function table() {
    const d = st.dash, list = rows();
    const th = (k, l) => `<th><button data-act="dsort" data-k="${k}" class="${d.sort === k ? 'on' : ''}">${l}${d.sort === k ? (d.dir > 0 ? ' ↑' : ' ↓') : ''}</button></th>`;
    return `<div class="tbl-wrap"><table class="tbl"><thead><tr>${th('name', 'AI system')}${th('provider', 'Provider')}<th>Intended use</th>${th('dept', 'Department')}${th('risk', 'Risk')}${th('status', 'Compliance')}${th('date', 'Assessed')}</tr></thead><tbody>
      ${list.map(s => `<tr data-act="sys" data-id="${s.id}" tabindex="0" role="button" aria-label="Open ${T.esc(s.name)}"><td><b>${T.esc(s.name)}</b><small>${s.id}</small></td><td>${T.esc(s.provider)}<small>${T.esc(s.model)}</small></td><td class="use">${T.esc(s.use)}</td><td>${s.dept}</td><td>${T.riskBadge(s.cls)}</td><td>${T.statBadge(s.status)}</td><td>${T.fmt(s.assessed)}</td></tr>`).join('') || `<tr><td colspan="7" class="empty">No systems match.</td></tr>`}
      </tbody></table></div><div class="tbl-f muted small">${list.length} of ${T.systems.length} systems · click a row for its profile</div>`;
  }
  const refreshTable = () => { const el = T.$('#ptable'); if (el) el.innerHTML = table(); };

  function openProfile(id) {
    const s = T.getSystem(id), uc = T.useIndex[s.useId], reqs = T.reqsFor(uc, 'both');
    const doneN = Math.max(0, reqs.length - s.open), docs = T.docs.filter(d => d.sys === s.id), al = T.alerts.filter(a => a.sys === s.id);
    const color = T.RISK[s.cls].color;
    T.openModal(`
    <div class="prof">
      <div class="prof-h"><div><span class="eyebrow">${s.id} · ${s.origin}</span><h2>${T.esc(s.name)}</h2><div class="row">${T.riskBadge(s.cls)}${T.statBadge(s.status)}<span class="chip">${s.env}</span></div></div>${T.ring(s.score, 84, color)}</div>
      <dl class="facts">
        <div><dt>Provider</dt><dd>${T.esc(s.provider)}</dd></div><div><dt>Model</dt><dd>${T.esc(s.model)}</dd></div>
        <div><dt>Department</dt><dd>${s.dept}</dd></div><div><dt>Owner</dt><dd>${s.owner}</dd></div>
        <div class="w2"><dt>Intended use</dt><dd>${T.esc(s.use)}</dd></div>
        <div><dt>Last assessed</dt><dd>${T.fmt(s.assessed)}</dd></div><div><dt>Basis (simulated)</dt><dd>${uc.ref}</dd></div>
      </dl>
      <div class="prof-cols">
        <div><h4>Requirement progress <span class="count">${doneN}/${reqs.length}</span></h4>
          <div class="bar"><i data-w="${reqs.length ? doneN / reqs.length * 100 : 0}" style="background:${color}"></i></div>
          <ul class="chk">${reqs.slice(0, 7).map((q, i) => `<li class="${i < doneN ? 'done' : ''}">${I(i < doneN ? 'check' : 'clock')}<span>${T.esc(q.title)}</span><code>${q.art}</code></li>`).join('')}${reqs.length > 7 ? `<li class="more">+ ${reqs.length - 7} more</li>` : ''}</ul></div>
        <div><h4>Documents</h4>${docs.length ? docs.map(d => `<a class="mini-doc" data-act="doc" data-id="${d.id}" role="button" tabindex="0">${I('file')}<span>${T.esc(d.name)}</span>${T.statBadge(d.status)}</a>`).join('') : '<p class="muted small">None yet.</p>'}
          <h4>Alerts</h4>${al.length ? al.map(a => `<div class="mini-al">${T.sevBadge(a.sev)}<span>${T.esc(a.title)}</span></div>`).join('') : '<p class="muted small">No active alerts.</p>'}</div>
      </div>
      <div class="modal-f"><button class="btn btn-primary" data-act="reassess" data-id="${s.id}">${I('refresh')} Re-assess this system</button></div>
      <p class="disc">${I('alert')}<span>Simulated profile for an educational demo.</span></p>
    </div>`, true);
  }

  Object.assign(T.actions, {
    sys: el => openProfile(el.dataset.id),
    dsort: el => { const d = st.dash; if (d.sort === el.dataset.k) d.dir *= -1; else { d.sort = el.dataset.k; d.dir = 1; } refreshTable(); },
    dfilter: el => {
      st.dash.filter = el.dataset.f;
      T.$$('[data-act="dfilter"].fchip').forEach(b => b.classList.toggle('on', b.dataset.f === st.dash.filter));
      refreshTable(); const t = T.$('#portfolio'); t && t.scrollIntoView({ behavior: 'smooth', block: 'center' });
    },
    reassess: el => { const s = T.getSystem(el.dataset.id); T.closeModal(); T.prefillAssess(s.useId); },
    scan: el => {
      el.disabled = true; el.innerHTML = I('refresh', 'spin') + ' Scanning…';
      setTimeout(() => {
        el.disabled = false; el.innerHTML = I('scan') + ' Run discovery scan';
        T.toast('Scan complete: 1 unregistered AI tool found (PixelForge)', 'warn');
        const f = T.$('#feed'); if (f) f.insertAdjacentHTML('afterbegin', `<li class="new"><span class="tl-i">${I('scan')}</span><div>Shadow-AI scan: <b>1 unregistered tool</b> found<small>Just now</small></div></li>`);
      }, 1600);
    }
  });

  T.sections.dashboard = {
    id: 'dashboard',
    render() {
      st.dash = { filter: 'all', q: '', sort: 'risk', dir: 1 };
      const c = counts(), total = T.systems.length;
      const overall = Math.round(T.systems.reduce((a, s) => a + s.score, 0) / total);
      const openReq = T.systems.reduce((a, s) => a + s.open, 0);
      const kpi = (label, n, icon, color, f) => `<button class="kpi" data-act="dfilter" data-f="${f}" style="--c:${color}"><span class="kpi-i">${I(icon)}</span><small>${label}</small><b data-count="${n}">0</b></button>`;
      const donutItems = ['minimal', 'limited', 'high', 'prohibited'].map(k => ({ v: c[k], color: T.RISK[k].color, label: T.RISK[k].label }));
      return `<section id="dashboard" class="sec tint"><div class="wrap">
  <div class="sec-h"><span class="eyebrow rv">02 · Dashboard</span><h2 class="rv">Your whole AI estate at a glance</h2><p class="sub rv">Simulated workspace for ${T.COMPANY}</p></div>
<div class="win dk rv" data-anim="zoom" data-zoom>
  <div class="win-bar"><div class="dots"><i></i><i></i><i></i></div><span>tessera.app / governance-overview</span><span class="live"><i></i>Live simulation</span></div>
  <div class="win-body">
    <div class="win-top"><div><h3>Governance overview</h3><span class="muted small">${T.fmt(new Date())}</span></div><div class="row"><button class="btn btn-ghost-d btn-sm" data-act="scan">${I('scan')} Run discovery scan</button><a class="btn btn-primary btn-sm" href="#assess">${I('plus')} Assess a system</a></div></div>
    <div class="kpis">
      ${kpi('AI systems', total, 'layers', '#3b82f6', 'all')}${kpi('High risk', c.high, 'alert', T.RISK.high.color, 'high')}${kpi('Limited risk', c.limited, 'eye', T.RISK.limited.color, 'limited')}${kpi('Minimal risk', c.minimal, 'check', T.RISK.minimal.color, 'minimal')}${kpi('Prohibited flags', c.prohibited, 'ban', T.RISK.prohibited.color, 'prohibited')}
    </div>
    <div class="dgrid">
      <div class="card"><h3>Risk distribution</h3><div class="donut-row">${T.donut(donutItems, { size: 180, big: total, small: 'systems' })}<ul class="legend">${donutItems.map(i => `<li><i style="background:${i.color}"></i>${i.label}<b>${i.v}</b></li>`).join('')}</ul></div></div>
      <div class="card center-c"><h3>Compliance overview</h3>${T.gauge(overall)}<div class="mini-stats"><div><b>${T.systems.filter(s => s.status === 'Compliant').length}</b><small>compliant</small></div><div><b>${openReq}</b><small>open reqs</small></div><div><b>${T.systems.filter(s => s.status === 'Action required' || s.status === 'Blocked').length}</b><small>need action</small></div></div></div>
      <div class="card"><h3>Outstanding requirements</h3>${T.hbars(T.outstanding, 12, 'linear-gradient(90deg,#3b82f6,#22d3ee)')}</div>
      <div class="card span2"><h3>Compliance score · 12 months</h3>${T.line(T.trend, T.trendLabels, { h: 190, color: '#22d3ee', suf: '%', min: 40, max: 80, label: 'Compliance score trend' })}</div>
      <div class="card"><h3>Upcoming deadlines</h3><ul class="dl">${T.deadlines.map(d => { const n = Math.ceil((d.date - Date.now()) / 864e5); return `<li><div class="dl-d"><b>${d.date.toLocaleDateString('en-GB', { day: '2-digit' })}</b><small>${d.date.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' })}</small></div><div><span>${T.esc(d.label)}</span><small>${d.tag}${n < 0 ? ' · applicable' : ' · ' + n + ' days'}</small></div></li>`; }).join('')}</ul></div>
      <div class="card span2"><h3>Active risk alerts <a href="#monitoring" class="lnk">All alerts ${I('arrow')}</a></h3><ul class="al">${T.alerts.filter(a => !a.done).slice(0, 4).map(a => `<li>${T.sevBadge(a.sev)}<div><b>${T.esc(a.title)}</b><small>${T.esc(T.getSystem(a.sys) ? T.getSystem(a.sys).name : 'Unregistered tool')} · ${a.ago}</small></div></li>`).join('')}</ul></div>
      <div class="card"><h3>Recent assessments</h3><ul class="ra">${T.recent.map(r => { const s = T.getSystem(r.sys); return `<li data-act="sys" data-id="${s.id}" tabindex="0" role="button"><span><b>${T.esc(s.name)}</b><small>${T.fmt(T.daysAgo(r.ago))}</small></span>${T.riskBadge(r.result)}</li>`; }).join('')}</ul></div>
    </div>
    <div class="card" id="portfolio"><div class="card-h"><h3>AI system portfolio</h3><div class="search">${I('search')}<input id="psearch" type="search" placeholder="Search systems" aria-label="Search portfolio"></div></div>
      <div class="filters">${[['all', 'All'], ['high', 'High'], ['limited', 'Limited'], ['minimal', 'Minimal'], ['prohibited', 'Prohibited']].map(f => `<button class="fchip ${f[0] === 'all' ? 'on' : ''}" data-act="dfilter" data-f="${f[0]}">${f[1]}</button>`).join('')}</div>
      <div id="ptable">${table()}</div></div>
    <div class="card"><h3>Activity timeline</h3><ul class="tl-feed" id="feed">${T.activity.map(a => `<li><span class="tl-i">${I(a.icon)}</span><div>${a.text}<small>${a.t}</small></div></li>`).join('')}</ul></div>
  </div>
</div>
<p class="disc center-d">${I('alert')}<span>Fictional company and simulated data. Not legal determinations.</span></p>
</div></section>`;
    },
    init(root) { T.$('#psearch', root).addEventListener('input', e => { st.dash.q = e.target.value; refreshTable(); }); }
  };
})(window.T);
