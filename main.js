/* =========================================================
   Camille Reyt-Duglery · interactions
   ========================================================= */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  /* ---------- Intro : une fois par session ---------- */
  let seen = false;
  try { seen = sessionStorage.getItem('crd-intro') === '1'; sessionStorage.setItem('crd-intro', '1'); } catch (e) {}
  setTimeout(() => root.classList.add('is-loaded'), seen || reduced ? 0 : 1500);

  /* ---------- Traits dessinés : longueur de chaque tracé ---------- */
  const measure = () => $$('.draw path, .mark path').forEach(p => {
    try { p.style.setProperty('--len', Math.ceil(p.getTotalLength()) + 2); } catch (e) {}
  });
  measure();

  /* ---------- Apparitions ---------- */
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
  }), { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach(el => io.observe(el));

  /* ---------- Défilement : progression, nav, rail du parcours ---------- */
  const bar = $('.progress span');
  const nav = $('.nav');
  const rail = $('.story__rail span');
  const story = $('#parcours');
  const links = $$('.nav__links a');
  const targets = links.map(a => $(a.getAttribute('href')));
  let ticking = false;
  const onScroll = () => {
    const y = scrollY, h = root.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${h > 0 ? y / h : 0})`;
    nav.classList.toggle('is-scrolled', y > 20);
    if (rail && story) {
      const r = story.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight * 0.6 - r.top) / r.height));
      rail.style.setProperty('--p', p);
    }
    let current = -1;
    targets.forEach((t, i) => { if (t && t.getBoundingClientRect().top < innerHeight * 0.4) current = i; });
    links.forEach((a, i) => a.classList.toggle('is-current', i === current));
    ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();

  /* ---------- Jour / nuit sur la Maison d'éducation ---------- */
  $$('[data-daynight]').forEach(box => {
    const btn = $('.daynight__toggle', box);
    btn.addEventListener('click', () => {
      const night = box.classList.toggle('is-night');
      btn.setAttribute('aria-pressed', String(night));
    });
  });

  /* ---------- Thème ---------- */
  $('[data-theme-toggle]').addEventListener('click', () => {
    const dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme = dark ? 'light' : 'dark';
    store.set('crd-theme', root.dataset.theme);
  });

  /* ---------- Toast ---------- */
  const toast = $('.toast');
  let toastT;
  const say = msg => {
    toast.textContent = msg; toast.classList.add('is-on');
    clearTimeout(toastT); toastT = setTimeout(() => toast.classList.remove('is-on'), 2200);
  };

  /* ---------- Traductions ---------- */
  const EN = {
    'nav.parcours': 'Journey', 'nav.constat': 'Verification', 'nav.projets': 'Projects', 'nav.competences': 'Skills', 'nav.contact': 'Contact',
    'hero.eyebrow': 'Télécom Saint-Étienne · Bachelor in Physical Measurements',
    'hero.role': 'Future engineer · metrology, optics, materials',
    'hero.lead': 'Second-year student in the dual <strong>CITISE</strong> and <strong>BUT Mesures Physiques</strong> (Bachelor in Physical Measurements) programme, I am training in metrology and instrumentation. Rigorous, curious and creative, I enjoy understanding a phenomenon as much as making it clear to others.',
    'hero.cv': 'Download my CV', 'hero.contact': 'Get in touch', 'hero.alt': 'Portrait of Camille Reyt-Duglery',
    'hero.note': 'available from 12 April 2027',
    'hero.band': 'Looking for an <strong>11-week</strong> internship starting <strong>12 April 2027</strong>',
    'hero.domains': 'Metrology · Physical chemistry · Optics · Materials',
    'fact.1k': 'Highest honours', 'fact.1v': 'Baccalauréat, European section',
    'fact.2k': 'Bilingual English', 'fact.2v': 'Cambridge certification',
    'fact.3k': 'LabVIEW', 'fact.3v': 'Signal acquisition and processing',
    'ribbon': 'Metrology <i>✦</i> Calibration <i>✦</i> Uncertainty <i>✦</i> Instrumentation <i>✦</i> Optics <i>✦</i> Materials <i>✦</i> Physical chemistry <i>✦</i> LabVIEW <i>✦</i>',
    'about.title': 'About',
    'about.text': 'At Télécom Saint-Étienne, I am building skills in systems engineering, data analysis and instrumentation. <span class="mark">Rigorous<svg viewBox="0 0 100 12" preserveAspectRatio="none" aria-hidden="true"><path d="M2 8 C 28 3, 62 11, 98 5"/></svg></span> and <span class="mark">curious<svg viewBox="0 0 100 12" preserveAspectRatio="none" aria-hidden="true"><path d="M2 7 C 30 10, 66 3, 98 7"/></svg></span>, I thrive in demanding technical environments and enjoy <span class="mark">teamwork<svg viewBox="0 0 100 12" preserveAspectRatio="none" aria-hidden="true"><path d="M2 8 C 34 4, 64 10, 98 5"/></svg></span>. My goal: join an innovative industrial sector, contribute to high-value technology projects and keep growing as a future engineer.',
    'story.title': 'Journey',
    'story.alt1': 'The cloister of the Maison d’éducation de la Légion d’honneur, by day',
    'story.alt2': 'The buildings of the Maison d’éducation de la Légion d’honneur, at night',
    'story.alt3': 'The Télécom Saint-Étienne building', 'story.alt4': 'Télécom Saint-Étienne logo',
    'story.day': 'Day', 'story.night': 'Night',
    'story.c1t': 'Maison d’éducation de la Légion d’honneur',
    'story.c1p': 'Three years in a place steeped in history, housed in the buildings of the former royal abbey of Saint-Denis. There I earned the <strong>baccalauréat in the European section with highest honours</strong>, and learned rigour, independence and critical thinking when facing a scientific problem.',
    'story.c1h': 'a place that means a lot to me',
    'story.c2t': 'Télécom Saint-Étienne &amp; IUT de Saint-Étienne',
    'story.c2p': 'I joined <strong>CITISE</strong>, the integrated preparatory programme of Télécom Saint-Étienne, taken alongside the <strong>BUT Mesures Physiques</strong> at the IUT. On the programme: metrology, instrumentation, electronics, data acquisition and processing with LabVIEW, lab work both independently and in teams, and technical reports.',
    'story.c3w': 'April 2027 · your company?',
    'story.c3t': 'The next chapter',
    'story.c3p': 'An <strong>11-week</strong> internship starting <strong>12 April 2027</strong>, in metrology, physical chemistry, optics or materials, in Saint-Étienne, Lyon, the Paris region or Auvergne. I would love to write this chapter with your team.',
    'story.c3h': 'to be continued…',
    'check.title': 'Verification report',
    'check.big': 'Compliant or not? See for yourself.',
    'check.lead': 'During a metrology project at the IUT, I carried out calibrations and verification reports on measuring instruments. Here is the reasoning behind a verification, made interactive: change the values and the verdict updates.',
    'check.kicker': 'Verification report', 'check.instr': 'Instrument',
    'check.p1': 'Caliper', 'check.p2': 'Micrometer', 'check.p3': 'Balance',
    'check.f0': 'Reference standard', 'check.f1': 'Reference value R', 'check.f2': 'Instrument reading I',
    'check.f3': 'Maximum permissible error (MPE) ±', 'check.f4': 'Expanded uncertainty U (k = 2)',
    'check.slider': 'Reading', 'check.gauge': 'Position of the error relative to the MPE',
    'check.r1': 'Error E = I − R', 'check.r2': 'Worst case |E| + U', 'check.r3': 'Best case |E| − U',
    'check.foot': 'Example values. Decision rule that accounts for uncertainty, in the spirit of ISO 14253-1: compliant if |E| + U ≤ MPE, non-compliant if |E| − U &gt; MPE, otherwise no conclusion can be drawn.',
    'proj.title': 'Projects', 'proj.kind': 'Training project',
    'proj.p1d': 'April – June 2026', 'proj.p2d': 'March – June 2026',
    'proj.p1t': 'Calibrations and verification reports',
    'proj.p1p': 'In a metrology lab, calibration of measuring instruments and verification reports: analysis of results, compliance with quality standards and technical reporting.',
    'proj.t1': 'Calibration', 'proj.t2': 'Verification report', 'proj.t3': 'Quality standards', 'proj.t4': 'Technical report',
    'proj.p2t': 'A video game to learn English',
    'proj.p2p': 'Team development of an educational video game: game logic and code structure, game design and user experience, technical problem solving and project management.',
    'proj.t5': 'Programming', 'proj.t6': 'User experience', 'proj.t7': 'Project management',
    'sk.title': 'Skills',
    'sk.c1t': 'Metrology and uncertainty', 'sk.c1p': 'Calibration, verification reports, fundamentals of uncertainty evaluation and of the VIM.',
    'sk.c2t': 'Instrumentation and LabVIEW', 'sk.c2p': 'Comfortable with a wide range of measuring instruments; signal acquisition and processing with LabVIEW.',
    'sk.c3t': 'Electronics', 'sk.c3p': 'Design and analysis of electronic and electrical circuits.',
    'sk.c4t': 'Data analysis', 'sk.c4p': 'Interpreting results, using measurements, checking their consistency and drawing reliable conclusions.',
    'sk.c5t': 'Experimental method', 'sk.c5p': 'Testing, measurement and validation approaches, rigorous protocols, technical reports.',
    'sk.c6t': 'Algorithmic thinking', 'sk.c6p': 'Reading and writing code, structuring a program, automating tasks, processing data.',
    'lg.title': 'Languages',
    'lg.en': 'English', 'lg.enl': 'Bilingual · Cambridge certification',
    'lg.enn': 'Professional written and spoken English, including scientific vocabulary in electricity, electronics, chemistry and physics.',
    'lg.es': 'Spanish', 'lg.esl': 'Written C1 · Spoken B2', 'lg.esn': 'Able to communicate comfortably in a professional setting.',
    'bd.title': 'Beyond the lab',
    'bd.1t': 'Drawing', 'bd.1p': 'My free time often comes with a pencil in hand. Drawing teaches me observation, patience and attention to detail: three qualities that are just as useful in the lab.',
    'bd.2t': 'Theatre', 'bd.2p': 'When I was younger, I did theatre and loved it. It teaches you to speak up, to listen to others and to move forward as a company.',
    'ct.eyebrow': 'Contact', 'ct.title': 'Let’s write what comes <em>next</em>.',
    'ct.lead': '11-week internship starting 12 April 2027 · Saint-Étienne, Lyon, Paris region or Auvergne.',
    'ct.copy': 'Copy address', 'ct.cv': 'CV (PDF)', 'ct.print': 'Printable version', 'ft.top': 'Back to top ↑',
    'br.title': 'What I bring',
    'br.1t': 'Reliable measurements', 'br.1p': 'Calibrations and verification reports carried out in a metrology lab, with the fundamentals of uncertainty evaluation and of the VIM.',
    'br.2t': 'Clear reports', 'br.2p': 'Experimental protocols followed rigorously, and technical reports written to be understood and used.',
    'br.3t': 'Technical English', 'br.3p': 'A bilingual level certified by Cambridge, with scientific vocabulary in electricity, electronics, chemistry and physics.',
    'ps.domains': 'Metrology · Physical chemistry · Optics · Materials — Saint-Étienne, Lyon, Paris region or Auvergne',
    'ps.about': 'Second-year student in the dual CITISE (Télécom Saint-Étienne) and Bachelor in Physical Measurements programme; rigorous, curious and creative. I thrive in demanding technical environments and enjoy teamwork.',
    'ps.edu': 'Education',
    'ps.e1t': 'CITISE (integrated preparatory programme) + BUT Mesures Physiques',
    'ps.e2t': 'Baccalauréat, European section, highest honours',
    'ps.beyond': 'Drawing, theatre',
    'ps.qr': 'The interactive website',
    _title: 'Camille Reyt-Duglery · Metrology',
    _desc: 'Camille Reyt-Duglery, student in the dual CITISE (Télécom Saint-Étienne) and Bachelor in Physical Measurements programme. Looking for an 11-week internship in metrology, physical chemistry, optics or materials from 12 April 2027.',
    _copied: 'Address copied', _aria: 'Change theme'
  };
  const FR = {
    _title: document.title, _desc: $('meta[name="description"]').content,
    _copied: 'Adresse copiée', _aria: 'Changer de thème'
  };
  $$('[data-i18n]').forEach(el => { FR[el.dataset.i18n] = el.innerHTML; });
  $$('[data-i18n-alt]').forEach(el => { FR[el.dataset.i18nAlt] = el.alt; });
  $$('[data-i18n-aria]').forEach(el => { FR[el.dataset.i18nAria] = el.getAttribute('aria-label'); });

  let lang = 'fr';
  const t = k => (lang === 'en' ? EN : FR)[k] ?? FR[k] ?? k;
  const setLang = l => {
    lang = l;
    root.lang = l;
    $$('[data-i18n]').forEach(el => { el.innerHTML = t(el.dataset.i18n); });
    $$('[data-i18n-alt]').forEach(el => { el.alt = t(el.dataset.i18nAlt); });
    $$('[data-i18n-aria]').forEach(el => el.setAttribute('aria-label', t(el.dataset.i18nAria)));
    $('[data-theme-toggle]').setAttribute('aria-label', t('_aria'));
    document.title = t('_title');
    $('meta[name="description"]').content = t('_desc');
    $$('[data-lang]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === l)));
    store.set('crd-lang', l);
    measure();
    check && check.render(false);
  };

  /* ---------- Copier l'adresse ---------- */
  $$('[data-copy]').forEach(b => b.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(b.dataset.copy); say(t('_copied')); }
    catch (e) { location.href = 'mailto:' + b.dataset.copy; }
  }));

  /* ---------- Constat de vérification ---------- */
  const PRESETS = {
    caliper:    { std: { fr: 'Cale étalon de 50 mm', en: '50 mm gauge block' }, unit: 'mm', ref: 50, ind: 50.01, emt: 0.03, u: 0.01, step: 0.01, dec: 3 },
    micrometer: { std: { fr: 'Cale étalon de 25 mm', en: '25 mm gauge block' }, unit: 'mm', ref: 25, ind: 25.003, emt: 0.004, u: 0.0015, step: 0.0005, dec: 4 },
    balance:    { std: { fr: 'Masse étalon de 200 g', en: '200 g standard mass' }, unit: 'g', ref: 200, ind: 200.03, emt: 0.02, u: 0.005, step: 0.005, dec: 3 }
  };
  const VERDICT = {
    fr: {
      ok: ['Conforme', 'La pire erreur possible, |E| + U, reste dans l’EMT : l’instrument est déclaré conforme.'],
      ko: ['Non conforme', 'Même dans le meilleur cas, |E| − U dépasse l’EMT : l’instrument est déclaré non conforme.'],
      doubt: ['Indéterminé', 'L’intervalle E ± U chevauche la limite de l’EMT : impossible de conclure sans réduire l’incertitude.'],
      none: ['—', 'Saisissez des valeurs valides (EMT et U positives).']
    },
    en: {
      ok: ['Compliant', 'The worst possible error, |E| + U, stays within the MPE: the instrument is declared compliant.'],
      ko: ['Non-compliant', 'Even in the best case, |E| − U exceeds the MPE: the instrument is declared non-compliant.'],
      doubt: ['Inconclusive', 'The interval E ± U straddles the MPE limit: no conclusion is possible without reducing the uncertainty.'],
      none: ['—', 'Enter valid values (positive MPE and U).']
    }
  };

  const check = (() => {
    const box = $('[data-check]');
    if (!box) return null;
    const inp = k => $(`[data-in="${k}"]`, box);
    const out = k => $$(`[data-out="${k}"]`, box);
    const g = k => $(`[data-g="${k}"]`, box);
    const [iRef, iInd, iSlider, iEmt, iU] = ['ref', 'ind', 'slider', 'emt', 'u'].map(inp);
    let preset = PRESETS.caliper, presetKey = 'caliper', lastState = '';

    const fmt = (v, signed) => new Intl.NumberFormat(lang === 'en' ? 'en-GB' : 'fr-FR', {
      minimumFractionDigits: preset.dec, maximumFractionDigits: preset.dec, signDisplay: signed ? 'exceptZero' : 'auto'
    }).format(v) + ' ' + preset.unit;
    const round = v => Number(v.toFixed(preset.dec + 3));

    const syncSlider = () => {
      const ref = iRef.valueAsNumber, emt = Math.abs(iEmt.valueAsNumber) || preset.emt;
      if (!isFinite(ref)) return;
      iSlider.min = round(ref - 2.5 * emt); iSlider.max = round(ref + 2.5 * emt);
      iSlider.step = preset.step;
      iSlider.value = iInd.value;
    };

    const load = key => {
      presetKey = key; preset = PRESETS[key];
      iRef.value = preset.ref; iInd.value = preset.ind; iEmt.value = preset.emt; iU.value = preset.u;
      [iRef, iInd, iEmt, iU].forEach(i => { i.step = preset.step; });
      $$('[data-preset]', box).forEach(b => b.setAttribute('aria-checked', String(b.dataset.preset === key)));
      syncSlider();
      render(true);
    };

    const X = 200, HALF = 180;
    const render = animate => {
      out('unit').forEach(el => { el.textContent = preset.unit; });
      out('standard').forEach(el => { el.textContent = preset.std[lang]; });
      const ref = iRef.valueAsNumber, ind = iInd.valueAsNumber, emt = iEmt.valueAsNumber, u = iU.valueAsNumber;
      const valid = [ref, ind, emt, u].every(isFinite) && emt > 0 && u >= 0;
      let state = 'none';
      if (valid) {
        const e = round(ind - ref), worst = round(Math.abs(e) + u), best = round(Math.abs(e) - u);
        const eps = Math.pow(10, -(preset.dec + 2));
        state = worst <= emt + eps ? 'ok' : best > emt + eps ? 'ko' : 'doubt';
        out('e')[0].textContent = fmt(e, true);
        out('worst')[0].textContent = fmt(worst);
        out('best')[0].textContent = fmt(Math.max(0, best));
        out('emt')[0].textContent = '± ' + fmt(emt);

        // Jauge : échelle symétrique qui contient toujours l'EMT et E ± U
        const span = Math.max(emt * 1.6, (Math.abs(e) + u) * 1.15);
        const px = v => X + (v / span) * HALF;
        const L = px(-emt), R = px(emt), w = Math.max(0, Math.min(u, emt) / span * HALF);
        g('ok').setAttribute('x', L); g('ok').setAttribute('width', R - L);
        g('gl').setAttribute('x', L); g('gl').setAttribute('width', w);
        g('gr').setAttribute('x', R - w); g('gr').setAttribute('width', w);
        ['ll', 'tl'].forEach(k => g(k).setAttribute(k === 'll' ? 'x1' : 'x', L));
        g('ll').setAttribute('x2', L);
        ['lr', 'tr'].forEach(k => g(k).setAttribute(k === 'lr' ? 'x1' : 'x', R));
        g('lr').setAttribute('x2', R);
        g('tl').textContent = lang === 'en' ? '−MPE' : '−EMT';
        g('tr').textContent = lang === 'en' ? '+MPE' : '+EMT';
        const bu = u / span * HALF;
        g('bar').setAttribute('x1', -bu); g('bar').setAttribute('x2', bu);
        g('capl').setAttribute('x1', -bu); g('capl').setAttribute('x2', -bu);
        g('capr').setAttribute('x1', bu); g('capr').setAttribute('x2', bu);
        g('marker').style.transform = `translateX(${px(e)}px)`;
      } else {
        ['e', 'worst', 'best', 'emt'].forEach(k => { out(k)[0].textContent = '—'; });
      }
      const [stamp, why] = VERDICT[lang][state];
      const v = out('verdict')[0], s = out('stamp')[0];
      v.dataset.state = state;
      s.textContent = stamp;
      out('why')[0].textContent = why;
      if (animate && state !== lastState && !reduced) {
        s.classList.remove('is-stamped'); void s.offsetWidth; s.classList.add('is-stamped');
      }
      lastState = state;
    };

    $$('[data-preset]', box).forEach(b => b.addEventListener('click', () => load(b.dataset.preset)));
    iSlider.addEventListener('input', () => { iInd.value = round(iSlider.valueAsNumber); render(true); });
    iInd.addEventListener('input', () => { iSlider.value = iInd.value; render(true); });
    [iRef, iEmt].forEach(i => i.addEventListener('input', () => { syncSlider(); render(true); }));
    iU.addEventListener('input', () => render(true));

    // Flèches gauche/droite sur les boutons d'instrument (groupe radio)
    $('.presets', box).addEventListener('keydown', ev => {
      if (!['ArrowLeft', 'ArrowRight'].includes(ev.key)) return;
      const keys = Object.keys(PRESETS), i = keys.indexOf(presetKey);
      const next = keys[(i + (ev.key === 'ArrowRight' ? 1 : keys.length - 1)) % keys.length];
      load(next); $(`[data-preset="${next}"]`, box).focus(); ev.preventDefault();
    });

    load('caliper');
    return { render };
  })();

  /* ---------- Version imprimable ---------- */
  $$('[data-print]').forEach(b => b.addEventListener('click', () => print()));

  $$('[data-lang]').forEach(b => b.addEventListener('click', () => setLang(b.dataset.lang)));
  const saved = store.get('crd-lang') || ((navigator.language || '').startsWith('fr') ? 'fr' : null);
  if (saved === 'en') setLang('en');
})();
