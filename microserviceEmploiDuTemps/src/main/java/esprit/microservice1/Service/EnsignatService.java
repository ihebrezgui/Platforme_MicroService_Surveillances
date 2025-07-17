package esprit.microservice1.Service;

import esprit.microservice1.Entity.Enseignant;
import esprit.microservice1.Entity.EnseignantDTO;
import esprit.microservice1.Entity.MyModule;
import esprit.microservice1.Repository.EnsignatRepository;
import esprit.microservice1.Repository.ModuleRepository;
import esprit.microservice1.UserClient;
import esprit.microservice1.UserDTO;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EnsignatService {

    private final EnsignatRepository enseignantRepository;
    private final UserClient userClient;
    private final ModuleRepository moduleRepository;

    public EnsignatService(EnsignatRepository enseignantRepository, UserClient userClient, ModuleRepository moduleRepository) {
        this.enseignantRepository = enseignantRepository;
        this.userClient = userClient;
        this.moduleRepository = moduleRepository;
    }
    public Enseignant addEnsignat(Enseignant e) {
        if (e.getUserId() == null) {
            throw new IllegalArgumentException("userId est obligatoire");
        }

        // 🔁 Associer le module via moduleId (transmis depuis Angular)
        if (e.getModuleId() != null) {
            MyModule module = moduleRepository.findById(e.getModuleId())
                    .orElseThrow(() -> new RuntimeException("Module non trouvé avec l'ID : " + e.getModuleId()));
            e.setMyModule(module);
        } else {
            throw new RuntimeException("Module obligatoire");
        }

        try {
            UserDTO user = userClient.getUserById(e.getUserId());

            if (!"enseignant".equalsIgnoreCase(user.getRole())) {
                throw new RuntimeException("Le rôle de l'utilisateur doit être 'enseignant'");
            }

            e.setRole(user.getRole());

            if (e.getMatricule() == null || !e.getMatricule().equals(user.getMatricule())) {
                throw new RuntimeException("Matricule incorrect");
            }

        } catch (Exception ex) {
            throw new RuntimeException("Utilisateur introuvable ou erreur: " + ex.getMessage());
        }

        return enseignantRepository.save(e);
    }

    public List<Enseignant> getAllEnseignants() {
        return enseignantRepository.findAll();
    }

    public Optional<Enseignant> getEnseignantById(Long id) {
        return enseignantRepository.findById(id);
    }

    public List<EnseignantDTO> getAllEnseignantsAvecModule() {
        List<Enseignant> enseignants = enseignantRepository.findAll();

        return enseignants.stream().map(e -> {
            EnseignantDTO dto = new EnseignantDTO();
            dto.setId(e.getId());
            dto.setNom(e.getNom());
            dto.setPrenom(e.getPrenom());
            dto.setEmail(e.getEmail());
            dto.setTelephone(e.getTelephone());
            dto.setMatricule(e.getMatricule());
            dto.setRole(e.getRole());

            if (e.getMyModule() != null) {
                dto.setModuleLibelle(e.getMyModule().getLibelleModule());

                if (e.getMyModule().getUnitePedagogique() != null) {
                    dto.setUnitePedagogiqueLibelle(e.getMyModule().getUnitePedagogique().getLibelle());
                } else {
                    dto.setUnitePedagogiqueLibelle("Unité non assignée");
                }
            } else {
                dto.setModuleLibelle("Module non assigné");
                dto.setUnitePedagogiqueLibelle("Unité non assignée");
            }

            return dto;
        }).collect(Collectors.toList());
    }

}