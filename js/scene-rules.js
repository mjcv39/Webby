/* Scene 2 · The rules (pinned): the EU AI Act risk pyramid builds itself, then the timeline lands */
(function (T) {
  T.scenes = T.scenes || {};
  const tiers = [
    ['prohibited', 'Banned outright', 'Social scoring · workplace emotion AI · face scraping', 'Art. 5 · since 2 Feb 2025'],
    ['high', 'Strict requirements', 'Hiring · credit · exams · critical infrastructure', 'Annex III · risk mgmt, oversight, conformity'],
    ['limited', 'Must disclose AI', 'Chatbots · deepfakes · generated media', 'Art. 50 · transparency'],
    ['minimal', 'Free to use', 'Spam filters · summaries · writing assistants', 'AI literacy still applies']
  ];
  const dates = [
    ['2024-08-01', 'In force'], ['2025-02-02', 'Bans + AI literacy'], ['2025-08-02', 'General-purpose AI'],
    ['2026-08-02', 'Transparency'], ['2027-12-02', 'High-risk (Annex III)*'], ['2028-08-02', 'High-risk (Annex I)*']
  ];
  const t0 = +new Date('2024-06-01'), t1 = +new Date('2028-12-01'), pos = d => ((+new Date(d) - t0) / (t1 - t0) * 100).toFixed(2);
  let sec = null;

  T.scenes.rules = {
    id: 'rules', label: 'The rules', pin: true,
    render() {
      const now = Date.now();
      return `<section id="rules" class="scene pin" style="--len:180vh">
  <div class="pin-in">
    <div class="rules-top">
      <span class="chap"><b>02</b>The rules</span>
      <h2>The EU AI Act sorts AI <span class="warm">by risk.</span></h2>
      <p class="sub">Regulation (EU) 2024/1689. The higher the risk, the stricter the rules.</p>
    </div>
    <div class="pyramid">
      ${tiers.map((t, i) => `<div class="tier r-${t[0]}" data-i="${i}"><div class="trap" style="--w:${34 + i * 22}%;--in:${(((34 + i * 22) - (i ? 34 + (i - 1) * 22 : 8)) / 2 / (34 + i * 22) * 100).toFixed(2)}%"><b>${T.RISK[t[0]].label}</b></div><div class="t-txt"><b>${t[1]}</b><span>${t[2]}</span><small>${t[3]}</small></div></div>`).join('')}
    </div>
    <div class="rules-foot">
      <div class="tl2">
        <div class="tl2-line"><i style="width:${Math.min(100, pos(new Date(now)))}%"></i></div>
        ${dates.map(d => `<div class="tl2-d ${+new Date(d[0]) <= now ? 'past' : ''}" style="left:${pos(d[0])}%"><i></i><b>${new Date(d[0]).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}</b><span>${d[1]}</span></div>`).join('')}
        <div class="tl2-now" style="left:${Math.min(100, pos(new Date(now)))}%"><span>Today</span></div>
      </div>
      <div class="fine-punch"><b>€35M</b><span>or 7% of global turnover: the maximum fine for prohibited AI</span></div>
    </div>
    <p class="foot-note">Prohibited ≠ high-risk: one is banned, the other is regulated. *Postponed by the 2026 Digital Omnibus on AI. Verify dates on <a href="https://eur-lex.europa.eu/eli/reg/2024/1689/oj" target="_blank" rel="noopener">EUR-Lex</a>.</p>
  </div>
</section>`;
    },
    init(root) { sec = T.$('#rules', root); },
    update(p) {
      if (!sec) return;
      /* tiers build from the base upwards */
      T.$$('.tier', sec).forEach(el => { const i = +el.dataset.i, at = -.3 + (3 - i) * .16; el.classList.toggle('on', p > at); });
      sec.classList.toggle('timeline-on', p > .3);
    }
  };
})(window.T);
