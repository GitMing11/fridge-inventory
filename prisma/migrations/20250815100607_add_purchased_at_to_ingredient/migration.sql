/*
  Warnings:

  - Added the required column `purchasedAt` to the `Ingredient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Ingredient` ADD COLUMN `purchasedAt` DATETIME(3) NOT NULL;
