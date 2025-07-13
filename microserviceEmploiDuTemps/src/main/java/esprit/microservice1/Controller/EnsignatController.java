package esprit.microservice1.Controller;


import esprit.microservice1.Entity.Enseignant;
import esprit.microservice1.Repository.EnsignatRepository;
import esprit.microservice1.Service.EnsignatService;
import lombok.AllArgsConstructor;
import org.apache.catalina.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/ensignat")
@CrossOrigin("*")
public class EnsignatController {

    EnsignatService ensignatService;
    EnsignatRepository enseignantRepository;

    @PostMapping("/addEnsignat")
    public Enseignant addEnsignat(@RequestBody Enseignant e) {
        return ensignatService.addEnsignat(e);
    }

    @GetMapping("/getAllEnseignants")
    public List<Enseignant> getAllEnseignants() {
        return ensignatService.getAllEnseignants();
    }

    @GetMapping("/matricule/{matricule}")
    public Enseignant getByMatricule(@PathVariable String matricule) {
        return enseignantRepository.findByMatricule(matricule)
                .orElseThrow(() -> new RuntimeException("Aucun enseignant trouvé avec ce matricule"));
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<Enseignant> getEnseignantById(@PathVariable Long id) {
        return ensignatService.getEnseignantById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

}
