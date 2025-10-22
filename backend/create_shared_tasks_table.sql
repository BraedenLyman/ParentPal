-- Create shared_tasks table
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

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_shared_tasks_share_id ON shared_tasks(share_id);
CREATE INDEX IF NOT EXISTS idx_shared_tasks_parent_id ON shared_tasks(parent_id);
CREATE INDEX IF NOT EXISTS idx_shared_tasks_babysitter_id ON shared_tasks(babysitter_id);
CREATE INDEX IF NOT EXISTS idx_shared_tasks_baby_id ON shared_tasks(baby_id);
CREATE INDEX IF NOT EXISTS idx_shared_tasks_is_completed ON shared_tasks(is_completed);
