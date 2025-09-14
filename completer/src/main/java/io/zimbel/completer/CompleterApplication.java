package io.zimbel.completer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.web.reactive.function.client.WebClient;

@SpringBootApplication
@ComponentScan(basePackages = {"io.zimbel.completer", "io.zimbel.app"})
public class CompleterApplication {

	public static void main(String[] args) {
		SpringApplication.run(CompleterApplication.class, args);
	}

	@Bean
	public WebClient.Builder webClientBuilder() {
		return WebClient.builder();
	}

}
