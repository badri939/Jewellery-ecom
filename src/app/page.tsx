import Image from 'next/image';
import { getProducts, getStore } from '@/lib/strapi';
import { whatsappLink, enquiryMessage } from '@/lib/whatsapp';
import ProductCard from '@/components/ProductCard';
import WhatsAppIcon from '@/components/WhatsAppIcon';

const steps = [
  { title: 'Pick a piece', text: 'Browse the collection and open any piece for details.' },
  { title: 'Order on WhatsApp', text: 'Tap "Order on WhatsApp". The piece and price are filled in for you.' },
  { title: 'Pay and receive', text: 'Pay by UPI or cash on delivery. Local delivery or pickup.' },
];

export default async function HomePage() {
  const [store, products] = await Promise.all([getStore(), getProducts()]);
  const [brandWord, ...rest] = store.name.split(' ');
  const brandRest = rest.join(' ');

  return (
    <main>
      {/* Hero: the photo carries no text; the shop name and button are real text so they
          can be changed in Strapi's Store settings. On wide screens a blurred copy of the photo
          fills the sides, so there are no blank strips. */}
      <section className="relative overflow-hidden bg-sand-200">
        <Image
          src={store.heroImage}
          alt=""
          aria-hidden="true"
          fill
          sizes="100vw"
          className="scale-110 object-cover opacity-70 blur-2xl"
        />
        <div
          className="relative mx-auto w-full max-w-[min(72rem,120vh)]"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 8%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%)',
          }}
        >
          <Image
            src={store.heroImage}
            alt={`Model wearing ${store.name} pieces`}
            width={1536}
            height={1024}
            priority
            sizes="(min-width: 1152px) 1152px, 100vw"
            className="h-auto w-full"
          />
          <div className="absolute inset-y-0 right-0 flex w-[44%] flex-col items-center justify-center text-center text-cocoa">
            <p className="font-serif text-3xl font-semibold uppercase leading-none tracking-wide sm:text-5xl lg:text-7xl">
              {brandWord}
            </p>
            {brandRest && (
              <p className="mt-1 text-[0.6rem] uppercase tracking-[0.35em] sm:mt-2 sm:text-sm lg:text-lg">
                {brandRest}
              </p>
            )}
            <a
              href="#collection"
              className="mt-3 border border-cocoa px-3 py-1 text-[0.6rem] font-medium uppercase tracking-[0.2em] hover:bg-cocoa hover:text-white sm:mt-6 sm:px-6 sm:py-2 sm:text-sm lg:mt-8 lg:text-base"
            >
              Shop now
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-10 text-center">
        <h1 className="font-serif text-3xl text-cocoa sm:text-4xl">{store.tagline}</h1>
        <p className="mt-3 text-cocoa/75">
          Necklace sets, earrings and rings for weddings, festivals and every day. Order directly on WhatsApp.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <a href="#collection" className="rounded-full bg-cocoa px-6 py-3 font-medium text-white hover:bg-cocoa/90">
            View collection
          </a>
          <a
            href={whatsappLink(store, enquiryMessage(store))}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-cocoa px-6 py-3 font-medium text-cocoa hover:bg-sand-100"
          >
            <WhatsAppIcon />
            Ask on WhatsApp
          </a>
        </div>
      </section>

      <section id="collection" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-16">
        <h2 className="font-serif text-2xl text-cocoa sm:text-3xl">The collection</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section id="how-to-order" className="scroll-mt-20 bg-sand-100 py-14">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-serif text-2xl text-cocoa sm:text-3xl">How to order</h2>
          <ol className="mt-6 grid gap-6 sm:grid-cols-3">
            {steps.map((step, i) => (
              <li key={step.title} className="rounded-xl bg-white p-6">
                <span className="font-serif text-3xl text-gold">{i + 1}</span>
                <h3 className="mt-2 font-medium text-cocoa">{step.title}</h3>
                <p className="mt-1 text-sm text-cocoa/75">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}
