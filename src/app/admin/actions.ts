"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin, destroyAdminSession } from "@/lib/admin-auth";
import { sendRawEmail } from "@/lib/mail";
import { createBusinessSchema } from "@/lib/validation";

const INVITE_TTL_DAYS = 14;

export type CreateBusinessState = {
  error?: string;
  inviteUrl?: string;
  emailSent?: boolean;
};

export async function adminLogoutAction() {
  await destroyAdminSession();
  redirect("/admin/login");
}

export async function createBusinessAction(
  _prevState: CreateBusinessState,
  formData: FormData
): Promise<CreateBusinessState> {
  await requireAdmin();

  const parsed = createBusinessSchema.safeParse({
    businessName: formData.get("businessName"),
    slug: formData.get("slug"),
    businessEmail: formData.get("businessEmail"),
    ownerName: formData.get("ownerName"),
    ownerEmail: formData.get("ownerEmail"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." };
  }

  const { businessName, slug, businessEmail, ownerName, ownerEmail } =
    parsed.data;

  const [existingSlug, existingEmail] = await Promise.all([
    prisma.business.findUnique({ where: { slug } }),
    prisma.user.findUnique({ where: { email: ownerEmail } }),
  ]);

  if (existingSlug) {
    return { error: "Diese Kurz-URL ist bereits vergeben." };
  }
  if (existingEmail) {
    return { error: "Für diese E-Mail-Adresse existiert bereits ein Konto." };
  }

  const inviteToken = randomBytes(32).toString("hex");
  const inviteExpiresAt = new Date(
    Date.now() + INVITE_TTL_DAYS * 24 * 60 * 60 * 1000
  );

  await prisma.business.create({
    data: {
      name: businessName,
      slug,
      email: businessEmail,
      users: {
        create: {
          name: ownerName,
          email: ownerEmail,
          role: "OWNER",
          passwordHash: null,
          inviteToken,
          inviteExpiresAt,
        },
      },
    },
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const inviteUrl = `${appUrl}/einladung/${inviteToken}`;

  const { success } = await sendRawEmail({
    recipient: ownerEmail,
    subject: `Zugang zu deinem Werklotse-Dashboard`,
    body: [
      `Hallo ${ownerName},`,
      "",
      `für ${businessName} wurde ein Dashboard bei Werklotse eingerichtet.`,
      `Lege dort dein Passwort fest, um loszulegen:`,
      "",
      inviteUrl,
      "",
      `Der Link ist ${INVITE_TTL_DAYS} Tage gültig.`,
    ].join("\n"),
  });

  revalidatePath("/admin");

  return { inviteUrl, emailSent: success };
}
