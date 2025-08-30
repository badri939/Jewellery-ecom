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
  // Use absolute URL for internal API route in server components
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
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
        <div className="absolute z-10 bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center w-full px-4">
          <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg text-center mb-2">Jewellery Collection</h1>
          <p className="text-base md:text-xl text-white text-center max-w-2xl mb-4 drop-shadow">Discover timeless elegance and exquisite craftsmanship in every piece.</p>
          <a href="#categories" className="animate-bounce text-white text-3xl" aria-label="Scroll to categories">↓</a>
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

