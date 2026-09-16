"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-zinc-900">Anmelden</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Melde dich mit deinem Betriebskonto an.
        </p>

        <form action={formAction} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700">
              E-Mail
            </label>
            <input
              type="email"
              name="email"
              required
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700">
              Passwort
            </label>
            <input
              type="password"
              name="password"
              required
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
            {pending ? "Wird angemeldet…" : "Anmelden"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-500">
          Noch kein Zugang? Du bekommst von uns einen Einladungslink, sobald
          dein Betrieb eingerichtet ist.
        </p>
      </div>
    </div>
  );
}
