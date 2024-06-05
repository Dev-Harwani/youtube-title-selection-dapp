/*
  Warnings:

  - The `balance` column on the `Worker` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Worker" DROP COLUMN "balance",
ADD COLUMN     "balance" INTEGER NOT NULL DEFAULT 0;
