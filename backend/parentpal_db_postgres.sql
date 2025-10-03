-- PostgreSQL Database Schema for ParentPal
-- Converted from MySQL

-- Table: account
CREATE TABLE account (
  account_id SERIAL PRIMARY KEY,
  firebase_uid VARCHAR(128) NOT NULL,
  babysitter_id INTEGER DEFAULT NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email_address VARCHAR(100) NOT NULL UNIQUE,
  account_type VARCHAR(20) NOT NULL CHECK (account_type IN ('parent', 'babysitter', 'admin')),
  birth_date DATE DEFAULT NULL,
  gender VARCHAR(10) DEFAULT NULL CHECK (gender IN ('M', 'F', 'Other', 'Male', 'Female'))
);

-- Insert data for account
INSERT INTO account (account_id, firebase_uid, babysitter_id, first_name, last_name, email_address, account_type, birth_date, gender) VALUES
(3, 'Js7smViHnqO6ww6AufSY22GmX7j2', NULL, 'Parent', 'Ex', 'parent@gmail.com', 'parent', '1997-01-01', 'Male'),
(4, 'f6MzklFdKISJ05rQcawNkXWExXC3', NULL, 'Babysitter', 'Ex', 'babysitter@gmail.com', 'babysitter', '1997-02-02', 'Female'),
(5, 'nLR8PSWJuPQcUmlZmNpJ0BN7Ul73', NULL, 'babysitter2', 'ex2', 'babysitter2@gmail.com', 'babysitter', '1997-02-02', 'Female'),
(6, 'SDXFgW675nVTVObkTdBwnGHHev83', NULL, 'Bob', 'Parker', 'bob@gmail.com', 'babysitter', '1997-01-04', 'Male'),
(7, 'z0YsJ1Dj6JPX7WaA5AOAdbqXnPB2', NULL, 'parent2', 'p2', 'parent2@gmail.com', 'parent', '1997-02-02', 'Male'),
(8, 'SFiY3uP4K3hcXsVCHoNAMcQYitM2', NULL, 'parent3', 'parent3', 'parent3@gmail.com', 'parent', '1997-02-02', 'Male'),
(9, 'yXEltNfdtrcoxkTW9JQUwQv52Sm2', NULL, 'Brae', 'l', 'braeden.lyman77@gmail.com', 'babysitter', '1997-01-04', 'Male');

-- Set sequence for account
SELECT setval('account_account_id_seq', 10);

-- Table: baby
CREATE TABLE baby (
  baby_id SERIAL PRIMARY KEY,
  parent_id INTEGER NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  birth_date DATE DEFAULT NULL,
  gender VARCHAR(10) DEFAULT NULL CHECK (gender IN ('M', 'F', 'Other', 'Male', 'Female'))
);

-- Insert data for baby
INSERT INTO baby (baby_id, parent_id, first_name, last_name, birth_date, gender) VALUES
(2, 3, 'Baby1', 'Ex1', '2002-02-02', 'Female'),
(3, 7, 'babyTwo', 'BTwo', '2002-02-02', 'Female'),
(4, 8, 'baby3', 'three', '2003-03-03', 'Female');

-- Set sequence for baby
SELECT setval('baby_baby_id_seq', 5);

-- Table: babysitter
CREATE TABLE babysitter (
  babysitter_id SERIAL PRIMARY KEY,
  parent_id INTEGER DEFAULT NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email_address VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  birth_date DATE DEFAULT NULL,
  gender VARCHAR(10) DEFAULT NULL CHECK (gender IN ('M', 'F', 'Other'))
);

-- Table: babysitter_shares
CREATE TABLE babysitter_shares (
  share_id SERIAL PRIMARY KEY,
  parent_id INTEGER NOT NULL,
  babysitter_email VARCHAR(255) NOT NULL,
  babysitter_name VARCHAR(255) NOT NULL,
  verification_code CHAR(4) NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  babysitter_id INTEGER DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  verified_at TIMESTAMP NULL DEFAULT NULL,
  expires_at TIMESTAMP NULL DEFAULT NULL
);

CREATE INDEX idx_parent_id ON babysitter_shares(parent_id);
CREATE INDEX idx_babysitter_email ON babysitter_shares(babysitter_email);
CREATE INDEX idx_verification_code ON babysitter_shares(verification_code);
CREATE INDEX idx_babysitter_id ON babysitter_shares(babysitter_id);

-- Set sequence for babysitter_shares
SELECT setval('babysitter_shares_share_id_seq', 5);

-- Table: allergies
CREATE TABLE allergies (
  allergy_id SERIAL PRIMARY KEY,
  baby_id INTEGER NOT NULL,
  allergy_name VARCHAR(100) DEFAULT NULL,
  severity VARCHAR(10) DEFAULT NULL CHECK (severity IN ('low', 'medium', 'high')),
  epi_pen BOOLEAN DEFAULT NULL,
  notes TEXT
);

-- Insert data for allergies
INSERT INTO allergies (allergy_id, baby_id, allergy_name, severity, epi_pen, notes) VALUES
(1, 2, 'Peanuts', 'high', NULL, 'I am allergic to peanuts'),
(2, 2, 'Nuts', 'high', NULL, 'very careful'),
(3, 2, 'g', 'low', NULL, 'ggggg');

-- Set sequence for allergies
SELECT setval('allergies_allergy_id_seq', 4);

-- Table: custom_notifications
CREATE TABLE custom_notifications (
  custom_notification_id SERIAL PRIMARY KEY,
  baby_id INTEGER NOT NULL,
  parent_id INTEGER NOT NULL,
  notification_type VARCHAR(50) DEFAULT NULL,
  date DATE DEFAULT NULL,
  time TIME DEFAULT NULL,
  notes TEXT
);

-- Table: feeding
CREATE TABLE feeding (
  feeding_id SERIAL PRIMARY KEY,
  baby_id INTEGER NOT NULL,
  time_fed TIME DEFAULT NULL,
  date DATE DEFAULT NULL,
  fed_from VARCHAR(10) DEFAULT NULL CHECK (fed_from IN ('bottle', 'breast')),
  type_of_food VARCHAR(50) DEFAULT NULL,
  amount DECIMAL(5,2) DEFAULT NULL,
  notes TEXT
);

-- Table: growth
CREATE TABLE growth (
  growth_id SERIAL PRIMARY KEY,
  baby_id INTEGER NOT NULL,
  weight DECIMAL(5,2) DEFAULT NULL,
  height DECIMAL(5,2) DEFAULT NULL,
  date DATE DEFAULT NULL
);

-- Insert data for growth
INSERT INTO growth (growth_id, baby_id, weight, height, date) VALUES
(1, 2, 2.00, 2.00, '2002-02-02'),
(2, 2, 30.00, 30.00, '2002-03-03'),
(3, 2, 22.00, 22.00, '2020-03-31'),
(4, 2, 11.00, 11.00, '2002-02-22'),
(5, 2, 66.00, 66.00, '2003-04-04');

-- Set sequence for growth
SELECT setval('growth_growth_id_seq', 6);

-- Table: medications
CREATE TABLE medications (
  med_id SERIAL PRIMARY KEY,
  baby_id INTEGER NOT NULL,
  medication_name VARCHAR(100) DEFAULT NULL,
  time_taken TIME DEFAULT NULL,
  date DATE DEFAULT NULL,
  dosage VARCHAR(50) DEFAULT NULL,
  symptoms TEXT
);

-- Insert data for medications
INSERT INTO medications (med_id, baby_id, medication_name, time_taken, date, dosage, symptoms) VALUES
(1, 2, 'Hal', '10:20:00', '2002-02-02', '5', 'I am not feeling good'),
(2, 2, 'Tyl', '10:20:00', '2025-09-20', '4', 'I was feeling sick'),
(3, 2, 'www', '09:00:00', '2003-03-03', '2', 'I am crazy');

-- Set sequence for medications
SELECT setval('medications_med_id_seq', 4);

-- Table: observation
CREATE TABLE observation (
  observation_id SERIAL PRIMARY KEY,
  baby_id INTEGER NOT NULL,
  priority_level VARCHAR(10) DEFAULT NULL CHECK (priority_level IN ('low', 'medium', 'high')),
  notes TEXT
);

-- Table: sick_day
CREATE TABLE sick_day (
  sick_id SERIAL PRIMARY KEY,
  baby_id INTEGER NOT NULL,
  med_id INTEGER DEFAULT NULL,
  date DATE DEFAULT NULL,
  meds_taken VARCHAR(100) DEFAULT NULL,
  temp DECIMAL(4,1) DEFAULT NULL
);

-- Table: sleep
CREATE TABLE sleep (
  sleep_id SERIAL PRIMARY KEY,
  baby_id INTEGER NOT NULL,
  sleep_duration DECIMAL(4,2) DEFAULT NULL,
  time_fell_asleep TIME DEFAULT NULL,
  date DATE DEFAULT NULL
);

-- Insert data for sleep
INSERT INTO sleep (sleep_id, baby_id, sleep_duration, time_fell_asleep, date) VALUES
(1, 2, 4.00, '10:20:00', '2002-02-02'),
(2, 2, 7.00, '22:20:00', '2003-03-03'),
(3, 2, 99.00, '03:33:00', '2002-02-02'),
(4, 2, 5.00, '09:00:00', '2000-01-01');

-- Set sequence for sleep
SELECT setval('sleep_sleep_id_seq', 5);

-- Table: task
CREATE TABLE task (
  task_id SERIAL PRIMARY KEY,
  baby_id INTEGER NOT NULL,
  babysitter_id INTEGER NOT NULL,
  time TIMESTAMP DEFAULT NULL
);

-- Table: vaccinations
CREATE TABLE vaccinations (
  vaccine_id SERIAL PRIMARY KEY,
  baby_id INTEGER NOT NULL,
  vaccination_name VARCHAR(100) DEFAULT NULL,
  date_of_vaccine DATE DEFAULT NULL
);

-- Insert data for vaccinations
INSERT INTO vaccinations (vaccine_id, baby_id, vaccination_name, date_of_vaccine) VALUES
(1, 2, 'Vaccine', '2002-02-02'),
(2, 2, 'Vaccinw', '2002-02-02');

-- Set sequence for vaccinations
SELECT setval('vaccinations_vaccine_id_seq', 3);

-- Foreign Key Constraints
ALTER TABLE account
  ADD CONSTRAINT fk_account_babysitter FOREIGN KEY (babysitter_id) REFERENCES babysitter (babysitter_id);

ALTER TABLE baby
  ADD CONSTRAINT baby_ibfk_1 FOREIGN KEY (parent_id) REFERENCES account (account_id);

ALTER TABLE babysitter
  ADD CONSTRAINT fk_babysitter_parent FOREIGN KEY (parent_id) REFERENCES account (account_id);

ALTER TABLE babysitter_shares
  ADD CONSTRAINT babysitter_shares_ibfk_1 FOREIGN KEY (parent_id) REFERENCES account (account_id) ON DELETE CASCADE,
  ADD CONSTRAINT babysitter_shares_ibfk_2 FOREIGN KEY (babysitter_id) REFERENCES account (account_id) ON DELETE CASCADE;

ALTER TABLE allergies
  ADD CONSTRAINT allergies_ibfk_1 FOREIGN KEY (baby_id) REFERENCES baby (baby_id);

ALTER TABLE custom_notifications
  ADD CONSTRAINT custom_notifications_ibfk_1 FOREIGN KEY (baby_id) REFERENCES baby (baby_id),
  ADD CONSTRAINT custom_notifications_ibfk_2 FOREIGN KEY (parent_id) REFERENCES account (account_id);

ALTER TABLE feeding
  ADD CONSTRAINT feeding_ibfk_1 FOREIGN KEY (baby_id) REFERENCES baby (baby_id);

ALTER TABLE growth
  ADD CONSTRAINT growth_ibfk_1 FOREIGN KEY (baby_id) REFERENCES baby (baby_id);

ALTER TABLE medications
  ADD CONSTRAINT medications_ibfk_1 FOREIGN KEY (baby_id) REFERENCES baby (baby_id);

ALTER TABLE observation
  ADD CONSTRAINT observation_ibfk_1 FOREIGN KEY (baby_id) REFERENCES baby (baby_id);

ALTER TABLE sick_day
  ADD CONSTRAINT sick_day_ibfk_1 FOREIGN KEY (baby_id) REFERENCES baby (baby_id),
  ADD CONSTRAINT sick_day_ibfk_2 FOREIGN KEY (med_id) REFERENCES medications (med_id);

ALTER TABLE sleep
  ADD CONSTRAINT sleep_ibfk_1 FOREIGN KEY (baby_id) REFERENCES baby (baby_id);
