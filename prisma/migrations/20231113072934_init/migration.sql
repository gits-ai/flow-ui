/*
  Warnings:

  - You are about to drop the `AgentLink` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AgentLink" DROP CONSTRAINT "AgentLink_source_fkey";

-- DropForeignKey
ALTER TABLE "AgentLink" DROP CONSTRAINT "AgentLink_target_fkey";

-- DropTable
DROP TABLE "AgentLink";

-- CreateTable
CREATE TABLE "AgentEdge" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "source" TEXT NOT NULL,
    "target" TEXT NOT NULL,

    CONSTRAINT "AgentEdge_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AgentEdge" ADD CONSTRAINT "AgentEdge_source_fkey" FOREIGN KEY ("source") REFERENCES "AgentNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentEdge" ADD CONSTRAINT "AgentEdge_target_fkey" FOREIGN KEY ("target") REFERENCES "AgentNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;
