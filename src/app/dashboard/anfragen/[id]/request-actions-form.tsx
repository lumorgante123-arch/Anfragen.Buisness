"use client";

import { useActionState } from "react";
import { updateRequestAction, type UpdateRequestState } from "./actions";
import { STATUS_LABELS, STATUS_ORDER } from "@/lib/constants";

const initialState: UpdateRequestState = {};

export function RequestActionsForm({
  requestId,
  currentStatus,
  currentAssignedToId,
  employees,
}: {
  requestId: string;
  currentStatus: string;
  currentAssignedToId: string | null;
  employees: { id: string; name: string }[];
}) {
  const boundAction = updateRequestAction.bind(null, requestId);
  const [state, formAction, pending] = useActionState(
    boundAction,
    initialState
  );

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-zinc-500">
          Status
        </label>
        <select
          name="status"
          defaultValue={currentStatus}
          className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
        >
          {STATUS_ORDER.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-500">
          Zuweisen an
        </label>
        <select
          name="assignedToId"
          defaultValue={currentAssignedToId ?? ""}
          className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
        >
          <option value="">Nicht zugewiesen</option>
          {employees.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-500">
          Notiz (optional, wird bei Status-/Zuweisungsänderung an den Kunden
          mitgesendet)
        </label>
        <textarea
          name="note"
          rows={3}
          className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
          placeholder="z. B. Termin am Donnerstag, 14 Uhr"
        />
      </div>

      {state.error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
          Gespeichert.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60"
      >
        {pending ? "Speichern…" : "Speichern"}
      </button>
    </form>
  );
}
