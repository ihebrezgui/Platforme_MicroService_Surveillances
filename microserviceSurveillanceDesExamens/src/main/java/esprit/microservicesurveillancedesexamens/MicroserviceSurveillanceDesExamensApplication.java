package esprit.microservicesurveillancedesexamens;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;


@SpringBootApplication
@EnableFeignClients(basePackages = "esprit.microservicesurveillancedesexamens")
@EnableDiscoveryClient
public class MicroserviceSurveillanceDesExamensApplication {

	public static void main(String[] args) {
		SpringApplication.run(MicroserviceSurveillanceDesExamensApplication.class, args);
	}

}
