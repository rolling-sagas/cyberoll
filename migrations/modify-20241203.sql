-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "GameSession";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Message";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "StorySession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "stats" TEXT NOT NULL,
    "skills" TEXT NOT NULL,
    "items" TEXT,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "backstory" TEXT,
    "occupation" TEXT,
    "storyName" TEXT,
    "storyId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "chapterId" TEXT,
    CONSTRAINT "StorySession_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "StorySession_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StoryMessage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "template" TEXT,
    "entry" BOOLEAN NOT NULL DEFAULT false,
    "chapterId" TEXT NOT NULL,
    "hash" TEXT,
    "sessionId" TEXT,
    "author" TEXT,
    CONSTRAINT "StoryMessage_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "StorySession" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Chapter" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "initial" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "description" TEXT,
    "maxTurns" INTEGER NOT NULL,
    "nextChapter" TEXT NOT NULL,
    "first" BOOLEAN NOT NULL,
    "previous" TEXT,
    "cover" TEXT,
    "rulesChunk" TEXT,
    "storyId" TEXT NOT NULL,
    CONSTRAINT "Chapter_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Chapter" ("cover", "createdAt", "description", "first", "id", "initial", "maxTurns", "name", "nextChapter", "previous", "rulesChunk", "updatedAt", "storyId") SELECT "cover", "createdAt", "description", "first", "id", "initial", "maxTurns", "name", "nextChapter", "previous", "rulesChunk", "updatedAt", "story" FROM "Chapter";
DROP TABLE "Chapter";
ALTER TABLE "new_Chapter" RENAME TO "Chapter";
CREATE TABLE "new_Comment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "commentBy" TEXT,
    "content" TEXT NOT NULL,
    "storyId" TEXT,
    CONSTRAINT "Comment_commentBy_fkey" FOREIGN KEY ("commentBy") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Comment_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Comment" ("commentBy", "content", "createdAt", "id") SELECT "commentBy", "content", "createdAt", "id" FROM "Comment";
DROP TABLE "Comment";
ALTER TABLE "new_Comment" RENAME TO "Comment";
CREATE TABLE "new_Like" (
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "likedBy" TEXT NOT NULL,
    "storyId" TEXT NOT NULL,

    PRIMARY KEY ("likedBy", "storyId"),
    CONSTRAINT "Like_likedBy_fkey" FOREIGN KEY ("likedBy") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Like_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Like" ("createdAt", "likedBy") SELECT "createdAt", "likedBy" FROM "Like";
DROP TABLE "Like";
ALTER TABLE "new_Like" RENAME TO "Like";
CREATE TABLE "new_Occupation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "stats" TEXT,
    "skills" TEXT,
    "items" TEXT,
    "backstory" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "cover" TEXT,
    "storyId" TEXT,
    CONSTRAINT "Occupation_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Occupation" ("backstory", "cover", "createdAt", "id", "items", "name", "skills", "stats", "updatedAt", "storyId") SELECT "backstory", "cover", "createdAt", "id", "items", "name", "skills", "stats", "updatedAt", "story" FROM "Occupation";
DROP TABLE "Occupation";
ALTER TABLE "new_Occupation" RENAME TO "Occupation";
CREATE TABLE "new_Story" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "cover" TEXT,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "keepPrivate" BOOLEAN NOT NULL DEFAULT false,
    "template" TEXT,
    "authorId" TEXT NOT NULL,
    CONSTRAINT "Story_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Story" ("cover", "createdAt", "description", "id", "keepPrivate", "name", "template", "updatedAt", "authorId") SELECT "cover", "createdAt", "description", "id", "keepPrivate", "name", "template", "updatedAt", "author" FROM "Story";
DROP TABLE "Story";
ALTER TABLE "new_Story" RENAME TO "Story";
CREATE TABLE "new_SubscriptionNotification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "raw" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SubscriptionNotification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_SubscriptionNotification" ("createdAt", "id", "platform", "raw", "userId", "status") SELECT "createdAt", "id", "platform", "raw", "userId", "status" FROM "SubscriptionNotification";
DROP TABLE "SubscriptionNotification";
ALTER TABLE "new_SubscriptionNotification" RENAME TO "SubscriptionNotification";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
