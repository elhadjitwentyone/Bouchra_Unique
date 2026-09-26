import type { Metadata } from "next";
import { SITE, waLink } from "@/lib/content";
import { getShowroomContent } from "@/lib/content";

export const metadata: Metadata = { title: "Showroom" };

export default function Showroom() {
  const c = getShowroomContent();
  return (
    <div className="section max-w-3xl">
      <h1 className="h2">{c.title}</h1>
      <p className="mt-4 text-neutral-600">{SITE.city}</p>
      <p className="mt-2 text-neutral-600">Horaires : {c.hours}</p>
      <div className="mt-6 flex gap-3">
        <a href={`https://www.google.com/maps/search/${encodeURIComponent(c.address_query)}`} className="btn btn-outline">Itinéraire</a>
        <a href={waLink("Bonjour, je souhaite visiter le showroom.")} className="btn btn-wa">Prévenir sur WhatsApp</a>
      </div>
    </div>
  );
}
