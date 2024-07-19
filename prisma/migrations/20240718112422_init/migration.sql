/*
  Warnings:

  - Added the required column `order` to the `Music` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `music` ADD COLUMN `order` INTEGER NOT NULL;
