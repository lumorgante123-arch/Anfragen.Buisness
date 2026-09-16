import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  STATUS_LABELS,
  STATUS_BADGE_CLASSES,
  URGENCY_LABELS,
} from "@/lib/constants";

export default async function StatusPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const request = await prisma.request.findUnique({
    where: { id },
    include: {
      business: { select: { name: true } },
      statusEvents: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!request) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-10">
      <p className="text-sm text-zinc-500">{request.business.name}</p>
      <h1 className="mt-1 text-2xl font-semibold text-zinc-900">
        Status deiner Anfrage
      </h1>

      <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-zinc-500">Kategorie</p>
            <p className="font-medium text-zinc-900">{request.category}</p>
          </div>
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${
              STATUS_BADGE_CLASSES[request.status]
            }`}
          >
            {STATUS_LABELS[request.status]}
          </span>
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-zinc-500">Eingegangen am</dt>
            <dd className="text-zinc-900">
              {request.createdAt.toLocaleString("de-DE")}
            </dd>
          </div>
          <div>
            <dt className="text-zinc-500">Dringlichkeit</dt>
            <dd className="text-zinc-900">
              {URGENCY_LABELS[request.urgency]}
            </dd>
          </div>
        </dl>

        <div className="mt-4">
          <p className="text-sm text-zinc-500">Deine Nachricht</p>
          <p className="mt-1 whitespace-pre-wrap text-sm text-zinc-800">
            {request.description}
          </p>
        </div>
      </div>

      <h2 className="mt-8 text-sm font-semibold text-zinc-700">Verlauf</h2>
      <ol className="mt-3 space-y-3 border-l border-zinc-200 pl-4">
        {request.statusEvents.map((event) => (
          <li key={event.id}>
            <p className="text-sm font-medium text-zinc-900">
              {STATUS_LABELS[event.status]}
            </p>
            <p className="text-xs text-zinc-500">
              {event.createdAt.toLocaleString("de-DE")}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
