/* Tessera — scroll story engine: scenes, pinning, sunrise sky, reveals, chapter rail */
(function (T) {
  const ORDER = ['intro', 'problem', 'rules', 'classify', 'product', 'watch', 'evidence', 'value', 'finale'];
  const app = T.$('#app'), root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  /* ---------- mount ---------- */
  app.innerHTML = ORDER.map(k => T.scenes[k].render()).join('');
  ORDER.forEach(k => { const s = T.scenes[k]; try { s.init && s.init(app); } catch (e) { console.error(k, e); } });

  /* ---------- headline word reveals ---------- */
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
      } else if (n.nodeType === 1) { const c = n.className; walk(n, c || cls); n.removeAttribute('class'); }
    });
    walk(el, '');
  }
  T.$$('.scene h2, .display', app).forEach(splitWords);

  /* ---------- reveal on scroll ---------- */
  T.$$('[data-stagger]', app).forEach(p => Array.from(p.children).forEach((c, i) => { c.classList.add('rv'); c.style.setProperty('--d', i * 110 + 'ms'); }));
  const revealIO = 'IntersectionObserver' in window && !reduce ? new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); revealIO.unobserve(e.target); }
  }), { threshold: .15, rootMargin: '0px 0px -8% 0px' }) : null;
  T.$$('.rv, .sp-h', app).forEach(e => {
    if (e.closest('.cap')) return;
    if (e.dataset.anim) e.classList.add('a-' + e.dataset.anim);
    revealIO ? revealIO.observe(e) : e.classList.add('in');
  });
  const secIO = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting && !e.target.classList.contains('vis')) { e.target.classList.add('vis'); T.initBars(e.target); T.countUp(e.target); secIO.unobserve(e.target); }
  }), { threshold: .12 }) : null;
  T.$$('.scene', app).forEach(s => secIO ? secIO.observe(s) : s.classList.add('vis'));

  /* ---------- chapter rail ---------- */
  const rail = T.$('#rail');
  rail.innerHTML = ORDER.map(k => `<a href="#${T.scenes[k].id}" data-id="${T.scenes[k].id}"><i></i><span>${T.scenes[k].label}</span></a>`).join('');
  const railLinks = T.$$('a', rail);

  /* ---------- scroll-driven frame ---------- */
  const pinned = ORDER.map(k => T.scenes[k]).filter(s => s.pin).map(s => ({ s, el: document.getElementById(s.id) }));
  const scrubs = T.$$('[data-scrub]', app), intro = T.$('#intro'), sections = ORDER.map(k => document.getElementById(T.scenes[k].id));
  let lastActive = '';
  function frame() {
    const y = scrollY, vh = innerHeight, max = root.scrollHeight - vh;
    const s = max > 0 ? y / max : 0;
    root.style.setProperty('--s', s.toFixed(4));
    T.$('#prog').style.transform = `scaleX(${s.toFixed(4)})`;
    if (intro) intro.style.setProperty('--hp', clamp(y / vh, 0, 1).toFixed(3));
    pinned.forEach(({ s: sc, el }) => {
      const r = el.getBoundingClientRect();
      if (r.bottom < -vh || r.top > vh * 2) return;
      sc.update(clamp(-r.top / Math.max(r.height - vh, 1), 0, 1));
    });
    scrubs.forEach(el => { const r = el.getBoundingClientRect(); el.style.setProperty('--sp', clamp((vh - r.top) / (vh * .85), 0, 1).toFixed(3)); });
    let active = sections[0].id;
    sections.forEach(sec => { if (sec.getBoundingClientRect().top <= vh * .5) active = sec.id; });
    if (active !== lastActive) { railLinks.forEach(a => a.classList.toggle('on', a.dataset.id === active)); lastActive = active; document.body.dataset.scene = active; }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  /* ---------- inertial wheel scrolling (touch, keys and anchors stay native) ---------- */
  (function inertia() {
    if (reduce || matchMedia('(pointer: coarse)').matches) return;
    let target = 0, cur = 0, raf = 0;
    const tick = () => {
      cur += (target - cur) * .085;
      const done = Math.abs(target - cur) < .4; if (done) cur = target;
      window.scrollTo({ top: cur, behavior: 'instant' });
      raf = done ? 0 : requestAnimationFrame(tick);
    };
    window.addEventListener('wheel', e => {
      if (e.ctrlKey || e.target.closest('#modal, .a-tbl, select, textarea')) return;
      e.preventDefault();
      if (!raf) target = cur = scrollY;
      target = clamp(target + e.deltaY * (e.deltaMode === 1 ? 32 : 1), 0, root.scrollHeight - innerHeight);
      if (!raf) raf = requestAnimationFrame(tick);
    }, { passive: false });
  })();

  /* ---------- soft light that follows the cursor ---------- */
  (function glow() {
    const g = T.$('#cursor'); if (!g || reduce || matchMedia('(pointer: coarse)').matches) return;
    let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
    addEventListener('pointermove', e => { x = e.clientX; y = e.clientY; g.style.opacity = 1; }, { passive: true });
    (function loop() { cx += (x - cx) * .12; cy += (y - cy) * .12; g.style.transform = `translate3d(${cx - 300}px,${cy - 300}px,0)`; requestAnimationFrame(loop); })();
  })();

  if (location.hash.length > 1) setTimeout(() => { const t = document.getElementById(location.hash.slice(1)); t && t.scrollIntoView(); }, 60);
})(window.T);
