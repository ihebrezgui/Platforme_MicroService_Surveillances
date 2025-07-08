package esprit.microservice1.Service;



import esprit.microservice1.Entity.EmploiDuTemps;
import esprit.microservice1.Repository.EmploiDuTempsRepository;
import esprit.microservice1.UserClient;
import esprit.microservice1.UserDTO;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class EmploiDuTempsService {

    private final EmploiDuTempsRepository repository;
    private final UserClient userClient;

    public EmploiDuTempsService(EmploiDuTempsRepository repository, UserClient userClient) {
        this.repository = repository;
        this.userClient = userClient;
    }

    /*public EmploiDuTemps createEmploi(EmploiDuTemps emploi) {
        try {
            UserDTO user = userClient.getUserById(emploi.getEnseignantId());

            if (user == null) {
                throw new RuntimeException("Enseignant introuvable dans user-service");
            }

            if (!"ENSEIGNANT".equalsIgnoreCase(user.getRole())) {
                throw new RuntimeException("L'utilisateur n'est pas un enseignant");
            }

        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la vérification de l'enseignant: " + e.getMessage());
        }

        return repository.save(emploi);
    }*/

   /* public EmploiDuTemps createEmploi(EmploiDuTemps emploi) {
        try {
            UserDTO user = userClient.getUserById(emploi.getEnseignantId());
            if (user == null) {
                throw new RuntimeException("Enseignant introuvable dans user-service");
            }

            // Vérifier le rôle
            if (!"ENSEIGNANT".equalsIgnoreCase(user.getRole())) {
                throw new RuntimeException("Seuls les enseignants peuvent avoir un emploi du temps");
            }

            emploi.setEnseignantNom(user.getUsername());

        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la vérification de l'enseignant: " + e.getMessage());
        }

        return repository.save(emploi);
    }*/



    public EmploiDuTemps createEmploi(EmploiDuTemps emploi) {
        try {
            UserDTO user = userClient.getUserByMatricule(emploi.getMatricule());
            if (user == null) {
                throw new RuntimeException("Enseignant introuvable dans user-service");
            }

            if (!"ENSEIGNANT".equalsIgnoreCase(user.getRole())) {
                throw new RuntimeException("Seuls les enseignants peuvent avoir un emploi du temps");
            }

            emploi.setEnseignantId(user.getId());
            emploi.setEnseignantNom(user.getUsername());

        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la vérification de l'enseignant: " + e.getMessage());
        }

        return repository.save(emploi);
    }




    public Optional<EmploiDuTemps> getEmploiById(Long id) {
        return repository.findById(id);
    }

    public List<EmploiDuTemps> getEmploisByEnseignant(Long enseignantId) {
        return repository.findByEnseignantId(enseignantId);
    }

    public List<EmploiDuTemps> getEmploisByJour(LocalDate jour) {
        return repository.findByJour(jour);
    }

    public void deleteEmploi(Long id) {
        repository.deleteById(id);
    }

    public EmploiDuTemps updateEmploi(Long id, EmploiDuTemps updatedEmploi) {
        return repository.findById(id)
                .map(emploi -> {
                    emploi.setJour(updatedEmploi.getJour());
                    emploi.setHeureDebut(updatedEmploi.getHeureDebut());
                    emploi.setHeureFin(updatedEmploi.getHeureFin());
                    emploi.setSalle(updatedEmploi.getSalle());
                    emploi.setMatiere(updatedEmploi.getMatiere());
                    emploi.setGroupe(updatedEmploi.getGroupe());
                    emploi.setTypeCours(updatedEmploi.getTypeCours());
                    emploi.setEnseignantId(updatedEmploi.getEnseignantId());
                    return repository.save(emploi);
                }).orElseThrow(() -> new RuntimeException("EmploiDuTemps non trouvé"));
    }



}
