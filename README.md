# Gowri Aabharana

Online catalogue for Gowri Aabharana fashion jewellery. Customers browse pieces and order on WhatsApp (UPI or cash on delivery).

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

## Deploying on Vercel

Import the GitHub repository in Vercel, then set `NEXT_PUBLIC_WHATSAPP_NUMBER` and `NEXT_PUBLIC_SITE_URL` under Project → Settings → Environment Variables and redeploy. These values are built into the pages, so a redeploy is needed after changing them.
