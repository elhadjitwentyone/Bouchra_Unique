"use client";
import { useEffect, useState } from "react";
import type { HomeContent } from "@/data/types";
import { fetchContent, saveSection } from "@/lib/adminApi";

function PairList({ title, hintA, hintB, items, onChange }: {
  title: string; hintA: string; hintB: string; items: [string, string][]; onChange: (v: [string, string][]) => void;
}) {
  function update(i: number, idx: 0 | 1, val: string) {
    const next = items.map((it) => [...it]) as [string, string][];
    next[i][idx] = val; onChange(next);
  }
  function remove(i: number) { onChange(items.filter((_, idx) => idx !== i)); }
  function add() { onChange([...items, ["", ""]]); }

  return (
    <div className="mt-8">
      <p className="font-semibold text-navy">{title}</p>
      <div className="mt-3 space-y-3">
        {items.map((it, i) => (
          <div key={i} className="flex gap-2 rounded-xl border border-neutral-200 p-3">
            <div className="flex-1 space-y-2">
              <input className="input" placeholder={hintA} value={it[0]} onChange={(e) => update(i, 0, e.target.value)} />
              <input className="input" placeholder={hintB} value={it[1]} onChange={(e) => update(i, 1, e.target.value)} />
            </div>
            <button onClick={() => remove(i)} className="self-start text-xs text-red-600">Retirer</button>
          </div>
        ))}
      </div>
      <button onClick={add} className="btn btn-outline mt-3 !py-2">+ Ajouter</button>
    </div>
  );
}

export default function AdminAccueil() {
  const [data, setData] = useState<HomeContent | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => { fetchContent().then((r) => setData(r.content.home)).catch((e) => setError(e.message)); }, []);

  async function save() {
    if (!data) return;
    setStatus("saving"); setError("");
    try { await saveSection("home", data); setStatus("saved"); }
    catch (e: any) { setError(e.message); setStatus("error"); }
  }

  if (error && !data) return <p className="text-red-600">{error}</p>;
  if (!data) return <p className="text-neutral-500">Chargement...</p>;

  return (
    <div>
      <h1 className="font-serif text-2xl text-navy">Page d'accueil</h1>
      <PairList title="Étapes de commande" hintA="Titre (ex: 1. Choisissez)" hintB="Texte"
        items={data.steps} onChange={(v) => setData({ ...data, steps: v })} />
      <PairList title="Pourquoi nous choisir" hintA="Titre" hintB="Texte"
        items={data.why} onChange={(v) => setData({ ...data, why: v })} />
      <PairList title="Questions fréquentes" hintA="Question" hintB="Réponse"
        items={data.faq} onChange={(v) => setData({ ...data, faq: v })} />
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      <button onClick={save} disabled={status === "saving"} className="btn btn-primary mt-6">
        {status === "saving" ? "Publication..." : status === "saved" ? "Publié ✓" : "Enregistrer et publier"}
      </button>
      <p className="mt-2 text-xs text-neutral-400">La publication prend environ 1 minute (redéploiement du site).</p>
    </div>
  );
}
