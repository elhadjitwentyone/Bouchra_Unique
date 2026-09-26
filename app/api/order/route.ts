import { NextRequest, NextResponse } from "next/server";

// Reçoit les commandes du site pour trace/logs serveur. Le client bascule ensuite
// vers WhatsApp pour la confirmation réelle (voir OrderForm.tsx).
export async function POST(req: NextRequest) {
  try {
    const order = await req.json();
    console.log("[commande]", JSON.stringify(order));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
