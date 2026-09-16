"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireCurrentUser } from "@/lib/current-user";
import { sendNotification } from "@/lib/mail";
import { statusUpdateSchema } from "@/lib/validation";
import { STATUS_LABELS } from "@/lib/constants";

export type UpdateRequestState = {
  error?: string;
  success?: boolean;
};

export async function updateRequestAction(
  requestId: string,
  _prevState: UpdateRequestState,
  formData: FormData
): Promise<UpdateRequestState> {
  const user = await requireCurrentUser();

  const rawAssignedTo = formData.get("assignedToId");
  const parsed = statusUpdateSchema.safeParse({
    status: formData.get("status") || undefined,
    assignedToId: rawAssignedTo === "" ? null : rawAssignedTo,
    note: formData.get("note") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." };
  }

  const existing = await prisma.request.findFirst({
    where: { id: requestId, businessId: user.businessId },
    include: { business: true },
  });
  if (!existing) {
    return { error: "Anfrage nicht gefunden." };
  }

  const { status, assignedToId, note } = parsed.data;

  if (assignedToId) {
    const assignee = await prisma.user.findFirst({
      where: { id: assignedToId, businessId: user.businessId, active: true },
    });
    if (!assignee) {
      return { error: "Mitarbeiter nicht gefunden." };
    }
  }

  const nextStatus = status ?? existing.status;
  const statusChanged = nextStatus !== existing.status;
  const assignmentChanged = assignedToId !== undefined
    ? assignedToId !== existing.assignedToId
    : false;

  const updated = await prisma.request.update({
    where: { id: existing.id },
    data: {
      status: nextStatus,
      ...(assignedToId !== undefined ? { assignedToId } : {}),
      statusEvents: {
        create: {
          status: nextStatus,
          message: note || null,
          actorId: user.id,
        },
      },
    },
    include: { assignedTo: true },
  });

  if (statusChanged || assignmentChanged) {
    const lines = [
      `Hallo ${existing.customerName},`,
      "",
      `der Status deiner Anfrage bei ${existing.business.name} wurde aktualisiert.`,
      "",
      `Neuer Status: ${STATUS_LABELS[nextStatus]}`,
    ];
    if (assignmentChanged && updated.assignedTo) {
      lines.push(`Zuständig: ${updated.assignedTo.name}`);
    }
    if (note) {
      lines.push("", `Nachricht: ${note}`);
    }
    lines.push(
      "",
      `Status verfolgen: ${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }/status/${existing.id}`,
      "",
      `Viele Grüße`,
      existing.business.name
    );

    await sendNotification({
      requestId: existing.id,
      recipient: existing.customerEmail,
      subject: `Update zu deiner Anfrage bei ${existing.business.name}`,
      body: lines.join("\n"),
    });
  }

  revalidatePath(`/dashboard/anfragen/${existing.id}`);
  revalidatePath("/dashboard/anfragen");

  return { success: true };
}
