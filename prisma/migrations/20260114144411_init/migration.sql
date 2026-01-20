-- CreateTable
CREATE TABLE "OnboardingSetup" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userRole" TEXT NOT NULL,
    "startupName" TEXT NOT NULL,
    "startupDesc" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "niche" TEXT NOT NULL,
    "firstfirstUpdateTitle" TEXT NOT NULL,
    "firstfirstUpdateDesc" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OnboardingSetup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OnboardingSetup_userId_key" ON "OnboardingSetup"("userId");
