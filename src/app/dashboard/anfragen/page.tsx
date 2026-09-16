import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireCurrentUser } from "@/lib/current-user";
import {
  STATUS_LABELS,
  STATUS_ORDER,
  STATUS_BADGE_CLASSES,
  SOURCE_LABELS,
} from "@/lib/constants";
import type { Prisma } from "@/generated/prisma/client";

export default async function AnfragenListPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; assignee?: string; q?: string }>;
}) {
  const user = await requireCurrentUser();
  const { status, assignee, q } = await searchParams;

  const where: Prisma.RequestWhereInput = { businessId: user.businessId };

  if (status && STATUS_ORDER.includes(status as (typeof STATUS_ORDER)[number])) {
    where.status = status as (typeof STATUS_ORDER)[number];
  }

  if (assignee === "unassigned") {
    where.assignedToId = null;
  } else if (assignee === "me") {
    where.assignedToId = user.id;
  } else if (assignee) {
    where.assignedToId = assignee;
  }

  if (q) {
    where.OR = [
      { customerName: { contains: q } },
      { description: { contains: q } },
      { customerEmail: { contains: q } },
    ];
  }

  const [requests, employees] = await Promise.all([
    prisma.request.findMany({
      where,
      orderBy: [{ createdAt: "desc" }],
      include: { assignedTo: { select: { id: true, name: true } } },
    }),
    prisma.user.findMany({
      where: { businessId: user.businessId, active: true },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-zinc-900">Anfragen</h1>
        <Link
          href={`/anfrage/${user.business.slug}`}
          target="_blank"
          className="text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          Öffentliches Formular ansehen →
        </Link>
      </div>

      <form className="mt-4 flex flex-wrap items-end gap-3 rounded-lg border border-zinc-200 bg-white p-4">
        <div>
          <label className="block text-xs font-medium text-zinc-500">
            Status
          </label>
          <select
            name="status"
            defaultValue={status ?? ""}
            className="mt-1 rounded-md border border-zinc-300 px-2 py-1.5 text-sm"
          >
            <option value="">Alle</option>
            {STATUS_ORDER.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-500">
            Zuständig
          </label>
          <select
            name="assignee"
            defaultValue={assignee ?? ""}
            className="mt-1 rounded-md border border-zinc-300 px-2 py-1.5 text-sm"
          >
            <option value="">Alle</option>
            <option value="unassigned">Nicht zugewiesen</option>
            <option value="me">Mir zugewiesen</option>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[180px]">
          <label className="block text-xs font-medium text-zinc-500">
            Suche
          </label>
          <input
            name="q"
            defaultValue={q ?? ""}
            placeholder="Name, E-Mail, Beschreibung…"
            className="mt-1 w-full rounded-md border border-zinc-300 px-2 py-1.5 text-sm"
          />
        </div>

        <button
          type="submit"
          className="rounded-md bg-zinc-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-zinc-700"
        >
          Filtern
        </button>
        {(status || assignee || q) && (
          <Link
            href="/dashboard/anfragen"
            className="text-sm text-zinc-500 hover:text-zinc-800"
          >
            Zurücksetzen
          </Link>
        )}
      </form>

      <div className="mt-4 overflow-hidden rounded-lg border border-zinc-200 bg-white">
        <table className="min-w-full divide-y divide-zinc-200 text-sm">
          <thead className="bg-zinc-50 text-left text-xs font-medium uppercase text-zinc-500">
            <tr>
              <th className="px-4 py-3">Kunde</th>
              <th className="px-4 py-3">Kategorie</th>
              <th className="px-4 py-3">Quelle</th>
              <th className="px-4 py-3">Dringlichkeit</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Zugewiesen an</th>
              <th className="px-4 py-3">Eingegangen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {requests.map((r) => (
              <tr key={r.id} className="hover:bg-zinc-50">
                <td className="px-4 py-3">
                  <Link
                    href={`/dashboard/anfragen/${r.id}`}
                    className="font-medium text-zinc-900 hover:text-blue-600"
                  >
                    {r.customerName}
                  </Link>
                  <p className="text-xs text-zinc-500">{r.customerEmail}</p>
                </td>
                <td className="px-4 py-3 text-zinc-700">{r.category}</td>
                <td className="px-4 py-3 text-zinc-500">
                  {SOURCE_LABELS[r.source]}
                </td>
                <td className="px-4 py-3">
                  {r.urgency === "DRINGEND" ? (
                    <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                      Dringend
                    </span>
                  ) : (
                    <span className="text-zinc-500">Normal</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
                      STATUS_BADGE_CLASSES[r.status]
                    }`}
                  >
                    {STATUS_LABELS[r.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-zinc-700">
                  {r.assignedTo?.name ?? (
                    <span className="text-zinc-400">–</span>
                  )}
                </td>
                <td className="px-4 py-3 text-zinc-500">
                  {r.createdAt.toLocaleString("de-DE")}
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-zinc-500">
                  Keine Anfragen gefunden.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
