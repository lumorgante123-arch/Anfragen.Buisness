// Wird von Next.js beim Serverstart einmal ausgeführt (Node-Runtime).
// Startet einen periodischen Abruf aller aktivierten Postfächer, damit
// Anfragen aus bestehenden Kontaktformular-E-Mails automatisch importiert
// werden, ohne dass jemand manuell "Jetzt synchronisieren" klicken muss.
const SYNC_INTERVAL_MS = 5 * 60 * 1000; // 5 Minuten

export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  if (process.env.DISABLE_MAIL_POLLING === "true") return;

  let running = false;

  const runSync = async () => {
    if (running) return;
    running = true;
    try {
      const { syncAllMailboxes } = await import("@/lib/email-ingest");
      await syncAllMailboxes();
    } catch (error) {
      console.error("Postfach-Synchronisierung fehlgeschlagen:", error);
    } finally {
      running = false;
    }
  };

  setInterval(runSync, SYNC_INTERVAL_MS);
}
