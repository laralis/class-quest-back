/*
  Warnings:

  - Added the required column `questionnaireId` to the `Results` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Alternative` DROP FOREIGN KEY `Alternative_questionId_fkey`;

-- DropForeignKey
ALTER TABLE `Question` DROP FOREIGN KEY `Question_questionnaireId_fkey`;

-- DropForeignKey
ALTER TABLE `Questionnaire` DROP FOREIGN KEY `Questionnaire_classId_fkey`;

-- DropForeignKey
ALTER TABLE `Questionnaire` DROP FOREIGN KEY `Questionnaire_createdById_fkey`;

-- DropForeignKey
ALTER TABLE `Results` DROP FOREIGN KEY `Results_studentId_fkey`;

-- DropForeignKey
ALTER TABLE `UserAnswer` DROP FOREIGN KEY `UserAnswer_alternativeId_fkey`;

-- DropForeignKey
ALTER TABLE `UserAnswer` DROP FOREIGN KEY `UserAnswer_questionId_fkey`;

-- DropForeignKey
ALTER TABLE `UserAnswer` DROP FOREIGN KEY `UserAnswer_studentId_fkey`;

-- DropIndex
DROP INDEX `Alternative_questionId_fkey` ON `Alternative`;

-- DropIndex
DROP INDEX `Question_questionnaireId_fkey` ON `Question`;

-- DropIndex
DROP INDEX `Questionnaire_classId_fkey` ON `Questionnaire`;

-- DropIndex
DROP INDEX `Questionnaire_createdById_fkey` ON `Questionnaire`;

-- DropIndex
DROP INDEX `Results_studentId_fkey` ON `Results`;

-- DropIndex
DROP INDEX `UserAnswer_alternativeId_fkey` ON `UserAnswer`;

-- DropIndex
DROP INDEX `UserAnswer_questionId_fkey` ON `UserAnswer`;

-- DropIndex
DROP INDEX `UserAnswer_studentId_fkey` ON `UserAnswer`;

-- AlterTable
ALTER TABLE `Results` ADD COLUMN `questionnaireId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Questionnaire` ADD CONSTRAINT `Questionnaire_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Questionnaire` ADD CONSTRAINT `Questionnaire_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Question` ADD CONSTRAINT `Question_questionnaireId_fkey` FOREIGN KEY (`questionnaireId`) REFERENCES `Questionnaire`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Alternative` ADD CONSTRAINT `Alternative_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `Question`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserAnswer` ADD CONSTRAINT `UserAnswer_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserAnswer` ADD CONSTRAINT `UserAnswer_alternativeId_fkey` FOREIGN KEY (`alternativeId`) REFERENCES `Alternative`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserAnswer` ADD CONSTRAINT `UserAnswer_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `Question`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Results` ADD CONSTRAINT `Results_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Results` ADD CONSTRAINT `Results_questionnaireId_fkey` FOREIGN KEY (`questionnaireId`) REFERENCES `Questionnaire`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
