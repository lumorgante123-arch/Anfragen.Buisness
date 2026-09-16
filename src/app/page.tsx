import Link from "next/link";
import { Logo } from "@/components/logo";

const FEATURES = [
  {
    title: "Bestehendes Postfach anbinden",
    text: "Läuft euer Kontaktformular schon über eine E-Mail-Adresse? Wir lesen das Postfach automatisch aus und sortieren neue Anfragen ins Dashboard – an eurer Website ändert sich nichts.",
  },
  {
    title: "Alternativ: eigenes Formular",
    text: "Wer möchte, kann auch unser Anfrageformular einbinden – per Link oder direkt auf der Website.",
  },
  {
    title: "Mitarbeiter zuweisen",
    text: "Weise Anfragen direkt dem zuständigen Mitarbeiter zu und behalte den Bearbeitungsstatus im Blick.",
  },
  {
    title: "Kunden automatisch benachrichtigen",
    text: "Kunden erhalten automatisch eine Bestätigung sowie Updates, sobald sich der Status ihrer Anfrage ändert.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-brand-900/10 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Logo />
          <nav className="flex items-center gap-3 text-sm font-medium">
            <Link
              href="/login"
              className="rounded-full bg-brand-800 px-5 py-2 text-white transition-colors hover:bg-brand-700"
            >
              Anmelden
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden bg-brand-900 text-white">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(60% 60% at 80% 0%, rgba(240,164,17,0.25) 0%, transparent 60%), radial-gradient(50% 50% at 10% 100%, rgba(79,133,184,0.35) 0%, transparent 60%)",
            }}
          />
          <div className="relative mx-auto max-w-6xl px-6 py-24 text-center">
            <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium tracking-wide text-brand-100 uppercase">
              Für Handwerksbetriebe
            </span>
            <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
              Anfragen finden automatisch ihren Weg – zum richtigen
              Mitarbeiter, ohne Umwege
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-brand-100/90">
              Werklotse liest eure Kundenanfragen aus dem bestehenden
              E-Mail-Postfach oder Formular, sortiert sie in ein Dashboard und
              benachrichtigt eure Kunden automatisch – vom Eingang bis zur
              Erledigung.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link
                href="/login"
                className="rounded-full bg-accent-500 px-7 py-3 text-base font-semibold text-brand-900 shadow-lg shadow-accent-500/20 transition-colors hover:bg-accent-400"
              >
                Zum Dashboard anmelden
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-zinc-50 py-16">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm"
              >
                <h3 className="text-base font-semibold text-zinc-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-zinc-600">{feature.text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200 bg-white py-6 text-center text-sm text-zinc-500">
        © {new Date().getFullYear()} Werklotse
      </footer>
    </div>
  );
}
