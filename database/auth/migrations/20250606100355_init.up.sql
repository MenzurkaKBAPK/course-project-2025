-- юзеры

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user'
);

--admin

-- INSERT INTO users (username, password, role)
-- VALUES (
--     'admin',
--     '$2a$10$BK77gsF9GAwufYaLssspC.RvbT7k14yYKh69vrvo.SpE2fyl.PBsu',
--     'admin'
-- )
-- ON CONFLICT (username) DO NOTHING;
