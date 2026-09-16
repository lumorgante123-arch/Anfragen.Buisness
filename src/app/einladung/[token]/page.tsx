import { prisma } from "@/lib/prisma";
import { AcceptInviteForm } from "./accept-invite-form";
import { Logo } from "@/components/logo";

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const user = await prisma.user.findUnique({
    where: { inviteToken: token },
    include: { business: true },
  });

  const valid =
    !!user &&
    !user.passwordHash &&
    !!user.inviteExpiresAt &&
    user.inviteExpiresAt > new Date();

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
        <Logo className="mb-6" />
        {valid ? (
          <>
            <h1 className="text-2xl font-semibold text-zinc-900">
              Willkommen bei Werklotse
            </h1>
            <p className="mt-1 text-sm text-zinc-600">
              {user!.business.name} – lege dein Passwort fest, um dein
              Dashboard zu aktivieren.
            </p>
            <AcceptInviteForm token={token} />
          </>
        ) : (
          <>
            <h1 className="text-xl font-semibold text-zinc-900">
              Link ungültig
            </h1>
            <p className="mt-2 text-sm text-zinc-600">
              Dieser Einladungslink ist abgelaufen oder wurde bereits
              verwendet. Bitte wende dich an den Betreiber von Werklotse für
              einen neuen Link.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
