-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Property" (
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "initial" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "sessionId" INTEGER NOT NULL,

    PRIMARY KEY ("name", "sessionId"),
    CONSTRAINT "Property_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Property" ("createdAt", "name", "sessionId", "type", "updatedAt", "value", "initial") SELECT "createdAt", "name", "sessionId", "type", "updatedAt", "value", "value" FROM "Property";
DROP TABLE "Property";
ALTER TABLE "new_Property" RENAME TO "Property";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
