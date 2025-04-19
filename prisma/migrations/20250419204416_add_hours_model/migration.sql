-- CreateTable
CREATE TABLE `HoursLog` (
    `id` VARCHAR(191) NOT NULL,
    `hours` INTEGER NOT NULL,
    `note` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` VARCHAR(191) NOT NULL,
    `projectId` VARCHAR(191) NOT NULL,
    `awardedById` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `HoursLog` ADD CONSTRAINT `HoursLog_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HoursLog` ADD CONSTRAINT `HoursLog_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HoursLog` ADD CONSTRAINT `HoursLog_awardedById_fkey` FOREIGN KEY (`awardedById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
