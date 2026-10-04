import { store } from '@/config/store';
import { whatsappLink, enquiryMessage } from '@/lib/whatsapp';

export default function Footer() {
  return (
    <footer className="border-t border-sand-200 bg-sand-100">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 text-sm text-cocoa/80 sm:grid-cols-3">
        <div>
          <p className="font-serif text-lg text-cocoa">{store.name}</p>
          <p className="mt-2">{store.tagline}.</p>
          <p className="mt-1">Based in {store.city}.</p>
        </div>
        <div>
          <p className="font-medium text-cocoa">Shopping with us</p>
          <ul className="mt-2 space-y-1">
            <li>Order and pay on WhatsApp: UPI or cash on delivery</li>
            <li>Local delivery and pickup available</li>
            <li>All pieces are fashion (artificial) jewellery</li>
          </ul>
        </div>
        <div>
          <p className="font-medium text-cocoa">Get in touch</p>
          <ul className="mt-2 space-y-1">
            <li>
              <a href={whatsappLink(enquiryMessage())} target="_blank" rel="noopener noreferrer" className="underline hover:text-cocoa">
                WhatsApp us
              </a>
            </li>
            {store.instagramUrl && (
              <li>
                <a href={store.instagramUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-cocoa">
                  Instagram
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
      <p className="pb-6 text-center text-xs text-cocoa/60">
        © {new Date().getFullYear()} {store.name}
      </p>
    </footer>
  );
}
