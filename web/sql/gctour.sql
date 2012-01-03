SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;


DROP TABLE IF EXISTS `gct_downloadstats`;
CREATE TABLE IF NOT EXISTS `gct_downloadstats` (
  `stats_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `installs` int(11) NOT NULL,
  PRIMARY KEY (`stats_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `gct_downloadstats` (`stats_date`, `installs`) VALUES
('2011-11-21 13:28:00', 131267),
('2011-11-22 19:37:00', 131325),
('2011-11-24 08:55:00', 131565),
('2011-11-25 19:05:00', 131785),
('2011-11-27 10:44:00', 132041),
('2011-11-28 10:49:00', 132173),
('2011-12-03 13:10:00', 132803),
('2011-12-04 13:43:00', 132943),
('2011-12-05 19:37:00', 133095),
('2011-12-07 21:18:00', 133329),
('2011-12-09 14:18:00', 133505),
('2011-12-11 13:58:00', 133773),
('2011-12-13 08:45:00', 133947),
('2011-12-14 20:53:00', 134075),
('2011-12-17 13:50:00', 134303),
('2011-12-18 22:35:00', 134491);

DROP TABLE IF EXISTS `gct_errors`;
CREATE TABLE IF NOT EXISTS `gct_errors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `exception` varchar(512) COLLATE utf8_unicode_ci NOT NULL,
  `versions` varchar(512) COLLATE utf8_unicode_ci NOT NULL,
  `useragents` varchar(2048) COLLATE utf8_unicode_ci NOT NULL,
  `gccodes` varchar(1024) COLLATE utf8_unicode_ci NOT NULL,
  `lasttours` MEDIUMTEXT COLLATE utf8_unicode_ci NOT NULL,
  `usernotes` MEDIUMTEXT COLLATE utf8_unicode_ci NOT NULL,
  `first_submit` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `appearance` int(11) NOT NULL DEFAULT '1',
  `solution` text COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=10 ;

INSERT INTO `gct_errors` (`id`, `exception`, `versions`, `useragents`, `gccodes`, `lasttours`, `usernotes`, `first_submit`, `appearance`, `solution`) VALUES
(9, 'ReferenceError: getKaese is not defined', 'a:1:{s:9:"2.1.11346";i:7;}', 'a:2:{s:12:"Zwergpiraten";s:70:"Mozilla/5.0 (X11; Linux x86_64; rv:8.0.1) Gecko/20100101 Firefox/8.0.1";s:14:"gctour support";s:70:"Mozilla/5.0 (X11; Linux x86_64; rv:8.0.1) Gecko/20100101 Firefox/8.0.1";}', 'a:2:{s:12:"Zwergpiraten";s:7:"GC2NAGA";s:14:"gctour support";s:7:"GC2NAGA";}', 'a:2:{s:12:"Zwergpiraten";s:267:"{"name":"Tour 85 UPDATED - Kopie","webcode":"GH8KUKC6","geocaches":[{"id":"GC2NAGA","guid":"71b034bf-9f9c-411c-8a1f-c97498a0944d","name":"Sonnenuhren in  Leipzig","image":"http://www.geocaching.com/images/WptTypes/sm/3.gif"}],"id":93,"password":"not yet implemented"}";s:14:"gctour support";s:9515:"{"webcode":"c3bfd541","name":"autoTour 47","geocaches":[{"id":"GC1AGPB","guid":"25560e4d-d4e0-4ed3-9bad-6b471bc86e73","name":"Maltamulti","image":"http://www.geocaching.com/images/WptTypes/sm/3.gif"},{"id":"GC1M4H6","guid":"b5b8a221-6a9a-4c9c-9fe0-f401403be59a","name":"Olympic Forest","image":"http://www.geocaching.com/images/WptTypes/sm/2.gif"},{"id":"GC1QAJM","guid":"91d82400-b9e9-4b3a-be0e-51076117f822","name":"St Paul''s Bay Bypass","image":"http://www.geocaching.com/images/WptTypes/sm/2.gif"},{"id":"GC1QDPX","guid":"b4269f21-b5ca-4f53-a40c-92fb3cc67e59","name":"Roman Baths","image":"http://www.geocaching.com/images/WptTypes/sm/2.gif"},{"id":"GC1QDPQ","guid":"8c134254-86ef-405d-9bf1-42872d273d26","name":"Ta'' Hagrat Temples","image":"http://www.geocaching.com/images/WptTypes/sm/2.gif"},{"id":"GC1QAJJ","guid":"331df4e0-46a2-4c97-8008-90ced194ac94","name":"Selmun Palace","image":"http://www.geocaching.com/images/WptTypes/sm/2.gif"},{"id":"GC1PA4B","guid":"a223a074-ae6b-4918-ad46-74873430614a","name":"Jensen''s Lookout","image":"http://www.geocaching.com/images/WptTypes/sm/2.gif"},{"id":"GC1QAJE","guid":"0ba86e69-134f-405c-bb77-7296d504776c","name":"St Paul''s View","image":"http://www.geocaching.com/images/WptTypes/sm/2.gif"},{"id":"GC23A5C","guid":"e5d6de6f-62c1-42f8-ac9c-3c8cdb30c06f","name":"Mellieha","image":"http://www.geocaching.com/images/WptTypes/sm/2.gif"},{"id":"GC1KFRX","guid":"b4c7a72d-ce49-4816-942e-8df41327e5ab","name":"Bread, Cheese, Tomatoes and...","image":"http://www.geocaching.com/images/WptTypes/sm/2.gif"},{"id":"GC1R57C","guid":"51cab0f3-61cc-488b-99ad-7fa8236e9bae","name":"Karraba","image":"http://www.geocaching.com/images/WptTypes/sm/2.gif"},{"id":"GC1QDPM","guid":"e4d716c4-0a19-4de9-accc-01ff63245c3c","name":"Prickly Pears","image":"http://www.geocaching.com/images/WptTypes/sm/2.gif"},{"id":"GC1P28W","guid":"02c7517a-a2cb-46fd-a651-3c17c7d80bee","name":"Super Nadur Panorama","image":"http://www.geocaching.com/images/WptTypes/sm/2.gif"},{"id":"GC1K59H","guid":"6294f3be-ae3a-42f8-9caf-89dc4dd89ed0","name":"L-Gharusa Hideaway","image":"http://www.geocaching.com/images/WptTypes/sm/2.gif"},{"id":"GCQ7ZC","guid":"f28e6cd0-7d78-42dd-a299-8564f8e996c0","name":"Windy Cove","image":"http://www.geocaching.com/images/WptTypes/sm/2.gif"},{"id":"GC1PKGQ","guid":"4915be95-2125-43c0-b4f1-e77d6ef31b24","name":"Church Close","image":"http://www.geocaching.com/images/WptTypes/sm/2.gif"},{"id":"GC1QAHQ","guid":"63f850c4-9274-49e1-abb2-ca4a66065133","name":"Red Tower","image":"http://www.geocaching.com/images/WptTypes/sm/2.gif"},{"id":"GC22MD2","guid":"dc00cdb0-36a2-47c0-8796-402f68ccbc25","name":"Honey Cave","image":"http://www.geocaching.com/images/WptTypes/sm/2.gif"},{"id":"GC21ZK1","guid":"3546d4e8-b3c1-4794-9ba8-f785a3026cbc","name":"Chadwick Lakes","image":"http://www.geocaching.com/images/WptTypes/sm/2.gif"},{"id":"GC1K23E","guid":"cebbf0f6-e228-46ee-9550-0f698e701e93","name":"Mdina View","image":"http://www.geocaching.com/images/WptTypes/sm/2.gif"},{"id":"GC1JMNP","guid":"8d295502-b850-4bb6-bada-a7fa610bad08","name":"All The Jokes","image":"http://www.geocaching.com/images/WptTypes/sm/2.gif"},{"id":"GC1AKG6","guid":"58dc0c45-1b93-475d-ad0a-eef52013d89c","name":"Knights'' Wash Room","image":"http://www.geocaching.com/images/WptTypes/sm/2.gif"},{"id":"GC1Q473","guid":"f3a0c2cb-6fe5-4d9a-875f-02a50db1e63b","name":"Shark teeth","image":"http://www.geocaching.com/images/WptTypes/sm/2.gif"},{"id":"GC23A5R","guid":"b9d9d477-ecca-4890-9a97-ca8636b69fa1","name":"Go down","image":"http://www.geocaching.com/images/WptTypes/sm/2.gif"},{"id":"GC21534","guid":"42aa4303-4c3d-40d2-818b-167e5f18b266","name":"Mdina","image":"http://www.geocaching.com/images/WptTypes/sm/3.gif"},{"id":"GC1K237","guid":"b1b793cd-23fd-47d5-aa79-6a35f8c560fc","name":"Greek Stroll","image":"http://www.geocaching.com/images/WptTypes/sm/2.gif"},{"id":"GC1ZFF5","guid":"959a09ce-f297-4859-ba09-93cffab380eb","name":"It Toqba","image":"http://www.geocaching.com/images/WptTypes/sm/2.gif"},{"id":"GC1P171","guid":"dfd6c1d8-eed3-4d24-a673-8ffae3e4ccea","name":"Cikka","image":"http://www.geocaching.com/images/WptTypes/sm/2.gif"},{"id":"GCV2N8","guid":"602d1fe3-4f5d-4eb6-a663-3cdbb4132e39","name":"Madliena Woods","image":"http://www.geocaching.com/images/WptTypes/sm/2.gif"},{"id":"GC228XH","guid":"bb56c4b0-dbca-4214-b235-cb40d34ac560","name":"Abandoned houses, empty yards","image":"http://www.geocaching.com/images/WptTypes/sm/2.gif"},{"id":"GCKDCY","guid":"12883518-1270-4e56-b00b-beba5969658e","name":"Birdwatcher''s Cache","image":"http://www.geocaching.com/images/WptTypes/sm/2.gif"},{"id":"GCKDCQ","guid":"8c07595e-48cc-4244-aa10-57e92d598889","name":"Comino Cemetery","image":"http://www.geocaching.com/images/WptTypes/sm/2.gif"},{"id":"GCHEQ7","guid":"d0fbfe3f-0dc0-4c8c-8d02-bf769fca65ec","name":"The Ring of Clapham Junction","image":"http://www.geocaching.com/images/WptTypes/sm/2.gif"},{"id":"GC1PZJG","guid":"a5457464-0e78-477b-a43b-c86ee478454f","name":"Assumption Of Our Lady","image":"http://www.geocaching.com/images/WptTypes/sm/2.gif"},{"id":"GC176VJ","guid":"f3ec53a6-e66e-4d9d-94e3-0f3af4acd54d","name":"All The Money","image":"http://www.geocaching.com/images/WptTypes/sm/2.gif"},{"id":"GCKYNN","guid":"5bfaf37e-d488-4caa-a1bd-e1620ac565dc","name":"green scrubby","image":"http://www.geocaching.com/images/WptTypes/sm/2.gif"},{"id":"GC1QAHJ","guid":"ca2d5c1a-aefc-4fac-96a1-8d2efd979e8d","name":"Is-Salib Tal Gholja","image":"http://www.geocaching.com/images/WptTypes/sm/2.gif"},{"id":"GCP5M5","guid":"b5856f83-9871-4f1e-87ae-c1d994cadb42","name":"Prehistoric Cache","image":"http://www.geocaching.com/images/WptTypes/sm/2.gif"},{"id":"GC12QJ7","guid":"c25ef4b3-6d83-449c-a279-48bf476e6081","name":"Enter The Dragon","image":"http://www.geocaching.com/images/WptTypes/sm/3.gif"},{"id":"GC1PA3N","guid":"ac50c24f-38ce-4743-8f7f-d1af0352e40f","name":"Bellstone","image":"http://www.geocaching.com/images/WptTypes/sm/2.gif"},{"id":"GC1J544","guid":"3ca1b0d7-61f4-4cbc-9ff6-e9d0173d4bfc","name":"Tigne Point – Beach Club Baby","image":"http://www.geocaching.com/images/WptTypes/sm/2.gif"},{"id":"GC1J1FC","guid":"ab98d0b9-6800-461d-9df5-7e6c7245c7e8","name":"Tigne Point - Valletta View","image":"http://www.geocaching.com/images/WptTypes/sm/2.gif"},{"id":"GC1K59V","guid":"a81fe636-d4eb-409f-97cf-e57a8b1dac36","name":"Ghar Lapsi Delight","image":"http://www.geocaching.com/images/WptTypes/sm/2.gif"},{"id":"GC21NT3","guid":"1f774c1d-b3bb-4860-85ef-2c78b525cedd","name":"West Mediterranean Cruise Caches - VALETTA","image":"http://www.geocaching.com/images/WptTypes/sm/2.gif"},{"id":"GC1K23X","guid":"f6b95e39-35ac-4517-82ff-62f8d5890fb2","name":"Oliver Tribute","image":"http://www.geocaching.com/images/WptTypes/sm/2.gif"},{"id":"GC1F50H","guid":"ef43b261-6145-4deb-95db-971766335ba8","name":"Dahlet Qorrot","image":"http://www.geocaching.com/images/WptTypes/sm/2.gif"},{"id":"GC1NZ4G","guid":"29ace59d-997b-41f9-9ac4-571ee48ba61f","name":"Elmo, the Athlete","image":"http://www.geocaching.com/images/WptTypes/sm/2.gif"},{"id":"GC1QTBJ","guid":"83d8128a-9871-46d9-a094-675dc814d274","name":"Maqluba","image":"http://www.geocaching.com/images/WptTypes/sm/2.gif"},{"id":"GC1YZ4D","guid":"810c1be3-f3b5-4b80-af2a-c04338449c54","name":"Wied Blandun","image":"http://www.geocaching.com/images/WptTypes/sm/2.gif"},{"id":"GC1HWV9","guid":"b3ee1d8b-6060-44d1-903a-f00c91ca690c","name":"The Blue Grotto - Il-Hnejja","image":"http://www.geocaching.com/images/WptTypes/sm/137.gif"},{"id":"GC1NXD1","guid":"c3ed9631-29b3-493c-8bc2-44357431db57","name":"Blieqa","image":"http://www.geocaching.com/images/WptTypes/sm/2.gif"},{"id":"GC1F51J","guid":"482e4fa8-b9d5-4bdf-9245-95a1c1cd2265","name":"Gozo Cliffs","image":"http://www.geocaching.com/images/WptTypes/sm/2.gif"},{"id":"GC213DF","guid":"76660639-1e59-46d8-8297-a0040943d20b","name":"The Citadel","image":"http://www.geocaching.com/images/WptTypes/sm/2.gif"},{"id":"GC1NG8G","guid":"b4230856-40a2-42a5-a4b7-bc2bd810e6b4","name":"Xlendi Tower View","image":"http://www.geocaching.com/images/WptTypes/sm/2.gif"},{"id":"GC1NDNE","guid":"f799576a-9df9-490e-aabf-260cb9d1a8c9","name":"The haunted House","image":"http://www.geocaching.com/images/WptTypes/sm/2.gif"},{"id":"GC211YK","guid":"6f48ba89-f818-4745-be72-0cc5adacd15c","name":"Multi Xghajra","image":"http://www.geocaching.com/images/WptTypes/sm/3.gif"},{"id":"GC17RKP","guid":"b607e921-2904-46a8-916c-3c2ba9015181","name":"marsa xl","image":"http://www.geocaching.com/images/WptTypes/sm/2.gif"},{"id":"GC239QP","guid":"b1e034f7-06ad-4b15-a935-648ac85aacad","name":"Ghar Hasan","image":"http://www.geocaching.com/images/WptTypes/sm/2.gif"},{"id":"GC1N7VH","guid":"d4a78f81-cc72-4278-8cf4-e51f265e7dc5","name":"Foxy Rocks @ M''Xlokk","image":"http://www.geocaching.com/images/WptTypes/sm/2.gif"},{"id":"GC17MMM","guid":"fe93f6ca-1160-47be-9099-d5851b1fa6b6","name":"sailor","image":"http://www.geocaching.com/images/WptTypes/sm/2.gif"},{"id":"GC1NG8B","guid":"7fd777b0-a5e2-4450-b433-2108ac15e7b7","name":"Altared Images","image":"http://www.geocaching.com/images/WptTypes/sm/2.gif"},{"id":"GC1557Q","guid":"d099bccd-1e88-492b-af25-dc606ddf2d07","name":"Azure Window","image":"http://www.geocaching.com/images/WptTypes/sm/137.gif"},{"id":"GC1PGJ2","guid":"052c4d11-ff1c-4fb0-befe-f3be639a573a","name":"Ready To Go Micro - Gozo","image":"http://www.geocaching.com/images/WptTypes/sm/2.gif"}],"uuid":"0796733b-4a6d-499c-a820-21453fdcd9f2","password":"many","id":47}";}', 'a:5:{s:34:"Zwergpiraten (12.12.2011 13:56:07)";s:11:"mal wieder!";s:34:"Zwergpiraten (12.12.2011 13:56:30)";s:20:"und noch eine Notiz!";s:34:"Zwergpiraten (12.12.2011 13:56:58)";s:70:"MIT UMLAUTEN UND sonderzeichen öäüöäöü\n\n\\}][{¬½¼³²¹`?=)(/";s:34:"Zwergpiraten (12.12.2011 14:15:41)";s:6:"ohhje!";s:36:"gctour support (12.12.2011 14:16:21)";s:9:"asdasdasd";}', '2011-12-12 12:56:07', 7, '');

DROP TABLE IF EXISTS `gct_geocaches`;
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

DROP TABLE IF EXISTS `gct_geocaches_in_tour`;
CREATE TABLE IF NOT EXISTS `gct_geocaches_in_tour` (
  `webcode` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `gcid` varchar(20) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


DROP TABLE IF EXISTS `gct_map_temp`;
CREATE TABLE IF NOT EXISTS `gct_map_temp` (
  `hash` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `entities` text COLLATE utf8_unicode_ci NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`hash`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


DROP TABLE IF EXISTS `gct_ownwaypoints`;
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


DROP TABLE IF EXISTS `gct_ownwaypoints_in_tour`;
CREATE TABLE IF NOT EXISTS `gct_ownwaypoints_in_tour` (
  `webcode` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `wptcode` varchar(20) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


DROP TABLE IF EXISTS `gct_tours`;
CREATE TABLE IF NOT EXISTS `gct_tours` (
  `webcode` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`webcode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


DROP TABLE IF EXISTS `gct_versions`;
CREATE TABLE IF NOT EXISTS `gct_versions` (
  `version` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `build` int(11) NOT NULL,
  `release_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `bugfixes` text COLLATE utf8_unicode_ci NOT NULL,
  `installs_till` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `gct_versions` (`version`, `build`, `release_date`, `bugfixes`, `installs_till`) VALUES
('2.1', 11313, '2011-11-08 23:00:00', 'FIXED: GPX Download bug "...ctl00_hlSignOut... is undefined"\r\nFIXED: Issue 18\r\nFIXED: Update bug\r\nNEW: Update added link in the error-Dialog\r\nNEW: User can write a message in the error-Dialog', 128000),
('2.1', 11285, '2011-10-11 22:00:00', 'FIXED: autoTour\r\nFIXED: GCTour on the search page\r\nFIXED: Logs in printout\r\nFIXED: Logs in GPX\r\nUPDATED: french translation\r\nGPX: New Groundspeak implementation to prevent XML errors\r\nNEW: Titlepage in the printview now contains coordinates and basic informations\r\nNEW: printview contains now the PM cache note!\r\nNEW: delete button for current tour\r\nNEW: "Last4Logs" (L4L) has been added to the printout - similar to http://www.gsak.net/help/hs11980.htm', 128000),
('2.1', 11293, '2011-10-19 22:00:00', 'FIXED: <=3 Logs in printout -> "Last4Logs" (L4L) in the printout\nFIXED: Logs in GPX (Unicode hexadez.)\nUPDATED: dutch translation\nAdd jQuery (1.6.4) and jQuery-ui (1.8.16)', 128000);

DROP TABLE IF EXISTS `gct_waypoints`;
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
