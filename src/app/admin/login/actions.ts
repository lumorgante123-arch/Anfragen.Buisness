"use server";

import { redirect } from "next/navigation";
import { checkAdminPassword, createAdminSession } from "@/lib/admin-auth";

export type AdminLoginState = {
  error?: string;
};

export async function adminLoginAction(
  _prevState: AdminLoginState,
  formData: FormData
): Promise<AdminLoginState> {
  const password = String(formData.get("password") || "");

  if (!process.env.ADMIN_PASSWORD) {
    return {
      error:
        "ADMIN_PASSWORD ist auf dem Server nicht gesetzt. Bitte in der .env konfigurieren.",
    };
  }

  if (!password || !checkAdminPassword(password)) {
    return { error: "Falsches Passwort." };
  }

  await createAdminSession();
  redirect("/admin");
}
