/*****************************************************************/ 
/**** BASE DE DONNEES - VERSION 5.2 pour Node-Extract_SQL-Insert

/**** EN TEST (20/07/2019) :

  Modification structurelle pour l'ajout de coordonnées géographiques :

    >> création des tables 'zones' et 'super_zones' (avec champs 'string' de coordonnées pour créer des polygones sur une carte), création d'une table 'fishzone_join' pour croiser des données et modification de la table 'species' en conséquence

/****  A FAIRE :

    >> ajout d'un champs 'id_mail' (PK) pour lier les tables 'mail_infos' et 'fishing'

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
-- Structure de la table `super_zones`
--

DROP TABLE IF EXISTS `super_zones`;
CREATE TABLE `super_zones` (
    `id_super_zone` int(11) NOT NULL AUTO_INCREMENT, -- clé primaire
    `super_zone` varchar(40) DEFAULT NULL,
    `sz_coord` json DEFAULT NULL, -- varchar(2000)
    PRIMARY KEY (`id_super_zone`)
) ENGINE=InnoDB CHARSET=UTF8 AUTO_INCREMENT=4;


-- --------------------------------------------------------

--
-- Déchargement des données (coordonnées géographiques) de la table `super_zones` :
--

INSERT INTO `super_zones` (`id_super_zone`, `super_zone`, `sz_coord`) VALUES
(1, 'Faroes', '[]'),
(2, 'North Sea', '[]'),
(3, 'Norway', '[]'),
(4, 'West of Scotland', '[]');



-- --------------------------------------------------------

-- --------------------------------------------------------

--
-- Structure de la table `zones`
--

DROP TABLE IF EXISTS `zones`;
CREATE TABLE `zones` (
    `id_zone` int(11) NOT NULL AUTO_INCREMENT, -- clé primaire
    `zone` varchar(40) DEFAULT NULL,
    `z_coord` json DEFAULT NULL,
    -- `id_super_zone` int(11) DEFAULT NULL, -- clé étrangère
    
    PRIMARY KEY (`id_zone`)
    -- CONSTRAINT `FK_FishingSuperZones` FOREIGN KEY (`id_super_zone`) REFERENCES `super_zones` (`id_super_zone`)
) ENGINE=InnoDB CHARSET=UTF8 AUTO_INCREMENT=9;

-- --------------------------------------------------------

--
-- Déchargement des données (coordonnées géographiques) de la table `zones` :
--

INSERT INTO `zones` (`id_zone`, `zone`, `z_coord`) VALUES
(1, 'Faroes', '[[60.4, -13.7], [60.4, -4.5], [63, -4.5], [63, -13.7]]'),
(2, 'inc VII', '[[48.1, -13.6], [48.1, -7.1], [50.5, -7.1], [50.5, -13.6]]'),
(3, 'North Sea', '[[[55, 0], [58, 0], [58, 4], [55, 4]], [[50, 0], [53, 0], [53, 4], [50, 4]]]'),
(4, 'Norway', '[[64.3, -3.2], [64.3, 7.5], [69.6, 7.5], [69.6, -3.2]]'),
(5, 'West of Scotland', '[[56.2, -16.8], [56.2, -12.4], [57.5, -12.4], [57.5, -16.8]]'),
(6, 'II,IV,VI', '[[59.1, -2.1], [59.1, 4.3], [61.3, 4.3], [61.3, -2.1]]'),
(7, 'VIa,Vb (EC)', '[[54.8, -12.7], [54.8, -9.6], [60.6, -9.6], [60.6, -12.7]]'),
(8, 'VIb', '[[54.8, -16.7], [54.8, -12.4], [56.1, -12.4], [56.1, -16.7]]'),
(9, 'VIb, XII, XIV', '[[55.3, -36.5], [55.3, -22.4], [61.8, -22.4], [61.8, -36.5]]');

-- --------------------------------------------------------

--
-- Structure de la table `species`
--

DROP TABLE IF EXISTS `species`;
CREATE TABLE `species` (
  `id_specie` int(11) NOT NULL AUTO_INCREMENT, -- clé primaire
  `name_specie` varchar(40) DEFAULT NULL,

PRIMARY KEY (`id_specie`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Déchargement des données (coordonnées géographiques) de la table `zones` :
--

INSERT INTO `species` (`id_specie`, `name_specie`) VALUES
(1, 'Blue Whiting'),
(2, 'Cod'),
(3, 'Cod, Haddock'),
(4, 'Dabs, Flounders'),
(5, 'Flatfish'),
(6, 'Greenland Halibut'),
(7, 'Haddock'),
(8, 'Hake'),
(9, 'Lem Sole, Witches'),
(10, 'Ling'),
(11, 'Ling, Blue Ling'),
(12, 'Megrim'),
(13, 'Monkfish'),
(14, 'Nephrops'),
(15, 'Northern prawn'),
(16, 'Norway others'),
(17, 'Others'),
(18, 'Plaice'),
(19, 'Pollack'),
(20, 'Redfish'),
(21, 'Saithe'),
(22, 'Skates, Rays'),
(23, 'Sole'),
(24, 'Spurdog (zero TAC)'),
(25, 'Tusk'),
(26, 'Turbot, Brill'),
(27, 'Whiting');






-- --------------------------------------------------------

--
-- Structure de la table `fishzone_join`
--
DROP TABLE IF EXISTS `fishzone_join`;
CREATE TABLE `fishzone_join` (
  `id_fishzone_join` int(11) NOT NULL AUTO_INCREMENT, -- clé primaire
  `id_specie` int(11) DEFAULT NULL, -- clé étrangère
  `id_super_zone` int(11) DEFAULT NULL, -- clé étrangère
  `id_zone` int(11) DEFAULT NULL, -- clé étrangère

PRIMARY KEY (`id_fishzone_join`),
CONSTRAINT `FK_FishingSpecies` FOREIGN KEY (`id_specie`)
REFERENCES `species` (`id_specie`),
CONSTRAINT `FK_FishingZones` FOREIGN KEY (`id_zone`) 
REFERENCES `zones` (`id_zone`),
CONSTRAINT `FK_FishingSuperZones` FOREIGN KEY (`id_super_zone`) 
REFERENCES `super_zones` (`id_super_zone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8; -- AUTO_INCREMENT=43;


-- --------------------------------------------------------

--
-- Déchargement des données de la table `species`
--

INSERT INTO `fishzone_join` (`id_fishzone_join`, `id_specie`, `id_super_zone`, `id_zone`) VALUES
(1, '2', '2', '3'),
(2, '7', '2', '3'),
(3, '27', '2', '3'),
(4, '21', '2', '3'),
(5, '18', '2', '3'),
(6, '23', '2', '3'),
(7, '8', '2', '3'),
(8, '14', '2', '3'),
(9, '16', '2', '3'),
(10, '13', '2', '3'),
(11, '12', '2', '3'),
(12, '9', '2', '3'),
(13, '22', '2', '3'),
(14, '4', '2', '3'),
(15, '26', '2', '3'),
(16, '24', '2', '3'),
(17, '15', '2', '3'),
(18, '2', '4', '8'),
(19, '2', '4', '7'),
(20, '7', '4', '9'),
(21, '7', '4', '7'),
(22, '27', '4', '5'),
(23, '21', '4', '5'),
(24, '18', '4', '5'),
(25, '23', '4', '5'),
(26, '8', '4', '2'),
(27, '13', '4', '5'),
(28, '14', '4', '5'),
(29, '12', '4', '5'),
(30, '19', '4', '5'),
(31, '6', '4', '6'),
(32, '24', '4', '5'),
(33, '3', '1', '1'),
(34, '21', '1', '1'),
(35, '20', '1', '1'),
(36, '11', '1', '1'),
(37, '5', '1', '1'),
(38, '17', '1', '1'),
(39, '1', '1', '1'),
(40, '25', '3', '4'),
(41, '13', '3', '4'),
(42, '10', '3', '4'),
(43, '14', '3', '4');

-- --------------------------------------------------------

DROP TABLE IF EXISTS `cron_infos`;
CREATE TABLE IF NOT EXISTS `cron_infos` (
  `id_cron` int(11) NOT NULL AUTO_INCREMENT, -- clé primaire
  `cron_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_cron`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=0;

-- --------------------------------------------------------

--
-- Structure de la table `mail_infos`
--

DROP TABLE IF EXISTS `mail_infos`;
CREATE TABLE IF NOT EXISTS `mail_infos` (
  `id_mail` int(11) NOT NULL AUTO_INCREMENT, -- clé primaire
  `mail_number` varchar (50) NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, -- date du jour
  -- `id_cron` int(11) DEFAULT NULL, -- clé étrangère
  -- `mail_date` int(11) unsigned NULL, -- date du message (api gmail) - ne marche pas !
  PRIMARY KEY (`id_mail`)
  -- CONSTRAINT `FK_FishingCrons` FOREIGN KEY (`id_cron`)
  -- REFERENCES `cron_infos` (`id_cron`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=0;

--
-- Structure de la table `cron_infos`
--

-- --------------------------------------------------------

--
-- Structure de la table `fishing`
--

DROP TABLE IF EXISTS `fishing`;
CREATE TABLE `fishing` (
  `id_fishing` int(11) NOT NULL AUTO_INCREMENT, -- clé primaire
  `id_fishzone_join` int(11) DEFAULT NULL, -- clé étrangère
  -- `id_mail` int(11) DEFAULT NULL, -- clé étrangère
  `date` date NULL,
  `value_landing` decimal(11,2) DEFAULT NULL,
  `value_quota` decimal(11,2) DEFAULT NULL,

  PRIMARY KEY (`id_fishing`),
  CONSTRAINT `FK_FishZoneJoin` FOREIGN KEY (`id_fishzone_join`) 
  REFERENCES `fishzone_join` (`id_fishzone_join`)
  -- CONSTRAINT `FK_FishingMails` FOREIGN KEY (`id_mail`)
  -- REFERENCES `mail_infos` (`id_mail`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=0;