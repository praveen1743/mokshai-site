# Brief: Moksh AI hero robot (Spline)

For the designer building the homepage hero scene. The site code is ready: when the two files below are dropped into `public/3d/` and set in `src/site.config.ts` (`heroSpline`), the homepage switches from the current three.js hero to this scene.

## What it is for

The homepage headline is "AI agents for any business, checked by a human". The robot is the Moksh agent: capable, calm, on your side. It turns to look at the visitor's cursor, which is the moment that makes the page feel alive. It must be **ours**, not a stock or community robot, and it must not look like the 21st.dev / Spline demo robot that many AI sites already use.

## Look

- **Character:** a friendly service robot, head and upper body (head to waist). Rounded, product-design forms (think premium consumer hardware), not a menacing humanoid, not a toy. No weapons, no faces with human skin, no gender or ethnic caricature.
- **Materials:** deep navy body, satin finish, close to `#0B2236`. Glossy accents in the logo colours: blue `#2583DB`, teal `#16A3B0`, green `#1FA92F` (gradient in that order, like the logo).
- **Brand mark:** a hexagonal chest badge carrying the Moksh "M" mark (vector supplied: `public/logo.svg`, `public/favicon.svg`). The hexagon is the brand shape; use it once, on the chest.
- **Eyes / visor:** soft teal glow. Avoid red.
- **"Checked by a human" (optional, if it reads clearly):** a small amber light (`#F2B45C`) on the shoulder or wrist that pulses gently, the colour the site uses for "a person approves".
- **Lighting:** dark studio. Blue rim light from the left, green rim light from the right, soft key from the front-top. No white floor, no visible ground plane.
- **Background:** transparent (alpha 0), or exactly `#061423`. The page supplies its own background glow.

## Motion and interaction

- **Look at cursor:** head (and eyes, if separate) follow the mouse using a Look At or Follow event. The site turns on global events, so it follows the cursor anywhere on the page, not only over the canvas. Limit head rotation to about ±35° horizontally and ±20° vertically, with easing, so it never snaps or looks over its shoulder.
- **Idle:** a slow breathing / hover loop (2–4 s) so it is alive when the mouse is still.
- **Hover on the robot (optional):** a small acknowledgement, such as the chest badge brightening or a slight nod. No click events, no scroll events, no game controls, no sound.

## Framing

- Canvas is **square (1:1)** on desktop. The robot, head to waist, fills about 70% of the height with clear space above the head. Nothing is cropped at the edges, including the hands.
- Phones show a still image in a **4:3** box scaled to fit, so keep the figure centred.
- Camera fixed (no orbit, no zoom, no pan for the visitor).

## Technical budget (hard limits)

| Item | Limit |
| --- | --- |
| `.splinecode` file | **≤ 1 MB** (the stock demo robot is 1.3 MB) |
| Textures | ≤ 1024 px, only where a material needs one |
| Features | No physics, no particles, no video textures, no HTML frames, no 3D text, no external assets |
| Watermark | **None.** Export from a Spline plan that removes the "Built with Spline" watermark. The site already carries a small "Made with Spline" credit link |

## Deliverables

1. `moksh-robot.splinecode`: **Export → Code**, download the file (we host it ourselves; do not send a `prod.spline.design` link).
2. `moksh-robot-poster.webp`: 1200 × 1200, same camera and lighting, robot looking slightly to the left (towards the headline), transparent or `#061423` background. Also send the PNG.
3. The editable Spline file, shared with or transferred to the Moksh team account.
4. Written confirmation that Moksh Infotech Pvt Ltd may use the scene commercially on mokshai.net and in marketing, and that it uses no third-party or community assets.

## How we will check it

On the production build, at 1440 px and 390 px:

- The scene loads after the headline, follows the cursor across the whole page, and pauses when scrolled out of view.
- No watermark, no console errors, no security-policy violations.
- File within budget; the homepage still passes our accessibility scan with no layout shift.
- Phones, reduced-motion and data-saver visitors see the poster.
