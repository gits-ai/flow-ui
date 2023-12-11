/*
  Warnings:

  - You are about to drop the column `data` on the `AgentNode` table. All the data in the column will be lost.
  - You are about to drop the column `position` on the `AgentNode` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `AgentNode` table. All the data in the column will be lost.
  - Added the required column `nodes` to the `AgentNode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AgentNode" DROP COLUMN "data",
DROP COLUMN "position",
DROP COLUMN "type",
ADD COLUMN     "node" JSONB NOT NULL;
