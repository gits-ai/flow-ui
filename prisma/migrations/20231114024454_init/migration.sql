/*
  Warnings:

  - You are about to drop the `AgentEdge` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AgentNode` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AgentEdge" DROP CONSTRAINT "AgentEdge_source_fkey";

-- DropForeignKey
ALTER TABLE "AgentEdge" DROP CONSTRAINT "AgentEdge_target_fkey";

-- DropTable
DROP TABLE "AgentEdge";

-- DropTable
DROP TABLE "AgentNode";

-- CreateTable
CREATE TABLE "Diagram" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "flowData" JSONB NOT NULL,

    CONSTRAINT "Diagram_pkey" PRIMARY KEY ("id")
);
