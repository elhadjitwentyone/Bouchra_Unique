"use client";
import type { SiteContent } from "@/data/types";

export async function fetchContent(): Promise<{ content: SiteContent; warning?: string }> {
  const res = await fetch("/api/admin/content", { cache: "no-store" });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Erreur de chargement.");
  return json;
}

export async function saveSection(section: keyof SiteContent, data: any) {
  const res = await fetch("/api/admin/content", {
    method: "PUT", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ section, data }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Erreur de sauvegarde.");
  return json;
}

export async function uploadImage(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body: form });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Erreur d'envoi.");
  return json.path;
}
