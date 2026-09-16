import Link from "next/link";
import { requireCurrentUser } from "@/lib/current-user";
import { logoutAction } from "./actions";

const NAV_ITEMS = [
  { href: "/dashboard/anfragen", label: "Anfragen" },
  { href: "/dashboard/mitarbeiter", label: "Mitarbeiter" },
  { href: "/dashboard/einstellungen", label: "Einstellungen" },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireCurrentUser();

  return (
    <div className="flex min-h-screen flex-1 flex-col">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="text-lg font-semibold tracking-tight">
              Anfragen<span className="text-blue-600">.Business</span>
            </Link>
            <nav className="flex items-center gap-4 text-sm font-medium text-zinc-600">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="hover:text-zinc-900"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-zinc-600">
              {user.name} · {user.business.name}
            </span>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-md border border-zinc-300 px-3 py-1.5 text-zinc-700 hover:bg-zinc-100"
              >
                Abmelden
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
        {children}
      </main>
    </div>
  );
}
