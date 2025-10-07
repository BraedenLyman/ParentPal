-- phpMyAdmin SQL Dump
-- version 5.1.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Sep 29, 2025 at 07:58 PM
-- Server version: 5.7.24
-- PHP Version: 8.3.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `parentpal_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `account`
--

CREATE TABLE `account` (
  `account_id` int(11) NOT NULL,
  `firebase_uid` varchar(128) NOT NULL,
  `babysitter_id` int(11) DEFAULT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email_address` varchar(100) NOT NULL,
  `account_type` enum('parent','babysitter','admin') NOT NULL,
  `birth_date` date DEFAULT NULL,
  `gender` enum('M','F','Other','Male','Female') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `account`
--

INSERT INTO `account` (`account_id`, `firebase_uid`, `babysitter_id`, `first_name`, `last_name`, `email_address`, `account_type`, `birth_date`, `gender`) VALUES
(3, 'Js7smViHnqO6ww6AufSY22GmX7j2', NULL, 'Parent', 'Ex', 'parent@gmail.com', 'parent', '1997-01-01', 'Male'),
(4, 'f6MzklFdKISJ05rQcawNkXWExXC3', NULL, 'Babysitter', 'Ex', 'babysitter@gmail.com', 'babysitter', '1997-02-02', 'Female'),
(5, 'nLR8PSWJuPQcUmlZmNpJ0BN7Ul73', NULL, 'babysitter2', 'ex2', 'babysitter2@gmail.com', 'babysitter', '1997-02-02', 'Female'),
(6, 'SDXFgW675nVTVObkTdBwnGHHev83', NULL, 'Bob', 'Parker', 'bob@gmail.com', 'babysitter', '1997-01-04', 'Male'),
(7, 'z0YsJ1Dj6JPX7WaA5AOAdbqXnPB2', NULL, 'parent2', 'p2', 'parent2@gmail.com', 'parent', '1997-02-02', 'Male'),
(8, 'SFiY3uP4K3hcXsVCHoNAMcQYitM2', NULL, 'parent3', 'parent3', 'parent3@gmail.com', 'parent', '1997-02-02', 'Male'),
(9, 'yXEltNfdtrcoxkTW9JQUwQv52Sm2', NULL, 'Brae', 'l', 'braeden.lyman77@gmail.com', 'babysitter', '1997-01-04', 'Male');

-- --------------------------------------------------------

--
-- Table structure for table `allergies`
--

CREATE TABLE `allergies` (
  `allergy_id` int(11) NOT NULL,
  `baby_id` int(11) NOT NULL,
  `allergy_name` varchar(100) DEFAULT NULL,
  `severity` enum('low','medium','high') DEFAULT NULL,
  `epi_pen` tinyint(1) DEFAULT NULL,
  `notes` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `allergies`
--

INSERT INTO `allergies` (`allergy_id`, `baby_id`, `allergy_name`, `severity`, `epi_pen`, `notes`) VALUES
(1, 2, 'Peanuts', 'high', NULL, 'I am allergic to peanuts'),
(2, 2, 'Nuts', 'high', NULL, 'very careful'),
(3, 2, 'g', 'low', NULL, 'ggggg');

-- --------------------------------------------------------

--
-- Table structure for table `baby`
--

CREATE TABLE `baby` (
  `baby_id` int(11) NOT NULL,
  `parent_id` int(11) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `birth_date` date DEFAULT NULL,
  `gender` enum('M','F','Other','Male','Female') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `baby`
--

INSERT INTO `baby` (`baby_id`, `parent_id`, `first_name`, `last_name`, `birth_date`, `gender`) VALUES
(2, 3, 'Baby1', 'Ex1', '2002-02-02', 'Female'),
(3, 7, 'babyTwo', 'BTwo', '2002-02-02', 'Female'),
(4, 8, 'baby3', 'three', '2003-03-03', 'Female');

-- --------------------------------------------------------

--
-- Table structure for table `babysitter`
--

CREATE TABLE `babysitter` (
  `babysitter_id` int(11) NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email_address` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `birth_date` date DEFAULT NULL,
  `gender` enum('M','F','Other') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `babysitter_shares`
--

CREATE TABLE `babysitter_shares` (
  `share_id` int(11) NOT NULL,
  `parent_id` int(11) NOT NULL,
  `babysitter_email` varchar(255) NOT NULL,
  `babysitter_name` varchar(255) NOT NULL,
  `verification_code` char(4) NOT NULL,
  `is_verified` tinyint(1) DEFAULT '0',
  `babysitter_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `verified_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `custom_notifications`
--

CREATE TABLE `custom_notifications` (
  `custom_notification_id` int(11) NOT NULL,
  `baby_id` int(11) NOT NULL,
  `parent_id` int(11) NOT NULL,
  `notification_type` varchar(50) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `time` time DEFAULT NULL,
  `notes` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `feeding`
--

CREATE TABLE `feeding` (
  `feeding_id` int(11) NOT NULL,
  `baby_id` int(11) NOT NULL,
  `time_fed` time DEFAULT NULL,
  `date` date DEFAULT NULL,
  `fed_from` enum('bottle','breast') DEFAULT NULL,
  `type_of_food` varchar(50) DEFAULT NULL,
  `amount` decimal(5,2) DEFAULT NULL,
  `notes` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `growth`
--

CREATE TABLE `growth` (
  `growth_id` int(11) NOT NULL,
  `baby_id` int(11) NOT NULL,
  `weight` decimal(5,2) DEFAULT NULL,
  `height` decimal(5,2) DEFAULT NULL,
  `date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `growth`
--

INSERT INTO `growth` (`growth_id`, `baby_id`, `weight`, `height`, `date`) VALUES
(1, 2, '2.00', '2.00', '2002-02-02'),
(2, 2, '30.00', '30.00', '2002-03-03'),
(3, 2, '22.00', '22.00', '2020-03-31'),
(4, 2, '11.00', '11.00', '2002-02-22'),
(5, 2, '66.00', '66.00', '2003-04-04');

-- --------------------------------------------------------

--
-- Table structure for table `medications`
--

CREATE TABLE `medications` (
  `med_id` int(11) NOT NULL,
  `baby_id` int(11) NOT NULL,
  `medication_name` varchar(100) DEFAULT NULL,
  `time_taken` time DEFAULT NULL,
  `date` date DEFAULT NULL,
  `dosage` varchar(50) DEFAULT NULL,
  `symptoms` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `medications`
--

INSERT INTO `medications` (`med_id`, `baby_id`, `medication_name`, `time_taken`, `date`, `dosage`, `symptoms`) VALUES
(1, 2, 'Hal', '10:20:00', '2002-02-02', '5', 'I am not feeling good'),
(2, 2, 'Tyl', '10:20:00', '2025-09-20', '4', 'I was feeling sick'),
(3, 2, 'www', '09:00:00', '2003-03-03', '2', 'I am crazy');

-- --------------------------------------------------------

--
-- Table structure for table `observation`
--

CREATE TABLE `observation` (
  `observation_id` int(11) NOT NULL,
  `baby_id` int(11) NOT NULL,
  `priority_level` enum('low','medium','high') DEFAULT NULL,
  `notes` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `sick_day`
--

CREATE TABLE `sick_day` (
  `sick_id` int(11) NOT NULL,
  `baby_id` int(11) NOT NULL,
  `med_id` int(11) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `meds_taken` varchar(100) DEFAULT NULL,
  `temp` decimal(4,1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `sleep`
--

CREATE TABLE `sleep` (
  `sleep_id` int(11) NOT NULL,
  `baby_id` int(11) NOT NULL,
  `sleep_duration` decimal(4,2) DEFAULT NULL,
  `time_fell_asleep` time DEFAULT NULL,
  `date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `sleep`
--

INSERT INTO `sleep` (`sleep_id`, `baby_id`, `sleep_duration`, `time_fell_asleep`, `date`) VALUES
(1, 2, '4.00', '10:20:00', '2002-02-02'),
(2, 2, '7.00', '22:20:00', '2003-03-03'),
(3, 2, '99.00', '03:33:00', '2002-02-02'),
(4, 2, '5.00', '09:00:00', '2000-01-01');

-- --------------------------------------------------------

--
-- Table structure for table `task`
--

CREATE TABLE `task` (
  `task_id` int(11) NOT NULL,
  `baby_id` int(11) NOT NULL,
  `babysitter_id` int(11) NOT NULL,
  `time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `vaccinations`
--

CREATE TABLE `vaccinations` (
  `vaccine_id` int(11) NOT NULL,
  `baby_id` int(11) NOT NULL,
  `vaccination_name` varchar(100) DEFAULT NULL,
  `date_of_vaccine` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `vaccinations`
--

INSERT INTO `vaccinations` (`vaccine_id`, `baby_id`, `vaccination_name`, `date_of_vaccine`) VALUES
(1, 2, 'Vaccine', '2002-02-02'),
(2, 2, 'Vaccinw', '2002-02-02');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `account`
--
ALTER TABLE `account`
  ADD PRIMARY KEY (`account_id`),
  ADD UNIQUE KEY `email_address` (`email_address`),
  ADD KEY `fk_account_babysitter` (`babysitter_id`);

--
-- Indexes for table `allergies`
--
ALTER TABLE `allergies`
  ADD PRIMARY KEY (`allergy_id`),
  ADD KEY `baby_id` (`baby_id`);

--
-- Indexes for table `baby`
--
ALTER TABLE `baby`
  ADD PRIMARY KEY (`baby_id`),
  ADD KEY `parent_id` (`parent_id`);

--
-- Indexes for table `babysitter`
--
ALTER TABLE `babysitter`
  ADD PRIMARY KEY (`babysitter_id`),
  ADD UNIQUE KEY `email_address` (`email_address`),
  ADD KEY `fk_babysitter_parent` (`parent_id`);

--
-- Indexes for table `babysitter_shares`
--
ALTER TABLE `babysitter_shares`
  ADD PRIMARY KEY (`share_id`),
  ADD KEY `idx_parent_id` (`parent_id`),
  ADD KEY `idx_babysitter_email` (`babysitter_email`),
  ADD KEY `idx_verification_code` (`verification_code`),
  ADD KEY `idx_babysitter_id` (`babysitter_id`);

--
-- Indexes for table `custom_notifications`
--
ALTER TABLE `custom_notifications`
  ADD PRIMARY KEY (`custom_notification_id`),
  ADD KEY `baby_id` (`baby_id`),
  ADD KEY `parent_id` (`parent_id`);

--
-- Indexes for table `feeding`
--
ALTER TABLE `feeding`
  ADD PRIMARY KEY (`feeding_id`),
  ADD KEY `baby_id` (`baby_id`);

--
-- Indexes for table `growth`
--
ALTER TABLE `growth`
  ADD PRIMARY KEY (`growth_id`),
  ADD KEY `baby_id` (`baby_id`);

--
-- Indexes for table `medications`
--
ALTER TABLE `medications`
  ADD PRIMARY KEY (`med_id`),
  ADD KEY `baby_id` (`baby_id`);

--
-- Indexes for table `observation`
--
ALTER TABLE `observation`
  ADD PRIMARY KEY (`observation_id`),
  ADD KEY `baby_id` (`baby_id`);

--
-- Indexes for table `sick_day`
--
ALTER TABLE `sick_day`
  ADD PRIMARY KEY (`sick_id`),
  ADD KEY `baby_id` (`baby_id`),
  ADD KEY `med_id` (`med_id`);

--
-- Indexes for table `sleep`
--
ALTER TABLE `sleep`
  ADD PRIMARY KEY (`sleep_id`),
  ADD KEY `baby_id` (`baby_id`);

--
-- Indexes for table `task`
--
ALTER TABLE `task`
  ADD PRIMARY KEY (`task_id`),
  ADD KEY `baby_id` (`baby_id`),
  ADD KEY `babysitter_id` (`babysitter_id`);

--
-- Indexes for table `vaccinations`
--
ALTER TABLE `vaccinations`
  ADD PRIMARY KEY (`vaccine_id`),
  ADD KEY `baby_id` (`baby_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `account`
--
ALTER TABLE `account`
  MODIFY `account_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `allergies`
--
ALTER TABLE `allergies`
  MODIFY `allergy_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `baby`
--
ALTER TABLE `baby`
  MODIFY `baby_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `babysitter`
--
ALTER TABLE `babysitter`
  MODIFY `babysitter_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `babysitter_shares`
--
ALTER TABLE `babysitter_shares`
  MODIFY `share_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `custom_notifications`
--
ALTER TABLE `custom_notifications`
  MODIFY `custom_notification_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `feeding`
--
ALTER TABLE `feeding`
  MODIFY `feeding_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `growth`
--
ALTER TABLE `growth`
  MODIFY `growth_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `medications`
--
ALTER TABLE `medications`
  MODIFY `med_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `observation`
--
ALTER TABLE `observation`
  MODIFY `observation_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sick_day`
--
ALTER TABLE `sick_day`
  MODIFY `sick_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sleep`
--
ALTER TABLE `sleep`
  MODIFY `sleep_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `task`
--
ALTER TABLE `task`
  MODIFY `task_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `vaccinations`
--
ALTER TABLE `vaccinations`
  MODIFY `vaccine_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `account`
--
ALTER TABLE `account`
  ADD CONSTRAINT `fk_account_babysitter` FOREIGN KEY (`babysitter_id`) REFERENCES `babysitter` (`babysitter_id`);

--
-- Constraints for table `allergies`
--
ALTER TABLE `allergies`
  ADD CONSTRAINT `allergies_ibfk_1` FOREIGN KEY (`baby_id`) REFERENCES `baby` (`baby_id`);

--
-- Constraints for table `baby`
--
ALTER TABLE `baby`
  ADD CONSTRAINT `baby_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `account` (`account_id`);

--
-- Constraints for table `babysitter`
--
ALTER TABLE `babysitter`
  ADD CONSTRAINT `fk_babysitter_parent` FOREIGN KEY (`parent_id`) REFERENCES `account` (`account_id`);

--
-- Constraints for table `babysitter_shares`
--
ALTER TABLE `babysitter_shares`
  ADD CONSTRAINT `babysitter_shares_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `account` (`account_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `babysitter_shares_ibfk_2` FOREIGN KEY (`babysitter_id`) REFERENCES `account` (`account_id`) ON DELETE CASCADE;

--
-- Constraints for table `custom_notifications`
--
ALTER TABLE `custom_notifications`
  ADD CONSTRAINT `custom_notifications_ibfk_1` FOREIGN KEY (`baby_id`) REFERENCES `baby` (`baby_id`),
  ADD CONSTRAINT `custom_notifications_ibfk_2` FOREIGN KEY (`parent_id`) REFERENCES `account` (`account_id`);

--
-- Constraints for table `feeding`
--
ALTER TABLE `feeding`
  ADD CONSTRAINT `feeding_ibfk_1` FOREIGN KEY (`baby_id`) REFERENCES `baby` (`baby_id`);

--
-- Constraints for table `growth`
--
ALTER TABLE `growth`
  ADD CONSTRAINT `growth_ibfk_1` FOREIGN KEY (`baby_id`) REFERENCES `baby` (`baby_id`);

--
-- Constraints for table `medications`
--
ALTER TABLE `medications`
  ADD CONSTRAINT `medications_ibfk_1` FOREIGN KEY (`baby_id`) REFERENCES `baby` (`baby_id`);

--
-- Constraints for table `observation`
--
ALTER TABLE `observation`
  ADD CONSTRAINT `observation_ibfk_1` FOREIGN KEY (`baby_id`) REFERENCES `baby` (`baby_id`);

--
-- Constraints for table `sick_day`
--
ALTER TABLE `sick_day`
  ADD CONSTRAINT `sick_day_ibfk_1` FOREIGN KEY (`baby_id`) REFERENCES `baby` (`baby_id`),
  ADD CONSTRAINT `sick_day_ibfk_2` FOREIGN KEY (`med_id`) REFERENCES `medications` (`med_id`);

--
-- Constraints for table `sleep`
--
ALTER TABLE `sleep`
  ADD CONSTRAINT `sleep_ibfk_1` FOREIGN KEY (`baby_id`) REFERENCES `baby` (`baby_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
