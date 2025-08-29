import { NextResponse } from 'next/server';

const products = [
  {
    id: '1',
    name: 'Gold Necklace',
    description: 'Elegant 22K gold necklace with intricate design.',
    price: 1200,
  image: '/images/gold-necklace.png',
  },
  {
    id: '2',
    name: 'Diamond Ring',
    description: 'Sparkling diamond ring set in white gold.',
    price: 950,
  image: '/images/diamond-ring.png',
  },
  {
    id: '3',
    name: 'Pearl Earrings',
    description: 'Classic pearl earrings with gold studs.',
    price: 400,
  image: '/images/pearl-earrings.png',
  },
];

export async function GET() {
  return NextResponse.json(products);
}
