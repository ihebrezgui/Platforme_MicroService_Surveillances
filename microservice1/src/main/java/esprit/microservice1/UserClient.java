package esprit.microservice1;


import esprit.microservice1.configuration.FeignClientConfig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;



@FeignClient(name = "user-service", url = "http://localhost:8088", configuration = FeignClientConfig.class)
public interface UserClient {
    @GetMapping("/auth/{id}")
    UserDTO getUserById(@PathVariable("id") Long id);

    @GetMapping("/auth/matricule/{matricule}")
    UserDTO getUserByMatricule(@PathVariable("matricule") String matricule);

}
