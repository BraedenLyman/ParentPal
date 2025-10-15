-- Create photo gallery table
CREATE TABLE IF NOT EXISTS photo_gallery (
    photo_id SERIAL PRIMARY KEY,
    baby_id INTEGER NOT NULL,
    parent_id INTEGER NOT NULL,
    photo_url TEXT NOT NULL,
    caption TEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (baby_id) REFERENCES baby(baby_id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES account(account_id) ON DELETE CASCADE
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_photo_gallery_baby_id ON photo_gallery(baby_id);
CREATE INDEX IF NOT EXISTS idx_photo_gallery_parent_id ON photo_gallery(parent_id);
CREATE INDEX IF NOT EXISTS idx_photo_gallery_uploaded_at ON photo_gallery(uploaded_at DESC);

COMMENT ON TABLE photo_gallery IS 'Stores photos uploaded by parents for their babies';
COMMENT ON COLUMN photo_gallery.photo_url IS 'URL or file path to the uploaded photo';
COMMENT ON COLUMN photo_gallery.caption IS 'Optional caption for the photo';
