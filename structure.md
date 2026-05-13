# Atelier — Production File Structure (Next.js 14 / App Router)

> Hi-fi HTML prototip elinde. Production tarafına geçtiğinde bu yapıyı bir referans olarak kullanabilirsin. Kod örnekleri prototipteki tasarım sistemine 1:1 eşleşir.

```
.
├── app/
│   ├── (marketing)/
│   │   ├── layout.tsx              # nav, footer, Lenis provider
│   │   ├── page.tsx                # Home (hero + sections)
│   │   ├── work/
│   │   │   ├── page.tsx            # case study index
│   │   │   └── [slug]/page.tsx     # case study detail
│   │   ├── pricing/page.tsx
│   │   └── about/page.tsx
│   ├── api/
│   │   ├── contact/route.ts        # Resend → hi@…
│   │   └── newsletter/route.ts
│   ├── opengraph-image.tsx         # dinamik OG
│   ├── robots.ts
│   ├── sitemap.ts
│   ├── manifest.ts
│   ├── globals.css                 # @layer base + tokens
│   ├── layout.tsx                  # <html lang> + i18n provider
│   └── not-found.tsx
│
├── components/
│   ├── primitives/                 # shadcn/ui (button, input, dialog, accordion, …)
│   ├── motion/
│   │   ├── Reveal.tsx              # IntersectionObserver + framer-motion
│   │   ├── Magnetic.tsx            # data-magnetic hover
│   │   ├── Marquee.tsx
│   │   ├── SmoothScroll.tsx        # Lenis provider
│   │   └── Cursor.tsx              # custom cursor (dot + ring)
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── TrustedBy.tsx
│   │   ├── About.tsx
│   │   ├── Stack.tsx
│   │   ├── Services.tsx
│   │   ├── Work.tsx                # case list
│   │   ├── CaseStudy.tsx           # detail (problem/solution/result)
│   │   ├── Process.tsx
│   │   ├── Testimonials.tsx
│   │   ├── Pricing.tsx
│   │   ├── Faq.tsx
│   │   ├── Contact.tsx
│   │   └── Footer.tsx
│   ├── three/                      # R3F / Spline
│   │   ├── HeroScene.tsx           # dynamic import, ssr: false
│   │   └── LowEndFallback.tsx
│   └── nav/
│       ├── Header.tsx
│       ├── LangToggle.tsx
│       └── ThemeToggle.tsx
│
├── lib/
│   ├── i18n/
│   │   ├── config.ts               # ['tr','en']
│   │   ├── dictionaries/
│   │   │   ├── tr.json
│   │   │   └── en.json
│   │   └── getDictionary.ts
│   ├── seo.ts                      # generateMetadata helper
│   ├── analytics.ts                # plausible / vercel insights
│   ├── resend.ts
│   ├── schema.ts                   # JSON-LD builders (Person, Service, FAQ)
│   ├── cn.ts                       # clsx + tailwind-merge
│   ├── viewport.ts                 # next.js viewport export
│   └── env.ts                      # zod env validation
│
├── hooks/
│   ├── useLenis.ts
│   ├── useMagnetic.ts
│   ├── useReducedMotion.ts
│   ├── useTheme.ts
│   └── useDictionary.ts
│
├── content/                        # MDX case studies & posts
│   ├── case-studies/
│   │   ├── helio-fm.mdx
│   │   ├── sedef-atelier.mdx
│   │   ├── northwind.mdx
│   │   ├── atrium-capital.mdx
│   │   └── oxbow.mdx
│   └── faq.json
│
├── styles/
│   ├── tokens.css                  # CSS variables (see design-system.html)
│   └── fonts.css                   # local font-face (variable Satoshi/Clash)
│
├── public/
│   ├── fonts/                      # self-hosted (no Fontshare CSS req)
│   ├── og/
│   └── icons/
│
├── tailwind.config.ts
├── tsconfig.json
├── next.config.mjs                 # i18n routing, headers (CSP), image domains
├── postcss.config.mjs
├── .env.local                      # RESEND_API_KEY, CAL_URL, NEXT_PUBLIC_*
└── README.md
```

## Önemli notlar

### i18n
- App Router `app/[lang]/...` veya `next-intl` ile. URL'de `/tr` ve `/en` dilleri.
- `<html lang>` dinamik. Dictionary lazy-load.

### Motion / 3D
- Hero 3D sahnesi `dynamic(() => import('...'), { ssr:false })` ile.
- `LowEndFallback`: cihaz `deviceMemory < 4` ya da `prefers-reduced-motion` ise statik blob.
- GSAP yalnızca client. Lenis tek bir `<SmoothScroll>` provider.

### SEO
- `generateMetadata` her sayfada. OG image dinamik (`opengraph-image.tsx`).
- JSON-LD: Person + Service + FAQPage + BreadcrumbList — `lib/schema.ts` üreticileri.
- `sitemap.ts` MDX case study'leri dahil eder.

### A11y
- Skip-to-content link, semantic landmarks, focus-visible token.
- `prefers-reduced-motion`: motion provider'da global guard.
- Form: aria-describedby, error live region, klavye-only test.

### Performance
- `next/font` ile self-host (Fontshare gerek yok).
- Image: AVIF/WebP, `priority` yalnızca LCP varlığında.
- Edge runtime: marketing sayfaları + `/api/contact`.

### CI
- `pnpm typecheck && pnpm lint && pnpm test:e2e` (Playwright).
- Lighthouse-CI: PR'da bütçeli (LCP < 1.5s, CLS < 0.05).

### Komutlar
```bash
pnpm dlx create-next-app@latest atelier --ts --tailwind --eslint --app --src-dir=false
pnpm add framer-motion gsap lenis @studio-freight/lenis @react-three/fiber three @splinetool/react-spline resend zod next-intl
pnpm dlx shadcn@latest init && pnpm dlx shadcn@latest add button input textarea accordion dialog form label radio-group
```

## Tokens → Tailwind config

Prototipteki `tokens.css` ile `tailwind.config.ts` arasındaki bağ:

```ts
// tailwind.config.ts
export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        fg: 'var(--fg)',
        muted: 'var(--muted)',
        accent: 'var(--accent)',
        'accent-2': 'var(--accent-2)',
      },
      fontFamily: {
        display: ['var(--font-clash)', 'system-ui'],
        sans:    ['var(--font-satoshi)', 'system-ui'],
        mono:    ['var(--font-mono)', 'ui-monospace'],
      },
    },
  },
};
```
