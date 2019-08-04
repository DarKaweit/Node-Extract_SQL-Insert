/*****************************************************************/ 
/**** BASE DE DONNEES - VERSION 5.1 pour Node-Extract_SQL-Insert

/**** EN TEST (20/07/2019) :

Modification structurelle pour l'ajout de coordonnées géographiques :

    >> création des tables 'zones' et 'super_zones' et modification de la table 'species' en conséquence
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
    `name_super_zone` varchar(40) DEFAULT NULL,
    `sz_coord` varchar(2000) DEFAULT NULL,
    PRIMARY KEY (`id_super_zone`)
) ENGINE=InnoDB CHARSET=UTF8 AUTO_INCREMENT=4;


-- --------------------------------------------------------

--
-- Déchargement des données (coordonnées géographiques) de la table `super_zones` :
--

INSERT INTO `super_zones` (`id_super_zone`, `name_super_zone`, `sz_coord`) VALUES
(1, 'Faroes', '[]'),
(2, 'North Sea', '[[55, 0], [58, 0], [58, 4], [55, 4], [55, 0]]'),
(3, 'Norway', '[]'),
(4, 'West of Scotland', '[[60, -2], [64, -2], [64, 2], [60, 2], [60, -2]]');


-- --------------------------------------------------------

-- --------------------------------------------------------

--
-- Structure de la table `zones`
--

DROP TABLE IF EXISTS `zones`;
CREATE TABLE `zones` (
    `id_zone` int(11) NOT NULL AUTO_INCREMENT, -- clé primaire
    `name_zone` varchar(40) DEFAULT NULL,
    `z_coord` varchar(2000) DEFAULT NULL,
    -- `id_super_zone` int(11) DEFAULT NULL, -- clé étrangère
    
    PRIMARY KEY (`id_zone`)
    -- CONSTRAINT `FK_FishingSuperZones` FOREIGN KEY (`id_super_zone`) REFERENCES `super_zones` (`id_super_zone`)
) ENGINE=InnoDB CHARSET=UTF8 AUTO_INCREMENT=9;

-- --------------------------------------------------------

--
-- Déchargement des données (coordonnées géographiques) de la table `zones` :
--

INSERT INTO `zones` (`id_zone`, `name_zone`, `z_coord`) VALUES
(1, 'Faroes', '[]'),
(2, 'inc VII', '[]'),
(3, 'North Sea', '[[55, 0], [58, 0], [58, 4], [55, 4], [55, 0]]'),
(4, 'Norway', '[]'),
(5, 'West of Scotland', '[[60, -2], [64, -2], [64, 2], [60, 2], [60, -2]]'),
(6, 'II,IV,VI', '[]'),
(7, 'VIa,Vb (EC)', '[]'),
(8, 'VIb', '[]'),
(9, 'VIb, XII, XIV', '[]');

-- --------------------------------------------------------

--
-- Structure de la table `species`
--

DROP TABLE IF EXISTS `species`;
CREATE TABLE `species` (
  `id_specie` int(11) NOT NULL AUTO_INCREMENT, -- clé primaire
  `name_specie` varchar(40) DEFAULT NULL,
  `id_super_zone` int(11) DEFAULT NULL, -- clé étrangère
  `id_zone` int(11) DEFAULT NULL, -- clé étrangère

PRIMARY KEY (`id_specie`),
CONSTRAINT `FK_FishingZones` FOREIGN KEY (`id_zone`) 
REFERENCES `zones` (`id_zone`),
CONSTRAINT `FK_FishingSuperZones` FOREIGN KEY (`id_super_zone`) 
REFERENCES `super_zones` (`id_super_zone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8; -- AUTO_INCREMENT=43;


-- --------------------------------------------------------

--
-- Déchargement des données de la table `species`
--

INSERT INTO `species` (`id_specie`, `name_specie`, `id_super_zone`, `id_zone`) VALUES
(1, 'Cod', '2', '3'),
(2, 'Haddock', '2', '3'),
(3, 'Whiting', '2', '3'),
(4, 'Saithe', '2', '3'),
(5, 'Plaice', '2', '3'),
(6, 'Sole', '2', '3'),
(7, 'Hake', '2', '3'),
(8, 'Nephrops', '2', '3'),
(9, 'Norway others', '2', '3'),
(10, 'Monkfish', '2', '3'),
(11, 'Megrim', '2', '3'),
(12, 'Lem Sole, Witches', '2', '3'),
(13, 'Skates, Rays', '2', '3'),
(14, 'Dabs, Flounders', '2', '3'),
(15, 'Turbot, Brill', '2', '3'),
(16, 'Spurdog (zero TAC)', '2', '3'),
(17, 'Northern prawn', '2', '3'),
(18, 'Cod', '4', '8'),
(19, 'Cod', '4', '7'),
(20, 'Haddock', '4', '9'),
(21, 'Haddock', '4', '7'),
(22, 'Whiting', '4', '5'),
(23, 'Saithe', '4', '5'),
(24, 'Plaice', '4', '5'),
(25, 'Sole', '4', '5'),
(26, 'Hake', '4', '2'),
(27, 'Monkfish', '4', '5'),
(28, 'Nephrops', '4', '5'),
(29, 'Megrim', '4', '5'),
(30, 'Pollack', '4', '5'),
(31, 'Greenland Halibut', '4', '6'),
(32, 'Spurdog (zero TAC)', '4', '5'),
(33, 'Cod, Haddock', '1', '1'),
(34, 'Saithe', '1', '1'),
(35, 'Redfish', '1', '1'),
(36, 'Ling, Blue Ling', '1', '1'),
(37, 'Flatfish', '1', '1'),
(38, 'Others', '1', '1'),
(39, 'Blue Whiting', '1', '1'),
(40, 'Tusk', '3', '4'),
(41, 'Monkfish', '3', '4'),
(42, 'Ling', '3', '4'),
(43, 'Nephrops', '3', '4');

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
  `id_cron` int(11) DEFAULT NULL, -- clé étrangère
  -- `mail_date` int(11) unsigned NULL, -- date du message (api gmail) - ne marche pas !
  PRIMARY KEY (`id_mail`),
  CONSTRAINT `FK_FishingCrons` FOREIGN KEY (`id_cron`)
  REFERENCES `cron_infos` (`id_cron`)
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
  `id_specie` int(11) DEFAULT NULL, -- clé étrangère
  -- `id_mail` int(11) DEFAULT NULL, -- clé étrangère
  `date` date NULL,
  `value_landing` decimal(11,2) DEFAULT NULL,
  `value_quota` decimal(11,2) DEFAULT NULL,

  PRIMARY KEY (`id_fishing`),
  CONSTRAINT `FK_FishingSpecie` FOREIGN KEY (`id_specie`) 
  REFERENCES `species` (`id_specie`)
  -- CONSTRAINT `FK_FishingMails` FOREIGN KEY (`id_mail`)
  -- REFERENCES `mail_infos` (`id_mail`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=0;



-- INSERT INTO fishing (id_specie, id_mail, id_zone, id_super_zone, date, value_landing, value_quota) VALUES ?
