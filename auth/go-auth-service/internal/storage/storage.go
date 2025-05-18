package storage

import (
	"database/sql"

	"auth-service/internal/models"

	_ "github.com/lib/pq"
)

type Storage struct {
	DB *sql.DB
}

func New(dsn string) (*Storage, error) {
	db, err := sql.Open("postgres", dsn)
	if err != nil {
		return nil, err
	}
	return &Storage{DB: db}, nil
}

func (s *Storage) CreateUser(user *models.User) error {
	_, err := s.DB.Exec("INSERT INTO users (username, password) VALUES ($1, $2)", user.Username, user.Password)
	return err
}

func (s *Storage) GetUserByUsername(username string) (*models.User, error) {
	row := s.DB.QueryRow("SELECT id, username, password FROM users WHERE username = $1", username)
	var user models.User
	err := row.Scan(&user.ID, &user.Username, &user.Password)
	if err != nil {
		return nil, err
	}
	return &user, nil
}
