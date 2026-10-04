// Product catalogue. This file is the single source of product data for the site.
//
// SAMPLE DATA: the three entries below use placeholder images and prices.
// Replace them with real pieces (her own photos in /public/images, real prices
// and stock) before launch. Describe materials honestly: never "gold", "silver",
// "diamond" or "pearl" on their own for artificial pieces.

export type Category = 'Necklace sets' | 'Earrings' | 'Rings' | 'Bangles';

export type Product = {
  id: string; // used in the page URL: /product/<id>
  sku: string; // shop code, quoted in WhatsApp orders
  name: string;
  category: Category;
  description: string;
  material: string;
  price: number; // in rupees
  image: string;
  inStock: boolean;
};

export const products: Product[] = [
  {
    id: 'temple-necklace',
    sku: 'NS-TMP-001',
    name: 'Temple-style Necklace',
    category: 'Necklace sets',
    description:
      'A traditional temple-style choker with coin drops, made for weddings and festivals.',
    material: 'Gold-tone plated alloy',
    price: 1299,
    image: '/images/gold-necklace.png',
    inStock: true,
  },
  {
    id: 'solitaire-ring',
    sku: 'RG-SOL-001',
    name: 'Solitaire-style Ring',
    category: 'Rings',
    description: 'A classic single-stone ring that adds sparkle to everyday and party looks.',
    material: 'Gold-tone plated alloy with cubic zirconia stone',
    price: 499,
    image: '/images/diamond-ring.png',
    inStock: true,
  },
  {
    id: 'pearl-studs',
    sku: 'ER-PRL-001',
    name: 'Pearl Stud Earrings',
    category: 'Earrings',
    description: 'Simple, elegant studs that go with sarees and western wear alike.',
    material: 'Faux pearl with gold-tone plated posts',
    price: 349,
    image: '/images/pearl-earrings.png',
    inStock: true,
  },
];

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function formatPrice(rupees: number): string {
  return `₹${rupees.toLocaleString('en-IN')}`;
}
