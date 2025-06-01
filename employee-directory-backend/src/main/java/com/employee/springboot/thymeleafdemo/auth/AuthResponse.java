package com.employee.springboot.thymeleafdemo.auth;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

class AuthResponse {

    private static final Logger logger = LoggerFactory.getLogger(AuthResponse.class);

    private final String jwt;

    public AuthResponse(String jwt) {
        this.jwt = jwt;
        logger.debug("🎫 AuthResponse created with JWT: {}", jwt);
    }

    public String getJwt() {
        logger.debug("🔍 getJwt() called");
        return jwt;
    }
}
