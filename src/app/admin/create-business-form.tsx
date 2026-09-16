"use client";

import { useActionState, useEffect, useRef } from "react";
import { createBusinessAction, type CreateBusinessState } from "./actions";

const initialState: CreateBusinessState = {};

export function CreateBusinessForm() {
  const [state, formAction, pending] = useActionState(
    createBusinessAction,
    initialState
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.inviteUrl) {
      formRef.current?.reset();
    }
  }, [state.inviteUrl]);

  return (
    <div>
      <form
        ref={formRef}
        action={formAction}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        <div>
          <label className="block text-xs font-medium text-zinc-500">
            Name des Betriebs
          </label>
          <input
            name="businessName"
            required
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            placeholder="Mustermann Sanitär GmbH"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-500">
            Kurz-URL (/anfrage/…)
          </label>
          <input
            name="slug"
            required
            pattern="[a-z0-9\-]+"
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            placeholder="mustermann-sanitaer"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-500">
            Kontakt-E-Mail des Betriebs
          </label>
          <input
            type="email"
            name="businessEmail"
            required
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            placeholder="info@mustermann-sanitaer.de"
          />
        </div>
        <div />
        <div>
          <label className="block text-xs font-medium text-zinc-500">
            Name Inhaber:in
          </label>
          <input
            name="ownerName"
            required
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            placeholder="Max Mustermann"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-500">
            E-Mail Inhaber:in (Login)
          </label>
          <input
            type="email"
            name="ownerEmail"
            required
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            placeholder="max@mustermann-sanitaer.de"
          />
        </div>

        {state.error && (
          <p className="sm:col-span-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="sm:col-span-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60"
        >
          {pending ? "Wird angelegt…" : "Betrieb anlegen & Einladung senden"}
        </button>
      </form>

      {state.inviteUrl && (
        <div className="mt-4 rounded-md bg-green-50 p-4 text-sm text-green-800">
          <p className="font-medium">
            Betrieb angelegt
            {state.emailSent
              ? " – Einladung wurde per E-Mail verschickt."
              : " – E-Mail-Versand ist simuliert (kein SMTP konfiguriert), bitte Link manuell senden."}
          </p>
          <p className="mt-2 break-all rounded bg-white px-3 py-2 font-mono text-xs">
            {state.inviteUrl}
          </p>
        </div>
      )}
    </div>
  );
}
