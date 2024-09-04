/*
  Warnings:

  - You are about to alter the column `A` on the `_userchannels` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `channel` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `channel` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `music` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `music` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `channelId` on the `music` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- DropForeignKey
ALTER TABLE `_userchannels` DROP FOREIGN KEY `_UserChannels_A_fkey`;

-- DropForeignKey
ALTER TABLE `music` DROP FOREIGN KEY `Music_channelId_fkey`;

-- AlterTable
ALTER TABLE `_userchannels` MODIFY `A` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `channel` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `music` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `channelId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `Music` ADD CONSTRAINT `Music_channelId_fkey` FOREIGN KEY (`channelId`) REFERENCES `Channel`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UserChannels` ADD CONSTRAINT `_UserChannels_A_fkey` FOREIGN KEY (`A`) REFERENCES `Channel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
