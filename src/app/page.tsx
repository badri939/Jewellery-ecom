import Link from 'next/link';
import Image from 'next/image';

import { headers } from 'next/headers';

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
};

export default async function HomePage() {
  // Get base URL from headers (works in server components)
  const headersList = await headers();
  const host = headersList.get('host');
  const protocol = headersList.get('x-forwarded-proto') || 'http';
  const baseUrl = `${protocol}://${host}`;
  const res = await fetch(`${baseUrl}/api/products`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch products');
  const products: Product[] = await res.json();

  return (
    <main className="relative w-full min-h-screen">
      <section className="relative w-full min-h-[60vh] h-[60vh] sm:h-[70vh] md:h-screen flex items-center justify-center overflow-hidden">
        <Image
          src="/images/hero.png"
          alt="Jewellery Hero"
          fill
          className="object-contain w-full h-full absolute inset-0 z-0 bg-black"
          priority
        />
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full mt-32 md:mt-48">
          <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg mb-4 text-center">Jewellery Collection</h1>
          <p className="text-lg md:text-2xl text-white mb-8 text-center max-w-2xl">Discover timeless elegance and exquisite craftsmanship in every piece.</p>
          <a href="#categories" className="animate-bounce mt-8 text-white text-3xl" aria-label="Scroll to categories">93</a>
        </div>
      </section>
      <section id="categories" className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="border rounded-lg p-4 shadow hover:shadow-lg transition block bg-white"
            >
              {(product.name === 'Gold Necklace' || product.name === 'Diamond Ring' || product.name === 'Pearl Earrings') ? (
                <div className="flex items-center justify-center aspect-[3/2] w-full mb-4 bg-white">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={300}
                    height={200}
                    className="object-fill w-full h-full"
                  />
                </div>
              ) : (
                <Image
                  src={product.image}
                  alt={product.name}
                  width={300}
                  height={200}
                  className="object-contain rounded mb-4 bg-white w-full h-48"
                />
              )}
              <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
              <p className="text-gray-600 mb-2">{product.description}</p>
              <p className="font-bold mb-2">₹{product.price}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

