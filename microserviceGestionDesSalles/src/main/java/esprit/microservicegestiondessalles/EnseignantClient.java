package esprit.microservicegestiondessalles;

import esprit.microservicegestiondessalles.configuration.FeignClientConfig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;


@FeignClient(name = "microservice1", contextId = "enseignant2",url = "http://localhost:8090",configuration = FeignClientConfig.class)
public interface  EnseignantClient {

    @GetMapping("/ensignat/matricule/{matricule}")

    EnseignantDTO getEnseignantByMatricule(@PathVariable("matricule") String matricule);
}
