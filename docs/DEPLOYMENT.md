# Deployment

The site deploys to **Vercel** from this repository. Every push to `main` builds and deploys to production; every other branch or pull request gets a preview URL.

## One-time Vercel setup

1. In Vercel, **Add New → Project** and import `praveen1743/mokshai-site`. If the repository isn't listed, give the Vercel GitHub app access to it when prompted.
2. Vercel reads `vercel.json`: framework Astro, build command `npm run build`, output `dist`. Leave the defaults.
3. Under **Settings → Environment Variables**, add:
   - `PUBLIC_FORM_ENDPOINT`: the URL your form service gives you (required before launch)
   - `PUBLIC_BOOKING_URL`: your scheduling link (optional)
   Set them for Production and Preview, then redeploy.
4. Node version: 20 or 22 (Project → Settings → General).

Preview and `*.vercel.app` URLs send `X-Robots-Tag: noindex`, so they never compete with mokshai.net in search.

## Choosing a form backend

The booking form POSTs JSON with these fields: `name`, `email`, `company`, `phone`, `team`, `size`, `workflow`, `calculator` (optional), `page`.

| Option | Notes |
| --- | --- |
| Formspree / Web3Forms / Basin | Fastest: create a form, paste its endpoint into `PUBLIC_FORM_ENDPOINT` |
| HubSpot Forms API | Leads go straight into the CRM. Map fields in HubSpot |
| Your own API route | Add `@astrojs/vercel` and an `src/pages/api/lead.ts` endpoint (for example to send to email + CRM and draft a follow-up) |

Test by submitting the form on the preview URL and confirming the lead arrives.

## Domain cut-over from the old WordPress site

**Do not delete WordPress until step 7 passes.** Export a full backup (files + database) first and keep it.

1. Deploy to Vercel and click through every page on the production `*.vercel.app` URL.
2. Confirm the facts and commitments listed in the README.
3. Connect the form backend and test a submission.
4. In Vercel → Project → **Domains**, add `mokshai.net` and `www.mokshai.net` (set `www` to redirect to the apex).
5. **Sucuri:** the old site sits behind Sucuri's firewall. Either point Sucuri's origin at Vercel, or remove Sucuri and update DNS directly to the records Vercel shows (an `A` record for the apex and a `CNAME` for `www`).
6. Wait for DNS to propagate and for Vercel to issue the TLS certificate.
7. Verify:
   - `https://mokshai.net/` loads the new site over HTTPS
   - `/about-us/`, `/contact-us/` and `/blog/` return **301** to `/about/`, `/book/`, `/insights/`
   - both original article URLs load
   - a booking-form submission arrives
   - Google tag fires (Tag Assistant) and `generate_lead` is recorded
8. Submit the sitemap in Google Search Console and Bing Webmaster Tools.
9. In Google Ads, map the `generate_lead` event to a conversion action.

Email is unaffected: the site uses `info@mokshtech.net`, which lives on another domain.

## Other hosts

The repository also contains equivalents for other hosts, kept in sync with `vercel.json`:

- `public/.htaccess`: Apache, cPanel, GoDaddy (upload the contents of `dist/`)
- `public/_redirects`, `public/_headers`: Netlify and Cloudflare Pages

## Rolling back

In Vercel → Deployments, open any earlier production deployment and choose **Promote to Production** (or **Instant Rollback**).

## Quality checks before shipping a change

```bash
npm test
npm run build
```

Then, for changed pages: check 390 px and 1440 px widths for horizontal scroll, and run Lighthouse and axe on any page whose layout changed. Targets: Lighthouse mobile ≥ 90 performance, 100 accessibility; CLS 0; zero serious axe issues.
