import Link from 'next/link';
import { store } from '@/config/store';
import { whatsappLink, enquiryMessage } from '@/lib/whatsapp';
import WhatsAppIcon from './WhatsAppIcon';

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-sand-200 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-serif text-xl tracking-wide text-cocoa sm:text-2xl">
          {store.name}
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/#collection" className="hidden text-cocoa/80 hover:text-cocoa sm:inline">
            Collection
          </Link>
          <Link href="/#how-to-order" className="hidden text-cocoa/80 hover:text-cocoa sm:inline">
            How to order
          </Link>
          <a
            href={whatsappLink(enquiryMessage())}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-4 py-2 font-medium text-white hover:brightness-95"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Chat
          </a>
        </nav>
      </div>
    </header>
  );
}
