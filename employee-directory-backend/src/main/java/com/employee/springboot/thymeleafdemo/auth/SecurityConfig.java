package com.employee.springboot.thymeleafdemo.auth;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private static final Logger logger = LoggerFactory.getLogger(SecurityConfig.class);

    @Autowired
    private JwtRequestFilter jwtRequestFilter;

    @Autowired
    private UserDetailsService userDetailsService;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        logger.info("🔐 Configuring security filter chain");

        http
                .cors(cors -> {
                    logger.info("🌐 Enabling CORS configuration");
                    cors.configurationSource(corsConfigurationSource());
                })
                .csrf(csrf -> {
                    logger.info("❌ Disabling CSRF protection");
                    csrf.disable();
                })
                .authorizeHttpRequests(auth -> {
                    logger.info("🔎 Setting up authorization rules");
                    auth
                            .requestMatchers(
                                    "/swagger-ui/**",
                                    "/v3/api-docs/**",
                                    "/swagger-ui.html",
                                    "/v3/api-docs.yaml"
                            ).permitAll();
                    logger.info("✅ Swagger and OpenAPI docs access permitted without authentication");

                    auth.requestMatchers("/api/auth/**").permitAll();
                    logger.info("✅ Authentication endpoints (/api/auth/**) permitted without authentication");

                    auth.requestMatchers(HttpMethod.GET, "/api/employees/**").hasAnyRole("USER", "ADMIN");
                    auth.requestMatchers("/api/employees/**").hasRole("ADMIN");
                    logger.info("🔒 Employee API restricted: GET for USER and ADMIN, others for ADMIN only");

                    auth.anyRequest().authenticated();
                    logger.info("🔐 All other requests require authentication");
                })
                .sessionManagement(session -> {
                    logger.info("⚙️ Setting session management to stateless");
                    session.sessionCreationPolicy(SessionCreationPolicy.STATELESS);
                });

        logger.info("🔄 Adding JWT filter before UsernamePasswordAuthenticationFilter");
        http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

        logger.info("✅ Security filter chain configured successfully");
        return http.build();
    }

    @Bean
    public AuthenticationManager authManager(AuthenticationConfiguration config) throws Exception {
        logger.info("🔑 Creating AuthenticationManager bean");
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        logger.info("🔐 Creating BCryptPasswordEncoder bean");
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        logger.info("🌐 Creating CORS configuration source");
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:4200")); // Frontend URL
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        logger.info("✅ CORS configuration set for origins: {}", config.getAllowedOrigins());
        return source;
    }
}
