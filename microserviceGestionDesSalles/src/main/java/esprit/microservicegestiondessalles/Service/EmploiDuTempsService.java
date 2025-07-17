package esprit.microservicegestiondessalles.Service;


import esprit.microservicegestiondessalles.*;
import esprit.microservicegestiondessalles.Entity.EmploiDuTemps;
import esprit.microservicegestiondessalles.Repository.EmploiDuTempsRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class EmploiDuTempsService {

    private final EmploiDuTempsRepository emploiDuTempsRepository;
    private final EnseignantClient enseignantClient; // Feign client vers microservice enseignant
private final GroupeClient groupeClient;


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

    public List<EmploiDuTemps> getByEnseignantId(Long enseignantId) {
        return emploiDuTempsRepository.findByEnseignantId(enseignantId);
    }


    public List<EmploiDuTempsDetailDTO> getDetailsByEnseignant(Long enseignantId) {
        List<EmploiDuTemps> emplois = emploiDuTempsRepository.findByEnseignantId(enseignantId);

        return emplois.stream().map(e -> {
            GroupeDTO groupe = groupeClient.getGroupeById(e.getGroupeId());
            return new EmploiDuTempsDetailDTO(e, groupe);
        }).collect(Collectors.toList());
    }


    public List<GroupeDTO> getAllGroupes() {
        return groupeClient.getAllGroupes();
    }
}
