# Dike Industries website

A one-page site built with Next.js and exported as plain static files. It uses the brand tokens, fonts and logos from `../brand/`.

## Run it

```sh
cd site
npm install
npm run dev        # http://localhost:3000
npm run build      # writes the finished site to out/
npm run typecheck
```

## Change the words

All copy lives in `content/site.ts`: the hero, every section, the roadmap and the contact details. Edit that file and the page updates.

Before going live:

- Replace `contact.email` (currently `hello@dike.example`, a placeholder).
- Add the X and LinkedIn profile links. Empty ones stay hidden.
- Set `NEXT_PUBLIC_SITE_URL` to the live domain, such as `https://dikeindustries.com`, so link previews on X, LinkedIn and WhatsApp show the right image.

## Deploy

**Vercel (recommended):** import the GitHub repo, set **Root Directory** to `site`, keep the Next.js defaults, and add `NEXT_PUBLIC_SITE_URL` under Environment Variables.

**Any static host** (Netlify, Cloudflare Pages, GitHub Pages): run `npm run build` and upload the `out/` folder.

## What's where

| Path | What |
|---|---|
| `app/layout.tsx` | Fonts, page title, link preview image, icons |
| `app/globals.css` | Brand colors, type and buttons |
| `app/page.tsx` | The order of the sections |
| `components/Hero.tsx` | The opening screen |
| `components/Convergence.tsx` | The hero animation: fragments flying into the shield. Plays once, and shows the finished picture straight away for visitors who turn off motion |
| `components/Sections.tsx` | Problem, approach, process, what we build, principles, roadmap, the name, contact, footer |
| `public/` | Favicon, app icons, logo files and the link preview image, copied from `../brand/` |
