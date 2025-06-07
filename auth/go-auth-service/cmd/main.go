package main

import (
	"auth-service/internal/handlers"
	"auth-service/internal/middleware"
	"auth-service/internal/storage"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/go-chi/httprate"
)

type dbDSN struct {
	Host     string
	Port     string
	User     string
	Password string
	DBName   string
	SSLMode  string
}

func getDSN(prefix string) string {
	cfg := dbDSN{
		Host:     os.Getenv(prefix + "_HOST"),
		Port:     os.Getenv(prefix + "_PORT"),
		User:     os.Getenv(prefix + "_USER"),
		Password: os.Getenv(prefix + "_PASSWORD"),
		DBName:   os.Getenv(prefix + "_NAME"),
		SSLMode:  os.Getenv(prefix + "_SSLMODE"),
	}

	if cfg.Host == "" || cfg.Port == "" || cfg.User == "" || cfg.Password == "" || cfg.DBName == "" {
		log.Fatalf("Missing required environment variables for %s", prefix)
	}
	if cfg.SSLMode == "" {
		cfg.SSLMode = "disable"
	}

	return fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=%s",
		cfg.User, cfg.Password, cfg.Host, cfg.Port, cfg.DBName, cfg.SSLMode)
}

func main() {
	authDSN := getDSN("AUTH_DB")
	bookingDSN := getDSN("BOOKING_DB")
	store, err := storage.New(authDSN, bookingDSN)
	if err != nil {
		log.Fatal(err)
	}

	adminUser := os.Getenv("ADMIN_USERNAME")
	adminPass := os.Getenv("ADMIN_PASSWORD")

	if err := store.EnsureAdminUser(adminUser, adminPass); err != nil {
		log.Fatalf("Failed to ensure admin user: %v", err)
	}

	h := &handlers.AuthHandler{Store: store}

	// лимитер для http запросов (не более 5 в минуту) => БД в безопасности
	limiter := httprate.LimitByIP(5, 1*time.Minute)

	mux := http.NewServeMux()
	mux.Handle("/register", limiter(http.HandlerFunc(h.Register)))
	mux.Handle("/login", limiter(http.HandlerFunc(h.Login)))
	mux.Handle("/me", limiter(middleware.JWTAuth(http.HandlerFunc(h.Me))))
	mux.Handle("/logout", limiter(middleware.JWTAuth(middleware.RequireRole("admin", http.HandlerFunc(h.Logout)))))

	handler := middleware.CORS(mux)

	log.Println("Auth service started on :8081")
	log.Fatal(http.ListenAndServe(":8081", handler))
}
