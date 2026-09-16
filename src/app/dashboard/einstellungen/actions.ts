"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireCurrentUser } from "@/lib/current-user";
import { imapSettingsSchema } from "@/lib/validation";
import { syncBusinessMailbox } from "@/lib/email-ingest";

export type ImapSettingsState = {
  error?: string;
  success?: boolean;
};

export async function updateImapSettingsAction(
  _prevState: ImapSettingsState,
  formData: FormData
): Promise<ImapSettingsState> {
  const user = await requireCurrentUser();
  if (user.role !== "OWNER") {
    return { error: "Nur Inhaber:innen können das Postfach konfigurieren." };
  }

  const parsed = imapSettingsSchema.safeParse({
    imapEnabled: formData.get("imapEnabled") === "on",
    imapHost: formData.get("imapHost") || "",
    imapPort: formData.get("imapPort") || 993,
    imapSecure: formData.get("imapSecure") === "on",
    imapUser: formData.get("imapUser") || "",
    imapPass: formData.get("imapPass") || "",
    imapFolder: formData.get("imapFolder") || "",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." };
  }

  const data = parsed.data;

  if (data.imapEnabled && (!data.imapHost || !data.imapUser)) {
    return {
      error:
        "Bitte mindestens Server-Adresse und Benutzername angeben, um das Postfach zu aktivieren.",
    };
  }

  const existing = await prisma.business.findUnique({
    where: { id: user.businessId },
  });

  await prisma.business.update({
    where: { id: user.businessId },
    data: {
      imapEnabled: data.imapEnabled,
      imapHost: data.imapHost || null,
      imapPort: data.imapPort,
      imapSecure: data.imapSecure,
      imapUser: data.imapUser || null,
      // Leeres Passwort-Feld beim Speichern = vorhandenes Passwort behalten.
      imapPass: data.imapPass ? data.imapPass : existing?.imapPass ?? null,
      imapFolder: data.imapFolder || "INBOX",
    },
  });

  revalidatePath("/dashboard/einstellungen");
  return { success: true };
}

export type SyncNowState = {
  error?: string;
  success?: boolean;
  imported?: number;
};

export async function syncMailboxNowAction(
  _prevState: SyncNowState,
  _formData: FormData
): Promise<SyncNowState> {
  const user = await requireCurrentUser();

  const business = await prisma.business.findUnique({
    where: { id: user.businessId },
  });
  if (!business) {
    return { error: "Betrieb nicht gefunden." };
  }
  if (!business.imapEnabled) {
    return { error: "Postfach-Anbindung ist nicht aktiviert." };
  }

  const result = await syncBusinessMailbox(business);

  revalidatePath("/dashboard/einstellungen");
  revalidatePath("/dashboard/anfragen");

  if (result.error) {
    return { error: result.error };
  }
  return { success: true, imported: result.imported };
}
