# Heramba Jewellery

Online catalogue for Heramba Jewellery, a fashion jewellery shop. Customers browse pieces and order on WhatsApp (UPI or cash on delivery).

Built with Next.js 15 and Tailwind CSS 4. All pages are pre-rendered at build time.

## Run locally

```bash
npm install
cp .env.example .env.local   # then fill in the WhatsApp number
npm run dev                  # http://localhost:3000
```

## Where things live

| What | File |
| --- | --- |
| Products (name, price, material, stock, photo) | `src/data/products.ts` |
| Product photos | `public/images/` |
| Shop name, tagline, city | `src/config/store.ts` |
| WhatsApp number, site URL, Instagram | environment variables (see `.env.example`) |

## Adding a product

1. Put the photo in `public/images/` (square photos look best).
2. Add an entry to `src/data/products.ts`. The `id` becomes the page URL.
3. Describe materials honestly, e.g. "gold-tone plated alloy", "faux pearl", "cubic zirconia".

## Deploying

The site is a static export: `npm run build` writes plain HTML to `out/`, which any static host can serve.

**Cloudflare Pages** (free, commercial use allowed): connect the GitHub repository, choose the Next.js (Static HTML Export) preset or set build command `npm run build` and output directory `out`, then add these environment variables:

- `NEXT_PUBLIC_WHATSAPP_NUMBER`: country code + number, digits only (e.g. 919876543210)
- `NEXT_PUBLIC_SITE_URL`: the live address, e.g. `https://herambajewellery.in` (no trailing slash)

**Netlify** and most other static hosts work the same way: build command `npm run build`, output folder `out`.

These values are built into the pages, so redeploy after changing them.
