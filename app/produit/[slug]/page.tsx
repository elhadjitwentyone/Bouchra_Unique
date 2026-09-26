import { notFound } from "next/navigation";
import type { Metadata } from "next";
import OrderForm from "@/components/OrderForm";
import { getProduct, getProducts, fcfa } from "@/lib/content";

export function generateStaticParams() {
  return getProducts().map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getProduct(params.slug);
  return { title: p ? p.name : "Produit" };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const p = getProduct(params.slug);
  if (!p) notFound();

  return (
    <div className="section grid gap-10 md:grid-cols-2">
      <div className="aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-gold/30 via-cream to-orange/20">
        {p.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
        )}
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide text-orange">{p.collection || p.category}</p>
        <h1 className="h2 mt-1">{p.name}</h1>
        <p className="mt-2 text-lg text-neutral-700">{fcfa(p.price)}</p>
        <p className="mt-4 text-neutral-600">{p.description}</p>
        {p.customizable && <p className="mt-3 text-sm font-semibold text-navy">✓ Personnalisation gratuite disponible</p>}
        {!p.inStock && <p className="mt-3 text-sm font-semibold text-orange">Actuellement en rupture de stock</p>}
        <div className="mt-8">
          <OrderForm product={p.name} customizable={p.customizable} />
        </div>
      </div>
    </div>
  );
}
