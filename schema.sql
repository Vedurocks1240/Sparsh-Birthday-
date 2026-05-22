-- Create database (if using psql CLI)
-- CREATE DATABASE sparsh_birthday;

-- Connect to database then run:

-- Celebrations table: stores who celebrated + their birthday wish
CREATE TABLE IF NOT EXISTS celebrations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL DEFAULT 'Anonymous',
    compliment TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast recent queries
CREATE INDEX IF NOT EXISTS idx_celebrations_created_at 
ON celebrations(created_at DESC);

-- Optional: View for quick stats
CREATE OR REPLACE VIEW celebration_stats AS
SELECT 
    COUNT(*) AS total_celebrations,
    COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE) AS today_count
FROM celebrations;

-- Sample data (optional, for testing)
-- INSERT INTO celebrations (name, compliment) VALUES 
-- ('Rahul', 'Happy Birthday Sparsh! Have an amazing day! 🎂'),
-- ('Priya', 'Wishing you lots of games and fun! 🎮'),
-- ('Amit', '6 years old already! Growing up so fast! 🚀');
