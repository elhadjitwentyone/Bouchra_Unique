"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminLogin() {
  return (
    <Suspense fallback={null}>
      <AdminLoginForm />
    </Suspense>
  );
}

function AdminLoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (!res.ok) { setError("Mot de passe incorrect."); return; }
    router.push(params.get("next") || "/admin");
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-sm items-center px-4">
      <form onSubmit={submit} className="w-full rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200">
        <p className="font-serif text-xl text-navy">Administration</p>
        <p className="mt-1 text-sm text-neutral-500">Bouchra Unique Interior</p>
        <div className="mt-6">
          <label className="label" htmlFor="password">Mot de passe</label>
          <input id="password" type="password" required autoFocus className="input"
            value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={loading} className="btn btn-primary mt-6 w-full">
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
