/* Scene 0 · Intro: night horizon, the sun waiting below it */
(function (T) {
  T.scenes = T.scenes || {};
  const sats = ['TalentRank', 'Aria Chatbot', 'Credit Assist', 'VoiceLine', 'DevAssist', 'MoodLens', 'Translate Hub', 'Campaign Studio'];

  T.scenes.intro = {
    id: 'intro', label: 'Intro',
    render() {
      return `<section id="intro" class="scene intro">
  <div class="orbits" aria-hidden="true">
    ${[0, 1, 2].map(i => `<div class="orbit o${i}">${sats.slice(i * 3, i * 3 + 3).map((s, j) => `<span class="sat" style="--a:${j * 120 + i * 40}deg"><i></i><em>${s}</em></span>`).join('')}</div>`).join('')}
  </div>
  <div class="intro-c">
    <span class="kicker rv">${T.LOGO}<span>Tessera</span><i></i>AI governance platform</span>
    <h1 class="display">Every AI system. <span class="warm">Accounted for.</span></h1>
    <p class="lede rv" style="--d:500ms">See it. Classify it. Prove it. Built for the EU AI Act.</p>
  </div>
  <div class="horizon" aria-hidden="true"><div class="flare"></div><div class="sun"></div><div class="floor"></div></div>
  <a class="scroll-hint" href="#problem" aria-label="Start the story"><span>Scroll to begin</span><i></i></a>
</section>`;
    }
  };
})(window.T);
