import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireCurrentUser } from "@/lib/current-user";
import {
  STATUS_LABELS,
  STATUS_BADGE_CLASSES,
  URGENCY_LABELS,
  SOURCE_LABELS,
} from "@/lib/constants";
import { RequestActionsForm } from "./request-actions-form";

export default async function RequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireCurrentUser();
  const { id } = await params;

  const [request, employees] = await Promise.all([
    prisma.request.findFirst({
      where: { id, businessId: user.businessId },
      include: {
        assignedTo: true,
        statusEvents: {
          orderBy: { createdAt: "desc" },
          include: { actor: { select: { name: true } } },
        },
        notifications: { orderBy: { createdAt: "desc" } },
      },
    }),
    prisma.user.findMany({
      where: { businessId: user.businessId, active: true },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!request) {
    notFound();
  }

  return (
    <div>
      <Link
        href="/dashboard/anfragen"
        className="text-sm text-zinc-500 hover:text-zinc-800"
      >
        ← Zurück zur Übersicht
      </Link>

      <div className="mt-2 flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900">
            {request.customerName}
          </h1>
          <p className="text-sm text-zinc-500">
            {request.customerEmail}
            {request.customerPhone ? ` · ${request.customerPhone}` : ""}
          </p>
        </div>
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${
            STATUS_BADGE_CLASSES[request.status]
          }`}
        >
          {STATUS_LABELS[request.status]}
        </span>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-lg border border-zinc-200 bg-white p-5">
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-zinc-500">Kategorie</dt>
                <dd className="font-medium text-zinc-900">
                  {request.category}
                </dd>
              </div>
              <div>
                <dt className="text-zinc-500">Dringlichkeit</dt>
                <dd className="font-medium text-zinc-900">
                  {URGENCY_LABELS[request.urgency]}
                </dd>
              </div>
              <div>
                <dt className="text-zinc-500">Quelle</dt>
                <dd className="font-medium text-zinc-900">
                  {SOURCE_LABELS[request.source]}
                </dd>
              </div>
              <div>
                <dt className="text-zinc-500">Adresse</dt>
                <dd className="font-medium text-zinc-900">
                  {request.address || "–"}
                </dd>
              </div>
              <div>
                <dt className="text-zinc-500">Eingegangen am</dt>
                <dd className="font-medium text-zinc-900">
                  {request.createdAt.toLocaleString("de-DE")}
                </dd>
              </div>
            </dl>
            <div className="mt-4">
              <p className="text-sm text-zinc-500">Nachricht des Kunden</p>
              <p className="mt-1 whitespace-pre-wrap text-sm text-zinc-800">
                {request.description}
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-zinc-700">Verlauf</h2>
            <ol className="mt-3 space-y-4 border-l border-zinc-200 pl-4">
              {request.statusEvents.map((event) => (
                <li key={event.id}>
                  <p className="text-sm font-medium text-zinc-900">
                    {STATUS_LABELS[event.status]}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {event.createdAt.toLocaleString("de-DE")}
                    {event.actor ? ` · ${event.actor.name}` : ""}
                  </p>
                  {event.message && (
                    <p className="mt-1 text-sm text-zinc-700">
                      {event.message}
                    </p>
                  )}
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-zinc-700">
              Benachrichtigungen an den Kunden
            </h2>
            <ul className="mt-3 space-y-3">
              {request.notifications.map((n) => (
                <li key={n.id} className="text-sm">
                  <p className="font-medium text-zinc-900">{n.subject}</p>
                  <p className="text-xs text-zinc-500">
                    an {n.recipient} · {n.createdAt.toLocaleString("de-DE")}
                    {n.simulated ? " · simuliert (kein SMTP konfiguriert)" : ""}
                    {!n.success ? " · Versand fehlgeschlagen" : ""}
                  </p>
                </li>
              ))}
              {request.notifications.length === 0 && (
                <p className="text-sm text-zinc-500">
                  Noch keine Benachrichtigungen.
                </p>
              )}
            </ul>
          </div>
        </div>

        <div>
          <div className="rounded-lg border border-zinc-200 bg-white p-5">
            <h2 className="mb-4 text-sm font-semibold text-zinc-700">
              Bearbeiten
            </h2>
            <RequestActionsForm
              requestId={request.id}
              currentStatus={request.status}
              currentAssignedToId={request.assignedToId}
              employees={employees}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
