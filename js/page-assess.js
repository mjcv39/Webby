/* AI Model Registry & Interactive Risk Assessment */
(function (T) {
  const I = T.icon, st = T.state = T.state || {};
  T.GROUPS = [
    ['HR & workforce', ['h-recruit', 'h-work', 'p-emotion']],
    ['Finance & insurance', ['h-credit', 'h-insure']],
    ['Education & training', ['h-learning']],
    ['Customer engagement', ['l-chatbot', 'l-voice', 'l-emotion', 'm-reco']],
    ['Content & media', ['l-genimage', 'l-deepfake', 'l-textpub', 'p-manip']],
    ['Public services & safety', ['h-benefit', 'h-emergency', 'h-infra', 'h-law', 'h-medical']],
    ['Biometrics & surveillance', ['h-biometric', 'p-scrape', 'p-biocat', 'p-rbi', 'p-social', 'p-vuln']],
    ['Everyday productivity', ['m-write', 'm-summary', 'm-spam', 'm-code', 'm-translate', 'm-forecast']]
  ];
  T.modelSelect = (id, sel) => `<select id="${id}" aria-label="AI model">${T.PROVIDERS.map(p => `<optgroup label="${p.name}">${p.models.map(m => `<option value="${m.id}" ${m.id === sel ? 'selected' : ''}>${m.name}</option>`).join('')}</optgroup>`).join('')}</select>`;
  T.useSelect = (id, sel) => `<select id="${id}" aria-label="Intended use"><option value="">Choose an intended use…</option>${T.GROUPS.map(g => `<optgroup label="${g[0]}">${g[1].map(u => `<option value="${u}" ${u === sel ? 'selected' : ''}>${T.esc(T.useIndex[u].label)}</option>`).join('')}</optgroup>`).join('')}</select>`;

  const guide = {
    prohibited: { ex: ['Manipulative or deceptive techniques that cause harm', 'Exploiting age, disability or socio-economic vulnerabilities', 'Social scoring with unjustified detrimental treatment', 'Emotion recognition in workplaces and schools', 'Untargeted scraping of faces', 'Biometric categorisation of sensitive traits', 'Real-time remote biometric ID in public spaces (law enforcement)'], req: 'Banned since 2 Feb 2025. Cannot be placed on the market or used. Fines up to €35M or 7%.' },
    high: { ex: ['Recruitment and candidate selection', 'Admission to education and assessment', 'Creditworthiness assessment', 'Life and health insurance pricing', 'Access to essential public services', 'Critical-infrastructure safety components', 'Law enforcement, migration and justice'], req: 'Risk management, data governance, technical documentation, record-keeping, human oversight, accuracy and robustness, conformity assessment.' },
    limited: { ex: ['Chatbots and voice agents', 'Synthetic image, audio, video or text generation', 'Deepfakes', 'Emotion recognition outside workplace and education'], req: 'Transparency duties: tell people they are talking to AI, mark synthetic content, disclose deepfakes.' },
    minimal: { ex: ['Spam filters', 'Routine summarisation and translation', 'Writing and coding assistants', 'Demand forecasting'], req: 'No specific AI Act obligations beyond AI literacy, though GDPR, copyright and consumer law still apply. Voluntary codes encouraged.' }
  };

  function registry(filter) {
    const list = T.PROVIDERS.filter(p => filter === 'all' || p.id === filter);
    return list.map(p => p.models.map(m => `<div class="mcard rv in"><div class="mc-top"><span class="mc-logo" style="background:${p.color}">${p.name[0]}</span><div><b>${m.name}</b><small>${p.name}</small></div></div>
      <div class="row"><span class="chip">${m.access}</span></div><p class="small muted">${m.kind}</p>
      <button class="btn btn-ghost-l btn-sm" data-act="pickmodel" data-id="${m.id}">Assess this model ${I('arrow')}</button></div>`).join('')).join('');
  }

  function runAssessment(r, out, onDone) {
    out.innerHTML = `<div class="analyse"><div class="spinner"></div><ul id="an-steps"></ul></div>`;
    const steps = ['Reading intended purpose', 'Checking Article 5 prohibited practices', 'Matching Annex III high-risk areas', 'Checking Article 50 transparency duties', 'Mapping requirements to your role'];
    const ul = T.$('#an-steps', out); let i = 0;
    const tick = () => {
      if (i < steps.length) { ul.insertAdjacentHTML('beforeend', `<li>${I('check')}${steps[i++]}</li>`); setTimeout(tick, 230); }
      else { out.innerHTML = T.resultHTML(r); onDone && onDone(); }
    };
    tick();
  }
  T.runAssessment = runAssessment;

  Object.assign(T.actions, {
    pickmodel: el => { const s = T.$('#a-model'); s.value = el.dataset.id; T.$('#assess-tool').scrollIntoView({ behavior: 'smooth', block: 'center' }); T.toast('Model selected: ' + T.modelIndex[el.dataset.id].name); },
    regf: el => { T.$$('[data-act="regf"]').forEach(b => b.classList.toggle('on', b === el)); T.$('#reg-grid').innerHTML = registry(el.dataset.f); },
    example: el => { T.$('#a-text').value = el.dataset.t; T.$('#a-use').value = ''; },
    runassess: () => {
      const model = T.$('#a-model').value, useId = T.$('#a-use').value, text = T.$('#a-text').value, role = T.$('#a-role').value;
      if (!useId && !text.trim()) { T.toast('Choose an intended use or describe your own first', 'warn'); T.$('#a-use').focus(); return; }
      const r = T.assess({ modelId: model, useId: text.trim() ? '' : useId, text, role });
      st.last = r;
      const out = T.$('#a-out'); out.classList.add('active');
      runAssessment(r, out, () => {
        out.insertAdjacentHTML('beforeend', `<div class="res-actions"><button class="btn btn-primary" data-act="addport">${I('plus')} Add to portfolio</button><button class="btn btn-ghost-l" data-act="dlres">${I('download')} Download summary</button><a class="btn btn-ghost-l" href="#/documents">${I('file')} Recommended documents</a></div>`);
        out.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    },
    addport: el => { if (!st.last) return; T.addToPortfolio(st.last); el.disabled = true; el.innerHTML = I('check') + ' Added'; T.toast('Added to the dashboard portfolio. Open the Dashboard to see it.'); },
    dlres: () => {
      const r = st.last; if (!r) return;
      const txt = `TESSERA — SIMULATED RISK ASSESSMENT (educational demonstration)\n\nSystem: ${r.name}\nProvider: ${r.provider} · ${r.model.name}\nIntended purpose: ${r.purpose}\nSimulated classification: ${T.RISK[r.cls].label} (${r.ref})\n\nWhy: ${r.why}\n\nRequirements:\n${r.reqs.map(q => ` - ${q.title} (${q.art})`).join('\n')}\n\nNext steps:\n${r.next.map((n, i) => ` ${i + 1}. ${n}`).join('\n')}\n\nNot legal advice. Not a formal legal determination or certification.`;
      T.download('tessera-assessment-' + r.id + '.txt', txt, 'text/plain');
    }
  });
  T.download = (name, content, type) => {
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([content], { type })); a.download = name;
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 500);
    T.toast('Downloaded ' + name);
  };

  T.pages.assess = {
    render() {
      const pf = st.prefill || {}; st.prefill = null; st.last = null;
      return `
<section class="phead dk"><div class="wrap"><span class="eyebrow">AI model registry & risk assessment</span><h1>Same model. Different purpose. Different risk.</h1>
<p class="lead">Under the EU AI Act, classification follows the <b>intended purpose</b> of an AI <i>system</i>, not the brand of the underlying model. Try it below.</p></div></section>
<section class="sec tint tight"><div class="wrap">
  <div class="assess" id="assess-tool">
    <div class="card form">
      <h3>1 · Simulated risk assessment</h3>
      <label>AI model or provider${T.modelSelect('a-model', pf.model || 'gpt-5')}</label>
      <label>Intended use ${T.useSelect('a-use', pf.useId)}</label>
      <label>…or describe your own<input id="a-text" type="text" maxlength="160" placeholder="e.g. a tool that ranks job applicants" value="${T.esc(pf.text || '')}"></label>
      <div class="ex">${[['CV screening', 'AI that screens and ranks CVs for hiring'], ['Customer chatbot', 'chatbot for customer support'], ['Meeting summaries', 'summarising meeting notes'], ['Loan decisions', 'credit scoring for loan applicants'], ['Staff mood tracking', 'detect employee emotions at work']].map(e => `<button class="chip btn-chip" data-act="example" data-t="${e[1]}">${e[0]}</button>`).join('')}</div>
      <label>Your role${`<select id="a-role"><option value="both">Provider and deployer</option><option value="provider">Provider (we build or brand the AI system)</option><option value="deployer">Deployer (we use someone else’s system)</option></select>`}</label>
      <button class="btn btn-primary btn-lg block" data-act="runassess">${I('scan')} Run simulated assessment</button>
      <p class="small muted">${I('alert')} Educational simulation, not a formal legal determination.</p>
    </div>
    <div class="card out" id="a-out"><div class="placeholder"><div class="ph-ring">${I('shield')}</div><h3>Your classification appears here</h3><p class="muted">Pick a model and a purpose, then run the assessment. You will get a risk category, an explanation, potentially applicable EU AI Act requirements and next steps.</p></div></div>
  </div>
</div></section>

<section class="sec"><div class="wrap">
  <div class="sec-h"><span class="eyebrow">Classification guide</span><h2>The four outcomes</h2><p class="lead">AI governance covers in-house models and third-party AI alike.</p></div>
  <div data-tabs class="tabs-box">
    <div class="tabs" role="tablist">${['prohibited', 'high', 'limited', 'minimal'].map((k, i) => `<button role="tab" class="tab r-${k} ${i === 1 ? 'on' : ''}" aria-selected="${i === 1}" data-act="tab" data-t="${k}"><i></i>${T.RISK[k].label}</button>`).join('')}</div>
    ${['prohibited', 'high', 'limited', 'minimal'].map((k, i) => `<div data-pane="${k}" ${i === 1 ? '' : 'hidden'} class="tabpane r-${k}"><div class="split"><div><h3>${T.RISK[k].label} <small class="muted">${T.RISK[k].art}</small></h3><p>${guide[k].req}</p>${k === 'prohibited' ? '<p class="callout">Prohibited is <b>not</b> the same as high-risk: high-risk systems are allowed if requirements are met. Prohibited practices are banned.</p>' : ''}</div><div><h4>Examples</h4><div class="chips">${guide[k].ex.map(e => `<span class="chip">${e}</span>`).join('')}</div></div></div></div>`).join('')}
  </div>
</div></section>

<section class="sec tint"><div class="wrap">
  <div class="sec-h"><span class="eyebrow">Model registry</span><h2>Third-party, open-source and in-house AI in one registry</h2><p class="lead">Filter by provider, then send any model to the assessment tool above.</p></div>
  <div class="filters center-f"><button class="fchip on" data-act="regf" data-f="all">All providers</button>${T.PROVIDERS.map(p => `<button class="fchip" data-act="regf" data-f="${p.id}">${p.name}</button>`).join('')}</div>
  <div class="grid g4" id="reg-grid">${registry('all')}</div>
  <div class="callout wide-c"><b>Models vs systems.</b> A general-purpose AI <i>model</i> (such as an LLM) becomes part of an AI <i>system</i> once it is given an interface and a purpose. Model providers have general-purpose model duties (Arts. 53–55). The company that builds or deploys the system has system-level duties based on its use.</div>
</div></section>`;
    },
    init(root) { T.initBars(root); if (st.prefill) { /* noop */ } }
  };
})(window.T);
