/* Tessera — tiny dependency-free SVG chart helpers. */
(function (T) {
  T.donut = (items, o) => {
    o = o || {};
    const total = items.reduce((a, b) => a + b.v, 0) || 1; let acc = 0;
    const arcs = items.map((it, i) => {
      const len = it.v / total * 100, gap = items.length > 1 ? 1.2 : 0;
      const el = `<circle class="arc" data-i="${i}" cx="50" cy="50" r="38" pathLength="100" fill="none" stroke="${it.color}" stroke-width="${o.th || 13}" stroke-dasharray="${Math.max(len - gap, 0)} ${100 - Math.max(len - gap, 0)}" stroke-dashoffset="${-acc}" style="animation-delay:${i * .12}s"><title>${it.label}: ${it.v}</title></circle>`;
      acc += len; return el;
    }).join('');
    return `<div class="donut" style="max-width:${o.size || 220}px"><svg viewBox="0 0 100 100" role="img" aria-label="${o.label || 'Distribution chart'}"><circle cx="50" cy="50" r="38" fill="none" stroke="var(--line)" stroke-width="${o.th || 13}"/><g transform="rotate(-90 50 50)">${arcs}</g></svg>
      <div class="donut-c"><b>${o.big != null ? o.big : total}</b><span>${o.small || 'total'}</span></div></div>`;
  };

  T.gauge = (v, color) => `<div class="gauge"><svg viewBox="0 0 120 70"><path d="M10 62a50 50 0 01100 0" pathLength="100" fill="none" stroke="var(--line)" stroke-width="10" stroke-linecap="round"/><path class="gfill" d="M10 62a50 50 0 01100 0" pathLength="100" fill="none" stroke="${color || 'url(#gg)'}" stroke-width="10" stroke-linecap="round" stroke-dasharray="${v} 100"/><defs><linearGradient id="gg" x1="0" x2="1"><stop offset="0" stop-color="#e06464"/><stop offset=".6" stop-color="#f1745e"/><stop offset="1" stop-color="#edd0ac"/></linearGradient></defs></svg><div class="gauge-c"><b data-count="${v}" data-suf="%">0%</b><span>readiness</span></div></div>`;

  T.ring = (v, size, color) => {
    size = size || 64; color = color || '#3b82f6';
    return `<div class="ring" style="width:${size}px;height:${size}px"><svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--line)" stroke-width="3.5"/><circle class="rfill" cx="18" cy="18" r="15.5" pathLength="100" fill="none" stroke="${color}" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="${v} 100" transform="rotate(-90 18 18)"/></svg><b>${Math.round(v)}%</b></div>`;
  };

  T.line = (vals, labels, o) => {
    o = o || {}; const W = 600, H = o.h || 220, pad = { l: 34, r: 12, t: 14, b: 26 };
    const min = o.min != null ? o.min : Math.floor(Math.min(...vals) / 10) * 10, max = o.max != null ? o.max : Math.ceil(Math.max(...vals) / 10) * 10;
    const x = i => pad.l + i * (W - pad.l - pad.r) / (vals.length - 1), y = v => H - pad.b - (v - min) / (max - min || 1) * (H - pad.t - pad.b);
    const pts = vals.map((v, i) => [x(i), y(v)]);
    const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
    const area = d + ` L${x(vals.length - 1)} ${H - pad.b} L${x(0)} ${H - pad.b}Z`;
    const col = o.color || '#3b82f6', id = 'ar' + Math.random().toString(36).slice(2, 7);
    const grid = [0, 1, 2, 3, 4].map(i => { const v = min + (max - min) * i / 4, yy = y(v); return `<line x1="${pad.l}" x2="${W - pad.r}" y1="${yy}" y2="${yy}" stroke="var(--line)" stroke-dasharray="3 4"/><text x="${pad.l - 8}" y="${yy + 3}" text-anchor="end" class="ax">${Math.round(v)}${o.suf || ''}</text>`; }).join('');
    const step = Math.ceil(vals.length / 8);
    const xl = labels ? labels.map((l, i) => (labels.length - 1 - i) % step === 0 ? `<text x="${x(i)}" y="${H - 6}" text-anchor="middle" class="ax">${l}</text>` : '').join('') : '';
    const dots = pts.map((p, i) => `<g class="pt"><circle cx="${p[0]}" cy="${p[1]}" r="11" fill="transparent"/><circle class="pd" cx="${p[0]}" cy="${p[1]}" r="4" fill="${col}"/><g class="tip"><rect x="${p[0] - 34}" y="${p[1] - 34}" width="68" height="24" rx="6"/><text x="${p[0]}" y="${p[1] - 18}" text-anchor="middle">${labels ? labels[i] + ': ' : ''}${vals[i]}${o.suf || ''}</text></g></g>`).join('');
    return `<svg class="linec" viewBox="0 0 ${W} ${H}" role="img" aria-label="${o.label || 'Trend chart'}"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${col}" stop-opacity=".35"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></linearGradient></defs>${grid}${xl}<path d="${area}" fill="url(#${id})" class="larea"/><path class="lline" d="${d}" fill="none" stroke="${col}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" pathLength="100"/>${dots}</svg>`;
  };

  T.spark = (vals, color) => {
    const W = 100, H = 28, min = Math.min(...vals), max = Math.max(...vals);
    const d = vals.map((v, i) => (i ? 'L' : 'M') + (i * W / (vals.length - 1)).toFixed(1) + ' ' + (H - 3 - (v - min) / (max - min || 1) * (H - 6)).toFixed(1)).join(' ');
    return `<svg class="spark" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><path d="${d}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/></svg>`;
  };

  T.hbars = (items, max, color) => {
    max = max || Math.max(...items.map(i => i.v));
    return `<div class="hbars">${items.map(i => `<div class="hb"><span>${i.k}</span><div class="hb-t"><i data-w="${(i.v / max * 100).toFixed(0)}" style="background:${i.color || color || 'var(--blue)'}"></i></div><b>${i.v}</b></div>`).join('')}</div>`;
  };

  /** Seeded pseudo-random series so charts look realistic but stay stable. */
  T.series = (seed, n, base, vol, spike) => {
    let s = 0; for (const c of seed) s = (s * 31 + c.charCodeAt(0)) >>> 0;
    const rnd = () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
    const out = []; let v = base;
    for (let i = 0; i < n; i++) { v += (rnd() - .5) * vol; out.push(Math.max(0, +v.toFixed(1))); }
    if (spike) { out[n - 3] += spike * .4; out[n - 2] += spike * .7; out[n - 1] += spike; }
    return out;
  };
})(window.T);
