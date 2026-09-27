import Link from "next/link";
import { getSiteConfig, waLink } from "@/lib/content";

const links = [
  { href: "/catalogue", label: "Catalogue" },
  { href: "/personnalisation", label: "Personnalisation" },
  { href: "/showroom", label: "Showroom" },
];

export default async function Header() {
  const SITE = await getSiteConfig();
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-serif text-xl text-navy">
          Bouchra <span className="text-orange">Unique</span> Interior
        </Link>
        <nav className="hidden gap-6 text-sm md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-neutral-700 hover:text-navy">{l.label}</Link>
          ))}
        </nav>
        <a href={waLink(SITE.whatsapp, `Bonjour ${SITE.name}, je souhaite des informations.`)} className="btn btn-wa !px-4 !py-2">
          WhatsApp
        </a>
      </div>
    </header>
  );
}
