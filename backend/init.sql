-- ParentPal Database Initialization Script for CI/CD
-- Creates minimal schema and test data for Artillery performance tests

-- Create account table
CREATE TABLE IF NOT EXISTS account (
  account_id SERIAL PRIMARY KEY,
  firebase_uid VARCHAR(128) UNIQUE NOT NULL,
  babysitter_id INTEGER,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email_address VARCHAR(100) UNIQUE NOT NULL,
  account_type VARCHAR(20) NOT NULL,
  birth_date DATE,
  gender VARCHAR(10)
);

-- Create baby table
CREATE TABLE IF NOT EXISTS baby (
  baby_id SERIAL PRIMARY KEY,
  parent_id INTEGER NOT NULL REFERENCES account(account_id) ON DELETE CASCADE,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  birth_date DATE,
  gender VARCHAR(10),
  category VARCHAR(50)
);

-- Create growth table
CREATE TABLE IF NOT EXISTS growth (
  growth_id SERIAL PRIMARY KEY,
  baby_id INTEGER NOT NULL REFERENCES baby(baby_id) ON DELETE CASCADE,
  weight NUMERIC(5,2),
  height NUMERIC(5,2),
  date DATE NOT NULL
);

-- Create sleep table
CREATE TABLE IF NOT EXISTS sleep (
  sleep_id SERIAL PRIMARY KEY,
  baby_id INTEGER NOT NULL REFERENCES baby(baby_id) ON DELETE CASCADE,
  sleep_duration NUMERIC(4,2),
  time_fell_asleep TIME,
  date DATE NOT NULL,
  created_by_account_id INTEGER,
  created_by_first_name VARCHAR(255),
  created_by_last_name VARCHAR(255)
);

-- Create feeding table
CREATE TABLE IF NOT EXISTS feeding (
  feeding_id SERIAL PRIMARY KEY,
  baby_id INTEGER NOT NULL REFERENCES baby(baby_id) ON DELETE CASCADE,
  time_fed TIME NOT NULL,
  date DATE NOT NULL,
  fed_from VARCHAR(50) NOT NULL,
  type_of_food VARCHAR(50) NOT NULL,
  amount NUMERIC(5,2),
  notes TEXT,
  created_by_account_id INTEGER,
  created_by_first_name VARCHAR(255),
  created_by_last_name VARCHAR(255)
);

-- Create observation table
CREATE TABLE IF NOT EXISTS observation (
  observation_id SERIAL PRIMARY KEY,
  baby_id INTEGER NOT NULL REFERENCES baby(baby_id) ON DELETE CASCADE,
  priority_level VARCHAR(20) NOT NULL,
  notes TEXT,
  created_by_account_id INTEGER,
  created_by_first_name VARCHAR(255),
  created_by_last_name VARCHAR(255)
);

-- Create allergies table
CREATE TABLE IF NOT EXISTS allergies (
  allergy_id SERIAL PRIMARY KEY,
  baby_id INTEGER NOT NULL REFERENCES baby(baby_id) ON DELETE CASCADE,
  allergy_name VARCHAR(100),
  severity VARCHAR(10),
  epi_pen BOOLEAN DEFAULT false,
  notes TEXT,
  created_by_account_id INTEGER,
  created_by_first_name VARCHAR(255),
  created_by_last_name VARCHAR(255)
);

-- Create medications table
CREATE TABLE IF NOT EXISTS medications (
  medication_id SERIAL PRIMARY KEY,
  baby_id INTEGER NOT NULL REFERENCES baby(baby_id) ON DELETE CASCADE,
  medication_name VARCHAR(100) NOT NULL,
  dosage VARCHAR(50),
  frequency VARCHAR(50),
  start_date DATE,
  end_date DATE,
  notes TEXT,
  created_by_account_id INTEGER,
  created_by_first_name VARCHAR(255),
  created_by_last_name VARCHAR(255)
);

-- Insert test data for Artillery performance tests
-- Create test parent account
INSERT INTO account (account_id, firebase_uid, first_name, last_name, email_address, account_type)
VALUES (1, 'test-parent-uid-001', 'Test', 'Parent', 'test.parent@example.com', 'parent')
ON CONFLICT (account_id) DO NOTHING;

-- Create test babies with IDs 1, 2, 3 (referenced in Artillery write operations config)
INSERT INTO baby (baby_id, parent_id, first_name, last_name, birth_date, gender, category)
VALUES
  (1, 1, 'Test', 'Baby One', '2024-01-15', 'male', 'infant'),
  (2, 1, 'Test', 'Baby Two', '2023-06-20', 'female', 'infant'),
  (3, 1, 'Test', 'Baby Three', '2024-03-10', 'male', 'infant')
ON CONFLICT (baby_id) DO NOTHING;

-- Reset sequences to start after test data
SELECT setval('account_account_id_seq', (SELECT MAX(account_id) FROM account), true);
SELECT setval('baby_baby_id_seq', (SELECT MAX(baby_id) FROM baby), true);
