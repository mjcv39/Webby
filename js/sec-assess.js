/* Risk assessment + model registry section */
(function (T) {
  const I = T.icon, st = T.state;
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
    prohibited: { icon: 'ban', ex: ['Social scoring', 'Workplace emotion recognition', 'Untargeted face scraping', 'Manipulative techniques'], req: 'Banned since 2 Feb 2025' },
    high: { icon: 'alert', ex: ['CV screening', 'Credit scoring', 'Exam & admissions scoring', 'Essential services access'], req: 'Strict requirements + conformity' },
    limited: { icon: 'eye', ex: ['Chatbots', 'Deepfakes', 'AI-generated media', 'Voice agents'], req: 'Transparency duties' },
    minimal: { icon: 'check', ex: ['Spam filters', 'Summarisation', 'Writing assistants', 'Forecasting'], req: 'No specific AI Act duties' }
  };

  T.runAssessment = function (r, out, onDone) {
    out.innerHTML = `<div class="analyse"><div class="spinner"></div><ul id="an-steps"></ul></div>`;
    const steps = ['Reading intended purpose', 'Checking Article 5 prohibitions', 'Matching Annex III high-risk areas', 'Checking Article 50 transparency', 'Mapping duties to your role'];
    const ul = T.$('#an-steps', out); let i = 0;
    const tick = () => {
      if (i < steps.length) { ul.insertAdjacentHTML('beforeend', `<li>${I('check')}${steps[i++]}</li>`); setTimeout(tick, 220); }
      else { out.innerHTML = T.resultHTML(r); onDone && onDone(); }
    };
    tick();
  };
  T.download = (name, content, type) => {
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([content], { type })); a.download = name;
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 500);
    T.toast('Downloaded ' + name);
  };
  T.prefillAssess = useId => {
    const u = T.$('#a-use'); if (!u) return;
    u.value = useId; T.$('#a-text').value = '';
    T.$('#assess-tool').scrollIntoView({ behavior: 'smooth', block: 'center' });
    T.toast('Use case loaded. Press Run to re-assess.');
  };

  Object.assign(T.actions, {
    pickmodel: el => { T.$('#a-model').value = el.dataset.id; T.$('#assess-tool').scrollIntoView({ behavior: 'smooth', block: 'center' }); T.toast('Model selected: ' + T.modelIndex[el.dataset.id].name); },
    example: el => { T.$('#a-text').value = el.dataset.t; T.$('#a-use').value = ''; },
    runassess: () => {
      const model = T.$('#a-model').value, useId = T.$('#a-use').value, text = T.$('#a-text').value, role = T.$('#a-role').value;
      if (!useId && !text.trim()) { T.toast('Choose an intended use or describe your own', 'warn'); T.$('#a-use').focus(); return; }
      const r = T.assess({ modelId: model, useId: text.trim() ? '' : useId, text, role });
      st.last = r;
      const out = T.$('#a-out');
      T.runAssessment(r, out, () => {
        out.insertAdjacentHTML('beforeend', `<div class="res-actions"><button class="btn btn-primary" data-act="addport">${I('plus')} Add to portfolio</button><button class="btn btn-ghost-l" data-act="dlres">${I('download')} Download summary</button></div>`);
      });
    },
    addport: el => { if (!st.last) return; T.addToPortfolio(st.last); el.disabled = true; el.innerHTML = I('check') + ' Added'; T.toast('Added to the dashboard portfolio'); T.refreshDashboard && T.refreshDashboard(); },
    dlres: () => {
      const r = st.last; if (!r) return;
      T.download('tessera-assessment-' + r.id + '.txt', `TESSERA — SIMULATED RISK ASSESSMENT (educational demonstration)\n\nSystem: ${r.name}\nProvider: ${r.provider} · ${r.model.name}\nPurpose: ${r.purpose}\nClassification: ${T.RISK[r.cls].label} (${r.ref})\n\nWhy: ${r.why}\n\nRequirements:\n${r.reqs.map(q => ` - ${q.title} (${q.art})`).join('\n')}\n\nNext steps:\n${r.next.map((n, i) => ` ${i + 1}. ${n}`).join('\n')}\n\nNot legal advice. Not a formal legal determination or certification.`, 'text/plain');
    }
  });

  T.sections.assess = {
    id: 'assess',
    render() {
      return `<section id="assess" class="sec"><div class="wrap">
  <div class="sec-h"><span class="eyebrow rv">03 · Risk assessment</span><h2 class="rv">Same model. Different purpose. Different risk.</h2>
    <ul class="pts rv"><li>Classification follows the <b>intended purpose</b> of an AI system</li><li>Not the brand of the model underneath</li></ul></div>
  <div class="assess" id="assess-tool">
    <div class="card form rv" data-anim="left">
      <h3>Simulated assessment</h3>
      <label>AI model${T.modelSelect('a-model', 'gpt-5')}</label>
      <label>Intended use ${T.useSelect('a-use', '')}</label>
      <label>…or describe it<input id="a-text" type="text" maxlength="160" placeholder="e.g. a tool that ranks job applicants"></label>
      <div class="ex">${[['CV screening', 'AI that screens and ranks CVs for hiring'], ['Chatbot', 'chatbot for customer support'], ['Summaries', 'summarising meeting notes'], ['Loan scoring', 'credit scoring for loan applicants'], ['Mood tracking', 'detect employee emotions at work']].map(e => `<button class="chip btn-chip" data-act="example" data-t="${e[1]}">${e[0]}</button>`).join('')}</div>
      <label>Your role<select id="a-role"><option value="both">Provider and deployer</option><option value="provider">Provider</option><option value="deployer">Deployer</option></select></label>
      <button class="btn btn-primary btn-lg block" data-act="runassess">${I('scan')} Run assessment</button>
      <p class="small muted">${I('alert')} Educational simulation, not a legal determination.</p>
    </div>
    <div class="card out rv" data-anim="right" id="a-out"><div class="placeholder"><div class="ph-ring">${I('shield')}</div><h3>Your classification appears here</h3><ul class="pts"><li>Risk category</li><li>Why it was classified that way</li><li>Applicable EU AI Act requirements</li><li>Recommended next steps</li></ul></div></div>
  </div>

  <div class="sec-h gap-top"><span class="eyebrow rv">Four outcomes</span><h2 class="rv">Where does your AI land?</h2></div>
  <div class="grid g4 outcomes" data-stagger>${['prohibited', 'high', 'limited', 'minimal'].map(k => `<div class="ocard r-${k}"><div class="o-ic">${I(guide[k].icon)}</div><h3>${T.RISK[k].label}</h3><small>${guide[k].req}</small><ul>${guide[k].ex.map(e => `<li>${e}</li>`).join('')}</ul></div>`).join('')}</div>
  <p class="callout wide-c rv"><b>Prohibited ≠ high-risk.</b> High-risk systems are allowed once requirements are met. Prohibited practices are banned.</p>

  <div class="sec-h gap-top"><span class="eyebrow rv">Model registry</span><h2 class="rv">Third-party, open-source and in-house AI</h2><p class="sub rv">Click any model to send it to the assessment tool</p></div>
  <div class="grid g4 preg" data-stagger>${T.PROVIDERS.map(p => `<div class="pcard2"><div class="mc-top"><span class="mc-logo" style="background:${p.color}">${p.name[0]}</span><b>${p.name}</b></div><div class="chips">${p.models.map(m => `<button class="chip btn-chip" data-act="pickmodel" data-id="${m.id}" title="${m.access} · ${m.kind}">${m.name}</button>`).join('')}</div></div>`).join('')}</div>
  <div class="mvs rv"><div><b>AI model</b><small>The trained engine</small></div><span>+</span><div><b>Interface + purpose</b><small>Users, data, use case</small></div><span>=</span><div class="hl"><b>AI system</b><small>This gets risk-classified</small></div></div>
</div></section>`;
    }
  };
})(window.T);
