/* Scene 1 · The problem (pinned): scattered shadow AI is pulled into an ordered registry as you scroll */
(function (T) {
  T.scenes = T.scenes || {};
  const I = T.icon;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  let chips = [], stage = null, W = 0, H = 0, lastStep = -1;

  /* deterministic scatter positions */
  const scatter = i => { const r = n => ((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1 + 1) % 1; return { x: .02 + r(1) * .78, y: .02 + r(2) * .82, rot: (r(3) - .5) * 30, s: .85 + r(4) * .25 }; };

  const steps = [
    ['Your company already runs AI.', 'In HR, finance, marketing, IT. Often nobody knows where.'],
    ['Tessera finds every system.', 'Vendor tools, open models, in-house builds and shadow AI.'],
    ['Then it maps the risk.', 'Every system gets an owner, a purpose and a risk class.']
  ];

  function measure() {
    if (!stage) return;
    W = stage.clientWidth; H = stage.clientHeight;
  }

  T.scenes.problem = {
    id: 'problem', label: 'The problem', pin: true,
    render() {
      const depts = new Set(T.systems.map(s => s.dept)).size, provs = new Set(T.systems.map(s => s.provider)).size;
      const list = T.systems.slice(-18);
      return `<section id="problem" class="scene pin" style="--len:260vh">
  <div class="pin-in">
    <div class="pin-head">
      <span class="chap"><b>01</b>The problem</span>
      <div class="captions">${steps.map((s, i) => `<div class="cap" data-i="${i}"><h2>${s[0]}</h2><p>${s[1]}</p></div>`).join('')}</div>
      <div class="tally"><div><b>${list.length}</b><span>AI systems</span></div><div><b>${depts}</b><span>departments</span></div><div><b>${provs}</b><span>providers</span></div></div>
    </div>
    <div class="stage" id="p-stage">
      ${list.map((s, i) => `<div class="tool r-${s.cls}" data-i="${i}" title="${T.esc(s.use)}"><span class="t-logo">${s.provider[0]}</span><div><b>${T.esc(s.name)}</b><small>${s.dept}</small></div><span class="t-q">?</span><span class="t-ok">${I('check')}</span></div>`).join('')}
      <div class="legend-r">${['minimal', 'limited', 'high', 'prohibited'].map(k => `<span><i style="background:${T.RISK[k].color}"></i>${T.RISK[k].label}</span>`).join('')}</div>
    </div>
  </div>
</section>`;
    },
    init(root) {
      stage = T.$('#p-stage', root); chips = T.$$('.tool', stage).map((el, i) => ({ el, sc: scatter(i) }));
      measure(); window.addEventListener('resize', measure);
    },
    update(p) {
      if (!stage) return;
      const sec = stage.closest('.scene');
      const step = p < .34 ? 0 : p < .68 ? 1 : 2;
      if (step !== lastStep) { T.$$('.cap', sec).forEach(c => c.classList.toggle('on', +c.dataset.i === step)); lastStep = step; }
      sec.classList.toggle('mapped', p > .68);
      sec.classList.toggle('found', p > .45);
      const cols = W < 640 ? 2 : W < 980 ? 3 : 6, rows = Math.ceil(chips.length / cols);
      const cw = W / cols, ch = Math.min(H / rows, 96);
      const gy0 = (H - ch * rows) / 2;
      const t = ease(clamp((p - .2) / .42, 0, 1));
      const drift = performance.now() / 1000;
      chips.forEach((c, i) => {
        const col = i % cols, row = Math.floor(i / cols);
        const gx = col * cw + 6, gy = gy0 + row * ch;
        const sx = c.sc.x * W + Math.sin(drift * .6 + i) * 8 * (1 - t), sy = c.sc.y * H + Math.cos(drift * .5 + i) * 8 * (1 - t);
        const x = sx + (gx - sx) * t, y = sy + (gy - sy) * t, r = c.sc.rot * (1 - t), s = c.sc.s + (1 - c.sc.s) * t;
        c.el.style.width = (cw - 12) + 'px';
        c.el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) rotate(${r.toFixed(2)}deg) scale(${s.toFixed(3)})`;
        c.el.style.opacity = (.55 + .45 * Math.max(t, (i % 3) / 3)).toFixed(2);
      });
    }
  };
})(window.T);
