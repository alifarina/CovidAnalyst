-- phpMyAdmin SQL Dump
-- version 4.9.7
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jan 26, 2021 at 03:15 PM
-- Server version: 10.1.47-MariaDB-0+deb9u1
-- PHP Version: 7.4.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sev5204e_11`
--

-- --------------------------------------------------------

--
-- Table structure for table `Consultations`
--

CREATE TABLE `Consultations` (
  `Patient_Id` varchar(50) NOT NULL,
  `GP_Id` varchar(50) NOT NULL,
  `Consultation_Text` varchar(800) NOT NULL,
  `IsCovidTestRequired` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `Consultations`
--

INSERT INTO `Consultations` (`Patient_Id`, `GP_Id`, `Consultation_Text`, `IsCovidTestRequired`) VALUES
('a4a5a0bf-d5ef-4715-898e-d1701a0663e9', 'e6f048a5-a18b-42eb-aefd-b4d491596dcb', 'consultationText', 1),
('da7b3722-5530-40db-8be1-1dfb8d1afc80', 'ea775e52-210c-439a-bfbc-4df0df9e4230', '', 0);

-- --------------------------------------------------------

--
-- Table structure for table `GP_Info`
--

CREATE TABLE `GP_Info` (
  `GP_Id` varchar(50) NOT NULL,
  `Name` varchar(50) NOT NULL,
  `Sex` varchar(10) NOT NULL,
  `Age` int(11) NOT NULL,
  `Location` varchar(50) NOT NULL,
  `Blood_Group` varchar(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `GP_Info`
--

INSERT INTO `GP_Info` (`GP_Id`, `Name`, `Sex`, `Age`, `Location`, `Blood_Group`) VALUES
('e6f048a5-a18b-42eb-aefd-b4d491596dcb', 'Ankit Nagar', 'Male', 27, 'Paris', 'B+'),
('ea775e52-210c-439a-bfbc-4df0df9e4230', 'Farna Ali Doctor', 'Female', 29, 'Paris', 'O+');

-- --------------------------------------------------------

--
-- Table structure for table `Patient_Daily_Record`
--

CREATE TABLE `Patient_Daily_Record` (
  `Patient_Id` varchar(50) NOT NULL,
  `Breathlessness` bit(1) NOT NULL,
  `Fever` bit(1) NOT NULL,
  `Loss_Of_Taste_Smell` bit(1) NOT NULL,
  `Dry_Cough` bit(1) NOT NULL,
  `Sore_Throat` bit(1) NOT NULL,
  `Oxygen_Level` int(11) NOT NULL,
  `Heart_Rate` int(11) NOT NULL,
  `Blood_Pressure` int(11) NOT NULL,
  `Temperature` double NOT NULL,
  `Contact_With_Covid_Positive_Patient` bit(1) NOT NULL,
  `Date_Created` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `Patient_Daily_Record`
--

INSERT INTO `Patient_Daily_Record` (`Patient_Id`, `Breathlessness`, `Fever`, `Loss_Of_Taste_Smell`, `Dry_Cough`, `Sore_Throat`, `Oxygen_Level`, `Heart_Rate`, `Blood_Pressure`, `Temperature`, `Contact_With_Covid_Positive_Patient`, `Date_Created`) VALUES
('a7f37d1d-58d1-4212-8bd6-2f6f6f7b672d', b'0', b'0', b'0', b'0', b'0', 34, 87, 123, 87, b'1', '2021-01-21'),
('da7b3722-5530-40db-8be1-1dfb8d1afc80', b'1', b'1', b'1', b'0', b'0', 80, 90, 120, 90, b'1', '2021-01-26'),
('da7b3722-5530-40db-8be1-1dfb8d1afc80', b'0', b'1', b'1', b'0', b'0', 80, 60, 90, 90, b'0', '2021-01-26');

-- --------------------------------------------------------

--
-- Table structure for table `Patient_Health_Info`
--

CREATE TABLE `Patient_Health_Info` (
  `Patient_Id` varchar(50) NOT NULL,
  `Hypertension` bit(1) NOT NULL,
  `Diabetes` bit(1) NOT NULL,
  `Cardiovascular_Disease` bit(1) NOT NULL,
  `Chronic_Respiratory_Disease` bit(1) NOT NULL,
  `Registered_On` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `Patient_Health_Info`
--

INSERT INTO `Patient_Health_Info` (`Patient_Id`, `Hypertension`, `Diabetes`, `Cardiovascular_Disease`, `Chronic_Respiratory_Disease`, `Registered_On`) VALUES
('da7b3722-5530-40db-8be1-1dfb8d1afc80', b'0', b'1', b'1', b'1', '2021-01-21'),
('a4a5a0bf-d5ef-4715-898e-d1701a0663e9', b'1', b'1', b'1', b'0', '2021-01-25');

-- --------------------------------------------------------

--
-- Table structure for table `Patient_Info`
--

CREATE TABLE `Patient_Info` (
  `Patient_Id` varchar(50) NOT NULL,
  `Name` varchar(50) NOT NULL,
  `Sex` varchar(10) NOT NULL,
  `Age` int(11) NOT NULL,
  `Location` varchar(50) NOT NULL,
  `Blood_Group` varchar(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `Patient_Info`
--

INSERT INTO `Patient_Info` (`Patient_Id`, `Name`, `Sex`, `Age`, `Location`, `Blood_Group`) VALUES
('da7b3722-5530-40db-8be1-1dfb8d1afc80', 'Ankit Nagar', 'Male', 27, 'Paris', 'B+'),
('a4a5a0bf-d5ef-4715-898e-d1701a0663e9', 'Another Patient', 'Male', 56, 'Paris', 'B+'),
('a7f37d1d-58d1-4212-8bd6-2f6f6f7b672d', 'namo', 'Female', 27, 'Paris', 'B-');

-- --------------------------------------------------------

--
-- Table structure for table `User_Access`
--

CREATE TABLE `User_Access` (
  `Username` varchar(50) NOT NULL,
  `Usertype` varchar(50) NOT NULL,
  `Password` varchar(50) NOT NULL,
  `User_Id` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `User_Access`
--

INSERT INTO `User_Access` (`Username`, `Usertype`, `Password`, `User_Id`) VALUES
('ankitnagar', 'GP', '*2470C0C06DEE42FD1618BB99005ADCA2EC9D1E19', 'e6f048a5-a18b-42eb-aefd-b4d491596dcb'),
('Cleo', 'Patient', '1234', 'e6f048a5-a18b-42eb-aefd-b4d492596dcb'),
('ankitnagar1', 'Patient', '*2470C0C06DEE42FD1618BB99005ADCA2EC9D1E19', 'da7b3722-5530-40db-8be1-1dfb8d1afc80'),
('farinali', 'GP', '*2470C0C06DEE42FD1618BB99005ADCA2EC9D1E19', 'ea775e52-210c-439a-bfbc-4df0df9e4230'),
('anotherpatient', 'Patient', '*2470C0C06DEE42FD1618BB99005ADCA2EC9D1E19', 'a4a5a0bf-d5ef-4715-898e-d1701a0663e9'),
('name', 'Patient', '*196BDEDE2AE4F84CA44C47D54D78478C7E2BD7B7', 'a7f37d1d-58d1-4212-8bd6-2f6f6f7b672d');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
