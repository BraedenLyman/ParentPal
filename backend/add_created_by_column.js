const pool = require('./db');

async function addCreatedByColumn() {
  const tables = ['medications', 'sleep', 'feeding', 'observation', 'sick_day', 'allergies', 'vaccinations', 'photo_gallery'];

  for (const table of tables) {
    try {
      await pool.query(`ALTER TABLE ${table} ADD COLUMN IF NOT EXISTS created_by_account_id INTEGER REFERENCES account(account_id)`);
      console.log(`✓ Added created_by_account_id to ${table}`);
    } catch (err) {
      console.error(`✗ Error adding column to ${table}:`, err.message);
    }
  }

  console.log('\nMigration complete!');
  process.exit(0);
}

addCreatedByColumn().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
