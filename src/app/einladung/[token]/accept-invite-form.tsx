"use client";

import { useActionState } from "react";
import { acceptInviteAction, type AcceptInviteState } from "./actions";

const initialState: AcceptInviteState = {};

export function AcceptInviteForm({ token }: { token: string }) {
  const boundAction = acceptInviteAction.bind(null, token);
  const [state, formAction, pending] = useActionState(
    boundAction,
    initialState
  );

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-zinc-700">
          Neues Passwort
        </label>
        <input
          type="password"
          name="password"
          required
          minLength={8}
          className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-700">
          Passwort wiederholen
        </label>
        <input
          type="password"
          name="passwordConfirm"
          required
          minLength={8}
          className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {state.error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60"
      >
        {pending ? "Wird gespeichert…" : "Passwort festlegen & loslegen"}
      </button>
    </form>
  );
}
