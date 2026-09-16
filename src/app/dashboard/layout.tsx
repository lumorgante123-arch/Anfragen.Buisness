import Link from "next/link";
import { requireCurrentUser } from "@/lib/current-user";
import { logoutAction } from "./actions";
import { Logo } from "@/components/logo";

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
  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-8">
            <Link href="/dashboard">
              <Logo />
            </Link>
            <nav className="flex items-center gap-1 text-sm font-medium text-zinc-600">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full px-3 py-1.5 hover:bg-brand-50 hover:text-brand-700"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="flex items-center gap-2 text-zinc-600">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-700 text-xs font-semibold text-white">
                {initials}
              </span>
              <span className="hidden sm:inline">
                {user.name} · {user.business.name}
              </span>
            </span>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-full border border-zinc-300 px-3 py-1.5 text-zinc-700 hover:bg-zinc-100"
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
