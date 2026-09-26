"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV = [
  { href: "/admin", label: "Tableau de bord" },
  { href: "/admin/produits", label: "Produits" },
  { href: "/admin/accueil", label: "Page d'accueil" },
  { href: "/admin/personnalisation", label: "Personnalisation" },
  { href: "/admin/showroom", label: "Showroom" },
  { href: "/admin/avis", label: "Avis clients" },
  { href: "/admin/site", label: "Infos du site" },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") {
    return <div className="min-h-screen bg-neutral-100">{children}</div>;
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-800">
      <div className="mx-auto flex max-w-6xl gap-6 px-4 py-8">
        <aside className="w-56 shrink-0">
          <p className="mb-4 font-serif text-lg text-navy">Administration</p>
          <nav className="space-y-1 text-sm">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={`block rounded-lg px-3 py-2 ${pathname === n.href ? "bg-navy text-white" : "text-neutral-700 hover:bg-neutral-200"}`}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <button onClick={logout} className="mt-6 w-full rounded-lg border border-neutral-300 px-3 py-2 text-left text-sm text-neutral-600 hover:bg-neutral-200">
            Se déconnecter
          </button>
          <Link href="/" className="mt-2 block px-3 text-xs text-neutral-500 underline">Voir le site</Link>
        </aside>
        <main className="min-w-0 flex-1 rounded-2xl bg-white p-6 shadow-sm">{children}</main>
      </div>
    </div>
  );
}
