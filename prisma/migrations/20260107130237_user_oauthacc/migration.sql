-- CreateEnum
CREATE TYPE "OAuthProviders" AS ENUM ('GOOGLE', 'GITHUB', 'DISCORD');

-- AlterTable
ALTER TABLE "Person" ALTER COLUMN "password" DROP NOT NULL,
ALTER COLUMN "salt" DROP NOT NULL;

-- CreateTable
CREATE TABLE "UserOAuthAccountTable" (
    "userId" TEXT NOT NULL,
    "provider" "OAuthProviders" NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserOAuthAccountTable_pkey" PRIMARY KEY ("providerAccountId","provider")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserOAuthAccountTable_providerAccountId_key" ON "UserOAuthAccountTable"("providerAccountId");

-- AddForeignKey
ALTER TABLE "UserOAuthAccountTable" ADD CONSTRAINT "UserOAuthAccountTable_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;
