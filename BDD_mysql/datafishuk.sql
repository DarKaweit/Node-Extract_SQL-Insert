/*****************************************************************/ 
/**** BASE DE DONNEES (MYSQL) - VERSION 2 pour Node-Extract_SQL-Insert(COMMIT N° 3)                           ****/

/* insertion des données de la table 'fishing'                ****/
/* modification des valeur de certains champs (NULL >> NOT NULL) */
//**** ATTENTION : l'utilisation de ce fichier est irrévocable et supprime définitivement les données de votre base de donnée.
/*****************************************************************/


-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le :  Dim 08 avr. 2018 à 14:07
-- Version du serveur :  5.7.19
-- Version de PHP :  5.6.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `test_sakana`
--
CREATE DATABASE IF NOT EXISTS `test_sakana` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `test_sakana`;


-- --------------------------------------------------------

--
-- Structure de la table `species`
--

DROP TABLE IF EXISTS `species`;
CREATE TABLE `species` (
  `id_specie` int(11) NULL,
  `name_specie` varchar(40) DEFAULT NULL,
  `super_zone` varchar(40) DEFAULT NULL,
  `zone` varchar(40) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- --------------------------------------------------------

--
-- Structure de la table `fishing`
--

DROP TABLE IF EXISTS `fishing`;
CREATE TABLE `fishing` (
  `id_fishing` int(11) NULL,
  `id_specie` int(11) DEFAULT NULL,
  `date` date NULL,
  `value_landing` int(11) DEFAULT NULL,
  `value_quota` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
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
(12, 'Lem Sole & Witches', 'North sea', 'North sea'),
(13, 'Skates & Rays', 'North sea', 'North sea'),
(14, 'Dabs & Flounders', 'North sea', 'North sea'),
(15, 'Turbot & Brill', 'North sea', 'North sea'),
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
(33, 'Cod / Haddock', 'Faroes', 'Faroes'),
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

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `fishing`
--
ALTER TABLE `fishing`
  ADD PRIMARY KEY (`id_fishing`),
  ADD KEY `FK_FishingSpecie` (`id_specie`);

--
-- Index pour la table `species`
--
ALTER TABLE `species`
  ADD PRIMARY KEY (`id_specie`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `fishing`
--
ALTER TABLE `fishing`
  MODIFY `id_fishing` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `species`
--
ALTER TABLE `species`
  MODIFY `id_specie` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
