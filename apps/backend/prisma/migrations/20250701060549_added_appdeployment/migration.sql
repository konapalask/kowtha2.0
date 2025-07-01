-- CreateTable
CREATE TABLE "AppDeployment" (
    "id" SERIAL NOT NULL,
    "version" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "source" TEXT NOT NULL,
    "forceUpdate" BOOLEAN NOT NULL DEFAULT false,
    "appStoreUrl" TEXT,
    "playStoreUrl" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppDeployment_pkey" PRIMARY KEY ("id")
);
