/* Shared shell — injects nav, footer, tweaks panel, custom cursor, light/dark, lang, gsap reveals.
   Each page sets <body data-page="..." data-next="..." data-next-label="..."> */

(function(){
  const PAGES = [
    { id: 'home',         href: 'index.html',       label_tr: 'Ana sayfa',  label_en: 'Home' },
    { id: 'about',        href: 'hakkimda.html',    label_tr: 'Hakkımda',   label_en: 'About' },
    { id: 'stack',        href: 'yigin.html',       label_tr: 'Yığın',      label_en: 'Stack' },
    { id: 'services',     href: 'hizmetler.html',   label_tr: 'Hizmetler',  label_en: 'Services' },
    { id: 'work',         href: 'isler.html',       label_tr: 'İşler',      label_en: 'Work' },
    { id: 'process',      href: 'surec.html',       label_tr: 'Süreç',      label_en: 'Process' },
    { id: 'testimonials', href: 'yorumlar.html',    label_tr: 'Yorumlar',   label_en: 'Words' },
    { id: 'pricing',      href: 'paketler.html',    label_tr: 'Paketler',   label_en: 'Pricing' },
    { id: 'faq',          href: 'sss.html',         label_tr: 'SSS',        label_en: 'FAQ' },
    { id: 'contact',      href: 'iletisim.html',    label_tr: 'İletişim',   label_en: 'Contact' },
  ];
  window.__PAGES = PAGES;
  const body = document.body;
  const currentId = body.dataset.page || 'home';
  /* ---------- NAV ---------- */
  const navItems = PAGES.filter(p => p.id !== 'home').map(p => `
    <li><a href="${p.href}" class="nav-link${p.id === currentId ? ' active' : ''}" data-page-link="${p.id}" data-i18n="nav.${p.id}">${p.label_tr}</a></li>
  `).join('');

  const nav = `
    <header class="fixed top-0 inset-x-0 z-50">
      <div class="mx-auto max-w-[1440px] px-6 lg:px-10 pt-5">
        <nav class="glass rounded-full flex items-center justify-between pl-5 pr-2 py-2">
          <a href="index.html" class="flex items-center gap-2 font-display text-[17px]" style="letter-spacing:-0.035em">
<img src="apple-touch-icon.png" alt="QDR" loading="eager" decoding="async" class="w-8 h-8 rounded-full object-cover object-center shrink-0" />            <span data-i18n="brand">QDR Studio</span>
            <span class="font-mono text-[10px] text-muted ml-1.5 hidden md:inline">/ FREELANCE STUDIO</span>
          </a>
          <ul class="hidden lg:flex items-center gap-6 text-[13px]">${navItems}</ul>
          <div class="flex items-center gap-2">
            <button id="navMobile" class="lg:hidden w-9 h-9 rounded-full border hairline-strong flex items-center justify-center" aria-label="Menü">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
            </button>
            <button id="langBtn" class="font-mono text-[11px] px-2.5 py-1 rounded-full border hairline-strong tracking-wider hidden sm:block">TR / EN</button>
            <button id="themeBtn" class="w-9 h-9 rounded-full border hairline-strong flex items-center justify-center" aria-label="Tema">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>
            </button>
            <a href="iletisim.html" class="btn btn-primary py-2.5 px-4 text-[12.5px]" data-i18n="nav.cta">Proje Konuş →</a>
          </div>
        </nav>
        <div id="mobileMenu" class="lg:hidden mt-2 glass rounded-2xl p-4" style="display:none">
          <ul class="grid grid-cols-2 gap-3 text-[14px]">${navItems}</ul>
          <div class="mt-4 pt-3 border-t hairline flex items-center gap-2">
            <button id="langBtnMobile" class="font-mono text-[11px] px-3 py-1.5 rounded-full border hairline-strong tracking-wider">TR / EN</button>
          </div>
        </div>
      </div>
    </header>`;

  /* ---------- PRE-FOOTER NEXT CARD ---------- */
  const nextId = body.dataset.next;
  let nextCard = '';
  if (nextId){
    const np = PAGES.find(p => p.id === nextId);
    if (np){
      nextCard = `
        <div class="mx-auto max-w-[1440px] px-6 lg:px-10 pb-24">
          <a href="${np.href}" class="next-card group" data-magnetic>
            <div>
              <div class="font-mono text-[11px] text-muted mb-2" data-i18n="next.eyebrow">SONRAKİ →</div>
              <div class="font-display text-4xl lg:text-5xl" style="letter-spacing:-0.04em" data-i18n="next.${np.id}">${np.label_tr}</div>
            </div>
            <div class="w-14 h-14 rounded-full bg-[var(--accent)] text-[var(--bg)] flex items-center justify-center text-2xl shrink-0">→</div>
          </a>
        </div>`;
    }
  }

  /* ---------- FOOTER ---------- */
  const footerLinks = PAGES.filter(p => p.id !== 'home').slice(0,5).map(p => `
    <li><a href="${p.href}" data-i18n="nav.${p.id}">${p.label_tr}</a></li>`).join('');
  const footerLinks2 = PAGES.filter(p => p.id !== 'home').slice(5).map(p => `
    <li><a href="${p.href}" data-i18n="nav.${p.id}">${p.label_tr}</a></li>`).join('');

  const footer = `
    <footer class="site-footer">
      <div class="mx-auto max-w-[1440px] px-6 lg:px-10 py-14 grid grid-cols-12 gap-8">
        <div class="col-span-12 md:col-span-4">
          <div class="flex items-center gap-2.5 font-display text-xl" style="letter-spacing:-0.035em">
            <span class="w-2.5 h-2.5 rounded-full" style="background:var(--accent)"></span>
            <span>QDR Studio</span>
          </div>
          <p class="text-muted text-[14px] mt-4 max-w-[36ch]" data-i18n="ftr.about">Bağımsız bir geliştirici stüdyosu. Ankara'dan dünyaya. 2024'den beri.</p>
        </div>
        <div class="col-span-6 md:col-span-2">
          <div class="font-mono text-[10px] text-muted tracking-widest mb-4">SITE</div>
          <ul class="space-y-2 text-[13.5px]">${footerLinks}</ul>
        </div>
        <div class="col-span-6 md:col-span-2">
          <div class="font-mono text-[10px] text-muted tracking-widest mb-4">MORE</div>
          <ul class="space-y-2 text-[13.5px]">${footerLinks2}</ul>
        </div>
        <div class="col-span-6 md:col-span-2">
          <div class="font-mono text-[10px] text-muted tracking-widest mb-4">SOCIAL</div>
          <ul class="space-y-2 text-[13.5px]">
            <li><a href="https://github.com/ShahMuhammad656" target="_blank" rel="noopener">GitHub →</a></li>
          </ul>
        </div>
        <div class="col-span-12 md:col-span-2">
          <div class="font-mono text-[10px] text-muted tracking-widest mb-4">NEWSLETTER</div>
          <p class="text-[13px] text-muted" data-i18n="ftr.news">Üç haftada bir, üç paragraf.</p>
          <form class="mt-4 flex items-center border-b hairline-strong" onsubmit="event.preventDefault(); this.querySelector('input').value='Eklendi ✓';">
            <input class="bg-transparent flex-1 py-2 text-[13px] outline-none" placeholder="e-posta" />
            <button class="text-[12px] font-mono accent">JOIN →</button>
          </form>
        </div>
      </div>
      <div class="border-t hairline">
        <div class="mx-auto max-w-[1440px] px-6 lg:px-10 py-6 flex flex-wrap items-center justify-between gap-4 text-[11px] font-mono text-muted">
          <span>© 2026 QDR Studio · ALL RIGHTS RESERVED</span>
          <span><a href="design-system.html" class="hover:text-[var(--fg)]">DESIGN SYSTEM ↗</a> · <a href="structure.md" class="hover:text-[var(--fg)]">STACK ↗</a></span>
          <span data-i18n="ftr.craft">crafted in Ankara · ☕︎ × ∞</span>
        </div>
      </div>
    </footer>`;

  /* ---------- TWEAKS PANEL ---------- */
  const tweaks = `
    <aside class="tw-panel" id="twPanel" aria-label="Tweaks">
      <div class="flex items-center justify-between mb-4">
        <span class="font-mono text-[11px] tracking-widest">TWEAKS</span>
        <button id="twClose" class="font-mono text-[11px]">✕</button>
      </div>
      <div class="space-y-4">
        <div>
          <div class="font-mono text-[10px] text-muted mb-2">ACCENT</div>
          <div class="flex gap-2" id="accentSwatches">
            <div class="swatch active" data-a="#D4B254" data-a2="#9D5BFF" style="background:linear-gradient(135deg,#D4B254 50%,#9D5BFF 50%)"></div>
            <div class="swatch" data-a="#D4B254" data-a2="#D4B254" style="background:#D4B254"></div>
            <div class="swatch" data-a="#9D5BFF" data-a2="#9D5BFF" style="background:#9D5BFF"></div>
            <div class="swatch" data-a="#00E5C5" data-a2="#00E5C5" style="background:#00E5C5"></div>
            <div class="swatch" data-a="#FF5C2E" data-a2="#FF5C2E" style="background:#FF5C2E"></div>
          </div>
        </div>
        <div>
          <div class="font-mono text-[10px] text-muted mb-2">THEME</div>
          <div class="flex gap-2">
            <button class="px-3 py-1 rounded-full border hairline-strong text-[11px]" data-theme="dark">Dark</button>
            <button class="px-3 py-1 rounded-full border hairline-strong text-[11px]" data-theme="light">Light</button>
          </div>
        </div>
        <div>
          <div class="font-mono text-[10px] text-muted mb-2">GRAIN</div>
          <input id="grainSlider" type="range" min="0" max="0.18" step="0.01" value="0.06" class="w-full"/>
        </div>
        <div>
          <div class="font-mono text-[10px] text-muted mb-2">CURSOR</div>
          <div class="flex gap-2">
            <button class="px-3 py-1 rounded-full border hairline-strong text-[11px]" data-cur="on">Custom</button>
            <button class="px-3 py-1 rounded-full border hairline-strong text-[11px]" data-cur="off">System</button>
          </div>
        </div>
        <div>
          <div class="font-mono text-[10px] text-muted mb-2">LANGUAGE</div>
          <div class="flex gap-2">
            <button class="px-3 py-1 rounded-full border hairline-strong text-[11px]" data-lang="tr">Türkçe</button>
            <button class="px-3 py-1 rounded-full border hairline-strong text-[11px]" data-lang="en">English</button>
          </div>
        </div>
      </div>
    </aside>`;

  /* ---------- INJECT ---------- */
  document.body.insertAdjacentHTML('afterbegin', `
    <div class="cur-ring" id="curRing"></div>
    <div class="cur-dot" id="curDot"></div>
    ${nav}
  `);
  // Append next-card just before footer + footer + tweaks at the end of body
  document.body.insertAdjacentHTML('beforeend', nextCard + footer + tweaks);

  /* ---------- Persist accent/lang/theme across pages ---------- */
  try {
    const saved = JSON.parse(localStorage.getItem('atelier_prefs') || '{}');
    if (saved.theme === 'light') document.documentElement.classList.add('light');
    if (saved.theme === 'light') document.documentElement.classList.remove('dark');
    if (saved.accent) document.documentElement.style.setProperty('--accent', saved.accent);
    if (saved.accent2) document.documentElement.style.setProperty('--accent-2', saved.accent2);
    if (saved.grain !== undefined) document.documentElement.style.setProperty('--grain', saved.grain);
    if (saved.lang) document.documentElement.lang = saved.lang;
  } catch(e){}

  /* ---------- Mobile menu toggle ---------- */
  const mb = document.getElementById('navMobile');
  if (mb){
    mb.addEventListener('click', ()=>{
      const m = document.getElementById('mobileMenu');
      m.style.display = m.style.display === 'none' ? 'block' : 'none';
    });
  }

  /* ---------- Mobile lang button (mirrors desktop langBtn) ---------- */
  const langBtnMobile = document.getElementById('langBtnMobile');
  if (langBtnMobile){
    langBtnMobile.addEventListener('click', ()=>{
      document.getElementById('langBtn') && document.getElementById('langBtn').click();
    });
  }
})();

