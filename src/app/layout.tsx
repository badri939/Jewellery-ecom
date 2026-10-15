import type { Metadata } from 'next';
import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/cormorant-garamond/600.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import './globals.css';
import { store } from '@/config/store';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';

export const metadata: Metadata = {
  metadataBase: new URL(store.siteUrl),
  title: {
    default: `${store.name} | Fashion jewellery in ${store.city}`,
    template: `%s | ${store.name}`,
  },
  description: `${store.tagline}. Necklace sets, earrings and rings. Order on WhatsApp with UPI or cash on delivery.`,
  openGraph: {
    siteName: store.name,
    images: ['/images/hero.jpg'],
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN">
      <body className="font-sans antialiased">
        <Header />
        {children}
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
