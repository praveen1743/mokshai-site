# Design system

Tokens live at the top of `src/styles/global.css`. Components use tokens only, with no new hex values.

## Principles

1. **Show the work.** Illustrations depict what Moksh AI actually builds (integration maps, queues, permissions), not robots or glowing brains.
2. **The logo is the brand device, used sparingly.** Hexagons do three jobs: icon badges, step numbers and the hub core. The `HexField` background appears only in the homepage hero. Bullets, eyebrow markers, FAQ toggles and slider handles are plain shapes. No grid-line backgrounds.
3. **Colour from the logo, used with intent.** Gradient text appears once on the site (the homepage H1). Gradients otherwise mark primary buttons, the CTA band and small accents. Ambient blue/green lighting appears only in the homepage hero.
4. **Tinted, never plain white.** Sections alternate paper, sky, mint, wash and deep ink.
5. **Readable at rest.** Nothing is hidden waiting for scroll or JavaScript.
6. **Vary the rhythm.** No more than two card grids per page. Use editorial lists, large statements and live components instead of yet another grid of identical cards.

## Theme

The site is **dark by default**: the values in `:root` are the dark palette, so `--ink` is the main text colour, `--paper` the page ground, `--surface` a raised panel and `--ink-deep` the deepest ground (`.dark` sections, calculator output, footer). Long-form reading pages (articles, privacy policy) pass `theme="light"` to `Base.astro`, which puts `.light` on `<body>`; `.light` restores the light palette below, header included. Components keep using the same token names and work in both.

The contrast figures in the table below are for the light palette. On dark, `--blue-700`, `--green-700` and `--teal-700` resolve to the on-dark tints (`#8CC2F7`, `#7FDC8C`, `#5FD0D6`) and `--muted` to `#A3B6C7`, all above 7:1 on `--paper`.

## Colour

| Token | Value | Use | Contrast |
| --- | --- | --- | --- |
| `--blue` | `#2583DB` | Logo blue: decoration, on dark only | 4.6:1 on ink |
| `--green` | `#1FA92F` | Logo green: decoration, on dark only | 5.8:1 on ink |
| `--teal` | `#16A3B0` | Bridge between blue and green | decorative |
| `--blue-700` | `#155BA6` | Links and text accents on light | 6.8:1 on white |
| `--green-700` | `#157F28` | Positive values on light | 5.1:1 on white |
| `--teal-700` | `#0B6B72` | Eyebrows, labels on light | 6.3:1 on white |
| `--ink` | `#061827` | Dark sections, primary text | |
| `--paper` | `#F5F8F6` | Page ground | |
| `--sky` | `#EAF3FC` | Tinted section | muted text 5.8:1 |
| `--mint` | `#EAF6EE` | Tinted section | muted text 5.8:1 |
| `--muted` | `#4F6070` | Secondary text | 6.1:1 on paper |
| `--amber` / `--amber-on-dark` | `#A15C07` / `#F2B45C` | "A person decides" states | 4.8:1 / on dark |

Gradients:

| Token | Use |
| --- | --- |
| `--grad` | Decorative: hexagons, borders, icon badges, slider fill |
| `--grad-deep` | Behind white text: primary buttons, CTA band, selected chips (all stops ≥ 4.8:1 with white) |
| `--grad-text-light` / `--grad-text-dark` | Gradient words on light / dark backgrounds (`.grad-text`) |

## Typography

| Role | Family | Notes |
| --- | --- | --- |
| Display | Archivo (variable, `font-stretch` ~86%) | Headings; condensed, tight tracking |
| Body | IBM Plex Sans 400/500/600 | 17 px base, 1.65 line height, 62–70ch measure |
| Data | IBM Plex Mono 400/500 | Eyebrows, labels, numbers (tabular figures) |

Scale: `--t-xs` 13 · `--t-sm` 15 · `--t-md` 17 · `--t-lg` 20 · `--t-xl` 24–31 · `--t-2xl` 31–46 · `--t-3xl` 40–74 px (fluid with `clamp`).

## Space, shape, depth

- Container 1200 px with a 20 px safe-area-aware gutter.
- Section rhythm: `.section` 64–128 px, `.section-tight` 44–80 px.
- Radius: 10 px cards, 6 px inputs, 18 px scenes and calculators, 24 px CTA band, pill buttons.
- Shadows: `--shadow-1` (resting card), `--shadow-2` (hover/open), `--shadow-glow` (blue/green glow for hero objects).

## Motion

| Pattern | Where | Rule |
| --- | --- | --- |
| Hover lift + gradient border | Cards | 250 ms, `transform` only |
| 3D document flow (WebGL) | Homepage hero only (`Hero3D`) | Lazy-loaded; pauses off screen and in background tabs; one still frame under `prefers-reduced-motion`; static SVG if WebGL is unavailable |
| Gradient shift | Primary buttons | `background-position` |
| Scroll reveal | `.reveal` | CSS scroll-driven animation, movement only, never opacity |
| Ambient | HexField (home hero only), hub pulses, marquee, queue panel | Slow, looping, paused or static with reduced motion |
| Hover trace | Hub nodes | Hovering a node highlights its wire to the core |
| Page transitions | All pages | CSS cross-document view transitions (`@view-transition`), 280 ms; off with reduced motion; unsupported browsers navigate normally |

Hard rule: **CLS stays 0.** No animation may change layout.

## Accessibility rules

- WCAG 2.2 AA contrast for all text (checked by calculation; gradient text uses only stops that pass).
- One `<h1>` per page and a logical heading order.
- Visible 3 px focus ring; white on dark and gradient surfaces.
- Touch targets ≥ 44 px for primary controls.
- Scrollable regions (tables, code) are focusable and labelled.
- Decorative graphics are `aria-hidden`; illustrations carry an `aria-label` describing what they show.
- `prefers-reduced-motion` disables all ambient motion.

## Don'ts

- No stock photos of robots, brains, handshakes or circuit boards.
- No AI-generated photos of people.
- No grid-line backgrounds, purple-to-blue gradients or emoji section markers.
- No gradient text outside the homepage H1, and no corner glows outside the homepage hero (the footer light, below, is the one exception).

### Footer glass

The footer is the only glass surface on the site. The closing CTA sits on flat ink directly above it, and the light pools fade in from the top edge (`mask-image`) so the two join without a seam. Static pools of logo blue, teal and green (`.lights`) sit behind one frosted panel (`.glass`): translucent white fill, `backdrop-filter: blur(22px) saturate(165%)`, a bright top edge and a specular rim drawn with a masked gradient border.

- Glass needs something behind it to bend; over flat ink it would look like a grey box. That is why the light pools exist.
- One panel only. Glass is never stacked or applied to body content.
- Fallbacks: no `backdrop-filter` support gives a solid translucent ink fill; `prefers-reduced-transparency` gives solid `--ink-2` and hides the light; `prefers-contrast: more` gives a solid rim.
- Contrast was measured against the brightest point behind the panel: muted text 4.71:1, links 8.06:1. Re-measure if the light colours or strength change.
- No two-beat contrast headlines ("X. Y.", "X, not Y").
- Never give a decorative element the class `dark` (it paints the ink background).
- Collapsing grid columns use `minmax(0, 1fr)`, never bare `1fr`.
