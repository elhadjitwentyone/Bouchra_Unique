import { NextRequest, NextResponse } from "next/server";
import { readContentJson, writeContentJson, isConfigured } from "@/lib/github";
import localContent from "@/data/content.json";

const SECTIONS = ["site", "home", "personnalisation", "showroom", "reviews", "products"];

export async function GET() {
  if (!isConfigured()) {
    return NextResponse.json({
      content: localContent,
      warning: "GITHUB_TOKEN / GITHUB_REPO non configurés : les sauvegardes ne seront pas publiées sur le site.",
    });
  }
  try {
    const content = await readContentJson();
    return NextResponse.json({ content });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!isConfigured()) {
    return NextResponse.json(
      { error: "GITHUB_TOKEN / GITHUB_REPO non configurés sur Vercel. Ajoutez-les pour activer la sauvegarde." },
      { status: 400 }
    );
  }
  const { section, data } = await req.json().catch(() => ({}));
  if (!SECTIONS.includes(section)) {
    return NextResponse.json({ error: "Section inconnue." }, { status: 400 });
  }
  try {
    const current = await readContentJson();
    const next = { ...current, [section]: data };
    await writeContentJson(next, `admin: mise à jour ${section}`);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
