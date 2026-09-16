import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import { prisma } from "@/lib/prisma";

let transporter: Transporter | null | undefined;

function getTransporter() {
  if (transporter !== undefined) return transporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    transporter = null;
    return transporter;
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  return transporter;
}

type SendRawEmailInput = {
  recipient: string;
  subject: string;
  body: string;
};

/**
 * Verschickt eine E-Mail, ohne sie an eine Anfrage zu binden (z. B.
 * Einladungslinks). Ohne konfigurierte SMTP-Zugangsdaten wird der Versand
 * simuliert und nur geloggt.
 */
export async function sendRawEmail({
  recipient,
  subject,
  body,
}: SendRawEmailInput) {
  const client = getTransporter();

  if (!client) {
    console.log(`[Simulierte E-Mail an ${recipient}] ${subject}\n${body}`);
    return { success: true, simulated: true };
  }

  try {
    await client.sendMail({
      from:
        process.env.SMTP_FROM || "Anfragen.Business <no-reply@anfragen.business>",
      to: recipient,
      subject,
      text: body,
    });
    return { success: true, simulated: false };
  } catch (error) {
    console.error("E-Mail-Versand fehlgeschlagen:", error);
    return { success: false, simulated: false };
  }
}

type SendNotificationInput = {
  requestId: string;
  recipient: string;
  subject: string;
  body: string;
};

/**
 * Verschickt eine Benachrichtigung per E-Mail und protokolliert sie immer in
 * der Datenbank. Ohne konfigurierte SMTP-Zugangsdaten wird der Versand
 * simuliert, damit das Dashboard auch ohne Mailserver nutzbar ist.
 */
export async function sendNotification({
  requestId,
  recipient,
  subject,
  body,
}: SendNotificationInput) {
  const { success, simulated } = await sendRawEmail({ recipient, subject, body });

  await prisma.notification.create({
    data: {
      requestId,
      recipient,
      subject,
      body,
      success,
      simulated,
    },
  });

  return { success, simulated };
}
