"use client";
import { useEffect, useRef, useState } from "react";
import type { Product } from "@/data/types";
import { CATEGORIES } from "@/data/types";
import { fetchContent, saveSection, uploadImage } from "@/lib/adminApi";

function emptyProduct(): Product {
  return {
    slug: "", name: "", category: CATEGORIES[0], collection: "", price: null, image: null,
    description: "", customizable: false, inStock: true, published: true,
  };
}

function slugify(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function ProductRow({ p, onChange, onRemove }: { p: Product; onChange: (p: Product) => void; onRemove: () => void }) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try { onChange({ ...p, image: await uploadImage(file) }); }
    catch (err: any) { alert(err.message); }
    setUploading(false);
  }

  return (
    <div className="rounded-xl border border-neutral-200 p-4">
      <div className="flex gap-4">
        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-cream ring-1 ring-neutral-200">
          {p.image && <img src={p.image} alt="" className="h-full w-full object-cover" />}
        </div>
        <div className="grid flex-1 gap-2 sm:grid-cols-2">
          <input className="input" placeholder="Nom du produit"
            value={p.name} onChange={(e) => onChange({ ...p, name: e.target.value, slug: p.slug || slugify(e.target.value) })} />
          <input className="input" placeholder="Identifiant (slug, unique)"
            value={p.slug} onChange={(e) => onChange({ ...p, slug: slugify(e.target.value) })} />
          <select className="input" value={p.category} onChange={(e) => onChange({ ...p, category: e.target.value })}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <input className="input" placeholder="Collection (optionnel)"
            value={p.collection} onChange={(e) => onChange({ ...p, collection: e.target.value })} />
          <input className="input" type="number" placeholder="Prix en FCFA (laisser vide = « Prix sur WhatsApp »)"
            value={p.price ?? ""} onChange={(e) => onChange({ ...p, price: e.target.value === "" ? null : Number(e.target.value) })} />
          <div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="btn btn-outline w-full !py-2">
              {uploading ? "Envoi..." : "Changer la photo"}
            </button>
          </div>
        </div>
      </div>
      <textarea className="input mt-3" rows={2} placeholder="Description"
        value={p.description} onChange={(e) => onChange({ ...p, description: e.target.value })} />
      <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={p.customizable} onChange={(e) => onChange({ ...p, customizable: e.target.checked })} />
          Personnalisable
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={p.inStock} onChange={(e) => onChange({ ...p, inStock: e.target.checked })} />
          En stock
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={p.published} onChange={(e) => onChange({ ...p, published: e.target.checked })} />
          Visible sur le site
        </label>
        <button onClick={onRemove} className="ml-auto text-xs text-red-600">Supprimer ce produit</button>
      </div>
    </div>
  );
}

export default function AdminProduits() {
  const [data, setData] = useState<Product[] | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => { fetchContent().then((r) => setData(r.content.products || [])).catch((e) => setError(e.message)); }, []);

  function update(i: number, p: Product) { if (data) setData(data.map((it, idx) => (idx === i ? p : it))); }
  function remove(i: number) { if (data && confirm("Supprimer ce produit ?")) setData(data.filter((_, idx) => idx !== i)); }
  function add() { setData([emptyProduct(), ...(data || [])]); }

  async function save() {
    if (!data) return;
    const slugs = data.map((p) => p.slug);
    if (slugs.some((s) => !s)) { setError("Chaque produit doit avoir un identifiant."); return; }
    if (new Set(slugs).size !== slugs.length) { setError("Deux produits ont le même identifiant."); return; }
    setStatus("saving"); setError("");
    try { await saveSection("products", data); setStatus("saved"); }
    catch (e: any) { setError(e.message); setStatus("error"); }
  }

  if (error && !data) return <p className="text-red-600">{error}</p>;
  if (!data) return <p className="text-neutral-500">Chargement...</p>;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-navy">Produits</h1>
        <button onClick={add} className="btn btn-primary !py-2">+ Nouveau produit</button>
      </div>
      <div className="mt-6 space-y-4">
        {data.map((p, i) => (
          <ProductRow key={i} p={p} onChange={(np) => update(i, np)} onRemove={() => remove(i)} />
        ))}
      </div>
      {data.length === 0 && <p className="mt-6 text-neutral-500">Aucun produit. Cliquez sur « Nouveau produit ».</p>}
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      <button onClick={save} disabled={status === "saving"} className="btn btn-primary mt-6">
        {status === "saving" ? "Publication..." : status === "saved" ? "Publié ✓" : "Enregistrer et publier"}
      </button>
      <p className="mt-2 text-xs text-neutral-400">La publication prend environ 1 minute (redéploiement du site).</p>
    </div>
  );
}
