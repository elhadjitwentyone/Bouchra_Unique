"use client";
import { useEffect, useState } from "react";
import type { ShowroomContent } from "@/data/types";
import { fetchContent, saveSection } from "@/lib/adminApi";

export default function AdminShowroom() {
  const [data, setData] = useState<ShowroomContent | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => { fetchContent().then((r) => setData(r.content.showroom)).catch((e) => setError(e.message)); }, []);

  async function save() {
    if (!data) return;
    setStatus("saving"); setError("");
    try { await saveSection("showroom", data); setStatus("saved"); }
    catch (e: any) { setError(e.message); setStatus("error"); }
  }

  if (error && !data) return <p className="text-red-600">{error}</p>;
  if (!data) return <p className="text-neutral-500">Chargement...</p>;

  return (
    <div>
      <h1 className="font-serif text-2xl text-navy">Showroom</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Titre</label>
          <input className="input" value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} />
        </div>
        <div>
          <label className="label">Horaires</label>
          <input className="input" value={data.hours} onChange={(e) => setData({ ...data, hours: e.target.value })} />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Adresse (pour l'itinéraire Google Maps)</label>
          <input className="input" value={data.address_query} onChange={(e) => setData({ ...data, address_query: e.target.value })} />
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
