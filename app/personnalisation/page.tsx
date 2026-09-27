import type { Metadata } from "next";
import Link from "next/link";
import { getPersonnalisationContent, getSiteConfig, waLink } from "@/lib/content";

export const metadata: Metadata = { title: "Personnalisation" };
export const dynamic = "force-dynamic";

export default async function Personnalisation() {
  const [c, SITE] = await Promise.all([getPersonnalisationContent(), getSiteConfig()]);
  return (
    <div className="section max-w-3xl">
      <h1 className="h2">{c.title}</h1>
      <p className="mt-4 text-neutral-600">{c.intro}</p>
      <ol className="mt-6 list-decimal space-y-2 pl-5 text-neutral-700">
        {c.steps.map((s) => <li key={s}>{s}</li>)}
      </ol>
      <div className="mt-8 flex gap-3">
        <Link href="/catalogue?cat=Encensoirs" className="btn btn-primary">Voir les encensoirs</Link>
        <a href={waLink(SITE.whatsapp, "Bonjour, je souhaite une personnalisation.")} className="btn btn-wa">Demander sur WhatsApp</a>
      </div>
    </div>
  );
}
