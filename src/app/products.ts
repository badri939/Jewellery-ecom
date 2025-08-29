// Example product data. Replace with real data or fetch from an API in production.
export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
};

export const products: Product[] = [
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
