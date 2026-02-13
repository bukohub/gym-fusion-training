-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT,
    "password" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "cedula" TEXT,
    "phone" TEXT,
    "weight" REAL,
    "height" REAL,
    "role" TEXT NOT NULL DEFAULT 'CLIENT',
    "avatar" TEXT,
    "photo" TEXT,
    "holler" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "lastLogin" DATETIME,
    "resetPasswordToken" TEXT,
    "resetPasswordExpires" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_users" ("avatar", "cedula", "createdAt", "email", "emailVerified", "firstName", "holler", "id", "isActive", "lastLogin", "lastName", "password", "phone", "photo", "resetPasswordExpires", "resetPasswordToken", "role", "updatedAt") SELECT "avatar", "cedula", "createdAt", "email", "emailVerified", "firstName", "holler", "id", "isActive", "lastLogin", "lastName", "password", "phone", "photo", "resetPasswordExpires", "resetPasswordToken", "role", "updatedAt" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_cedula_key" ON "users"("cedula");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
