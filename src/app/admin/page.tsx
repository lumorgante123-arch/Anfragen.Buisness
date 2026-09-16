import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { CreateBusinessForm } from "./create-business-form";
import { adminLogoutAction } from "./actions";

export default async function AdminPage() {
  await requireAdmin();

  const businesses = await prisma.business.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      users: { where: { role: "OWNER" }, take: 1 },
      _count: { select: { requests: true } },
    },
  });

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <span className="text-lg font-semibold tracking-tight">
            Anfragen<span className="text-blue-600">.Business</span>{" "}
            <span className="text-zinc-400">/ Admin</span>
          </span>
          <form action={adminLogoutAction}>
            <button
              type="submit"
              className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-100"
            >
              Abmelden
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="rounded-lg border border-zinc-200 bg-white p-5">
          <h1 className="text-lg font-semibold text-zinc-900">
            Neuen Betrieb anlegen
          </h1>
          <p className="mt-1 text-sm text-zinc-600">
            Legt Betrieb und Inhaber-Konto an und generiert einen
            Einladungslink, über den der Betrieb sein eigenes Passwort setzt.
          </p>
          <div className="mt-4">
            <CreateBusinessForm />
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-lg border border-zinc-200 bg-white">
          <table className="min-w-full divide-y divide-zinc-200 text-sm">
            <thead className="bg-zinc-50 text-left text-xs font-medium uppercase text-zinc-500">
              <tr>
                <th className="px-4 py-3">Betrieb</th>
                <th className="px-4 py-3">Inhaber:in</th>
                <th className="px-4 py-3">Formular</th>
                <th className="px-4 py-3">Anfragen</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {businesses.map((b) => {
                const owner = b.users[0];
                const activated = !!owner?.passwordHash;
                return (
                  <tr key={b.id}>
                    <td className="px-4 py-3 font-medium text-zinc-900">
                      {b.name}
                    </td>
                    <td className="px-4 py-3 text-zinc-700">
                      {owner ? `${owner.name} · ${owner.email}` : "–"}
                    </td>
                    <td className="px-4 py-3 text-zinc-500">
                      <code className="text-xs">/anfrage/{b.slug}</code>
                    </td>
                    <td className="px-4 py-3 text-zinc-700">
                      {b._count.requests}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          activated
                            ? "bg-green-100 text-green-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {activated ? "Aktiv" : "Einladung ausstehend"}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {businesses.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center text-zinc-500"
                  >
                    Noch keine Betriebe angelegt.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
