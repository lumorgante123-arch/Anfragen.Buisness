import Link from "next/link";

const FEATURES = [
  {
    title: "Anfrageformular für deine Website",
    text: "Kunden stellen ihre Anfrage über ein einfaches Formular – eingebettet auf deiner Website oder per direktem Link.",
  },
  {
    title: "Bestehendes Kontaktformular anbinden",
    text: "Läuft dein Kontaktformular schon über eine E-Mail-Adresse? Wir lesen das Postfach automatisch ein und sortieren neue Anfragen ins Dashboard ein.",
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
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-lg font-semibold tracking-tight">
            Anfragen<span className="text-blue-600">.Business</span>
          </span>
          <nav className="flex items-center gap-3 text-sm font-medium">
            <Link
              href="/login"
              className="rounded-md bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-700"
            >
              Anmelden
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-6 py-20 text-center">
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
            Kundenanfragen direkt von der Website ins Dashboard deines
            Handwerksbetriebs
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600">
            Anfragen.Business sammelt Anfragen von deiner Website oder deinem
            bestehenden Postfach, benachrichtigt den Kunden automatisch und
            lässt dich Aufträge im Team verteilen – vom Eingang bis zur
            Erledigung.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/login"
              className="rounded-md bg-blue-600 px-6 py-3 text-base font-semibold text-white hover:bg-blue-500"
            >
              Zum Dashboard anmelden
            </Link>
          </div>
        </section>

        <section className="border-t border-zinc-200 bg-white py-16">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature) => (
              <div key={feature.title}>
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
        © {new Date().getFullYear()} Anfragen.Business
      </footer>
    </div>
  );
}
