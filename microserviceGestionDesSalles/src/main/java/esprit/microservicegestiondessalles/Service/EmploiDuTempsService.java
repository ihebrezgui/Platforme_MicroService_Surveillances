package esprit.microservicegestiondessalles.Service;


import esprit.microservicegestiondessalles.*;
import esprit.microservicegestiondessalles.Entity.EmploiDuTemps;
import esprit.microservicegestiondessalles.Repository.EmploiDuTempsRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
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



    public List<EmploiDuTemps> getEmploisFiltres(Long enseignantId, Long groupeId, String dateStr) {
        LocalDate date = null;
        if (dateStr != null && !dateStr.isEmpty()) {
            date = LocalDate.parse(dateStr);
        }

        // Variables finales pour la lambda
        final Long finalEnseignantId = enseignantId;
        final Long finalGroupeId = groupeId;
        final LocalDate finalDate = date;

        return emploiDuTempsRepository.findAll().stream()
                .filter(e -> finalEnseignantId == null || e.getEnseignantId().equals(finalEnseignantId))
                .filter(e -> finalGroupeId == null || e.getGroupeId().equals(finalGroupeId))
                .filter(e -> finalDate == null || e.getDate().equals(finalDate))
                .collect(Collectors.toList());
    }
}
