import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { RequestForm } from "./request-form";

export default async function PublicRequestPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const business = await prisma.business.findUnique({
    where: { slug },
    select: { name: true, slug: true },
  });

  if (!business) {
    notFound();
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-4 py-10">
      <div className="w-full max-w-lg rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-zinc-900">
          Anfrage an {business.name}
        </h1>
        <p className="mt-1 text-sm text-zinc-600">
          Beschreibe dein Anliegen – wir melden uns so schnell wie möglich bei
          dir.
        </p>

        <RequestForm slug={business.slug} />
      </div>
    </div>
  );
}
