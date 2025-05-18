package main

import (
	"auth-service/internal/handlers"
	"auth-service/internal/middleware"
	"auth-service/internal/storage"
	"log"
	"net/http"
)

func main() {
	store, err := storage.New("postgres://user:pass@localhost:5432/auth?sslmode=disable")
	if err != nil {
		log.Fatal(err)
	}

	h := &handlers.AuthHandler{Store: store}

	http.HandleFunc("/register", h.Register)
	http.HandleFunc("/login", h.Login)

	protected := middleware.JWTAuth(http.HandlerFunc(h.Me))
	http.Handle("/me", protected)

	adminOnly := middleware.JWTAuth(middleware.RequireRole("admin", http.HandlerFunc(h.Logout)))
	http.Handle("/logout", adminOnly)

	log.Println("Auth service started on :8081")
	log.Fatal(http.ListenAndServe(":8081", nil))
}
