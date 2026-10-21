# Heramba Jewellery

Online catalogue for Heramba Jewellery, a fashion jewellery shop. Customers browse pieces and order on WhatsApp (UPI or cash on delivery).

Built with Next.js 15 and Tailwind CSS 4. All pages are pre-rendered at build time from the products and store settings in the Strapi backend (`heramba-backend`).

## Run locally

```bash
npm install
cp .env.local.example .env.local   # then fill in the values (see below)
npm run dev                        # http://localhost:3000
```

### Connecting to Strapi

Set these two in `.env.local`:

- `STRAPI_URL`: the backend address, e.g. `https://heramba-backend.onrender.com` (no trailing slash, no `/api`)
- `STRAPI_TOKEN`: a **read-only** API token from Strapi admin → Settings → API Tokens

Leave `STRAPI_URL` empty to work without the backend: the site then uses the sample products in `src/data/products.ts` and the defaults in `src/config/store.ts`.

These two are server-only. They are read during the build and never sent to the browser, so never give them a `NEXT_PUBLIC_` prefix. `.env.local` is git-ignored; never commit it.

When `STRAPI_URL` is set, the build waits for the backend to wake up (Render's free plan can take about a minute) and retries 3 times. If Strapi still can't be reached, or has no published product with a photo and a price, the build fails on purpose, so an empty or broken shop is never published.

## Where things live

| What | File |
| --- | --- |
| Products (name, price, material, stock, photos) | Strapi admin → Content Manager → Product |
| Shop name, tagline, city, WhatsApp, Instagram, hero photo | Strapi admin → Store settings |
| Strapi loading, image sizes | `src/lib/strapi.ts` |
| Sample data used without Strapi | `src/data/products.ts`, `src/config/store.ts` |
| Fallback WhatsApp number, Instagram, site URL | environment variables (see `.env.local.example`) |

## Adding a product

1. In Strapi admin, create a Product with at least one photo (square photos look best), a price and a category, then **Publish** it. The `slug` becomes the page URL.
2. Describe materials honestly, e.g. "gold-tone plated alloy", "faux pearl", "cubic zirconia".
3. Redeploy the site (the catalogue is built into the pages).

Featured products are listed first, then by `sortOrder`.

## Deploying

The site is a static export: `npm run build` writes plain HTML to `out/`, which any static host can serve.

**Cloudflare Pages** (free, commercial use allowed): connect the GitHub repository, choose the Next.js (Static HTML Export) preset or set build command `npm run build` and output directory `out`, then add these under **Workers & Pages → your project → Settings → Build → Variables and secrets**:

- `STRAPI_URL` (type: Text): the backend address, e.g. `https://heramba-backend.onrender.com`
- `STRAPI_TOKEN` (type: **Secret**): the read-only Strapi API token
- `NEXT_PUBLIC_SITE_URL`: the live address, e.g. `https://herambajewellery.in` (no trailing slash)
- `NEXT_PUBLIC_WHATSAPP_NUMBER` (optional): used only if Store settings has no WhatsApp number

**Netlify** and most other static hosts work the same way: build command `npm run build`, output folder `out`.

Products, store settings and these values are built into the pages, so redeploy after changing any of them.
