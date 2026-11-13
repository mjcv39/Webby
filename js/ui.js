/* Tessera — UI helpers: icons, badges, modal, toast, delegation. */
(function (T) {
  const P = {
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
    layers: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
    scan: '<path d="M4 8V5a1 1 0 011-1h3M16 4h3a1 1 0 011 1v3M20 16v3a1 1 0 01-1 1h-3M8 20H5a1 1 0 01-1-1v-3"/><circle cx="12" cy="12" r="3"/>',
    book: '<path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2z"/><path d="M4 21V5M9 8h6"/>',
    file: '<path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>',
    pulse: '<path d="M3 12h4l3-8 4 16 3-8h4"/>',
    bell: '<path d="M6 8a6 6 0 1112 0c0 7 3 9 3 9H3s3-2 3-9M10 21a2 2 0 004 0"/>',
    check: '<path d="M5 12l5 5 9-10"/>',
    alert: '<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.01"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.5 3-6 6.5-6s6.5 2.5 6.5 6M16 4.5a3.5 3.5 0 010 7M21.5 20c0-2.6-1.7-4.700-4-5.500"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/>',
    eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    cpu: '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>',
    chart: '<path d="M4 20V4M4 20h16"/><path d="M8 16l4-5 3 3 5-7"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
    zap: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    download: '<path d="M12 3v12M7 10l5 5 5-5M4 20h16"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    chevron: '<path d="M6 9l6 6 6-6"/>',
    building: '<rect x="4" y="3" width="10" height="18" rx="1"/><path d="M14 9h5a1 1 0 011 1v11h-6M8 7h2M8 11h2M8 15h2"/>',
    scale: '<path d="M12 3v18M6 21h12M5 7h14M5 7l-3 7a3 3 0 006 0zM19 7l-3 7a3 3 0 006 0z"/>',
    link: '<path d="M10 14a4 4 0 005.700 0l3-3a4 4 0 00-5.700-5.700l-1 1M14 10a4 4 0 00-5.700 0l-3 3a4 4 0 005.700 5.700l1-1"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.500"/>',
    refresh: '<path d="M20 11a8 8 0 00-14-4M4 4v4h4M4 13a8 8 0 0014 4M20 20v-4h-4"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    play: '<path d="M7 4l13 8-13 8z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
    ban: '<circle cx="12" cy="12" r="9"/><path d="M5.600 5.600l12.800 12.800"/>',
    brain: '<path d="M9 4a3 3 0 00-3 3 3 3 0 00-2 5 3 3 0 002 5 3 3 0 006 0V4a3 3 0 00-3 0zM15 4a3 3 0 013 3 3 3 0 012 5 3 3 0 01-2 5 3 3 0 01-6 0"/>',
    trend: '<path d="M3 17l6-6 4 4 8-8M15 7h6v6"/>',
    flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
    home: '<path d="M4 11l8-7 8 7v9H4z"/>',
    star: '<path d="M12 3l2.700 5.600 6.100.9-4.400 4.300 1 6.100L12 17l-5.400 2.900 1-6.100L3.200 9.500l6.100-.9z"/>',
    dollar: '<circle cx="12" cy="12" r="9"/><path d="M14.500 9a2.500 2 0 00-2.500-1.500c-1.500 0-2.500.8-2.500 2s1 1.800 2.500 2 2.500.8 2.500 2-1 2-2.500 2A2.500 2 0 019.500 15M12 6v1.500M12 16.500V18"/>'
  };
  T.icon = (n, cls) => `<svg class="ic ${cls || ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n] || ''}</svg>`;

  T.LOGO = `<svg class="logo" viewBox="0 0 40 40" aria-hidden="true"><defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fbc3b9"/><stop offset=".5" stop-color="#f1745e"/><stop offset="1" stop-color="#e06464"/></linearGradient></defs><rect width="40" height="40" rx="11" fill="#2a1317"/><path d="M20 6l11.500 6.500v13L20 34 8.500 25.500v-13z" fill="none" stroke="url(#lg)" stroke-width="2.200" stroke-linejoin="round"/><path d="M20 6v8M8.500 12.500L15 17M31.500 12.500L25 17" stroke="url(#lg)" stroke-width="1.600" stroke-linecap="round"/><circle cx="20" cy="20" r="4.500" fill="url(#lg)"/><circle cx="20" cy="20" r="1.800" fill="#2a1317"/></svg>`;

  T.esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  T.$ = (s, r) => (r || document).querySelector(s);
  T.$$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  T.riskBadge = c => `<span class="badge r-${c}"><i></i>${T.RISK[c].label}</span>`;
  const STAT = { 'Compliant': 'ok', 'In progress': 'prog', 'Under review': 'rev', 'Action required': 'act', 'Blocked': 'blk', 'Approved': 'ok', 'Draft': 'prog', 'In review': 'rev', 'Outdated': 'act', 'Missing': 'blk' };
  T.statBadge = s => `<span class="stat s-${STAT[s] || 'prog'}">${s}</span>`;
  T.sevBadge = s => `<span class="sev sv-${s}">${s}</span>`;

  /* Toast */
  T.toast = (msg, kind) => {
    const el = document.createElement('div');
    el.className = 'toast ' + (kind || '');
    el.innerHTML = `${T.icon(kind === 'warn' ? 'alert' : 'check')}<span>${msg}</span>`;
    T.$('#toasts').appendChild(el);
    requestAnimationFrame(() => el.classList.add('in'));
    setTimeout(() => { el.classList.remove('in'); setTimeout(() => el.remove(), 300); }, 3600);
  };

  /* Modal */
  let lastFocus = null;
  T.openModal = (html, wide) => {
    lastFocus = document.activeElement;
    const m = T.$('#modal'), box = T.$('#modal-box');
    box.className = 'modal-box' + (wide ? ' wide' : '');
    box.innerHTML = `<button class="modal-x" data-act="close" aria-label="Close">${T.icon('x')}</button>` + html;
    m.hidden = false; document.body.classList.add('lock');
    requestAnimationFrame(() => m.classList.add('in'));
    box.focus && box.setAttribute('tabindex', '-1'); box.focus();
    T.initBars(box);
  };
  T.closeModal = () => {
    const m = T.$('#modal'); m.classList.remove('in');
    setTimeout(() => { m.hidden = true; document.body.classList.remove('lock'); }, 200);
    lastFocus && lastFocus.focus && lastFocus.focus();
  };

  /* Animated bars / counters */
  T.initBars = root => requestAnimationFrame(() => T.$$('[data-w]', root).forEach(b => { b.style.width = b.dataset.w + '%'; }));
  T.countUp = root => T.$$('[data-count]', root).forEach(el => {
    const to = +el.dataset.count, suf = el.dataset.suf || '', dur = 900, t0 = performance.now();
    const step = t => { const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3); el.textContent = Math.round(to * e).toLocaleString() + suf; if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  });

  /* Action delegation: pages register handlers in T.actions */
  T.actions = {
    close: () => T.closeModal(),
  };
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-act]');
    if (a && T.actions[a.dataset.act]) { T.actions[a.dataset.act](a, e); }
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !T.$('#modal').hidden) T.closeModal();
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-act][role="button"]')) { e.preventDefault(); e.target.click(); }
  });

  /* File download helper */
  T.download = (name, content, type) => {
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([content], { type })); a.download = name;
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 500);
    T.toast('Downloaded ' + name);
  };
  /* Scenes can subscribe to portfolio changes (e.g. the dashboard re-renders) */
  T.listeners = [];
  T.refreshBell = () => T.listeners.forEach(f => f());
})(window.T);
