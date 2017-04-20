-- phpMyAdmin SQL Dump
-- version 4.5.4.1deb2ubuntu2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Mar 30, 2017 at 01:22 PM
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
  `id` bigint(20) NOT NULL,
  `thread_id` bigint(20) NOT NULL,
  `comment_id` bigint(20) DEFAULT NULL,
  `author` varchar(255) NOT NULL,
  `date_posted` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `comment` text NOT NULL,
  `points` bigint(20) NOT NULL DEFAULT '1',
  `stickied` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `comment`
--

INSERT INTO `comment` (`id`, `thread_id`, `comment_id`, `author`, `date_posted`, `comment`, `points`, `stickied`) VALUES
(1, 1, NULL, 'wz634', '2017-03-29 03:11:43', 'hi', 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `comment_rating`
--

CREATE TABLE `comment_rating` (
  `comment_id` bigint(20) NOT NULL,
  `username` varchar(255) NOT NULL,
  `rating` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `domain`
--

CREATE TABLE `domain` (
  `id` bigint(20) NOT NULL,
  `name` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `domain`
--

INSERT INTO `domain` (`id`, `name`) VALUES
(1, 'NYU');

-- --------------------------------------------------------

--
-- Table structure for table `domain_user`
--

CREATE TABLE `domain_user` (
  `domain_id` bigint(20) NOT NULL,
  `username` varchar(255) NOT NULL,
  `moderator` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `domain_user`
--

INSERT INTO `domain_user` (`domain_id`, `username`, `moderator`) VALUES
(1, 'test', 0),
(1, 'wz634', 0);

-- --------------------------------------------------------

--
-- Table structure for table `file`
--

CREATE TABLE `file` (
  `id` bigint(20) NOT NULL,
  `thread_id` bigint(20) NOT NULL,
  `filename` varchar(255) DEFAULT NULL,
  `data` blob
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `file`
--

INSERT INTO `file` (`id`, `thread_id`, `filename`, `data`) VALUES
(1, 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `subdomain`
--

CREATE TABLE `subdomain` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `domain_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `subdomain`
--

INSERT INTO `subdomain` (`id`, `name`, `domain_id`) VALUES
(1, 'Bio', 1),
(2, 'CS', 1),
(3, 'Math', 1),
(4, 'Chem', 1),
(5, 'cooking', 1);

-- --------------------------------------------------------

--
-- Table structure for table `subdomain_user`
--

CREATE TABLE `subdomain_user` (
  `subdomain_id` bigint(20) NOT NULL,
  `username` varchar(255) NOT NULL,
  `moderator` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `subdomain_user`
--

INSERT INTO `subdomain_user` (`subdomain_id`, `username`, `moderator`) VALUES
(1, 'test', 0),
(1, 'wz634', 0),
(2, 'test', 0),
(2, 'wz634', 0),
(3, 'test', 0),
(3, 'wz634', 0),
(4, 'test', 0),
(4, 'wz634', 0),
(5, 'test', 0),
(5, 'wz634', 1);

-- --------------------------------------------------------

--
-- Table structure for table `thread`
--

CREATE TABLE `thread` (
  `id` bigint(20) NOT NULL,
  `subdomain_id` bigint(20) NOT NULL,
  `author` varchar(255) NOT NULL,
  `date_posted` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `title` varchar(255) NOT NULL,
  `context` text,
  `points` bigint(20) NOT NULL DEFAULT '1',
  `stickied` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `thread`
--

INSERT INTO `thread` (`id`, `subdomain_id`, `author`, `date_posted`, `title`, `context`, `points`, `stickied`) VALUES
(1, 5, 'wz634', '2017-03-29 01:43:04', 'i hate cooking', 'i like cooking', 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `thread_rating`
--

CREATE TABLE `thread_rating` (
  `thread_id` bigint(20) NOT NULL,
  `username` varchar(255) NOT NULL,
  `rating` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `username` varchar(255) NOT NULL,
  `salt` varchar(255) NOT NULL,
  `hash` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `company` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`username`, `salt`, `hash`, `first_name`, `last_name`, `email`, `phone`, `company`) VALUES
('test', '$2a$10$Nhqtexr.vmm/.rvNms9ynO', '$2a$10$Nhqtexr.vmm/.rvNms9ynO7M0Kq9wKIYYDSVUYtThdF75SwkMjdLq', 'hui', 'huang', 'hh@nyu.edu', '718-359-6771', 'NYU'),
('wz634', '$2a$10$Jz/njX9N99UmagrNuP6Qm.', '$2a$10$Jz/njX9N99UmagrNuP6Qm.KPUCLZfdYwC4rqDXX/HzMELBqPk1URi', 'warlon', 'zeng', 'wz634@nyu.edu', '6463845208', 'NYU');

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
  ADD PRIMARY KEY (`id`),
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
  ADD PRIMARY KEY (`id`);

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
  ADD PRIMARY KEY (`id`),
  ADD KEY `thread_id` (`thread_id`);

--
-- Indexes for table `subdomain`
--
ALTER TABLE `subdomain`
  ADD PRIMARY KEY (`id`),
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
  ADD PRIMARY KEY (`id`),
  ADD KEY `author` (`author`);

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
  ADD PRIMARY KEY (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `comment`
--
ALTER TABLE `comment`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `domain`
--
ALTER TABLE `domain`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `file`
--
ALTER TABLE `file`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `subdomain`
--
ALTER TABLE `subdomain`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `thread`
--
ALTER TABLE `thread`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
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
  ADD CONSTRAINT `comment_ibfk_2` FOREIGN KEY (`thread_id`) REFERENCES `thread` (`id`);

--
-- Constraints for table `comment_rating`
--
ALTER TABLE `comment_rating`
  ADD CONSTRAINT `comment_rating_ibfk_1` FOREIGN KEY (`comment_id`) REFERENCES `comment` (`id`),
  ADD CONSTRAINT `comment_rating_ibfk_2` FOREIGN KEY (`username`) REFERENCES `user` (`username`);

--
-- Constraints for table `domain_user`
--
ALTER TABLE `domain_user`
  ADD CONSTRAINT `domain_user_ibfk_1` FOREIGN KEY (`domain_id`) REFERENCES `domain` (`id`),
  ADD CONSTRAINT `domain_user_ibfk_2` FOREIGN KEY (`username`) REFERENCES `user` (`username`);

--
-- Constraints for table `file`
--
ALTER TABLE `file`
  ADD CONSTRAINT `file_ibfk_1` FOREIGN KEY (`thread_id`) REFERENCES `thread` (`id`);

--
-- Constraints for table `subdomain`
--
ALTER TABLE `subdomain`
  ADD CONSTRAINT `subdomain_ibfk_1` FOREIGN KEY (`domain_id`) REFERENCES `domain` (`id`);

--
-- Constraints for table `subdomain_user`
--
ALTER TABLE `subdomain_user`
  ADD CONSTRAINT `subdomain_user_ibfk_1` FOREIGN KEY (`subdomain_id`) REFERENCES `subdomain` (`id`),
  ADD CONSTRAINT `subdomain_user_ibfk_2` FOREIGN KEY (`username`) REFERENCES `user` (`username`);

--
-- Constraints for table `thread`
--
ALTER TABLE `thread`
  ADD CONSTRAINT `thread_ibfk_1` FOREIGN KEY (`author`) REFERENCES `user` (`username`);

--
-- Constraints for table `thread_rating`
--
ALTER TABLE `thread_rating`
  ADD CONSTRAINT `thread_rating_ibfk_1` FOREIGN KEY (`thread_id`) REFERENCES `thread` (`id`),
  ADD CONSTRAINT `thread_rating_ibfk_2` FOREIGN KEY (`username`) REFERENCES `user` (`username`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
