"use client";
import { useState } from "react";
import { SITE, waLink } from "@/lib/content";

export default function OrderForm({ product, customizable }: { product: string; customizable: boolean }) {
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [wa, setWa] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const order = {
      name: String(f.get("name")), phone: String(f.get("phone")), address: String(f.get("address")),
      custom: String(f.get("custom") || ""), qty: Number(f.get("qty") || 1), product,
    };
    setState("sending");
    await fetch("/api/order", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(order) }).catch(() => null);
    setWa(waLink(
      `Bonjour ${SITE.name}, je commande : ${order.qty} x ${product}.` +
      (order.custom ? ` Personnalisation : ${order.custom}.` : "") +
      ` Nom : ${order.name}. Tél : ${order.phone}. Livraison : ${order.address}. Paiement à la livraison.`
    ));
    setState("done");
  }

  if (state === "done")
    return (
      <div className="rounded-2xl bg-white p-6 ring-1 ring-neutral-200">
        <p className="font-semibold text-navy">Commande enregistrée.</p>
        <p className="mt-1 text-sm text-neutral-600">Confirmez-la sur WhatsApp pour fixer la livraison.</p>
        <a href={wa} className="btn btn-wa mt-4">Confirmer sur WhatsApp</a>
      </div>
    );

  return (
    <form onSubmit={submit} className="rounded-2xl bg-white p-6 ring-1 ring-neutral-200">
      <div className="grid gap-4">
        <div>
          <label className="label" htmlFor="name">Nom complet</label>
          <input id="name" name="name" required className="input" />
        </div>
        <div>
          <label className="label" htmlFor="phone">Téléphone</label>
          <input id="phone" name="phone" required className="input" />
        </div>
        <div>
          <label className="label" htmlFor="address">Adresse de livraison</label>
          <input id="address" name="address" required className="input" />
        </div>
        {customizable && (
          <div>
            <label className="label" htmlFor="custom">Personnalisation (prénom / message)</label>
            <input id="custom" name="custom" className="input" />
          </div>
        )}
        <div>
          <label className="label" htmlFor="qty">Quantité</label>
          <input id="qty" name="qty" type="number" min={1} defaultValue={1} className="input" />
        </div>
      </div>
      <button type="submit" disabled={state === "sending"} className="btn btn-primary mt-6 w-full">
        {state === "sending" ? "Envoi..." : "Commander"}
      </button>
    </form>
  );
}
