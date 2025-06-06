package main

import (
	"auth-service/internal/handlers"
	"auth-service/internal/middleware"
	"auth-service/internal/storage"
	"log"
	"net/http"
)

func main() {
	authDSN := "postgres://user:pass@db-auth:5432/auth?sslmode=disable"
	bookingDSN := "postgres://user:pass@db-booking:5432/booking?sslmode=disable"
	store, err := storage.New(authDSN, bookingDSN)
	if err != nil {
		log.Fatal(err)
	}

	h := &handlers.AuthHandler{Store: store}

	mux := http.NewServeMux()
	mux.HandleFunc("/register", h.Register)
	mux.HandleFunc("/login", h.Login)
	mux.Handle("/me", middleware.JWTAuth(http.HandlerFunc(h.Me)))
	mux.Handle("/logout", middleware.JWTAuth(middleware.RequireRole("admin", http.HandlerFunc(h.Logout))))

	handler := middleware.CORS(mux)

	log.Println("Auth service started on :8081")
	log.Fatal(http.ListenAndServe(":8081", handler))
}
