import { whatsappLink, enquiryMessage } from '@/lib/whatsapp';
import WhatsAppIcon from './WhatsAppIcon';

// Floating chat button, always visible on phones where most visitors arrive.
export default function WhatsAppFloat() {
  return (
    <a
      href={whatsappLink(enquiryMessage())}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-lg hover:brightness-95 focus:outline-none focus:ring-4 focus:ring-whatsapp/40"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
