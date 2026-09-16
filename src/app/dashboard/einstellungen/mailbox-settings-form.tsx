"use client";

import { useActionState } from "react";
import {
  updateImapSettingsAction,
  syncMailboxNowAction,
  type ImapSettingsState,
  type SyncNowState,
} from "./actions";

const settingsInitialState: ImapSettingsState = {};
const syncInitialState: SyncNowState = {};

type Props = {
  imapEnabled: boolean;
  imapHost: string;
  imapPort: number;
  imapSecure: boolean;
  imapUser: string;
  imapFolder: string;
  hasPassword: boolean;
  imapConfigured: boolean;
  lastEmailSyncAt: string | null;
  lastEmailSyncError: string | null;
};

export function MailboxSettingsForm({
  imapEnabled,
  imapHost,
  imapPort,
  imapSecure,
  imapUser,
  imapFolder,
  hasPassword,
  imapConfigured,
  lastEmailSyncAt,
  lastEmailSyncError,
}: Props) {
  const [state, formAction, pending] = useActionState(
    updateImapSettingsAction,
    settingsInitialState
  );
  const [syncState, syncAction, syncPending] = useActionState(
    syncMailboxNowAction,
    syncInitialState
  );

  return (
    <div className="space-y-4">
      <form action={formAction} className="space-y-4">
        <label className="flex items-center gap-2 text-sm font-medium text-zinc-700">
          <input
            type="checkbox"
            name="imapEnabled"
            defaultChecked={imapEnabled}
            className="h-4 w-4 rounded border-zinc-300"
          />
          Postfach-Anbindung aktivieren
        </label>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-zinc-500">
              IMAP-Server
            </label>
            <input
              name="imapHost"
              defaultValue={imapHost}
              placeholder="imap.strato.de"
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500">
              Port
            </label>
            <input
              name="imapPort"
              type="number"
              defaultValue={imapPort}
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500">
              Benutzername
            </label>
            <input
              name="imapUser"
              defaultValue={imapUser}
              placeholder="kontakt@mustermann-sanitaer.de"
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500">
              Passwort {hasPassword && "(bereits gespeichert – leer lassen zum Beibehalten)"}
            </label>
            <input
              name="imapPass"
              type="password"
              placeholder={hasPassword ? "••••••••" : ""}
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500">
              Ordner
            </label>
            <input
              name="imapFolder"
              defaultValue={imapFolder}
              placeholder="INBOX"
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            />
          </div>
          <label className="flex items-center gap-2 self-end text-sm text-zinc-700">
            <input
              type="checkbox"
              name="imapSecure"
              defaultChecked={imapSecure}
              className="h-4 w-4 rounded border-zinc-300"
            />
            SSL/TLS verwenden
          </label>
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
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60"
        >
          {pending ? "Speichern…" : "Speichern"}
        </button>
      </form>

      <div className="border-t border-zinc-200 pt-4">
        <p className="text-xs text-zinc-500">
          {lastEmailSyncAt
            ? `Letzter Abruf: ${lastEmailSyncAt}`
            : "Noch kein Abruf durchgeführt."}
          {lastEmailSyncError && (
            <span className="ml-2 text-red-600">Fehler: {lastEmailSyncError}</span>
          )}
        </p>
        <form action={syncAction} className="mt-2">
          <button
            type="submit"
            disabled={syncPending || !imapConfigured}
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 disabled:opacity-50"
          >
            {syncPending ? "Synchronisiert…" : "Jetzt synchronisieren"}
          </button>
          {syncState.error && (
            <p className="mt-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {syncState.error}
            </p>
          )}
          {syncState.success && (
            <p className="mt-2 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
              {syncState.imported
                ? `${syncState.imported} neue Anfrage(n) importiert.`
                : "Keine neuen E-Mails gefunden."}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
