import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

async function fetchProduct(id: string): Promise<Product | null> {
  const res = await fetch(`http://localhost:3000/api/products/${id}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function ProductDetailPage(props: any) {
  const product = await fetchProduct(props.params.id);
  if (!product) {
    return <div className="text-center py-20">Product not found.</div>;
  }

  return (
    <main className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="flex flex-col md:flex-row gap-8 items-center">
        <div className="flex-shrink-0">
          <Image
            src={product.image}
            alt={product.name}
            width={400}
            height={400}
            className="object-cover rounded-lg border"
            priority
          />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-700 mb-4">{product.description}</p>
          <p className="text-2xl font-bold text-yellow-700 mb-6">₹{product.price}</p>
          <form className="flex items-center gap-4">
            <label htmlFor="quantity" className="font-medium">Quantity:</label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              min={1}
              defaultValue={1}
              className="w-20 border rounded px-2 py-1"
            />
            <button
              type="submit"
              className="bg-yellow-600 text-white px-6 py-2 rounded hover:bg-yellow-700 font-semibold"
            >
              Add to Cart
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
