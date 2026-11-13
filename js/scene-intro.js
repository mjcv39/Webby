/* Scene 0 · Intro: a real sunrise photograph, graded pink, with an optical bloom and lens flare on the sun */
(function (T) {
  T.scenes = T.scenes || {};

  /* Shared helper: a colour-graded background photograph that drifts with scroll (parallax) */
  T.photo = (src, cls) => `<div class="ph ${cls || ''}" data-par aria-hidden="true"><img src="img/${src}" alt="" loading="lazy" decoding="async"></div>`;

  T.scenes.intro = {
    id: 'intro', label: 'Intro',
    render() {
      return `<section id="intro" class="scene intro">
  <div class="hero-ph" aria-hidden="true">
    <img src="img/hero-sunrise.jpg" alt="" fetchpriority="high" decoding="async">
    <div class="hero-grade"></div>
    <div class="bloom"><i class="core"></i><i class="halo"></i><i class="streak"></i></div>
    <div class="ghosts"><i></i><i></i><i></i><i></i></div>
  </div>
  <div class="intro-c">
    <span class="kicker rv">${T.LOGO}<span>Tessera</span><i></i>AI governance platform</span>
    <h1 class="display">Every AI system. <span class="warm">Accounted for.</span></h1>
    <p class="lede rv" style="--d:500ms">See it. Classify it. Prove it. Built for the EU AI Act.</p>
  </div>
  <a class="scroll-hint" href="#problem" aria-label="Start the story"><span>Scroll to begin</span><i></i></a>
  <span class="credit">Photography: Unsplash</span>
</section>`;
    }
  };
})(window.T);
