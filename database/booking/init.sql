-- -- юзеры
-- CREATE TABLE IF NOT EXISTS users (
--     id SERIAL PRIMARY KEY,
--     username VARCHAR(255) NOT NULL UNIQUE
-- );

-- -- коворки
-- CREATE TABLE IF NOT EXISTS workspace (
--     id SERIAL PRIMARY KEY,
--     name VARCHAR(255) NOT NULL,
--     location VARCHAR(255)
-- );

-- -- бронирования
-- CREATE TABLE IF NOT EXISTS booking (
--     id SERIAL PRIMARY KEY,
--     user_id INTEGER NOT NULL,
--     workspace_id INTEGER NOT NULL,
--     start_time TIMESTAMP NOT NULL,
--     end_time TIMESTAMP NOT NULL,

--     CONSTRAINT fk_booking_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
--     CONSTRAINT fk_booking_workspace FOREIGN KEY (workspace_id) REFERENCES workspace(id) ON DELETE CASCADE
-- );

-- admin

INSERT INTO app_user (username)
VALUES (
    'admin'
)
ON CONFLICT (username) DO NOTHING;
