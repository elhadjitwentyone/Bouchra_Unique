import raw from "@/data/content.json";
import type { SiteContent } from "@/data/types";
import { readContentJson, isConfigured } from "@/lib/github";

const fallback = raw as unknown as SiteContent;

// Contenu relu en direct depuis GitHub à chaque requête (aucun cache) : une sauvegarde
// dans /admin apparaît sur le site immédiatement, sans build ni redéploiement Vercel.
// Si GitHub n'est pas configuré ou injoignable, on retombe sur data/content.json (build).
async function getContent(): Promise<SiteContent> {
  if (!isConfigured()) return fallback;
  try {
    return (await readContentJson()) as SiteContent;
  } catch {
    return fallback;
  }
}

export async function getSiteConfig() { return (await getContent()).site; }
export async function getHomeContent() { return (await getContent()).home; }
export async function getPersonnalisationContent() { return (await getContent()).personnalisation; }
export async function getShowroomContent() { return (await getContent()).showroom; }
export async function getReviews() { return (await getContent()).reviews ?? []; }
export async function getProducts() { return (await getContent()).products.filter((p) => p.published !== false); }
export async function getProduct(slug: string) { return (await getContent()).products.find((p) => p.slug === slug) ?? null; }

export const waLink = (whatsapp: string, text: string) =>
  `https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`;

export const fcfa = (n: number | null) =>
  n == null ? "Prix sur WhatsApp" : new Intl.NumberFormat("fr-FR").format(n) + " FCFA";
