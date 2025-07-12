package esprit.microservicegestiondesnotifications;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients(basePackages = "esprit.microservicegestiondesnotifications")
@EnableDiscoveryClient
public class MicroserviceGestionDesNotificationsApplication {

	public static void main(String[] args) {
		SpringApplication.run(MicroserviceGestionDesNotificationsApplication.class, args);
	}

}
