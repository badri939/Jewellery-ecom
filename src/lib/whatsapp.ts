import type { StoreSettings } from '@/config/store';
import { formatPrice, type Product } from '@/data/products';

// Builds a wa.me link with a pre-filled message. If no number is configured,
// the link still opens WhatsApp and lets the customer choose a contact.
export function whatsappLink(store: StoreSettings, message: string): string {
  const number = store.whatsappNumber.replace(/\D/g, '');
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function orderMessage(store: StoreSettings, product: Product, productUrl: string): string {
  return [
    `Hello ${store.name}, I would like to order:`,
    `${product.name} (${product.sku})`,
    `Price: ${formatPrice(product.price)}`,
    productUrl,
  ].join('\n');
}

export function enquiryMessage(store: StoreSettings): string {
  return `Hello ${store.name}, I saw your collection online and have a question.`;
}
