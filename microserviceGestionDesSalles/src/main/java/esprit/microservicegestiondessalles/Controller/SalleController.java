package esprit.microservicegestiondessalles.Controller;

import esprit.microservicegestiondessalles.Entity.Salle;
import esprit.microservicegestiondessalles.Service.SalleService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/salles")
@AllArgsConstructor
@CrossOrigin("*")
public class SalleController {

    @Autowired
    private SalleService salleService;

    @GetMapping
    public List<Salle> getAll() {
        return salleService.getAllSalles();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Salle> getById(@PathVariable Long id) {
        return salleService.getSalleById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Salle create(@RequestBody Salle salle) {
        return salleService.createSalle(salle);
    }

    @PutMapping("/{id}")
    public Salle update(@PathVariable Long id, @RequestBody Salle salle) {
        return salleService.updateSalle(id, salle);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        salleService.deleteSalle(id);
        return ResponseEntity.noContent().build();
    }


    @GetMapping("/{salleId}/disponibilite")
    public ResponseEntity<Boolean> verifierDisponibiliteSalle(
            @PathVariable Long salleId,
            @RequestParam LocalDate date,
            @RequestParam LocalTime heureDebut,
            @RequestParam LocalTime heureFin) {

        boolean dispo = salleService.verifierDisponibiliteSalle(salleId, date, heureDebut, heureFin);
        return ResponseEntity.ok(dispo);
    }
}
