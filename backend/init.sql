-- Database initialization script for testing and CI/CD
-- This script creates test accounts and babies for Artillery performance tests

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
SELECT setval(pg_get_serial_sequence('account', 'account_id'), COALESCE(MAX(account_id), 1), true) FROM account;
SELECT setval(pg_get_serial_sequence('baby', 'baby_id'), COALESCE(MAX(baby_id), 1), true) FROM baby;

-- Display confirmation
DO $$
BEGIN
  RAISE NOTICE 'Test data initialized successfully';
  RAISE NOTICE 'Created 1 test account and 3 test babies';
  RAISE NOTICE 'Baby IDs: 1, 2, 3 (for Artillery performance tests)';
END $$;
