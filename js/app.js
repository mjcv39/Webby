/* Tessera — router and shell */
(function (T) {
  const ROUTES = ['home', 'dashboard', 'assess', 'eu-ai-act', 'documents', 'monitoring', 'value', 'demo'];
  const TITLES = { home: 'AI Governance & Compliance Platform', dashboard: 'Dashboard', assess: 'Risk Assessment', 'eu-ai-act': 'EU AI Act Centre', documents: 'Documentation', monitoring: 'Monitoring', value: 'Why Tessera', demo: 'Guided Demo' };
  const app = T.$('#app');

  function route() {
    let r = (location.hash || '#/home').replace(/^#\/?/, '').split('?')[0];
    if (!ROUTES.includes(r)) r = 'home';
    T.cleanup.splice(0).forEach(f => f());
    const page = T.pages[r];
    app.innerHTML = `<div class="page fade">${page.render()}</div>`;
    T.$$('#links a').forEach(a => a.classList.toggle('on', a.dataset.r === r));
    T.$('#links').classList.remove('open'); T.$('#burger').setAttribute('aria-expanded', 'false');
    T.$('#notif').hidden = true;
    document.title = 'Tessera — ' + TITLES[r];
    window.scrollTo(0, 0);
    try { page.init && page.init(app); } catch (e) { console.error(e); }
    T.reveal(app);
    document.body.dataset.route = r;
  }

  T.$('#logo-slot').outerHTML = T.LOGO; T.$('#logo-slot2').outerHTML = T.LOGO;
  T.refreshBell();
  T.$('#bell').addEventListener('click', e => { e.stopPropagation(); const n = T.$('#notif'); n.hidden = !n.hidden; });
  document.addEventListener('click', e => { if (!e.target.closest('.bellwrap')) T.$('#notif').hidden = true; });
  T.$('#burger').addEventListener('click', () => { const l = T.$('#links'), o = l.classList.toggle('open'); T.$('#burger').setAttribute('aria-expanded', o); });
  window.addEventListener('scroll', () => T.$('#nav').classList.toggle('scrolled', window.scrollY > 8), { passive: true });
  window.addEventListener('hashchange', route);
  route();
})(window.T);
