-- phpMyAdmin SQL Dump
-- version 4.5.4.1deb2ubuntu2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Apr 20, 2017 at 03:52 PM
-- Server version: 5.7.17-0ubuntu0.16.04.1
-- PHP Version: 7.0.15-0ubuntu0.16.04.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sharit`
--

-- --------------------------------------------------------

--
-- Table structure for table `administrator`
--

CREATE TABLE `administrator` (
  `username` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `comment`
--

CREATE TABLE `comment` (
  `comment_id` bigint(20) NOT NULL,
  `thread_id` bigint(20) NOT NULL,
  `reply_id` bigint(20) DEFAULT NULL,
  `author` varchar(255) NOT NULL,
  `date_posted` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `comment` text NOT NULL,
  `comment_points` bigint(20) NOT NULL DEFAULT '1',
  `comment_stickied` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `comment`
--

INSERT INTO `comment` (`comment_id`, `thread_id`, `reply_id`, `author`, `date_posted`, `comment`, `comment_points`, `comment_stickied`) VALUES
(1, 1, NULL, 'wz634', '2017-03-29 03:11:43', 'hi', 2, 0),
(2, 1, NULL, 'wz634', '2017-04-20 05:52:00', 'hi', 1, 0),
(3, 3, NULL, 'wz634', '2017-04-20 06:02:51', 'hi', 1, 0),
(4, 3, NULL, 'wz634', '2017-04-20 06:06:04', 'help', 1, 0),
(5, 4, NULL, 'wz634', '2017-04-20 06:07:52', 'nevermind, don\'t need help', 1, 0),
(6, 4, NULL, 'wz634', '2017-04-20 06:08:20', 'nevermind, don\'t need help', 1, 0),
(7, 4, NULL, 'wz634', '2017-04-20 06:08:33', 'wait i think i do', 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `comment_rating`
--

CREATE TABLE `comment_rating` (
  `comment_id` bigint(20) NOT NULL,
  `username` varchar(255) NOT NULL,
  `rating` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `comment_rating`
--

INSERT INTO `comment_rating` (`comment_id`, `username`, `rating`) VALUES
(1, 'wz634', 1);

-- --------------------------------------------------------

--
-- Table structure for table `domain`
--

CREATE TABLE `domain` (
  `domain_id` bigint(20) NOT NULL,
  `domain_name` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `domain`
--

INSERT INTO `domain` (`domain_id`, `domain_name`) VALUES
(1, 'NYU');

-- --------------------------------------------------------

--
-- Table structure for table `domain_user`
--

CREATE TABLE `domain_user` (
  `domain_id` bigint(20) NOT NULL,
  `username` varchar(255) NOT NULL,
  `domain_moderator` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `domain_user`
--

INSERT INTO `domain_user` (`domain_id`, `username`, `domain_moderator`) VALUES
(1, 'test', 0),
(1, 'tester', 0),
(1, 'tester2', 0),
(1, 'tester3', 0),
(1, 'tester4', 0),
(1, 'tester5', 0),
(1, 'tester6', 0),
(1, 'wz634', 0);

-- --------------------------------------------------------

--
-- Table structure for table `file`
--

CREATE TABLE `file` (
  `file_id` bigint(20) NOT NULL,
  `thread_id` bigint(20) NOT NULL,
  `filename` varchar(255) DEFAULT NULL,
  `timestamp` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `file`
--

INSERT INTO `file` (`file_id`, `thread_id`, `filename`, `timestamp`) VALUES
(1, 1, NULL, NULL),
(3, 3, NULL, NULL),
(9, 4, NULL, NULL),
(10, 5, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `subdomain`
--

CREATE TABLE `subdomain` (
  `subdomain_id` bigint(20) NOT NULL,
  `subdomain_name` varchar(255) DEFAULT NULL,
  `domain_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `subdomain`
--

INSERT INTO `subdomain` (`subdomain_id`, `subdomain_name`, `domain_id`) VALUES
(0, 'All', 1),
(1, 'Bio', 1),
(2, 'CS', 1),
(3, 'Math', 1),
(4, 'Chem', 1),
(5, 'cooking', 1),
(8, 'test', 1),
(10, 'hi', 1),
(11, 'asdf', 1),
(12, 'aaaa', 1),
(13, 'testsub', 1);

-- --------------------------------------------------------

--
-- Table structure for table `subdomain_user`
--

CREATE TABLE `subdomain_user` (
  `subdomain_id` bigint(20) NOT NULL,
  `username` varchar(255) NOT NULL,
  `subdomain_moderator` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `subdomain_user`
--

INSERT INTO `subdomain_user` (`subdomain_id`, `username`, `subdomain_moderator`) VALUES
(0, 'tester2', 0),
(0, 'tester3', 0),
(0, 'tester4', 0),
(0, 'tester5', 0),
(0, 'tester6', 0),
(0, 'wz634', 1),
(1, 'test', 0),
(1, 'tester', 0),
(1, 'tester2', 0),
(1, 'tester3', 0),
(1, 'tester4', 0),
(1, 'tester5', 0),
(1, 'tester6', 0),
(1, 'wz634', 0),
(2, 'test', 0),
(2, 'tester', 0),
(2, 'tester2', 0),
(2, 'tester3', 0),
(2, 'tester4', 0),
(2, 'tester5', 0),
(2, 'tester6', 0),
(2, 'wz634', 0),
(3, 'test', 0),
(3, 'tester', 0),
(3, 'tester2', 0),
(3, 'tester3', 0),
(3, 'tester4', 0),
(3, 'tester5', 0),
(3, 'tester6', 0),
(3, 'wz634', 0),
(4, 'test', 0),
(4, 'tester', 0),
(4, 'tester2', 0),
(4, 'tester3', 0),
(4, 'tester4', 0),
(4, 'tester5', 0),
(4, 'tester6', 0),
(4, 'wz634', 0),
(5, 'test', 0),
(5, 'tester2', 1),
(5, 'tester3', 1),
(5, 'tester6', 1),
(5, 'wz634', 1),
(8, 'tester2', 1),
(8, 'tester6', 1),
(8, 'wz634', 1),
(10, 'tester2', 1),
(10, 'tester6', 1),
(10, 'wz634', 1),
(11, 'tester6', 1),
(11, 'wz634', 1),
(12, 'tester2', 1),
(12, 'tester6', 1),
(12, 'wz634', 1),
(13, 'tester6', 1);

-- --------------------------------------------------------

--
-- Table structure for table `thread`
--

CREATE TABLE `thread` (
  `thread_id` bigint(20) NOT NULL,
  `subdomain_id` bigint(20) NOT NULL,
  `author` varchar(255) NOT NULL,
  `date_posted` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `title` varchar(255) NOT NULL,
  `context` text,
  `thread_points` bigint(20) NOT NULL DEFAULT '1',
  `thread_stickied` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `thread`
--

INSERT INTO `thread` (`thread_id`, `subdomain_id`, `author`, `date_posted`, `title`, `context`, `thread_points`, `thread_stickied`) VALUES
(1, 5, 'wz634', '2017-03-29 01:43:04', 'i hate cooking', 'i like cooking', 2, 0),
(3, 2, 'wz634', '2017-04-20 03:42:16', 'test', 'testing stuff', 1, 0),
(4, 3, 'wz634', '2017-04-20 04:22:21', 'help', 'help', 1, 0),
(5, 2, 'wz634', '2017-04-20 16:33:32', 'pic', 'pic', 1, 0),
(6, 2, 'wz634', '2017-04-20 18:32:58', 'newpic', 'newpic', 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `thread_rating`
--

CREATE TABLE `thread_rating` (
  `thread_id` bigint(20) NOT NULL,
  `username` varchar(255) NOT NULL,
  `rating` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `thread_rating`
--

INSERT INTO `thread_rating` (`thread_id`, `username`, `rating`) VALUES
(1, 'wz634', 1);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `username` varchar(255) NOT NULL,
  `salt` varchar(255) NOT NULL,
  `hash` varchar(255) NOT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `company` varchar(255) DEFAULT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`username`, `salt`, `hash`, `first_name`, `last_name`, `email`, `company`, `user_id`) VALUES
('test', '$2a$10$Nhqtexr.vmm/.rvNms9ynO', '$2a$10$Nhqtexr.vmm/.rvNms9ynO7M0Kq9wKIYYDSVUYtThdF75SwkMjdLq', 'hui', 'huang', 'hh@nyu.edu', 'NYU', 1),
('tester', '$2a$10$aL2JaBGqkkNrIUoFDhWdVO', '$2a$10$aL2JaBGqkkNrIUoFDhWdVOkoDqjXVCjCeKWKqok5MO/CmLuqkDNZi', 'Warlon', 'Zeng', 'asdf@nyu.edu', 'nyu', 2),
('wz634', '$2a$10$Jz/njX9N99UmagrNuP6Qm.', '$2a$10$Jz/njX9N99UmagrNuP6Qm.KPUCLZfdYwC4rqDXX/HzMELBqPk1URi', 'warlon', 'zeng', 'wz634@nyu.edu', 'NYU', 3),
('tester2', '$2a$10$q6MMuCDLsDRUFE.lvVZx1.', '$2a$10$q6MMuCDLsDRUFE.lvVZx1.1jWfX0ok72YehDvqY2ke7YrRSLzYn.m', NULL, NULL, NULL, NULL, 6),
('tester3', '$2a$10$LGX7t2UrT96HQ6UiZ3zT5O', '$2a$10$LGX7t2UrT96HQ6UiZ3zT5Oe62JYSAPwt4kx26lHYpQ1mTiHaUjT1O', NULL, NULL, NULL, NULL, 7),
('tester4', '$2a$10$IBb7LG2cEAlB0Pu8Hlx5WO', '$2a$10$IBb7LG2cEAlB0Pu8Hlx5WOqDgi96XKV0iotRpoZEsZau0zKqEvM7u', NULL, NULL, NULL, NULL, 8),
('tester5', '$2a$10$/.zqOYhOKXOAZOYCcxnDy.', '$2a$10$/.zqOYhOKXOAZOYCcxnDy.cHb/vBGUUYEfgtlRD/OqcGGC2P8nLkK', NULL, NULL, NULL, NULL, 9),
('tester6', '$2a$10$sG7zxv30fYFv3K1KTC.d4.', '$2a$10$sG7zxv30fYFv3K1KTC.d4.Mz5240YDLcmx/KUhFFq3T4YhuB0m.Dq', NULL, NULL, NULL, NULL, 10);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `administrator`
--
ALTER TABLE `administrator`
  ADD PRIMARY KEY (`username`);

--
-- Indexes for table `comment`
--
ALTER TABLE `comment`
  ADD PRIMARY KEY (`comment_id`),
  ADD KEY `author` (`author`),
  ADD KEY `thread_id` (`thread_id`);

--
-- Indexes for table `comment_rating`
--
ALTER TABLE `comment_rating`
  ADD PRIMARY KEY (`comment_id`,`username`),
  ADD KEY `username` (`username`);

--
-- Indexes for table `domain`
--
ALTER TABLE `domain`
  ADD PRIMARY KEY (`domain_id`);

--
-- Indexes for table `domain_user`
--
ALTER TABLE `domain_user`
  ADD PRIMARY KEY (`domain_id`,`username`),
  ADD KEY `username` (`username`);

--
-- Indexes for table `file`
--
ALTER TABLE `file`
  ADD PRIMARY KEY (`file_id`),
  ADD KEY `thread_id` (`thread_id`);

--
-- Indexes for table `subdomain`
--
ALTER TABLE `subdomain`
  ADD PRIMARY KEY (`subdomain_id`),
  ADD UNIQUE KEY `name` (`subdomain_name`),
  ADD KEY `domain_id` (`domain_id`);

--
-- Indexes for table `subdomain_user`
--
ALTER TABLE `subdomain_user`
  ADD PRIMARY KEY (`subdomain_id`,`username`),
  ADD KEY `username` (`username`);

--
-- Indexes for table `thread`
--
ALTER TABLE `thread`
  ADD PRIMARY KEY (`thread_id`),
  ADD KEY `author` (`author`),
  ADD KEY `subdomain_id` (`subdomain_id`);

--
-- Indexes for table `thread_rating`
--
ALTER TABLE `thread_rating`
  ADD PRIMARY KEY (`thread_id`,`username`),
  ADD KEY `username` (`username`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `comment`
--
ALTER TABLE `comment`
  MODIFY `comment_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT for table `domain`
--
ALTER TABLE `domain`
  MODIFY `domain_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `file`
--
ALTER TABLE `file`
  MODIFY `file_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT for table `subdomain`
--
ALTER TABLE `subdomain`
  MODIFY `subdomain_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
--
-- AUTO_INCREMENT for table `thread`
--
ALTER TABLE `thread`
  MODIFY `thread_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `user_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `administrator`
--
ALTER TABLE `administrator`
  ADD CONSTRAINT `administrator_ibfk_1` FOREIGN KEY (`username`) REFERENCES `user` (`username`);

--
-- Constraints for table `comment`
--
ALTER TABLE `comment`
  ADD CONSTRAINT `comment_ibfk_1` FOREIGN KEY (`author`) REFERENCES `user` (`username`),
  ADD CONSTRAINT `comment_ibfk_2` FOREIGN KEY (`thread_id`) REFERENCES `thread` (`thread_id`);

--
-- Constraints for table `comment_rating`
--
ALTER TABLE `comment_rating`
  ADD CONSTRAINT `comment_rating_ibfk_1` FOREIGN KEY (`comment_id`) REFERENCES `comment` (`comment_id`),
  ADD CONSTRAINT `comment_rating_ibfk_2` FOREIGN KEY (`username`) REFERENCES `user` (`username`);

--
-- Constraints for table `domain_user`
--
ALTER TABLE `domain_user`
  ADD CONSTRAINT `domain_user_ibfk_1` FOREIGN KEY (`domain_id`) REFERENCES `domain` (`domain_id`),
  ADD CONSTRAINT `domain_user_ibfk_2` FOREIGN KEY (`username`) REFERENCES `user` (`username`);

--
-- Constraints for table `file`
--
ALTER TABLE `file`
  ADD CONSTRAINT `file_ibfk_1` FOREIGN KEY (`thread_id`) REFERENCES `thread` (`thread_id`);

--
-- Constraints for table `subdomain`
--
ALTER TABLE `subdomain`
  ADD CONSTRAINT `subdomain_ibfk_1` FOREIGN KEY (`domain_id`) REFERENCES `domain` (`domain_id`);

--
-- Constraints for table `subdomain_user`
--
ALTER TABLE `subdomain_user`
  ADD CONSTRAINT `subdomain_user_ibfk_1` FOREIGN KEY (`subdomain_id`) REFERENCES `subdomain` (`subdomain_id`),
  ADD CONSTRAINT `subdomain_user_ibfk_2` FOREIGN KEY (`username`) REFERENCES `user` (`username`);

--
-- Constraints for table `thread`
--
ALTER TABLE `thread`
  ADD CONSTRAINT `thread_ibfk_1` FOREIGN KEY (`author`) REFERENCES `user` (`username`),
  ADD CONSTRAINT `thread_ibfk_2` FOREIGN KEY (`subdomain_id`) REFERENCES `subdomain` (`subdomain_id`);

--
-- Constraints for table `thread_rating`
--
ALTER TABLE `thread_rating`
  ADD CONSTRAINT `thread_rating_ibfk_1` FOREIGN KEY (`thread_id`) REFERENCES `thread` (`thread_id`),
  ADD CONSTRAINT `thread_rating_ibfk_2` FOREIGN KEY (`username`) REFERENCES `user` (`username`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
