/* =========================================================
   Atelier — interactivity (runs on every page)
   Lenis + GSAP reveals + cursor + magnetic + theme + lang + tweaks
   Depends on shell.js (must load FIRST) which injects nav/footer/tweaks panel.
   ========================================================= */
(function(){
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Tech tile fill (only on stack page) ---------- */
  document.querySelectorAll('.tech-tile').forEach((el)=>{
    const cat = el.dataset.cat, name = el.dataset.name;
    el.className += ' aspect-[1.4/1] p-6 border-r border-b hairline flex flex-col justify-between hover:bg-white/[0.03] transition cursor-pointer';
    el.innerHTML = `
      <div class="font-mono text-[10px] text-muted tracking-widest">${cat}</div>
      <div>
        <div class="font-display text-[22px] leading-[1.05]" style="letter-spacing:-0.04em">${name}</div>
        <div class="font-mono text-[10px] text-muted mt-1.5">→</div>
      </div>`;
  });

  /* ---------- Lenis smooth scroll ---------- */
  let lenis = null;
  if (!reduceMotion && window.Lenis){
    lenis = new Lenis({ duration: 1.1, smoothWheel: true, lerp: 0.1 });
    if (window.ScrollTrigger){
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time)=>{ lenis.raf(time*1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(t){ lenis.raf(t); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);
    }
  }

  /* ---------- GSAP reveals ---------- */
  if (window.gsap){
    if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

    if (!reduceMotion){
      gsap.utils.toArray('.will-reveal').forEach((el,i)=>{
        gsap.fromTo(el,
          { opacity:0, y:24 },
          { opacity:1, y:0, duration: 0.9, delay: Math.min(i*0.04, 0.4), ease:'expo.out',
            immediateRender:false, overwrite:'auto',
            scrollTrigger:{ trigger: el, start:'top 92%', once:true } });
      });
      gsap.utils.toArray('.will-reveal-x').forEach((el)=>{
        gsap.fromTo(el,
          { opacity:0, x:-24 },
          { opacity:1, x:0, duration:0.9, ease:'expo.out', immediateRender:false, overwrite:'auto',
            scrollTrigger:{ trigger: el, start:'top 92%', once:true } });
      });

      if (document.querySelector('.blob-stage')){
        gsap.to('.blob-stage', { yPercent: 18, ease:'none',
          scrollTrigger: { trigger: 'main', start:'top top', end:'+=900', scrub: true } });
      }

      if (window.ScrollTrigger){
        ScrollTrigger.refresh();
        window.addEventListener('load', ()=> ScrollTrigger.refresh());
        document.fonts && document.fonts.ready && document.fonts.ready.then(()=> ScrollTrigger.refresh());
      }

      setTimeout(()=>{
        document.querySelectorAll('.will-reveal, .will-reveal-x').forEach(el=>{
          if (getComputedStyle(el).opacity === '0'){
            el.style.opacity = 1; el.style.transform = 'none';
          }
        });
      }, 2000);
    } else {
      document.querySelectorAll('.will-reveal,.will-reveal-x').forEach(el=>{
        el.style.opacity=1; el.style.transform='none';
      });
    }
  } else {
    document.querySelectorAll('.will-reveal,.will-reveal-x').forEach(el=>{
      el.style.opacity=1; el.style.transform='none';
    });
  }

  /* ---------- Custom cursor + magnetic ---------- */
  const dot = document.getElementById('curDot');
  const ring = document.getElementById('curRing');
  let mx=window.innerWidth/2, my=window.innerHeight/2, rx=mx, ry=my, cursorOn=true;

  window.addEventListener('pointermove', (e)=>{
    mx=e.clientX; my=e.clientY;
    if (!cursorOn || !dot) return;
    dot.style.transform = `translate3d(${mx}px,${my}px,0)`;
  });
  function tick(){
    rx += (mx-rx)*0.18; ry += (my-ry)*0.18;
    if (cursorOn && ring) ring.style.transform = `translate3d(${rx}px,${ry}px,0)`;
    requestAnimationFrame(tick);
  }
  tick();

  document.querySelectorAll('a, button, [data-magnetic], summary, input, textarea, label').forEach(el=>{
    el.addEventListener('pointerenter', ()=>{ if(cursorOn && ring) ring.classList.add('hot'); });
    el.addEventListener('pointerleave', ()=>{ if(ring) ring.classList.remove('hot'); });
  });

  if (!reduceMotion){
    document.querySelectorAll('[data-magnetic]').forEach(el=>{
      const strength = 18;
      el.addEventListener('pointermove', (e)=>{
        const r = el.getBoundingClientRect();
        const cx=r.left+r.width/2, cy=r.top+r.height/2;
        const dx=(e.clientX-cx)/r.width, dy=(e.clientY-cy)/r.height;
        el.style.transform = `translate3d(${dx*strength}px,${dy*strength}px,0)`;
      });
      el.addEventListener('pointerleave', ()=>{ el.style.transform=''; });
    });
  }

  function setCursor(on){
    cursorOn = on;
    document.documentElement.style.cursor = on ? 'none' : '';
    if (dot) dot.style.display = on ? '' : 'none';
    if (ring) ring.style.display = on ? '' : 'none';
    savePref('cursor', on ? 'on' : 'off');
  }
  setCursor(true);

  /* ---------- Prefs persistence ---------- */
  function savePref(k, v){
    try {
      const p = JSON.parse(localStorage.getItem('atelier_prefs') || '{}');
      p[k] = v;
      localStorage.setItem('atelier_prefs', JSON.stringify(p));
    } catch(e){}
  }

  /* ---------- Theme ---------- */
  function setTheme(t){
    if (t==='light'){ document.documentElement.classList.add('light'); document.documentElement.classList.remove('dark'); }
    else { document.documentElement.classList.add('dark'); document.documentElement.classList.remove('light'); }
    const meta = document.querySelector('meta[name=theme-color]');
    if (meta) meta.setAttribute('content', t==='light' ? '#f6f4ef' : '#0a0a0a');
    savePref('theme', t);
  }
  const themeBtn = document.getElementById('themeBtn');
  if (themeBtn) themeBtn.addEventListener('click', ()=>{
    setTheme(document.documentElement.classList.contains('light') ? 'dark' : 'light');
  });

  /* ---------- Language ---------- */
  function applyI18n(lang){
    const dict = window.__i18n && window.__i18n[lang];
    if (!dict) return;
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const k = el.dataset.i18n;
      if (dict[k] !== undefined) el.textContent = dict[k];
    });
    savePref('lang', lang);
  }
  // initial apply from saved pref
  try {
    const saved = JSON.parse(localStorage.getItem('atelier_prefs') || '{}');
    if (saved.lang) applyI18n(saved.lang);
  } catch(e){}

  let currentLang = document.documentElement.lang || 'tr';
  const langBtn = document.getElementById('langBtn');
  if (langBtn) langBtn.addEventListener('click', ()=>{
    currentLang = currentLang === 'tr' ? 'en' : 'tr';
    applyI18n(currentLang);
  });

  /* ---------- Accent ---------- */
  function setAccent(a, a2){
    document.documentElement.style.setProperty('--accent', a);
    document.documentElement.style.setProperty('--accent-2', a2);
    savePref('accent', a);
    savePref('accent2', a2);
  }
  document.querySelectorAll('#accentSwatches .swatch').forEach(s=>{
    s.addEventListener('click', ()=>{
      document.querySelectorAll('#accentSwatches .swatch').forEach(x=>x.classList.remove('active'));
      s.classList.add('active');
      setAccent(s.dataset.a, s.dataset.a2);
    });
  });

  /* ---------- Tweaks panel protocol ---------- */
  const twPanel = document.getElementById('twPanel');
  window.addEventListener('message', (e)=>{
    if (!e.data || !e.data.type) return;
    if (e.data.type === '__activate_edit_mode' && twPanel){ twPanel.classList.add('open'); }
    if (e.data.type === '__deactivate_edit_mode' && twPanel){ twPanel.classList.remove('open'); }
  });
  try { window.parent.postMessage({ type:'__edit_mode_available' }, '*'); } catch(e){}

  const twClose = document.getElementById('twClose');
  if (twClose) twClose.addEventListener('click', ()=>{
    if (twPanel) twPanel.classList.remove('open');
    try { window.parent.postMessage({ type:'__edit_mode_dismissed' }, '*'); } catch(e){}
  });

  if (twPanel){
    twPanel.querySelectorAll('[data-theme]').forEach(b=>b.addEventListener('click',()=>setTheme(b.dataset.theme)));
    twPanel.querySelectorAll('[data-cur]').forEach(b=>b.addEventListener('click',()=>setCursor(b.dataset.cur==='on')));
    twPanel.querySelectorAll('[data-lang]').forEach(b=>b.addEventListener('click',()=>{ currentLang=b.dataset.lang; applyI18n(currentLang); }));
    const gs = document.getElementById('grainSlider');
    if (gs) gs.addEventListener('input', (e)=>{
      document.documentElement.style.setProperty('--grain', e.target.value);
      savePref('grain', e.target.value);
    });
  }
})();
