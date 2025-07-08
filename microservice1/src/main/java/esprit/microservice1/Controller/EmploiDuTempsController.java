package esprit.microservice1.Controller;



import esprit.microservice1.Entity.EmploiDuTemps;
import esprit.microservice1.Entity.Enseignant;
import esprit.microservice1.Service.EmploiDuTempsService;
import esprit.microservice1.Service.SurveillanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/emploisdutemps")
public class EmploiDuTempsController {

    private final EmploiDuTempsService service;
    private final SurveillanceService surveillanceService;

    public EmploiDuTempsController(EmploiDuTempsService service, SurveillanceService surveillanceService) {
        this.service = service;
        this.surveillanceService = surveillanceService;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createEmploi(@RequestBody EmploiDuTemps emploi) {
        try {
            EmploiDuTemps created = service.createEmploi(emploi);
            return ResponseEntity.ok(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    @GetMapping("/{id}")
    public ResponseEntity<EmploiDuTemps> getEmploiById(@PathVariable Long id) {
        return service.getEmploiById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/enseignant/{enseignantId}")
    public ResponseEntity<List<EmploiDuTemps>> getEmploisByEnseignant(@PathVariable Long enseignantId) {
        return ResponseEntity.ok(service.getEmploisByEnseignant(enseignantId));
    }

    @GetMapping("/jour/{jour}")
    public ResponseEntity<List<EmploiDuTemps>> getEmploisByJour(@PathVariable String jour) {
        LocalDate date = LocalDate.parse(jour);
        return ResponseEntity.ok(service.getEmploisByJour(date));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmploiDuTemps> updateEmploi(@PathVariable Long id, @RequestBody EmploiDuTemps emploi) {
        try {
            EmploiDuTemps updated = service.updateEmploi(id, emploi);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmploi(@PathVariable Long id) {
        service.deleteEmploi(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/enseignant-par-salle/{salle}")
    public ResponseEntity<List<String>> getEnseignantsParSalle(@PathVariable String salle) {
        return ResponseEntity.ok(surveillanceService.getEnseignantsBySalle(salle));
    }
}