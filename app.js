/* =========================================================
   Atelier — interactivity (runs on every page)
   Lenis + GSAP reveals + cursor + magnetic + theme + lang + tweaks
   Depends on shell.js (must load FIRST)
   ========================================================= */
(function(){
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer = matchMedia('(pointer:fine)').matches;
  const isMobile = window.innerWidth < 768;
  const isTablet = window.innerWidth < 1024;

  /* ---------- Tech tile fill (stack page only) ---------- */
  document.querySelectorAll('.tech-tile').forEach((el) => {
    const cat = el.dataset.cat, name = el.dataset.name;
    el.className += ' aspect-[1.4/1] p-6 border-r border-b hairline flex flex-col justify-between hover:bg-white/[0.03] transition cursor-pointer';
    el.innerHTML = `
      <div class="font-mono text-[10px] text-muted tracking-widest">${cat}</div>
      <div>
        <div class="font-display text-[22px] leading-[1.05]" style="letter-spacing:-0.04em">${name}</div>
        <div class="font-mono text-[10px] text-muted mt-1.5">→</div>
      </div>`;
  });

  /* ---------- Lenis smooth scroll (desktop only) ---------- */
  let lenis = null;
  if (!reduceMotion && !isMobile && window.Lenis) {
    lenis = new Lenis({ duration: 1.1, smoothWheel: true, lerp: 0.1 });
    if (window.ScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(0);
    }
  }

  /* ---------- GSAP reveals ---------- */
  if (window.gsap) {
    if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

    if (!reduceMotion) {
      const reveals  = gsap.utils.toArray('.will-reveal');
      const revealsX = gsap.utils.toArray('.will-reveal-x');

      if (isMobile) {
        /* Mobile: lighter animation, no stagger delay */
        reveals.forEach((el) => {
          gsap.fromTo(el,
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: 0.55, ease: 'expo.out',
              immediateRender: false, overwrite: 'auto',
              scrollTrigger: { trigger: el, start: 'top 96%', once: true } });
        });
        revealsX.forEach((el) => {
          gsap.fromTo(el,
            { opacity: 0, x: -14 },
            { opacity: 1, x: 0, duration: 0.55, ease: 'expo.out',
              immediateRender: false, overwrite: 'auto',
              scrollTrigger: { trigger: el, start: 'top 96%', once: true } });
        });
      } else {
        /* Desktop: full stagger */
        reveals.forEach((el, i) => {
          gsap.fromTo(el,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.9, delay: Math.min(i * 0.04, 0.3),
              ease: 'expo.out', immediateRender: false, overwrite: 'auto',
              scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
        });
        revealsX.forEach((el) => {
          gsap.fromTo(el,
            { opacity: 0, x: -24 },
            { opacity: 1, x: 0, duration: 0.9, ease: 'expo.out',
              immediateRender: false, overwrite: 'auto',
              scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
        });

        /* Blob parallax — desktop only */
        if (document.querySelector('.blob-stage')) {
          gsap.to('.blob-stage', {
            yPercent: 18, ease: 'none',
            scrollTrigger: { trigger: 'main', start: 'top top', end: '+=900', scrub: true }
          });
        }
      }

      /* Single deduped ScrollTrigger.refresh */
      if (window.ScrollTrigger) {
        let refreshed = false;
        const doRefresh = () => {
          if (refreshed) return;
          refreshed = true;
          ScrollTrigger.refresh();
        };
        window.addEventListener('load', doRefresh, { once: true });
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(doRefresh);
      }

      /* Fallback: force-show any still-hidden elements after 1.5s */
      setTimeout(() => {
        document.querySelectorAll('.will-reveal,.will-reveal-x').forEach(el => {
          if (getComputedStyle(el).opacity === '0') {
            el.style.opacity = 1;
            el.style.transform = 'none';
          }
        });
      }, 1500);

    } else {
      /* Reduced motion: show everything immediately */
      document.querySelectorAll('.will-reveal,.will-reveal-x').forEach(el => {
        el.style.opacity = 1; el.style.transform = 'none';
      });
    }
  } else {
    document.querySelectorAll('.will-reveal,.will-reveal-x').forEach(el => {
      el.style.opacity = 1; el.style.transform = 'none';
    });
  }

  /* ---------- Custom cursor + magnetic (desktop/fine-pointer only) ---------- */
  const dot  = document.getElementById('curDot');
  const ring = document.getElementById('curRing');

  if (isFinePointer && dot && ring) {
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;
    let cursorOn = true;
    let tabVisible = true;

    window.addEventListener('pointermove', (e) => {
      mx = e.clientX; my = e.clientY;
      if (cursorOn) dot.style.transform = `translate3d(${mx}px,${my}px,0)`;
    }, { passive: true });

    document.addEventListener('visibilitychange', () => {
      tabVisible = !document.hidden;
    });

    (function tick() {
      if (tabVisible && cursorOn) {
        rx += (mx - rx) * 0.18;
        ry += (my - ry) * 0.18;
        ring.style.transform = `translate3d(${rx}px,${ry}px,0)`;
      }
      requestAnimationFrame(tick);
    })();

    /* Delegated cursor hot state — one listener instead of N */
    const HOT_SELECTOR = 'a, button, [data-magnetic], summary, input, textarea, label';
    document.addEventListener('pointerenter', (e) => {
      if (cursorOn && e.target.closest(HOT_SELECTOR)) ring.classList.add('hot');
    }, { passive: true, capture: true });
    document.addEventListener('pointerleave', (e) => {
      if (e.target.closest(HOT_SELECTOR)) ring.classList.remove('hot');
    }, { passive: true, capture: true });

    /* Magnetic buttons */
    if (!reduceMotion) {
      document.querySelectorAll('[data-magnetic]').forEach(el => {
        const strength = 18;
        el.addEventListener('pointermove', (e) => {
          const r = el.getBoundingClientRect();
          const dx = (e.clientX - r.left - r.width  / 2) / r.width;
          const dy = (e.clientY - r.top  - r.height / 2) / r.height;
          el.style.transform = `translate3d(${dx * strength}px,${dy * strength}px,0)`;
        }, { passive: true });
        el.addEventListener('pointerleave', () => { el.style.transform = ''; });
      });
    }

    function setCursor(on) {
      cursorOn = on;
      document.documentElement.style.cursor = on ? 'none' : '';
      dot.style.display  = on ? '' : 'none';
      ring.style.display = on ? '' : 'none';
      savePref('cursor', on ? 'on' : 'off');
    }
    setCursor(true);

    /* Tweaks cursor buttons */
    document.querySelectorAll('[data-cur]').forEach(b => {
      b.addEventListener('click', () => setCursor(b.dataset.cur === 'on'));
    });

  } else {
    /* Touch / coarse-pointer: hide cursor elements */
    if (dot)  { dot.style.display  = 'none'; }
    if (ring) { ring.style.display = 'none'; }
  }

  /* ---------- Prefs persistence ---------- */
  function savePref(k, v) {
    try {
      const p = JSON.parse(localStorage.getItem('atelier_prefs') || '{}');
      p[k] = v;
      localStorage.setItem('atelier_prefs', JSON.stringify(p));
    } catch(e) {}
  }

  /* ---------- Theme ---------- */
  function setTheme(t) {
    const html = document.documentElement;
    if (t === 'light') { html.classList.add('light');  html.classList.remove('dark'); }
    else               { html.classList.add('dark');   html.classList.remove('light'); }
    const meta = document.querySelector('meta[name=theme-color]');
    if (meta) meta.setAttribute('content', t === 'light' ? '#f6f4ef' : '#0a0a0a');
    savePref('theme', t);
  }
  const themeBtn = document.getElementById('themeBtn');
  if (themeBtn) themeBtn.addEventListener('click', () => {
    setTheme(document.documentElement.classList.contains('light') ? 'dark' : 'light');
  });

  /* ---------- Language ---------- */
  function applyI18n(lang) {
    const dict = window.__i18n && window.__i18n[lang];
    if (!dict) return;
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const k = el.dataset.i18n;
      if (dict[k] !== undefined) el.textContent = dict[k];
    });
    savePref('lang', lang);
    currentLang = lang;
    /* Sync overlay lang buttons */
    document.querySelectorAll('[data-ol-lang]').forEach(b =>
      b.classList.toggle('active', b.dataset.olLang === lang));
  }
  window.__applyI18n = applyI18n;

  let currentLang = document.documentElement.lang || 'tr';
  try {
    const saved = JSON.parse(localStorage.getItem('atelier_prefs') || '{}');
    if (saved.lang) applyI18n(saved.lang);
  } catch(e) {}

  const langBtn = document.getElementById('langBtn');
  if (langBtn) langBtn.addEventListener('click', () => {
    applyI18n(currentLang === 'tr' ? 'en' : 'tr');
  });

  /* ---------- Accent ---------- */
  function setAccent(a, a2) {
    document.documentElement.style.setProperty('--accent',   a);
    document.documentElement.style.setProperty('--accent-2', a2);
    savePref('accent',  a);
    savePref('accent2', a2);
  }
  document.querySelectorAll('#accentSwatches .swatch').forEach(s => {
    s.addEventListener('click', () => {
      document.querySelectorAll('#accentSwatches .swatch').forEach(x => x.classList.remove('active'));
      s.classList.add('active');
      setAccent(s.dataset.a, s.dataset.a2);
    });
  });

  /* ---------- Tweaks panel ---------- */
  const twPanel = document.getElementById('twPanel');
  window.addEventListener('message', (e) => {
    if (!e.data || !e.data.type) return;
    if (e.data.type === '__activate_edit_mode'   && twPanel) twPanel.classList.add('open');
    if (e.data.type === '__deactivate_edit_mode' && twPanel) twPanel.classList.remove('open');
  });
  try { window.parent.postMessage({ type: '__edit_mode_available' }, '*'); } catch(e) {}

  const twClose = document.getElementById('twClose');
  if (twClose) twClose.addEventListener('click', () => {
    if (twPanel) twPanel.classList.remove('open');
    try { window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*'); } catch(e) {}
  });

  if (twPanel) {
    twPanel.querySelectorAll('[data-theme]').forEach(b => b.addEventListener('click', () => setTheme(b.dataset.theme)));
    twPanel.querySelectorAll('[data-lang]').forEach(b => b.addEventListener('click', () => {
      currentLang = b.dataset.lang; applyI18n(currentLang);
    }));
    const gs = document.getElementById('grainSlider');
    if (gs) gs.addEventListener('input', (e) => {
      document.documentElement.style.setProperty('--grain', e.target.value);
      savePref('grain', e.target.value);
    });
  }
})();
