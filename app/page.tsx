import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getProducts, getHomeContent, getReviews, getSiteConfig, waLink } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [allProducts, { steps, why, faq }, reviews, SITE] = await Promise.all([
    getProducts(), getHomeContent(), getReviews(), getSiteConfig(),
  ]);
  const products = allProducts.slice(0, 8);

  return (
    <div>
      <section className="bg-gradient-to-b from-gold/20 to-cream">
        <div className="section text-center">
          <h1 className="h2">{SITE.tagline}</h1>
          <p className="mx-auto mt-4 max-w-xl text-neutral-600">{SITE.city}</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/catalogue" className="btn btn-primary">Voir le catalogue</Link>
            <a href={waLink(SITE.whatsapp, `Bonjour ${SITE.name}, je souhaite des informations.`)} className="btn btn-wa">Commander sur WhatsApp</a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="flex items-center justify-between">
          <h2 className="h2">Nos produits</h2>
          <Link href="/catalogue" className="text-sm text-navy underline">Tout voir</Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {products.map((p) => <ProductCard key={p.slug} p={p} />)}
        </div>
      </section>

      <section className="bg-white">
        <div className="section grid gap-6 md:grid-cols-2">
          {steps.map(([title, text]) => (
            <div key={title} className="rounded-2xl bg-cream p-5">
              <p className="font-semibold text-navy">{title}</p>
              <p className="mt-1 text-sm text-neutral-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="h2">Pourquoi Bouchra Unique Interior</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {why.map(([title, text]) => (
            <div key={title}>
              <p className="font-semibold text-navy">{title}</p>
              <p className="mt-1 text-sm text-neutral-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {reviews.length > 0 && (
        <section className="bg-white">
          <div className="section">
            <h2 className="h2">Ce que disent nos clients</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {reviews.map((r) => (
                <div key={r.id} className="rounded-2xl bg-cream p-5">
                  <p className="text-sm text-neutral-700">“{r.text}”</p>
                  <p className="mt-3 text-sm font-semibold text-navy">{r.name}{r.product ? ` — ${r.product}` : ""}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section max-w-3xl">
        <h2 className="h2">Questions fréquentes</h2>
        <div className="mt-6 space-y-4">
          {faq.map(([q, a]) => (
            <div key={q} className="rounded-xl bg-white p-4 ring-1 ring-neutral-200">
              <p className="font-semibold text-navy">{q}</p>
              <p className="mt-1 text-sm text-neutral-600">{a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
