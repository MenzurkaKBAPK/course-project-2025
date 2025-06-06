CREATE TABLE IF NOT EXISTS app_user (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL
);

INSERT INTO app_user (username)
VALUES ('admin')
ON CONFLICT (username) DO NOTHING;
