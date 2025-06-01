package com.employee.springboot.thymeleafdemo.auth;

import lombok.Getter;
import lombok.Setter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Getter
@Setter
class AuthRequest {

    private static final Logger logger = LoggerFactory.getLogger(AuthRequest.class);

    private String username;
    private String password;

    public AuthRequest() {
        logger.debug("🚧 AuthRequest object created");
    }

    public void setUsername(String username) {
        logger.debug("🔧 Setting username in AuthRequest: {}", username);
        this.username = username;
    }

    public void setPassword(String password) {
        logger.debug("🔧 Setting password in AuthRequest: [PROTECTED]");
        this.password = password;
    }
}
