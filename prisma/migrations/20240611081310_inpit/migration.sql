/*
  Warnings:

  - You are about to drop the column `duration` on the `music` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `music` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `music` DROP COLUMN `duration`,
    DROP COLUMN `image`;
