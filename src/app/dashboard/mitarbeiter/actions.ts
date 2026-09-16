"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireCurrentUser } from "@/lib/current-user";
import { hashPassword } from "@/lib/auth";
import { employeeSchema } from "@/lib/validation";

export type CreateEmployeeState = {
  error?: string;
  success?: boolean;
};

export async function createEmployeeAction(
  _prevState: CreateEmployeeState,
  formData: FormData
): Promise<CreateEmployeeState> {
  const user = await requireCurrentUser();
  if (user.role !== "OWNER") {
    return { error: "Nur Inhaber:innen können Mitarbeiter anlegen." };
  }

  const parsed = employeeSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." };
  }

  const existing = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });
  if (existing) {
    return { error: "Für diese E-Mail-Adresse existiert bereits ein Konto." };
  }

  const passwordHash = await hashPassword(parsed.data.password);
  await prisma.user.create({
    data: {
      businessId: user.businessId,
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash,
      role: "EMPLOYEE",
    },
  });

  revalidatePath("/dashboard/mitarbeiter");
  return { success: true };
}

export async function toggleEmployeeActiveAction(employeeId: string) {
  const user = await requireCurrentUser();
  if (user.role !== "OWNER") return;
  if (employeeId === user.id) return;

  const employee = await prisma.user.findFirst({
    where: { id: employeeId, businessId: user.businessId },
  });
  if (!employee) return;

  await prisma.user.update({
    where: { id: employee.id },
    data: { active: !employee.active },
  });

  revalidatePath("/dashboard/mitarbeiter");
}
