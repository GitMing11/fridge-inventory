/*
  Warnings:

  - You are about to drop the column `usedAt` on the `IngredientHistory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `IngredientHistory` DROP COLUMN `usedAt`,
    ADD COLUMN `consumedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
