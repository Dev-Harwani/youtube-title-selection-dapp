/*
  Warnings:

  - The `amount` column on the `Submission` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "amount",
ADD COLUMN     "amount" DECIMAL(18,6) NOT NULL DEFAULT 0;
