-- AlterTable
ALTER TABLE "Diagram" ALTER COLUMN "flowData" DROP NOT NULL,
ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "title" SET DEFAULT 'Untitled DiagramMain';
