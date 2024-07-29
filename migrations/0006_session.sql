-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_System" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "template" TEXT NOT NULL
);
INSERT INTO "new_System" ("id", "template") SELECT "id", "template" FROM "System";
DROP TABLE "System";
ALTER TABLE "new_System" RENAME TO "System";
CREATE UNIQUE INDEX "System_name_key" ON "System"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
