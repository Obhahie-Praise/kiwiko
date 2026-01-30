/*
  Warnings:

  - Changed the type of `consent` on the `startup_onboarding` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "startup_onboarding" DROP COLUMN "consent",
ADD COLUMN     "consent" BOOLEAN NOT NULL;
