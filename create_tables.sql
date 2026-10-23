-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS `educlass`;

-- Use the created database
USE `educlass`;

-- Drop tables if they exist (for development purposes)
DROP TABLE IF EXISTS `rubric_scores`;
DROP TABLE IF EXISTS `submission_answers`;
DROP TABLE IF EXISTS `submissions`;
DROP TABLE IF EXISTS `rubric_criteria`;
DROP TABLE IF EXISTS `questions`;
DROP TABLE IF EXISTS `exams`;
DROP TABLE IF EXISTS `courses`;
DROP TABLE IF EXISTS `students`;
DROP TABLE IF EXISTS `lecturers`;
DROP TABLE IF EXISTS `programs`;

-- Create the 'programs' table
CREATE TABLE `programs` (
    `id` VARCHAR(255) PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `duration` VARCHAR(255),
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create the 'lecturers' table
CREATE TABLE `lecturers` (
    `id` VARCHAR(255) PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `department` VARCHAR(255),
    `status` ENUM('active', 'inactive') NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create the 'students' table
CREATE TABLE `students` (
    `id` VARCHAR(255) PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `programId` VARCHAR(255),
    `enrollmentYear` INT,
    `status` ENUM('active', 'inactive', 'graduated') NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`programId`) REFERENCES `programs`(`id`) ON DELETE SET NULL
);

-- Create the 'courses' table
CREATE TABLE `courses` (
    `id` VARCHAR(255) PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `code` VARCHAR(255) NOT NULL UNIQUE,
    `description` TEXT,
    `programId` VARCHAR(255),
    `lecturerId` VARCHAR(255),
    `credits` INT,
    `duration` VARCHAR(255),
    `status` ENUM('active', 'inactive') NOT NULL,
    `level` ENUM('100', '200', '300', '400') NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`programId`) REFERENCES `programs`(`id`) ON DELETE SET NULL,
    FOREIGN KEY (`lecturerId`) REFERENCES `lecturers`(`id`) ON DELETE SET NULL
);

-- Create the 'exams' table
CREATE TABLE `exams` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `type` ENUM('exam', 'assignment') NOT NULL,
    `description` TEXT,
    `classId` VARCHAR(255), -- Assuming classId refers to course id
    `className` VARCHAR(255),
    `dueDate` DATE,
    `startTime` TIME,
    `endTime` TIME,
    `durationHours` INT,
    `durationMinutes` INT,
    `duration` VARCHAR(255),
    `status` ENUM('upcoming', 'ongoing', 'completed') NOT NULL,
    `totalPoints` INT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`classId`) REFERENCES `courses`(`id`) ON DELETE SET NULL
);

-- Create the 'questions' table
CREATE TABLE `questions` (
    `id` VARCHAR(255) PRIMARY KEY,
    `examId` INT UNSIGNED,
    `type` ENUM('essay', 'multi-choice', 'fill-ins') NOT NULL,
    `questionText` TEXT NOT NULL,
    `points` INT,
    `modelAnswer` TEXT, -- For essay questions
    `correctAnswer` TEXT, -- For fill-in questions
    `correctAnswerId` VARCHAR(255), -- For multi-choice questions (ID of the correct option)
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`examId`) REFERENCES `exams`(`id`) ON DELETE CASCADE
);

-- Create the 'rubric_criteria' table
CREATE TABLE `rubric_criteria` (
    `id` VARCHAR(255) PRIMARY KEY,
    `questionId` VARCHAR(255),
    `name` VARCHAR(255) NOT NULL,
    `value` INT,
    `description` TEXT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`questionId`) REFERENCES `questions`(`id`) ON DELETE CASCADE
);

-- Create the 'submissions' table
CREATE TABLE `submissions` (
    `id` VARCHAR(255) PRIMARY KEY,
    `examId` INT UNSIGNED,
    `studentId` VARCHAR(255),
    `startTime` DATETIME,
    `endTime` DATETIME,
    `status` ENUM('submitted') NOT NULL,
    `totalScore` INT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`examId`) REFERENCES `exams`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`studentId`) REFERENCES `students`(`id`) ON DELETE CASCADE
);

-- Create the 'submission_answers' table
CREATE TABLE `submission_answers` (
    `id` VARCHAR(255) PRIMARY KEY,
    `submissionId` VARCHAR(255),
    `questionId` VARCHAR(255),
    `answer` TEXT, -- For essay and fill-in questions
    `selectedOptionId` VARCHAR(255), -- For multi-choice questions
    `score` INT,
    `feedback` TEXT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`submissionId`) REFERENCES `submissions`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`questionId`) REFERENCES `questions`(`id`) ON DELETE CASCADE
);

-- Create the 'rubric_scores' table
CREATE TABLE `rubric_scores` (
    `id` VARCHAR(255) PRIMARY KEY,
    `submissionAnswerId` VARCHAR(255),
    `rubricCriteriaId` VARCHAR(255),
    `score` INT,
    `feedback` TEXT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`submissionAnswerId`) REFERENCES `submission_answers`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`rubricCriteriaId`) REFERENCES `rubric_criteria`(`id`) ON DELETE CASCADE
);
