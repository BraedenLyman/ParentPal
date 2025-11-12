const pool = require('./db');

async function addCreatorNameColumns() {
  const tables = ['medications', 'sleep', 'feeding', 'observation', 'sick_day', 'allergies', 'vaccinations', 'photo_gallery'];

  for (const table of tables) {
    try {
      await pool.query(`ALTER TABLE ${table} ADD COLUMN IF NOT EXISTS created_by_first_name VARCHAR(255)`);
      await pool.query(`ALTER TABLE ${table} ADD COLUMN IF NOT EXISTS created_by_last_name VARCHAR(255)`);
      console.log(`✓ Added creator name columns to ${table}`);
    } catch (err) {
      console.error(`✗ Error adding columns to ${table}:`, err.message);
    }
  }

  console.log('\nMigration complete!');
  process.exit(0);
}

addCreatorNameColumns().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
