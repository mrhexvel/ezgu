-- AlterTable
ALTER TABLE `ProjectParticipant` ADD COLUMN `invitedById` VARCHAR(191) NULL,
    MODIFY `status` ENUM('REGISTERED', 'CONFIRMED', 'ATTENDED', 'COMPLETED', 'CANCELLED', 'INVITED') NOT NULL DEFAULT 'REGISTERED';

-- CreateTable
CREATE TABLE `ProjectInvitation` (
    `id` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'ACCEPTED', 'DECLINED', 'EXPIRED') NOT NULL DEFAULT 'PENDING',
    `message` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `projectId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `invitedById` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ProjectInvitation_projectId_userId_key`(`projectId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProjectInvitation` ADD CONSTRAINT `ProjectInvitation_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectInvitation` ADD CONSTRAINT `ProjectInvitation_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectInvitation` ADD CONSTRAINT `ProjectInvitation_invitedById_fkey` FOREIGN KEY (`invitedById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
