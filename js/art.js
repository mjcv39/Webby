/* Tessera — animated line-art illustrations for the in-between chapters.
   Each returns an inline SVG. They are drawn faint (see .art in styles.css) so they never compete with the text. */
(function (T) {
  const P = '#ff6fb5', H = '#ff3e9a';
  const wrap = (cls, inner, vb) => `<div class="art ${cls || ''}" aria-hidden="true"><svg viewBox="${vb || '0 0 1200 700'}" preserveAspectRatio="xMidYMid slice" fill="none">${inner}</svg></div>`;
  const star = (cx, cy, r) => { let d = ''; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .45 : r; d += (i ? 'L' : 'M') + (cx + rr * Math.cos(a)).toFixed(1) + ' ' + (cy + rr * Math.sin(a)).toFixed(1); } return d + 'Z'; };

  T.art = {
    /* 01 · hidden AI across the organisation: a network of departments with signals moving between them */
    problem() {
      const n = [[120, 140], [300, 90], [480, 180], [650, 110], [830, 160], [1030, 100], [180, 330], [390, 300], [600, 340], [800, 300], [1000, 330], [130, 540], [340, 560], [560, 520], [760, 580], [980, 540]];
      const e = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [0, 6], [1, 7], [2, 7], [3, 8], [4, 9], [5, 10], [6, 7], [7, 8], [8, 9], [9, 10], [6, 11], [7, 12], [8, 13], [9, 14], [10, 15], [11, 12], [12, 13], [13, 14], [14, 15]];
      const unknown = new Set([2, 9, 12, 5]);
      let s = e.map(([a, b]) => `<line x1="${n[a][0]}" y1="${n[a][1]}" x2="${n[b][0]}" y2="${n[b][1]}" stroke="${P}" stroke-opacity=".35"/>`).join('');
      s += e.filter((_, i) => i % 2 === 0).map(([a, b], i) => `<circle r="3.5" fill="${H}"><animateMotion dur="${3 + (i % 4)}s" begin="${i * .6}s" repeatCount="indefinite" path="M${n[a][0]} ${n[a][1]}L${n[b][0]} ${n[b][1]}"/></circle>`).join('');
      s += n.map((p, i) => unknown.has(i)
        ? `<circle cx="${p[0]}" cy="${p[1]}" r="16" stroke="${P}" stroke-dasharray="4 5" class="a-spin-l"/><text x="${p[0]}" y="${p[1] + 5}" text-anchor="middle" font-size="15" font-family="Space Grotesk,sans-serif" fill="${P}" class="a-blink" style="--dl:${i * .4}s">?</text>`
        : `<circle cx="${p[0]}" cy="${p[1]}" r="5" fill="${P}"/><circle cx="${p[0]}" cy="${p[1]}" r="6" stroke="${P}" class="a-pulse" style="--dl:${(i % 5) * .5}s"/>`).join('');
      return wrap('art-problem', s);
    },

    /* 02 · the law: a ring of twelve stars turning slowly around a balance scale */
    rules() {
      let ring = ''; for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; ring += `<path d="${star(600 + 250 * Math.cos(a), 350 + 250 * Math.sin(a), 12)}" fill="${P}" fill-opacity=".55"/>`; }
      const scale = `<line x1="600" y1="250" x2="600" y2="520" stroke="${P}" stroke-width="3"/><path d="M520 530h160" stroke="${P}" stroke-width="3" stroke-linecap="round"/><circle cx="600" cy="244" r="8" stroke="${P}" stroke-width="3"/>
        <g class="a-sway"><line x1="440" y1="262" x2="760" y2="262" stroke="${P}" stroke-width="3" stroke-linecap="round"/>
          <path d="M440 262L400 380M440 262L480 380M760 262L720 380M760 262L800 380" stroke="${P}" stroke-opacity=".6"/>
          <path d="M390 380a50 22 0 0 0 100 0z" stroke="${P}" stroke-width="2.5" fill="${H}" fill-opacity=".08"/><path d="M710 380a50 22 0 0 0 100 0z" stroke="${P}" stroke-width="2.5" fill="${H}" fill-opacity=".08"/></g>`;
      return wrap('art-rules', `<g class="a-spin" style="--o:600px 350px">${ring}</g><circle cx="600" cy="350" r="250" stroke="${P}" stroke-opacity=".18" stroke-dasharray="2 9"/>${scale}`);
    },

    /* 03 · a model at work: a neural network with signals flowing from input to output */
    classify() {
      const L = [[200, 4], [450, 6], [750, 6], [1000, 3]].map(([x, c]) => Array.from({ length: c }, (_, i) => [x, 350 + (i - (c - 1) / 2) * 95]));
      let s = '';
      for (let l = 0; l < 3; l++) L[l].forEach(a => L[l + 1].forEach(b => { s += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${P}" stroke-opacity=".16"/>`; }));
      for (let k = 0; k < 12; k++) {
        const p = [L[0][k % 4], L[1][(k * 5) % 6], L[2][(k * 7 + 1) % 6], L[3][k % 3]];
        s += `<circle r="4" fill="${H}"><animateMotion dur="3.6s" begin="${k * .45}s" repeatCount="indefinite" path="M${p.map(q => q.join(' ')).join('L')}"/></circle>`;
      }
      L.forEach((layer, li) => layer.forEach(([x, y], i) => { s += `<circle cx="${x}" cy="${y}" r="${li === 3 ? 11 : 7}" fill="#1a0918" stroke="${P}" stroke-width="2"/>${li === 3 ? `<circle cx="${x}" cy="${y}" r="12" stroke="${H}" class="a-pulse" style="--dl:${i * .7}s"/>` : ''}`; }));
      return wrap('art-classify', s);
    },

    /* 04 · oversight of the whole estate: a radar sweep picking up systems */
    product() {
      let s = '<defs><linearGradient id="sw" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ff3e9a" stop-opacity="0"/><stop offset="1" stop-color="#ff3e9a" stop-opacity=".55"/></linearGradient></defs>';
      [90, 180, 270, 360].forEach(r => { s += `<circle cx="600" cy="380" r="${r}" stroke="${P}" stroke-opacity=".3"/>`; });
      s += `<path d="M240 380H960M600 20V740" stroke="${P}" stroke-opacity=".18"/>`;
      s += `<g class="a-spin" style="--o:600px 380px;--t:7s"><path d="M600 380L960 380A360 360 0 0 0 911.8 200Z" fill="url(#sw)"/></g>`;
      [[700, 260], [480, 300], [820, 470], [430, 520], [660, 600], [930, 330], [300, 400]].forEach(([x, y], i) => { s += `<circle cx="${x}" cy="${y}" r="6" fill="${H}" class="a-blink" style="--dl:${i * .9}s"/>`; });
      return wrap('art-product', s, '0 0 1200 760');
    },

    /* 05 · records: documents drifting upwards and filing themselves */
    evidence() {
      let s = '';
      [[90, 22, 0, -8], [260, 28, 6, 6], [420, 19, 2, -4], [760, 25, 9, 8], [930, 21, 4, -6], [1080, 30, 12, 5], [600, 26, 15, -3]].forEach(([x, t, dl, rot], i) => {
        s += `<g class="a-float" style="--t:${t}s;--dl:-${dl}s"><g transform="translate(${x} 780) rotate(${rot})"><rect x="-38" y="-50" width="76" height="100" rx="8" stroke="${P}" stroke-width="1.6" fill="#1a0918" fill-opacity=".4"/>
          <path d="M-24 -30h48M-24 -16h48M-24 -2h34M-24 12h48" stroke="${P}" stroke-opacity=".6"/><path d="M8 28l7 7 13-14" stroke="${H}" stroke-width="2.2" stroke-linecap="round" class="a-draw" style="--dl:${i * .5}s"/></g></g>`;
      });
      return wrap('art-evidence', s);
    },

    /* 06 · without governance: tangled, restless lines */
    chaos() {
      const paths = ['M40 120C220 20 260 300 420 160S600 40 700 260', 'M60 420C180 260 380 520 460 340S640 220 720 420', 'M20 300C160 360 200 120 360 240S520 440 690 120', 'M120 640C260 480 300 700 480 560S600 420 710 600', 'M0 520C140 600 220 380 330 480S520 640 640 500', 'M200 40C260 200 120 260 240 380S380 600 300 700'];
      return wrap('art-chaos', paths.map((d, i) => `<path d="${d}" stroke="#ff4060" stroke-width="1.6" stroke-opacity=".7" class="a-dash" style="--t:${5 + i}s"/>`).join(''), '0 0 720 700');
    },

    /* 06 · with Tessera: calm, ordered lines and a rising sun */
    order() {
      let s = '';
      for (let i = 0; i < 9; i++) s += `<path d="M0 ${110 + i * 60}H720" stroke="#2a0a22" stroke-opacity=".14"/>`;
      s += `<g class="a-spin" style="--o:540px 700px;--t:60s">${Array.from({ length: 18 }, (_, i) => `<path d="M540 700L${540 + 900 * Math.cos(i / 18 * Math.PI * 2)} ${700 + 900 * Math.sin(i / 18 * Math.PI * 2)}" stroke="#fff" stroke-opacity=".18" stroke-width="10"/>`).join('')}</g>`;
      s += `<circle cx="540" cy="700" r="150" fill="#fff" fill-opacity=".22"/><circle cx="540" cy="700" r="150" stroke="#fff" stroke-opacity=".5" class="a-pulse" style="--dl:0s"/>`;
      return wrap('art-order', s, '0 0 720 700');
    },

    /* small animated emblems for the benefit tiles */
    icon(kind) {
      const svg = inner => `<svg viewBox="0 0 320 140" preserveAspectRatio="xMidYMid meet" fill="none">${inner}</svg>`;
      if (kind === 'eye') return svg(`<path d="M80 70C120 22 200 22 240 70 200 118 120 118 80 70Z" stroke="${P}" stroke-width="2.5"/><g class="a-look"><circle cx="160" cy="70" r="22" stroke="${P}" stroke-width="2.5"/><circle cx="160" cy="70" r="9" fill="${H}"/></g><line x1="70" y1="40" x2="250" y2="40" stroke="${H}" stroke-opacity=".7" class="a-scan"/>`);
      if (kind === 'check') return svg([0, 1, 2].map(i => `<rect x="96" y="${28 + i * 30}" width="20" height="20" rx="5" stroke="${P}" stroke-width="2"/><path d="M101 ${38 + i * 30}l5 5 9-10" stroke="${H}" stroke-width="2.6" stroke-linecap="round" class="a-draw" style="--dl:${i * .6}s"/><path d="M128 ${38 + i * 30}h${96 - i * 18}" stroke="${P}" stroke-opacity=".5" stroke-width="5" stroke-linecap="round"/>`).join(''));
      if (kind === 'chain') return svg(`<path d="M70 70H250" stroke="${P}" stroke-opacity=".5" stroke-width="2"/>${[70, 160, 250].map((x, i) => `<circle cx="${x}" cy="70" r="16" fill="#1a0918" stroke="${P}" stroke-width="2.5"/><circle cx="${x}" cy="70" r="17" stroke="${H}" class="a-pulse" style="--dl:${i * .8}s"/>`).join('')}<circle r="5" fill="${H}"><animateMotion dur="2.4s" repeatCount="indefinite" path="M70 70H250"/></circle>`);
      return svg(`<path d="M160 22l52 18v32c0 30-22 48-52 56-30-8-52-26-52-56V40z" stroke="${P}" stroke-width="2.5" fill="${H}" fill-opacity=".08"/><path d="M140 72l14 14 28-30" stroke="${H}" stroke-width="3" stroke-linecap="round"/><circle cx="160" cy="72" r="40" stroke="${P}" class="a-pulse" style="--dl:0s"/>`);
    }
  };
})(window.T);
