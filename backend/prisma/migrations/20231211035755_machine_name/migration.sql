/*
  Warnings:

  - You are about to drop the column `code` on the `machines` table. All the data in the column will be lost.
  - Added the required column `name` to the `machines` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "machines" DROP COLUMN "code",
ADD COLUMN     "name" TEXT NOT NULL;
