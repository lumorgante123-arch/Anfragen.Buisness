import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client.ts";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash("test1234", 10);

  const business = await prisma.business.upsert({
    where: { slug: "mustermann-sanitaer" },
    update: {},
    create: {
      name: "Mustermann Sanitär GmbH",
      slug: "mustermann-sanitaer",
      email: "info@mustermann-sanitaer.de",
      users: {
        create: [
          {
            name: "Max Mustermann",
            email: "max@mustermann-sanitaer.de",
            passwordHash,
            role: "OWNER",
          },
          {
            name: "Erika Beispiel",
            email: "erika@mustermann-sanitaer.de",
            passwordHash,
            role: "EMPLOYEE",
          },
        ],
      },
    },
    include: { users: true },
  });

  const employee = business.users.find((u) => u.role === "EMPLOYEE");

  const existingRequests = await prisma.request.count({
    where: { businessId: business.id },
  });

  if (existingRequests === 0) {
    await prisma.request.createMany({
      data: [
        {
          businessId: business.id,
          customerName: "Peter Kunde",
          customerEmail: "peter@example.com",
          customerPhone: "0151 23456789",
          address: "Musterstraße 1, 12345 Musterstadt",
          category: "Sanitär",
          description: "Die Küchenspüle ist verstopft und läuft nicht ab.",
          urgency: "DRINGEND",
          status: "NEU",
        },
        {
          businessId: business.id,
          customerName: "Sabine Schmidt",
          customerEmail: "sabine@example.com",
          category: "Heizung",
          description: "Heizung im Wohnzimmer wird nicht mehr richtig warm.",
          urgency: "NORMAL",
          status: "ZUGEWIESEN",
          assignedToId: employee?.id,
        },
      ],
    });
  }

  console.log("Seed abgeschlossen.");
  console.log("Login: max@mustermann-sanitaer.de / test1234");
  console.log(`Öffentliches Formular: /anfrage/${business.slug}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
