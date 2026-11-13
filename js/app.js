/* Tessera — single-page assembly, scroll animations, scroll-spy */
(function (T) {
  const ORDER = ['hero', 'platform', 'dashboard', 'assess', 'eu-act', 'docs', 'monitoring', 'value', 'demo'];
  const app = T.$('#app');
  const I = T.icon;
  const CTA = `<section class="cta dk" id="cta"><div class="cta-glow" data-parallax="0.05"></div><div class="wrap">
    <span class="eyebrow rv">Ready?</span><h2 class="rv">Govern AI with confidence</h2>
    <ul class="pts rv"><li>See every system</li><li>Know every duty</li><li>Prove every control</li></ul>
    <div class="cta-row center rv"><a class="btn btn-primary btn-lg" href="#demo">${I('play')} Replay the demo</a><a class="btn btn-ghost btn-lg" href="#top">Back to top ${I('arrow')}</a></div>
    <p class="small muted rv">Tessera is a fictional product created for an educational project. All data is simulated.</p></div></section>`;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealIO = 'IntersectionObserver' in window && !reduce ? new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); revealIO.unobserve(e.target); }
  }), { threshold: .12, rootMargin: '0px 0px -6% 0px' }) : null;
  const secIO = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting && !e.target.classList.contains('vis')) { activate(e.target); secIO.unobserve(e.target); }
  }), { threshold: .08 }) : null;

  function activate(sec) { sec.classList.add('vis'); T.initBars(sec); T.countUp(sec); }

  /* Wrap each word of a headline in a masked span so it can slide up on reveal */
  function splitWords(el) {
    if (el.dataset.split) return; el.dataset.split = '1'; el.classList.add('sp-h'); el.setAttribute('aria-label', el.textContent.trim());
    let i = 0;
    const walk = (node, cls) => Array.from(node.childNodes).forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(t => {
          if (!t) return;
          if (/^\s+$/.test(t)) { frag.appendChild(document.createTextNode(' ')); return; }
          const w = document.createElement('span'), inner = document.createElement('i');
          w.className = 'sw'; w.setAttribute('aria-hidden', 'true'); inner.textContent = t; inner.style.setProperty('--i', i++); if (cls) inner.className = cls;
          w.appendChild(inner); frag.appendChild(w);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1) { const g = n.classList.contains('grad'); walk(n, g ? 'grad' : cls); if (g) n.classList.remove('grad'); }
    });
    walk(el, '');
  }

  function prepare(root) {
    T.$$('.sec-h h2, .hero h1, .cta h2', root).forEach(splitWords);
    T.$$('[data-stagger]', root).forEach(p => Array.from(p.children).forEach((c, i) => { c.classList.add('rv'); c.style.setProperty('--d', i * 80 + 'ms'); }));
    T.$$('.rv', root).forEach(e => { if (e.dataset.anim) e.classList.add('a-' + e.dataset.anim); revealIO ? revealIO.observe(e) : e.classList.add('in'); });
    T.$$('section', root).forEach(s => { secIO ? secIO.observe(s) : activate(s); });
  }

  function mount() {
    app.innerHTML = ORDER.map(k => T.sections[k].render()).join('') + CTA;
    ORDER.forEach(k => { const s = T.sections[k]; try { s.init && s.init(app); } catch (e) { console.error(k, e); } });
    prepare(app);
  }

  /* Re-render one section in place (e.g. dashboard after adding a system) */
  T.rerender = key => {
    const s = T.sections[key], old = T.$('#' + s.id); if (!old) return;
    const tmp = document.createElement('div'); tmp.innerHTML = s.render();
    const fresh = tmp.firstElementChild; old.replaceWith(fresh);
    T.$$('.rv', fresh).forEach(e => { if (e.dataset.anim) e.classList.add('a-' + e.dataset.anim); e.classList.add('in'); });
    T.$$('[data-stagger]', fresh).forEach(p => Array.from(p.children).forEach(c => c.classList.add('in')));
    activate(fresh); s.init && s.init(app);
  };
  T.refreshDashboard = () => T.rerender('dashboard');

  /* Scroll-driven effects, throttled with rAF */
  let ticking = false;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  let lastY = 0;
  function onScroll() {
    ticking = false;
    const y = window.scrollY, h = document.documentElement.scrollHeight - innerHeight;
    T.$('#prog').style.transform = `scaleX(${h > 0 ? y / h : 0})`;
    const nav = T.$('#nav'); nav.classList.toggle('scrolled', y > 8);
    nav.classList.toggle('hide', y > 500 && y > lastY + 2 && !T.$('#links').classList.contains('open')); if (y < lastY - 2 || y < 500) nav.classList.remove('hide'); lastY = y;
    const hero = T.$('#top'); if (hero) hero.style.setProperty('--hp', clamp(y / (innerHeight * .85), 0, 1).toFixed(3));
    T.$$('[data-zoom]').forEach(el => { const r = el.getBoundingClientRect(); el.style.setProperty('--z', clamp((innerHeight - r.top) / (innerHeight * .65), 0, 1).toFixed(3)); });
    if (!reduce) {
      T.$$('[data-parallax]').forEach(el => { const r = el.getBoundingClientRect(); if (r.bottom > -200 && r.top < innerHeight + 200) el.style.transform = `translate3d(0,${(y * parseFloat(el.dataset.parallax)).toFixed(1)}px,0)`; });
    }
    T.$$('[data-scrollprog]').forEach(el => { const r = el.getBoundingClientRect(); el.style.setProperty('--p', clamp((innerHeight * .72 - r.top) / Math.max(r.height, 1), 0, 1).toFixed(3)); });
  }
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  window.addEventListener('resize', onScroll);

  /* Inertial ("buttery") mouse-wheel scrolling. Touch, keyboard, anchors and inner scroll areas stay native. */
  (function inertia() {
    if (reduce || matchMedia('(pointer: coarse)').matches) return;
    let target = 0, cur = 0, raf = 0;
    const max = () => document.documentElement.scrollHeight - innerHeight;
    const tick = () => {
      cur += (target - cur) * .09;
      if (Math.abs(target - cur) < .4) { cur = target; raf = 0; window.scrollTo({ top: cur, behavior: 'instant' }); return; }
      window.scrollTo({ top: cur, behavior: 'instant' }); raf = requestAnimationFrame(tick);
    };
    window.addEventListener('wheel', e => {
      if (e.ctrlKey || e.defaultPrevented || e.target.closest('#modal, .tl-feed, .tbl-wrap, select, textarea, .notif')) return;
      e.preventDefault();
      if (!raf) { target = cur = window.scrollY; }
      target = clamp(target + e.deltaY * (e.deltaMode === 1 ? 32 : 1), 0, max());
      if (!raf) raf = requestAnimationFrame(tick);
    }, { passive: false });
  })();

  /* Scroll-spy for the nav */
  function spy() {
    const links = T.$$('#links a'), map = {};
    links.forEach(a => map[a.getAttribute('href').slice(1)] = a);
    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) links.forEach(a => a.classList.toggle('on', a === map[e.target.id]));
    }), { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(id => { const s = document.getElementById(id); s && io.observe(s); });
    ['top', 'demo', 'cta'].forEach(id => { const s = document.getElementById(id); s && io.observe(s); });
  }

  T.$('#logo-slot').outerHTML = T.LOGO; T.$('#logo-slot2').outerHTML = T.LOGO;
  mount(); T.refreshBell(); spy(); onScroll();
  T.$('#bell').addEventListener('click', e => { e.stopPropagation(); const n = T.$('#notif'); n.hidden = !n.hidden; });
  document.addEventListener('click', e => { if (!e.target.closest('.bellwrap')) T.$('#notif').hidden = true; if (e.target.closest('#links a')) { T.$('#links').classList.remove('open'); T.$('#burger').setAttribute('aria-expanded', 'false'); } });
  T.$('#burger').addEventListener('click', () => { const l = T.$('#links'), o = l.classList.toggle('open'); T.$('#burger').setAttribute('aria-expanded', o); });
  if (location.hash.length > 1) setTimeout(() => { const t = document.getElementById(location.hash.slice(1)); t && t.scrollIntoView(); }, 50);
})(window.T);
