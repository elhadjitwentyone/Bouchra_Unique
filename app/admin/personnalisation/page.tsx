"use client";
import { useEffect, useState } from "react";
import type { PersonnalisationContent } from "@/data/types";
import { fetchContent, saveSection } from "@/lib/adminApi";

export default function AdminPersonnalisation() {
  const [data, setData] = useState<PersonnalisationContent | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => { fetchContent().then((r) => setData(r.content.personnalisation)).catch((e) => setError(e.message)); }, []);

  function updateStep(i: number, val: string) {
    if (!data) return;
    const steps = [...data.steps]; steps[i] = val; setData({ ...data, steps });
  }

  async function save() {
    if (!data) return;
    setStatus("saving"); setError("");
    try { await saveSection("personnalisation", data); setStatus("saved"); }
    catch (e: any) { setError(e.message); setStatus("error"); }
  }

  if (error && !data) return <p className="text-red-600">{error}</p>;
  if (!data) return <p className="text-neutral-500">Chargement...</p>;

  return (
    <div>
      <h1 className="font-serif text-2xl text-navy">Personnalisation</h1>
      <div className="mt-6">
        <label className="label">Titre</label>
        <input className="input" value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} />
      </div>
      <div className="mt-4">
        <label className="label">Introduction</label>
        <textarea className="input" rows={3} value={data.intro} onChange={(e) => setData({ ...data, intro: e.target.value })} />
      </div>
      <div className="mt-4">
        <p className="font-semibold text-navy">Étapes</p>
        <div className="mt-2 space-y-2">
          {data.steps.map((s, i) => (
            <input key={i} className="input" value={s} onChange={(e) => updateStep(i, e.target.value)} />
          ))}
        </div>
        <div className="mt-2 flex gap-2">
          <button onClick={() => setData({ ...data, steps: [...data.steps, ""] })} className="btn btn-outline !py-2">+ Ajouter une étape</button>
          {data.steps.length > 0 && (
            <button onClick={() => setData({ ...data, steps: data.steps.slice(0, -1) })} className="btn btn-outline !py-2">Retirer la dernière</button>
          )}
        </div>
      </div>
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      <button onClick={save} disabled={status === "saving"} className="btn btn-primary mt-6">
        {status === "saving" ? "Publication..." : status === "saved" ? "Publié ✓" : "Enregistrer et publier"}
      </button>
      <p className="mt-2 text-xs text-neutral-400">La publication prend environ 1 minute (redéploiement du site).</p>
    </div>
  );
}
