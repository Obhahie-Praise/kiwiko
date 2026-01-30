/*
  Warnings:

  - You are about to drop the `OnboardingSetup` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "OnboardingSetup";

-- CreateTable
CREATE TABLE "startup_onboarding" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userRole" TEXT NOT NULL,
    "projectName" TEXT NOT NULL,
    "projectDesc" TEXT NOT NULL,
    "catergory" TEXT NOT NULL,
    "theProblem" TEXT NOT NULL,
    "theSolution" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "linkToProduct" TEXT NOT NULL,
    "userCount" TEXT NOT NULL,
    "revenue" TEXT NOT NULL,
    "teamSize" TEXT NOT NULL,
    "leaderStatus" TEXT,
    "fundsSeekingStatus" TEXT NOT NULL,
    "fundingStage" TEXT NOT NULL,
    "consent" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "startup_onboarding_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "startup_onboarding_userId_key" ON "startup_onboarding"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "startup_onboarding_linkToProduct_key" ON "startup_onboarding"("linkToProduct");
