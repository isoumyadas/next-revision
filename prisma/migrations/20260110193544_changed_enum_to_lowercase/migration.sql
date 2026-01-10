/*
  Warnings:

  - The values [GOOGLE,GITHUB,DISCORD] on the enum `OAuthProviders` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OAuthProviders_new" AS ENUM ('google', 'github', 'discord');
ALTER TABLE "UserOAuthAccountTable" ALTER COLUMN "provider" TYPE "OAuthProviders_new" USING ("provider"::text::"OAuthProviders_new");
ALTER TYPE "OAuthProviders" RENAME TO "OAuthProviders_old";
ALTER TYPE "OAuthProviders_new" RENAME TO "OAuthProviders";
DROP TYPE "public"."OAuthProviders_old";
COMMIT;
