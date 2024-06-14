/*
  Warnings:

  - You are about to drop the `tag` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `tags` to the `Channel` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `tag` DROP FOREIGN KEY `Tag_channelId_fkey`;

-- AlterTable
ALTER TABLE `channel` ADD COLUMN `tags` JSON NOT NULL;

-- DropTable
DROP TABLE `tag`;
