/*
  Warnings:

  - You are about to drop the `Balance` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `balance` to the `Worker` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Balance" DROP CONSTRAINT "Balance_workerId_fkey";

-- AlterTable
ALTER TABLE "Worker" ADD COLUMN     "balance" TEXT NOT NULL;

-- DropTable
DROP TABLE "Balance";
