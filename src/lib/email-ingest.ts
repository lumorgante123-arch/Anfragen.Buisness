import "server-only";
import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";
import { prisma } from "@/lib/prisma";
import { sendNotification } from "@/lib/mail";
import type { Business } from "@/generated/prisma/client";

export type SyncResult = { imported: number; error?: string };

/**
 * Ruft das per IMAP verbundene Postfach eines Betriebs ab (z. B. das
 * Postfach, an das das bisherige Kontaktformular der Website sendet) und
 * legt für jede ungelesene E-Mail eine neue Anfrage im Dashboard an.
 */
export async function syncBusinessMailbox(
  business: Business
): Promise<SyncResult> {
  if (
    !business.imapEnabled ||
    !business.imapHost ||
    !business.imapUser ||
    !business.imapPass
  ) {
    return { imported: 0 };
  }

  const client = new ImapFlow({
    host: business.imapHost,
    port: business.imapPort,
    secure: business.imapSecure,
    auth: { user: business.imapUser, pass: business.imapPass },
    logger: false,
  });

  let imported = 0;

  try {
    await client.connect();
    const lock = await client.getMailboxLock(business.imapFolder || "INBOX");

    try {
      const found = await client.search({ seen: false });
      const seqNumbers = found ? found : [];

      for (const seq of seqNumbers) {
        const message = await client.fetchOne(seq, { source: true });
        if (!message || !message.source) continue;

        const parsed = await simpleParser(message.source);
        const messageId =
          parsed.messageId || `${business.id}-seq-${seq}-${Date.now()}`;
        const fromAddress =
          parsed.from?.value?.[0]?.address?.toLowerCase() || business.email;
        const fromName = parsed.from?.value?.[0]?.name || fromAddress;
        const subject = parsed.subject || "Anfrage per E-Mail";
        const bodyText =
          parsed.text ||
          (typeof parsed.html === "string" ? parsed.html : "") ||
          "(kein Inhalt)";

        const existing = await prisma.request.findFirst({
          where: { businessId: business.id, externalMessageId: messageId },
        });

        if (!existing) {
          const request = await prisma.request.create({
            data: {
              businessId: business.id,
              customerName: fromName,
              customerEmail: fromAddress,
              category: "Sonstiges",
              description: `Betreff: ${subject}\n\n${bodyText}`.trim(),
              source: "EMAIL",
              externalMessageId: messageId,
              status: "NEU",
              statusEvents: {
                create: {
                  status: "NEU",
                  message: "Automatisch aus eingehender E-Mail importiert.",
                },
              },
            },
          });

          imported += 1;

          const appUrl =
            process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
          await sendNotification({
            requestId: request.id,
            recipient: fromAddress,
            subject: `Deine Anfrage bei ${business.name} ist eingegangen`,
            body: [
              `Hallo ${fromName},`,
              "",
              `vielen Dank für deine Anfrage bei ${business.name}. Wir haben sie erhalten und melden uns in Kürze bei dir.`,
              "",
              `Status verfolgen: ${appUrl}/status/${request.id}`,
              "",
              `Viele Grüße`,
              business.name,
            ].join("\n"),
          });
        }

        await client.messageFlagsAdd(seq, ["\\Seen"]);
      }
    } finally {
      lock.release();
    }

    await client.logout();

    await prisma.business.update({
      where: { id: business.id },
      data: { lastEmailSyncAt: new Date(), lastEmailSyncError: null },
    });

    return { imported };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unbekannter Fehler beim Postfach-Abruf.";
    await prisma.business
      .update({
        where: { id: business.id },
        data: { lastEmailSyncAt: new Date(), lastEmailSyncError: message },
      })
      .catch(() => {});
    try {
      await client.logout();
    } catch {
      // Verbindung war ohnehin bereits fehlgeschlagen.
    }
    return { imported, error: message };
  }
}

export async function syncAllMailboxes() {
  const businesses = await prisma.business.findMany({
    where: { imapEnabled: true },
  });

  for (const business of businesses) {
    await syncBusinessMailbox(business);
  }
}
