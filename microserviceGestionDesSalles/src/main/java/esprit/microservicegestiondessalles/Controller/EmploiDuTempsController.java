package esprit.microservicegestiondessalles.Controller;


import esprit.microservicegestiondessalles.Entity.EmploiDuTemps;
import esprit.microservicegestiondessalles.Service.EmploiDuTempsService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/emploi_enseignant")
@AllArgsConstructor
@CrossOrigin("*")
public class EmploiDuTempsController {

    private final EmploiDuTempsService emploiDuTempsService;



    @PostMapping("/create")
    public ResponseEntity<EmploiDuTemps> create(@RequestBody EmploiDuTemps emploiDuTemps) {
        EmploiDuTemps saved = emploiDuTempsService.create(emploiDuTemps);
        return ResponseEntity.ok(saved);
    }
}
