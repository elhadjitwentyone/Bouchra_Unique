export type Product = {
  slug: string; name: string; category: string; collection: string;
  price: number | null; image: string | null; description: string;
  customizable: boolean; inStock: boolean; published: boolean;
};

export type Review = { id: string; name: string; text: string; product?: string };

export type SiteConfig = {
  name: string; tagline: string; city: string; whatsapp: string; email: string;
  instagram: string; facebook: string; tiktok: string; hours: string;
};

export type HomeContent = {
  steps: [string, string][]; why: [string, string][]; faq: [string, string][];
};

export type PersonnalisationContent = { title: string; intro: string; steps: string[] };
export type ShowroomContent = { title: string; hours: string; address_query: string };

export type SiteContent = {
  site: SiteConfig; home: HomeContent; personnalisation: PersonnalisationContent;
  showroom: ShowroomContent; reviews: Review[]; products: Product[];
};

export const CATEGORIES = ["Encensoirs", "Diffuseurs", "Bougies", "Tableaux", "Luminaires", "Accessoires"];
