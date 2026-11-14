/* Scene 7 · Payoff (before/after) and Scene 8 · Finale (the sun is up) */
(function (T) {
  T.scenes = T.scenes || {};
  const I = T.icon;
  const benefits = [['eye', 'Visibility', 'Every AI system, vendor and shadow tool in one registry', 'earth-orbit.jpg'], ['scale', 'Readiness', 'Know which EU AI Act duties apply, and when', 'dawn-road.jpg'], ['users', 'Accountability', 'Named owners, approvals and audit trails', 'bridge.jpg'], ['star', 'Trust', 'Prove responsible AI to customers and regulators', 'tree.jpg']];
  /* [label, x%, y%, rotation, isKeyProblem] hand-placed so nothing overlaps */
  const CHAOS = [['Scattered AI tools', 2, 4, -6, 1], ['GPT tab', 62, 0, 9, 0], ['No clear owners', 30, 20, 5, 1], ['v7_FINAL.docx', 0, 37, -4, 0], ['Manual assessments', 40, 42, -7, 1],
    ['who owns this?', 6, 58, 8, 0], ['Missing documents', 36, 66, 4, 1], ['Reactive firefighting', 4, 84, -5, 1], ['shadow tool', 60, 88, 10, 0]];
  const withp = ['One AI inventory', 'Clear risk classes', 'Organised evidence', 'Proactive alerts', 'Structured governance'];
  const audience = ['Startups', 'SMEs', 'Enterprises', 'Executives', 'Compliance officers', 'IT managers', 'AI developers', 'Risk teams', 'Finance', 'Healthcare', 'HR', 'Public sector', 'Education', 'Energy'];

  T.scenes.value = {
    id: 'value', label: 'The payoff',
    render() {
      return `<section id="value" class="scene"><span class="bignum" data-par aria-hidden="true">06</span>
  <div class="wrap">
    <div class="scene-h"><span class="chap rv"><b>06</b>The payoff</span><h2>From shadow AI <span class="warm">to sunrise.</span></h2><p class="sub rv">Drag the handle.</p></div>
    <div class="ba rv" data-anim="zoom" id="ba" style="--x:50%">
      <div class="ba-l ba-night">${T.photo('fog-forest.jpg')}<span class="ba-tag">Without governance</span><div class="ba-side">
        <div class="chaos">${CHAOS.map(c => `<span class="${c[4] ? 'k' : ''}" style="--x:${c[1]}%;--y:${c[2]}%;--r:${c[3]}deg">${c[4] ? I('x') : ''}${c[0]}</span>`).join('')}</div></div></div>
      <div class="ba-l ba-day">${T.photo('sunrise-hills.jpg')}<span class="ba-tag">With Tessera</span><div class="ba-side r">
        <ul>${withp.map(x => `<li>${I('check')}${x}</li>`).join('')}</ul></div></div>
      <div class="ba-h"><span>${I('chevron')}</span></div>
      <input type="range" min="2" max="98" value="50" id="ba-r" aria-label="Compare without and with Tessera">
    </div>
    <div class="benefits" data-stagger>${benefits.map(b => `<div class="ben"><span class="ben-ph" aria-hidden="true"><img src="img/${b[3]}" alt="" loading="lazy" decoding="async"></span><span class="ben-i">${I(b[0])}</span><b>${b[1]}</b><small>${b[2]}</small></div>`).join('')}</div>
  </div>
  <div class="marquee" aria-label="Built for"><div class="mq-track">${[0, 1].map(() => audience.map(a => `<span>${a}</span>`).join('<i>✦</i>')).join('<i>✦</i>')}</div></div>
</section>`;
    },
    init(root) {
      const ba = T.$('#ba', root), rng = T.$('#ba-r', root);
      rng.addEventListener('input', () => ba.style.setProperty('--x', rng.value + '%'));
      if (!('IntersectionObserver' in window)) return;
      const io = new IntersectionObserver(es => {
        if (!es[0].isIntersecting) return; io.disconnect();
        const t0 = performance.now();
        const step = t => { const p = Math.min(1, (t - t0) / 2200), e = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2, x = 94 - 44 * e; ba.style.setProperty('--x', x + '%'); rng.value = x; if (p < 1) requestAnimationFrame(step); };
        requestAnimationFrame(step);
      }, { threshold: .55 });
      io.observe(ba);
    }
  };

  T.scenes.finale = {
    id: 'finale', label: 'Finish',
    render() {
      return `<section id="finale" class="scene finale">
  ${T.photo('mountains.jpg', 'ph-finale')}<div class="sunrise" aria-hidden="true"><div class="rays"></div></div>
  <div class="finale-c">
    <div class="f-logo rv" data-anim="zoom">${T.LOGO}</div>
    <h2 class="display">Govern AI <span class="warm">with confidence.</span></h2>
    <ul class="recap rv"><li><b>01</b>Find every system</li><li><b>02</b>Know the rules</li><li><b>03</b>Classify by purpose</li><li><b>04</b>See it all</li><li><b>05</b>Keep the evidence</li></ul>
    <div class="cta-row rv"><a class="btn btn-sun btn-lg" href="#classify">${I('play')} Try the classifier again</a><a class="btn btn-ghost btn-lg" href="#intro">Back to the start</a></div>
  </div>
  <footer class="f-foot"><span><b>Tessera</b> is a fictional product created for an educational project. All companies, systems and results are simulated. Not legal advice, a legal determination or a certification.</span>
    <span>Sources: <a href="https://eur-lex.europa.eu/eli/reg/2024/1689/oj" target="_blank" rel="noopener">Regulation (EU) 2024/1689</a> · <a href="https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai" target="_blank" rel="noopener">European Commission</a></span></footer>
</section>`;
    }
  };
})(window.T);
