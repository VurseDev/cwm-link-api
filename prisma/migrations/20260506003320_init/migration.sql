-- CreateTable
CREATE TABLE "Part" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "serialId" TEXT NOT NULL,
    "partName" TEXT NOT NULL,
    "partDescription" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Log" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "step" TEXT NOT NULL,
    "operator" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "partId" INTEGER NOT NULL,
    CONSTRAINT "Log_partId_fkey" FOREIGN KEY ("partId") REFERENCES "Part" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Part_serialId_key" ON "Part"("serialId");
