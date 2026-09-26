"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchContent } from "@/lib/adminApi";

const CARDS = [
  { href: "/admin/produits", title: "Produits", desc: "Fiches produits, prix, photos, catégories." },
  { href: "/admin/accueil", title: "Page d'accueil", desc: "Étapes, atouts, questions fréquentes." },
  { href: "/admin/personnalisation", title: "Personnalisation", desc: "Texte et étapes de la page personnalisation." },
  { href: "/admin/showroom", title: "Showroom", desc: "Adresse, horaires." },
  { href: "/admin/avis", title: "Avis clients", desc: "Ajouter ou retirer des témoignages." },
  { href: "/admin/site", title: "Infos du site", desc: "Nom, WhatsApp, réseaux sociaux, e-mail." },
];

export default function AdminDashboard() {
  const [warning, setWarning] = useState<string | null>(null);

  useEffect(() => {
    fetchContent().then((r) => setWarning(r.warning || null)).catch((e) => setWarning(e.message));
  }, []);

  return (
    <div>
      <h1 className="font-serif text-2xl text-navy">Bienvenue</h1>
      <p className="mt-1 text-sm text-neutral-500">Modifiez le contenu de votre boutique en ligne.</p>
      {warning && (
        <div className="mt-4 rounded-xl bg-orange/10 p-4 text-sm text-orange">
          {warning}
        </div>
      )}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {CARDS.map((c) => (
          <Link key={c.href} href={c.href} className="rounded-2xl border border-neutral-200 p-5 hover:border-navy">
            <p className="font-semibold text-navy">{c.title}</p>
            <p className="mt-1 text-sm text-neutral-500">{c.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
