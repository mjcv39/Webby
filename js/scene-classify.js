/* Scene 3 · Try it: same model, different purpose, different risk (instant, interactive) */
(function (T) {
  T.scenes = T.scenes || {};
  const I = T.icon, st = T.state;
  const MODELS = ['gpt-5', 'claude-sonnet', 'gemini-pro', 'llama-4', 'mistral-large', 'deepseek-v3'];
  const USES = [['m-write', 'Draft emails'], ['m-summary', 'Summarise meetings'], ['l-chatbot', 'Customer chatbot'], ['l-genimage', 'Generate ad images'], ['h-recruit', 'Screen CVs'], ['h-credit', 'Score loan applicants'], ['h-learning', 'Grade exams'], ['p-emotion', 'Track staff emotions']];
  const ORDER = ['minimal', 'limited', 'high', 'prohibited'];
  const ICON = { prohibited: 'ban', high: 'alert', limited: 'eye', minimal: 'check' };
  st.cls = { model: 'gpt-5', use: 'm-write', text: '' };

  function card(r) {
    const c = T.RISK[r.cls], idx = ORDER.indexOf(r.cls), more = r.reqs.length - 4;
    const useLabel = st.cls.text ? st.cls.text : (USES.find(u => u[0] === st.cls.use) || [, r.useCase.label])[1];
    return `<div class="res r-${r.cls}">
      <div class="res-top"><span class="m-logo" style="background:${r.model.color}">${r.model.provider[0]}</span><span><b>${T.esc(r.model.name)}</b> · ${T.esc(useLabel)}</span><span class="sim">Simulated</span></div>
      <div class="res-tier"><span class="res-ic">${I(ICON[r.cls])}</span><div><h3>${c.label}</h3><code>${T.esc(r.ref)}</code></div></div>
      <div class="spectrum">${ORDER.map(k => `<i style="background:${T.RISK[k].color}"></i>`).join('')}<span class="marker" data-to="${idx * 25 + 12.5}" style="left:${(st.prevIdx == null ? idx : st.prevIdx) * 25 + 12.5}%"></span></div>
      <div class="spec-l"><span>Minimal</span><span>Limited</span><span>High</span><span>Prohibited</span></div>
      <p class="res-why">${T.esc(r.why)}</p>
      <div class="res-reqs"><b>${r.cls === 'prohibited' ? 'Required action' : r.reqs.length + ' potential requirements'}</b><div class="chips">${r.reqs.slice(0, 4).map(q => `<span class="chip" title="${T.esc(q.desc)}">${T.esc(q.title)} <small>${q.art}</small></span>`).join('')}${more > 0 ? `<span class="chip ghost">+${more} more</span>` : ''}</div></div>
      <div class="res-next">${I('arrow')}<span><b>Next:</b> ${T.esc(r.next[0])}</span></div>
      <div class="res-act"><button class="btn btn-sun" data-act="cadd">${I('plus')} Add to portfolio</button><span class="note">${T.esc(r.provider)} supplies the model. Your company owns the risk of the <i>system</i>.</span></div>
    </div>`;
  }

  function run() {
    const s = st.cls;
    const r = T.assess({ modelId: s.model, useId: s.text ? '' : s.use, text: s.text, role: 'both' });
    st.lastCls = r;
    const out = T.$('#c-out');
    out.innerHTML = card(r);
    out.className = 'c-out pulse r-' + r.cls;
    void out.offsetWidth; out.classList.add('go');
    const mk = T.$('.marker', out); requestAnimationFrame(() => requestAnimationFrame(() => { mk.style.left = mk.dataset.to + '%'; }));
    st.prevIdx = ORDER.indexOf(r.cls);
    T.$('#classify').style.setProperty('--rc', T.RISK[r.cls].color);
  }

  Object.assign(T.actions, {
    cmodel: el => { st.cls.model = el.dataset.id; T.$$('[data-act=cmodel]').forEach(b => b.classList.toggle('on', b === el)); run(); },
    cuse: el => { st.cls.use = el.dataset.id; st.cls.text = ''; T.$('#c-text').value = ''; T.$$('[data-act=cuse]').forEach(b => b.classList.toggle('on', b === el)); run(); },
    cadd: el => {
      const r = st.lastCls; if (!r) return;
      T.addToPortfolio(r); el.disabled = true; el.innerHTML = I('check') + ' Added to portfolio';
      T.toast('Added. Keep scrolling: it is now on the dashboard.');
    }
  });

  T.scenes.classify = {
    id: 'classify', label: 'Try it',
    render() {
      return `<section id="classify" class="scene">${T.photo('light-wave.jpg', 'ph-full')}<span class="bignum" data-par aria-hidden="true">03</span>
  <div class="wrap">
    <div class="scene-h"><span class="chap rv"><b>03</b>Try it</span><h2>Same model. Different purpose. <span class="warm">Different risk.</span></h2><p class="sub rv">Classification follows what an AI system is <i>used for</i>, not whose model is inside.</p></div>
    <div class="classifier">
      <div class="c-in rv" data-anim="left">
        <div class="step-l"><span>1</span>Pick a model</div>
        <div class="models">${MODELS.map(id => { const m = T.modelIndex[id]; return `<button class="mpick ${id === st.cls.model ? 'on' : ''}" data-act="cmodel" data-id="${id}"><span class="m-logo" style="background:${m.color}">${m.provider[0]}</span><span><b>${m.name}</b><small>${m.provider}</small></span></button>`; }).join('')}</div>
        <div class="step-l"><span>2</span>Pick a purpose</div>
        <div class="uses">${USES.map(u => `<button class="upick r-${T.useIndex[u[0]].cls} ${u[0] === st.cls.use ? 'on' : ''}" data-act="cuse" data-id="${u[0]}">${u[1]}</button>`).join('')}</div>
        <form class="c-form" id="c-form"><input id="c-text" type="text" maxlength="140" placeholder="…or describe your own, e.g. ‘rank job applicants’" aria-label="Describe an intended use"><button class="btn btn-ghost" type="submit">${I('scan')}</button></form>
      </div>
      <div class="c-out rv" data-anim="right" id="c-out"></div>
    </div>
    <p class="foot-note center rv">Educational simulation. Rule-based, not live AI analysis or a legal determination.</p>
  </div>
</section>`;
    },
    init(root) {
      run();
      T.$('#c-form', root).addEventListener('submit', e => {
        e.preventDefault(); const v = T.$('#c-text').value.trim(); if (!v) return;
        st.cls.text = v; T.$$('[data-act=cuse]').forEach(b => b.classList.remove('on')); run();
      });
    }
  };
})(window.T);
