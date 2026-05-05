-- CreateTable
CREATE TABLE "Part" (
    "id" SERIAL NOT NULL,
    "serialId" INTEGER NOT NULL,
    "partName" TEXT NOT NULL,
    "partDescription" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Part_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Log" (
    "id" SERIAL NOT NULL,
    "step" TEXT NOT NULL,
    "operator" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "partId" INTEGER NOT NULL,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Part_serialId_key" ON "Part"("serialId");

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_partId_fkey" FOREIGN KEY ("partId") REFERENCES "Part"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
