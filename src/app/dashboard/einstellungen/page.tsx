import { requireCurrentUser } from "@/lib/current-user";
import { CopyButton } from "./copy-button";
import { MailboxSettingsForm } from "./mailbox-settings-form";

export default async function EinstellungenPage() {
  const user = await requireCurrentUser();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const formUrl = `${appUrl}/anfrage/${user.business.slug}`;
  const iframeSnippet = `<iframe src="${formUrl}" style="width:100%;max-width:560px;height:780px;border:0;" title="Anfrageformular"></iframe>`;
  const scriptSnippet = `<script src="${appUrl}/widget.js" data-slug="${user.business.slug}"></script>`;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-zinc-900">Einstellungen</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Betriebsdaten und Einbindung des Anfrageformulars auf deiner
          Website.
        </p>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-zinc-700">Betrieb</h2>
        <dl className="mt-3 grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-zinc-500">Name</dt>
            <dd className="font-medium text-zinc-900">{user.business.name}</dd>
          </div>
          <div>
            <dt className="text-zinc-500">Kontakt-E-Mail</dt>
            <dd className="font-medium text-zinc-900">
              {user.business.email}
            </dd>
          </div>
        </dl>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-zinc-700">
          Direkter Link zum Anfrageformular
        </h2>
        <p className="mt-1 text-sm text-zinc-600">
          Verlinke diese Seite z. B. im Kontaktbereich deiner Website oder in
          E-Mails.
        </p>
        <div className="mt-3 flex items-center gap-2">
          <code className="flex-1 overflow-x-auto rounded-md bg-zinc-100 px-3 py-2 text-xs">
            {formUrl}
          </code>
          <CopyButton text={formUrl} />
        </div>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-zinc-700">
          Formular per iframe einbetten
        </h2>
        <p className="mt-1 text-sm text-zinc-600">
          Füge diesen Code an der Stelle in deine Website ein, an der das
          Formular erscheinen soll.
        </p>
        <div className="mt-3 flex items-start gap-2">
          <code className="flex-1 overflow-x-auto whitespace-pre-wrap break-all rounded-md bg-zinc-100 px-3 py-2 text-xs">
            {iframeSnippet}
          </code>
          <CopyButton text={iframeSnippet} />
        </div>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-zinc-700">
          Alternative: Einzeiliges Script
        </h2>
        <p className="mt-1 text-sm text-zinc-600">
          Fügt das Formular automatisch als responsives iframe ein.
        </p>
        <div className="mt-3 flex items-start gap-2">
          <code className="flex-1 overflow-x-auto whitespace-pre-wrap break-all rounded-md bg-zinc-100 px-3 py-2 text-xs">
            {scriptSnippet}
          </code>
          <CopyButton text={scriptSnippet} />
        </div>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-zinc-700">
          Bestehendes Kontaktformular per E-Mail einlesen
        </h2>
        <p className="mt-1 text-sm text-zinc-600">
          Läuft euer bisheriges Kontaktformular über ein E-Mail-Postfach,
          können wir es per IMAP abrufen. Neue, ungelesene E-Mails werden
          automatisch als Anfragen importiert und der Absender bekommt eine
          Eingangsbestätigung.
        </p>
        <div className="mt-4">
          {user.role === "OWNER" ? (
            <MailboxSettingsForm
              imapEnabled={user.business.imapEnabled}
              imapHost={user.business.imapHost ?? ""}
              imapPort={user.business.imapPort}
              imapSecure={user.business.imapSecure}
              imapUser={user.business.imapUser ?? ""}
              imapFolder={user.business.imapFolder}
              hasPassword={!!user.business.imapPass}
              imapConfigured={
                user.business.imapEnabled &&
                !!user.business.imapHost &&
                !!user.business.imapUser
              }
              lastEmailSyncAt={
                user.business.lastEmailSyncAt
                  ? user.business.lastEmailSyncAt.toLocaleString("de-DE")
                  : null
              }
              lastEmailSyncError={user.business.lastEmailSyncError}
            />
          ) : (
            <p className="text-sm text-zinc-500">
              Nur Inhaber:innen können das Postfach konfigurieren.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
