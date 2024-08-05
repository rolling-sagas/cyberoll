-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Properties";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Property" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "value" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "sessionId" INTEGER NOT NULL,
    CONSTRAINT "Property_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
