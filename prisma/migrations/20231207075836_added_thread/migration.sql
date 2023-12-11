-- CreateEnum
CREATE TYPE "RunningStatus" AS ENUM ('NotStarted', 'Running', 'Paused', 'Finished', 'Error');

-- CreateTable
CREATE TABLE "Thread" (
    "id" TEXT NOT NULL,
    "diagramId" TEXT NOT NULL,
    "events" JSONB[],
    "status" "RunningStatus" NOT NULL DEFAULT 'NotStarted',

    CONSTRAINT "Thread_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Thread" ADD CONSTRAINT "Thread_diagramId_fkey" FOREIGN KEY ("diagramId") REFERENCES "Diagram"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
