/* Scene 5 · Monitoring: alerts arrive as you scroll; each opens its full story */
(function (T) {
  T.scenes = T.scenes || {};
  const I = T.icon;
  const ICON = { 'Prohibited-use flag': 'ban', 'Model updated': 'refresh', 'Missing documentation': 'file', 'Unapproved deployment': 'scan', 'Data governance': 'lock', 'Deadline approaching': 'clock', 'Human oversight': 'users' };
  const SHORT = { 'A-1': 'Keep suspended, escalate to Legal', 'A-2': 'Re-test, update docs, re-approve', 'A-3': 'Refresh the technical file', 'A-4': 'Register, classify, approve or block', 'A-5': 'Purge expired logs', 'A-6': 'Close gaps or request extension', 'A-7': 'Audit decisions, retrain reviewers' };
  const PICK = ['A-1', 'A-2', 'A-4', 'A-7', 'A-5'];

  function stream() {
    return PICK.map(id => T.alerts.find(a => a.id === id)).map((a, i) => {
      const s = T.getSystem(a.sys);
      return `<button class="alert-c lv-${a.sev} ${a.done ? 'done' : ''}" data-act="alert" data-id="${a.id}" style="--d:${i * 140}ms">
        <span class="al-i">${I(ICON[a.type])}</span>
        <span class="al-b"><small>${a.type} · ${a.ago}</small><b>${T.esc(a.title)}</b><span>${s ? T.esc(s.name) : 'Unregistered tool'} <em>→ ${SHORT[a.id]}</em></span></span>
        ${a.done ? '<span class="stat s-ok">Resolved</span>' : T.sevBadge(a.sev)}</button>`;
    }).join('');
  }

  Object.assign(T.actions, {
    alert: el => {
      const a = T.alerts.find(x => x.id === el.dataset.id), s = T.getSystem(a.sys);
      T.openModal(`<div class="alm lv-${a.sev}"><span class="chap"><b>${a.sev}</b>${a.type}</span><h2>${T.esc(a.title)}</h2>
        <div class="alm-g"><div><small>What happened</small><p>${T.esc(a.what)}</p></div><div><small>Affected system</small><p>${s ? T.esc(s.name) + ' ' + T.riskBadge(s.cls) : 'Not yet registered'}</p></div><div><small>Why it matters</small><p>${T.esc(a.why)}</p></div><div><small>Recommended action</small><p>${T.esc(a.action)}</p></div></div>
        <div class="modal-f">${a.done ? '<span class="stat s-ok">Resolved</span>' : `<button class="btn btn-sun" data-act="resolve" data-id="${a.id}">${I('check')} Mark resolved</button>`}</div></div>`);
    },
    resolve: el => {
      T.alerts.find(x => x.id === el.dataset.id).done = true; T.closeModal();
      const w = T.$('#stream'); if (w) w.innerHTML = stream(); T.$$('.alert-c', w).forEach(c => c.classList.add('in'));
      T.refreshBell(); T.toast('Resolved and logged in the audit trail');
    }
  });

  T.scenes.watch = {
    id: 'watch', label: 'Monitoring',
    render() {
      const drift = T.series('S-001drift', 32, 14, 3, 20);
      return `<section id="watch" class="scene">
  <div class="wrap watch">
    <div class="watch-l">
      <span class="chap rv"><b>05</b>Monitoring</span>
      <h2>It watches, so <span class="warm">you don't have to.</span></h2>
      <div class="chain rv"><span>Detect</span><i></i><span>Alert</span><i></i><span>Fix</span><i></i><span>Log</span><b class="spark-dot"></b></div>
      <div class="drift rv" data-anim="zoom"><div class="drift-h"><small>Output drift · TalentRank CV Screener</small><b>${drift[drift.length - 1].toFixed(0)}</b></div>${T.line(drift, null, { h: 120, color: '#f1745e', min: 0, max: 40 })}<span class="drift-tag">Model updated · reassess</span></div>
    </div>
    <div class="stream" id="stream" data-stagger>${stream()}</div>
  </div>
</section>`;
    }
  };
})(window.T);
