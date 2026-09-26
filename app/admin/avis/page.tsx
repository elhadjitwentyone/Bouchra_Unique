"use client";
import { useEffect, useState } from "react";
import type { Review } from "@/data/types";
import { fetchContent, saveSection } from "@/lib/adminApi";

export default function AdminAvis() {
  const [data, setData] = useState<Review[] | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => { fetchContent().then((r) => setData(r.content.reviews || [])).catch((e) => setError(e.message)); }, []);

  function update(i: number, patch: Partial<Review>) {
    if (!data) return;
    setData(data.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }
  function remove(i: number) { if (data) setData(data.filter((_, idx) => idx !== i)); }
  function add() {
    const id = Math.random().toString(36).slice(2, 9);
    setData([...(data || []), { id, name: "", text: "", product: "" }]);
  }

  async function save() {
    if (!data) return;
    setStatus("saving"); setError("");
    try { await saveSection("reviews", data); setStatus("saved"); }
    catch (e: any) { setError(e.message); setStatus("error"); }
  }

  if (error && !data) return <p className="text-red-600">{error}</p>;
  if (!data) return <p className="text-neutral-500">Chargement...</p>;

  return (
    <div>
      <h1 className="font-serif text-2xl text-navy">Avis clients</h1>
      <p className="mt-1 text-sm text-neutral-500">Ces avis s'affichent sur la page d'accueil dès qu'il y en a un.</p>
      <div className="mt-6 space-y-4">
        {data.map((r, i) => (
          <div key={r.id} className="rounded-xl border border-neutral-200 p-4">
            <div className="grid gap-2 sm:grid-cols-2">
              <input className="input" placeholder="Nom du client" value={r.name} onChange={(e) => update(i, { name: e.target.value })} />
              <input className="input" placeholder="Produit (optionnel)" value={r.product || ""} onChange={(e) => update(i, { product: e.target.value })} />
            </div>
            <textarea className="input mt-2" rows={2} placeholder="Témoignage" value={r.text} onChange={(e) => update(i, { text: e.target.value })} />
            <button onClick={() => remove(i)} className="mt-2 text-xs text-red-600">Retirer cet avis</button>
          </div>
        ))}
      </div>
      <button onClick={add} className="btn btn-outline mt-4 !py-2">+ Ajouter un avis</button>
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      <div>
        <button onClick={save} disabled={status === "saving"} className="btn btn-primary mt-6">
          {status === "saving" ? "Publication..." : status === "saved" ? "Publié ✓" : "Enregistrer et publier"}
        </button>
      </div>
      <p className="mt-2 text-xs text-neutral-400">La publication prend environ 1 minute (redéploiement du site).</p>
    </div>
  );
}
