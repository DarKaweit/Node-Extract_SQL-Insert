/*****************************************************************/ 
/**** BASE DE DONNEES - VERSION 4.1 pour Node-Extract_SQL-Insert

/**** EN TEST (01/01/2019) :

Modification de certains noms d'espèces pour résoudre un bug de requêtes (transformation des & et '/' en ',')

/*****************************************************************/


SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";



--
-- Base de données :  `test_sakana`
--

DROP DATABASE IF EXISTS `test_sakana`;
CREATE DATABASE `test_sakana` DEFAULT CHARACTER SET utf8;
USE `test_sakana`;


-- --------------------------------------------------------

--
-- Structure de la table `species`
--

DROP TABLE IF EXISTS `species`;
CREATE TABLE `species` (
  `id_specie` int(11) NOT NULL AUTO_INCREMENT, -- clé primaire
  `name_specie` varchar(40) DEFAULT NULL,
  `super_zone` varchar(40) DEFAULT NULL,
  `zone` varchar(40) DEFAULT NULL,

  PRIMARY KEY (`id_specie`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=43;


-- --------------------------------------------------------

--
-- Déchargement des données de la table `species`
--

INSERT INTO `species` (`id_specie`, `name_specie`, `super_zone`, `zone`) VALUES
(1, 'Cod', 'North sea', 'North sea'),
(2, 'Haddock', 'North sea', 'North sea'),
(3, 'Whiting', 'North sea', 'North sea'),
(4, 'Saithe', 'North sea', 'North sea'),
(5, 'Plaice', 'North sea', 'North sea'),
(6, 'Sole', 'North sea', 'North sea'),
(7, 'Hake', 'North sea', 'North sea'),
(8, 'Nephrops', 'North sea', 'North sea'),
(9, 'Norway others', 'North sea', 'North sea'),
(10, 'Monkfish', 'North sea', 'North sea'),
(11, 'Megrim', 'North sea', 'North sea'),
(12, 'Lem Sole, Witches', 'North sea', 'North sea'),
(13, 'Skates, Rays', 'North sea', 'North sea'),
(14, 'Dabs, Flounders', 'North sea', 'North sea'),
(15, 'Turbot, Brill', 'North sea', 'North sea'),
(16, 'Spurdog (zero TAC)', 'North sea', 'North sea'),
(17, 'Northern prawn', 'North sea', 'North sea'),
(18, 'Cod', 'West of Scotland', 'VIb'),
(19, 'Cod', 'West of Scotland', 'VIa,Vb (EC)'),
(20, 'Haddock', 'West of Scotland', 'VIb, XII, XIV'),
(21, 'Haddock', 'West of Scotland', 'VIa,Vb (EC)'),
(22, 'Whiting', 'West of Scotland', 'West of Scotland'),
(23, 'Saithe', 'West of Scotland', 'West of Scotland'),
(24, 'Plaice', 'West of Scotland', 'West of Scotland'),
(25, 'Sole', 'West of Scotland', 'West of Scotland'),
(26, 'Hake', 'West of Scotland', 'inc VII'),
(27, 'Monkfish', 'West of Scotland', 'West of Scotland'),
(28, 'Nephrops', 'West of Scotland', 'West of Scotland'),
(29, 'Megrim', 'West of Scotland', 'West of Scotland'),
(30, 'Pollack', 'West of Scotland', 'West of Scotland'),
(31, 'Greenland Halibut', 'West of Scotland', 'II,IV,VI'),
(32, 'Spurdog (zero TAC)', 'West of Scotland', 'West of Scotland'),
(33, 'Cod, Haddock', 'Faroes', 'Faroes'),
(34, 'Saithe', 'Faroes', 'Faroes'),
(35, 'Redfish', 'Faroes', 'Faroes'),
(36, 'Ling, Blue Ling', 'Faroes', 'Faroes'),
(37, 'Flatfish', 'Faroes', 'Faroes'),
(38, 'Others', 'Faroes', 'Faroes'),
(39, 'Blue Whiting', 'Faroes', 'Faroes'),
(40, 'Tusk', 'Norway', 'Norway'),
(41, 'Monkfish', 'Norway', 'Norway'),
(42, 'Ling', 'Norway', 'Norway'),
(43, 'Nephrops', 'Norway', 'Norway');


-- --------------------------------------------------------

--
-- Structure de la table `fishing`
--

DROP TABLE IF EXISTS `fishing`;
CREATE TABLE `fishing` (
  `id_fishing` int(11) NOT NULL AUTO_INCREMENT, -- clé primaire
  `id_specie` int(11) DEFAULT NULL, -- clé étrangère
  `date` date NULL,
  `value_landing` decimal(11,2) DEFAULT NULL,
  `value_quota` decimal(11,2) DEFAULT NULL,

  PRIMARY KEY (`id_fishing`), 
  CONSTRAINT `FK_FishingSpecie` FOREIGN KEY (`id_specie`) 
  REFERENCES `species` (`id_specie`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=0 ;


-- --------------------------------------------------------

--
-- Structure de la table `id_mails`
--

DROP TABLE IF EXISTS `id_mails`;
CREATE TABLE IF NOT EXISTS `id_mails` (
  `id_mail` int(11) NOT NULL AUTO_INCREMENT, -- clé primaire
  `mail_number` varchar (50) NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, -- date du jour
  -- `mail_date` int(11) unsigned NULL, -- date du message (api gmail) - ne marche pas !
  PRIMARY KEY (`id_mail`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=0;

--
-- Structure de la table `cron_infos`
--

DROP TABLE IF EXISTS `cron_infos`;
CREATE TABLE IF NOT EXISTS `cron_infos` (
  `id_cron` int(11) NOT NULL AUTO_INCREMENT, -- clé primaire
  `cron_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_cron`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=0;