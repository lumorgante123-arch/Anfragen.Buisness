import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendNotification } from "@/lib/mail";
import { publicRequestSchema } from "@/lib/validation";

// Öffentlicher, ungeschützter Endpunkt: Handwerksbetriebe binden ihr
// Anfrageformular auf der eigenen Website ein und senden Anfragen direkt
// hierher (z. B. per fetch() aus einem eingebetteten Formular).
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(req: NextRequest) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Ungültiger Request-Body." },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const parsed = publicRequestSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const data = parsed.data;

  // Honeypot-Feld: Bots füllen üblicherweise auch versteckte Felder aus.
  if (data.website) {
    return NextResponse.json({ ok: true }, { headers: CORS_HEADERS });
  }

  const business = await prisma.business.findUnique({
    where: { slug: data.slug },
  });
  if (!business) {
    return NextResponse.json(
      { error: "Unbekannter Betrieb." },
      { status: 404, headers: CORS_HEADERS }
    );
  }

  const request = await prisma.request.create({
    data: {
      businessId: business.id,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone || null,
      address: data.address || null,
      category: data.category,
      description: data.description,
      urgency: data.urgency,
      status: "NEU",
      statusEvents: {
        create: { status: "NEU", message: "Anfrage über die Website eingegangen." },
      },
    },
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const statusUrl = `${appUrl}/status/${request.id}`;

  await sendNotification({
    requestId: request.id,
    recipient: data.customerEmail,
    subject: `Deine Anfrage bei ${business.name} ist eingegangen`,
    body: [
      `Hallo ${data.customerName},`,
      "",
      `vielen Dank für deine Anfrage bei ${business.name}. Wir haben sie erhalten und melden uns in Kürze bei dir.`,
      "",
      `Kategorie: ${data.category}`,
      `Deine Nachricht: ${data.description}`,
      "",
      `Den aktuellen Status deiner Anfrage kannst du jederzeit hier einsehen:`,
      statusUrl,
      "",
      `Viele Grüße`,
      business.name,
    ].join("\n"),
  });

  await sendNotification({
    requestId: request.id,
    recipient: business.email,
    subject: `Neue Anfrage von ${data.customerName}`,
    body: [
      `Es ist eine neue Anfrage eingegangen.`,
      "",
      `Kunde: ${data.customerName}`,
      `E-Mail: ${data.customerEmail}`,
      data.customerPhone ? `Telefon: ${data.customerPhone}` : null,
      data.address ? `Adresse: ${data.address}` : null,
      `Kategorie: ${data.category}`,
      `Dringlichkeit: ${data.urgency === "DRINGEND" ? "Dringend" : "Normal"}`,
      "",
      `Nachricht:`,
      data.description,
      "",
      `Im Dashboard ansehen: ${appUrl}/dashboard/anfragen/${request.id}`,
    ]
      .filter(Boolean)
      .join("\n"),
  });

  return NextResponse.json(
    { ok: true, id: request.id, statusUrl },
    { headers: CORS_HEADERS }
  );
}
