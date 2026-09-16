-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Business" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "imapEnabled" BOOLEAN NOT NULL DEFAULT false,
    "imapHost" TEXT,
    "imapPort" INTEGER NOT NULL DEFAULT 993,
    "imapSecure" BOOLEAN NOT NULL DEFAULT true,
    "imapUser" TEXT,
    "imapPass" TEXT,
    "imapFolder" TEXT NOT NULL DEFAULT 'INBOX',
    "lastEmailSyncAt" DATETIME,
    "lastEmailSyncError" TEXT
);
INSERT INTO "new_Business" ("createdAt", "email", "id", "name", "phone", "slug", "updatedAt") SELECT "createdAt", "email", "id", "name", "phone", "slug", "updatedAt" FROM "Business";
DROP TABLE "Business";
ALTER TABLE "new_Business" RENAME TO "Business";
CREATE UNIQUE INDEX "Business_slug_key" ON "Business"("slug");
CREATE TABLE "new_Request" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "businessId" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT,
    "address" TEXT,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "urgency" TEXT NOT NULL DEFAULT 'NORMAL',
    "status" TEXT NOT NULL DEFAULT 'NEU',
    "source" TEXT NOT NULL DEFAULT 'FORMULAR',
    "externalMessageId" TEXT,
    "assignedToId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Request_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Request_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Request" ("address", "assignedToId", "businessId", "category", "createdAt", "customerEmail", "customerName", "customerPhone", "description", "id", "status", "updatedAt", "urgency") SELECT "address", "assignedToId", "businessId", "category", "createdAt", "customerEmail", "customerName", "customerPhone", "description", "id", "status", "updatedAt", "urgency" FROM "Request";
DROP TABLE "Request";
ALTER TABLE "new_Request" RENAME TO "Request";
CREATE INDEX "Request_businessId_status_idx" ON "Request"("businessId", "status");
CREATE UNIQUE INDEX "Request_businessId_externalMessageId_key" ON "Request"("businessId", "externalMessageId");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "businessId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "role" TEXT NOT NULL DEFAULT 'EMPLOYEE',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "inviteToken" TEXT,
    "inviteExpiresAt" DATETIME,
    CONSTRAINT "User_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_User" ("active", "businessId", "createdAt", "email", "id", "name", "passwordHash", "role") SELECT "active", "businessId", "createdAt", "email", "id", "name", "passwordHash", "role" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_inviteToken_key" ON "User"("inviteToken");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
