-- CreateTable
CREATE TABLE "validation_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "identifier" TEXT NOT NULL,
    "validationType" TEXT NOT NULL,
    "success" BOOLEAN NOT NULL DEFAULT false,
    "reason" TEXT,
    "validatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "validation_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
