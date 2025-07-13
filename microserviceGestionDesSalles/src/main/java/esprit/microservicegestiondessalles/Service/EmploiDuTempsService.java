package esprit.microservicegestiondessalles.Service;


import esprit.microservicegestiondessalles.EnseignantClient;
import esprit.microservicegestiondessalles.EnseignantDTO;
import esprit.microservicegestiondessalles.Entity.EmploiDuTemps;
import esprit.microservicegestiondessalles.Repository.EmploiDuTempsRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class EmploiDuTempsService {

    private final EmploiDuTempsRepository emploiDuTempsRepository;
    private final EnseignantClient enseignantClient; // Feign client vers microservice enseignant

    public EmploiDuTemps create(EmploiDuTemps emploiDuTemps) {
        // Vérifier que l'enseignant existe dans le microservice enseignant
        EnseignantDTO enseignant = enseignantClient.getEnseignantById(emploiDuTemps.getEnseignantId());
        if (enseignant == null) {
            throw new RuntimeException("Enseignant introuvable avec id : " + emploiDuTemps.getEnseignantId());
        }

        // Ici tu peux ajouter des vérifications de conflit si tu veux

        // Sauvegarder l'emploi du temps
        return emploiDuTempsRepository.save(emploiDuTemps);
    }

}
