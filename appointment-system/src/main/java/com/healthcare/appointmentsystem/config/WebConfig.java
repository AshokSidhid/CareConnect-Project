package com.healthcare.appointmentsystem.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**") // Applies CORS to all endpoints under /api
                .allowedOrigins("http://localhost:5173") // Allows requests from our React app
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Allows these HTTP methods
                .allowedHeaders("*") // Allows all headers
                .allowCredentials(true);
    }
}