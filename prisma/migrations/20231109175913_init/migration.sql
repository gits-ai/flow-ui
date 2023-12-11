/*
  Warnings:

  - Added the required column `updatedAt` to the `AgentLink` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `AgentNode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AgentLink" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "AgentNode" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
