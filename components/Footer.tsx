import Link from "next/link";
import { getSiteConfig, waLink } from "@/lib/content";

export default async function Footer() {
  const SITE = await getSiteConfig();
  return (
    <footer className="mt-10 bg-navy text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <p className="font-serif text-xl">{SITE.name}</p>
          <p className="mt-2 text-sm text-white/80">{SITE.tagline}</p>
          <p className="mt-2 text-sm text-white/80">{SITE.city}</p>
        </div>
        <div className="text-sm">
          <p className="font-semibold">Boutique</p>
          <ul className="mt-2 space-y-1 text-white/80">
            <li><Link href="/catalogue">Catalogue</Link></li>
            <li><Link href="/personnalisation">Personnalisation</Link></li>
            <li><Link href="/showroom">Showroom</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="font-semibold">Suivez-nous</p>
          <ul className="mt-2 space-y-1 text-white/80">
            <li><a href={SITE.instagram}>Instagram</a></li>
            <li><a href={SITE.facebook}>Facebook</a></li>
            <li><a href={SITE.tiktok}>TikTok</a></li>
            <li><a href={waLink(SITE.whatsapp, "Bonjour !")}>WhatsApp</a></li>
          </ul>
        </div>
      </div>
      <p className="border-t border-white/10 py-4 text-center text-xs text-white/60">
        © {new Date().getFullYear()} {SITE.name}. Tous droits réservés.
      </p>
    </footer>
  );
}
