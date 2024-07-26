-- CreateTable
CREATE TABLE "System" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "template" TEXT NOT NULL,
    "sessionId" INTEGER NOT NULL,
    CONSTRAINT "System_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Chapter" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "template" TEXT NOT NULL,
    "rules" TEXT,
    "sessionId" INTEGER NOT NULL,
    CONSTRAINT "Chapter_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Session" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "author" TEXT,
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME
);

-- CreateIndex
CREATE UNIQUE INDEX "System_sessionId_key" ON "System"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_name_key" ON "Session"("name");
