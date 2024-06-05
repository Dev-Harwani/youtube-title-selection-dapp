/*
  Warnings:

  - You are about to drop the column `balance` on the `Worker` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "TxnStatus" AS ENUM ('Processing', 'Success', 'Failure');

-- AlterTable
ALTER TABLE "Worker" DROP COLUMN "balance",
ADD COLUMN     "locked_amount" DECIMAL(18,6) NOT NULL DEFAULT 0,
ADD COLUMN     "pending_amount" DECIMAL(18,6) NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Payouts" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "signature" TEXT NOT NULL,
    "status" "TxnStatus" NOT NULL,

    CONSTRAINT "Payouts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Payouts" ADD CONSTRAINT "Payouts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
