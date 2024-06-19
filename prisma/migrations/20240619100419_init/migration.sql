/*
  Warnings:

  - You are about to drop the `_channeltouser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `ownerId` to the `Channel` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_channeltouser` DROP FOREIGN KEY `_ChannelToUser_A_fkey`;

-- DropForeignKey
ALTER TABLE `_channeltouser` DROP FOREIGN KEY `_ChannelToUser_B_fkey`;

-- AlterTable
ALTER TABLE `channel` ADD COLUMN `ownerId` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `_channeltouser`;

-- CreateTable
CREATE TABLE `_UserChannels` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_UserChannels_AB_unique`(`A`, `B`),
    INDEX `_UserChannels_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Channel` ADD CONSTRAINT `Channel_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UserChannels` ADD CONSTRAINT `_UserChannels_A_fkey` FOREIGN KEY (`A`) REFERENCES `Channel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UserChannels` ADD CONSTRAINT `_UserChannels_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
