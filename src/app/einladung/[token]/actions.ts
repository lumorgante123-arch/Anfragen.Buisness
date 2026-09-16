"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSession, hashPassword } from "@/lib/auth";
import { acceptInviteSchema } from "@/lib/validation";

export type AcceptInviteState = {
  error?: string;
};

export async function acceptInviteAction(
  token: string,
  _prevState: AcceptInviteState,
  formData: FormData
): Promise<AcceptInviteState> {
  const parsed = acceptInviteSchema.safeParse({
    password: formData.get("password"),
    passwordConfirm: formData.get("passwordConfirm"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." };
  }

  const user = await prisma.user.findUnique({ where: { inviteToken: token } });

  if (
    !user ||
    user.passwordHash ||
    !user.inviteExpiresAt ||
    user.inviteExpiresAt < new Date()
  ) {
    return {
      error: "Dieser Einladungslink ist ungültig oder wurde bereits verwendet.",
    };
  }

  const passwordHash = await hashPassword(parsed.data.password);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      inviteToken: null,
      inviteExpiresAt: null,
    },
  });

  await createSession({
    userId: user.id,
    businessId: user.businessId,
    role: user.role,
  });

  redirect("/dashboard");
}
