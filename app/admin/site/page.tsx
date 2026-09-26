"use client";
import { useEffect, useState } from "react";
import type { SiteConfig } from "@/data/types";
import { fetchContent, saveSection } from "@/lib/adminApi";

const FIELDS: { key: keyof SiteConfig; label: string }[] = [
  { key: "name", label: "Nom du site" },
  { key: "tagline", label: "Accroche" },
  { key: "city", label: "Adresse" },
  { key: "whatsapp", label: "Numéro WhatsApp (format 221xxxxxxxxx)" },
  { key: "email", label: "E-mail" },
  { key: "hours", label: "Horaires" },
  { key: "instagram", label: "Lien Instagram" },
  { key: "facebook", label: "Lien Facebook" },
  { key: "tiktok", label: "Lien TikTok" },
];

export default function AdminSite() {
  const [data, setData] = useState<SiteConfig | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => { fetchContent().then((r) => setData(r.content.site)).catch((e) => setError(e.message)); }, []);

  async function save() {
    if (!data) return;
    setStatus("saving"); setError("");
    try { await saveSection("site", data); setStatus("saved"); }
    catch (e: any) { setError(e.message); setStatus("error"); }
  }

  if (error && !data) return <p className="text-red-600">{error}</p>;
  if (!data) return <p className="text-neutral-500">Chargement...</p>;

  return (
    <div>
      <h1 className="font-serif text-2xl text-navy">Infos du site</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {FIELDS.map((f) => (
          <div key={f.key}>
            <label className="label">{f.label}</label>
            <input className="input" value={data[f.key]} onChange={(e) => setData({ ...data, [f.key]: e.target.value })} />
          </div>
        ))}
      </div>
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      <button onClick={save} disabled={status === "saving"} className="btn btn-primary mt-6">
        {status === "saving" ? "Publication..." : status === "saved" ? "Publié ✓" : "Enregistrer et publier"}
      </button>
      <p className="mt-2 text-xs text-neutral-400">La publication prend environ 1 minute (redéploiement du site).</p>
    </div>
  );
}
