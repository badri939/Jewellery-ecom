import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { formatPrice } from '@/data/products';
import { getProducts, getProduct, getStore } from '@/lib/strapi';
import { whatsappLink, orderMessage } from '@/lib/whatsapp';
import WhatsAppIcon from '@/components/WhatsAppIcon';

type Props = { params: Promise<{ id: string }> };

// Pre-render every product page at build time.
export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return {};
  return {
    title: product.name,
    description: `${product.description} ${product.material}. ${formatPrice(product.price)}.`,
    openGraph: { images: [product.images[0]] },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const [store, product] = await Promise.all([getStore(), getProduct(id)]);
  if (!product) notFound();

  const productUrl = `${store.siteUrl}/product/${product.id}`;

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
      <Link href="/#collection" className="text-sm text-cocoa/70 hover:text-cocoa">
        ← Back to collection
      </Link>

      <div className="mt-4 grid gap-8 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-sand-100">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        <div>
          <p className="text-xs uppercase tracking-wider text-cocoa/60">{product.category}</p>
          <h1 className="mt-1 font-serif text-3xl text-cocoa sm:text-4xl">{product.name}</h1>
          <p className="mt-3 text-2xl font-semibold text-cocoa">{formatPrice(product.price)}</p>
          <p className="mt-4 text-cocoa/80">{product.description}</p>

          <dl className="mt-6 space-y-2 border-t border-sand-200 pt-4 text-sm">
            <div className="flex gap-2">
              <dt className="w-24 shrink-0 text-cocoa/60">Material</dt>
              <dd>{product.material}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-24 shrink-0 text-cocoa/60">Code</dt>
              <dd>{product.sku}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-24 shrink-0 text-cocoa/60">Availability</dt>
              <dd>{product.inStock ? 'In stock' : 'Sold out'}</dd>
            </div>
          </dl>

          {product.inStock ? (
            <a
              href={whatsappLink(store, orderMessage(store, product, productUrl))}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-whatsapp px-6 py-3 font-medium text-white hover:brightness-95 sm:w-auto sm:inline-flex"
            >
              <WhatsAppIcon />
              Order on WhatsApp
            </a>
          ) : (
            <p className="mt-6 rounded-lg bg-sand-100 p-4 text-sm">
              This piece is sold out. Message us on WhatsApp to ask about similar designs.
            </p>
          )}
          <p className="mt-3 text-sm text-cocoa/70">Pay by UPI or cash on delivery. Local delivery or pickup.</p>

          <div className="mt-8 rounded-xl bg-sand-100 p-4 text-sm text-cocoa/80">
            <p className="font-medium text-cocoa">Care</p>
            <p className="mt-1">
              Keep away from water, perfume and sweat. Wipe with a soft dry cloth and store in a pouch or box to
              keep the shine longer.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
