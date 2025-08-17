/*
  Warnings:

  - Added the required column `cedula` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "cedula" TEXT NOT NULL,
    "phone" TEXT,
    "role" TEXT NOT NULL DEFAULT 'CLIENT',
    "avatar" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "lastLogin" DATETIME,
    "resetPasswordToken" TEXT,
    "resetPasswordExpires" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
-- Add temporary cedula values for existing users
INSERT INTO "new_users" ("avatar", "createdAt", "email", "emailVerified", "firstName", "id", "isActive", "lastLogin", "lastName", "password", "phone", "resetPasswordExpires", "resetPasswordToken", "role", "updatedAt", "cedula") 
SELECT "avatar", "createdAt", "email", "emailVerified", "firstName", "id", "isActive", "lastLogin", "lastName", "password", "phone", "resetPasswordExpires", "resetPasswordToken", "role", "updatedAt", 
  CASE 
    WHEN email = 'admin@gym.com' THEN '12345678'
    WHEN email = 'receptionist@gym.com' THEN '87654321'
    WHEN email = 'trainer@gym.com' THEN '11223344'
    WHEN email = 'client1@example.com' THEN '10001001'
    WHEN email = 'client2@example.com' THEN '10001002'
    WHEN email = 'client3@example.com' THEN '10001003'
    WHEN email = 'client4@example.com' THEN '10001004'
    WHEN email = 'client5@example.com' THEN '10001005'
    ELSE SUBSTR(id, 1, 8) -- fallback to first 8 chars of UUID
  END as cedula
FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "users_cedula_key" ON "users"("cedula");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
