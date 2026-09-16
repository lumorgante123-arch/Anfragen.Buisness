import { prisma } from "@/lib/prisma";
import { requireCurrentUser } from "@/lib/current-user";
import { CreateEmployeeForm } from "./create-employee-form";
import { toggleEmployeeActiveAction } from "./actions";

export default async function MitarbeiterPage() {
  const user = await requireCurrentUser();

  const employees = await prisma.user.findMany({
    where: { businessId: user.businessId },
    orderBy: { createdAt: "asc" },
    include: {
      _count: { select: { assignedRequests: true } },
    },
  });

  return (
    <div>
      <h1 className="text-xl font-semibold text-zinc-900">Mitarbeiter</h1>
      <p className="mt-1 text-sm text-zinc-600">
        Lege Zugänge für dein Team an, damit ihr Anfragen untereinander
        verteilen könnt.
      </p>

      {user.role === "OWNER" && (
        <div className="mt-4 rounded-lg border border-zinc-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-zinc-700">
            Neuen Mitarbeiter hinzufügen
          </h2>
          <div className="mt-3">
            <CreateEmployeeForm />
          </div>
        </div>
      )}

      <div className="mt-6 overflow-hidden rounded-lg border border-zinc-200 bg-white">
        <table className="min-w-full divide-y divide-zinc-200 text-sm">
          <thead className="bg-zinc-50 text-left text-xs font-medium uppercase text-zinc-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">E-Mail</th>
              <th className="px-4 py-3">Rolle</th>
              <th className="px-4 py-3">Offene Zuweisungen</th>
              <th className="px-4 py-3">Status</th>
              {user.role === "OWNER" && <th className="px-4 py-3" />}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {employees.map((e) => (
              <tr key={e.id}>
                <td className="px-4 py-3 font-medium text-zinc-900">
                  {e.name}
                </td>
                <td className="px-4 py-3 text-zinc-700">{e.email}</td>
                <td className="px-4 py-3 text-zinc-700">
                  {e.role === "OWNER" ? "Inhaber:in" : "Mitarbeiter:in"}
                </td>
                <td className="px-4 py-3 text-zinc-700">
                  {e._count.assignedRequests}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      e.active
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {e.active ? "Aktiv" : "Deaktiviert"}
                  </span>
                </td>
                {user.role === "OWNER" && (
                  <td className="px-4 py-3 text-right">
                    {e.id !== user.id && e.role !== "OWNER" && (
                      <form
                        action={toggleEmployeeActiveAction.bind(null, e.id)}
                      >
                        <button
                          type="submit"
                          className="text-sm font-medium text-blue-600 hover:text-blue-500"
                        >
                          {e.active ? "Deaktivieren" : "Aktivieren"}
                        </button>
                      </form>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
