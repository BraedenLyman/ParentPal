// Script to create the shared_tasks table
const pool = require('./db');

const createTable = async () => {
    const client = await pool.connect();

    try {
        console.log('Creating shared_tasks table...');

        await client.query(`
            CREATE TABLE IF NOT EXISTS shared_tasks (
                task_id SERIAL PRIMARY KEY,
                share_id INTEGER NOT NULL,
                parent_id INTEGER NOT NULL,
                babysitter_id INTEGER,
                baby_id INTEGER,
                task_title VARCHAR(255) NOT NULL,
                task_description TEXT,
                due_date DATE,
                is_completed BOOLEAN DEFAULT false,
                completed_at TIMESTAMP,
                babysitter_notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (share_id) REFERENCES babysitter_shares(share_id) ON DELETE CASCADE,
                FOREIGN KEY (parent_id) REFERENCES account(account_id) ON DELETE CASCADE,
                FOREIGN KEY (baby_id) REFERENCES baby(baby_id) ON DELETE CASCADE
            );
        `);

        console.log('✓ shared_tasks table created successfully');

        console.log('Creating indexes...');

        await client.query('CREATE INDEX IF NOT EXISTS idx_shared_tasks_share_id ON shared_tasks(share_id)');
        await client.query('CREATE INDEX IF NOT EXISTS idx_shared_tasks_parent_id ON shared_tasks(parent_id)');
        await client.query('CREATE INDEX IF NOT EXISTS idx_shared_tasks_babysitter_id ON shared_tasks(babysitter_id)');
        await client.query('CREATE INDEX IF NOT EXISTS idx_shared_tasks_baby_id ON shared_tasks(baby_id)');
        await client.query('CREATE INDEX IF NOT EXISTS idx_shared_tasks_is_completed ON shared_tasks(is_completed)');

        console.log('✓ Indexes created successfully');
        console.log('\nTable structure:');

        const result = await client.query(`
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns
            WHERE table_name = 'shared_tasks'
            ORDER BY ordinal_position;
        `);

        console.table(result.rows);

    } catch (error) {
        console.error('Error creating table:', error);
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
};

createTable()
    .then(() => {
        console.log('\n✓ Done!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n✗ Failed:', error.message);
        process.exit(1);
    });
