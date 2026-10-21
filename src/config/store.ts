// Default store-wide settings. When STRAPI_URL is set, the shop name, tagline, city,
// WhatsApp number, Instagram URL and hero image come from "Store settings" in Strapi
// (see src/lib/strapi.ts); these values are used for any field left empty there.
// The WhatsApp number and Instagram URL defaults are read from environment variables
// so they can be set in the hosting dashboard without a code change.
// They are built into the pages, so redeploy after changing them.

export type StoreSettings = {
  name: string;
  tagline: string;
  whatsappNumber: string; // country code + number, digits only, e.g. 919876543210
  city: string;
  instagramUrl: string;
  heroImage: string;
  siteUrl: string;
};

export const store: StoreSettings = {
  name: 'Heramba Jewellery',
  tagline: 'Handpicked fashion jewellery for every occasion',
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '',
  city: 'Bengaluru',
  instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? '',
  heroImage: '/images/hero.jpg',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
};
