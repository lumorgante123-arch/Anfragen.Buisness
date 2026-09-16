import { z } from "zod";
import { CATEGORIES } from "@/lib/constants";

export const publicRequestSchema = z.object({
  slug: z.string().min(1),
  customerName: z.string().trim().min(2, "Bitte gib deinen Namen an."),
  customerEmail: z.string().trim().email("Bitte gib eine gültige E-Mail-Adresse an."),
  customerPhone: z.string().trim().max(40).optional().or(z.literal("")),
  address: z.string().trim().max(200).optional().or(z.literal("")),
  category: z.enum(CATEGORIES),
  description: z.string().trim().min(10, "Bitte beschreibe dein Anliegen etwas genauer."),
  urgency: z.enum(["NORMAL", "DRINGEND"]).default("NORMAL"),
  // Honeypot-Feld gegen einfache Spam-Bots.
  website: z.string().max(0).optional().or(z.literal("")),
});

// Wird vom Admin genutzt, um einen neuen Betrieb samt Inhaber-Konto
// anzulegen. Der Inhaber bekommt keinen Passwort-Login vom Admin
// zugewiesen, sondern setzt sein Passwort selbst über den Einladungslink.
export const createBusinessSchema = z.object({
  businessName: z.string().trim().min(2, "Bitte gib den Namen des Betriebs an."),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(2)
    .regex(/^[a-z0-9-]+$/, "Nur Kleinbuchstaben, Ziffern und Bindestriche erlaubt."),
  businessEmail: z.string().trim().email(),
  ownerName: z.string().trim().min(2),
  ownerEmail: z.string().trim().email(),
});

export const acceptInviteSchema = z
  .object({
    password: z.string().min(8, "Das Passwort muss mindestens 8 Zeichen lang sein."),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Die Passwörter stimmen nicht überein.",
    path: ["passwordConfirm"],
  });

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export const employeeSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().email(),
  password: z.string().min(8, "Das Passwort muss mindestens 8 Zeichen lang sein."),
});

export const statusUpdateSchema = z.object({
  status: z.enum(["NEU", "ZUGEWIESEN", "IN_BEARBEITUNG", "ERLEDIGT", "STORNIERT"]).optional(),
  assignedToId: z.string().nullable().optional(),
  note: z.string().trim().max(2000).optional(),
});

export const imapSettingsSchema = z.object({
  imapEnabled: z.boolean(),
  imapHost: z.string().trim().max(200).optional().or(z.literal("")),
  imapPort: z.coerce.number().int().min(1).max(65535).default(993),
  imapSecure: z.boolean(),
  imapUser: z.string().trim().max(200).optional().or(z.literal("")),
  imapPass: z.string().trim().max(500).optional().or(z.literal("")),
  imapFolder: z.string().trim().max(200).optional().or(z.literal("")),
});
