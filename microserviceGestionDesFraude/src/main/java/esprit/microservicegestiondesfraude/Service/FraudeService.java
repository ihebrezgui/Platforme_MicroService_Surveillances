package esprit.microservicegestiondesfraude.Service;

import esprit.microservicegestiondesfraude.EnseignantClient;
import esprit.microservicegestiondesfraude.EnseignantDTO;
import esprit.microservicegestiondesfraude.Entity.Fraude;
import esprit.microservicegestiondesfraude.Entity.StatutFraude;
import esprit.microservicegestiondesfraude.Repository.FraudeRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@AllArgsConstructor
public class FraudeService {

    private final FraudeRepository fraudeRepository;
    private final EnseignantClient enseignantClient;

    public Fraude signalerFraude(Fraude fraude) {
        // Vérifier enseignant via matricule
        EnseignantDTO enseignantByMatricule = enseignantClient.getEnseignantByMatricule(fraude.getMatricule());
        EnseignantDTO enseignantById = enseignantClient.getEnseignantById(fraude.getEnseignantId());

        if (enseignantByMatricule == null || enseignantById == null) {
            throw new RuntimeException("Matricule ou ID enseignant invalide.");
        }

        // Vérifie la correspondance
        if (!enseignantByMatricule.getId().equals(fraude.getEnseignantId())) {
            throw new RuntimeException("Le matricule et l'ID de l'enseignant ne correspondent pas.");
        }


        fraude.setDateDeclaration(LocalDateTime.now());
        fraude.setStatut(StatutFraude.EN_ATTENTE);

        return fraudeRepository.save(fraude);
    }

    public List<Fraude> getFraudesEnCours() {
        return fraudeRepository.findByStatut(StatutFraude.EN_COURS);
    }

    public List<Fraude> getFraudesParMatricule(String matricule) {
        return fraudeRepository.findByMatricule(matricule);
    }

    public Fraude traiterFraude(Long id, String rapport) {
        Fraude f = fraudeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fraude non trouvée"));

        f.setRapport(rapport);
        f.setStatut(StatutFraude.RESOLUE);

        return fraudeRepository.save(f);
    }

    public void archiverFraude(Long id) {
        Fraude f = fraudeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fraude non trouvée"));
        f.setStatut(StatutFraude.ARCHIVEE);
        fraudeRepository.save(f);
    }
}
