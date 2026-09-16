# Anfragen.Business

Tool für Handwerksbetriebe: Kundenanfragen landen zentral in einem
Dashboard, der Kunde wird automatisch benachrichtigt, und der Betrieb kann
Anfragen an Mitarbeiter zuweisen.

## Wie Betriebe reinkommen

Betriebe registrieren sich nicht selbst. Der Betreiber (du) legt jeden
Betrieb im Admin-Bereich an und bekommt dabei einen Einladungslink, den er
an den Betrieb schickt:

1. `/admin/login` – Login mit dem `ADMIN_PASSWORD` aus der `.env`.
2. `/admin` – Betrieb anlegen (Name, Kurz-URL, Kontakt-E-Mail, Inhaber:in).
   Es wird automatisch ein Einladungslink erzeugt (und – falls SMTP
   konfiguriert ist – direkt an die Inhaber-E-Mail verschickt).
3. Der Betrieb öffnet den Link unter `/einladung/[token]`, vergibt sein
   eigenes Passwort und landet direkt im eigenen Dashboard.

## Wie Anfragen reinkommen

Zwei Wege, die sich kombinieren lassen:

- **Formular/Widget**: Jeder Betrieb hat ein Anfrageformular unter
  `/anfrage/[slug]`. Einbindung auf der eigenen Website per iframe oder per
  `<script src=".../widget.js" data-slug="...">` – Code dafür steht unter
  „Einstellungen“ im Dashboard. Absenden ruft den öffentlichen Endpunkt
  `POST /api/public/requests` auf (CORS-offen, damit auch ein eigenes
  Formular auf der Betriebs-Website direkt dorthin posten kann).
- **Bestehendes Kontaktformular per E-Mail**: Läuft das alte
  Kontaktformular des Betriebs über ein Postfach, kann der Betrieb unter
  „Einstellungen“ IMAP-Zugangsdaten hinterlegen. Ein Hintergrundjob
  (`src/instrumentation.ts`, alle 5 Minuten) holt neue, ungelesene E-Mails
  ab und legt daraus automatisch Anfragen an; zusätzlich gibt es einen
  „Jetzt synchronisieren“-Button für den sofortigen Abruf.

In beiden Fällen bekommt der Kunde automatisch eine Bestätigungsmail mit
einem Link zur Status-Verfolgung (`/status/[id]`), und weitere E-Mails bei
Status-/Zuweisungsänderungen im Dashboard.

## Setup

```bash
npm install
cp .env.example .env   # Werte anpassen, v. a. SESSION_SECRET und ADMIN_PASSWORD
npm run db:migrate     # Datenbank anlegen
npm run db:seed        # optional: Demo-Betrieb samt Login anlegen
npm run dev
```

Der Seed legt einen Demo-Betrieb an: Login `max@mustermann-sanitaer.de` /
`test1234`, Formular unter `/anfrage/mustermann-sanitaer`.

### Wichtige Umgebungsvariablen (`.env`)

| Variable | Zweck |
| --- | --- |
| `DATABASE_URL` | SQLite-Datei (Standard: `file:./dev.db`) |
| `SESSION_SECRET` | Signiert Login- und Admin-Session-Cookies |
| `ADMIN_PASSWORD` | Passwort für `/admin` |
| `SMTP_*` | Optional: echter Mailversand. Ohne diese Werte werden E-Mails simuliert und nur im Dashboard protokolliert |
| `NEXT_PUBLIC_APP_URL` | Basis-URL für Links in E-Mails |

**Hinweis zur Sicherheit:** IMAP-Zugangsdaten werden aktuell unverschlüsselt
in der Datenbank gespeichert. Für einen Produktivbetrieb sollte das
Passwort-Feld vor dem Speichern verschlüsselt werden (z. B. über ein
KMS/Secret-Management).

## Tech-Stack

Next.js (App Router, TypeScript) · Prisma/SQLite · Tailwind CSS ·
IMAP-Import über `imapflow`/`mailparser` · E-Mail-Versand über `nodemailer`.
