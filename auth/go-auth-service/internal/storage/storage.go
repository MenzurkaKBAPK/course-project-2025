package storage

import (
	"database/sql"
	"errors"
	"fmt"
	"log"
	"time"

	"auth-service/internal/models"

	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

type Storage struct {
	AuthDB    *sql.DB
	BookingDB *sql.DB
}

func New(authDSN, bookingDSN string) (*Storage, error) {
	authDB, err := sql.Open("postgres", authDSN)
	if err != nil {
		return nil, err
	}
	if err := waitForDB(authDB, 10, 2*time.Second); err != nil {
		return nil, fmt.Errorf("auth db: %w", err)
	}
	if err := waitForTable(authDB, "users", 10, 2*time.Second); err != nil {
		return nil, fmt.Errorf("users table: %w", err)
	}

	bookingDB, err := sql.Open("postgres", bookingDSN)
	if err != nil {
		return nil, err
	}
	if err := waitForDB(bookingDB, 10, 2*time.Second); err != nil {
		return nil, fmt.Errorf("booking db: %w", err)
	}
	if err := waitForTable(bookingDB, "app_user", 10, 2*time.Second); err != nil {
		return nil, fmt.Errorf("app_user table: %w", err)
	}

	return &Storage{
		AuthDB:    authDB,
		BookingDB: bookingDB,
	}, nil
}

func (s *Storage) CreateUser(user *models.User) error {
	txAuth, err := s.AuthDB.Begin()
	if err != nil {
		return err
	}
	defer txAuth.Rollback()

	txBook, err := s.BookingDB.Begin()
	if err != nil {
		return err
	}
	defer txBook.Rollback()

	_, err = txAuth.Exec("INSERT INTO users (username, password, role) VALUES ($1, $2, $3)",
		user.Username, user.Password, user.Role)
	if err != nil {
		return err
	}

	_, err = txBook.Exec("INSERT INTO app_user (username) VALUES ($1)", user.Username)
	if err != nil {
		return err
	}

	if err := txAuth.Commit(); err != nil {
		return err
	}
	if err := txBook.Commit(); err != nil {
		return err
	}

	return nil
}

func (s *Storage) GetUserByUsername(username string) (*models.User, error) {
	row := s.AuthDB.QueryRow("SELECT id, username, password, role FROM users WHERE username = $1", username)
	var user models.User
	err := row.Scan(&user.ID, &user.Username, &user.Password, &user.Role)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (s *Storage) EnsureAdminUser(username, password string) error {
	if username == "" || password == "" {
		return errors.New("missing admin username or password")
	}

	user, err := s.GetUserByUsername(username)
	if err == nil && user != nil {
		log.Printf("Admin user '%s' already exists", username)
		return nil
	}
	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		return fmt.Errorf("error checking admin existence: %w", err)
	}

	hashed, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return fmt.Errorf("error hashing password: %w", err)
	}

	admin := &models.User{
		Username: username,
		Password: string(hashed),
		Role:     "admin",
	}

	if err := s.CreateUser(admin); err != nil {
		return fmt.Errorf("error creating admin user: %w", err)
	}

	return nil
}

func waitForDB(db *sql.DB, maxRetries int, delay time.Duration) error {
	for i := 0; i < maxRetries; i++ {
		if err := db.Ping(); err == nil {
			return nil
		}
		log.Printf("Waiting for DB to be ready... (%d/%d)", i+1, maxRetries)
		time.Sleep(delay)
	}
	return fmt.Errorf("database not reachable after %d attempts", maxRetries)
}

func waitForTable(db *sql.DB, table string, maxRetries int, delay time.Duration) error {
	query := fmt.Sprintf("SELECT 1 FROM %s LIMIT 1", table)
	var err error

	for i := 0; i < maxRetries; i++ {
		_, err = db.Query(query)
		if err == nil {
			return nil
		}
		log.Printf("Waiting for table '%s' to be ready... (%d/%d)", table, i+1, maxRetries)
		time.Sleep(delay)
	}
	return fmt.Errorf("table not ready after %d attempts", maxRetries)
}
