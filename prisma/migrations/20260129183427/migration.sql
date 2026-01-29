-- DropForeignKey
ALTER TABLE `ClassStudent` DROP FOREIGN KEY `ClassStudent_classId_fkey`;

-- DropIndex
DROP INDEX `ClassStudent_classId_fkey` ON `ClassStudent`;

-- AddForeignKey
ALTER TABLE `ClassStudent` ADD CONSTRAINT `ClassStudent_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
