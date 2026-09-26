import raw from "@/data/content.json";
import type { SiteContent } from "@/data/types";

const content = raw as unknown as SiteContent;

export function getSiteConfig() { return content.site; }
export function getHomeContent() { return content.home; }
export function getPersonnalisationContent() { return content.personnalisation; }
export function getShowroomContent() { return content.showroom; }
export function getReviews() { return content.reviews ?? []; }
export function getProducts() { return content.products.filter((p) => p.published !== false); }
export function getProduct(slug: string) { return content.products.find((p) => p.slug === slug) ?? null; }

export const SITE = content.site;

export const waLink = (text: string) =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;

export const fcfa = (n: number | null) =>
  n == null ? "Prix sur WhatsApp" : new Intl.NumberFormat("fr-FR").format(n) + " FCFA";
