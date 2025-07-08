package esprit.microservice1.Controller;


import esprit.microservice1.Entity.Enseignant;
import esprit.microservice1.Service.EnsignatService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@RequestMapping("/ensignat")
public class EnsignatController {

    EnsignatService ensignatService;

    @PostMapping("/addEnsignat")
    public Enseignant addEnsignat(@RequestBody Enseignant e){
    return ensignatService.addEnsignat(e);

}
}
