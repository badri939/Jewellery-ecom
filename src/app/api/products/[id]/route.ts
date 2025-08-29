import { NextResponse } from 'next/server';

const products = [
  {
    id: '1',
    name: 'Gold Necklace',
    description: 'Elegant 22K gold necklace with intricate design.',
    price: 1200,
    image: '/images/gold-necklace.jpg',
  },
  {
    id: '2',
    name: 'Diamond Ring',
    description: 'Sparkling diamond ring set in white gold.',
    price: 950,
    image: '/images/diamond-ring.jpg',
  },
  {
    id: '3',
    name: 'Pearl Earrings',
    description: 'Classic pearl earrings with gold studs.',
    price: 400,
    image: '/images/pearl-earrings.jpg',
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(_request: any, context: any) {
  const { id } = context.params;
  const product = products.find((p) => p.id === id);
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(product);
}
