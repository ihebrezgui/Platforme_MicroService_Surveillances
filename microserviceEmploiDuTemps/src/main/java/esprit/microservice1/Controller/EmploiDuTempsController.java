package esprit.microservice1.Controller;



import esprit.microservice1.Entity.EmploiDuTemps;
import esprit.microservice1.SalleDTO;
import esprit.microservice1.Service.EmploiDuTempsService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/emplois")
@AllArgsConstructor
public class EmploiDuTempsController {

    private final EmploiDuTempsService emploiService;


    @PostMapping("/planifier")
    public ResponseEntity<?> planifier(@RequestBody EmploiDuTemps surveillance) {
        try {
            EmploiDuTemps saved = emploiService.planifierSurveillance(surveillance);
            return ResponseEntity.ok(saved);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/enseignant/{id}")
    public List<EmploiDuTemps> getSurveillancesParEnseignant(@PathVariable Long id) {
        return emploiService.getSurveillancesParEnseignant(id);
    }

    @GetMapping("/salles/{id}")
    public ResponseEntity<SalleDTO> getSalleParId(@PathVariable Long id) {
        try {
            SalleDTO salle = emploiService.getSalleParId(id);
            return ResponseEntity.ok(salle);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }


}
