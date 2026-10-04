import Image from 'next/image';
import Link from 'next/link';
import { formatPrice, type Product } from '@/data/products';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${product.id}`}
      className="group block overflow-hidden rounded-xl border border-sand-200 bg-white transition hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gold"
    >
      <div className="relative aspect-square bg-sand-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
        {!product.inStock && (
          <span className="absolute left-3 top-3 rounded-full bg-cocoa px-3 py-1 text-xs text-white">Sold out</span>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs uppercase tracking-wider text-cocoa/60">{product.category}</p>
        <h3 className="mt-1 font-serif text-lg text-cocoa">{product.name}</h3>
        <p className="mt-1 text-sm text-cocoa/70">{product.material}</p>
        <p className="mt-2 font-semibold text-cocoa">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
