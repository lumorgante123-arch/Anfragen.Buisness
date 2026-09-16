import "server-only";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function requireCurrentUser() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { business: true },
  });

  if (!user || !user.active) {
    redirect("/login");
  }

  return user;
}
