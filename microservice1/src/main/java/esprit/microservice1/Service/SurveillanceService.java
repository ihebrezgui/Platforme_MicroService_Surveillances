package esprit.microservice1.Service;


import esprit.microservice1.Entity.EmploiDuTemps;
import esprit.microservice1.Entity.Enseignant;
import esprit.microservice1.Repository.EmploiDuTempsRepository;
import esprit.microservice1.UserClient;
import esprit.microservice1.UserDTO;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SurveillanceService {

   EmploiDuTempsRepository emploiDuTempsRepository;
    private final UserClient userClient;
    public SurveillanceService(EmploiDuTempsRepository emploiDuTempsRepository , UserClient userClient) {
        this.emploiDuTempsRepository = emploiDuTempsRepository;
        this.userClient = userClient;
    }
    public List<String> getEnseignantsBySalle(String salle) {
        List<EmploiDuTemps> emplois = emploiDuTempsRepository.findBySalle(salle);

        if (emplois == null || emplois.isEmpty()) {
            throw new RuntimeException("Aucun emploi du temps trouvé pour cette salle.");
        }

        List<String> nomsEnseignants = new ArrayList<>();

        for (EmploiDuTemps emploi : emplois) {
            Long enseignantId = emploi.getEnseignantId();
            if (enseignantId != null) {
                try {
                    UserDTO enseignant = userClient.getUserById(enseignantId);
                    if (enseignant != null && enseignant.getUsername() != null) {
                        nomsEnseignants.add(enseignant.getUsername());
                    }
                } catch (Exception e) {
                    // Log ou gestion d'erreur personnalisée
                    System.out.println("Erreur lors de la récupération de l'enseignant avec ID: " + enseignantId);
                }
            }
        }
        if (nomsEnseignants.isEmpty()) {
            throw new RuntimeException("Aucun enseignant trouvé pour cette salle.");
        }

        return nomsEnseignants.stream().distinct().toList();
    }
}
