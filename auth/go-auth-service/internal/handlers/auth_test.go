package handlers

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestHandlersExist(t *testing.T) {
	h := &AuthHandler{}

	req := httptest.NewRequest(http.MethodPost, "/register", nil)
	w := httptest.NewRecorder()
	h.Register(w, req)
	if w.Code == 400 {
		t.Log("Register: passed (bad input)")
	} else {
		t.Errorf("Register: expected 400, got %d", w.Code)
	}

	req = httptest.NewRequest(http.MethodPost, "/login", nil)
	w = httptest.NewRecorder()
	h.Login(w, req)
	if w.Code == 400 {
		t.Log("Login: passed (bad input)")
	} else {
		t.Errorf("Login: expected 400, got %d", w.Code)
	}

	req = httptest.NewRequest(http.MethodGet, "/me", nil)
	w = httptest.NewRecorder()
	h.Me(w, req)
	if w.Code == 401 {
		t.Log("Me: passed (unauthorized)")
	} else {
		t.Errorf("Me: expected 401, got %d", w.Code)
	}

	req = httptest.NewRequest(http.MethodPost, "/logout", nil)
	w = httptest.NewRecorder()
	h.Logout(w, req)
	if w.Code == 200 {
		t.Log("Logout: passed")
	} else {
		t.Errorf("Logout: expected 200, got %d", w.Code)
	}
}
