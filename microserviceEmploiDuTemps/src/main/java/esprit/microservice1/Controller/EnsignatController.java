package esprit.microservice1.Controller;

import esprit.microservice1.Entity.Enseignant;
import esprit.microservice1.Entity.EnseignantDTO;
import esprit.microservice1.Entity.MyModule;
import esprit.microservice1.Entity.UnitePedagogique;
import esprit.microservice1.Repository.EnsignatRepository;
import esprit.microservice1.Service.EnsignatService;
import esprit.microservice1.Service.ModuleService;
import esprit.microservice1.Service.UnitePedagogiqueService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/ensignat")
@CrossOrigin("*")
public class EnsignatController {

    private final EnsignatService ensignatService;
    private final EnsignatRepository enseignantRepository;
    private final ModuleService moduleService;

    private final UnitePedagogiqueService unitePedagogiqueService;
    @GetMapping("/unite-pedagogiques")
    public List<UnitePedagogique> getAllUnites() {
        return unitePedagogiqueService.getAllUnites();
    }

    @PostMapping("/addEnsignat")
    public Enseignant addEnsignat(@RequestBody Enseignant e) {
        return ensignatService.addEnsignat(e);
    }

    @GetMapping("/getAllEnseignants")
    public List<EnseignantDTO> getAllEnseignants() {
        return ensignatService.getAllEnseignantsAvecModule();
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

    @GetMapping("/modules")
    public List<MyModule> getAllModules() {
        return moduleService.getAllModules();
    }
}
