import Link from "next/link";
import type { Product } from "@/data/types";
import { fcfa } from "@/lib/content";

export default function ProductCard({ p }: { p: Product }) {
  return (
    <Link href={`/produit/${p.slug}`} className="group block overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200 transition hover:shadow-md">
      <div className="aspect-square bg-gradient-to-br from-gold/30 via-cream to-orange/20">
        {p.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.image} alt={p.name} className="h-full w-full object-cover transition group-hover:scale-105" />
        )}
      </div>
      <div className="p-4">
        <p className="text-xs uppercase tracking-wide text-orange">{p.collection || p.category}</p>
        <h3 className="mt-1 font-semibold text-navy">{p.name}</h3>
        <p className="mt-1 text-sm text-neutral-600">{fcfa(p.price)}</p>
        {p.customizable && <span className="mt-2 inline-block rounded-full bg-gold/20 px-2 py-0.5 text-xs text-navy">Personnalisable</span>}
        {!p.inStock && <span className="mt-2 ml-2 inline-block rounded-full bg-neutral-200 px-2 py-0.5 text-xs text-neutral-600">Rupture</span>}
      </div>
    </Link>
  );
}
