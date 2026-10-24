// Catalogue data source. At build time this reads products, categories and store
// settings from Strapi (STRAPI_URL + STRAPI_TOKEN). Without STRAPI_URL it falls back
// to the sample data in src/data/products.ts and src/config/store.ts, so the site
// can be developed without the backend.
//
// STRAPI_URL and STRAPI_TOKEN are server-only: they are read here during the build
// and must never get a NEXT_PUBLIC_ prefix or be rendered into a page.

import { store as localStore, type StoreSettings } from '@/config/store';
import { products as localProducts, type Product } from '@/data/products';

const STRAPI_URL = process.env.STRAPI_URL?.replace(/\/+$/, '') ?? '';
const STRAPI_TOKEN = process.env.STRAPI_TOKEN ?? '';

// The backend is on Render's free plan and can take about a minute to wake up.
const REQUEST_TIMEOUT_MS = 90_000;
const RETRIES = 3;
const BACKOFF_MS = [5_000, 15_000, 30_000];
const PAGE_SIZE = 100; // Strapi's default maximum page size

// Cloudinary transformations. Jewellery photos are never cropped: product images are
// padded to the frame's aspect ratio, using the photo's own border colour.
const CARD_IMAGE = 'w_600,c_pad,ar_4:5,b_auto:border,f_auto,q_auto';
const PAGE_IMAGE = 'w_1200,c_pad,ar_3:4,b_auto:border,f_auto,q_auto';
const HERO_IMAGE = 'w_1600,c_limit,f_auto,q_auto';

type StrapiMedia = { url: string };

type StrapiProduct = {
  slug: string;
  code: string;
  name: string;
  description: string | null;
  material: string | null;
  price: number | null;
  stock: number;
  featured: boolean | null;
  sortOrder: number | null;
  category: { name: string } | null;
  images: StrapiMedia[] | null;
};

type StrapiCategory = { name: string; slug: string; sortOrder: number | null };

type StrapiStoreSettings = {
  shopName: string | null;
  tagline: string | null;
  city: string | null;
  whatsappNumber: string | null;
  instagramUrl: string | null;
  heroImage: StrapiMedia | null;
};

type StrapiList<T> = {
  data: T[];
  meta: { pagination: { page: number; pageCount: number; total: number } };
};

class StrapiNotFound extends Error {}

function log(message: string) {
  console.log(`[strapi] ${message}`);
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Fetches one API path with a long timeout and retries, so a sleeping backend has
// time to wake up. Client errors (bad token, wrong path) are not retried.
async function strapiGet<T>(path: string, params: URLSearchParams): Promise<T> {
  const url = `${STRAPI_URL}/api/${path}?${params}`;
  let lastError: unknown;

  for (let attempt = 0; attempt <= RETRIES; attempt++) {
    if (attempt > 0) {
      const wait = BACKOFF_MS[attempt - 1];
      log(`retrying /api/${path} in ${wait / 1000}s (retry ${attempt} of ${RETRIES})`);
      await sleep(wait);
    }
    const started = Date.now();
    log(`GET /api/${path} (attempt ${attempt + 1}, waiting up to ${REQUEST_TIMEOUT_MS / 1000}s)`);
    try {
      const res = await fetch(url, {
        headers: STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {},
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      if (res.status === 404) throw new StrapiNotFound(`/api/${path} returned 404`);
      if (res.status >= 400 && res.status < 500 && res.status !== 408 && res.status !== 429) {
        throw new Error(
          `Strapi rejected /api/${path} with HTTP ${res.status}. Check STRAPI_TOKEN and the API token's permissions.`,
        );
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const body = (await res.json()) as T;
      log(`GET /api/${path} ok in ${((Date.now() - started) / 1000).toFixed(1)}s`);
      return body;
    } catch (error) {
      if (error instanceof StrapiNotFound || (error instanceof Error && error.message.startsWith('Strapi rejected'))) {
        throw error;
      }
      lastError = error;
      log(`GET /api/${path} failed after ${((Date.now() - started) / 1000).toFixed(1)}s: ${describe(error)}`);
    }
  }

  throw new Error(
    `Could not reach Strapi for /api/${path} after ${RETRIES + 1} attempts (last error: ${describe(lastError)}). ` +
      'The build was stopped so a broken shop is not published.',
  );
}

function describe(error: unknown): string {
  if (error instanceof Error) return error.name === 'TimeoutError' ? 'timed out' : error.message;
  return String(error);
}

// Reads every page of a collection, so the catalogue is not cut off at 25 items.
async function strapiGetAll<T>(path: string, params: Record<string, string>): Promise<T[]> {
  const items: T[] = [];
  for (let page = 1; ; page++) {
    const query = new URLSearchParams(params);
    query.set('pagination[page]', String(page));
    query.set('pagination[pageSize]', String(PAGE_SIZE));
    const body = await strapiGet<StrapiList<T>>(path, query);
    items.push(...body.data);
    if (page >= body.meta.pagination.pageCount) return items;
  }
}

// Asks Cloudinary for a transformed copy: `.../upload/<transform>/...`.
// Other image URLs are returned unchanged.
export function cloudinaryUrl(url: string, transform: string): string {
  if (!url.includes('res.cloudinary.com') || !url.includes('/upload/')) return url;
  return url.replace('/upload/', `/upload/${transform}/`);
}

function toProduct(p: StrapiProduct): Product | null {
  const images = (p.images ?? []).map((image) => image.url).filter(Boolean);
  if (images.length === 0 || p.price == null) {
    log(`skipping "${p.name}" (${p.code}): ${images.length === 0 ? 'no photo' : 'no price'}`);
    return null;
  }
  return {
    id: p.slug,
    sku: p.code,
    name: p.name,
    category: p.category?.name ?? '',
    description: p.description ?? '',
    material: p.material ?? '',
    price: p.price,
    image: cloudinaryUrl(images[0], CARD_IMAGE),
    images: images.map((url) => cloudinaryUrl(url, PAGE_IMAGE)),
    inStock: p.stock > 0,
  };
}

function byFeaturedThenSortOrder(a: StrapiProduct, b: StrapiProduct): number {
  if (Boolean(a.featured) !== Boolean(b.featured)) return a.featured ? -1 : 1;
  return (a.sortOrder ?? Infinity) - (b.sortOrder ?? Infinity) || a.name.localeCompare(b.name);
}

async function fetchProducts(): Promise<Product[]> {
  if (!STRAPI_URL) {
    log('STRAPI_URL is not set: using sample products from src/data/products.ts');
    return localProducts;
  }
  log(`loading products from ${new URL(STRAPI_URL).host} (the backend may take a minute to wake up)`);
  const raw = await strapiGetAll<StrapiProduct>('products', {
    'populate[category][fields][0]': 'name',
    'populate[images][fields][0]': 'url',
  });
  const products = raw
    .sort(byFeaturedThenSortOrder)
    .map(toProduct)
    .filter((p): p is Product => p !== null);
  if (products.length === 0) {
    throw new Error(
      `Strapi returned zero usable products (${raw.length} published, each needs a photo and a price). ` +
        'The build was stopped so an empty shop is not published. Publish at least one product in Strapi, ' +
        'or unset STRAPI_URL to build with the sample data.',
    );
  }
  log(`loaded ${products.length} products`);
  return products;
}

async function fetchCategories(): Promise<string[]> {
  if (!STRAPI_URL) return [...new Set(localProducts.map((p) => p.category))];
  const raw = await strapiGetAll<StrapiCategory>('categories', { 'fields[0]': 'name', 'fields[1]': 'sortOrder' });
  return raw
    .sort((a, b) => (a.sortOrder ?? Infinity) - (b.sortOrder ?? Infinity) || a.name.localeCompare(b.name))
    .map((c) => c.name);
}

async function fetchStore(): Promise<StoreSettings> {
  if (!STRAPI_URL) return localStore;
  let settings: StrapiStoreSettings;
  try {
    settings = (await strapiGet<{ data: StrapiStoreSettings }>('store-setting', new URLSearchParams({ populate: 'heroImage' }))).data;
  } catch (error) {
    // Strapi answers 404 until Store settings has been saved once.
    if (!(error instanceof StrapiNotFound)) throw error;
    log('Store settings have not been saved in Strapi yet: using defaults from src/config/store.ts');
    return localStore;
  }
  return {
    name: settings.shopName || localStore.name,
    tagline: settings.tagline || localStore.tagline,
    city: settings.city || localStore.city,
    whatsappNumber: settings.whatsappNumber || localStore.whatsappNumber,
    instagramUrl: settings.instagramUrl || localStore.instagramUrl,
    heroImage: settings.heroImage?.url ? cloudinaryUrl(settings.heroImage.url, HERO_IMAGE) : localStore.heroImage,
    siteUrl: localStore.siteUrl,
  };
}

// Each build worker fetches once and reuses the result for every page it renders.
let productsPromise: Promise<Product[]> | undefined;
let categoriesPromise: Promise<string[]> | undefined;
let storePromise: Promise<StoreSettings> | undefined;

export function getProducts(): Promise<Product[]> {
  return (productsPromise ??= fetchProducts());
}

export function getCategories(): Promise<string[]> {
  return (categoriesPromise ??= fetchCategories());
}

export function getStore(): Promise<StoreSettings> {
  return (storePromise ??= fetchStore());
}

export async function getProduct(id: string): Promise<Product | undefined> {
  return (await getProducts()).find((p) => p.id === id);
}
