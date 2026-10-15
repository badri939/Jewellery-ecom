// Store-wide settings. Change these values instead of editing page code.
// The WhatsApp number is read from an environment variable so it can be set
// in Vercel (Project → Settings → Environment Variables) without a code change.

export const store = {
  name: 'Heramba Jewellery',
  tagline: 'Handpicked fashion jewellery for every occasion',
  // Country code + number, digits only, e.g. 919876543210
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '',
  city: 'Bengaluru',
  instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? '',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
};
