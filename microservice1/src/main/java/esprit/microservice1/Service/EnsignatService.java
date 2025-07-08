package esprit.microservice1.Service;


import esprit.microservice1.Entity.Enseignant;
import esprit.microservice1.Repository.EnsignatRepository;
import esprit.microservice1.UserClient;
import esprit.microservice1.UserDTO;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service

public class EnsignatService {
    private final EnsignatRepository enseignantRepository;
    private final UserClient userClient;

    public EnsignatService(EnsignatRepository enseignantRepository, UserClient userClient) {
        this.enseignantRepository = enseignantRepository;
        this.userClient = userClient;
    }
    public Enseignant addEnsignat(Enseignant e) {
        if (e.getUserId() == null) {
            throw new IllegalArgumentException("userId est obligatoire");
        }

        try {
            UserDTO user = userClient.getUserById(e.getUserId());

            if (!"enseignant".equalsIgnoreCase(user.getRole())) {
                throw new RuntimeException("Le rôle de l'utilisateur doit être 'enseignant'");
            }

            // Ici : on injecte automatiquement le rôle récupéré dans l'enseignant
            e.setRole(user.getRole());

            // Vérifier matricule si besoin
            if (e.getMatricule() == null || !e.getMatricule().equals(user.getMatricule())) {
                throw new RuntimeException("Matricule incorrect");
            }

        } catch (Exception ex) {
            throw new RuntimeException("Utilisateur introuvable ou erreur: " + ex.getMessage());
        }

        return enseignantRepository.save(e);
    }



}