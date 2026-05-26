package com.app.security;

import java.util.List;

public class JwtUser extends org.springframework.security.core.userdetails.User {
    private final String username;

    public JwtUser(String username) {
        super(username, "", List.of());
        this.username = username;
    }

    public String getUsername() {
        return username;
    }
}
