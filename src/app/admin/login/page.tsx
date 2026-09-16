"use client";

import { useActionState } from "react";
import { adminLoginAction, type AdminLoginState } from "./actions";
import { Logo } from "@/components/logo";

const initialState: AdminLoginState = {};

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(
    adminLoginAction,
    initialState
  );

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-4 py-12">
      <div className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
        <Logo className="mb-6" />
        <h1 className="text-2xl font-semibold text-zinc-900">Admin-Bereich</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Nur für den Betreiber von Werklotse.
        </p>

        <form action={formAction} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700">
              Admin-Passwort
            </label>
            <input
              type="password"
              name="password"
              required
              autoFocus
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
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
            className="w-full rounded-md bg-brand-800 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {pending ? "Wird geprüft…" : "Anmelden"}
          </button>
        </form>
      </div>
    </div>
  );
}
