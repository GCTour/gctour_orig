-- phpMyAdmin SQL Dump
-- version 3.4.5
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Erstellungszeit: 18. Nov 2011 um 11:51
-- Server Version: 5.5.16
-- PHP-Version: 5.3.8

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Datenbank: `gctour`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `gct_errors`
--

CREATE TABLE IF NOT EXISTS `gct_errors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `exception` varchar(512) COLLATE utf8_unicode_ci NOT NULL,
  `versions` varchar(512) COLLATE utf8_unicode_ci NOT NULL,
  `useragents` varchar(2048) COLLATE utf8_unicode_ci NOT NULL,
  `gccodes` varchar(1024) COLLATE utf8_unicode_ci NOT NULL,
  `usernotes` text COLLATE utf8_unicode_ci NOT NULL,
  `first_submit` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `appearance` int(11) NOT NULL DEFAULT '1',
  `solution` text COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=0 ;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `gct_gecaches_in_tour`
--

CREATE TABLE IF NOT EXISTS `gct_gecaches_in_tour` (
  `webcode` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `gcid` varchar(20) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `gct_geocaches`
--

CREATE TABLE IF NOT EXISTS `gct_geocaches` (
  `gcid` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `guid` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(512) COLLATE utf8_unicode_ci NOT NULL,
  `type` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `difficulty` float NOT NULL,
  `terrain` float NOT NULL,
  `latitude` float NOT NULL,
  `longitude` float NOT NULL,
  PRIMARY KEY (`gcid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `gct_ownwaypoints`
--

CREATE TABLE IF NOT EXISTS `gct_ownwaypoints` (
  `wptcode` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(512) COLLATE utf8_unicode_ci NOT NULL,
  `latitude` float NOT NULL,
  `longitude` float NOT NULL,
  `content` varchar(512) COLLATE utf8_unicode_ci NOT NULL,
  `index` int(11) NOT NULL,
  `image` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `symbol` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`wptcode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `gct_tours`
--

CREATE TABLE IF NOT EXISTS `gct_tours` (
  `webcode` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`webcode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `gct_waypoints`
--

CREATE TABLE IF NOT EXISTS `gct_waypoints` (
  `id` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `gcid` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `symbol` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `prefix` varchar(2) COLLATE utf8_unicode_ci NOT NULL,
  `lookup` varchar(6) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `note` varchar(256) COLLATE utf8_unicode_ci NOT NULL,
  `latitude` float NOT NULL,
  `longitude` float NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
