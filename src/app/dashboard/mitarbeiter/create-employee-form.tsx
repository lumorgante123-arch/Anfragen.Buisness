"use client";

import { useActionState, useEffect, useRef } from "react";
import { createEmployeeAction, type CreateEmployeeState } from "./actions";

const initialState: CreateEmployeeState = {};

export function CreateEmployeeForm() {
  const [state, formAction, pending] = useActionState(
    createEmployeeAction,
    initialState
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-end"
    >
      <div>
        <label className="block text-xs font-medium text-zinc-500">Name</label>
        <input
          name="name"
          required
          className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-zinc-500">
          E-Mail
        </label>
        <input
          type="email"
          name="email"
          required
          className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-zinc-500">
          Passwort
        </label>
        <input
          type="password"
          name="password"
          required
          minLength={8}
          className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="h-fit rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60"
      >
        {pending ? "Wird angelegt…" : "Hinzufügen"}
      </button>

      {state.error && (
        <p className="sm:col-span-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}
    </form>
  );
}
