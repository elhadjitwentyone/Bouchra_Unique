import type { Metadata } from "next";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/content";
import { CATEGORIES } from "@/data/types";

export const metadata: Metadata = { title: "Catalogue" };
export const dynamic = "force-dynamic";

export default async function Catalogue({ searchParams }: { searchParams: { cat?: string } }) {
  const all = await getProducts();
  const cat = searchParams.cat;
  const products = cat ? all.filter((p) => p.category === cat) : all;
  return (
    <div className="section">
      <h1 className="h2">Catalogue</h1>
      <div className="mt-6 flex flex-wrap gap-2">
        <Link href="/catalogue" className={`btn ${!cat ? "btn-primary" : "btn-outline"} !py-2`}>Tout</Link>
        {CATEGORIES.map((c) => (
          <Link key={c} href={`/catalogue?cat=${encodeURIComponent(c)}`} className={`btn ${cat === c ? "btn-primary" : "btn-outline"} !py-2`}>{c}</Link>
        ))}
      </div>
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {products.map((p) => <ProductCard key={p.slug} p={p} />)}
      </div>
      {products.length === 0 && <p className="mt-8 text-neutral-600">Aucun produit dans cette catégorie pour le moment.</p>}
    </div>
  );
}
